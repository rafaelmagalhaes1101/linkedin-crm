// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";

/* =========================================================
   DATA DE PAGAMENTO
========================================================= */
function parsePaymentDate(
    value
) {
    if (
        typeof value !== "string"
        ||
        !/^\d{4}-\d{2}-\d{2}$/.test(
            value
        )
    ) {
        return null;
    }
    const parts =
        value
            .split("-")
            .map(Number);
    const year =
        parts[0];
    const month =
        parts[1];
    const day =
        parts[2];
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
    /*
       Impede datas impossíveis como:
       31/02/2026.
    */
    if (
        date.getUTCFullYear() !== year
        ||
        date.getUTCMonth() !==
            month - 1
        ||
        date.getUTCDate() !== day
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
/* =================================================
           DADOS RECEBIDOS
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
        /*
           O valor sempre chega em centavos.
           Exemplo:
           R$ 1.500,00 → 150000
        */
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
        /* =================================================
           RECORRÊNCIA
        ================================================= */
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
           CONTATO
        ================================================= */
        const contactReference =
            db
                .collection(
                    "contacts"
                )
                .doc(
                    contactId
                );
        const financeReference =
            db
                .collection(
                    "finance_records"
                )
                .doc(
                    contactId
                );
            /* =================================================
               FECHAMENTO EM TRANSAÇÃO
            ================================================= */
            await db.runTransaction(
                async function (transaction) {
                    /* -----------------------------------------
                       LEITURA DOS DADOS ATUAIS
                    ----------------------------------------- */
                    const contactSnapshot =
                        await transaction.get(
                            contactReference
                        );
                    const financeSnapshot =
                        await transaction.get(
                            financeReference
                        );
                    if (!contactSnapshot.exists) {
                        throw Object.assign(
                            new Error(
                                "Contato não encontrado."
                            ),
                            {
                                statusCode: 404
                            }
                        );
                    }
                    const currentContact =
                        contactSnapshot.data();
                    if (currentContact.archived === true) {
                        throw Object.assign(
                            new Error(
                                "Restaure o contato antes de fechar a venda."
                            ),
                            {
                                statusCode: 409
                            }
                        );
                    }
                    if (financeSnapshot.exists) {
                        throw Object.assign(
                            new Error(
                                "Este contato já possui um registro financeiro."
                            ),
                            {
                                statusCode: 409
                            }
                        );
                    }
                    if (currentContact.status === "fechado") {
                        throw Object.assign(
                            new Error(
                                "Este contato já está fechado."
                            ),
                            {
                                statusCode: 409
                            }
                        );
                    }
                    /* -----------------------------------------
                       RESPONSÁVEL PELO FECHAMENTO
                    ----------------------------------------- */
                    const actorEmail =
                        actor.email ||
                        teamUser.email ||
                        "";
                    /* -----------------------------------------
                       REGISTRO FINANCEIRO
                    ----------------------------------------- */
                    const financeData = {
                        contactId: contactId,
                        contactName:
                            currentContact.name || "",
                        contactCompany:
                            currentContact.company || "",
                        service:
                            currentContact.service || "",
                        contractValueCents:
                            contractValueCents,
                        billingType:
                            billingType,
                        closedAt:
                            Clock.now(),
                        nextPaymentDueAt:
                            parsedPaymentDate,
                        recurringDay:
                            cleanRecurringDay,
                        paymentStatus:
                            "pending",
                        paidAt:
                            null,
                        closedByUid:
                            actorUid,
                        closedByEmail:
                            actorEmail,
                        closedByRole:
                            teamUser.role,
                        createdAt:
                            Clock.now(),
                        updatedAt:
                            Clock.now()
                    };
                    /* -----------------------------------------
                       AUDITORIA
                    ----------------------------------------- */
                    const auditReference =
                        db
                            .collection("audit_logs")
                            .doc();
                    const oldStatus =
                        currentContact.status || "novo";
                    const auditData = {
                        actorUid: actorUid,
                        actorEmail: actorEmail,
                        actorRole: teamUser.role,
                        contactId: contactId,
                        contactName:
                            currentContact.name || "",
                        contactCompany:
                            currentContact.company || "",
                        action:
                            "contact_closed",
                        changes: {
                            status: {
                                from: oldStatus,
                                to: "fechado"
                            },
                            financialClosing: {
                                created: true
                            }
                        },
                        createdAt:
                            Clock.now()
                    };
                    /* -----------------------------------------
                       GRAVAÇÃO CONJUNTA
                    ----------------------------------------- */
                    transaction.update(
                        contactReference,
                        {
                            status: "fechado",
                            lossReason: null,
                            lostAt: null,
                            nextContactAt: null,
                            updatedAt:
                                Clock.now()
                        }
                    );
                    transaction.set(
                        financeReference,
                        financeData
                    );
                    transaction.set(
                        auditReference,
                        auditData
                    );
                    /* =================================================
                       ATIVIDADE RECENTE — VENDA FECHADA
                    ================================================= */
                    const activityReference =
                        db
                            .collection("activity_feed")
                            .doc();
                    const activityData = {
                        type:
                            "sale_closed",
                        contactId:
                            contactId,
                        contactName:
                            currentContact.name || "",
                        contactCompany:
                            currentContact.company || "",
                        service:
                            currentContact.service || "",
                        origin:
                            currentContact.origin ||
                            (
                                currentContact.source === "site"
                                    ? "site"
                                    : "nao_informado"
                            ),
                        fromStatus:
                            oldStatus,
                        toStatus:
                            "fechado",
                        fromNextContactAt:
                            currentContact.nextContactAt || null,
                        toNextContactAt:
                            null,
                        actorUid:
                            actorUid,
                        actorEmail:
                            actorEmail,
                        actorRole:
                            teamUser.role,
                        createdAt:
                            Clock.now()
                    };
                    transaction.set(
                        activityReference,
                        activityData
                    );
                }
            );
        return response
            .status(200)
            .json({
                success:
                    true,
                contactId:
                    contactId
            });
    }
    catch (error) {
        if (
            error.statusCode === 404 ||
            error.statusCode === 409
        ) {
            return response
                .status(error.statusCode)
                .json({
                    error: error.message
                });
        }
        console.error(
            "Erro ao fechar venda:",
            error
        );
        return response
            .status(500)
            .json({
                error:
                    "Não foi possível concluir o fechamento."
            });
    }
}