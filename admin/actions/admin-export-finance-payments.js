// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";
/* =========================================================
   EXPORTAÇÃO DOS PAGAMENTOS
========================================================= */
const MAX_CONTRACTS = 1000;
const MAX_PAYMENTS = 5000;
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short"
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
function formatMoney(cents) {
    if (
        !Number.isSafeInteger(cents) ||
        cents < 0
    ) {
        throw new Error("Valor de pagamento inválido.");
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
const statusLabels = {
    paid: "Pago",
    pending: "Pendente",
    failed: "Falhou",
    refunded: "Reembolsado"
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
        const { financeIds } = request.body || {};
        if (
            !Array.isArray(financeIds) ||
            financeIds.length === 0
        ) {
            return response.status(400).json({
                error: "Nenhum contrato selecionado."
            });
        }
        if (financeIds.length > MAX_CONTRACTS) {
            return response.status(400).json({
                error:
                    "Selecione até 1.000 contratos por exportação."
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
        /*
           Confere se os contratos continuam existentes.
        */
        for (let index = 0; index < uniqueIds.length; index += 100) {
            const references = uniqueIds
                .slice(index, index + 100)
                .map(function (id) {
                    return db.collection("finance_records").doc(id);
                });
            const contracts = await db.getAll(...references);
            if (contracts.some(function (item) {
                return !item.exists;
            })) {
                return response.status(409).json({
                    error:
                        "Um contrato da seleção foi removido. " +
                        "Atualize a lista e tente novamente."
                });
            }
        }
        /* BUSCA DOS PAGAMENTOS */
        const payments = [];
        for (let index = 0; index < uniqueIds.length; index += 10) {
            const contractGroup = uniqueIds.slice(index, index + 10);
            const remaining = MAX_PAYMENTS - payments.length;
            const snapshot = await db
                .collection("finance_payments")
                .where("financeId", "in", contractGroup)
                .limit(remaining + 1)
                .get();
            for (const document of snapshot.docs) {
                payments.push({
                    id: document.id,
                    data: document.data()
                });
            }
            if (payments.length > MAX_PAYMENTS) {
                return response.status(400).json({
                    error:
                        "A seleção possui mais de 5.000 pagamentos. " +
                        "Selecione menos contratos e tente novamente."
                });
            }
        }
        if (payments.length === 0) {
            return response.status(404).json({
                error:
                    "Não há pagamentos registrados para os contratos selecionados."
            });
        }
        /*
           Pagamentos mais recentes primeiro.
           O ID desempata registros com a mesma data.
        */
        payments.sort(function (first, second) {
            const firstDate =
                toDate(first.data.paidAt) ||
                toDate(first.data.createdAt);
            const secondDate =
                toDate(second.data.paidAt) ||
                toDate(second.data.createdAt);
            const difference =
                (secondDate?.getTime() ?? 0) -
                (firstDate?.getTime() ?? 0);
            return difference || first.id.localeCompare(second.id);
        });
        /* CSV — DADOS HISTÓRICOS DO PAGAMENTO */
        const rows = [
            csvRow([
                "ID do pagamento",
                "ID do contrato",
                "ID do contato",
                "Nome",
                "Empresa",
                "Serviço",
                "Tipo de cobrança",
                "Competência",
                "Vencimento (São Paulo)",
                "Valor do pagamento (R$)",
                "Status",
                "Pago em (São Paulo)",
                "Registrado por",
                "Registrado em (São Paulo)"
            ])
        ];
        for (const item of payments) {
            const payment = item.data;
            const billingType =
                payment.billingType === "monthly"
                    ? "Mensal"
                    : payment.billingType === "one_time"
                        ? "Pontual"
                        : "Não informado";
            rows.push(
                csvRow([
                    item.id,
                    payment.financeId || "",
                    payment.contactId || "",
                    payment.contactName || "",
                    payment.contactCompany || "",
                    payment.service || "",
                    billingType,
                    payment.cycleKey || "",
                    formatDate(payment.dueAt),
                    formatMoney(payment.amountCents),
                    statusLabels[payment.status] ||
                        payment.status ||
                        "Não informado",
                    formatDate(payment.paidAt),
                    payment.recordedByEmail || "",
                    formatDate(payment.createdAt)
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
            `attachment; filename="crm-pagamentos-${exportDate}.csv"`
        );
        return response.status(200).send(csv);
    } catch (error) {
        console.error("Erro ao exportar pagamentos:", error);
        return response.status(500).json({
            error: "Não foi possível exportar os pagamentos."
        });
    }
}