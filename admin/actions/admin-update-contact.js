// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";

/* =========================================================
   AUXILIAR DE DATA
========================================================= */
function dateToMilliseconds(value) {
    if (!value) {
        return null;
    }
    if (
        typeof value.toMillis ===
        "function"
    ) {
        return value.toMillis();
    }
    if (
        typeof value.toDate ===
        "function"
    ) {
        return value
            .toDate()
            .getTime();
    }
    if (
        value instanceof Date
    ) {
        return value.getTime();
    }
    return null;
}
/* =========================================================
   ORIGEM E TAGS
========================================================= */
const allowedOrigins =
    new Set([
        "site",
        "instagram",
        "whatsapp",
        "indicacao",
        "prospeccao",
        "evento",
        "google",
        "outro",
        "nao_informado"
    ]);
function normalizeOrigin(
    value,
    fallback = "nao_informado"
) {
    if (
        value === undefined
    ) {
        return fallback;
    }
    if (
        value === null ||
        value === ""
    ) {
        return "nao_informado";
    }
    if (
        typeof value !== "string"
    ) {
        return null;
    }
    const clean =
        value
            .trim()
            .toLowerCase();
    return allowedOrigins.has(clean)
        ? clean
        : null;
}
function normalizeTags(
    value,
    fallback = []
) {
    if (
        value === undefined
    ) {
        return [...fallback];
    }
    if (
        value === null
    ) {
        return [];
    }
    if (
        !Array.isArray(value) ||
        value.length > 12
    ) {
        return null;
    }
    const normalizedTags = [];
    const seenTags =
        new Set();
    for (
        const item
        of value
    ) {
        if (
            typeof item !== "string"
        ) {
            return null;
        }
        const clean =
            item.trim();
        if (!clean) {
            continue;
        }
        if (
            clean.length > 40
        ) {
            return null;
        }
        const key =
            clean.toLowerCase();
        if (
            seenTags.has(key)
        ) {
            continue;
        }
        seenTags.add(key);
        normalizedTags.push(clean);
    }
    return normalizedTags;
}
function sameTags(
    first,
    second
) {
    if (
        first.length !==
        second.length
    ) {
        return false;
    }
    return first.every(
        function (
            value,
            index
        ) {
            return (
                value ===
                second[index]
            );
        }
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
        request.method !== "POST"
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
            status,
            notes,
            nextContactAt,
            lossReason,
            origin,
            tags
        } =
            request.body || {};
        if (
            !contactId ||
            typeof contactId !==
                "string"
        ) {
            return response
                .status(400)
                .json({
                    error:
                        "Contato inválido."
                });
        }
       /*
           FECHAMENTO possui fluxo financeiro próprio.
        */
        if (
            status ===
                "fechado"
        ) {
            return response
                .status(409)
                .json({
                    error:
                        "Use o fluxo de fechamento financeiro para fechar este lead."
                });
        }
        const allowedStatuses = [
            "novo",
            "em_contato",
            "follow_up",
            "proposta",
            "aguardando_cliente",
            "perdido"
        ];
        if (
            !allowedStatuses.includes(
                status
            )
        ) {
            return response
                .status(400)
                .json({
                    error:
                        "Status inválido."
                });
        }
        if (
            typeof notes !==
                "string" ||
            notes.length > 3000
        ) {
            return response
                .status(400)
                .json({
                    error:
                        "Observações inválidas."
                });
        }
        const cleanNotes =
            notes.trim();
        /* =================================================
           MOTIVO DA PERDA
        ================================================= */
        const allowedLossReasons = [
            "preco",
            "concorrente",
            "sem_retorno",
            "sem_fit",
            "projeto_adiado",
            "desqualificado",
            "outro"
        ];
        let cleanLossReason =
            null;
        if (
            status ===
                "perdido"
        ) {
            if (
                typeof lossReason !==
                    "string"
                ||
                !allowedLossReasons.includes(
                    lossReason
                )
            ) {
                return response
                    .status(400)
                    .json({
                        error:
                            "Motivo da perda inválido."
                    });
            }
            cleanLossReason =
                lossReason;
        }
        /* =================================================
           FOLLOW-UP
        ================================================= */
        let parsedNextContact =
            null;
        if (nextContactAt) {
            const date =
                new Date(
                    nextContactAt
                );
            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return response
                    .status(400)
                    .json({
                        error:
                            "Data de próximo contato inválida."
                    });
            }
            parsedNextContact =
                date;
        }
        /* =================================================
           LEAD ATUAL
        ================================================= */
        const contactReference =
            db
                .collection(
                    "contacts"
                )
                .doc(
                    contactId
                );
       const changed =
            await db.runTransaction(
                async function (transaction) {
                    const contactSnapshot =
                        await transaction.get(
                            contactReference
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
                    if (
                        currentContact.status ===
                            "fechado"
                    ) {
                        throw Object.assign(
                            new Error(
                                "Este contato já foi fechado. Atualize a lista antes de continuar."
                            ),
                            {
                                statusCode: 409
                            }
                        );
                    }
        /* =========================================================
           ORIGEM E TAGS
        ========================================================= */
        const rawCurrentOrigin =
            typeof currentContact.origin === "string"
                ? currentContact.origin
                    .trim()
                    .toLowerCase()
                : "";
        const currentOrigin =
            allowedOrigins.has(
                rawCurrentOrigin
            )
                ? rawCurrentOrigin
                : (
                    currentContact.source === "site"
                        ? "site"
                        : "nao_informado"
                );
        const currentTags =
            normalizeTags(
                currentContact.tags,
                []
            ) || [];
        const cleanOrigin =
            normalizeOrigin(
                origin,
                currentOrigin
            );
        const cleanTags =
            normalizeTags(
                tags,
                currentTags
            );
        if (
            cleanOrigin === null ||
            cleanTags === null
        ) {
            throw Object.assign(
                new Error(
                    "Origem ou tags inválidas."
                ),
                {
                    statusCode: 400
                }
            );
        }
        /* =================================================
           DESCOBRE O QUE MUDOU
        ================================================= */
        const changes = {};
        /*
           STATUS
        */
        const oldStatus =
            currentContact.status ||
            "novo";
        if (
            oldStatus !==
            status
        ) {
            changes.status = {
                from:
                    oldStatus,
                to:
                    status
            };
        }
        /*
           OBSERVAÇÕES
           Não armazenamos o conteúdo
           das observações na auditoria.
        */
        const oldNotes =
            String(
                currentContact.notes ||
                ""
            ).trim();
        if (
            oldNotes !==
            cleanNotes
        ) {
            changes.notes = {
                changed:
                    true
            };
        }
                /*
                   ORIGEM
                */
                if (
                    currentOrigin !==
                    cleanOrigin
                ) {
                    changes.origin = {
                        from:
                            currentOrigin,
                        to:
                            cleanOrigin
                    };
                }
                /*
                   TAGS
                */
                if (
                    !sameTags(
                        currentTags,
                        cleanTags
                    )
                ) {
                    changes.tags = {
                        from:
                            currentTags,
                        to:
                            cleanTags
                    };
                }
            /*
               MOTIVO DA PERDA
            */
            const oldLossReason =
                currentContact.lossReason ||
                null;
            if (
                oldLossReason !==
                cleanLossReason
            ) {
                changes.lossReason = {
                    from:
                        oldLossReason,
                    to:
                        cleanLossReason
                };
            }
        /*
           PRÓXIMO CONTATO
        */
        const oldNextContact =
            dateToMilliseconds(
                currentContact.nextContactAt
            );
        const newNextContact =
            parsedNextContact
                ? parsedNextContact
                    .getTime()
                : null;
        if (
            oldNextContact !==
            newNextContact
        ) {
            changes.nextContactAt = {
                from:
                    oldNextContact
                        ? new Date(
                            oldNextContact
                        )
                        : null,
                to:
                    parsedNextContact
            };
        }
        /* =================================================
           NADA FOI ALTERADO
        ================================================= */
        if (
            Object.keys(
                changes
            ).length === 0
        ) {
            return false;
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
        const actorEmail =
            actor.email ||
            teamUser.email ||
            "";
        const auditData = {
            actorUid:
                actorUid,
            actorEmail:
                actorEmail,
            actorRole:
                teamUser.role,
            contactId:
                contactId,
            contactName:
                currentContact.name ||
                "",
            contactCompany:
                currentContact.company ||
                "",
            action:
                "contact_updated",
            changes:
                changes,
            createdAt:
                Clock
                    .now()
        };
        /* =================================================
           ATIVIDADE RECENTE
        ================================================= */
        const activityItems =
            [];
        /*
           STATUS
           "fechado" não é registrado aqui porque
           o fechamento verdadeiro passa pela API
           específica de fechamento e será tratado
           como sale_closed posteriormente.
        */
        if (
            changes.status
            &&
            status !==
                "fechado"
            &&
            status !==
                "arquivado"
        ) {
            activityItems.push({
                type:
                    "status_changed",
                contactId:
                    contactId,
                contactName:
                    currentContact.name ||
                    "",
                contactCompany:
                    currentContact.company ||
                    "",
                service:
                    currentContact.service ||
                    "",
               origin:
                    cleanOrigin,
                fromStatus:
                    changes.status.from,
                toStatus:
                    changes.status.to,
                fromNextContactAt:
                    null,
                toNextContactAt:
                    null,
                actorUid:
                    actorUid,
                actorEmail:
                    actorEmail,
                actorRole:
                    teamUser.role,
                createdAt:
                    Clock
                        .now()
            });
        }
        /*
           FOLLOW-UP
        */
        if (
            changes.nextContactAt
        ) {
            let followupType =
                null;
            /*
               Não existia data e passou
               a existir.
            */
            if (
                oldNextContact ===
                    null
                &&
                newNextContact !==
                    null
            ) {
                followupType =
                    "followup_scheduled";
            }
            /*
               Já existia e foi alterada.
            */
            else if (
                oldNextContact !==
                    null
                &&
                newNextContact !==
                    null
            ) {
                followupType =
                    "followup_rescheduled";
            }
            /*
               Existia e foi removida.
            */
            else if (
                oldNextContact !==
                    null
                &&
                newNextContact ===
                    null
            ) {
                followupType =
                    "followup_removed";
            }
            if (
                followupType
            ) {
                activityItems.push({
                    type:
                        followupType,
                    contactId:
                        contactId,
                    contactName:
                        currentContact.name ||
                        "",
                    contactCompany:
                        currentContact.company ||
                        "",
                    service:
                        currentContact.service ||
                        "",
                   origin:
                        cleanOrigin,
                    fromStatus:
                        null,
                    toStatus:
                        null,
                    fromNextContactAt:
                        changes
                            .nextContactAt
                            .from,
                    toNextContactAt:
                        changes
                            .nextContactAt
                            .to,
                    actorUid:
                        actorUid,
                    actorEmail:
                        actorEmail,
                    actorRole:
                        teamUser.role,
                    createdAt:
                        Clock
                            .now()
                });
            }
        }
        /* =================================================
           ATUALIZAÇÃO ATÔMICA
        ================================================= */
        /*
           DATA DA PERDA
           Mantém a data original enquanto
           o contato continua perdido.
           Se sair de perdido e voltar depois,
           uma nova data será criada.
        */
        let lostAtValue =
            null;
        if (
            status ===
                "perdido"
        ) {
            if (
                currentContact.status ===
                    "perdido"
                &&
                currentContact.lostAt
            ) {
                lostAtValue =
                    currentContact.lostAt;
            }
            else {
                lostAtValue =
                    Clock.now();
            }
        }
                    transaction.update(
                        contactReference,
                        {
                            status:
                                status,
                            lossReason:
                                cleanLossReason,
                            lostAt:
                                lostAtValue,
                            notes:
                                cleanNotes,
                            nextContactAt:
                                parsedNextContact,
                            origin:
                                cleanOrigin,
                            tags:
                                cleanTags,
                            updatedAt:
                                Clock.now()
                        }
                    );
                    transaction.set(
                        auditReference,
                        auditData
                    );
                    /*
                       ATIVIDADE RECENTE
                       Uma mesma edição pode gerar
                       mais de um evento.
                       Exemplo:
                       status alterado
                       +
                       follow-up reagendado.
                    */
                    for (
                        const activityData
                        of activityItems
                    ) {
                        const activityReference =
                            db
                                .collection(
                                    "activity_feed"
                                )
                                .doc();
                        transaction.set(
                            activityReference,
                            activityData
                        );
                    }
                    return true;
                }
            );
        return response
            .status(200)
            .json({
                success: true,
                changed: changed
            });
    }
    catch (error) {
        if (
            error.statusCode === 400 ||
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
            "Erro na API administrativa:",
            error
        );
        return response
            .status(500)
            .json({
                error:
                    "Não foi possível atualizar o contato."
            });
    }
}