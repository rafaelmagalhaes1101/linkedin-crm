// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";
/* =========================================================
   EXPORTAÇÃO DOS CONTRATOS FINANCEIROS
========================================================= */
const MAX_RECORDS = 1000;
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short"
});
const dayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
});
function toDate(value) {
    if (!value) {
        return null;
    }
    const date =
        typeof value.toDate === "function"
            ? value.toDate()
            : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}
function formatDate(value) {
    const date = toDate(value);
    return date ? dateFormatter.format(date) : "";
}
function dayKey(date) {
    const parts = dayFormatter.formatToParts(date);
    const values = Object.fromEntries(
        parts.map(function (part) {
            return [part.type, part.value];
        })
    );
    return `${values.year}-${values.month}-${values.day}`;
}
function paymentStatusLabel(record, todayKey) {
    if (record.paymentStatus === "paid") {
        return "Pago";
    }
    const dueDate = toDate(record.nextPaymentDueAt);
    if (dueDate) {
        const dueKey = dayKey(dueDate);
        if (dueKey < todayKey) {
            return "Em atraso";
        }
        if (
            record.billingType === "monthly" &&
            record.lastPaidAt &&
            dueKey > todayKey
        ) {
            return "Em dia";
        }
    }
    return "Pendente";
}
function formatMoney(cents) {
    if (
        !Number.isSafeInteger(cents) ||
        cents < 0
    ) {
        throw new Error("Valor financeiro inválido no registro.");
    }
    return (cents / 100).toFixed(2).replace(".", ",");
}
function csvCell(value) {
    let text = String(value ?? "");
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
export default async function handler(request, response) {
    response.setHeader("Cache-Control", "no-store");
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return response.status(405).json({
            error: "Método não permitido."
        });
    }
    try {
        const { financeIds } = request.body || {};
        if (
            !Array.isArray(financeIds) ||
            financeIds.length === 0
        ) {
            return response.status(400).json({
                error: "Nenhum contrato selecionado para exportação."
            });
        }
        if (financeIds.length > MAX_RECORDS) {
            return response.status(400).json({
                error:
                    "Exporte até 1.000 contratos por vez. " +
                    "Reduza a seleção e tente novamente."
            });
        }
        const hasInvalidId = financeIds.some(function (id) {
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
                error: "A seleção contém um contrato inválido."
            });
        }
        const uniqueIds = [...new Set(financeIds)];
        const documentsById = new Map();
        for (let index = 0; index < uniqueIds.length; index += 100) {
            const references = uniqueIds
                .slice(index, index + 100)
                .map(function (id) {
                    return db.collection("finance_records").doc(id);
                });
            const snapshots = await db.getAll(...references);
            for (const snapshot of snapshots) {
                documentsById.set(snapshot.id, snapshot);
            }
        }
        /* CSV */
        const rows = [
            csvRow([
                "ID do contrato",
                "ID do contato",
                "Nome",
                "Empresa",
                "Serviço",
                "Responsável pelo fechamento",
                "Fechado em (São Paulo)",
                "Tipo de cobrança",
                "Valor contratado (R$)",
                "Próximo vencimento (São Paulo)",
                "Dia da recorrência",
                "Situação do pagamento",
                "Pago em (São Paulo)"
            ])
        ];
        const todayKey = dayKey(new Date());
        for (const id of uniqueIds) {
            const snapshot = documentsById.get(id);
            if (!snapshot || !snapshot.exists) {
                return response.status(409).json({
                    error:
                        "Um contrato da seleção foi removido. " +
                        "Atualize a lista e tente novamente."
                });
            }
            const record = snapshot.data();
            const billingType =
                record.billingType === "monthly"
                    ? "Mensal"
                    : record.billingType === "one_time"
                        ? "Pontual"
                        : "Não informado";
            rows.push(
                csvRow([
                    id,
                    record.contactId || id,
                    record.contactName || "",
                    record.contactCompany || "",
                    record.service || "",
                    record.closedByEmail || "",
                    formatDate(record.closedAt),
                    billingType,
                    formatMoney(record.contractValueCents),
                    formatDate(record.nextPaymentDueAt),
                    record.billingType === "monthly"
                        ? record.recurringDay ?? ""
                        : "",
                    paymentStatusLabel(record, todayKey),
                    formatDate(record.paidAt)
                ])
            );
        }
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
            `attachment; filename="crm-contratos-${exportDate}.csv"`
        );
        return response.status(200).send(csv);
    } catch (error) {
        console.error("Erro ao exportar contratos:", error);
        return response.status(500).json({
            error: "Não foi possível exportar os contratos."
        });
    }
}