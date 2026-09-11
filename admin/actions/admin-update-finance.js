// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";

/* =========================================================
   DATA
========================================================= */
function parsePaymentDate(
    value
) {
    if (
        typeof value !==
            "string"
        ||
        !/^\d{4}-\d{2}-\d{2}$/.test(
            value
        )
    ) {
        return null;
    }
    const [
        year,
        month,
        day
    ] =
        value
            .split("-")
            .map(Number);
    const date =
        new Date(
            Date.UTC(
                year,
                month - 1,
                day,
                12,
                0,
                0
            )
        );
    if (
        date.getUTCFullYear() !==
            year
        ||
        date.getUTCMonth() !==
            month - 1
        ||
        date.getUTCDate() !==
            day
    ) {
        return null;
    }
    return date;
}
/* =========================================================
   API
========================================================= */
export default async function handler(
    request,
    response
) {
    if (
        request.method !==
            "POST"
    ) {
        return response
            .status(405)
            .json({
                error:
                    "Método não permitido."
            });
    }
    try {
        const actor = demoActor;
const actorUid = actor.uid;
const teamUser = actor;
const actorEmail = actor.email;
/* =================================================
           DADOS
        ================================================= */
        const {
            contactId,
            contractValueCents,
            billingType,
            paymentDueDate,
            recurringDay
        } =
            request.body || {};
        if (
            typeof contactId !==
                "string"
            ||
            !contactId.trim()
        ) {
            return response
                .status(400)
                .json({
                    error:
                        "Contato inválido."
                });
        }
        const cleanContactId =
            contactId.trim();
        if (
            !Number.isSafeInteger(
                contractValueCents
            )
            ||
            contractValueCents <= 0
        ) {
            return response
                .status(400)
                .json({
                    error:
                        "Valor do contrato inválido."
                });
        }
        const allowedBillingTypes =
            new Set([
                "monthly",
                "one_time"
            ]);
        if (
            !allowedBillingTypes.has(
                billingType
            )
        ) {
            return response
                .status(400)
                .json({
                    error:
                        "Tipo de cobrança inválido."
                });
        }
        const parsedPaymentDate =
            parsePaymentDate(
                paymentDueDate
            );
        if (
            !parsedPaymentDate
        ) {
            return response
                .status(400)
                .json({
                    error:
                        "Data de pagamento inválida."
                });
        }
        let cleanRecurringDay =
            null;
        if (
            billingType ===
                "monthly"
        ) {
            const numericRecurringDay =
                Number(
                    recurringDay
                );
            if (
                !Number.isInteger(
                    numericRecurringDay
                )
                ||
                numericRecurringDay < 1
                ||
                numericRecurringDay > 31
            ) {
                return response
                    .status(400)
                    .json({
                        error:
                            "Dia recorrente inválido."
                    });
            }
            cleanRecurringDay =
                numericRecurringDay;
        }
        /* =================================================
           REFERÊNCIAS
        ================================================= */
        const financeReference =
            db
                .collection(
                    "finance_records"
                )
                .doc(
                    cleanContactId
                );
        const auditReference =
            db
                .collection(
                    "audit_logs"
                )
                .doc();
        /* =================================================
           TRANSAÇÃO
        ================================================= */
        await db.runTransaction(
            async function (
                transaction
            ) {
                const financeSnapshot =
                    await transaction.get(
                        financeReference
                    );
                if (
                    !financeSnapshot.exists
                ) {
                    const error =
                        new Error(
                            "Registro financeiro não encontrado."
                        );
                    error.statusCode =
                        404;
                    throw error;
                }
                const currentFinance =
                    financeSnapshot.data();
                /* =================================================
                   CONVERSÃO DE PONTUAL PAGO PARA MENSAL
                ================================================= */
                const extraFinanceUpdates = {};
                const paidOneTimeToMonthly =
                    currentFinance.billingType === "one_time"
                    &&
                    currentFinance.paymentStatus === "paid"
                    &&
                    billingType === "monthly";
                if (paidOneTimeToMonthly) {
                    const settledDue =
                        currentFinance.nextPaymentDueAt;
                    const settledDate =
                        settledDue &&
                        typeof settledDue.toDate === "function"
                            ? settledDue.toDate()
                            : settledDue instanceof Date
                                ? settledDue
                                : null;
                    /*
                       A nova cobrança deve vencer depois
                       da cobrança que já foi paga.
                    */
                    if (
                        !settledDate
                        ||
                        parsedPaymentDate.getTime() <=
                            settledDate.getTime()
                    ) {
                        throw Object.assign(
                            new Error(
                                "Para converter um contrato pontual pago em mensal, informe um vencimento posterior à cobrança já paga."
                            ),
                            {
                                statusCode: 409
                            }
                        );
                    }
                    /*
                       Confere se o novo vencimento já
                       possui um pagamento registrado.
                    */
                    const nextCycleKey =
                        parsedPaymentDate
                            .toISOString()
                            .slice(0, 10);
                    const nextPaymentReference =
                        db
                            .collection("finance_payments")
                            .doc(
                                `${cleanContactId}_${nextCycleKey}`
                            );
                    const existingNextPayment =
                        await transaction.get(
                            nextPaymentReference
                        );
                    if (existingNextPayment.exists) {
                        throw Object.assign(
                            new Error(
                                "O vencimento escolhido já possui pagamento registrado. Escolha a próxima competência em aberto."
                            ),
                            {
                                statusCode: 409
                            }
                        );
                    }
                    /*
                       Prepara a nova cobrança e preserva
                       as informações do último pagamento.
                    */
                    extraFinanceUpdates.paymentStatus =
                        "pending";
                    extraFinanceUpdates.paidAt =
                        null;
                    extraFinanceUpdates.lastPaidAt =
                        currentFinance.lastPaidAt ||
                        currentFinance.paidAt ||
                        null;
                    extraFinanceUpdates.lastPaidDueAt =
                        currentFinance.lastPaidDueAt ||
                        currentFinance.nextPaymentDueAt;
                }
                /* =================================================
                   ALTERAÇÕES PARA A AUDITORIA
                ================================================= */
                const changes = {};
                if (paidOneTimeToMonthly) {
                    changes.paymentStatus = {
                        from: "paid",
                        to: "pending"
                    };
                }
                if (
                    currentFinance.contractValueCents !==
                        contractValueCents
                ) {
                    changes.contractValueCents = {
                        from:
                            currentFinance.contractValueCents ??
                            null,
                        to:
                            contractValueCents
                    };
                }
                if (
                    currentFinance.billingType !==
                        billingType
                ) {
                    changes.billingType = {
                        from:
                            currentFinance.billingType ||
                            null,
                        to:
                            billingType
                    };
                }
                const currentDueDate =
                    currentFinance.nextPaymentDueAt
                    &&
                    typeof currentFinance
                        .nextPaymentDueAt
                        .toDate ===
                        "function"
                        ? currentFinance
                            .nextPaymentDueAt
                            .toDate()
                        : null;
                const currentDueDateKey =
                    currentDueDate
                        ? currentDueDate
                            .toISOString()
                            .slice(
                                0,
                                10
                            )
                        : null;
                const newDueDateKey =
                    parsedPaymentDate
                        .toISOString()
                        .slice(
                            0,
                            10
                        );
                if (
                    currentDueDateKey !==
                        newDueDateKey
                ) {
                    changes.nextPaymentDueAt = {
                        from:
                            currentDueDateKey,
                        to:
                            newDueDateKey
                    };
                }
                const currentRecurringDay =
                    currentFinance.recurringDay ??
                    null;
                if (
                    currentRecurringDay !==
                        cleanRecurringDay
                ) {
                    changes.recurringDay = {
                        from:
                            currentRecurringDay,
                        to:
                            cleanRecurringDay
                    };
                }
                /*
                   Se nada mudou, não cria
                   auditoria desnecessária.
                */
                if (
                    Object.keys(
                        changes
                    ).length === 0
                ) {
                    return;
                }
                transaction.update(
                    financeReference,
                    {
                        ...extraFinanceUpdates,
                        contractValueCents:
                            contractValueCents,
                        billingType:
                            billingType,
                        nextPaymentDueAt:
                            parsedPaymentDate,
                        recurringDay:
                            cleanRecurringDay,
                        updatedAt:
                            Clock.now()
                    }
                );
                transaction.set(
                    auditReference,
                    {
                        actorUid:
                            actorUid,
                        actorEmail:
                            actorEmail,
                        actorRole:
                            teamUser.role,
                        contactId:
                            cleanContactId,
                        contactName:
                            currentFinance.contactName ||
                            "",
                        contactCompany:
                            currentFinance.contactCompany ||
                            "",
                        action:
                            "finance_updated",
                        changes:
                            changes,
                        createdAt:
                            Clock
                                .now()
                    }
                );
            }
        );
        return response
            .status(200)
            .json({
                success:
                    true,
                contactId:
                    cleanContactId
            });
    }
    catch (error) {
        console.error(
            "Erro ao editar financeiro:",
            error
        );
        if (
            error.statusCode
        ) {
            return response
                .status(
                    error.statusCode
                )
                .json({
                    error:
                        error.message
                });
        }
        return response
            .status(500)
            .json({
                error:
                    "Não foi possível editar os dados financeiros."
            });
    }
}