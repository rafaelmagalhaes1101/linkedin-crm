// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";
/* =========================================================
   EXPORTAÇÃO DE CONTATOS
========================================================= */
const MAX_CONTACTS = 1000;
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short"
});
function formatExportDate(value) {
    if (!value) {
        return "";
    }
    const date =
        typeof value.toDate === "function"
            ? value.toDate()
            : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    return dateFormatter.format(date);
}
function csvCell(value) {
    let text = String(value ?? "");
    /*
       Impede que textos recebidos de usuários
       sejam interpretados como fórmulas na planilha.
    */
    if (
        /^[\s\uFEFF]*[=+\-@]/u.test(text) ||
        /^[\t\r\n]/u.test(text)
    ) {
        text = "'" + text;
    }
    return '"' + text.replaceAll('"', '""') + '"';
}
function csvRow(values) {
    return values.map(csvCell).join(";");
}
const statusLabels = {
    novo: "Novo",
    em_contato: "Em contato",
    follow_up: "Follow-up",
    proposta: "Proposta",
    aguardando_cliente: "Aguardando cliente",
    fechado: "Fechado",
    perdido: "Perdido"
};
const originLabels = {
    site: "Site",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    indicacao: "Indicação",
    prospeccao: "Prospecção",
    evento: "Evento",
    google: "Google",
    outro: "Outro",
    nao_informado: "Não informado"
};
export default async function handler(request, response) {
    response.setHeader("Cache-Control", "no-store");
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return response.status(405).json({
            error: "Método não permitido."
        });
    }
    try {
        const { contactIds } = request.body || {};
        if (
            !Array.isArray(contactIds) ||
            contactIds.length === 0
        ) {
            return response.status(400).json({
                error: "Nenhum contato selecionado para exportação."
            });
        }
        if (contactIds.length > MAX_CONTACTS) {
            return response.status(400).json({
                error:
                    "Exporte até 1.000 contatos por vez. " +
                    "Use os filtros para reduzir a seleção."
            });
        }
        const hasInvalidId = contactIds.some(function (id) {
            return (
                typeof id !== "string" ||
                id.trim() === "" ||
                id.includes("/") ||
                id === "." ||
                id === ".." ||
                new TextEncoder().encode(id).length > 1500
            );
        });
        if (hasInvalidId) {
            return response.status(400).json({
                error: "A seleção contém um contato inválido."
            });
        }
        const uniqueIds = [...new Set(contactIds)];
        const snapshots = [];
        /*
           Lê os documentos em grupos, sem aceitar
           os dados dos contatos enviados pelo navegador.
        */
        for (let index = 0; index < uniqueIds.length; index += 100) {
            const references = uniqueIds
                .slice(index, index + 100)
                .map(function (id) {
                    return db.collection("contacts").doc(id);
                });
            const documents = await db.getAll(...references);
            snapshots.push(...documents);
        }
        const documentsById = new Map(
            snapshots.map(function (snapshot) {
                return [snapshot.id, snapshot];
            })
        );
        const selectedContacts = [];
        for (const id of uniqueIds) {
            const snapshot = documentsById.get(id);
            if (!snapshot || !snapshot.exists) {
                return response.status(409).json({
                    error:
                        "Um contato da seleção foi removido. " +
                        "Atualize a lista e tente novamente."
                });
            }
            const contact = snapshot.data();
            if (contact.status === "fechado") {
                return response.status(409).json({
                    error:
                        "Um contato da seleção já foi fechado. " +
                        "Atualize a lista e tente novamente."
                });
            }
            selectedContacts.push({
                id,
                data: contact
            });
        }
        /* CSV — APENAS OS CAMPOS DEFINIDOS */
        const rows = [
            csvRow([
                "ID",
                "Nome",
                "Empresa",
                "Contato",
                "Serviço",
                "Status",
                "Origem",
                "Tags",
                "Criado em (São Paulo)",
                "Próximo contato (São Paulo)",
                "Arquivado"
            ])
        ];
        for (const item of selectedContacts) {
            const contact = item.data;
            const status = contact.status || "novo";
            const origin =
                contact.origin ||
                (
                    contact.source === "site"
                        ? "site"
                        : "nao_informado"
                );
            rows.push(
                csvRow([
                    item.id,
                    contact.name || "",
                    contact.company || "",
                    contact.contact || "",
                    contact.service || "",
                    statusLabels[status] || status,
                    originLabels[origin] || origin,
                    Array.isArray(contact.tags)
                        ? contact.tags.join(" | ")
                        : "",
                    formatExportDate(contact.createdAt),
                    formatExportDate(contact.nextContactAt),
                    contact.archived === true ? "Sim" : "Não"
                ])
            );
        }
        /*
           BOM UTF-8 para facilitar a abertura
           de acentos no Excel.
        */
        const csv = "\uFEFF" + rows.join("\r\n") + "\r\n";
        const exportDate = new Date()
            .toISOString()
            .slice(0, 10);
        response.setHeader(
            "Content-Type",
            "text/csv; charset=utf-8"
        );
        response.setHeader(
            "Content-Disposition",
            `attachment; filename="crm-contatos-${exportDate}.csv"`
        );
        return response.status(200).send(csv);
    } catch (error) {
        console.error("Erro ao exportar contatos:", error);
        return response.status(500).json({
            error: "Não foi possível exportar os contatos."
        });
    }
}