// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";

/* =========================================================
   ERROS HTTP
========================================================= */
function createHttpError(
    statusCode,
    message
) {
    const error =
        new Error(
            message
        );
    error.statusCode =
        statusCode;
    return error;
}
/* =========================================================
   DATAS
========================================================= */
function localDateToDate(
    value
) {
    if (
        !value
    ) {
        return null;
    }
    if (
        typeof value.toDate ===
            "function"
    ) {
        return value.toDate();
    }
    if (
        value instanceof Date
    ) {
        return value;
    }
    return null;
}
function dateToKey(
    date
) {
    const year =
        date.getUTCFullYear();
    const month =
        String(
            date.getUTCMonth() + 1
        )
            .padStart(
                2,
                "0"
            );
    const day =
        String(
            date.getUTCDate()
        )
            .padStart(
                2,
                "0"
            );
    return `${year}-${month}-${day}`;
}
/*
   Calcula o próximo vencimento mensal.
   Exemplo:
   recorrência dia 31
   31/01 → 28/02
   28/02 → 31/03
   O recurringDay continua sendo 31.
*/
function calculateNextMonthlyDueDate(
    currentDueDate,
    recurringDay
) {
    let year =
        currentDueDate
            .getUTCFullYear();
    let month =
        currentDueDate
            .getUTCMonth() + 1;
    if (
        month > 11
    ) {
        month =
            0;
        year += 1;
    }
    const lastDayOfTargetMonth =
        new Date(
            Date.UTC(
                year,
                month + 1,
                0,
                12,
                0,
                0
            )
        )
            .getUTCDate();
    const targetDay =
        Math.min(
            recurringDay,
            lastDayOfTargetMonth
        );
    return new Date(
        Date.UTC(
            year,
            month,
            targetDay,
            12,
            0,
            0
        )
    );
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
           DADOS RECEBIDOS
        ================================================= */
        const {
            contactId,
            cycleKey,
            expectedAmountCents,
            expectedBillingType
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
        /* =================================================
           VALIDA A COBRANÇA SELECIONADA
        ================================================= */
        if (
            typeof cycleKey !== "string"
            ||
            !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(
                cycleKey
            )
            ||
            !Number.isSafeInteger(
                expectedAmountCents
            )
            ||
            expectedAmountCents <= 0
            ||
            ![
                "monthly",
                "one_time"
            ].includes(
                expectedBillingType
            )
        ) {
            return response
                .status(400)
                .json({
                    error:
                        "Reabra a confirmação para selecionar a cobrança atual."
                });
        }
        /* =================================================
           REFERÊNCIA DO CONTRATO
        ================================================= */
        const financeReference =
            db
                .collection(
                    "finance_records"
                )
                .doc(
                    cleanContactId
                );
        /*
           Informações que serão devolvidas
           somente depois da transação.
        */
        let transactionResult = {
            alreadyPaid:
                false,
            billingType:
                null,
            paymentId:
                null,
            nextPaymentDueDate:
                null
        };
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
                    throw createHttpError(
                        404,
                        "Registro financeiro não encontrado."
                    );
                }
                const currentFinance =
                    financeSnapshot.data();
                const billingType =
                    currentFinance.billingType;
                if (
                    billingType !==
                        "monthly"
                    &&
                    billingType !==
                        "one_time"
                ) {
                    throw createHttpError(
                        409,
                        "Tipo de cobrança inválido neste contrato."
                    );
                }
                const contractValueCents =
                    currentFinance
                        .contractValueCents;
                if (
                    !Number.isSafeInteger(
                        contractValueCents
                    )
                    ||
                    contractValueCents <= 0
                ) {
                    throw createHttpError(
                        409,
                        "O contrato possui um valor financeiro inválido."
                    );
                }
                const dueDate =
                    localDateToDate(
                        currentFinance
                            .nextPaymentDueAt
                    );
                if (
                    !dueDate
                ) {
                    throw createHttpError(
                        409,
                        "O contrato não possui um vencimento válido."
                    );
                }
                const dueDateKey =
                    dateToKey(
                        dueDate
                    );
                /*
                   Um ID determinístico impede que a
                   mesma competência seja registrada
                   duas vezes.
                   Exemplo:
                   contatoABC_2026-09-10
                */
                const paymentId =
                    `${cleanContactId}_${cycleKey}`;
                const paymentReference =
                    db
                        .collection(
                            "finance_payments"
                        )
                        .doc(
                            paymentId
                        );
                const paymentSnapshot =
                    await transaction.get(
                        paymentReference
                    );
                /*
                   Se essa competência já existe
                   no histórico, não cria outra.
                */
                if (
                    paymentSnapshot.exists
                ) {
                    const previousPayment =
                        paymentSnapshot.data();
                    if (
                        previousPayment.amountCents !==
                            expectedAmountCents
                        ||
                        previousPayment.billingType !==
                            expectedBillingType
                        ||
                        previousPayment.status !==
                            "paid"
                    ) {
                        throw createHttpError(
                            409,
                            "Esta competência já possui um registro diferente. Atualize o histórico."
                        );
                    }
                    transactionResult = {
                        alreadyPaid:
                            true,
                        billingType:
                            billingType,
                        paymentId:
                            paymentId,
                        nextPaymentDueDate:
                            billingType === "monthly"
                                ? dateToKey(
                                    dueDate
                                )
                                : null
                    };
                    return;
                }
            /* =================================================
               CONFERE SE A COBRANÇA CONTINUA IGUAL
            ================================================= */
            if (
                dueDateKey !== cycleKey
                ||
                billingType !== expectedBillingType
                ||
                contractValueCents !== expectedAmountCents
            ) {
                throw createHttpError(
                    409,
                    "A cobrança foi alterada. Feche e reabra a confirmação antes de registrar o pagamento."
                );
            }
                /*
                   Pagamento único realmente termina
                   depois que foi pago.
                */
                if (
                    billingType ===
                        "one_time"
                    &&
                    currentFinance.paymentStatus ===
                        "paid"
                ) {
                    transactionResult = {
                        alreadyPaid:
                            true,
                        billingType:
                            "one_time",
                        paymentId:
                            null,
                        nextPaymentDueDate:
                            null
                    };
                    return;
                }
                /*
                   Mensalidades antigas podem estar
                   como "paid" por causa da primeira
                   versão do sistema.
                   Nesse caso, preservamos o paidAt
                   antigo ao transformar essa cobrança
                   em histórico.
                */
                const isLegacyMonthlyPayment =
                    billingType ===
                        "monthly"
                    &&
                    currentFinance.paymentStatus ===
                        "paid";
                const previousPaidAt =
                    currentFinance.paidAt ||
                    null;
                const paymentPaidAt =
                    isLegacyMonthlyPayment
                    &&
                    previousPaidAt
                        ? previousPaidAt
                        : Clock
                            .now();
                /* =================================================
                   PAGAMENTO HISTÓRICO
                ================================================= */
                const paymentData = {
                    financeId:
                        cleanContactId,
                    contactId:
                        cleanContactId,
                    contactName:
                        currentFinance.contactName ||
                        "",
                    contactCompany:
                        currentFinance.contactCompany ||
                        "",
                    service:
                        currentFinance.service ||
                        "",
                    amountCents:
                        contractValueCents,
                    billingType:
                        billingType,
                    cycleKey:
                        dueDateKey,
                    dueAt:
                        dueDate,
                    status:
                        "paid",
                    paidAt:
                        paymentPaidAt,
                    source:
                        "manual",
                    provider:
                        "manual",
                    providerPaymentId:
                        null,
                    recordedByUid:
                        actorUid,
                    recordedByEmail:
                        actorEmail,
                    recordedByRole:
                        teamUser.role,
                    createdAt:
                        Clock
                            .now(),
                    updatedAt:
                        Clock
                            .now()
                };
                /* =================================================
                   PRÓXIMA COBRANÇA
                ================================================= */
                let nextDueDate =
                    null;
                if (
                    billingType ===
                        "monthly"
                ) {
                    const recurringDay =
                        Number(
                            currentFinance
                                .recurringDay
                        );
                    if (
                        !Number.isInteger(
                            recurringDay
                        )
                        ||
                        recurringDay < 1
                        ||
                        recurringDay > 31
                    ) {
                        throw createHttpError(
                            409,
                            "O contrato mensal possui um dia recorrente inválido."
                        );
                    }
                    nextDueDate =
                        calculateNextMonthlyDueDate(
                            dueDate,
                            recurringDay
                        );
                }
                /* =================================================
                   AUDITORIA
                ================================================= */
                const auditReference =
                    db
                        .collection(
                            "audit_logs"
                        )
                        .doc();
                const auditChanges = {
                    paymentStatus: {
                        from:
                            currentFinance.paymentStatus ||
                            "pending",
                        to:
                            "paid"
                    },
                    paymentConfirmation: {
                        source:
                            "manual"
                    },
                    paymentCycle: {
                        cycleKey:
                            dueDateKey,
                        amountCents:
                            contractValueCents,
                        dueAt:
                            dueDateKey,
                        nextDueAt:
                            nextDueDate
                                ? dateToKey(
                                    nextDueDate
                                )
                                : null
                    }
                };
                const auditData = {
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
                        "payment_marked_paid",
                    changes:
                        auditChanges,
                    createdAt:
                        Clock
                            .now()
                };
                /* =================================================
                   GRAVA PAGAMENTO
                ================================================= */
                transaction.set(
                    paymentReference,
                    paymentData
                );
                /* =================================================
                   ATUALIZA CONTRATO
                ================================================= */
                if (
                    billingType ===
                        "monthly"
                ) {
                    /*
                       A mensalidade atual foi paga,
                       mas o contrato já possui uma
                       próxima cobrança.
                       Portanto o status financeiro
                       volta para pending apontando
                       para a próxima competência.
                    */
                    transaction.update(
                        financeReference,
                        {
                            paymentStatus:
                                "pending",
                            paidAt:
                                null,
                            lastPaidAt:
                                paymentPaidAt,
                            lastPaidDueAt:
                                dueDate,
                            nextPaymentDueAt:
                                nextDueDate,
                            paymentConfirmationSource:
                                "manual",
                            paidByUid:
                                actorUid,
                            paidByEmail:
                                actorEmail,
                            paidByRole:
                                teamUser.role,
                            updatedAt:
                                Clock
                                    .now()
                        }
                    );
                }
                else {
                    /*
                       Pagamento único.
                    */
                    transaction.update(
                        financeReference,
                        {
                            paymentStatus:
                                "paid",
                            paidAt:
                                paymentPaidAt,
                            lastPaidAt:
                                paymentPaidAt,
                            lastPaidDueAt:
                                dueDate,
                            paymentConfirmationSource:
                                "manual",
                            paidByUid:
                                actorUid,
                            paidByEmail:
                                actorEmail,
                            paidByRole:
                                teamUser.role,
                            updatedAt:
                                Clock
                                    .now()
                        }
                    );
                }
                /* =================================================
                   AUDITORIA
                ================================================= */
                transaction.set(
                    auditReference,
                    auditData
                );
                transactionResult = {
                    alreadyPaid:
                        false,
                    billingType:
                        billingType,
                    paymentId:
                        paymentId,
                    nextPaymentDueDate:
                        nextDueDate
                            ? dateToKey(
                                nextDueDate
                            )
                            : null
                };
            }
        );
        return response
            .status(200)
            .json({
                success:
                    true,
                contactId:
                    cleanContactId,
                alreadyPaid:
                    transactionResult
                        .alreadyPaid,
                billingType:
                    transactionResult
                        .billingType,
                paymentId:
                    transactionResult
                        .paymentId,
                nextPaymentDueDate:
                    transactionResult
                        .nextPaymentDueDate
            });
    }
    catch (error) {
        console.error(
            "Erro ao registrar pagamento:",
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
                    "Não foi possível registrar o pagamento."
            });
    }
}