// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";

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
           DADOS
        ================================================= */
        const {
            contactId,
            archived
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
        if (
            typeof archived !==
                "boolean"
        ) {
            return response
                .status(400)
                .json({
                    error:
                        "Estado de arquivamento inválido."
                });
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
        const result = await db.runTransaction(
            async function (transaction) {
                const contactSnapshot =
                    await transaction.get(contactReference);
                if (!contactSnapshot.exists) {
                    return {
                        found: false
                    };
                }
                const currentContact = contactSnapshot.data();
                const currentArchived =
                    currentContact.archived === true;
                if (currentArchived === archived) {
                    return {
                        success: true,
                        changed: false,
                        archived: currentArchived
                    };
                }
                const actorEmail =
                    actor.email ||
                    teamUser.email ||
                    "";
                const eventType = archived
                    ? "contact_archived"
                    : "contact_restored";
                const auditReference = db
                    .collection("audit_logs")
                    .doc();
                const activityReference = db
                    .collection("activity_feed")
                    .doc();
                const auditData = {
                    actorUid,
                    actorEmail,
                    actorRole: teamUser.role,
                    contactId,
                    contactName: currentContact.name || "",
                    contactCompany: currentContact.company || "",
                    action: eventType,
                    changes: {
                        archived: {
                            from: currentArchived,
                            to: archived
                        }
                    },
                    createdAt: Clock.now()
                };
                const activityData = {
                    type: eventType,
                    contactId,
                    contactName: currentContact.name || "",
                    contactCompany: currentContact.company || "",
                    service: currentContact.service || "",
                    origin:
                        currentContact.origin ||
                        (
                            currentContact.source === "site"
                                ? "site"
                                : "nao_informado"
                        ),
                    fromStatus: null,
                    toStatus: null,
                    fromNextContactAt: null,
                    toNextContactAt: null,
                    fromArchived: currentArchived,
                    toArchived: archived,
                    actorUid,
                    actorEmail,
                    actorRole: teamUser.role,
                    createdAt: Clock.now()
                };
                transaction.update(contactReference, {
                    archived,
                    archivedAt: archived
                        ? Clock.now()
                        : null,
                    updatedAt: Clock.now()
                });
                transaction.set(auditReference, auditData);
                transaction.set(activityReference, activityData);
                return {
                    success: true,
                    changed: true,
                    archived
                };
            }
        );
        if (result.found === false) {
            return response.status(404).json({
                error: "Contato não encontrado."
            });
        }
        return response.status(200).json(result);
        } catch (error) {
        console.error(
            "Erro ao arquivar contato:",
            error
        );
        return response
            .status(500)
            .json({
                error:
                    "Não foi possível alterar o arquivamento do contato."
            });
    }
}