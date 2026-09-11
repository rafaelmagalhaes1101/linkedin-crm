// Regras do CRM executadas localmente; não é uma API nem um controle de acesso.
import { db, Clock, demoActor } from "../local-store.js";
const MAX_RECORDS = 5000;
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
function dayKey(date) {
    const values = Object.fromEntries(
        dayFormatter.formatToParts(date).map(function (part) {
            return [part.type, part.value];
        })
    );
    return `${values.year}-${values.month}-${values.day}`;
}
function isValidMilliseconds(value) {
    return (
        Number.isSafeInteger(value) &&
        Math.abs(value) <= 8640000000000000
    );
}
function addMoney(total, amount) {
    if (
        !Number.isSafeInteger(amount) ||
        amount < 0 ||
        !Number.isSafeInteger(total + amount)
    ) {
        throw new Error("Valor financeiro inválido ou fora do limite.");
    }
    return total + amount;
}
function formatMoney(cents) {
    const whole = Math.floor(cents / 100);
    const fraction = String(cents % 100).padStart(2, "0");
    return `${whole},${fraction}`;
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
async function readPeriodRecords(
    collectionName,
    dateField,
    fields,
    startMs,
    endMs
) {
    let query = db.collection(collectionName);
    if (startMs !== null) {
        query = query
            .where(dateField, ">=", new Date(startMs))
            .where(dateField, "<=", new Date(endMs));
    }
    return query
        .select(...fields)
        .limit(MAX_RECORDS + 1)
        .get();
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
           Três seleções independentes:
           Contratado: data de fechamento.
           Recebido: data do pagamento.
           Cobranças atuais: data do vencimento.
        */
        const [
            contractsSnapshot,
            paymentsSnapshot,
            chargesSnapshot
        ] = await Promise.all([
            readPeriodRecords(
                "finance_records",
                "closedAt",
                [
                    "closedAt",
                    "billingType",
                    "contractValueCents"
                ],
                startMs,
                endMs
            ),
            readPeriodRecords(
                "finance_payments",
                "paidAt",
                [
                    "paidAt",
                    "status",
                    "amountCents"
                ],
                startMs,
                endMs
            ),
            readPeriodRecords(
                "finance_records",
                "nextPaymentDueAt",
                [
                    "nextPaymentDueAt",
                    "paymentStatus",
                    "contractValueCents"
                ],
                startMs,
                endMs
            )
        ]);
        if (
            [
                contractsSnapshot,
                paymentsSnapshot,
                chargesSnapshot
            ].some(function (snapshot) {
                return snapshot.size > MAX_RECORDS;
            })
        ) {
            return response.status(400).json({
                error:
                    "Uma das seleções ultrapassa 5.000 registros. " +
                    "Escolha um período menor."
            });
        }
        /* TOTAIS EM CENTAVOS */
        let monthlyContracted = 0;
        let oneTimeContracted = 0;
        let received = 0;
        let pending = 0;
        let overdue = 0;
        let monthlyCount = 0;
        let oneTimeCount = 0;
        let receivedCount = 0;
        let pendingCount = 0;
        let overdueCount = 0;
        const now = new Date();
        const todayKey = dayKey(now);
        for (const document of contractsSnapshot.docs) {
            const record = document.data();
            if (!toDate(record.closedAt)) {
                throw new Error(
                    `Contrato sem data de fechamento válida: ${document.id}`
                );
            }
            if (record.billingType === "monthly") {
                monthlyContracted = addMoney(
                    monthlyContracted,
                    record.contractValueCents
                );
                monthlyCount++;
            } else if (record.billingType === "one_time") {
                oneTimeContracted = addMoney(
                    oneTimeContracted,
                    record.contractValueCents
                );
                oneTimeCount++;
            } else {
                throw new Error(
                    `Tipo de cobrança inválido: ${document.id}`
                );
            }
        }
        for (const document of paymentsSnapshot.docs) {
            const payment = document.data();
            if (payment.status !== "paid") {
                continue;
            }
            if (!toDate(payment.paidAt)) {
                throw new Error(
                    `Pagamento sem data válida: ${document.id}`
                );
            }
            received = addMoney(received, payment.amountCents);
            receivedCount++;
        }
        for (const document of chargesSnapshot.docs) {
            const record = document.data();
            if (record.paymentStatus === "paid") {
                continue;
            }
            if (record.paymentStatus !== "pending") {
                throw new Error(
                    `Situação de pagamento inválida: ${document.id}`
                );
            }
            const dueDate = toDate(record.nextPaymentDueAt);
            if (!dueDate) {
                throw new Error(
                    `Cobrança sem vencimento válido: ${document.id}`
                );
            }
            if (dayKey(dueDate) < todayKey) {
                overdue = addMoney(
                    overdue,
                    record.contractValueCents
                );
                overdueCount++;
            } else {
                pending = addMoney(
                    pending,
                    record.contractValueCents
                );
                pendingCount++;
            }
        }
        /* CSV */
        const rows = [
            csvRow([
                "Seção",
                "Indicador",
                "Valor",
                "Unidade",
                "Critério"
            ]),
            csvRow([
                "Período",
                "Início (São Paulo)",
                allPeriod
                    ? "Todo o período"
                    : dateFormatter.format(new Date(startMs)),
                "",
                ""
            ]),
            csvRow([
                "Período",
                "Fim (São Paulo)",
                allPeriod
                    ? "Todo o período"
                    : dateFormatter.format(new Date(endMs)),
                "",
                ""
            ]),
            csvRow([
                "Relatório",
                "Gerado em (São Paulo)",
                dateFormatter.format(now),
                "",
                ""
            ]),
            csvRow([
                "Financeiro",
                "Mensal contratado",
                formatMoney(monthlyContracted),
                "R$ por mês",
                "Valor mensal atual dos contratos fechados no período."
            ]),
            csvRow([
                "Financeiro",
                "Pontual contratado",
                formatMoney(oneTimeContracted),
                "R$",
                "Valor atual dos contratos pontuais fechados no período."
            ]),
            csvRow([
                "Financeiro",
                "Recebido",
                formatMoney(received),
                "R$",
                "Pagamentos registrados como pagos, com data de pagamento no período."
            ]),
            csvRow([
                "Financeiro",
                "Pendente",
                formatMoney(pending),
                "R$",
                "Cobranças atuais em aberto, com vencimento no período e ainda não vencidas."
            ]),
            csvRow([
                "Financeiro",
                "Em atraso",
                formatMoney(overdue),
                "R$",
                "Cobranças atuais em aberto, com vencimento no período e anterior a hoje."
            ]),
            csvRow([
                "Quantidade",
                "Contratos mensais",
                monthlyCount,
                "contratos",
                "Fechados no período."
            ]),
            csvRow([
                "Quantidade",
                "Contratos pontuais",
                oneTimeCount,
                "contratos",
                "Fechados no período."
            ]),
            csvRow([
                "Quantidade",
                "Pagamentos recebidos",
                receivedCount,
                "pagamentos",
                "Pagos no período."
            ]),
            csvRow([
                "Quantidade",
                "Cobranças pendentes",
                pendingCount,
                "cobranças",
                "Vencimento no período; situação atual."
            ]),
            csvRow([
                "Quantidade",
                "Cobranças em atraso",
                overdueCount,
                "cobranças",
                "Vencimento no período; situação atual."
            ]),
            csvRow([
                "Critério",
                "Histórico",
                "O relatório não reconstrói saldos nem valores contratuais de datas anteriores.",
                "",
                ""
            ]),
            csvRow([
                "Critério",
                "Recorrência",
                "Considera somente a cobrança atual de cada contrato, sem projetar parcelas futuras.",
                "",
                ""
            ]),
            csvRow([
                "Critério",
                "Recebimentos",
                "Considera registros de finance_payments com status Pago; não calcula recebimentos a partir do valor atual do contrato.",
                "",
                ""
            ])
        ];
        const csv = "\uFEFF" + rows.join("\r\n") + "\r\n";
        const exportDate = now.toISOString().slice(0, 10);
        response.setHeader(
            "Content-Type",
            "text/csv; charset=utf-8"
        );
        response.setHeader(
            "Content-Disposition",
            `attachment; filename="roasce-relatorio-financeiro-${exportDate}.csv"`
        );
        return response.status(200).send(csv);
    } catch (error) {
        console.error("Erro ao gerar relatório financeiro:", error);
        return response.status(500).json({
            error: "Não foi possível gerar o relatório financeiro."
        });
    }
}