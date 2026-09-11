// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";
const MAX_RECORDS = 5000;
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short"
});
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
function getServiceLabel(value) {
    const service = String(value || "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    if (!service) {
        return "Não definido";
    }
    if (service.includes("trafego pago")) {
        return "Tráfego Pago";
    }
    if (service.includes("gestao total")) {
        return "Gestão Total";
    }
    if (
        service.includes("criacao de site") ||
        service === "site" ||
        service === "sites"
    ) {
        return "Criação de Sites";
    }
    if (service.includes("consultoria")) {
        return "Consultoria";
    }
    if (
        service.includes("personalizado") ||
        service.includes("personalizada")
    ) {
        return "Projeto personalizado";
    }
    return "Outro serviço";
}
function incrementCounter(counter, key) {
    counter.set(key, (counter.get(key) || 0) + 1);
}
function isValidMilliseconds(value) {
    return (
        Number.isSafeInteger(value) &&
        Math.abs(value) <= 8640000000000000
    );
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
        const { startMs, endMs } = request.body || {};
        const allPeriod =
            startMs === null && endMs === null;
        if (
            !allPeriod &&
            (
                !isValidMilliseconds(startMs) ||
                !isValidMilliseconds(endMs) ||
                startMs > endMs
            )
        ) {
            return response.status(400).json({
                error: "Período inválido."
            });
        }
        /*
           Leads: selecionados pela criação.
           Vendas: selecionadas pelo fechamento.
           As consultas retornam somente os campos
           necessários ao relatório.
        */
        let contactsQuery = db.collection("contacts");
        let salesQuery = db.collection("finance_records");
        if (!allPeriod) {
            const startDate = new Date(startMs);
            const endDate = new Date(endMs);
            contactsQuery = contactsQuery
                .where("createdAt", ">=", startDate)
                .where("createdAt", "<=", endDate);
            salesQuery = salesQuery
                .where("closedAt", ">=", startDate)
                .where("closedAt", "<=", endDate);
        }
        const [contactsSnapshot, salesSnapshot] =
            await Promise.all([
                contactsQuery
                    .select(
                        "status",
                        "origin",
                        "source",
                        "service",
                        "archived"
                    )
                    .limit(MAX_RECORDS + 1)
                    .get(),
                salesQuery
                    .select("closedAt")
                    .limit(MAX_RECORDS + 1)
                    .get()
            ]);
        if (
            contactsSnapshot.size > MAX_RECORDS ||
            salesSnapshot.size > MAX_RECORDS
        ) {
            return response.status(400).json({
                error:
                    "O período ultrapassa o limite de 5.000 leads " +
                    "ou 5.000 vendas. Selecione um período menor."
            });
        }
        /* CONSOLIDAÇÃO */
        const totalLeads = contactsSnapshot.size;
        let closedLeads = 0;
        let lostLeads = 0;
        let archivedLeads = 0;
        const statuses = new Map();
        const origins = new Map();
        const services = new Map();
        for (const document of contactsSnapshot.docs) {
            const contact = document.data();
            const status = contact.status || "novo";
            const origin =
                contact.origin ||
                (
                    contact.source === "site"
                        ? "site"
                        : "nao_informado"
                );
            if (status === "fechado") {
                closedLeads++;
            }
            if (status === "perdido") {
                lostLeads++;
            }
            if (contact.archived === true) {
                archivedLeads++;
            }
            incrementCounter(
                statuses,
                statusLabels[status] || "Outro status"
            );
            incrementCounter(
                origins,
                originLabels[origin] || "Não informado"
            );
            incrementCounter(
                services,
                getServiceLabel(contact.service)
            );
        }
        const conversion = totalLeads > 0
            ? (
                closedLeads / totalLeads * 100
            ).toFixed(2).replace(".", ",")
            : "";
        const now = new Date();
        const rows = [
            csvRow(["Seção", "Indicador", "Valor", "Unidade"]),
            csvRow([
                "Período",
                "Início (São Paulo)",
                allPeriod
                    ? "Todo o período"
                    : dateFormatter.format(new Date(startMs)),
                ""
            ]),
            csvRow([
                "Período",
                "Fim (São Paulo)",
                allPeriod
                    ? "Todo o período"
                    : dateFormatter.format(new Date(endMs)),
                ""
            ]),
            csvRow([
                "Relatório",
                "Gerado em (São Paulo)",
                dateFormatter.format(now),
                ""
            ]),
            csvRow([
                "Resumo",
                "Leads criados no período",
                totalLeads,
                "leads"
            ]),
            csvRow([
                "Resumo",
                "Desses leads: atualmente fechados",
                closedLeads,
                "leads"
            ]),
            csvRow([
                "Resumo",
                "Desses leads: atualmente perdidos",
                lostLeads,
                "leads"
            ]),
            csvRow([
                "Resumo",
                "Desses leads: atualmente arquivados",
                archivedLeads,
                "leads"
            ]),
            csvRow([
                "Resumo",
                "Conversão dos leads criados no período",
                conversion,
                "%"
            ]),
            csvRow([
                "Fechamentos",
                "Vendas fechadas no período",
                salesSnapshot.size,
                "vendas"
            ])
        ];
        for (const [section, counter] of [
            ["Status atual", statuses],
            ["Origem", origins],
            ["Serviço", services]
        ]) {
            const sortedEntries = [...counter.entries()]
                .sort(function (first, second) {
                    return first[0].localeCompare(second[0], "pt-BR");
                });
            for (const [label, quantity] of sortedEntries) {
                rows.push(
                    csvRow([section, label, quantity, "leads"])
                );
            }
        }
        rows.push(
            csvRow([
                "Critério",
                "Distribuições",
                "Consideram os leads criados no período, incluindo arquivados.",
                ""
            ]),
            csvRow([
                "Critério",
                "Conversão",
                "Leads atualmente fechados divididos pelos leads criados no período. Vazia quando não há leads.",
                ""
            ]),
            csvRow([
                "Critério",
                "Situação atual",
                "Status e arquivamento refletem o momento da consulta, não o último dia do período.",
                ""
            ]),
            csvRow([
                "Critério",
                "Vendas fechadas",
                "Contadas pela data de fechamento, independentemente da criação do lead.",
                ""
            ])
        );
        const csv = "\uFEFF" + rows.join("\r\n") + "\r\n";
        const exportDate = now.toISOString().slice(0, 10);
        response.setHeader(
            "Content-Type",
            "text/csv; charset=utf-8"
        );
        response.setHeader(
            "Content-Disposition",
            `attachment; filename="roasce-relatorio-comercial-${exportDate}.csv"`
        );
        return response.status(200).send(csv);
    } catch (error) {
        console.error("Erro ao gerar relatório comercial:", error);
        return response.status(500).json({
            error: "Não foi possível gerar o relatório comercial."
        });
    }
}