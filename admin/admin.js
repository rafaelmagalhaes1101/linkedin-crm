// Interface original adaptada à demonstração local, sem autenticação ou rede de dados.
import { db, collection, query, orderBy, where, onSnapshot, limit, demoActor } from "./local-store.js";
import { localRequest } from "./local-actions.js";
const session = { currentUser: demoActor };
/* =========================================================
   ELEMENTOS
========================================================= */
const loginScreen =
    document.getElementById(
        "loginScreen"
    );
const adminApp =
    document.getElementById(
        "adminApp"
    );
const loginButton =
    document.getElementById(
        "loginButton"
    );
const loginError =
    document.getElementById(
        "loginError"
    );
const logoutButton =
    document.getElementById(
        "logoutButton"
    );
const adminEmailDisplay =
    document.getElementById(
        "adminEmailDisplay"
    );
const adminSectionName =
    document.getElementById(
        "adminSectionName"
    );
const dashboardTabButton =
    document.getElementById(
        "dashboardTabButton"
    );
const contactsTabButton =
    document.getElementById(
        "contactsTabButton"
    );
const auditTabButton =
    document.getElementById(
        "auditTabButton"
    );
const financeTabButton =
    document.getElementById(
        "financeTabButton"
    );
const dashboardView =
    document.getElementById(
        "dashboardView"
    );
const dashboardPeriodFilter =
    document.getElementById(
        "dashboardPeriodFilter"
    );
const dashboardPeriodSummary =
    document.getElementById(
        "dashboardPeriodSummary"
    );
/* =========================================================
   DASHBOARD — INDICADORES
========================================================= */
const dashboardMetricTotal =
    document.getElementById(
        "dashboardMetricTotal"
    );
const dashboardMetricNew =
    document.getElementById(
        "dashboardMetricNew"
    );
const dashboardMetricClosed =
    document.getElementById(
        "dashboardMetricClosed"
    );
const dashboardMetricLost =
    document.getElementById(
        "dashboardMetricLost"
    );
const dashboardMetricConversion =
    document.getElementById(
        "dashboardMetricConversion"
    );
/* =========================================================
   DASHBOARD — FOLLOW-UPS E ALERTAS
========================================================= */
const dashboardFollowupOverdue =
    document.getElementById(
        "dashboardFollowupOverdue"
    );
const dashboardFollowupToday =
    document.getElementById(
        "dashboardFollowupToday"
    );
const dashboardFollowupUpcoming =
    document.getElementById(
        "dashboardFollowupUpcoming"
    );
const dashboardFollowupList =
    document.getElementById(
        "dashboardFollowupList"
    );
const contactsView =
    document.getElementById(
        "contactsView"
    );
const auditView =
    document.getElementById(
        "auditView"
    );
const financeView =
    document.getElementById(
        "financeView"
    );
const financeCount =
    document.getElementById(
        "financeCount"
    );
const financeList =
    document.getElementById(
        "financeList"
    );
/* =========================================================
   DASHBOARD — STATUS
========================================================= */
const dashboardStatusCanvas =
    document.getElementById(
        "dashboardStatusChart"
    );
const dashboardStatusLegend =
    document.getElementById(
        "dashboardStatusLegend"
    );
const dashboardStatusCenterValue =
    document.getElementById(
        "dashboardStatusCenterValue"
    );
const dashboardStatusCenterLabel =
    document.getElementById(
        "dashboardStatusCenterLabel"
    );
const dashboardStatusCenterPercent =
    document.getElementById(
        "dashboardStatusCenterPercent"
    );
/* =========================================================
   DASHBOARD — ORIGENS
========================================================= */
const dashboardOriginCanvas =
    document.getElementById(
        "dashboardOriginChart"
    );
const dashboardOriginLegend =
    document.getElementById(
        "dashboardOriginLegend"
    );
const dashboardOriginCenterValue =
    document.getElementById(
        "dashboardOriginCenterValue"
    );
const dashboardOriginCenterLabel =
    document.getElementById(
        "dashboardOriginCenterLabel"
    );
const dashboardOriginCenterPercent =
    document.getElementById(
        "dashboardOriginCenterPercent"
    );
/* =========================================================
   DASHBOARD — SERVIÇOS
========================================================= */
const dashboardServiceCanvas =
    document.getElementById(
        "dashboardServiceChart"
    );
const dashboardServiceLegend =
    document.getElementById(
        "dashboardServiceLegend"
    );
const dashboardServiceCenterValue =
    document.getElementById(
        "dashboardServiceCenterValue"
    );
const dashboardServiceCenterLabel =
    document.getElementById(
        "dashboardServiceCenterLabel"
    );
const dashboardServiceCenterPercent =
    document.getElementById(
        "dashboardServiceCenterPercent"
    );
/* =========================================================
   DASHBOARD — FINANCEIRO
========================================================= */
const dashboardFinanceCard =
    document.getElementById(
        "dashboardFinanceCard"
    );
const dashboardFinanceCanvas =
    document.getElementById(
        "dashboardFinanceChart"
    );
const dashboardFinanceLegend =
    document.getElementById(
        "dashboardFinanceLegend"
    );
const dashboardFinanceCenterValue =
    document.getElementById(
        "dashboardFinanceCenterValue"
    );
const dashboardFinanceCenterLabel =
    document.getElementById(
        "dashboardFinanceCenterLabel"
    );
const dashboardFinanceCenterPercent =
    document.getElementById(
        "dashboardFinanceCenterPercent"
    );
/* =========================================================
   INDICADORES FINANCEIROS — ELEMENTOS
========================================================= */
const financeMetricMonthly =
    document.getElementById(
        "financeMetricMonthly"
    );
const financeMetricOneTime =
    document.getElementById(
        "financeMetricOneTime"
    );
const financeMetricReceived =
    document.getElementById(
        "financeMetricReceived"
    );
const financeMetricPending =
    document.getElementById(
        "financeMetricPending"
    );
const financeMetricOverdue =
    document.getElementById(
        "financeMetricOverdue"
    );
const auditList =
    document.getElementById(
        "auditList"
    );
const auditCount =
    document.getElementById(
        "auditCount"
    );
const auditSearch =
    document.getElementById(
        "auditSearch"
    );
const auditUserFilter =
    document.getElementById(
        "auditUserFilter"
    );
const auditPeriodFilter =
    document.getElementById(
        "auditPeriodFilter"
    );
const auditChangeFilter =
    document.getElementById(
        "auditChangeFilter"
    );
const auditClearFilters =
    document.getElementById(
        "auditClearFilters"
    );
const contactsList =
    document.getElementById(
        "contactsList"
    );
const contactSearch =
    document.getElementById(
        "contactSearch"
    );
const statusFilter =
    document.getElementById(
        "statusFilter"
    );
const originFilter =
    document.getElementById(
        "originFilter"
    );
const tagFilter =
    document.getElementById(
        "tagFilter"
    );
const serviceFilter =
    document.getElementById("serviceFilter");
const contactFollowupFilter =
    document.getElementById("contactFollowupFilter");
const activeContactsButton =
    document.getElementById(
        "activeContactsButton"
    );
const archivedContactsButton =
    document.getElementById(
        "archivedContactsButton"
    );
const activeContactsCount =
    document.getElementById(
        "activeContactsCount"
    );
const archivedContactsCount =
    document.getElementById(
        "archivedContactsCount"
    );
/* MÉTRICAS */
const metricTotal =
    document.getElementById(
        "metricTotal"
    );
const metricNew =
    document.getElementById(
        "metricNew"
    );
const metricContact =
    document.getElementById(
        "metricContact"
    );
const metricProposal =
    document.getElementById(
        "metricProposal"
    );
const metricClosed =
    document.getElementById(
        "metricClosed"
    );
/* MODAL */
const contactModal =
    document.getElementById(
        "contactModal"
    );
const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );
const modalClose =
    document.getElementById(
        "modalClose"
    );
const modalName =
    document.getElementById(
        "modalName"
    );
const modalCompany =
    document.getElementById(
        "modalCompany"
    );
const modalContact =
    document.getElementById(
        "modalContact"
    );
const modalActions =
    document.getElementById(
        "modalActions"
    );
const modalWhatsAppButton =
    document.getElementById(
        "modalWhatsAppButton"
    );
const modalEmailButton =
    document.getElementById(
        "modalEmailButton"
    );
const modalService =
    document.getElementById(
        "modalService"
    );
const modalDate =
    document.getElementById(
        "modalDate"
    );
const modalMessage =
    document.getElementById(
        "modalMessage"
    );
const modalNotes =
    document.getElementById(
       "modalNotes"
    );
const notesCounter =
    document.getElementById(
       "notesCounter"
    );
const modalFollowUp =
    document.getElementById(
        "modalFollowUp"
    );
const modalOrigin =
    document.getElementById(
        "modalOrigin"
    );
const modalTags =
    document.getElementById(
        "modalTags"
    );
const classificationError =
    document.getElementById(
        "classificationError"
    );
const modalStatus =
    document.getElementById(
        "modalStatus"
    );
const modalLossReasonGroup =
    document.getElementById(
        "modalLossReasonGroup"
    );
const modalLossReason =
    document.getElementById(
        "modalLossReason"
    );
const lossReasonError =
    document.getElementById(
        "lossReasonError"
    );
const saveStatusButton =
    document.getElementById(
        "saveStatusButton"
    );
/* =========================================================
   FECHAMENTO — ELEMENTOS
========================================================= */
const closingModal =
    document.getElementById(
        "closingModal"
    );
const closingModalOverlay =
    document.getElementById(
        "closingModalOverlay"
    );
const closingModalClose =
    document.getElementById(
        "closingModalClose"
    );
const closingClientName =
    document.getElementById(
        "closingClientName"
    );
const closingValue =
    document.getElementById(
        "closingValue"
    );
const closingBillingType =
    document.getElementById(
        "closingBillingType"
    );
const closingPaymentDate =
    document.getElementById(
        "closingPaymentDate"
    );
const closingRecurringGroup =
    document.getElementById(
        "closingRecurringGroup"
    );
const closingRecurringDay =
    document.getElementById(
        "closingRecurringDay"
    );
const closingError =
    document.getElementById(
        "closingError"
    );
const closingCancelButton =
    document.getElementById(
        "closingCancelButton"
    );
const closingConfirmButton =
    document.getElementById(
        "closingConfirmButton"
    );
const contactHistorySection =
    document.getElementById(
        "contactHistorySection"
    );
const contactHistoryList =
    document.getElementById(
        "contactHistoryList"
    );
const contactHistoryCount =
    document.getElementById(
        "contactHistoryCount"
    )
const archiveContactButton =
    document.getElementById(
        "archiveContactButton"
    );
/* =========================================================
   EDIÇÃO FINANCEIRA — ELEMENTOS
========================================================= */
const financeEditModal =
    document.getElementById(
        "financeEditModal"
    );
const financeEditModalOverlay =
    document.getElementById(
        "financeEditModalOverlay"
    );
const financeEditModalClose =
    document.getElementById(
        "financeEditModalClose"
    );
const financeEditClientName =
    document.getElementById(
        "financeEditClientName"
    );
const financeEditValue =
    document.getElementById(
        "financeEditValue"
    );
const financeEditBillingType =
    document.getElementById(
        "financeEditBillingType"
    );
const financeEditPaymentDate =
    document.getElementById(
        "financeEditPaymentDate"
    );
const financeEditRecurringGroup =
    document.getElementById(
        "financeEditRecurringGroup"
    );
const financeEditRecurringDay =
    document.getElementById(
        "financeEditRecurringDay"
    );
const financeEditError =
    document.getElementById(
        "financeEditError"
    );
const financeEditCancelButton =
    document.getElementById(
        "financeEditCancelButton"
    );
const financeEditSaveButton =
    document.getElementById(
        "financeEditSaveButton"
    );
/* =========================================================
   PAGAMENTO — ELEMENTOS
========================================================= */
const paymentModal =
    document.getElementById(
        "paymentModal"
    );
const paymentModalOverlay =
    document.getElementById(
        "paymentModalOverlay"
    );
const paymentModalClose =
    document.getElementById(
        "paymentModalClose"
    );
const paymentClientName =
    document.getElementById(
        "paymentClientName"
    );
const paymentContractValue =
    document.getElementById(
        "paymentContractValue"
    );
const paymentDueDate =
    document.getElementById(
        "paymentDueDate"
    );
const paymentCurrentStatus =
    document.getElementById(
        "paymentCurrentStatus"
    );
const paymentError =
    document.getElementById(
        "paymentError"
    );
const paymentCancelButton =
    document.getElementById(
        "paymentCancelButton"
    );
const paymentConfirmButton =
    document.getElementById(
        "paymentConfirmButton"
    );
/* =========================================================
   HISTÓRICO DE PAGAMENTOS — ELEMENTOS
========================================================= */
const paymentHistoryModal =
    document.getElementById(
        "paymentHistoryModal"
    );
const paymentHistoryModalOverlay =
    document.getElementById(
        "paymentHistoryModalOverlay"
    );
const paymentHistoryModalClose =
    document.getElementById(
        "paymentHistoryModalClose"
    );
const paymentHistoryClientName =
    document.getElementById(
        "paymentHistoryClientName"
    );
const paymentHistoryContractInfo =
    document.getElementById(
        "paymentHistoryContractInfo"
    );
const paymentHistoryCount =
    document.getElementById(
        "paymentHistoryCount"
    );
const paymentHistoryList =
    document.getElementById(
        "paymentHistoryList"
    );
/* =========================================================
   NOVO LEAD — ELEMENTOS
========================================================= */
const openManualContactButton =
    document.getElementById(
        "openManualContactButton"
    );
const manualContactModal =
    document.getElementById(
        "manualContactModal"
    );
const manualContactOverlay =
    document.getElementById(
        "manualContactOverlay"
    );
const manualContactClose =
    document.getElementById(
        "manualContactClose"
    );
const manualContactForm =
    document.getElementById(
        "manualContactForm"
    );
const manualName =
    document.getElementById(
        "manualName"
    );
const manualCompany =
    document.getElementById(
        "manualCompany"
    );
const manualContact =
    document.getElementById(
        "manualContact"
    );
const manualService =
    document.getElementById(
        "manualService"
    );
const manualOrigin =
    document.getElementById(
        "manualOrigin"
    );
const manualNextContactAt =
    document.getElementById(
        "manualNextContactAt"
    );
const manualTags =
    document.getElementById(
        "manualTags"
    );
const manualMessage =
    document.getElementById(
        "manualMessage"
    );
const manualNotes =
    document.getElementById(
        "manualNotes"
    );
const manualCreateError =
    document.getElementById(
        "manualCreateError"
    );
const createManualContactButton =
    document.getElementById(
        "createManualContactButton"
    );
/* =========================================================
   CONTADOR
========================================================= */
modalNotes.addEventListener(
    "input",
    () => {
        notesCounter.textContent =
            `${modalNotes.value.length}/3000`;
    }
);
/* =========================================================
   ESTADO
========================================================= */
let contacts = [];
let dashboardStatusChart =
    null;
let dashboardStatusActiveIndex =
    null;
let dashboardOriginChart =
    null;
let dashboardOriginActiveIndex =
    null;
let dashboardServiceChart =
    null;
let dashboardServiceActiveIndex =
    null;
let dashboardFinanceChart =
    null;
let dashboardFinanceActiveIndex =
    null;
let dashboardFinanceRecords =
    [];
let unsubscribeDashboardFinanceRecords =
    null;
let dashboardFinanceError =
    false;
let dashboardFinanceLoaded =
    false;
let selectedContactId =
    null;
let unsubscribeContacts =
    null;
let currentAdminProfile =
    null;
let auditLogs = [];
let unsubscribeAuditLogs =
    null;
let financeRecords = [];
let unsubscribeFinanceRecords =
    null;
let financePayments = [];
let unsubscribeFinancePayments =
    null;
let financePaymentsError =
    false;
let selectedFinanceContactId =
    null;
let selectedPaymentTarget = null;
let paymentRequestInFlight = false;
let selectedFinanceEditContactId =
    null;
let paymentHistoryRecords = [];
let selectedPaymentHistoryContactId =
    null;
let unsubscribePaymentHistory =
    null;
let unsubscribeContactHistory =
    null;
let contactsViewMode =
    "ativos";
let dashboardContactServiceFilter =
    null;
let dashboardFinanceListFilter =
    null;
let dashboardPeriod =
    "all";
let dashboardFollowupFilter =
    "all";
let dashboardFollowupClockInterval =
    null;
/* =========================================================
   DASHBOARD — RELÓGIO DOS FOLLOW-UPS
========================================================= */
function refreshDashboardFollowupsByTime() {
    updateDashboardFollowupSummary();
    renderDashboardFollowupList();
}
function stopDashboardFollowupClock() {
    if (
        dashboardFollowupClockInterval
    ) {
        clearInterval(
            dashboardFollowupClockInterval
        );
        dashboardFollowupClockInterval =
            null;
    }
}
function startDashboardFollowupClock() {
    /*
       Evita criar dois timers
       simultaneamente.
    */
    stopDashboardFollowupClock();
    /*
       Atualização imediata.
    */
    refreshDashboardFollowupsByTime();
    /*
       Depois atualiza uma vez
       por minuto.
    */
    dashboardFollowupClockInterval =
        setInterval(
            function () {
                refreshDashboardFollowupsByTime();
            },
            60000
        );
}
/* =========================================================
   DASHBOARD — CONFIGURAÇÃO DE STATUS
========================================================= */
const DASHBOARD_STATUS_CONFIG = [
    {
        key: "novo",
        label: "Novo",
        color: "#32dfff"
    },
    {
        key: "em_contato",
        label: "Em contato",
        color: "#4d9cff"
    },
    {
        key: "follow_up",
        label: "Follow-up",
        color: "#f0c879"
    },
    {
        key: "proposta",
        label: "Proposta",
        color: "#b397ff"
    },
    {
        key: "aguardando_cliente",
        label: "Aguardando cliente",
        color: "#8fa7bf"
    },
    {
        key: "fechado",
        label: "Fechado",
        color: "#69dfbc"
    },
    {
        key: "perdido",
        label: "Perdido",
        color: "#ff7f8a"
    },
    {
        key: "arquivado",
        label: "Arquivado",
        color: "#596d82"
    }
];
/* =========================================================
   DASHBOARD — CONFIGURAÇÃO DE ORIGENS
========================================================= */
const DASHBOARD_ORIGIN_CONFIG = [
    {
        key: "site",
        label: "Site",
        color: "#32dfff"
    },
    {
        key: "instagram",
        label: "Instagram",
        color: "#b397ff"
    },
    {
        key: "whatsapp",
        label: "WhatsApp",
        color: "#69dfbc"
    },
    {
        key: "indicacao",
        label: "Indicação",
        color: "#4d9cff"
    },
    {
        key: "prospeccao",
        label: "Prospecção",
        color: "#7dd3fc"
    },
    {
        key: "evento",
        label: "Evento",
        color: "#f0c879"
    },
    {
        key: "google",
        label: "Google",
        color: "#668cff"
    },
    {
        key: "outro",
        label: "Outro",
        color: "#ff8fb1"
    },
    {
        key: "nao_informado",
        label: "Não informado",
        color: "#596d82"
    }
];
function getDashboardServiceKey(
    contact
) {
    const rawService =
        typeof contact.service ===
            "string"
            ? contact.service.trim()
            : "";
    if (
        !rawService
    ) {
        return "nao_definido";
    }
    const service =
        rawService
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase();
    if (
        service.includes(
            "trafego pago"
        )
    ) {
        return "trafego_pago";
    }
    if (
        service.includes(
            "gestao total"
        )
    ) {
        return "gestao_total";
    }
    if (
        service.includes(
            "criacao de site"
        )
        ||
        service === "site"
        ||
        service === "sites"
    ) {
        return "criacao_sites";
    }
    if (
        service.includes(
            "consultoria"
        )
    ) {
        return "consultoria";
    }
    if (
        service.includes(
            "personalizado"
        )
        ||
        service.includes(
            "personalizada"
        )
    ) {
        return "projeto_personalizado";
    }
    return "outro";
}
/* =========================================================
   DASHBOARD — CONFIGURAÇÃO DE SERVIÇOS
========================================================= */
const DASHBOARD_SERVICE_CONFIG = [
    {
        key: "trafego_pago",
        label: "Tráfego Pago",
        color: "#32dfff"
    },
    {
        key: "gestao_total",
        label: "Gestão Total",
        color: "#4d9cff"
    },
    {
        key: "criacao_sites",
        label: "Criação de Sites",
        color: "#b397ff"
    },
    {
        key: "consultoria",
        label: "Consultoria",
        color: "#69dfbc"
    },
    {
        key: "projeto_personalizado",
        label: "Projeto personalizado",
        color: "#f0c879"
    },
    {
        key: "outro",
        label: "Outro serviço",
        color: "#ff8fb1"
    },
    {
        key: "nao_definido",
        label: "Não definido",
        color: "#596d82"
    }
];
/* =========================================================
   DASHBOARD — CONFIGURAÇÃO FINANCEIRA
========================================================= */
const DASHBOARD_FINANCE_CONFIG = [
    {
        key: "pending",
        label: "Pendente",
        color: "#f0c879"
    },
    {
        key: "overdue",
        label: "Em atraso",
        color: "#ff7f8a"
    }
];
/* =========================================================
   DASHBOARD — INTERVALO DO PERÍODO
========================================================= */
function getDashboardPeriodRange() {
    if (
        dashboardPeriod ===
            "all"
    ) {
        return null;
    }
    const now =
        new Date();
    let startDate =
        null;
    /*
       HOJE
    */
    if (
        dashboardPeriod ===
            "today"
    ) {
        startDate =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
    }
    /*
       ÚLTIMOS 7 DIAS
       Hoje + 6 dias anteriores.
    */
    else if (
        dashboardPeriod ===
            "7d"
    ) {
        startDate =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
        startDate.setDate(
            startDate.getDate() -
                6
        );
    }
    /*
       ÚLTIMOS 30 DIAS
    */
    else if (
        dashboardPeriod ===
            "30d"
    ) {
        startDate =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
        startDate.setDate(
            startDate.getDate() -
                29
        );
    }
    /*
       ÚLTIMOS 90 DIAS
    */
    else if (
        dashboardPeriod ===
            "90d"
    ) {
        startDate =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
        startDate.setDate(
            startDate.getDate() -
                89
        );
    }
    /*
       ESTE MÊS
    */
    else if (
        dashboardPeriod ===
            "month"
    ) {
        startDate =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );
    }
    /*
       ESTE ANO
    */
    else if (
        dashboardPeriod ===
            "year"
    ) {
        startDate =
            new Date(
                now.getFullYear(),
                0,
                1
            );
    }
    if (
        !startDate
    ) {
        return null;
    }
    return {
        start:
            startDate.getTime(),
        end:
            now.getTime()
    };
}
function isTimestampInDashboardPeriod(
    timestamp
) {
    const range =
        getDashboardPeriodRange();
    /*
       "Todo o período"
       aceita qualquer registro.
    */
    if (
        !range
    ) {
        return true;
    }
    const milliseconds =
        timestampToMilliseconds(
            timestamp
        );
    /*
       Se o registro não possui
       a data necessária, ele não
       pode ser atribuído ao período.
    */
    if (
        milliseconds ===
            null
    ) {
        return false;
    }
    return (
        milliseconds >=
            range.start
        &&
        milliseconds <=
            range.end
    );
}
/* =========================================================
   DASHBOARD — PERÍODO
========================================================= */
function getDashboardContactsInPeriod() {
    return contacts.filter(
        function (contact) {
            return (
                isTimestampInDashboardPeriod(
                    contact.createdAt
                )
            );
        }
    );
}
function formatDashboardPeriodDate(
    milliseconds
) {
    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            day:
                "2-digit",
            month:
                "2-digit",
            year:
                "numeric"
        }
    )
        .format(
            new Date(
                milliseconds
            )
        );
}
function updateDashboardPeriodSummary() {
    if (
        !dashboardPeriodSummary
    ) {
        return;
    }
    if (
        dashboardPeriod ===
            "all"
    ) {
        dashboardPeriodSummary
            .textContent =
                "Todos os registros do CRM";
        return;
    }
    const range =
        getDashboardPeriodRange();
    if (
        !range
    ) {
        dashboardPeriodSummary
            .textContent =
                "Período selecionado";
        return;
    }
    const start =
        formatDashboardPeriodDate(
            range.start
        );
    const end =
        formatDashboardPeriodDate(
            range.end
        );
    if (
        dashboardPeriod ===
            "today"
    ) {
        dashboardPeriodSummary
            .textContent =
                `${start} · até agora`;
        return;
    }
    dashboardPeriodSummary
        .textContent =
            `${start} — ${end}`;
}
dashboardPeriodFilter.addEventListener(
    "change",
    function () {
        dashboardPeriod =
            dashboardPeriodFilter.value;
        updateDashboardPeriodSummary();
        updateDashboardMetrics();
        renderDashboardStatusChart();
        renderDashboardOriginChart();
        renderDashboardServiceChart();
    }
);
/* =========================================================
   LOGIN
========================================================= */
/* =========================================================
   LIMPEZA DOS MODAIS AO ENCERRAR A SESSÃO
========================================================= */
function clearAdminModalsOnLogout() {
    updateContactsExportButton();
    updateFinanceContractsExportButton();
    updateFinancePaymentsExportButton();
    updateCommercialReportButton();
    updateFinancialReportButton();
    stopContactHistoryListener();
    stopPaymentHistoryListener();
    resetFinanceFilters();
    clearAllContactsFilters(false);
    contactsViewMode = "ativos";
    updateContactsViewButtons();
    [
        contactModal,
        closingModal,
        manualContactModal,
        financeEditModal,
        paymentModal,
        paymentHistoryModal
    ].forEach(function (modal) {
        modal.classList.add("hidden");
    });
    selectedContactId = null;
    selectedFinanceContactId = null;
    selectedFinanceEditContactId = null;
    selectedPaymentHistoryContactId = null;
    selectedPaymentTarget = null;
    paymentHistoryRecords = [];
    contactHistoryList.innerHTML = "";
    contactHistoryCount.textContent = "0 registros";
    paymentHistoryList.innerHTML = "";
    paymentHistoryCount.textContent = "0 pagamentos";
    document.body.style.overflow = "";
}
/* =========================================================
   EXPORTAÇÃO DE CONTATOS
========================================================= */
const exportContactsButton =
    document.getElementById("exportContactsButton");
let contactsExportInFlight = false;
function updateContactsExportButton() {
    if (!exportContactsButton) {
        return;
    }
    const canExport = Boolean(
        session.currentUser &&
        currentAdminProfile &&
        ["owner", "manager"].includes(currentAdminProfile.role)
    );
    exportContactsButton.classList.toggle(
        "hidden",
        !canExport
    );
    exportContactsButton.disabled =
        !canExport || contactsExportInFlight;
    exportContactsButton.textContent =
        contactsExportInFlight
            ? "Exportando..."
            : "Exportar CSV";
}
if (exportContactsButton) {
    exportContactsButton.addEventListener(
        "click",
        async function () {
            if (contactsExportInFlight) {
                return;
            }
            const currentUser = session.currentUser;
            if (
                !currentUser ||
                !currentAdminProfile ||
                !["owner", "manager"].includes(
                    currentAdminProfile.role
                )
            ) {
                return;
            }
            const contactIds = [
                ...new Set(
                    getFilteredContacts().map(function (contact) {
                        return contact.id;
                    })
                )
            ];
            if (contactIds.length === 0) {
                window.alert(
                    "Não há contatos nos filtros atuais para exportar."
                );
                return;
            }
            if (contactIds.length > 1000) {
                window.alert(
                    "Exporte até 1.000 contatos por vez. " +
                    "Use os filtros para reduzir a seleção."
                );
                return;
            }
            function isCurrentSession() {
                return (
                    session.currentUser === currentUser &&
                    Boolean(currentAdminProfile) &&
                    ["owner", "manager"].includes(
                        currentAdminProfile.role
                    )
                );
            }
            contactsExportInFlight = true;
            updateContactsExportButton();
            try {
                
                if (!isCurrentSession()) {
                    return;
                }
                const apiResponse = await localRequest(
                    "admin-export-contacts",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            contactIds
                        })
                    }
                );
                if (!apiResponse.ok) {
                    const errorData = await apiResponse
                        .json()
                        .catch(function () {
                            return {};
                        });
                    throw new Error(
                        errorData.error ||
                        "Não foi possível exportar os contatos."
                    );
                }
                const contentType =
                    apiResponse.headers.get("Content-Type") || "";
                if (!contentType.includes("text/csv")) {
                    throw new Error(
                        "A demonstração não gerou um arquivo CSV válido."
                    );
                }
                const csvBlob = await apiResponse.blob();
                if (!isCurrentSession()) {
                    return;
                }
                const downloadUrl =
                    URL.createObjectURL(csvBlob);
                const downloadLink =
                    document.createElement("a");
                const exportDate = new Date()
                    .toISOString()
                    .slice(0, 10);
                downloadLink.href = downloadUrl;
                downloadLink.download =
                    `roasce-contatos-${exportDate}.csv`;
                downloadLink.hidden = true;
                document.body.appendChild(downloadLink);
                try {
                    downloadLink.click();
                } finally {
                    downloadLink.remove();
                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 1000);
                }
            } catch (error) {
                console.error(
                    "Erro ao exportar contatos:",
                    error
                );
                if (isCurrentSession()) {
                    window.alert(
                        error.message ||
                        "Não foi possível exportar os contatos."
                    );
                }
            } finally {
                contactsExportInFlight = false;
                updateContactsExportButton();
            }
        }
    );
}
/* =========================================================
   EXPORTAÇÃO DOS CONTRATOS FINANCEIROS
========================================================= */
const exportFinanceContractsButton =
    document.getElementById("exportFinanceContractsButton");
let financeContractsExportInFlight = false;
function updateFinanceContractsExportButton() {
    if (!exportFinanceContractsButton) {
        return;
    }
    const canExport = Boolean(
        session.currentUser &&
        currentAdminProfile &&
        currentAdminProfile.role === "owner"
    );
    exportFinanceContractsButton.classList.toggle(
        "hidden",
        !canExport
    );
    exportFinanceContractsButton.disabled =
        !canExport || financeContractsExportInFlight;
    exportFinanceContractsButton.textContent =
        financeContractsExportInFlight
            ? "Exportando..."
            : "Exportar contratos";
}
if (exportFinanceContractsButton) {
    exportFinanceContractsButton.addEventListener(
        "click",
        async function () {
            if (financeContractsExportInFlight) {
                return;
            }
            const currentUser = session.currentUser;
            if (
                !currentUser ||
                !currentAdminProfile ||
                currentAdminProfile.role !== "owner"
            ) {
                return;
            }
            const financeIds = [
                ...new Set(
                    getFilteredFinanceRecords().map(function (record) {
                        return record.id;
                    })
                )
            ];
            if (financeIds.length === 0) {
                window.alert(
                    "Não há contratos na seleção atual para exportar. " +
                    "Aguarde o carregamento da lista ou confira os filtros."
                );
                return;
            }
            if (financeIds.length > 1000) {
                window.alert(
                    "Exporte até 1.000 contratos por vez. " +
                    "Reduza a seleção e tente novamente."
                );
                return;
            }
            function isCurrentSession() {
                return (
                    session.currentUser === currentUser &&
                    Boolean(currentAdminProfile) &&
                    currentAdminProfile.role === "owner"
                );
            }
            financeContractsExportInFlight = true;
            updateFinanceContractsExportButton();
            try {
                
                if (!isCurrentSession()) {
                    return;
                }
                const apiResponse = await localRequest(
                    "admin-export-finance-contracts",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            financeIds
                        })
                    }
                );
                if (!apiResponse.ok) {
                    const errorData = await apiResponse
                        .json()
                        .catch(function () {
                            return {};
                        });
                    throw new Error(
                        errorData.error ||
                        "Não foi possível exportar os contratos."
                    );
                }
                const contentType =
                    apiResponse.headers.get("Content-Type") || "";
                if (!contentType.includes("text/csv")) {
                    throw new Error(
                        "A demonstração não gerou um arquivo CSV válido."
                    );
                }
                const csvBlob = await apiResponse.blob();
                if (!isCurrentSession()) {
                    return;
                }
                const downloadUrl =
                    URL.createObjectURL(csvBlob);
                const downloadLink =
                    document.createElement("a");
                const exportDate = new Date()
                    .toISOString()
                    .slice(0, 10);
                downloadLink.href = downloadUrl;
                downloadLink.download =
                    `roasce-contratos-${exportDate}.csv`;
                downloadLink.hidden = true;
                document.body.appendChild(downloadLink);
                try {
                    downloadLink.click();
                } finally {
                    downloadLink.remove();
                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 1000);
                }
            } catch (error) {
                console.error(
                    "Erro ao exportar contratos:",
                    error
                );
                if (isCurrentSession()) {
                    window.alert(
                        error.message ||
                        "Não foi possível exportar os contratos."
                    );
                }
            } finally {
                financeContractsExportInFlight = false;
                updateFinanceContractsExportButton();
            }
        }
    );
}
/* =========================================================
   EXPORTAÇÃO DOS PAGAMENTOS
========================================================= */
const exportFinancePaymentsButton =
    document.getElementById("exportFinancePaymentsButton");
let financePaymentsExportInFlight = false;
function updateFinancePaymentsExportButton() {
    if (!exportFinancePaymentsButton) {
        return;
    }
    const canExport = Boolean(
        session.currentUser &&
        currentAdminProfile &&
        currentAdminProfile.role === "owner"
    );
    exportFinancePaymentsButton.classList.toggle(
        "hidden",
        !canExport
    );
    exportFinancePaymentsButton.disabled =
        !canExport || financePaymentsExportInFlight;
    exportFinancePaymentsButton.textContent =
        financePaymentsExportInFlight
            ? "Exportando..."
            : "Exportar pagamentos";
}
if (exportFinancePaymentsButton) {
    exportFinancePaymentsButton.addEventListener(
        "click",
        async function () {
            if (financePaymentsExportInFlight) {
                return;
            }
            const currentUser = session.currentUser;
            if (
                !currentUser ||
                !currentAdminProfile ||
                currentAdminProfile.role !== "owner"
            ) {
                return;
            }
            const financeIds = [
                ...new Set(
                    getFilteredFinanceRecords().map(function (record) {
                        return record.id;
                    })
                )
            ];
            if (financeIds.length === 0) {
                window.alert(
                    "Não há contratos na seleção atual. " +
                    "Aguarde o carregamento da lista ou confira os filtros."
                );
                return;
            }
            if (financeIds.length > 1000) {
                window.alert(
                    "Selecione até 1.000 contratos por exportação."
                );
                return;
            }
            function isCurrentSession() {
                return (
                    session.currentUser === currentUser &&
                    Boolean(currentAdminProfile) &&
                    currentAdminProfile.role === "owner"
                );
            }
            financePaymentsExportInFlight = true;
            updateFinancePaymentsExportButton();
            try {
                
                if (!isCurrentSession()) {
                    return;
                }
                const apiResponse = await localRequest(
                    "admin-export-finance-payments",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            financeIds
                        })
                    }
                );
                if (!apiResponse.ok) {
                    const errorData = await apiResponse
                        .json()
                        .catch(function () {
                            return {};
                        });
                    throw new Error(
                        errorData.error ||
                        "Não foi possível exportar os pagamentos."
                    );
                }
                const contentType =
                    apiResponse.headers.get("Content-Type") || "";
                if (!contentType.includes("text/csv")) {
                    throw new Error(
                        "A demonstração não gerou um arquivo CSV válido."
                    );
                }
                const csvBlob = await apiResponse.blob();
                if (!isCurrentSession()) {
                    return;
                }
                const downloadUrl =
                    URL.createObjectURL(csvBlob);
                const downloadLink =
                    document.createElement("a");
                const exportDate = new Date()
                    .toISOString()
                    .slice(0, 10);
                downloadLink.href = downloadUrl;
                downloadLink.download =
                    `roasce-pagamentos-${exportDate}.csv`;
                downloadLink.hidden = true;
                document.body.appendChild(downloadLink);
                try {
                    downloadLink.click();
                } finally {
                    downloadLink.remove();
                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 1000);
                }
            } catch (error) {
                console.error(
                    "Erro ao exportar pagamentos:",
                    error
                );
                if (isCurrentSession()) {
                    window.alert(
                        error.message ||
                        "Não foi possível exportar os pagamentos."
                    );
                }
            } finally {
                financePaymentsExportInFlight = false;
                updateFinancePaymentsExportButton();
            }
        }
    );
}
/* =========================================================
   RELATÓRIO COMERCIAL
========================================================= */
const exportCommercialReportButton =
    document.getElementById("exportCommercialReportButton");
let commercialReportInFlight = false;
function updateCommercialReportButton() {
    if (!exportCommercialReportButton) {
        return;
    }
    const canExport = Boolean(
        session.currentUser &&
        currentAdminProfile &&
        ["owner", "manager"].includes(currentAdminProfile.role)
    );
    exportCommercialReportButton.classList.toggle(
        "hidden",
        !canExport
    );
    exportCommercialReportButton.disabled =
        !canExport || commercialReportInFlight;
    exportCommercialReportButton.textContent =
        commercialReportInFlight
            ? "Gerando relatório..."
            : "Exportar relatório comercial";
}
if (exportCommercialReportButton) {
    exportCommercialReportButton.addEventListener(
        "click",
        async function () {
            if (commercialReportInFlight) {
                return;
            }
            const currentUser = session.currentUser;
            if (
                !currentUser ||
                !currentAdminProfile ||
                !["owner", "manager"].includes(
                    currentAdminProfile.role
                )
            ) {
                return;
            }
            /*
               Guarda o período no momento do clique.
            */
            const range = getDashboardPeriodRange();
            const reportPeriod = {
                startMs: range ? range.start : null,
                endMs: range ? range.end : null
            };
            function isCurrentSession() {
                return (
                    session.currentUser === currentUser &&
                    Boolean(currentAdminProfile) &&
                    ["owner", "manager"].includes(
                        currentAdminProfile.role
                    )
                );
            }
            commercialReportInFlight = true;
            updateCommercialReportButton();
            try {
                
                if (!isCurrentSession()) {
                    return;
                }
                const apiResponse = await localRequest(
                    "admin-export-commercial-report",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(reportPeriod)
                    }
                );
                if (!apiResponse.ok) {
                    const errorData = await apiResponse
                        .json()
                        .catch(function () {
                            return {};
                        });
                    throw new Error(
                        errorData.error ||
                        "Não foi possível gerar o relatório comercial."
                    );
                }
                const contentType =
                    apiResponse.headers.get("Content-Type") || "";
                if (!contentType.includes("text/csv")) {
                    throw new Error(
                        "A demonstração não gerou um arquivo CSV válido."
                    );
                }
                const csvBlob = await apiResponse.blob();
                if (!isCurrentSession()) {
                    return;
                }
                const downloadUrl =
                    URL.createObjectURL(csvBlob);
                const downloadLink =
                    document.createElement("a");
                const exportDate = new Date()
                    .toISOString()
                    .slice(0, 10);
                downloadLink.href = downloadUrl;
                downloadLink.download =
                    `roasce-relatorio-comercial-${exportDate}.csv`;
                downloadLink.hidden = true;
                document.body.appendChild(downloadLink);
                try {
                    downloadLink.click();
                } finally {
                    downloadLink.remove();
                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 1000);
                }
            } catch (error) {
                console.error(
                    "Erro ao gerar relatório comercial:",
                    error
                );
                if (isCurrentSession()) {
                    window.alert(
                        error.message ||
                        "Não foi possível gerar o relatório comercial."
                    );
                }
            } finally {
                commercialReportInFlight = false;
                updateCommercialReportButton();
            }
        }
    );
}
/* =========================================================
   RELATÓRIO FINANCEIRO
========================================================= */
const exportFinancialReportButton =
    document.getElementById("exportFinancialReportButton");
let financialReportInFlight = false;
function updateFinancialReportButton() {
    if (!exportFinancialReportButton) {
        return;
    }
    const canExport = Boolean(
        session.currentUser &&
        currentAdminProfile &&
        currentAdminProfile.role === "owner"
    );
    exportFinancialReportButton.classList.toggle(
        "hidden",
        !canExport
    );
    exportFinancialReportButton.disabled =
        !canExport || financialReportInFlight;
    exportFinancialReportButton.textContent =
        financialReportInFlight
            ? "Gerando relatório..."
            : "Exportar relatório financeiro";
}
if (exportFinancialReportButton) {
    exportFinancialReportButton.addEventListener(
        "click",
        async function () {
            if (financialReportInFlight) {
                return;
            }
            const currentUser = session.currentUser;
            if (
                !currentUser ||
                !currentAdminProfile ||
                currentAdminProfile.role !== "owner"
            ) {
                return;
            }
            const range = getDashboardPeriodRange();
            const reportPeriod = {
                startMs: range ? range.start : null,
                endMs: range ? range.end : null
            };
            function isCurrentSession() {
                return (
                    session.currentUser === currentUser &&
                    Boolean(currentAdminProfile) &&
                    currentAdminProfile.role === "owner"
                );
            }
            financialReportInFlight = true;
            updateFinancialReportButton();
            try {
                
                if (!isCurrentSession()) {
                    return;
                }
                const apiResponse = await localRequest(
                    "admin-export-financial-report",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(reportPeriod)
                    }
                );
                if (!apiResponse.ok) {
                    const errorData = await apiResponse
                        .json()
                        .catch(function () {
                            return {};
                        });
                    throw new Error(
                        errorData.error ||
                        "Não foi possível gerar o relatório financeiro."
                    );
                }
                const contentType =
                    apiResponse.headers.get("Content-Type") || "";
                if (!contentType.includes("text/csv")) {
                    throw new Error(
                        "A demonstração não gerou um arquivo CSV válido."
                    );
                }
                const csvBlob = await apiResponse.blob();
                if (!isCurrentSession()) {
                    return;
                }
                const downloadUrl =
                    URL.createObjectURL(csvBlob);
                const downloadLink =
                    document.createElement("a");
                const exportDate = new Date()
                    .toISOString()
                    .slice(0, 10);
                downloadLink.href = downloadUrl;
                downloadLink.download =
                    `roasce-relatorio-financeiro-${exportDate}.csv`;
                downloadLink.hidden = true;
                document.body.appendChild(downloadLink);
                try {
                    downloadLink.click();
                } finally {
                    downloadLink.remove();
                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 1000);
                }
            } catch (error) {
                console.error(
                    "Erro ao gerar relatório financeiro:",
                    error
                );
                if (isCurrentSession()) {
                    window.alert(
                        error.message ||
                        "Não foi possível gerar o relatório financeiro."
                    );
                }
            } finally {
                financialReportInFlight = false;
                updateFinancialReportButton();
            }
        }
    );
}
/* =========================================================
   PERFIL ADMINISTRATIVO
========================================================= */
async function startDemo() {
    try {
        currentAdminProfile = { ...demoActor };
        loginScreen.classList.add("hidden");
        adminApp.classList.remove("hidden");
        adminEmailDisplay.textContent = "Visitante · visão Owner";
        auditTabButton.classList.remove("hidden");
        financeTabButton.classList.remove("hidden");
        showDashboardView();
        startContactsListener();
        startFinanceClock();
    } catch (error) {
        console.error("Não foi possível abrir a demonstração:", error);
        adminApp.classList.add("hidden");
        loginScreen.classList.remove("hidden");
        loginError.textContent = "Não foi possível abrir a demonstração. Recarregue a página ou reinicie os dados.";
    }
}
logoutButton.addEventListener("click", () => { window.location.href = "/"; });
window.addEventListener("pagehide", () => {
    stopFinanceClock(); stopAuditListener(); stopFinanceListener();
    stopDashboardActivityListener(); stopDashboardFinanceListener(); stopDashboardFollowupClock();
    stopContactHistoryListener(); stopPaymentHistoryListener();
    if (unsubscribeContacts) unsubscribeContacts();
});
/* =========================================================
   FINANCEIRO — FORMATAÇÃO
========================================================= */
function formatFinanceMoney(
    cents
) {
    const numericCents =
        Number(
            cents
        );
    if (
        !Number.isSafeInteger(
            numericCents
        )
        ||
        numericCents < 0
    ) {
        return "—";
    }
    return new Intl.NumberFormat(
        "pt-BR",
        {
            style:
                "currency",
            currency:
                "BRL"
        }
    )
        .format(
            numericCents / 100
        );
}
function financeBillingLabel(
    billingType
) {
    if (
        billingType ===
            "monthly"
    ) {
        return "Mensal";
    }
    if (
        billingType ===
            "one_time"
    ) {
        return "Pagamento único";
    }
    return "—";
}
function formatFinanceDate(
    value
) {
    const milliseconds =
        timestampToMilliseconds(
            value
        );
    if (
        milliseconds === null
    ) {
        return "—";
    }
    return new Date(
        milliseconds
    )
        .toLocaleDateString(
            "pt-BR"
        );
}
function formatFinanceDateInput(
    value
) {
    const milliseconds =
        timestampToMilliseconds(
            value
        );
    if (
        milliseconds === null
    ) {
        return "";
    }
    const date =
        new Date(
            milliseconds
        );
    const year =
        date.getFullYear();
    const month =
        String(
            date.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );
    const day =
        String(
            date.getDate()
        )
            .padStart(
                2,
                "0"
            );
    return `${year}-${month}-${day}`;
}
function formatFinanceMoneyInput(
    cents
) {
    const numericCents =
        Number(
            cents
        );
    if (
        !Number.isSafeInteger(
            numericCents
        )
    ) {
        return "";
    }
    return new Intl.NumberFormat(
        "pt-BR",
        {
            style:
                "currency",
            currency:
                "BRL"
        }
    )
        .format(
            numericCents / 100
        );
}
/* =========================================================
   FINANCEIRO — ATUALIZAÇÃO NA MUDANÇA DO DIA
========================================================= */
let financeDayTimer = null;
let lastFinanceDayKey = "";
function refreshFinanceByTime() {
    const now = new Date();
    const dayKey =
        `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    if (dayKey === lastFinanceDayKey) {
        return;
    }
    lastFinanceDayKey = dayKey;
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !== "owner"
    ) {
        return;
    }
    /* Atualiza a aba Financeiro quando estiver aberta. */
    if (
        !financeView.classList.contains(
            "hidden"
        )
    ) {
        updateFinanceMetrics();
        renderFinanceRecords();
    }
    /* Atualiza a carteira financeira do Dashboard. */
    if (
        !dashboardView.classList.contains(
            "hidden"
        )
        &&
        dashboardFinanceLoaded
    ) {
        renderDashboardFinanceChart();
    }
}
function stopFinanceClock() {
    if (financeDayTimer !== null) {
        clearInterval(
            financeDayTimer
        );
    }
    financeDayTimer = null;
    lastFinanceDayKey = "";
}
function startFinanceClock() {
    stopFinanceClock();
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !== "owner"
    ) {
        return;
    }
    refreshFinanceByTime();
    financeDayTimer =
        setInterval(
            refreshFinanceByTime,
            30000
        );
}
/*
   Confere a data também quando o usuário
   volta para a aba do navegador.
*/
document.addEventListener(
    "visibilitychange",
    function () {
        if (
            document.visibilityState ===
                "visible"
        ) {
            refreshFinanceByTime();
        }
    }
);
function getFinancePaymentStatus(
    record
) {
    const isMonthly =
        record.billingType ===
            "monthly";
    /*
       PAGAMENTO ÚNICO
       Aqui "paid" realmente significa
       que não existe outra cobrança.
    */
    if (
        !isMonthly
        &&
        record.paymentStatus ===
            "paid"
    ) {
        return {
            key:
                "paid",
            label:
                "Pago",
            legacyMonthly:
                false
        };
    }
    /*
       CONTRATO MENSAL LEGADO
       Versão antiga do financeiro:
       mensalidade foi marcada como paid,
       mas ainda não foi convertida para
       finance_payments + próxima cobrança.
    */
    if (
        isMonthly
        &&
        record.paymentStatus ===
            "paid"
    ) {
        return {
            key:
                "paid",
            label:
                "Pago",
            legacyMonthly:
                true
        };
    }
    const dueMilliseconds =
        timestampToMilliseconds(
            record.nextPaymentDueAt
        );
    if (
        dueMilliseconds !==
            null
    ) {
        const dueDate =
            new Date(
                dueMilliseconds
            );
        const dueDay =
            new Date(
                dueDate.getFullYear(),
                dueDate.getMonth(),
                dueDate.getDate()
            )
                .getTime();
        const now =
            new Date();
        const today =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            )
                .getTime();
        /*
           Vencimento já passou.
        */
        if (
            dueDay < today
        ) {
            return {
                key:
                    "overdue",
                label:
                    "Atrasado",
                legacyMonthly:
                    false
            };
        }
        /*
           Contrato mensal já teve pelo
           menos uma mensalidade paga e
           a próxima ainda está no futuro.
        */
        if (
            isMonthly
            &&
            record.lastPaidAt
            &&
            dueDay > today
        ) {
            return {
                key:
                    "up_to_date",
                label:
                    "Em dia",
                legacyMonthly:
                    false
            };
        }
    }
    return {
        key:
            "pending",
        label:
            "Pendente",
        legacyMonthly:
            false
    };
}
/* =========================================================
   INDICADORES FINANCEIROS
========================================================= */
function updateFinanceMetrics() {
    let monthlyContractedCents =
        0;
    let oneTimeContractedCents =
        0;
    let receivedCents =
        0;
    let pendingCents =
        0;
    let overdueCents =
        0;
    /* =====================================================
       CONTRATOS / COBRANÇAS ATUAIS
    ===================================================== */
    financeRecords.forEach(
        function (record) {
            const valueCents =
                Number(
                    record.contractValueCents
                );
            if (
                !Number.isSafeInteger(
                    valueCents
                )
                ||
                valueCents <= 0
            ) {
                return;
            }
            /* VALOR CONTRATADO */
            if (
                record.billingType ===
                    "monthly"
            ) {
                monthlyContractedCents +=
                    valueCents;
            }
            else if (
                record.billingType ===
                    "one_time"
            ) {
                oneTimeContractedCents +=
                    valueCents;
            }
            /* SITUAÇÃO DA COBRANÇA ATUAL */
            const paymentStatus =
                getFinancePaymentStatus(
                    record
                );
            /*
               Mensal legado já foi pago,
               mas ainda aguarda conversão
               para a nova estrutura.
               Não contamos novamente como
               pendente ou atrasado.
            */
            if (
                paymentStatus.legacyMonthly ===
                    true
            ) {
                return;
            }
            if (
                paymentStatus.key ===
                    "overdue"
            ) {
                overdueCents +=
                    valueCents;
                return;
            }
            if (
                paymentStatus.key ===
                    "pending"
                ||
                paymentStatus.key ===
                    "up_to_date"
            ) {
                pendingCents +=
                    valueCents;
            }
        }
    );
    /* =====================================================
       RECEBIMENTOS REAIS
    ===================================================== */
    financePayments.forEach(
        function (payment) {
            if (
                payment.status !==
                    "paid"
            ) {
                return;
            }
            const amountCents =
                Number(
                    payment.amountCents
                );
            if (
                !Number.isSafeInteger(
                    amountCents
                )
                ||
                amountCents <= 0
            ) {
                return;
            }
            receivedCents +=
                amountCents;
        }
    );
    /* =====================================================
       INTERFACE
    ===================================================== */
    financeMetricMonthly.textContent =
        formatFinanceMoney(
            monthlyContractedCents
        );
    financeMetricOneTime.textContent =
        formatFinanceMoney(
            oneTimeContractedCents
        );
    financeMetricPending.textContent =
        formatFinanceMoney(
            pendingCents
        );
    financeMetricOverdue.textContent =
        formatFinanceMoney(
            overdueCents
        );
    financeMetricReceived.textContent =
        financePaymentsError
            ? "Erro"
            : formatFinanceMoney(
                receivedCents
            );
}
/* =========================================================
   FINANCEIRO — FILTRO VINDO DO DASHBOARD
========================================================= */
function getDashboardFinanceRecordKey(
    record
) {
    const paymentStatus =
        getFinancePaymentStatus(
            record
        );
    if (
        paymentStatus.legacyMonthly ===
            true
    ) {
        return null;
    }
    if (
        paymentStatus.key ===
            "overdue"
    ) {
        return "overdue";
    }
    if (
        paymentStatus.key ===
            "pending"
        ||
        paymentStatus.key ===
            "up_to_date"
    ) {
        return "pending";
    }
    return null;
}
/* =========================================================
   FINANCEIRO — FILTROS APLICADOS
========================================================= */
const financeClosedFrom =
    document.getElementById("financeClosedFrom");
const financeClosedTo =
    document.getElementById("financeClosedTo");
const financeBillingFilter =
    document.getElementById("financeBillingFilter");
const financePaymentStatusFilter =
    document.getElementById("financePaymentStatusFilter");
const applyFinanceFiltersButton =
    document.getElementById("applyFinanceFiltersButton");
const clearFinanceFiltersButton =
    document.getElementById("clearFinanceFiltersButton");
const financeFiltersError =
    document.getElementById("financeFiltersError");
let financeClosedPeriodRange = null;
let financeAppliedBillingType = "todos";
function syncFinanceFilterControls() {
    financeClosedFrom.value = financeClosedPeriodRange
        ? formatContactsDateInput(financeClosedPeriodRange.start)
        : "";
    financeClosedTo.value = financeClosedPeriodRange
        ? formatContactsDateInput(financeClosedPeriodRange.end)
        : "";
    financeBillingFilter.value = financeAppliedBillingType;
    financePaymentStatusFilter.value =
        dashboardFinanceListFilter || "todos";
    financeFiltersError.textContent = "";
}
function resetFinanceFilters() {
    financeClosedPeriodRange = null;
    financeAppliedBillingType = "todos";
    dashboardFinanceListFilter = null;
    syncFinanceFilterControls();
}
function getFilteredFinanceRecords() {
    return financeRecords.filter(function (record) {
        if (
            financeAppliedBillingType !== "todos" &&
            record.billingType !== financeAppliedBillingType
        ) {
            return false;
        }
        if (financeClosedPeriodRange) {
            const closedAt =
                timestampToMilliseconds(record.closedAt);
            if (
                !Number.isFinite(closedAt) ||
                closedAt < financeClosedPeriodRange.start ||
                closedAt > financeClosedPeriodRange.end
            ) {
                return false;
            }
        }
        if (dashboardFinanceListFilter) {
            const status = getFinancePaymentStatus(record).key;
            if (dashboardFinanceListFilter === "pending_all") {
                if (
                    status !== "pending" &&
                    status !== "up_to_date"
                ) {
                    return false;
                }
            } else if (status !== dashboardFinanceListFilter) {
                return false;
            }
        }
        return true;
    });
}
applyFinanceFiltersButton.disabled = false;
clearFinanceFiltersButton.disabled = false;
applyFinanceFiltersButton.addEventListener(
    "click",
    function () {
        if (
            !currentAdminProfile ||
            currentAdminProfile.role !== "owner"
        ) {
            return;
        }
        financeFiltersError.textContent = "";
        if (
            !financeClosedFrom.validity.valid ||
            !financeClosedTo.validity.valid
        ) {
            financeFiltersError.textContent =
                "Informe datas válidas.";
            return;
        }
        const fromValue = financeClosedFrom.value;
        const toValue = financeClosedTo.value;
        const fromDate = fromValue
            ? parseContactsDateInput(fromValue)
            : null;
        const toDate = toValue
            ? parseContactsDateInput(toValue)
            : null;
        if (
            (fromValue && !fromDate) ||
            (toValue && !toDate)
        ) {
            financeFiltersError.textContent =
                "Informe datas válidas.";
            return;
        }
        if (
            fromDate &&
            toDate &&
            fromDate.getTime() > toDate.getTime()
        ) {
            financeFiltersError.textContent =
                "A data inicial não pode ser posterior à data final.";
            return;
        }
        const billingType = financeBillingFilter.value;
        const paymentStatus = financePaymentStatusFilter.value;
        if (
            !["todos", "monthly", "one_time"].includes(billingType) ||
            ![
                "todos",
                "pending_all",
                "pending",
                "overdue",
                "up_to_date",
                "paid"
            ].includes(paymentStatus)
        ) {
            financeFiltersError.textContent =
                "Selecione filtros válidos.";
            return;
        }
        let periodRange = null;
        if (fromDate || toDate) {
            let end = Infinity;
            if (toDate) {
                const nextDay = new Date(toDate.getTime());
                nextDay.setDate(nextDay.getDate() + 1);
                end = nextDay.getTime() - 1;
            }
            periodRange = {
                start: fromDate
                    ? fromDate.getTime()
                    : -Infinity,
                end
            };
        }
        financeClosedPeriodRange = periodRange;
        financeAppliedBillingType = billingType;
        dashboardFinanceListFilter =
            paymentStatus === "todos"
                ? null
                : paymentStatus;
        syncFinanceFilterControls();
        renderFinanceRecords();
    }
);
clearFinanceFiltersButton.addEventListener(
    "click",
    function () {
        if (
            !currentAdminProfile ||
            currentAdminProfile.role !== "owner"
        ) {
            return;
        }
        resetFinanceFilters();
        renderFinanceRecords();
    }
);
function renderFinanceRecords() {
const visibleFinanceRecords = getFilteredFinanceRecords();
    financeCount.textContent =
       visibleFinanceRecords.length === 1
           ? "1 contrato"
           : `${visibleFinanceRecords.length} contratos`;
    if (
        visibleFinanceRecords.length === 0
    ) {
        financeList.innerHTML =
            `
                <div class="finance-empty">
                    Nenhum contrato fechado registrado.
                </div>
            `;
        return;
    }
    financeList.innerHTML =
        visibleFinanceRecords
            .map(
                function (record) {
                    const paymentStatus =
                        getFinancePaymentStatus(
                            record
                        );
                    const clientName =
                        record.contactCompany
                        ||
                        record.contactName
                        ||
                        "Cliente não informado";
                    const secondaryName =
                        (
                            record.contactCompany
                            &&
                            record.contactName
                        )
                            ? record.contactName
                            : record.service
                                ||
                                "—";
                    const seller =
                        record.closedByEmail
                        ||
                        "Usuário não informado";
                    const role =
                        roleLabel(
                            record.closedByRole
                        );
                    const value =
                        formatFinanceMoney(
                            record.contractValueCents
                        );
                    const billing =
                        financeBillingLabel(
                            record.billingType
                        );
                    const recurring =
                        record.billingType ===
                            "monthly"
                        &&
                        record.recurringDay
                            ? `Dia ${record.recurringDay} de cada mês`
                            : billing;
                    return `
                        <article class="finance-row">
                            <div class="finance-client">
                                <strong>
                                    ${escapeHTML(clientName)}
                                </strong>
                                <span>
                                    ${escapeHTML(secondaryName)}
                                </span>
                            </div>
                            <div class="finance-seller">
                                <strong>
                                    ${escapeHTML(seller)}
                                </strong>
                                <span>
                                    ${escapeHTML(role)}
                                </span>
                            </div>
                            <div class="finance-date">
                                ${escapeHTML(
                                    formatFinanceDate(
                                        record.closedAt
                                    )
                                )}
                            </div>
                            <div class="finance-contract">
                                <strong class="finance-value">
                                    ${escapeHTML(value)}
                                </strong>
                                <span>
                                    ${escapeHTML(billing)}
                                </span>
                            </div>
                            <div class="finance-contract">
                                <strong>
                                    ${escapeHTML(
                                        formatFinanceDate(
                                            record.nextPaymentDueAt
                                        )
                                    )}
                                </strong>
                                <span>
                                    ${escapeHTML(recurring)}
                                </span>
                            </div>
                            <div class="finance-status-cell">
                                     <span
                                         class="
                                             finance-status
                                             ${escapeHTML(paymentStatus.key)}
                                         "
                                     >
                                         ${escapeHTML(paymentStatus.label)}
                                     </span>
                                     ${
                                         record.billingType ===
                                             "monthly"
                                         &&
                                         (
                                             record.lastPaidAt
                                             ||
                                             (
                                                 paymentStatus.legacyMonthly
                                                 &&
                                                 record.paidAt
                                             )
                                         )
                                             ? `
                                                 <span class="finance-paid-date">
                                                     Último pagamento: ${
                                                         escapeHTML(
                                                             formatFinanceDate(
                                                                 record.lastPaidAt
                                                                 ||
                                                                 record.paidAt
                                                             )
                                                         )
                                                     }
                                                 </span>
                                             `
                                             : paymentStatus.key ===
                                                 "paid"
                                                 ? `
                                                     <span class="finance-paid-date">
                                                         Pago em ${
                                                             escapeHTML(
                                                                 formatFinanceDate(
                                                                     record.paidAt
                                                                 )
                                                             )
                                                         }
                                                     </span>
                                                 `
                                                 : ""
                                     }
                                     ${
                                         record.billingType ===
                                             "monthly"
                                         ||
                                         paymentStatus.key !==
                                             "paid"
                                             ? `
                                                 <button
                                                     type="button"
                                                     class="finance-mark-paid-button"
                                                     data-contact-id="${escapeHTML(
                                                         record.contactId ||
                                                         record.id
                                                     )}"
                                                 >
                                                     ${
                                                         paymentStatus.legacyMonthly
                                                             ? "Preparar próxima cobrança"
                                                             : record.billingType ===
                                                                 "monthly"
                                                                 ? "Registrar pagamento"
                                                                 : "Marcar como pago"
                                                     }
                                                 </button>
                                             `
                                             : ""
                                     }
                                     <button
                                        type="button"
                                        class="finance-history-button"
                                        data-finance-history-id="${escapeHTML(
                                            record.contactId ||
                                            record.id
                                        )}"
                                    >
                                        Histórico
                                    </button>
                                    <button
                                        type="button"
                                        class="finance-edit-button"
                                        data-finance-edit-id="${escapeHTML(
                                            record.contactId ||
                                            record.id
                                        )}"
                                    >
                                        Editar
                                    </button>
                                 </div>
                        </article>
                    `;
                }
            )
            .join("");
}
   function updateFinanceEditBillingFields() {
       if (
           financeEditBillingType.value ===
               "monthly"
       ) {
           financeEditRecurringGroup
               .classList
               .remove(
                   "hidden"
               );
           return;
       }
       financeEditRecurringGroup
           .classList
           .add(
               "hidden"
           );
       financeEditRecurringDay.value =
           "";
   }
   function openFinanceEditModal(
    contactId
) {
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    const record =
        financeRecords.find(
            function (item) {
                return (
                    (
                        item.contactId ||
                        item.id
                    ) ===
                    contactId
                );
            }
        );
    if (
        !record
    ) {
        return;
    }
    selectedFinanceEditContactId =
        contactId;
    financeEditClientName.textContent =
        record.contactCompany
        ||
        record.contactName
        ||
        "Cliente";
    financeEditValue.value =
        formatFinanceMoneyInput(
            record.contractValueCents
        );
    financeEditBillingType.value =
        record.billingType ===
            "one_time"
            ? "one_time"
            : "monthly";
    financeEditPaymentDate.value =
        formatFinanceDateInput(
            record.nextPaymentDueAt
        );
    financeEditRecurringDay.value =
        record.recurringDay ??
        "";
    financeEditError.textContent =
        "";
    /*
       Ainda ficará desabilitado.
       Vamos conectar à API no 10.8.3.
    */
    financeEditSaveButton.disabled =
    false;
   financeEditSaveButton.textContent =
       "Salvar alterações";
    updateFinanceEditBillingFields();
    financeEditModal
        .classList
        .remove(
            "hidden"
        );
}
function closeFinanceEditModal() {
    financeEditModal
        .classList
        .add(
            "hidden"
        );
    selectedFinanceEditContactId =
        null;
    financeEditError.textContent =
        "";
   financeEditSaveButton.disabled =
       false;
   financeEditSaveButton.textContent =
       "Salvar alterações";
}
/* =========================================================
   PAGAMENTO — MODAL
========================================================= */
function openPaymentModal(
    contactId
) {
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    const record =
        financeRecords.find(
            function (item) {
                return (
                    (
                        item.contactId ||
                        item.id
                    ) ===
                    contactId
                );
            }
        );
    if (
        !record
    ) {
        return;
    }
   if (paymentRequestInFlight) {
       return;
   }
    const paymentStatus =
        getFinancePaymentStatus(
            record
        );
    if (
          paymentStatus.key ===
              "paid"
          &&
          !paymentStatus
              .legacyMonthly
      ) {
          return;
      }
    selectedFinanceContactId =
        contactId;
   const paymentDueMilliseconds =
       timestampToMilliseconds(
           record.nextPaymentDueAt
       );
   selectedPaymentTarget = {
       contactId: contactId,
       cycleKey:
           paymentDueMilliseconds === null
               ? ""
               : new Date(
                   paymentDueMilliseconds
               )
                   .toISOString()
                   .slice(0, 10),
       expectedAmountCents:
           record.contractValueCents,
       expectedBillingType:
           record.billingType
   };
    paymentClientName.textContent =
        record.contactCompany
        ||
        record.contactName
        ||
        "Cliente";
    paymentContractValue.textContent =
        formatFinanceMoney(
            record.contractValueCents
        );
    paymentDueDate.textContent =
        formatFinanceDate(
            record.nextPaymentDueAt
        );
    paymentCurrentStatus.textContent =
       paymentStatus.legacyMonthly
           ? "Pago — cobrança anterior"
           : paymentStatus.label;
    paymentError.textContent =
        "";
    paymentConfirmButton.disabled =
        false;
   paymentConfirmButton.textContent =
       paymentStatus.legacyMonthly
           ? "Preparar próxima cobrança"
           : "Confirmar pagamento";
    paymentModal
        .classList
        .remove(
            "hidden"
        );
}
function closePaymentModal() {
    if (paymentRequestInFlight) {
        return;
    }
    paymentModal
        .classList
        .add("hidden");
    selectedFinanceContactId = null;
    selectedPaymentTarget = null;
    paymentError.textContent = "";
    paymentConfirmButton.disabled = false;
    paymentConfirmButton.textContent =
        "Confirmar pagamento";
}
/* =========================================================
   HISTÓRICO DE PAGAMENTOS
========================================================= */
function stopPaymentHistoryListener() {
    if (
        unsubscribePaymentHistory
    ) {
        unsubscribePaymentHistory();
        unsubscribePaymentHistory =
            null;
    }
}
function paymentHistorySourceLabel(
    record
) {
    const source =
        record.provider
        ||
        record.source
        ||
        "";
    const labels = {
        manual:
            "Manual",
        mercadopago:
            "Mercado Pago"
    };
    return (
        labels[source]
        ||
        source
        ||
        "Não informado"
    );
}
function getPaymentHistoryStatus(
    status
) {
    const statuses = {
        paid: {
            key:
                "paid",
            label:
                "Pago"
        },
        pending: {
            key:
                "pending",
            label:
                "Pendente"
        },
        failed: {
            key:
                "failed",
            label:
                "Falhou"
        },
        refunded: {
            key:
                "refunded",
            label:
                "Estornado"
        }
    };
    return (
        statuses[status]
        ||
        {
            key:
                "unknown",
            label:
                status ||
                "Não informado"
        }
    );
}
function formatFinanceDateTime(
    value
) {
    const milliseconds =
        timestampToMilliseconds(
            value
        );
    if (
        milliseconds ===
            null
    ) {
        return "—";
    }
    return new Date(
        milliseconds
    )
        .toLocaleString(
            "pt-BR",
            {
                dateStyle:
                    "short",
                timeStyle:
                    "short"
            }
        );
}
function renderPaymentHistory() {
    paymentHistoryCount.textContent =
        paymentHistoryRecords.length === 1
            ? "1 pagamento"
            : `${paymentHistoryRecords.length} pagamentos`;
    if (
        paymentHistoryRecords.length ===
            0
    ) {
        paymentHistoryList.innerHTML =
            `
                <div class="payment-history-empty">
                    Nenhum pagamento registrado
                    no histórico deste contrato.
                </div>
            `;
        return;
    }
    paymentHistoryList.innerHTML =
        paymentHistoryRecords
            .map(
                function (record) {
                    const status =
                        getPaymentHistoryStatus(
                            record.status
                        );
                    const dueDate =
                        formatFinanceDate(
                            record.dueAt
                        );
                    const paidDate =
                        formatFinanceDateTime(
                            record.paidAt
                        );
                    const amount =
                        formatFinanceMoney(
                            record.amountCents
                        );
                    const source =
                        paymentHistorySourceLabel(
                            record
                        );
                    return `
                        <article class="payment-history-row">
                            <div>
                                <span class="payment-history-label">
                                    Competência
                                </span>
                                <strong>
                                    ${escapeHTML(dueDate)}
                                </strong>
                            </div>
                            <div>
                                <span class="payment-history-label">
                                    Valor
                                </span>
                                <strong>
                                    ${escapeHTML(amount)}
                                </strong>
                            </div>
                            <div>
                                <span class="payment-history-label">
                                    Pago em
                                </span>
                                <strong>
                                    ${escapeHTML(paidDate)}
                                </strong>
                            </div>
                            <div>
                                <span class="payment-history-label">
                                    Origem
                                </span>
                                <strong>
                                    ${escapeHTML(source)}
                                </strong>
                            </div>
                            <div>
                                <span class="payment-history-label">
                                    Situação
                                </span>
                                <span
                                    class="
                                        payment-history-status
                                        ${escapeHTML(status.key)}
                                    "
                                >
                                    ${escapeHTML(status.label)}
                                </span>
                            </div>
                        </article>
                    `;
                }
            )
            .join("");
}
function startPaymentHistoryListener(
    contactId
) {
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    stopPaymentHistoryListener();
    paymentHistoryRecords =
        [];
    paymentHistoryCount.textContent =
        "Carregando...";
    paymentHistoryList.innerHTML =
        `
            <div class="payment-history-loading">
                Carregando histórico...
            </div>
        `;
    /*
       Mantemos somente o WHERE no armazenamento local
       e ordenamos no navegador.
       Assim não dependemos de índice
       composto para where + orderBy.
    */
    const paymentsQuery =
        query(
            collection(
                db,
                "finance_payments"
            ),
            where(
                "contactId",
                "==",
                contactId
            )
        );
    unsubscribePaymentHistory =
        onSnapshot(
            paymentsQuery,
            function (snapshot) {
                paymentHistoryRecords =
                    snapshot.docs
                        .map(
                            function (document) {
                                return {
                                    id:
                                        document.id,
                                    ...document.data()
                                };
                            }
                        )
                        .sort(
                            function (a, b) {
                                const dateA =
                                    timestampToMilliseconds(
                                        a.dueAt
                                    )
                                    ||
                                    0;
                                const dateB =
                                    timestampToMilliseconds(
                                        b.dueAt
                                    )
                                    ||
                                    0;
                                return (
                                    dateB -
                                    dateA
                                );
                            }
                        );
                renderPaymentHistory();
            },
            function (error) {
                console.error(
                    "Erro ao carregar histórico de pagamentos:",
                    error
                );
                paymentHistoryRecords =
                    [];
                paymentHistoryCount.textContent =
                    "Erro";
                paymentHistoryList.innerHTML =
                    `
                        <div class="payment-history-error">
                            Não foi possível carregar
                            o histórico de pagamentos.
                        </div>
                    `;
            }
        );
}
function openPaymentHistoryModal(
    contactId
) {
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    const record =
        financeRecords.find(
            function (item) {
                return (
                    (
                        item.contactId ||
                        item.id
                    ) ===
                    contactId
                );
            }
        );
    if (
        !record
    ) {
        return;
    }
    selectedPaymentHistoryContactId =
        contactId;
    paymentHistoryClientName.textContent =
        record.contactCompany
        ||
        record.contactName
        ||
        "Cliente";
    paymentHistoryContractInfo.textContent =
        `${formatFinanceMoney(
            record.contractValueCents
        )} • ${financeBillingLabel(
            record.billingType
        )}`;
    paymentHistoryModal
        .classList
        .remove(
            "hidden"
        );
    startPaymentHistoryListener(
        contactId
    );
}
function closePaymentHistoryModal() {
    stopPaymentHistoryListener();
    paymentHistoryModal
        .classList
        .add(
            "hidden"
        );
    selectedPaymentHistoryContactId =
        null;
    paymentHistoryRecords =
        [];
    paymentHistoryCount.textContent =
        "0 pagamentos";
    paymentHistoryList.innerHTML =
        "";
}
financeList.addEventListener(
    "click",
    function (event) {
        /* =================================================
           REGISTRAR PAGAMENTO
        ================================================= */
        const paymentButton =
            event.target.closest(
                ".finance-mark-paid-button"
            );
        if (
            paymentButton
        ) {
            const contactId =
                paymentButton
                    .dataset
                    .contactId;
            if (
                contactId
            ) {
                openPaymentModal(
                    contactId
                );
            }
            return;
        }
        /* =================================================
           HISTÓRICO
        ================================================= */
        const historyButton =
            event.target.closest(
                ".finance-history-button"
            );
        if (
            historyButton
        ) {
            const contactId =
                historyButton
                    .dataset
                    .financeHistoryId;
            if (
                contactId
            ) {
                openPaymentHistoryModal(
                    contactId
                );
            }
            return;
        }
        /* =================================================
           EDITAR
        ================================================= */
        const editButton =
            event.target.closest(
                ".finance-edit-button"
            );
        if (
            editButton
        ) {
            const contactId =
                editButton
                    .dataset
                    .financeEditId;
            if (
                contactId
            ) {
                openFinanceEditModal(
                    contactId
                );
            }
        }
    }
);
paymentHistoryModalClose.addEventListener(
    "click",
    closePaymentHistoryModal
);
paymentHistoryModalOverlay.addEventListener(
    "click",
    closePaymentHistoryModal
);
financeEditCancelButton.addEventListener(
    "click",
    closeFinanceEditModal
);
financeEditModalClose.addEventListener(
    "click",
    closeFinanceEditModal
);
financeEditModalOverlay.addEventListener(
    "click",
    closeFinanceEditModal
);
financeEditBillingType.addEventListener(
    "change",
    updateFinanceEditBillingFields
);
financeEditSaveButton.addEventListener(
    "click",
    async function () {
        if (
            !selectedFinanceEditContactId
        ) {
            return;
        }
        /*
           Proteção visual adicional.
           A proteção real continua
           na API owner-only.
        */
        if (
            !currentAdminProfile
            ||
            currentAdminProfile.role !==
                "owner"
        ) {
            return;
        }
        financeEditError.textContent =
            "";
        /* =================================================
           VALOR
        ================================================= */
        const contractValueCents =
            parseBrazilianMoneyToCents(
                financeEditValue.value
            );
        if (
            contractValueCents ===
                null
        ) {
            financeEditError.textContent =
                "Informe um valor de contrato válido.";
            financeEditValue.focus();
            return;
        }
        /* =================================================
           TIPO DE COBRANÇA
        ================================================= */
        const billingType =
            financeEditBillingType.value;
        if (
            billingType !==
                "monthly"
            &&
            billingType !==
                "one_time"
        ) {
            financeEditError.textContent =
                "Selecione um tipo de cobrança válido.";
            return;
        }
        /* =================================================
           VENCIMENTO
        ================================================= */
        const paymentDueDate =
            financeEditPaymentDate.value;
        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(
                paymentDueDate
            )
        ) {
            financeEditError.textContent =
                "Informe uma data de vencimento válida.";
            financeEditPaymentDate.focus();
            return;
        }
        /* =================================================
           RECORRÊNCIA
        ================================================= */
        let recurringDay =
            null;
        if (
            billingType ===
                "monthly"
        ) {
            recurringDay =
                Number(
                    financeEditRecurringDay.value
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
                financeEditError.textContent =
                    "Informe um dia recorrente entre 1 e 31.";
                financeEditRecurringDay.focus();
                return;
            }
        }
        /* =================================================
           ENVIO
        ================================================= */
        financeEditSaveButton.disabled =
            true;
        financeEditSaveButton.textContent =
            "Salvando...";
        try {
            const user =
                session.currentUser;
            if (
                !user
            ) {
                throw new Error(
                    "A demonstração precisa ser recarregada."
                );
            }
            
            const apiResponse =
                await localRequest(
                    "admin-update-finance",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify({
                                contactId:
                                    selectedFinanceEditContactId,
                                contractValueCents:
                                    contractValueCents,
                                billingType:
                                    billingType,
                                paymentDueDate:
                                    paymentDueDate,
                                recurringDay:
                                    recurringDay
                            })
                    }
                );
            const apiData =
                await apiResponse
                    .json();
            if (
                !apiResponse.ok
            ) {
                throw new Error(
                    apiData.error
                    ||
                    "Não foi possível editar os dados financeiros."
                );
            }
            financeEditSaveButton.textContent =
                "Alterações salvas ✓";
            /*
               O listener de finance_records
               atualizará a tabela automaticamente.
            */
            setTimeout(
                function () {
                    closeFinanceEditModal();
                },
                700
            );
        }
        catch (error) {
            console.error(
                "Erro ao editar financeiro:",
                error
            );
            financeEditError.textContent =
                error.message
                ||
                "Não foi possível salvar as alterações.";
            financeEditSaveButton.disabled =
                false;
            financeEditSaveButton.textContent =
                "Salvar alterações";
        }
    }
);
   paymentCancelButton.addEventListener(
       "click",
       closePaymentModal
   );
   paymentModalClose.addEventListener(
       "click",
       closePaymentModal
   );
   paymentModalOverlay.addEventListener(
       "click",
       closePaymentModal
   );
   paymentConfirmButton.addEventListener(
       "click",
       async function () {
           if (
       !selectedFinanceContactId
       ||
       !selectedPaymentTarget
       ||
       paymentRequestInFlight
   ) {
       return;
   }
   const paymentTarget = {
       ...selectedPaymentTarget
   };
   paymentRequestInFlight = true;
        paymentError.textContent =
            "";
        paymentConfirmButton.disabled =
            true;
        paymentConfirmButton.textContent =
            "Registrando...";
         const selectedFinanceRecord =
             financeRecords.find(
                 function (record) {
                     return (
                         (
                             record.contactId ||
                             record.id
                         ) ===
                         selectedFinanceContactId
                     );
                 }
             );
         const selectedPaymentState =
             selectedFinanceRecord
                 ? getFinancePaymentStatus(
                     selectedFinanceRecord
                 )
                 : null;
         const wasLegacyMonthly =
             selectedPaymentState
             &&
             selectedPaymentState
                 .legacyMonthly ===
                 true;
        try {
            const user =
                session.currentUser;
            if (
                !user
            ) {
                throw new Error(
                    "A demonstração precisa ser recarregada."
                );
            }
            
            const apiResponse =
                await localRequest(
                    "admin-mark-payment-paid",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                           body:
                               JSON.stringify(
                                   paymentTarget
                               )
                    }
                );
            const apiData =
                await apiResponse
                    .json();
            if (
                !apiResponse.ok
            ) {
                throw new Error(
                    apiData.error ||
                    "Não foi possível registrar o pagamento."
                );
            }
           paymentConfirmButton.textContent =
                apiData.alreadyPaid
                    ? "Pagamento já registrado"
                    : wasLegacyMonthly
                        ? "Próxima cobrança preparada ✓"
                        : "Pagamento registrado ✓";
            /*
               O listener de finance_records
               atualizará a tabela automaticamente.
            */
            setTimeout(
                function () {
                    paymentRequestInFlight = false;
                    closePaymentModal();
                },
                700
            );
        }
        catch (error) {
           paymentRequestInFlight = false;
            console.error(
                "Erro ao registrar pagamento:",
                error
            );
            paymentError.textContent =
                error.message ||
                "Não foi possível registrar o pagamento.";
            paymentConfirmButton.disabled =
                false;
            paymentConfirmButton.textContent =
                "Confirmar pagamento";
        }
    }
);
/* =========================================================
   FINANCEIRO — LISTENER
========================================================= */
function startFinanceListener() {
    /*
       Nunca consulta o Financeiro
       para manager ou staff.
    */
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    stopFinanceListener();
   financeRecords =
    [];
   financePayments =
       [];
   financePaymentsError =
       false;
   updateFinanceMetrics();
    financeList.innerHTML =
        `
            <div class="finance-loading">
                Carregando contratos...
            </div>
        `;
    financeCount.textContent =
        "Carregando...";
    const financeQuery =
        query(
            collection(
                db,
                "finance_records"
            ),
            orderBy(
                "closedAt",
                "desc"
            )
        );
    unsubscribeFinanceRecords =
        onSnapshot(
            financeQuery,
            function (snapshot) {
                financeRecords =
                    snapshot.docs.map(
                        function (document) {
                            return {
                                id:
                                    document.id,
                                ...document.data()
                            };
                        }
                    );
                renderFinanceRecords();
                updateFinanceMetrics();
            },
            function (error) {
                console.error(
                    "Erro ao carregar financeiro:",
                    error
                );
                financeRecords =
                    [];
                financeCount.textContent =
                    "Erro";
                financeList.innerHTML =
                    `
                        <div class="finance-error">
                            Não foi possível carregar os dados financeiros.
                        </div>
                    `;
            }
        );
/* =====================================================
   PAGAMENTOS — INDICADORES
===================================================== */
unsubscribeFinancePayments =
    onSnapshot(
        collection(
            db,
            "finance_payments"
        ),
        function (snapshot) {
            financePaymentsError =
                false;
            financePayments =
                snapshot.docs.map(
                    function (document) {
                        return {
                            id:
                                document.id,
                            ...document.data()
                        };
                    }
                );
            updateFinanceMetrics();
        },
        function (error) {
            console.error(
                "Erro ao carregar pagamentos financeiros:",
                error
            );
            financePayments =
                [];
            financePaymentsError =
                true;
            updateFinanceMetrics();
        }
    );
}
/* =========================================================
   NAVEGAÇÃO DO PAINEL
========================================================= */
function stopAuditListener() {
    if (
        unsubscribeAuditLogs
    ) {
        unsubscribeAuditLogs();
        unsubscribeAuditLogs =
            null;
    }
}
function stopFinanceListener() {
    if (
        unsubscribeFinanceRecords
    ) {
        unsubscribeFinanceRecords();
        unsubscribeFinanceRecords =
            null;
    }
    if (
        unsubscribeFinancePayments
    ) {
        unsubscribeFinancePayments();
        unsubscribeFinancePayments =
            null;
    }
    stopPaymentHistoryListener();
}
/* =========================================================
   DASHBOARD — TEXTOS DAS ATIVIDADES
========================================================= */
function getDashboardActivityContent(activity) {
    const contactName =
        activity.contactName ||
        activity.contactCompany ||
        "Contato sem nome";
    const statusNames = {
        novo: "Novo",
        em_contato: "Em contato",
        follow_up: "Follow-up",
        proposta: "Proposta",
        aguardando_cliente: "Aguardando cliente",
        fechado: "Fechado",
        perdido: "Perdido"
    };
    function getStatusName(status) {
        return statusNames[status] || status || "Não informado";
    }
    function getFollowupDate(value) {
        return value
            ? formatAuditDate(value)
            : "Sem data";
    }
    switch (activity.type) {
        case "lead_created":
            return {
                title: "Lead criado",
                description: `${contactName} foi adicionado ao CRM.`
            };
        case "status_changed":
            return {
                title: "Status alterado",
                description:
                    `${contactName}: ` +
                    `${getStatusName(activity.fromStatus)} → ` +
                    `${getStatusName(activity.toStatus)}.`
            };
        case "followup_scheduled":
            return {
                title: "Follow-up agendado",
                description:
                    `${contactName}: próximo contato em ` +
                    `${getFollowupDate(activity.toNextContactAt)}.`
            };
        case "followup_rescheduled":
            return {
                title: "Follow-up reagendado",
                description:
                    `${contactName}: de ` +
                    `${getFollowupDate(activity.fromNextContactAt)} ` +
                    `para ${getFollowupDate(activity.toNextContactAt)}.`
            };
        case "followup_removed":
            return {
                title: "Follow-up removido",
                description:
                    `${contactName}: contato previsto para ` +
                    `${getFollowupDate(activity.fromNextContactAt)} removido.`
            };
        case "sale_closed":
            return {
                title: "Venda fechada",
                description: `${contactName} teve a venda fechada.`
            };
        case "contact_archived":
            return {
                title: "Contato arquivado",
                description: `${contactName} foi arquivado.`
            };
        case "contact_restored":
            return {
                title: "Contato restaurado",
                description: `${contactName} foi restaurado do arquivo.`
            };
        default:
            return {
                title: "Atividade registrada",
                description: `${contactName} teve uma movimentação registrada.`
            };
    }
}
/* =========================================================
   DASHBOARD — RENDERIZAÇÃO DAS ATIVIDADES
========================================================= */
function renderDashboardActivityList(activities) {
    const activityList =
        document.getElementById("dashboardActivityList");
    const activityStatus =
        document.getElementById("dashboardActivityStatus");
    if (!activityList || !activityStatus) {
        return;
    }
    const recentActivities = activities.slice(0, 8);
    activityStatus.textContent =
        recentActivities.length === 1
            ? "Última atividade"
            : "Últimas atividades";
    if (recentActivities.length === 0) {
        activityList.innerHTML = `
            <div class="dashboard-activity-empty">
                Nenhuma atividade recente para exibir.
            </div>
        `;
        return;
    }
    activityList.innerHTML = recentActivities.map(
        function (activity) {
            const content =
                getDashboardActivityContent(activity);
            const activityDate =
                formatAuditDate(activity.createdAt);
            return `
                <article
                    class="dashboard-activity-item"
                    role="button"
                    tabindex="0"
                    aria-label="${escapeHTML(
                        content.title + ": " +
                        content.description +
                        " Abrir contato."
                    )}"
                    data-activity-contact-id="${escapeHTML(
                        activity.contactId || ""
                    )}"
                >
                    <div class="dashboard-activity-item-content">
                        <h3 class="dashboard-activity-item-title">
                            ${escapeHTML(content.title)}
                        </h3>
                        <p class="dashboard-activity-item-description">
                            ${escapeHTML(content.description)}
                        </p>
                    </div>
                    <span class="dashboard-activity-item-date">
                        ${escapeHTML(activityDate)}
                    </span>
                </article>
            `;
        }
    ).join("");
}
/* =========================================================
   DASHBOARD — CONSULTA DAS ATIVIDADES
========================================================= */
let unsubscribeDashboardActivities = null;
let dashboardActivityRequestId = 0;
function stopDashboardActivityListener() {
    dashboardActivityRequestId++;
    if (unsubscribeDashboardActivities) {
        unsubscribeDashboardActivities();
        unsubscribeDashboardActivities = null;
    }
    const activityList =
        document.getElementById("dashboardActivityList");
    const activityStatus =
        document.getElementById("dashboardActivityStatus");
    if (activityList) {
        activityList.innerHTML = "";
    }
    if (activityStatus) {
        activityStatus.textContent = "";
    }
}
function startDashboardActivityListener() {
    stopDashboardActivityListener();
    const activityList =
        document.getElementById("dashboardActivityList");
    const activityStatus =
        document.getElementById("dashboardActivityStatus");
    const currentUser = session.currentUser;
    if (
        !activityList ||
        !activityStatus ||
        !currentUser ||
        !currentAdminProfile ||
        dashboardView.classList.contains("hidden")
    ) {
        return;
    }
    const requestId = dashboardActivityRequestId;
    function isCurrentListener() {
        return (
            requestId === dashboardActivityRequestId &&
            session.currentUser === currentUser &&
            Boolean(currentAdminProfile) &&
            !dashboardView.classList.contains("hidden")
        );
    }
    activityStatus.textContent = "Carregando...";
    activityList.innerHTML = `
        <div class="dashboard-activity-empty">
            Carregando atividades...
        </div>
    `;
    const activitiesQuery = query(
        collection(db, "activity_feed"),
        orderBy("createdAt", "desc"),
        limit(8)
    );
    unsubscribeDashboardActivities = onSnapshot(
        activitiesQuery,
        function (snapshot) {
            if (!isCurrentListener()) {
                return;
            }
            const activities = snapshot.docs.map(
                function (activityDocument) {
                    return {
                        ...activityDocument.data(),
                        id: activityDocument.id
                    };
                }
            );
            renderDashboardActivityList(activities);
            activityStatus.textContent =
                "Atualização automática";
        },
        function (error) {
            if (!isCurrentListener()) {
                return;
            }
            console.error(
                "Erro no listener de atividades:",
                error
            );
            stopDashboardActivityListener();
            activityStatus.textContent = "Falha ao carregar";
            activityList.innerHTML = `
                <div class="dashboard-activity-empty">
                    Não foi possível carregar as atividades.
                    Abra o Dashboard novamente para tentar.
                </div>
            `;
        }
    );
}
/* =========================================================
   DASHBOARD — ABRIR CONTATO PELA ATIVIDADE
========================================================= */
document.getElementById("dashboardActivityList")
    .addEventListener("click", function (event) {
        const button = event.target.closest(
            "[data-activity-contact-id]"
        );
        if (
            !button ||
            !session.currentUser ||
            !currentAdminProfile
        ) {
            return;
        }
        const contactId = button.dataset.activityContactId;
        if (!contactId) {
            window.alert(
                "Esta atividade não possui um contato vinculado."
            );
            return;
        }
        const contact = contacts.find(function (item) {
            return item.id === contactId;
        });
        if (!contact) {
            window.alert(
                "O contato não está disponível na lista atual. " +
                "Ele pode ter sido removido ou ainda estar carregando."
            );
            return;
        }
        if (contact.status === "fechado") {
            const message =
                currentAdminProfile.role === "owner"
                    ? "Este contato já teve a venda fechada. " +
                      "Consulte os dados da venda na aba Financeiro."
                    : "Este contato já teve a venda fechada " +
                      "e não está disponível para edição comercial.";
            window.alert(message);
            return;
        }
        openContact(contactId);
    });
/* =========================================================
   NAVEGAÇÃO DAS ÁREAS
========================================================= */
document.getElementById("dashboardActivityList")
    .addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }
        const activityItem = event.target.closest(
            ".dashboard-activity-item[data-activity-contact-id]"
        );
        if (!activityItem) {
            return;
        }
        event.preventDefault();
        if (!event.repeat) {
            activityItem.click();
        }
    });
function showDashboardView() {
    updateContactsExportButton();
    updateFinanceContractsExportButton();
    updateFinancePaymentsExportButton();
    updateCommercialReportButton();
    updateFinancialReportButton();
    dashboardView.classList.remove(
        "hidden"
    );
    contactsView.classList.add(
        "hidden"
    );
    auditView.classList.add(
        "hidden"
    );
    financeView.classList.add(
        "hidden"
    );
    dashboardTabButton.classList.add(
        "active"
    );
    contactsTabButton.classList.remove(
        "active"
    );
    auditTabButton.classList.remove(
        "active"
    );
    financeTabButton.classList.remove(
        "active"
    );
    adminSectionName.textContent =
        "Dashboard";
    updateDashboardPeriodSummary();
    startDashboardActivityListener();
    updateDashboardMetrics();
    updateDashboardFollowupSummary()
    renderDashboardFollowupList();
    startDashboardFollowupClock();
    /*
       Não mantemos Auditoria nem o listener
       completo da aba Financeiro ativos
       enquanto estamos no Dashboard.
    */
    stopAuditListener();
    stopFinanceListener();
    /*
       Somente owner iniciará a leitura
       financeira específica do Dashboard.
    */
    startDashboardFinanceListener();
    requestAnimationFrame(
        function () {
            renderDashboardStatusChart();
            renderDashboardOriginChart();
            renderDashboardServiceChart();
            if (
                dashboardStatusChart
            ) {
                dashboardStatusChart.resize();
            }
            if (
                dashboardOriginChart
            ) {
                dashboardOriginChart.resize();
            }
            if (
                dashboardServiceChart
            ) {
                dashboardServiceChart.resize();
            }
            if (
                dashboardFinanceChart
            ) {
                dashboardFinanceChart.resize();
            }
        }
    );
}
function showContactsView() {
    dashboardView.classList.add(
        "hidden"
    );
    contactsView.classList.remove(
        "hidden"
    );
    auditView.classList.add(
        "hidden"
    );
    financeView.classList.add(
        "hidden"
    );
    dashboardTabButton.classList.remove(
        "active"
    );
    contactsTabButton.classList.add(
        "active"
    );
    auditTabButton.classList.remove(
        "active"
    );
    financeTabButton.classList.remove(
        "active"
    );
    adminSectionName.textContent =
        "Contatos";
    stopDashboardActivityListener();
    stopDashboardFinanceListener();
    stopAuditListener();
    stopFinanceListener();
    stopDashboardFollowupClock();
}
function showAuditView() {
    /*
       Somente owner acessa
       a auditoria.
    */
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    dashboardView.classList.add(
        "hidden"
    );
    contactsView.classList.add(
        "hidden"
    );
    financeView.classList.add(
        "hidden"
    );
    auditView.classList.remove(
        "hidden"
    );
    dashboardTabButton.classList.remove(
        "active"
    );
    contactsTabButton.classList.remove(
        "active"
    );
    financeTabButton.classList.remove(
        "active"
    );
    auditTabButton.classList.add(
        "active"
    );
    adminSectionName.textContent =
        "Auditoria";
    stopDashboardActivityListener();
    stopDashboardFinanceListener();
    stopFinanceListener();
    startAuditListener();
    stopDashboardFollowupClock();
}
function showFinanceView() {
    /*
       Somente owner acessa
       o Financeiro.
    */
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    dashboardView.classList.add(
        "hidden"
    );
    contactsView.classList.add(
        "hidden"
    );
    auditView.classList.add(
        "hidden"
    );
    financeView.classList.remove(
        "hidden"
    );
    dashboardTabButton.classList.remove(
        "active"
    );
    contactsTabButton.classList.remove(
        "active"
    );
    auditTabButton.classList.remove(
        "active"
    );
    financeTabButton.classList.add(
        "active"
    );
    adminSectionName.textContent =
        "Financeiro";
    stopAuditListener();
    stopDashboardActivityListener();
    stopDashboardFinanceListener();
    syncFinanceFilterControls();
    startFinanceListener();
    stopDashboardFollowupClock();
}
document.addEventListener(
    "visibilitychange",
    function () {
        if (
            document.visibilityState !==
                "visible"
        ) {
            return;
        }
        if (
            dashboardView
            &&
            !dashboardView
                .classList
                .contains(
                    "hidden"
                )
        ) {
            refreshDashboardFollowupsByTime();
        }
    }
);
/* =========================================================
   EVENTOS DAS ABAS
========================================================= */
dashboardTabButton.addEventListener(
    "click",
    showDashboardView
);
contactsTabButton.addEventListener(
    "click",
    function () {
        clearContactsPeriod();
        showContactsView();
        renderContacts();
    }
);
auditTabButton.addEventListener(
    "click",
    showAuditView
);
financeTabButton.addEventListener(
    "click",
    function () {
        resetFinanceFilters();
        showFinanceView();
    }
);
/* =========================================================
   AUDITORIA
========================================================= */
function roleLabel(role) {
    const labels = {
        owner:
            "Owner",
        manager:
            "Manager",
        staff:
            "Staff"
    };
    return (
        labels[role] ||
        role ||
        "Usuário"
    );
}
function formatAuditDate(value) {
    const milliseconds =
        timestampToMilliseconds(
            value
        );
    if (
        milliseconds === null
    ) {
        return "—";
    }
    return new Date(
        milliseconds
    ).toLocaleString(
        "pt-BR",
        {
            dateStyle:
                "short",
            timeStyle:
                "short"
        }
    );
}
function formatAuditFollowUp(value) {
    if (!value) {
        return "Não definido";
    }
    return formatAuditDate(
        value
    );
}
function formatAuditTags(
    value
) {
    if (
        !Array.isArray(value) ||
        value.length === 0
    ) {
        return "Nenhuma";
    }
    return value
        .filter(
            function (tag) {
                return (
                    typeof tag ===
                        "string"
                    &&
                    tag.trim()
                );
            }
        )
        .map(
            function (tag) {
                return tag.trim();
            }
        )
        .join(", ");
}
/* =========================================================
   AUDITORIA — FINANCEIRO
========================================================= */
function auditPaymentStatusLabel(
    status
) {
    const labels = {
        pending:
            "Pendente",
        paid:
            "Pago"
    };
    return (
        labels[status]
        ||
        status
        ||
        "Não definido"
    );
}
function auditPaymentSourceLabel(
    source
) {
    const labels = {
        manual:
            "Manual",
        mercadopago:
            "Mercado Pago"
    };
    return (
        labels[source]
        ||
        source
        ||
        "Não informado"
    );
}
function formatAuditFinanceDate(
    value
) {
    if (
        typeof value !==
            "string"
    ) {
        return "Não definido";
    }
    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            value
        )
    ) {
        return value;
    }
    const [
        year,
        month,
        day
    ] =
        value.split("-");
    return `${day}/${month}/${year}`;
}
function auditRecurringDayLabel(
    value
) {
    if (
        value === null
        ||
        value === undefined
        ||
        value === ""
    ) {
        return "Não definido";
    }
    return `Dia ${value}`;
}
function renderAuditChanges(log) {
    const changes =
        log.changes || {};
    const items = [];
      if (
          changes.created
      ) {
          const source =
              changes.created.source ||
              "";
          items.push(
              `
                  <div class="audit-change">
                      ${
                          source === "manual"
                              ? "Lead criado manualmente pelo painel."
                              : "Lead criado."
                      }
                  </div>
              `
          );
      }
    if (
        changes.status
    ) {
        items.push(
            `
                <div class="audit-change">
                    Status:
                    <strong>
                        ${escapeHTML(statusLabel(changes.status.from))}
                    </strong>
                    →
                    <strong>
                        ${escapeHTML(statusLabel(changes.status.to))}
                    </strong>
                </div>
            `
        );
    }
      if (
          changes.origin
      ) {
          items.push(
              `
                  <div class="audit-change">
                      Origem:
                      <strong>
                          ${escapeHTML(
                              originLabel(
                                  changes.origin.from
                              )
                          )}
                      </strong>
                      →
                      <strong>
                          ${escapeHTML(
                              originLabel(
                                  changes.origin.to
                              )
                          )}
                      </strong>
                  </div>
              `
          );
      }
      if (
          changes.tags
      ) {
          items.push(
              `
                  <div class="audit-change">
                      Tags:
                      <strong>
                          ${escapeHTML(
                              formatAuditTags(
                                  changes.tags.from
                              )
                          )}
                      </strong>
                      →
                      <strong>
                          ${escapeHTML(
                              formatAuditTags(
                                  changes.tags.to
                              )
                          )}
                      </strong>
                  </div>
              `
          );
      }
    if (
        changes.nextContactAt
    ) {
        items.push(
            `
                <div class="audit-change">
                    Próximo contato:
                    <strong>
                        ${escapeHTML(formatAuditFollowUp(changes.nextContactAt.from))}
                    </strong>
                    →
                    <strong>
                        ${escapeHTML(formatAuditFollowUp(changes.nextContactAt.to))}
                    </strong>
                </div>
            `
        );
    }
    if (
        changes.notes
    ) {
        items.push(
            `
                <div class="audit-change">
                    Observações internas atualizadas.
                </div>
            `
        );
    }
   if (
       changes.archived
   ) {
       items.push(
           `
               <div class="audit-change">
                   ${
                       changes.archived.to ===
                           true
                           ? "Contato arquivado."
                           : "Contato restaurado."
                   }
               </div>
           `
       );
   }
/* =====================================================
   PAGAMENTO
===================================================== */
if (
    changes.paymentStatus
) {
    items.push(
        `
            <div class="audit-change">
                Pagamento:
                <strong>
                    ${escapeHTML(
                        auditPaymentStatusLabel(
                            changes.paymentStatus.from
                        )
                    )}
                </strong>
                →
                <strong>
                    ${escapeHTML(
                        auditPaymentStatusLabel(
                            changes.paymentStatus.to
                        )
                    )}
                </strong>
            </div>
        `
    );
}
/* =====================================================
   ORIGEM DA CONFIRMAÇÃO DO PAGAMENTO
===================================================== */
if (
    changes.paymentConfirmation
) {
    items.push(
        `
            <div class="audit-change">
                Confirmação do pagamento:
                <strong>
                    ${escapeHTML(
                        auditPaymentSourceLabel(
                            changes
                                .paymentConfirmation
                                .source
                        )
                    )}
                </strong>
            </div>
        `
    );
}
/* =====================================================
   VALOR DO CONTRATO
===================================================== */
if (
    changes.contractValueCents
) {
    items.push(
        `
            <div class="audit-change">
                Valor do contrato:
                <strong>
                    ${escapeHTML(
                        formatFinanceMoney(
                            changes
                                .contractValueCents
                                .from
                        )
                    )}
                </strong>
                →
                <strong>
                    ${escapeHTML(
                        formatFinanceMoney(
                            changes
                                .contractValueCents
                                .to
                        )
                    )}
                </strong>
            </div>
        `
    );
}
/* =====================================================
   TIPO DE COBRANÇA
===================================================== */
if (
    changes.billingType
) {
    items.push(
        `
            <div class="audit-change">
                Tipo de cobrança:
                <strong>
                    ${escapeHTML(
                        financeBillingLabel(
                            changes.billingType.from
                        )
                    )}
                </strong>
                →
                <strong>
                    ${escapeHTML(
                        financeBillingLabel(
                            changes.billingType.to
                        )
                    )}
                </strong>
            </div>
        `
    );
}
/* =====================================================
   VENCIMENTO FINANCEIRO
===================================================== */
if (
    changes.nextPaymentDueAt
) {
    items.push(
        `
            <div class="audit-change">
                Vencimento:
                <strong>
                    ${escapeHTML(
                        formatAuditFinanceDate(
                            changes
                                .nextPaymentDueAt
                                .from
                        )
                    )}
                </strong>
                →
                <strong>
                    ${escapeHTML(
                        formatAuditFinanceDate(
                            changes
                                .nextPaymentDueAt
                                .to
                        )
                    )}
                </strong>
            </div>
        `
    );
}
/* =====================================================
   DIA RECORRENTE
===================================================== */
if (
    changes.recurringDay
) {
    items.push(
        `
            <div class="audit-change">
                Dia recorrente:
                <strong>
                    ${escapeHTML(
                        auditRecurringDayLabel(
                            changes
                                .recurringDay
                                .from
                        )
                    )}
                </strong>
                →
                <strong>
                    ${escapeHTML(
                        auditRecurringDayLabel(
                            changes
                                .recurringDay
                                .to
                        )
                    )}
                </strong>
            </div>
        `
    );
}
    if (
        items.length === 0
    ) {
        items.push(
            `
                <div class="audit-change">
                    Alteração registrada.
                </div>
            `
        );
    }
    return items.join("");
}
/* =========================================================
   FILTROS DA AUDITORIA
========================================================= */
function populateAuditUserFilter() {
    const currentValue =
        auditUserFilter.value;
    const users =
        new Map();
    auditLogs.forEach(
        function (log) {
            if (
                !log.actorUid
            ) {
                return;
            }
            if (
                !users.has(
                    log.actorUid
                )
            ) {
                users.set(
                    log.actorUid,
                    {
                        uid:
                            log.actorUid,
                        email:
                            log.actorEmail ||
                            "Usuário sem e-mail",
                        role:
                            log.actorRole ||
                            ""
                    }
                );
            }
        }
    );
    const options =
        Array
            .from(
                users.values()
            )
            .sort(
                function (a, b) {
                    return a.email
                        .localeCompare(
                            b.email,
                            "pt-BR"
                        );
                }
            )
            .map(
                function (user) {
                    return `
                        <option
                            value="${escapeHTML(user.uid)}"
                        >
                            ${escapeHTML(user.email)}
                            (${escapeHTML(roleLabel(user.role))})
                        </option>
                    `;
                }
            )
            .join("");
    auditUserFilter.innerHTML =
        `
            <option value="todos">
                Todos os usuários
            </option>
            ${options}
        `;
    const stillExists =
        currentValue ===
            "todos"
        ||
        users.has(
            currentValue
        );
    auditUserFilter.value =
        stillExists
            ? currentValue
            : "todos";
}
function getAuditPeriodStart(
    period
) {
    if (
        period === "todos"
    ) {
        return null;
    }
    const now =
        new Date();
    if (
        period === "hoje"
    ) {
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();
    }
    const days =
        Number(
            period
        );
    if (
        Number.isNaN(days)
    ) {
        return null;
    }
    const start =
        new Date();
    start.setDate(
        start.getDate() -
        days
    );
    return start.getTime();
}
function getFilteredAuditLogs() {
    const search =
        auditSearch
            .value
            .trim()
            .toLowerCase();
    const selectedUser =
        auditUserFilter.value;
    const selectedPeriod =
        auditPeriodFilter.value;
    const selectedChange =
        auditChangeFilter.value;
    const periodStart =
        getAuditPeriodStart(
            selectedPeriod
        );
    return auditLogs.filter(
        function (log) {
            /*
               USUÁRIO
            */
            const matchesUser =
                selectedUser ===
                    "todos"
                ||
                log.actorUid ===
                    selectedUser;
            /*
               BUSCA POR LEAD / EMPRESA
            */
            const searchable =
                [
                    log.contactName,
                    log.contactCompany,
                    log.contactId
                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            const matchesSearch =
                !search
                ||
                searchable.includes(
                    search
                );
            /*
               TIPO DE ALTERAÇÃO
            */
            const changes =
                log.changes || {};
           const financialChangeKeys = [
                "paymentStatus",
                "paymentConfirmation",
                "contractValueCents",
                "billingType",
                "nextPaymentDueAt",
                "recurringDay"
            ];
            const isFinancialLog =
                financialChangeKeys.some(
                    function (key) {
                        return Object.prototype
                            .hasOwnProperty
                            .call(
                                changes,
                                key
                            );
                    }
                )
                ||
                log.action ===
                    "payment_marked_paid"
                ||
                log.action ===
                    "finance_updated";
            const matchesChange =
                selectedChange ===
                    "todos"
                    ? true
                    : selectedChange ===
                        "financeiro"
                        ? isFinancialLog
                        : Object.prototype
                            .hasOwnProperty
                            .call(
                                changes,
                                selectedChange
                            );
            /*
               PERÍODO
            */
            let matchesPeriod =
                true;
            if (
                periodStart !== null
            ) {
                const createdAt =
                    timestampToMilliseconds(
                        log.createdAt
                    );
                matchesPeriod =
                    createdAt !== null
                    &&
                    createdAt >=
                        periodStart;
            }
            return (
                matchesUser
                &&
                matchesSearch
                &&
                matchesChange
                &&
                matchesPeriod
            );
        }
    );
}
function renderAuditLogs() {
    const filtered =
        getFilteredAuditLogs();
    auditCount.textContent =
        filtered.length ===
            auditLogs.length
            ? `${auditLogs.length} ${
                auditLogs.length === 1
                    ? "registro"
                    : "registros"
            }`
            : `${filtered.length} de ${auditLogs.length} registros`;
    if (
        filtered.length === 0
    ) {
        auditList.innerHTML =
            `
                <div class="audit-empty">
                    Nenhum registro encontrado com os filtros selecionados.
                </div>
            `;
        return;
    }
    auditList.innerHTML =
        filtered
            .map(
                function (log) {
                    const user =
                        log.actorEmail ||
                        "Usuário não identificado";
                    const uid =
                        log.actorUid ||
                        "UID não disponível";
                    const leadName =
                        log.contactName ||
                        "Contato";
                    const company =
                        log.contactCompany ||
                        "Empresa não informada";
                    return `
                        <article class="audit-item">
                            <div class="audit-user">
                                <strong>
                                    ${escapeHTML(user)}
                                </strong>
                                <span class="audit-role">
                                    ${escapeHTML(roleLabel(log.actorRole))}
                                </span>
                                <small>
                                    UID: ${escapeHTML(uid)}
                                </small>
                            </div>
                            <div>
                                ${renderAuditChanges(log)}
                            </div>
                            <div class="audit-lead">
                                <strong>
                                    ${escapeHTML(leadName)}
                                </strong>
                                <span>
                                    ${escapeHTML(company)}
                                </span>
                            </div>
                            <div class="audit-date">
                                ${escapeHTML(formatAuditDate(log.createdAt))}
                            </div>
                        </article>
                    `;
                }
            )
            .join("");
}
auditSearch.addEventListener(
    "input",
    renderAuditLogs
);
auditUserFilter.addEventListener(
    "change",
    renderAuditLogs
);
auditPeriodFilter.addEventListener(
    "change",
    renderAuditLogs
);
auditChangeFilter.addEventListener(
    "change",
    renderAuditLogs
);
auditClearFilters.addEventListener(
    "click",
    function () {
        auditSearch.value =
            "";
        auditUserFilter.value =
            "todos";
        auditPeriodFilter.value =
            "todos";
        auditChangeFilter.value =
            "todos";
        renderAuditLogs();
    }
);
function startAuditListener() {
    /*
       Nunca consulta audit_logs para
       staff ou manager.
    */
    if (
        !currentAdminProfile ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    stopAuditListener();
    auditList.innerHTML =
        `
            <div class="loading-state">
                <span class="loader"></span>
                Carregando auditoria...
            </div>
        `;
    const auditQuery =
        query(
            collection(
                db,
                "audit_logs"
            ),
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(
                100
            )
        );
    unsubscribeAuditLogs =
        onSnapshot(
            auditQuery,
            function (snapshot) {
                auditLogs =
                    snapshot.docs.map(
                        function (document) {
                            return {
                                id:
                                    document.id,
                                ...document.data()
                            };
                        }
                    );
                populateAuditUserFilter();
                renderAuditLogs();
            },
            function (error) {
                console.error(
                    "Erro ao carregar auditoria:",
                    error
                );
                auditList.innerHTML =
                    `
                        <div class="audit-empty">
                            Não foi possível carregar a auditoria.
                        </div>
                    `;
            }
        );
}
/* =========================================================
   DADOS LOCAIS — ATUALIZAÇÃO AUTOMÁTICA
========================================================= */
function startContactsListener() {
    if (
        unsubscribeContacts
    ) {
        unsubscribeContacts();
    }
    const contactsQuery =
        query(
            collection(
                db,
                "contacts"
            ),
            orderBy(
                "createdAt",
                "desc"
            )
        );
    unsubscribeContacts =
        onSnapshot(
            contactsQuery,
            function (snapshot) {
                contacts =
                    snapshot.docs.map(
                        function (document) {
                            return {
                                id:
                                    document.id,
                                ...document.data()
                            };
                        }
                    );
                populateTagFilter();
                updateMetrics();
                updateDashboardMetrics();
                updateDashboardFollowupSummary();
                renderDashboardFollowupList();
                renderDashboardStatusChart();
                renderDashboardOriginChart();
                renderDashboardServiceChart();
                renderContacts();
            },
            function (error) {
                console.error(
                    "Erro ao carregar contatos:",
                    error
                );
                contactsList.innerHTML =
                    `
                        <div class="empty-state">
                            Não foi possível carregar os contatos.
                        </div>
                    `;
            }
        );
}
/* =========================================================
   ESTADO DE ARQUIVAMENTO
========================================================= */
function isContactArchived(
    contact
) {
    return (
        contact.archived === true
    );
}
/* =========================================================
   MÉTRICAS
========================================================= */
function updateMetrics() {
    const activeContacts =
        contacts.filter(
            function (contact) {
                return (
                    !isContactArchived(
                        contact
                    )
                );
            }
        );
    const commercialContacts =
        activeContacts.filter(
            function (contact) {
                return (
                    contact.status !==
                        "fechado"
                );
            }
        );
    const archivedContacts =
        contacts.filter(
            function (contact) {
                return (
                    isContactArchived(
                        contact
                    )
                    &&
                    contact.status !==
                        "fechado"
                );
            }
        );
    const closedContacts =
        activeContacts.filter(
            function (contact) {
                return (
                    contact.status ===
                        "fechado"
                );
            }
        );
    /*
       CONTADORES DA VISUALIZAÇÃO
       Fechados deixam de fazer parte
       da operação comercial.
    */
    activeContactsCount.textContent =
        commercialContacts.length;
    archivedContactsCount.textContent =
        archivedContacts.length;
    /*
       MÉTRICAS DO PIPELINE
    */
    metricTotal.textContent =
        commercialContacts.length;
    metricNew.textContent =
        commercialContacts.filter(
            function (contact) {
                return (
                    contact.status ===
                        "novo"
                );
            }
        ).length;
    metricContact.textContent =
        commercialContacts.filter(
            function (contact) {
                return (
                    contact.status ===
                        "em_contato"
                );
            }
        ).length;
    metricProposal.textContent =
        commercialContacts.filter(
            function (contact) {
                return (
                    contact.status ===
                        "proposta"
                );
            }
        ).length;
    /*
       Mantemos apenas a quantidade de
       vendas fechadas como indicador comercial.
       Nenhum valor financeiro é exposto aqui.
    */
    metricClosed.textContent =
        closedContacts.length;
}
/* =========================================================
   DASHBOARD — MÉTRICAS COMERCIAIS
========================================================= */
function updateDashboardMetrics() {
    const periodContacts =
        getDashboardContactsInPeriod();
    /*
       AQUISIÇÃO
       Tudo aqui responde:
       "quantos leads entraram neste período?"
    */
    const totalLeads =
        periodContacts.length;
    const newLeads =
        periodContacts.filter(
            function (contact) {
                return (
                    contact.status ===
                        "novo"
                    &&
                    !isContactArchived(
                        contact
                    )
                );
            }
        )
            .length;
    const lostLeads =
        periodContacts.filter(
            function (contact) {
                return (
                    contact.status ===
                        "perdido"
                );
            }
        )
            .length;
    dashboardMetricTotal.textContent =
        totalLeads;
    dashboardMetricNew.textContent =
        newLeads;
    dashboardMetricLost.textContent =
        lostLeads;
    /*
       FECHAMENTO REAL
       A data de fechamento não vem de
       contact.createdAt.
       Para owner usamos finance_records.closedAt.
    */
    const isOwner =
        currentAdminProfile
        &&
        currentAdminProfile.role ===
            "owner";
    if (
        !isOwner
    ) {
        dashboardMetricClosed.textContent =
            "—";
        dashboardMetricConversion.textContent =
            "—";
        return;
    }
    /*
       Ainda aguardando o snapshot financeiro.
    */
    if (
        !dashboardFinanceLoaded
        &&
        !dashboardFinanceError
    ) {
        dashboardMetricClosed.textContent =
            "—";
        dashboardMetricConversion.textContent =
            "—";
        return;
    }
    /*
       Falha de leitura.
    */
    if (
        dashboardFinanceError
    ) {
        dashboardMetricClosed.textContent =
            "Erro";
        dashboardMetricConversion.textContent =
            "Erro";
        return;
    }
    /*
       VENDAS FECHADAS NO PERÍODO
       Aqui usamos closedAt,
       e não createdAt.
    */
    const closedSales =
        dashboardFinanceRecords.filter(
            function (record) {
                return (
                    isTimestampInDashboardPeriod(
                        record.closedAt
                    )
                );
            }
        )
            .length;
    /*
       Relação operacional do período:
       vendas fechadas
       ÷
       leads gerados
    */
    const conversionRate =
        totalLeads > 0
            ? (
                closedSales /
                totalLeads
            ) * 100
            : 0;
    dashboardMetricClosed.textContent =
        closedSales;
    dashboardMetricConversion.textContent =
        new Intl.NumberFormat(
            "pt-BR",
            {
                minimumFractionDigits:
                    1,
                maximumFractionDigits:
                    1
            }
        )
            .format(
                conversionRate
            )
        +
        "%";
}
/* =========================================================
   DASHBOARD — GRÁFICO DE STATUS
========================================================= */
function getDashboardContactStatus(
    contact
) {
    /*
       Fechado e perdido são resultados
       comerciais e têm prioridade visual.
    */
    if (
        contact.status ===
            "fechado"
    ) {
        return "fechado";
    }
    if (
        contact.status ===
            "perdido"
    ) {
        return "perdido";
    }
    /*
       Para os demais casos, arquivamento
       representa que o lead saiu da
       operação comercial ativa.
    */
    if (
        isContactArchived(
            contact
        )
    ) {
        return "arquivado";
    }
    const validStatus =
        DASHBOARD_STATUS_CONFIG.some(
            function (item) {
                return (
                    item.key ===
                    contact.status
                );
            }
        );
    return validStatus
        ? contact.status
        : "novo";
}
function getDashboardStatusValues() {
    const counts = {};
    DASHBOARD_STATUS_CONFIG.forEach(
        function (item) {
            counts[item.key] =
                0;
        }
    );
   getDashboardContactsInPeriod()
    .forEach(
        function (contact) {
            const status =
                getDashboardContactStatus(
                    contact
                );
            counts[status] =
                (
                    counts[status] ||
                    0
                )
                +
                1;
        }
    );
    return DASHBOARD_STATUS_CONFIG.map(
        function (item) {
            return {
                ...item,
                value:
                    counts[item.key] ||
                    0
            };
        }
    );
}
function dashboardHexToRgba(
    hex,
    opacity
) {
    const normalized =
        hex.replace(
            "#",
            ""
        );
    const red =
        parseInt(
            normalized.substring(
                0,
                2
            ),
            16
        );
    const green =
        parseInt(
            normalized.substring(
                2,
                4
            ),
            16
        );
    const blue =
        parseInt(
            normalized.substring(
                4,
                6
            ),
            16
        );
    return (
        `rgba(${red}, ${green}, ${blue}, ${opacity})`
    );
}
/* =========================================================
   DASHBOARD — DESTAQUE VISUAL DAS LEGENDAS
========================================================= */
function updateDashboardLegendHighlight(
    legendElement,
    activeIndex = null
) {
    if (
        !legendElement
    ) {
        return;
    }
    const items =
        legendElement.querySelectorAll(
            ".dashboard-legend-item"
        );
    items.forEach(
        function (
            item,
            index
        ) {
            const isActive =
                activeIndex !== null
                &&
                index === activeIndex;
            const isDimmed =
                activeIndex !== null
                &&
                index !== activeIndex;
            item.classList.toggle(
                "is-active",
                isActive
            );
            item.classList.toggle(
                "is-dimmed",
                isDimmed
            );
        }
    );
}
function updateDashboardStatusCenter(
    index = null
) {
    const items =
        getDashboardStatusValues();
    const total =
        items.reduce(
            function (
                sum,
                item
            ) {
                return (
                    sum +
                    item.value
                );
            },
            0
        );
    /*
       Nenhuma fatia em destaque:
       mostra o resumo geral.
    */
    if (
        index === null
        ||
        !items[index]
    ) {
        dashboardStatusCenterValue
            .textContent =
                total;
        dashboardStatusCenterLabel
            .textContent =
                "Total de leads";
        dashboardStatusCenterPercent
            .textContent =
                total > 0
                    ? (
                      dashboardPeriod ===
                          "all"
                          ? "100% do CRM"
                          : "100% do período"
)
                    : "Sem dados";
        return;
    }
    const item =
        items[index];
    const percentage =
        total > 0
            ? (
                item.value /
                total
            ) * 100
            : 0;
    dashboardStatusCenterValue
        .textContent =
            item.value;
    dashboardStatusCenterLabel
        .textContent =
            item.label;
    dashboardStatusCenterPercent
        .textContent =
            new Intl.NumberFormat(
                "pt-BR",
                {
                    minimumFractionDigits:
                        1,
                    maximumFractionDigits:
                        1
                }
            )
                .format(
                    percentage
                )
            +
            "%";
}
function highlightDashboardStatus(
    index
) {
    if (
        !dashboardStatusChart
    ) {
        return;
    }
    if (
        dashboardStatusActiveIndex ===
            index
    ) {
        return;
    }
    dashboardStatusActiveIndex =
        index;
    const colors =
        DASHBOARD_STATUS_CONFIG.map(
            function (
                item,
                itemIndex
            ) {
                if (
                    itemIndex ===
                    index
                ) {
                    return item.color;
                }
                return dashboardHexToRgba(
                    item.color,
                    0.18
                );
            }
        );
    dashboardStatusChart
        .data
        .datasets[0]
        .backgroundColor =
            colors;
    dashboardStatusChart
        .setActiveElements(
            [
                {
                    datasetIndex:
                        0,
                    index:
                        index
                }
            ]
        );
            updateDashboardStatusCenter(
             index
         );
         updateDashboardLegendHighlight(
             dashboardStatusLegend,
             index
         );
         dashboardStatusChart.update();
}
function resetDashboardStatusHighlight() {
    if (
        !dashboardStatusChart
    ) {
        return;
    }
    if (
        dashboardStatusActiveIndex ===
            null
    ) {
        return;
    }
    dashboardStatusActiveIndex =
        null;
    dashboardStatusChart
        .data
        .datasets[0]
        .backgroundColor =
            DASHBOARD_STATUS_CONFIG.map(
                function (item) {
                    return item.color;
                }
            );
    dashboardStatusChart
        .setActiveElements(
            []
        );
      updateDashboardStatusCenter();
      updateDashboardLegendHighlight(
          dashboardStatusLegend
      );
      dashboardStatusChart.update();
}
/* =========================================================
   DASHBOARD — NAVEGAÇÃO POR STATUS
========================================================= */
function openDashboardStatusFilter(
    statusKey
) {
   contactFollowupFilter.value = "todos";
   dashboardContactServiceFilter =
    null;
    /*
       Fechados não voltam para Contatos.
       O destino correto é Financeiro.
    */
    if (
        statusKey ===
            "fechado"
    ) {
        if (
            currentAdminProfile
            &&
            currentAdminProfile.role ===
                "owner"
        ) {
            resetFinanceFilters();
            showFinanceView();
        }
        return;
    }
    /*
       Limpa filtros anteriores para
       o clique do Dashboard ser previsível.
    */
    contactSearch.value =
        "";
    statusFilter.value =
        "todos";
    originFilter.value =
        "todos";
    tagFilter.value =
        "todos";
    /*
       Arquivado é uma visão do CRM,
       não um status comercial selecionável.
    */
    if (
        statusKey ===
            "arquivado"
    ) {
        contactsViewMode =
            "arquivados";
    }
    else {
        contactsViewMode =
            "ativos";
        statusFilter.value =
            statusKey;
    }
    updateContactsViewButtons();
    applyDashboardContactPeriod();
    showContactsView();
    renderContacts();
}
function renderDashboardStatusLegend() {
    if (
        !dashboardStatusLegend
    ) {
        return;
    }
    const items =
        getDashboardStatusValues();
    const total =
        items.reduce(
            function (
                sum,
                item
            ) {
                return (
                    sum +
                    item.value
                );
            },
            0
        );
    dashboardStatusLegend.innerHTML =
        "";
    items.forEach(
        function (
            item,
            index
        ) {
            const percentage =
                total > 0
                    ? (
                        item.value /
                        total
                    ) * 100
                    : 0;
            const button =
                document.createElement(
                    "button"
                );
            button.type =
                "button";
            button.className =
                "dashboard-legend-item";
            button.innerHTML =
                `
                    <span
                        class="dashboard-legend-color"
                        style="
                            background:
                                ${item.color};
                        "
                    ></span>
                    <span
                        class="dashboard-legend-copy"
                    >
                        <strong>
                            ${item.label}
                        </strong>
                        <small>
                            ${item.value}
                            ·
                            ${new Intl.NumberFormat(
                                "pt-BR",
                                {
                                    minimumFractionDigits:
                                        1,
                                    maximumFractionDigits:
                                        1
                                }
                            ).format(
                                percentage
                            )}%
                        </small>
                    </span>
                `;
            button.addEventListener(
                "mouseenter",
                function () {
                    highlightDashboardStatus(
                        index
                    );
                }
            );
            button.addEventListener(
                "mouseleave",
                resetDashboardStatusHighlight
            );
            /*
               Também funciona por teclado.
            */
            button.addEventListener(
                "focus",
                function () {
                    highlightDashboardStatus(
                        index
                    );
                }
            );
            button.addEventListener(
                "blur",
                resetDashboardStatusHighlight
            );
           button.addEventListener(
             "click",
             function () {
        openDashboardStatusFilter(
            item.key
        );
    }
);
            dashboardStatusLegend
                .appendChild(
                    button
                );
        }
    );
}
function renderDashboardStatusChart() {
    if (
        !dashboardStatusCanvas
    ) {
        return;
    }
    if (
        typeof window.Chart ===
            "undefined"
    ) {
        console.error(
            "Chart.js não foi carregado."
        );
        return;
    }
    const items =
        getDashboardStatusValues();
    const labels =
        items.map(
            function (item) {
                return item.label;
            }
        );
    const values =
        items.map(
            function (item) {
                return item.value;
            }
        );
    const colors =
        items.map(
            function (item) {
                return item.color;
            }
        );
    /*
       Se o gráfico já existe,
       apenas atualizamos os dados.
    */
    if (
        dashboardStatusChart
    ) {
        dashboardStatusActiveIndex =
            null;
        dashboardStatusChart
            .data
            .labels =
                labels;
        dashboardStatusChart
            .data
            .datasets[0]
            .data =
                values;
        dashboardStatusChart
            .data
            .datasets[0]
            .backgroundColor =
                colors;
        dashboardStatusChart.update();
        renderDashboardStatusLegend();
        updateDashboardStatusCenter();
        return;
    }
    dashboardStatusChart =
        new window.Chart(
            dashboardStatusCanvas,
            {
                type:
                    "doughnut",
                data: {
                    labels:
                        labels,
                    datasets: [
                        {
                            data:
                                values,
                            backgroundColor:
                                colors,
                            borderWidth:
                                  0,
                              hoverBorderWidth:
                                  0,
                              /*
                                 Cria uma margem interna permanente
                                 ao redor da rosca.
                                 Assim a fatia pode se projetar no
                                 hover sem encostar no limite
                                 físico do canvas.
                              */
                              radius:
                                  "88%",
                              hoverOffset:
                                  0,
                              spacing:
                                  0
                        }
                    ]
                },
                options: {
                    responsive:
                        true,
                    maintainAspectRatio:
                        false,
                     /*
                        Renderização HiDPI.
                        Chart.js passa a desenhar internamente
                        com mais pixels do que os exibidos
                        visualmente pelo CSS.
                     */
                     devicePixelRatio:
                         Math.min(
                             Math.max(
                                 window.devicePixelRatio || 1,
                                 2
                             ),
                             3
                         ),
                     /*
                        Margem física dentro do canvas.
                        É uma segunda proteção contra
                        corte durante o hover.
                     */
                     layout: {
                         padding:
                             6
                     },
                    cutout:
                        "72%",
                    animation: {
                        duration:
                            480,
                        easing:
                            "easeOutQuart"
                    },
                   animations: {
                         colors: {
                             type: "color",
                             duration: 180,
                             easing: "easeOutQuad"
                         }
                     },
                    interaction: {
                        mode:
                            "nearest",
                        intersect:
                            true
                    },
                    plugins: {
                        legend: {
                            display:
                                false
                        },
                        tooltip: {
                            enabled:
                                false
                        }
                    },
                    onHover:
                         function (
                             event,
                             elements
                         ) {
                             const canvas =
                                 event
                                     .native
                                     ?.target;
                             if (
                                 canvas
                             ) {
                                 canvas.style.cursor =
                                     elements.length
                                         ? "pointer"
                                         : "default";
                             }
                             if (
                                 elements.length
                             ) {
                                 highlightDashboardStatus(
                                     elements[0]
                                         .index
                                 );
                             }
                             else {
                                 resetDashboardStatusHighlight();
                             }
                         },
                     onClick:
                         function (
                             event,
                             elements
                         ) {
                             if (
                                 !elements.length
                             ) {
                                 return;
                             }
                             const index =
                                 elements[0].index;
                             const item =
                                 DASHBOARD_STATUS_CONFIG[
                                     index
                                 ];
                             if (
                                 !item
                             ) {
                                 return;
                             }
                             openDashboardStatusFilter(
                                 item.key
                             );
                         }
                }
            }
        );
    /*
       Garante que sair completamente
       do canvas restaure o gráfico.
    */
    dashboardStatusCanvas
        .addEventListener(
            "mouseleave",
            resetDashboardStatusHighlight
        );
    renderDashboardStatusLegend();
    updateDashboardStatusCenter();
}
/* =========================================================
   DASHBOARD — ESCOPO COMERCIAL
========================================================= */
function isDashboardCommercialContact(
    contact
) {
    if (
        contact.status ===
            "fechado"
    ) {
        return false;
    }
    if (
        isContactArchived(
            contact
        )
    ) {
        return false;
    }
    return true;
}
/* =========================================================
   DASHBOARD — GRÁFICO DE ORIGENS
========================================================= */
function getDashboardOriginValues() {
    const counts = {};
    DASHBOARD_ORIGIN_CONFIG.forEach(
        function (item) {
            counts[item.key] =
                0;
        }
    );
  getDashboardContactsInPeriod()
    .forEach(
        function (contact) {
           if (
               !isDashboardCommercialContact(
                   contact
               )
           ) {
               return;
           }
           const origin =
               getContactOrigin(
                   contact
               );
            counts[origin] =
                (
                    counts[origin] ||
                    0
                )
                +
                1;
        }
    );
    return DASHBOARD_ORIGIN_CONFIG.map(
        function (item) {
            return {
                ...item,
                value:
                    counts[item.key] ||
                    0
            };
        }
    );
}
function updateDashboardOriginCenter(
    index = null
) {
    const items =
        getDashboardOriginValues();
    const total =
        items.reduce(
            function (
                sum,
                item
            ) {
                return (
                    sum +
                    item.value
                );
            },
            0
        );
    /*
       Sem hover:
       mostra o total geral.
    */
    if (
        index === null
        ||
        !items[index]
    ) {
        dashboardOriginCenterValue
            .textContent =
                total;
        dashboardOriginCenterLabel
            .textContent =
                "Total de leads";
        dashboardOriginCenterPercent
            .textContent =
                total > 0
                    ? (
                         dashboardPeriod ===
                             "all"
                             ? "100% do CRM"
                             : "100% do período"
                     )
                    : "Sem dados";
        return;
    }
    const item =
        items[index];
    const percentage =
        total > 0
            ? (
                item.value /
                total
            ) * 100
            : 0;
    dashboardOriginCenterValue
        .textContent =
            item.value;
    dashboardOriginCenterLabel
        .textContent =
            item.label;
    dashboardOriginCenterPercent
        .textContent =
            new Intl.NumberFormat(
                "pt-BR",
                {
                    minimumFractionDigits:
                        1,
                    maximumFractionDigits:
                        1
                }
            )
                .format(
                    percentage
                )
            +
            "%";
}
function highlightDashboardOrigin(
    index
) {
    if (
        !dashboardOriginChart
    ) {
        return;
    }
    if (
        dashboardOriginActiveIndex ===
            index
    ) {
        return;
    }
    dashboardOriginActiveIndex =
        index;
    const colors =
        DASHBOARD_ORIGIN_CONFIG.map(
            function (
                item,
                itemIndex
            ) {
                if (
                    itemIndex ===
                    index
                ) {
                    return item.color;
                }
                return dashboardHexToRgba(
                    item.color,
                    0.18
                );
            }
        );
    dashboardOriginChart
        .data
        .datasets[0]
        .backgroundColor =
            colors;
    dashboardOriginChart
        .setActiveElements(
            [
                {
                    datasetIndex:
                        0,
                    index:
                        index
                }
            ]
        );
         updateDashboardOriginCenter(
             index
         );
         updateDashboardLegendHighlight(
             dashboardOriginLegend,
             index
         );
         dashboardOriginChart.update();
}
function resetDashboardOriginHighlight() {
    if (
        !dashboardOriginChart
    ) {
        return;
    }
    if (
        dashboardOriginActiveIndex ===
            null
    ) {
        return;
    }
    dashboardOriginActiveIndex =
        null;
    dashboardOriginChart
        .data
        .datasets[0]
        .backgroundColor =
            DASHBOARD_ORIGIN_CONFIG.map(
                function (item) {
                    return item.color;
                }
            );
    dashboardOriginChart
        .setActiveElements(
            []
        );
      updateDashboardOriginCenter();
      updateDashboardLegendHighlight(
          dashboardOriginLegend
      );
      dashboardOriginChart.update();
}
/* =========================================================
   DASHBOARD — NAVEGAÇÃO POR ORIGEM
========================================================= */
function openDashboardOriginFilter(
    originKey
) {
contactFollowupFilter.value = "todos";
dashboardContactServiceFilter =
    null;
    if (
        !knownOrigins.includes(
            originKey
        )
    ) {
        return;
    }
    /*
       O gráfico de Origem representa
       somente a carteira comercial ativa.
    */
    contactsViewMode =
        "ativos";
    /*
       Limpa filtros anteriores.
    */
    contactSearch.value =
        "";
    statusFilter.value =
        "todos";
    originFilter.value =
        originKey;
    tagFilter.value =
        "todos";
    updateContactsViewButtons();
    applyDashboardContactPeriod();
    showContactsView();
    renderContacts();
}
function renderDashboardOriginLegend() {
    if (
        !dashboardOriginLegend
    ) {
        return;
    }
    const items =
        getDashboardOriginValues();
    const total =
        items.reduce(
            function (
                sum,
                item
            ) {
                return (
                    sum +
                    item.value
                );
            },
            0
        );
    dashboardOriginLegend.innerHTML =
        "";
    items.forEach(
        function (
            item,
            index
        ) {
            const percentage =
                total > 0
                    ? (
                        item.value /
                        total
                    ) * 100
                    : 0;
            const button =
                document.createElement(
                    "button"
                );
            button.type =
                "button";
            button.className =
                "dashboard-legend-item";
            button.innerHTML =
                `
                    <span
                        class="dashboard-legend-color"
                        style="
                            background:
                                ${item.color};
                        "
                    ></span>
                    <span
                        class="dashboard-legend-copy"
                    >
                        <strong>
                            ${item.label}
                        </strong>
                        <small>
                            ${item.value}
                            ·
                            ${new Intl.NumberFormat(
                                "pt-BR",
                                {
                                    minimumFractionDigits:
                                        1,
                                    maximumFractionDigits:
                                        1
                                }
                            ).format(
                                percentage
                            )}%
                        </small>
                    </span>
                `;
            button.addEventListener(
                "mouseenter",
                function () {
                    highlightDashboardOrigin(
                        index
                    );
                }
            );
            button.addEventListener(
                "mouseleave",
                resetDashboardOriginHighlight
            );
            button.addEventListener(
                "focus",
                function () {
                    highlightDashboardOrigin(
                        index
                    );
                }
            );
            button.addEventListener(
                "blur",
                resetDashboardOriginHighlight
            );
            button.addEventListener(
                "click",
                function () {
        openDashboardOriginFilter(
            item.key
        );
    }
);
            dashboardOriginLegend
                .appendChild(
                    button
                );
        }
    );
}
function renderDashboardOriginChart() {
    if (
        !dashboardOriginCanvas
    ) {
        return;
    }
    if (
        typeof window.Chart ===
            "undefined"
    ) {
        console.error(
            "Chart.js não foi carregado."
        );
        return;
    }
    const items =
        getDashboardOriginValues();
    const labels =
        items.map(
            function (item) {
                return item.label;
            }
        );
    const values =
        items.map(
            function (item) {
                return item.value;
            }
        );
    const colors =
        items.map(
            function (item) {
                return item.color;
            }
        );
    /*
       Se já existir,
       somente atualiza.
    */
    if (
        dashboardOriginChart
    ) {
        dashboardOriginActiveIndex =
            null;
        dashboardOriginChart
            .data
            .labels =
                labels;
        dashboardOriginChart
            .data
            .datasets[0]
            .data =
                values;
        dashboardOriginChart
            .data
            .datasets[0]
            .backgroundColor =
                colors;
        dashboardOriginChart.update();
        renderDashboardOriginLegend();
        updateDashboardOriginCenter();
        return;
    }
    dashboardOriginChart =
        new window.Chart(
            dashboardOriginCanvas,
            {
                type:
                    "doughnut",
                data: {
                    labels:
                        labels,
                    datasets: [
                        {
                            data:
                                values,
                            backgroundColor:
                                colors,
                            borderWidth:
                                0,
                            hoverBorderWidth:
                                0,
                            /*
                               Mesmo espaço de segurança
                               aplicado ao gráfico de Status.
                            */
                            radius:
                                "88%",
                            hoverOffset:
                                0,
                            spacing:
                                0
                        }
                    ]
                },
                options: {
                    responsive:
                        true,
                    maintainAspectRatio:
                        false,
                    /*
                       Renderização HiDPI para
                       reduzir serrilhamento.
                    */
                    devicePixelRatio:
                        Math.min(
                            Math.max(
                                window.devicePixelRatio || 1,
                                2
                            ),
                            3
                        ),
                    layout: {
                        padding:
                            6
                    },
                    cutout:
                        "72%",
                    animation: {
                        duration:
                            480,
                        easing:
                            "easeOutQuart"
                    },
                   animations: {
                         colors: {
                             type: "color",
                             duration: 180,
                             easing: "easeOutQuad"
                         }
                     },
                    interaction: {
                        mode:
                            "nearest",
                        intersect:
                            true
                    },
                    plugins: {
                        legend: {
                            display:
                                false
                        },
                        tooltip: {
                            enabled:
                                false
                        }
                    },
                    onHover:
                      function (
                          event,
                          elements
                      ) {
                          const canvas =
                              event
                                  .native
                                  ?.target;
                          if (
                              canvas
                          ) {
                              canvas.style.cursor =
                                  elements.length
                                      ? "pointer"
                                      : "default";
                          }
                          if (
                              elements.length
                          ) {
                              highlightDashboardOrigin(
                                  elements[0]
                                      .index
                              );
                          }
                          else {
                              resetDashboardOriginHighlight();
                          }
                      },
                  onClick:
                      function (
                          event,
                          elements
                      ) {
                          if (
                              !elements.length
                          ) {
                              return;
                          }
                          const index =
                              elements[0].index;
                          const item =
                              DASHBOARD_ORIGIN_CONFIG[
                                  index
                              ];
                          if (
                              !item
                          ) {
                              return;
                          }
                          openDashboardOriginFilter(
                              item.key
                          );
                      }
                }
            }
        );
    dashboardOriginCanvas
        .addEventListener(
            "mouseleave",
            resetDashboardOriginHighlight
        );
    renderDashboardOriginLegend();
    updateDashboardOriginCenter();
}
/* =========================================================
   DASHBOARD — GRÁFICO DE SERVIÇOS
========================================================= */
function getDashboardServiceValues() {
    const counts = {};
    DASHBOARD_SERVICE_CONFIG.forEach(
        function (item) {
            counts[item.key] =
                0;
        }
    );
    getDashboardContactsInPeriod()
    .forEach(
        function (contact) {
            if (
                !isDashboardCommercialContact(
                    contact
                )
            ) {
                return;
            }
            const service =
                getDashboardServiceKey(
                    contact
                );
            counts[service] =
                (
                    counts[service] ||
                    0
                )
                +
                1;
        }
    );
    return DASHBOARD_SERVICE_CONFIG.map(
        function (item) {
            return {
                ...item,
                value:
                    counts[item.key] ||
                    0
            };
        }
    );
}
function updateDashboardServiceCenter(
    index = null
) {
    const items =
        getDashboardServiceValues();
    const total =
        items.reduce(
            function (
                sum,
                item
            ) {
                return (
                    sum +
                    item.value
                );
            },
            0
        );
    if (
        index === null
        ||
        !items[index]
    ) {
        dashboardServiceCenterValue
            .textContent =
                total;
        dashboardServiceCenterLabel
            .textContent =
                "Total de leads";
        dashboardServiceCenterPercent
            .textContent =
                total > 0
                   ? (
                         dashboardPeriod ===
                             "all"
                             ? "100% do CRM"
                             : "100% do período"
                     )
                    : "Sem dados";
        return;
    }
    const item =
        items[index];
    const percentage =
        total > 0
            ? (
                item.value /
                total
            ) * 100
            : 0;
    dashboardServiceCenterValue
        .textContent =
            item.value;
    dashboardServiceCenterLabel
        .textContent =
            item.label;
    dashboardServiceCenterPercent
        .textContent =
            new Intl.NumberFormat(
                "pt-BR",
                {
                    minimumFractionDigits:
                        1,
                    maximumFractionDigits:
                        1
                }
            )
                .format(
                    percentage
                )
            +
            "%";
}
function highlightDashboardService(
    index
) {
    if (
        !dashboardServiceChart
    ) {
        return;
    }
    if (
        dashboardServiceActiveIndex ===
            index
    ) {
        return;
    }
    dashboardServiceActiveIndex =
        index;
    const colors =
        DASHBOARD_SERVICE_CONFIG.map(
            function (
                item,
                itemIndex
            ) {
                if (
                    itemIndex ===
                    index
                ) {
                    return item.color;
                }
                return dashboardHexToRgba(
                    item.color,
                    0.18
                );
            }
        );
    dashboardServiceChart
        .data
        .datasets[0]
        .backgroundColor =
            colors;
    dashboardServiceChart
        .setActiveElements(
            [
                {
                    datasetIndex:
                        0,
                    index:
                        index
                }
            ]
        );
         updateDashboardServiceCenter(
             index
         );
         updateDashboardLegendHighlight(
             dashboardServiceLegend,
             index
         );
         dashboardServiceChart.update();
}
function resetDashboardServiceHighlight() {
    if (
        !dashboardServiceChart
    ) {
        return;
    }
    dashboardServiceActiveIndex =
        null;
    dashboardServiceChart
        .data
        .datasets[0]
        .backgroundColor =
            DASHBOARD_SERVICE_CONFIG.map(
                function (item) {
                    return item.color;
                }
            );
    dashboardServiceChart
        .setActiveElements(
            []
        );
    updateDashboardServiceCenter();
    updateDashboardLegendHighlight(
        dashboardServiceLegend
    );
    dashboardServiceChart.update();
}
/* =========================================================
   DASHBOARD — NAVEGAÇÃO POR SERVIÇO
========================================================= */
function openDashboardServiceFilter(
    serviceKey
) {
   contactFollowupFilter.value = "todos";
    const validService =
        DASHBOARD_SERVICE_CONFIG.some(
            function (item) {
                return (
                    item.key ===
                    serviceKey
                );
            }
        );
    if (
        !validService
    ) {
        return;
    }
    contactsViewMode =
        "ativos";
    /*
       Limpa os filtros visíveis
       antes de aplicar Serviço.
    */
    contactSearch.value =
        "";
    statusFilter.value =
        "todos";
    originFilter.value =
        "todos";
    tagFilter.value =
        "todos";
    dashboardContactServiceFilter =
        serviceKey;
    updateContactsViewButtons();
    applyDashboardContactPeriod();
    showContactsView();
    renderContacts();
}
function renderDashboardServiceLegend() {
    if (
        !dashboardServiceLegend
    ) {
        return;
    }
    const items =
        getDashboardServiceValues();
    const total =
        items.reduce(
            function (
                sum,
                item
            ) {
                return (
                    sum +
                    item.value
                );
            },
            0
        );
    dashboardServiceLegend.innerHTML =
        "";
    items.forEach(
        function (
            item,
            index
        ) {
            const percentage =
                total > 0
                    ? (
                        item.value /
                        total
                    ) * 100
                    : 0;
            const button =
                document.createElement(
                    "button"
                );
            button.type =
                "button";
            button.className =
                "dashboard-legend-item";
            button.innerHTML =
                `
                    <span
                        class="dashboard-legend-color"
                        style="
                            background:
                                ${item.color};
                        "
                    ></span>
                    <span
                        class="dashboard-legend-copy"
                    >
                        <strong>
                            ${item.label}
                        </strong>
                        <small>
                            ${item.value}
                            ·
                            ${new Intl.NumberFormat(
                                "pt-BR",
                                {
                                    minimumFractionDigits:
                                        1,
                                    maximumFractionDigits:
                                        1
                                }
                            ).format(
                                percentage
                            )}%
                        </small>
                    </span>
                `;
            button.addEventListener(
                "mouseenter",
                function () {
                    highlightDashboardService(
                        index
                    );
                }
            );
            button.addEventListener(
                "mouseleave",
                resetDashboardServiceHighlight
            );
            button.addEventListener(
                "focus",
                function () {
                    highlightDashboardService(
                        index
                    );
                }
            );
            button.addEventListener(
                "blur",
                resetDashboardServiceHighlight
            );
           button.addEventListener(
                "click",
                function () {
        openDashboardServiceFilter(
            item.key
        );
    }
);
            dashboardServiceLegend
                .appendChild(
                    button
                );
        }
    );
}
function renderDashboardServiceChart() {
    if (
        !dashboardServiceCanvas
    ) {
        return;
    }
    if (
        typeof window.Chart ===
            "undefined"
    ) {
        console.error(
            "Chart.js não foi carregado."
        );
        return;
    }
    const items =
        getDashboardServiceValues();
    const labels =
        items.map(
            function (item) {
                return item.label;
            }
        );
    const values =
        items.map(
            function (item) {
                return item.value;
            }
        );
    const colors =
        items.map(
            function (item) {
                return item.color;
            }
        );
    if (
        dashboardServiceChart
    ) {
        dashboardServiceActiveIndex =
            null;
       dashboardServiceChart
          .setActiveElements(
              []
          );
        dashboardServiceChart
            .data
            .labels =
                labels;
        dashboardServiceChart
            .data
            .datasets[0]
            .data =
                values;
        dashboardServiceChart
            .data
            .datasets[0]
            .backgroundColor =
                colors;
        dashboardServiceChart.update();
        renderDashboardServiceLegend();
        updateDashboardServiceCenter();
        return;
    }
    dashboardServiceChart =
        new window.Chart(
            dashboardServiceCanvas,
            {
                type:
                    "doughnut",
                data: {
                    labels:
                        labels,
                    datasets: [
                        {
                            data:
                                values,
                            backgroundColor:
                                colors,
                            borderWidth:
                                0,
                            hoverBorderWidth:
                                0,
                            radius:
                                "88%",
                            hoverOffset:
                                0,
                            spacing:
                                0
                        }
                    ]
                },
                options: {
                    responsive:
                        true,
                    maintainAspectRatio:
                        false,
                    devicePixelRatio:
                        Math.min(
                            Math.max(
                                window.devicePixelRatio || 1,
                                2
                            ),
                            3
                        ),
                    layout: {
                        padding:
                            6
                    },
                    cutout:
                        "72%",
                    animation: {
                        duration:
                            480,
                        easing:
                            "easeOutQuart"
                    },
                   animations: {
                            colors: {
                                type: "color",
                                duration: 180,
                                easing: "easeOutQuad"
                            }
                        },
                    interaction: {
                        mode:
                            "nearest",
                        intersect:
                            true
                    },
                    plugins: {
                        legend: {
                            display:
                                false
                        },
                        tooltip: {
                            enabled:
                                false
                        }
                    },
                    onHover:
                         function (
                             event,
                             elements
                         ) {
                             const canvas =
                                 event
                                     .native
                                     ?.target;
                             if (
                                 canvas
                             ) {
                                 canvas.style.cursor =
                                     elements.length
                                         ? "pointer"
                                         : "default";
                             }
                             if (
                                 elements.length
                             ) {
                                 highlightDashboardService(
                                     elements[0]
                                         .index
                                 );
                             }
                             else {
                                 resetDashboardServiceHighlight();
                             }
                         },
                     onClick:
                         function (
                             event,
                             elements
                         ) {
                             if (
                                 !elements.length
                             ) {
                                 return;
                             }
                             const index =
                                 elements[0].index;
                             const item =
                                 DASHBOARD_SERVICE_CONFIG[
                                     index
                                 ];
                             if (
                                 !item
                             ) {
                                 return;
                             }
                             openDashboardServiceFilter(
                                 item.key
                             );
                         }
                }
            }
        );
    dashboardServiceCanvas
        .addEventListener(
            "mouseleave",
            resetDashboardServiceHighlight
        );
    renderDashboardServiceLegend();
    updateDashboardServiceCenter();
}
/* =========================================================
   DASHBOARD — CARTEIRA FINANCEIRA
========================================================= */
function getDashboardFinanceValues() {
    let pendingCents =
        0;
    let overdueCents =
        0;
    dashboardFinanceRecords.forEach(
        function (record) {
            const valueCents =
                Number(
                    record.contractValueCents
                );
            if (
                !Number.isSafeInteger(
                    valueCents
                )
                ||
                valueCents <= 0
            ) {
                return;
            }
            const paymentStatus =
                getFinancePaymentStatus(
                    record
                );
            /*
               Mensal antigo marcado como pago,
               ainda não migrado para a estrutura
               recorrente.
               Não representa cobrança aberta.
            */
            if (
                paymentStatus.legacyMonthly ===
                    true
            ) {
                return;
            }
            if (
                paymentStatus.key ===
                    "overdue"
            ) {
                overdueCents +=
                    valueCents;
                return;
            }
            /*
               "pending" e "up_to_date"
               representam a cobrança atual
               ainda não vencida.
            */
            if (
                paymentStatus.key ===
                    "pending"
                ||
                paymentStatus.key ===
                    "up_to_date"
            ) {
                pendingCents +=
                    valueCents;
            }
        }
    );
    return [
        {
            ...DASHBOARD_FINANCE_CONFIG[0],
            value:
                pendingCents
        },
        {
            ...DASHBOARD_FINANCE_CONFIG[1],
            value:
                overdueCents
        }
    ];
}
function updateDashboardFinanceCenter(
    index = null
) {
    const items =
        getDashboardFinanceValues();
    const totalCents =
        items.reduce(
            function (
                sum,
                item
            ) {
                return (
                    sum +
                    item.value
                );
            },
            0
        );
    if (
        dashboardFinanceError
    ) {
        dashboardFinanceCenterValue
            .textContent =
                "Erro";
        dashboardFinanceCenterLabel
            .textContent =
                "Financeiro";
        dashboardFinanceCenterPercent
            .textContent =
                "Não foi possível carregar";
        return;
    }
    if (
        index === null
        ||
        !items[index]
    ) {
        dashboardFinanceCenterValue
            .textContent =
                formatFinanceMoney(
                    totalCents
                );
        dashboardFinanceCenterLabel
            .textContent =
                "Total em aberto";
        dashboardFinanceCenterPercent
            .textContent =
                totalCents > 0
                    ? "100% da carteira"
                    : "Sem valores em aberto";
        return;
    }
    const item =
        items[index];
    const percentage =
        totalCents > 0
            ? (
                item.value /
                totalCents
            ) * 100
            : 0;
    dashboardFinanceCenterValue
        .textContent =
            formatFinanceMoney(
                item.value
            );
    dashboardFinanceCenterLabel
        .textContent =
            item.label;
    dashboardFinanceCenterPercent
        .textContent =
            new Intl.NumberFormat(
                "pt-BR",
                {
                    minimumFractionDigits:
                        1,
                    maximumFractionDigits:
                        1
                }
            )
                .format(
                    percentage
                )
            +
            "%";
}
function highlightDashboardFinance(
    index
) {
    if (
        !dashboardFinanceChart
    ) {
        return;
    }
    if (
        dashboardFinanceActiveIndex ===
            index
    ) {
        return;
    }
    dashboardFinanceActiveIndex =
        index;
    const colors =
        DASHBOARD_FINANCE_CONFIG.map(
            function (
                item,
                itemIndex
            ) {
                if (
                    itemIndex ===
                    index
                ) {
                    return item.color;
                }
                return dashboardHexToRgba(
                    item.color,
                    0.18
                );
            }
        );
    dashboardFinanceChart
        .data
        .datasets[0]
        .backgroundColor =
            colors;
    dashboardFinanceChart
        .setActiveElements(
            [
                {
                    datasetIndex:
                        0,
                    index:
                        index
                }
            ]
        );
    updateDashboardFinanceCenter(
        index
    );
    /*
       Sincroniza a legenda
       com a fatia ativa.
    */
    updateDashboardLegendHighlight(
        dashboardFinanceLegend,
        index
    );
    dashboardFinanceChart.update();
}
function resetDashboardFinanceHighlight() {
    if (
        !dashboardFinanceChart
    ) {
        return;
    }
    dashboardFinanceActiveIndex =
        null;
    dashboardFinanceChart
        .data
        .datasets[0]
        .backgroundColor =
            DASHBOARD_FINANCE_CONFIG.map(
                function (item) {
                    return item.color;
                }
            );
    dashboardFinanceChart
        .setActiveElements(
            []
        );
    updateDashboardFinanceCenter();
    /*
       Remove também qualquer
       destaque visual da legenda.
    */
    updateDashboardLegendHighlight(
        dashboardFinanceLegend
    );
    dashboardFinanceChart.update();
}
/* =========================================================
   DASHBOARD — NAVEGAÇÃO FINANCEIRA
========================================================= */
function openDashboardFinanceFilter(
    statusKey
) {
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    if (
        statusKey !==
            "pending"
        &&
        statusKey !==
            "overdue"
    ) {
        return;
    }
    resetFinanceFilters();
    dashboardFinanceListFilter =
        statusKey === "pending"
            ? "pending_all"
            : statusKey;
    showFinanceView();
}
function renderDashboardFinanceLegend() {
    if (
        !dashboardFinanceLegend
    ) {
        return;
    }
    const items =
        getDashboardFinanceValues();
    const totalCents =
        items.reduce(
            function (
                sum,
                item
            ) {
                return (
                    sum +
                    item.value
                );
            },
            0
        );
    dashboardFinanceLegend.innerHTML =
        "";
    items.forEach(
        function (
            item,
            index
        ) {
            const percentage =
                totalCents > 0
                    ? (
                        item.value /
                        totalCents
                    ) * 100
                    : 0;
            const button =
                document.createElement(
                    "button"
                );
            button.type =
                "button";
            button.className =
                "dashboard-legend-item";
            button.innerHTML =
                `
                    <span
                        class="dashboard-legend-color"
                        style="
                            background:
                                ${item.color};
                        "
                    ></span>
                    <span
                        class="dashboard-legend-copy"
                    >
                        <strong>
                            ${item.label}
                        </strong>
                        <small>
                            ${formatFinanceMoney(
                                item.value
                            )}
                            ·
                            ${new Intl.NumberFormat(
                                "pt-BR",
                                {
                                    minimumFractionDigits:
                                        1,
                                    maximumFractionDigits:
                                        1
                                }
                            ).format(
                                percentage
                            )}%
                        </small>
                    </span>
                `;
            button.addEventListener(
                "mouseenter",
                function () {
                    highlightDashboardFinance(
                        index
                    );
                }
            );
            button.addEventListener(
                "mouseleave",
                resetDashboardFinanceHighlight
            );
            button.addEventListener(
                "focus",
                function () {
                    highlightDashboardFinance(
                        index
                    );
                }
            );
            button.addEventListener(
                "blur",
                resetDashboardFinanceHighlight
            );
           button.addEventListener(
             "click",
             function () {
        openDashboardFinanceFilter(
            item.key
        );
    }
);
            dashboardFinanceLegend
                .appendChild(
                    button
                );
        }
    );
}
function renderDashboardFinanceChart() {
    if (
        !dashboardFinanceCanvas
        ||
        !dashboardFinanceCard
    ) {
        return;
    }
    /*
       Segurança também na camada de UI.
    */
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    if (
        typeof window.Chart ===
            "undefined"
    ) {
        console.error(
            "Chart.js não foi carregado."
        );
        return;
    }
    const items =
        getDashboardFinanceValues();
    const labels =
        items.map(
            function (item) {
                return item.label;
            }
        );
    const values =
        items.map(
            function (item) {
                return item.value;
            }
        );
    const colors =
        items.map(
            function (item) {
                return item.color;
            }
        );
    if (
        dashboardFinanceChart
    ) {
        dashboardFinanceActiveIndex =
            null;
        dashboardFinanceChart
            .data
            .labels =
                labels;
        dashboardFinanceChart
            .data
            .datasets[0]
            .data =
                values;
        dashboardFinanceChart
            .data
            .datasets[0]
            .backgroundColor =
                colors;
        dashboardFinanceChart.update();
        renderDashboardFinanceLegend();
        updateDashboardFinanceCenter();
        return;
    }
    dashboardFinanceChart =
        new window.Chart(
            dashboardFinanceCanvas,
            {
                type:
                    "doughnut",
                data: {
                    labels:
                        labels,
                    datasets: [
                        {
                            data:
                                values,
                            backgroundColor:
                                colors,
                            borderWidth:
                                0,
                            hoverBorderWidth:
                                0,
                            radius:
                                "88%",
                            hoverOffset:
                                0,
                            spacing:
                                0
                        }
                    ]
                },
                options: {
                    responsive:
                        true,
                    maintainAspectRatio:
                        false,
                    devicePixelRatio:
                        Math.min(
                            Math.max(
                                window.devicePixelRatio || 1,
                                2
                            ),
                            3
                        ),
                    layout: {
                        padding:
                            6
                    },
                    cutout:
                        "72%",
                    animation: {
                        duration:
                            480,
                        easing:
                            "easeOutQuart"
                    },
                     animations: {
                         colors: {
                             type: "color",
                             duration: 180,
                             easing: "easeOutQuad"
                         }
                     },
                    interaction: {
                        mode:
                            "nearest",
                        intersect:
                            true
                    },
                    plugins: {
                        legend: {
                            display:
                                false
                        },
                        tooltip: {
                            enabled:
                                false
                        }
                    },
                    onHover:
                         function (
                             event,
                             elements
                         ) {
                             const canvas =
                                 event
                                     .native
                                     ?.target;
                             if (
                                 canvas
                             ) {
                                 canvas.style.cursor =
                                     elements.length
                                         ? "pointer"
                                         : "default";
                             }
                             if (
                                 elements.length
                             ) {
                                 highlightDashboardFinance(
                                     elements[0]
                                         .index
                                 );
                             }
                             else {
                                 resetDashboardFinanceHighlight();
                             }
                         },
                     onClick:
                         function (
                             event,
                             elements
                         ) {
                             if (
                                 !elements.length
                             ) {
                                 return;
                             }
                             const index =
                                 elements[0].index;
                             const item =
                                 DASHBOARD_FINANCE_CONFIG[
                                     index
                                 ];
                             if (
                                 !item
                             ) {
                                 return;
                             }
                             openDashboardFinanceFilter(
                                 item.key
                             );
                         }
                }
            }
        );
    dashboardFinanceCanvas
        .addEventListener(
            "mouseleave",
            resetDashboardFinanceHighlight
        );
    renderDashboardFinanceLegend();
    updateDashboardFinanceCenter();
}
/* =========================================================
   DASHBOARD — LISTENER FINANCEIRO OWNER
========================================================= */
function stopDashboardFinanceListener() {
    if (
        unsubscribeDashboardFinanceRecords
    ) {
        unsubscribeDashboardFinanceRecords();
        unsubscribeDashboardFinanceRecords =
            null;
    }
    dashboardFinanceRecords =
        [];
    dashboardFinanceError =
        false;
   dashboardFinanceLoaded =
       false;
    dashboardFinanceActiveIndex =
        null;
    if (
        dashboardFinanceChart
    ) {
        dashboardFinanceChart.destroy();
        dashboardFinanceChart =
            null;
    }
    if (
        dashboardFinanceCard
    ) {
        dashboardFinanceCard
            .classList
            .add(
                "hidden"
            );
    }
}
function startDashboardFinanceListener() {
    /*
       Regra principal:
       manager e staff NUNCA fazem esta consulta.
    */
    stopDashboardFinanceListener();
    if (
        !currentAdminProfile
        ||
        currentAdminProfile.role !==
            "owner"
    ) {
        return;
    }
    dashboardFinanceCard
        .classList
        .remove(
            "hidden"
        );
    dashboardFinanceError =
        false;
    renderDashboardFinanceChart();
    unsubscribeDashboardFinanceRecords =
        onSnapshot(
            collection(
                db,
                "finance_records"
            ),
            function (snapshot) {
               dashboardFinanceError =
                    false;
               dashboardFinanceLoaded =
                    true;
                dashboardFinanceRecords =
                    snapshot.docs.map(
                        function (document) {
                            return {
                                id:
                                    document.id,
                                ...document.data()
                            };
                        }
                    );
                updateDashboardMetrics();
                renderDashboardFinanceChart();
            },
            function (error) {
                console.error(
                    "Erro ao carregar financeiro do Dashboard:",
                    error
                );
                dashboardFinanceRecords =
                    [];
                dashboardFinanceError =
                    true;
               dashboardFinanceLoaded =
                   false;
               updateDashboardMetrics();
                renderDashboardFinanceChart();
            }
        );
}
/* =========================================================
   CONTATOS — PERÍODO VINDO DO DASHBOARD
========================================================= */
const contactsCreatedFrom =
    document.getElementById("contactsCreatedFrom");
const contactsCreatedTo =
    document.getElementById("contactsCreatedTo");
const applyContactsDateButton =
    document.getElementById("applyContactsDateButton");
const contactsDateError =
    document.getElementById("contactsDateError");
let dashboardContactPeriodRange = null;
let dashboardContactPeriodLabel = "";
const contactsPeriodNotice =
    document.getElementById(
        "contactsPeriodNotice"
    );
const contactsPeriodText =
    document.getElementById(
        "contactsPeriodText"
    );
const clearContactsPeriodButton =
    document.getElementById(
        "clearContactsPeriodButton"
    );
function formatContactsDateInput(milliseconds) {
    if (!Number.isFinite(milliseconds)) {
        return "";
    }
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        date.getDate()
    ).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
function syncContactsDateInputs() {
    const range = dashboardContactPeriodRange;
    contactsCreatedFrom.value =
        range ? formatContactsDateInput(range.start) : "";
    contactsCreatedTo.value =
        range ? formatContactsDateInput(range.end) : "";
    contactsDateError.textContent = "";
}
function parseContactsDateInput(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }
    return date;
}
applyContactsDateButton.disabled = false;
applyContactsDateButton.addEventListener(
    "click",
    function () {
        contactsDateError.textContent = "";
        const fromValue = contactsCreatedFrom.value;
        const toValue = contactsCreatedTo.value;
        if (
            !contactsCreatedFrom.validity.valid ||
            !contactsCreatedTo.validity.valid
        ) {
            contactsDateError.textContent =
                "Informe datas válidas.";
            return;
        }
        if (!fromValue && !toValue) {
            clearContactsPeriod();
            renderContacts();
            return;
        }
        const fromDate = fromValue
            ? parseContactsDateInput(fromValue)
            : null;
        const toDate = toValue
            ? parseContactsDateInput(toValue)
            : null;
        if (
            (fromValue && !fromDate) ||
            (toValue && !toDate)
        ) {
            contactsDateError.textContent =
                "Informe datas válidas.";
            return;
        }
        if (
            fromDate &&
            toDate &&
            fromDate.getTime() > toDate.getTime()
        ) {
            contactsDateError.textContent =
                "A data inicial não pode ser posterior à data final.";
            return;
        }
        /*
           Inclui todo o último dia selecionado.
        */
        let end = Infinity;
        if (toDate) {
            const nextDay = new Date(toDate.getTime());
            nextDay.setDate(nextDay.getDate() + 1);
            end = nextDay.getTime() - 1;
        }
        dashboardContactPeriodRange = {
            start: fromDate
                ? fromDate.getTime()
                : -Infinity,
            end
        };
        const fromLabel = fromDate
            ? fromDate.toLocaleDateString("pt-BR")
            : "";
        const toLabel = toDate
            ? toDate.toLocaleDateString("pt-BR")
            : "";
        dashboardContactPeriodLabel =
            fromDate && toDate
                ? `${fromLabel} até ${toLabel}`
                : fromDate
                    ? `a partir de ${fromLabel}`
                    : `até ${toLabel}`;
        updateContactsPeriodNotice();
        renderContacts();
    }
);
/* =========================================================
   CONTATOS — LIMPAR TODOS OS FILTROS
========================================================= */
const clearContactsFiltersButton =
    document.getElementById("clearContactsFiltersButton");
function clearAllContactsFilters(renderList = true) {
    contactSearch.value = "";
    statusFilter.value = "todos";
    originFilter.value = "todos";
    tagFilter.value = "todos";
    dashboardContactServiceFilter = null;
    serviceFilter.value = "todos";
    contactFollowupFilter.value = "todos";
    clearContactsPeriod();
    if (renderList) {
        renderContacts();
    }
}
clearContactsFiltersButton.addEventListener(
    "click",
    function () {
        clearAllContactsFilters();
    }
);
function updateContactsPeriodNotice() {
    const filtered =
        dashboardContactPeriodRange !== null;
    contactsPeriodNotice.classList.toggle(
        "hidden",
        !filtered
    );
    contactsPeriodText.textContent =
        filtered
            ? `Leads criados em: ${dashboardContactPeriodLabel}`
            : "";
}
function applyDashboardContactPeriod() {
    const range =
        getDashboardPeriodRange();
    dashboardContactPeriodRange =
        range
            ? { ...range }
            : null;
    dashboardContactPeriodLabel =
        dashboardPeriodSummary.textContent;
    updateContactsPeriodNotice();
    syncContactsDateInputs();
}
function clearContactsPeriod() {
    dashboardContactPeriodRange = null;
    dashboardContactPeriodLabel = "";
    updateContactsPeriodNotice();
    syncContactsDateInputs();
}
clearContactsPeriodButton.addEventListener(
    "click",
    function () {
        clearContactsPeriod();
        renderContacts();
    }
);
/* =========================================================
   FILTRAGEM
========================================================= */
function getFilteredContacts() {
    const selectedFollowup = contactFollowupFilter.value;
    const now = new Date();
    const nowMilliseconds = now.getTime();
    const tomorrowMilliseconds = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    ).getTime();
    const search =
        contactSearch
            .value
            .trim()
            .toLowerCase();
    const status =
        statusFilter.value;
    const selectedOrigin =
        originFilter.value;
    const selectedTag =
        tagFilter.value;
   const selectedService =
    dashboardContactServiceFilter;
    return contacts.filter(
        function (contact) {
            if (selectedFollowup !== "todos") {
                const followupMilliseconds =
                    timestampToMilliseconds(contact.nextContactAt);
                const hasFollowup =
                    Number.isFinite(followupMilliseconds);
                let followupCategory = "sem_agendamento";
                if (hasFollowup) {
                    if (followupMilliseconds < nowMilliseconds) {
                        followupCategory = "vencidos";
                    } else if (
                        followupMilliseconds < tomorrowMilliseconds
                    ) {
                        followupCategory = "hoje";
                    } else {
                        followupCategory = "proximos";
                    }
                }
                if (followupCategory !== selectedFollowup) {
                    return false;
                }
            }
         if (dashboardContactPeriodRange) {
             const created =
                 timestampToMilliseconds(
                     contact.createdAt
                 );
             if (
                 created === null
                 ||
                 created <
                     dashboardContactPeriodRange.start
                 ||
                 created >
                     dashboardContactPeriodRange.end
             ) {
                 return false;
             }
         }
            /*
               CONTATOS FECHADOS NÃO FAZEM
               MAIS PARTE DA ÁREA COMERCIAL.
            */
            const isClosed =
                contact.status ===
                    "fechado";
            if (
                isClosed
            ) {
                return false;
            }
            const archived =
                isContactArchived(
                    contact
                );
            const matchesView =
                contactsViewMode ===
                    "arquivados"
                    ? archived
                    : !archived;
            const matchesStatus =
                status ===
                    "todos"
                ||
                contact.status ===
                    status;
            const contactOrigin =
                getContactOrigin(
                    contact
                );
            const matchesOrigin =
                selectedOrigin ===
                    "todos"
                ||
                contactOrigin ===
                    selectedOrigin;
           const contactService =
             getDashboardServiceKey(
                 contact
             );
         const matchesService =
             !selectedService
             ||
             contactService ===
                 selectedService;
            const contactTags =
                getContactTags(
                    contact
                );
            const matchesTag =
                selectedTag ===
                    "todos"
                ||
                contactTags.some(
                    function (tag) {
                        return (
                            tag
                                .toLowerCase() ===
                            selectedTag
                        );
                    }
                );
            const searchable =
                [
                    contact.name,
                    contact.company,
                    contact.contact,
                    contact.service,
                    contact.message,
                    originLabel(
                        contactOrigin
                    ),
                    ...contactTags
                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            const matchesSearch =
                !search
                ||
                searchable.includes(
                    search
                );
           return (
                matchesView
                &&
                matchesStatus
                &&
                matchesOrigin
                &&
                matchesService
                &&
                matchesTag
                &&
                matchesSearch
            );
        }
    );
}
/* =========================================================
   FORMATAÇÃO DE DATA
========================================================= */
function formatDate(timestamp) {
    if (
        !timestamp ||
        typeof timestamp.toDate !==
        "function"
    ) {
        return "—";
    }
    return timestamp
        .toDate()
        .toLocaleString(
            "pt-BR",
            {
                dateStyle:
                    "short",
                timeStyle:
                    "short"
            }
        );
}
/* =========================================================
   NOME DO STATUS
========================================================= */
function statusLabel(status) {
      const labels = {
          novo:
              "Novo",
          em_contato:
              "Em contato",
          follow_up:
              "Follow-up",
          proposta:
              "Proposta",
          aguardando_cliente:
              "Aguardando cliente",
          fechado:
              "Fechado",
         perdido:
             "Perdido",
          arquivado:
              "Arquivado"
      };
    return (
        labels[status]
        ||
        "Novo"
    );
}
/* =========================================================
   ORIGEM E TAGS
========================================================= */
const knownOrigins = [
    "site",
    "instagram",
    "whatsapp",
    "indicacao",
    "prospeccao",
    "evento",
    "google",
    "outro",
    "nao_informado"
];
function getContactOrigin(
    contact
) {
    const origin =
        typeof contact.origin ===
            "string"
            ? contact.origin
                .trim()
                .toLowerCase()
            : "";
    if (
        knownOrigins.includes(
            origin
        )
    ) {
        return origin;
    }
    return (
        contact.source ===
            "site"
            ? "site"
            : "nao_informado"
    );
}
function originLabel(
    origin
) {
    const labels = {
        site:
            "Site",
        instagram:
            "Instagram",
        whatsapp:
            "WhatsApp",
        indicacao:
            "Indicação",
        prospeccao:
            "Prospecção",
        evento:
            "Evento",
        google:
            "Google",
        outro:
            "Outro",
        nao_informado:
            "Não informado"
    };
    return (
        labels[origin] ||
        "Não informado"
    );
}
function getContactTags(
    contact
) {
    if (
        !Array.isArray(
            contact.tags
        )
    ) {
        return [];
    }
    return contact.tags
        .filter(
            function (tag) {
                return (
                    typeof tag ===
                        "string"
                    &&
                    tag.trim()
                );
            }
        )
        .map(
            function (tag) {
                return tag.trim();
            }
        );
}
function lossReasonLabel(reason) {
    const labels = {
        preco:
            "Preço / orçamento",
        concorrente:
            "Escolheu concorrente",
        sem_retorno:
            "Sem retorno",
        sem_fit:
            "Sem fit",
        projeto_adiado:
            "Projeto adiado",
        desqualificado:
            "Lead desqualificado",
        outro:
            "Outro"
    };
    return (
        labels[reason]
        ||
        "Não definido"
    );
}
function populateTagFilter() {
    const currentValue =
        tagFilter.value ||
        "todos";
    const availableTags =
        new Map();
    contacts.forEach(
        function (contact) {
            getContactTags(
                contact
            )
                .forEach(
                    function (tag) {
                        const key =
                            tag.toLowerCase();
                        if (
                            !availableTags.has(
                                key
                            )
                        ) {
                            availableTags.set(
                                key,
                                tag
                            );
                        }
                    }
                );
        }
    );
    const options =
        Array
            .from(
                availableTags.entries()
            )
            .sort(
                function (
                    first,
                    second
                ) {
                    return first[1]
                        .localeCompare(
                            second[1],
                            "pt-BR"
                        );
                }
            )
            .map(
                function (
                    [key, label]
                ) {
                    return `
                        <option
                            value="${escapeHTML(key)}"
                        >
                            ${escapeHTML(label)}
                        </option>
                    `;
                }
            )
            .join("");
    tagFilter.innerHTML =
        `
            <option value="todos">
                Todas as tags
            </option>
            ${options}
        `;
    const stillExists =
        Array
            .from(
                tagFilter.options
            )
            .some(
                function (option) {
                    return (
                        option.value ===
                        currentValue
                    );
                }
            );
    tagFilter.value =
        stillExists
            ? currentValue
            : "todos";
}
/* =========================================================
   ESCAPE HTML
   Impede que texto enviado pelo formulário
   seja interpretado como HTML.
========================================================= */
function escapeHTML(value) {
    return String(
        value ?? ""
    )
    .replaceAll(
        "&",
        "&amp;"
    )
    .replaceAll(
        "<",
        "&lt;"
    )
    .replaceAll(
        ">",
        "&gt;"
    )
    .replaceAll(
        '"',
        "&quot;"
    )
    .replaceAll(
        "'",
        "&#039;"
    );
}
/* =========================================================
   PRIORIDADE AUTOMÁTICA
========================================================= */
function timestampToMilliseconds(timestamp) {
    if (!timestamp) {
        return null;
    }
    if (
        typeof timestamp.toDate ===
        "function"
    ) {
        return timestamp
            .toDate()
            .getTime();
    }
    if (
        timestamp instanceof Date
    ) {
        return timestamp.getTime();
    }
    return null;
}
/* =========================================================
   DASHBOARD — CLASSIFICAÇÃO DE FOLLOW-UPS
========================================================= */
function getDashboardFollowupData() {
    const now =
        new Date();
    const tomorrow =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        );
    const overdue =
        [];
    const today =
        [];
    const upcoming =
        [];
    contacts.forEach(
        function (contact) {
            /*
               Contatos fora da operação
               comercial não entram.
            */
            if (
                isContactArchived(
                    contact
                )
                ||
                contact.status ===
                    "fechado"
                ||
                contact.status ===
                    "perdido"
            ) {
                return;
            }
            const milliseconds =
                timestampToMilliseconds(
                    contact.nextContactAt
                );
            /*
               Sem próximo contato definido.
            */
            if (
                milliseconds ===
                    null
            ) {
                return;
            }
            /*
               Já passou.
            */
            if (
                milliseconds <
                    now.getTime()
            ) {
                overdue.push(
                    {
                        contact:
                            contact,
                        dueAt:
                            milliseconds
                    }
                );
                return;
            }
            /*
               Ainda acontecerá hoje.
            */
            if (
                milliseconds <
                    tomorrow.getTime()
            ) {
                today.push(
                    {
                        contact:
                            contact,
                        dueAt:
                            milliseconds
                    }
                );
                return;
            }
            /*
               Amanhã ou depois.
            */
            upcoming.push(
                {
                    contact:
                        contact,
                    dueAt:
                        milliseconds
                }
            );
        }
    );
    /*
       Mais urgentes primeiro.
    */
    overdue.sort(
        function (a, b) {
            return (
                a.dueAt -
                b.dueAt
            );
        }
    );
    today.sort(
        function (a, b) {
            return (
                a.dueAt -
                b.dueAt
            );
        }
    );
    upcoming.sort(
        function (a, b) {
            return (
                a.dueAt -
                b.dueAt
            );
        }
    );
    return {
        overdue:
            overdue,
        today:
            today,
        upcoming:
            upcoming
    };
}
function updateDashboardFollowupSummary() {
    if (
        !dashboardFollowupOverdue
        ||
        !dashboardFollowupToday
        ||
        !dashboardFollowupUpcoming
    ) {
        return;
    }
    const data =
        getDashboardFollowupData();
    dashboardFollowupOverdue
        .textContent =
            data.overdue.length;
    dashboardFollowupToday
        .textContent =
            data.today.length;
    dashboardFollowupUpcoming
        .textContent =
            data.upcoming.length;
}
/* =========================================================
   DASHBOARD — DATA DO FOLLOW-UP
========================================================= */
function formatDashboardFollowupDueDate(
    milliseconds
) {
    const date =
        new Date(
            milliseconds
        );
    const now =
        new Date();
    const today =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
    const tomorrow =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        );
    const dayAfterTomorrow =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 2
        );
    const time =
        new Intl.DateTimeFormat(
            "pt-BR",
            {
                hour:
                    "2-digit",
                minute:
                    "2-digit"
            }
        )
            .format(
                date
            );
    if (
        milliseconds >=
            today.getTime()
        &&
        milliseconds <
            tomorrow.getTime()
    ) {
        return (
            `Hoje · ${time}`
        );
    }
    if (
        milliseconds >=
            tomorrow.getTime()
        &&
        milliseconds <
            dayAfterTomorrow.getTime()
    ) {
        return (
            `Amanhã · ${time}`
        );
    }
    const formattedDate =
        new Intl.DateTimeFormat(
            "pt-BR",
            {
                day:
                    "2-digit",
                month:
                    "2-digit",
                year:
                    "numeric"
            }
        )
            .format(
                date
            );
    return (
        `${formattedDate} · ${time}`
    );
}
/* =========================================================
   DASHBOARD — LISTA DE FOLLOW-UPS
========================================================= */
function renderDashboardFollowupList() {
    if (
        !dashboardFollowupList
    ) {
        return;
    }
    const data =
        getDashboardFollowupData();
    /*
       Ordem operacional:
       1. Vencidos
       2. Hoje
       3. Próximos
    */
    const items = [
        ...data.overdue.map(
            function (item) {
                return {
                    ...item,
                    type:
                        "overdue",
                    label:
                        "Vencido"
                };
            }
        ),
        ...data.today.map(
            function (item) {
                return {
                    ...item,
                    type:
                        "today",
                    label:
                        "Hoje"
                };
            }
        ),
        ...data.upcoming.map(
            function (item) {
                return {
                    ...item,
                    type:
                        "upcoming",
                    label:
                        "Próximo"
                };
            }
        )
    ];
    /*
       Evita transformar o Dashboard
       em uma lista gigante.
       Os 8 mais urgentes aparecem.
    */
    const filteredItems =
    dashboardFollowupFilter ===
        "all"
        ? items
        : items.filter(
            function (item) {
                return (
                    item.type ===
                    dashboardFollowupFilter
                );
            }
        );
const visibleItems =
    filteredItems.slice(
        0,
        8
    );
    if (
    visibleItems.length ===
        0
) {
    const emptyMessages = {
        all:
            "Nenhum follow-up para exibir.",
        overdue:
            "Nenhum follow-up vencido.",
        today:
            "Nenhum contato programado para hoje.",
        upcoming:
            "Nenhum próximo follow-up agendado."
    };
    dashboardFollowupList
        .innerHTML =
            `
                <div class="dashboard-followup-empty">
                    ${emptyMessages[
                        dashboardFollowupFilter
                    ] || emptyMessages.all}
                </div>
            `;
    return;
}
    dashboardFollowupList
        .innerHTML =
            visibleItems
                .map(
                    function (item) {
                        const contact =
                            item.contact;
                        const company =
                            contact.company
                            ||
                            "Empresa não informada";
                        const service =
                            contact.service
                            ||
                            "Serviço não definido";
                        const status =
                            statusLabel(
                                contact.status
                            );
                        const dueDate =
                            formatDashboardFollowupDueDate(
                                item.dueAt
                            );
                        return `
                            <button
                                type="button"
                                class="
                                    dashboard-followup-item
                                    dashboard-followup-item-${escapeHTML(
                                        item.type
                                    )}
                                "
                                data-id="${escapeHTML(
                                    contact.id
                                )}"
                            >
                                <div
                                    class="dashboard-followup-item-main"
                                >
                                    <div
                                        class="dashboard-followup-person"
                                    >
                                        <strong>
                                            ${escapeHTML(
                                                contact.name ||
                                                "Sem nome"
                                            )}
                                        </strong>
                                        <span>
                                            ${escapeHTML(
                                                company
                                            )}
                                        </span>
                                    </div>
                                    <div
                                        class="dashboard-followup-meta"
                                    >
                                        <span>
                                            ${escapeHTML(
                                                service
                                            )}
                                        </span>
                                        <i></i>
                                        <span>
                                            ${escapeHTML(
                                                status
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    class="dashboard-followup-due"
                                >
                                    <span
                                        class="
                                            dashboard-followup-badge
                                            dashboard-followup-badge-${escapeHTML(
                                                item.type
                                            )}
                                        "
                                    >
                                        ${escapeHTML(
                                            item.label
                                        )}
                                    </span>
                                    <strong>
                                        ${escapeHTML(
                                            dueDate
                                        )}
                                    </strong>
                                    <small>
                                        Abrir lead →
                                    </small>
                                </div>
                            </button>
                        `;
                    }
                )
                .join("");
    /*
       Quantos ficaram fora dos
       oito mais urgentes.
    */
   const remaining =
       filteredItems.length -
       visibleItems.length;
    if (
        remaining >
            0
    ) {
        dashboardFollowupList
            .insertAdjacentHTML(
                "beforeend",
                `
                    <div class="dashboard-followup-more">
                        +${remaining}
                        ${
                            remaining === 1
                                ? "follow-up adicional"
                                : "follow-ups adicionais"
                        }
                    </div>
                `
            );
    }
    /*
       Clique abre exatamente o mesmo
       modal usado na tela Contatos.
    */
    dashboardFollowupList
        .querySelectorAll(
            ".dashboard-followup-item"
        )
        .forEach(
            function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        openContact(
                            button.dataset.id
                        );
                    }
                );
            }
        );
}
/* =========================================================
   DASHBOARD — FILTRO DE FOLLOW-UPS
========================================================= */
function updateDashboardFollowupFilterUI() {
    document
        .querySelectorAll(
            "[data-followup-filter]"
        )
        .forEach(
            function (card) {
                const isActive =
                    card.dataset
                        .followupFilter ===
                    dashboardFollowupFilter;
                card.classList.toggle(
                    "is-active",
                    isActive
                );
                card.setAttribute(
                    "aria-pressed",
                    isActive
                        ? "true"
                        : "false"
                );
            }
        );
}
function setDashboardFollowupFilter(
    filter
) {
    const validFilters = [
        "overdue",
        "today",
        "upcoming"
    ];
    if (
        !validFilters.includes(
            filter
        )
    ) {
        return;
    }
    /*
       Clicou novamente no filtro
       já selecionado → mostrar tudo.
    */
    if (
        dashboardFollowupFilter ===
            filter
    ) {
        dashboardFollowupFilter =
            "all";
    }
    else {
        dashboardFollowupFilter =
            filter;
    }
    updateDashboardFollowupFilterUI();
    renderDashboardFollowupList();
}
document
    .querySelectorAll(
        "[data-followup-filter]"
    )
    .forEach(
        function (card) {
            card.addEventListener(
                "click",
                function () {
                    setDashboardFollowupFilter(
                        card.dataset
                            .followupFilter
                    );
                }
            );
            card.addEventListener(
                "keydown",
                function (event) {
                    if (
                        event.key !==
                            "Enter"
                        &&
                        event.key !==
                            " "
                    ) {
                        return;
                    }
                    event.preventDefault();
                    setDashboardFollowupFilter(
                        card.dataset
                            .followupFilter
                    );
                }
            );
        }
    );
function getContactPriority(contact) {
    const status =
        contact.status ||
        "novo";
/*
   Contato arquivado está fora
   da operação ativa.
*/
   if (
       contact.archived ===
       true
   ) {
       return {
           key:
               "finalizado",
           label:
               "Arquivado",
           order:
               0,
           dueAt:
               null
       };
   }
    /*
       Leads finalizados sempre ficam no fim,
       independentemente de follow-up.
    */
   if (
    status === "fechado" ||
    status === "perdido"
) {
    return {
        key: "finalizado",
        label: "Finalizado",
        order: 0,
        dueAt: null
    };
}
    const now =
        new Date();
    const nextContactMilliseconds =
        timestampToMilliseconds(
            contact.nextContactAt
        );
    /*
       Existe follow-up definido.
    */
    if (
        nextContactMilliseconds !== null
    ) {
        const nextContact =
            new Date(
                nextContactMilliseconds
            );
        /*
           Follow-up vencido.
        */
        if (
            nextContact < now
        ) {
            return {
                key: "critica",
                label: "Crítica",
                order: 4,
                dueAt:
                    nextContactMilliseconds
            };
        }
        const tomorrow =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );
        /*
           Ainda será hoje.
        */
        if (
            nextContact < tomorrow
        ) {
            return {
                key: "alta",
                label: "Alta",
                order: 3,
                dueAt:
                    nextContactMilliseconds
            };
        }
        /*
           Follow-up futuro.
        */
        return {
            key: "media",
            label: "Média",
            order: 2,
            dueAt:
                nextContactMilliseconds
        };
    }
    /*
       Sem follow-up.
    */
    if (
        status === "novo"
    ) {
        return {
            key: "alta",
            label: "Alta",
            order: 3,
            dueAt: null
        };
    }
    if (
        status === "proposta"
    ) {
        return {
            key: "alta",
            label: "Alta",
            order: 3,
            dueAt: null
        };
    }
    if (
        status === "em_contato"
    ) {
        return {
            key: "media",
            label: "Média",
            order: 2,
            dueAt: null
        };
    }
    if (
        status === "follow_up"
    ) {
        return {
            key: "media",
            label: "Média",
            order: 2,
            dueAt: null
        };
    }
    if (
        status === "aguardando_cliente"
    ) {
        return {
            key: "baixa",
            label: "Baixa",
            order: 1,
            dueAt: null
        };
    }
    return {
        key: "baixa",
        label: "Baixa",
        order: 1,
        dueAt: null
    };
}
function sortContactsByPriority(
    contactA,
    contactB
) {
    const priorityA =
        getContactPriority(
            contactA
        );
    const priorityB =
        getContactPriority(
            contactB
        );
    /*
       Primeiro:
       prioridade maior.
    */
    if (
        priorityA.order !==
        priorityB.order
    ) {
        return (
            priorityB.order -
            priorityA.order
        );
    }
    /*
       Dentro da mesma prioridade,
       quem possui prazo vem primeiro.
    */
    if (
        priorityA.dueAt !== null &&
        priorityB.dueAt !== null
    ) {
        return (
            priorityA.dueAt -
            priorityB.dueAt
        );
    }
    if (
        priorityA.dueAt !== null
    ) {
        return -1;
    }
    if (
        priorityB.dueAt !== null
    ) {
        return 1;
    }
    /*
       Sem prazo:
       contatos mais recentes primeiro.
    */
    const createdA =
        timestampToMilliseconds(
            contactA.createdAt
        ) || 0;
    const createdB =
        timestampToMilliseconds(
            contactB.createdAt
        ) || 0;
    return (
        createdB -
        createdA
    );
}
/* =========================================================
   RENDERIZA CONTATOS
========================================================= */
function renderContacts() {
serviceFilter.value =
   dashboardContactServiceFilter || "todos";
    const filtered =
        getFilteredContacts()
            .sort(
                sortContactsByPriority
            );
    if (
       filtered.length === 0
   ) {
       const emptyMessage =
           contactsViewMode ===
               "arquivados"
               ? "Nenhum contato arquivado encontrado."
               : "Nenhum contato ativo encontrado.";
       contactsList.innerHTML =
           `
               <div class="empty-state">
                   ${emptyMessage}
               </div>
           `;
       return;
   }
    const groups =
    contactsViewMode ===
        "arquivados"
        ? [
            {
                key:
                    "finalizado",
                label:
                    "Arquivados"
            }
        ]
        : [
            {
                key:
                    "critica",
                label:
                    "Prioridade crítica"
            },
            {
                key:
                    "alta",
                label:
                    "Alta prioridade"
            },
            {
                key:
                    "media",
                label:
                    "Prioridade média"
            },
            {
                key:
                    "baixa",
                label:
                    "Baixa prioridade"
            },
            {
                key:
                    "finalizado",
                label:
                    "Finalizados"
            }
        ];
    contactsList.innerHTML =
        groups
            .map(
                function (group) {
                    const groupContacts =
                        filtered.filter(
                            function (contact) {
                                return (
                                    getContactPriority(
                                        contact
                                    ).key ===
                                    group.key
                                );
                            }
                        );
                    if (
                        groupContacts.length === 0
                    ) {
                        return "";
                    }
                    const rows =
                        groupContacts
                            .map(
                                function (contact) {
                                    const status =
                                        contact.status ||
                                        "novo";
                                    const priority =
                                        getContactPriority(
                                            contact
                                        );
                                   const origin =
                                        getContactOrigin(
                                            contact
                                        );
                                    const contactTags =
                                        getContactTags(
                                            contact
                                        );
                                    const visibleTags =
                                        contactTags
                                            .slice(
                                                0,
                                                2
                                            );
                                    const remainingTags =
                                        Math.max(
                                            contactTags.length -
                                            visibleTags.length,
                                            0
                                        );
                                    return `
                                        <article
                                            class="contact-row"
                                            data-id="${escapeHTML(contact.id)}"
                                        >
                                            <div class="contact-person">
                                                <div class="contact-person-top">
                                                    <strong>
                                                        ${escapeHTML(contact.name || "Sem nome")}
                                                    </strong>
                                                    <span
                                                        class="
                                                            priority-badge
                                                            priority-${escapeHTML(priority.key)}
                                                        "
                                                    >
                                                        ${escapeHTML(priority.label)}
                                                    </span>
                                                </div>
                                                <span>
                                                    ${escapeHTML(contact.company || "Empresa não informada")}
                                                </span>
                                                <div class="contact-classification">
                                                    <span
                                                        class="
                                                            origin-badge
                                                            origin-${escapeHTML(origin)}
                                                        "
                                                    >
                                                        ${escapeHTML(originLabel(origin))}
                                                    </span>
                                                    ${
                                                        visibleTags
                                                            .map(
                                                                function (tag) {
                                                                    return `
                                                                        <span class="contact-tag">
                                                                            ${escapeHTML(tag)}
                                                                        </span>
                                                                    `;
                                                                }
                                                            )
                                                            .join("")
                                                    }
                                                    ${
                                                        remainingTags > 0
                                                            ? `
                                                                <span
                                                                    class="
                                                                        contact-tag
                                                                        contact-tag-more
                                                                    "
                                                                >
                                                                    +${remainingTags}
                                                                </span>
                                                            `
                                                            : ""
                                                    }
                                                </div>
                                                </div>
                                            <div class="contact-cell">
                                                ${escapeHTML(contact.contact || "—")}
                                            </div>
                                            <div class="contact-service">
                                                ${escapeHTML(contact.service || "Não definido")}
                                            </div>
                                            <div class="contact-date">
                                                ${escapeHTML(formatDate(contact.createdAt))}
                                            </div>
                                            <span
                                                class="
                                                    status-badge
                                                    status-${escapeHTML(status)}
                                                "
                                            >
                                                ${escapeHTML(statusLabel(status))}
                                            </span>
                                        </article>
                                    `;
                                }
                            )
                            .join("");
                    return `
                        <section
                            class="
                                priority-group
                                priority-group-${group.key}
                            "
                        >
                            <div class="priority-group-header">
                                <div>
                                    <span
                                        class="priority-group-dot"
                                    ></span>
                                    <strong>
                                        ${group.label}
                                    </strong>
                                </div>
                                <span>
                                    ${groupContacts.length}
                                </span>
                            </div>
                            <div class="priority-group-items">
                                ${rows}
                            </div>
                        </section>
                    `;
                }
            )
            .join("");
    document
        .querySelectorAll(
            ".contact-row"
        )
        .forEach(
            function (row) {
                row.addEventListener(
                    "click",
                    function () {
                        openContact(
                            row.dataset.id
                        );
                    }
                );
            }
        );
}
/* =========================================================
   BUSCA / FILTRO
========================================================= */
contactSearch.addEventListener("input", function () {
    renderContacts();
});
statusFilter.addEventListener("change", function () {
    renderContacts();
});
originFilter.addEventListener("change", function () {
    renderContacts();
});
tagFilter.addEventListener("change", function () {
    renderContacts();
});
serviceFilter.addEventListener("change", function () {
    dashboardContactServiceFilter =
        serviceFilter.value === "todos"
            ? null
            : serviceFilter.value;
    renderContacts();
});
contactFollowupFilter.addEventListener(
    "change",
    function () {
        renderContacts();
    }
);
/*
   Recalcula prioridades enquanto
   o painel permanece aberto.
*/
setInterval(
    renderContacts,
    60000
);
/* =========================================================
   ATIVOS / ARQUIVADOS
========================================================= */
function updateContactsViewButtons() {
    const showingActive =
        contactsViewMode ===
        "ativos";
    activeContactsButton
        .classList
        .toggle(
            "active",
            showingActive
        );
    archivedContactsButton
        .classList
        .toggle(
            "active",
            !showingActive
        );
    activeContactsButton
        .setAttribute(
            "aria-pressed",
            String(
                showingActive
            )
        );
    archivedContactsButton
        .setAttribute(
            "aria-pressed",
            String(
                !showingActive
            )
        );
}
activeContactsButton.addEventListener(
    "click",
    function () {
        contactsViewMode =
            "ativos";
        updateContactsViewButtons();
        renderContacts();
    }
);
archivedContactsButton.addEventListener(
    "click",
    function () {
        contactsViewMode =
            "arquivados";
        updateContactsViewButtons();
        renderContacts();
    }
);
/* =========================================================
   ABRE CONTATO
========================================================= */
function formatDateTimeLocal(timestamp) {
    if (
        !timestamp ||
        typeof timestamp.toDate !==
        "function"
    ) {
        return "";
    }
    const date =
        timestamp.toDate();
    const pad =
        number =>
            String(number)
                .padStart(2, "0");
    return (
        `${date.getFullYear()}-` +
        `${pad(date.getMonth() + 1)}-` +
        `${pad(date.getDate())}T` +
        `${pad(date.getHours())}:` +
        `${pad(date.getMinutes())}`
    );
}
function configureContactActions(contact) {
    const rawContact =
        String(
            contact.contact || ""
        ).trim();
   const isManualLead =
       contact.source ===
       "manual";
    const emailMatch =
        rawContact.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );
    const email =
        emailMatch
            ? emailMatch[0]
            : null;
    /*
       Remove tudo que não seja número
       para verificar se existe telefone.
    */
    let phone =
        rawContact.replace(
            /\D/g,
            ""
        );
    let whatsappNumber =
        null;
    /*
       Telefone brasileiro sem 55.
       Exemplo:
       11900000000
    */
    if (
        phone.length === 10 ||
        phone.length === 11
    ) {
        whatsappNumber =
            `55${phone}`;
    }
    /*
       Telefone brasileiro já com 55.
    */
    else if (
        (
            phone.length === 12 ||
            phone.length === 13
        )
        &&
        phone.startsWith("55")
    ) {
        whatsappNumber =
            phone;
    }
    /*
       WHATSAPP
    */
    if (whatsappNumber) {
        const name =
            contact.name ||
            "";
       const message =
             isManualLead
                 ? (
                     name
                         ? `Olá, ${name}. Aqui é da ROASCE. Estou entrando em contato para dar continuidade ao nosso atendimento.`
                         : `Olá. Aqui é da ROASCE. Estou entrando em contato para dar continuidade ao nosso atendimento.`
                 )
                 : (
                     name
                         ? `Olá, ${name}. Aqui é da ROASCE. Recebemos seu contato pelo nosso site e estou retornando sua solicitação.`
                         : `Olá. Aqui é da ROASCE. Recebemos seu contato pelo nosso site e estou retornando sua solicitação.`
                 );
        modalWhatsAppButton.href =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        modalWhatsAppButton
            .classList
            .remove(
                "hidden"
            );
    }
    else {
        modalWhatsAppButton.href =
            "#";
        modalWhatsAppButton
            .classList
            .add(
                "hidden"
            );
    }
    /*
       EMAIL
    */
    if (email) {
        const name =
            contact.name ||
            "";
        const subject =
            "Retorno ROASCE";
        const body =
          isManualLead
              ? (
                  name
                      ? `Olá, ${name}.\n\nAqui é da ROASCE. Estou entrando em contato para dar continuidade ao nosso atendimento.`
                      : `Olá.\n\nAqui é da ROASCE. Estou entrando em contato para dar continuidade ao nosso atendimento.`
              )
              : (
                  name
                      ? `Olá, ${name}.\n\nAqui é da ROASCE. Recebemos seu contato pelo nosso site e estou retornando sua solicitação.`
                      : `Olá.\n\nAqui é da ROASCE. Recebemos seu contato pelo nosso site e estou retornando sua solicitação.`
              );
        modalEmailButton.href =
            `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        modalEmailButton
            .classList
            .remove(
                "hidden"
            );
    }
    else {
        modalEmailButton.href =
            "#";
        modalEmailButton
            .classList
            .add(
                "hidden"
            );
    }
    /*
       Só mostra a área caso exista
       alguma ação disponível.
    */
    if (
        whatsappNumber ||
        email
    ) {
        modalActions
            .classList
            .remove(
                "hidden"
            );
    }
    else {
        modalActions
            .classList
            .add(
                "hidden"
            );
    }
}
/* =========================================================
   HISTÓRICO INDIVIDUAL DO CONTATO
========================================================= */
function stopContactHistoryListener() {
    if (
        unsubscribeContactHistory
    ) {
        unsubscribeContactHistory();
        unsubscribeContactHistory =
            null;
    }
}
function renderContactHistory(
    historyLogs
) {
    contactHistoryCount.textContent =
        `${historyLogs.length} ${
            historyLogs.length === 1
                ? "registro"
                : "registros"
        }`;
    if (
        historyLogs.length === 0
    ) {
        contactHistoryList.innerHTML =
            `
                <div class="contact-history-empty">
                    Nenhuma alteração registrada para este contato.
                </div>
            `;
        return;
    }
    contactHistoryList.innerHTML =
        historyLogs
            .map(
                function (log) {
                    const user =
                        log.actorEmail ||
                        "Usuário não identificado";
                    const role =
                        roleLabel(
                            log.actorRole
                        );
                    return `
                        <article class="contact-history-item">
                            <div class="contact-history-meta">
                                <div class="contact-history-user">
                                    <strong>
                                        ${escapeHTML(user)}
                                    </strong>
                                    <span>
                                        ${escapeHTML(role)}
                                    </span>
                                </div>
                                <div class="contact-history-date">
                                    ${escapeHTML(formatAuditDate(log.createdAt))}
                                </div>
                            </div>
                            <div class="contact-history-changes">
                                ${renderAuditChanges(log)}
                            </div>
                        </article>
                    `;
                }
            )
            .join("");
}
function startContactHistoryListener(
    contactId
) {
    stopContactHistoryListener();
    /*
       Staff e manager nunca fazem
       consulta à coleção audit_logs.
    */
    if (
        !currentAdminProfile ||
        currentAdminProfile.role !==
            "owner"
    ) {
        contactHistorySection.classList.add(
            "hidden"
        );
        return;
    }
    contactHistorySection.classList.remove(
        "hidden"
    );
    contactHistoryCount.textContent =
        "Carregando...";
    contactHistoryList.innerHTML =
        `
            <div class="contact-history-empty">
                Carregando histórico...
            </div>
        `;
    /*
       Busca somente os registros
       pertencentes ao lead aberto.
       Ordenaremos no navegador para
       não depender de índice composto.
    */
    const historyQuery =
        query(
            collection(
                db,
                "audit_logs"
            ),
            where(
                "contactId",
                "==",
                contactId
            )
        );
    unsubscribeContactHistory =
        onSnapshot(
            historyQuery,
            function (snapshot) {
                const historyLogs =
                    snapshot.docs
                        .map(
                            function (document) {
                                return {
                                    id:
                                        document.id,
                                    ...document.data()
                                };
                            }
                        )
                        .sort(
                            function (a, b) {
                                const dateA =
                                    timestampToMilliseconds(
                                        a.createdAt
                                    ) || 0;
                                const dateB =
                                    timestampToMilliseconds(
                                        b.createdAt
                                    ) || 0;
                                return (
                                    dateB -
                                    dateA
                                );
                            }
                        );
                renderContactHistory(
                    historyLogs
                );
            },
            function (error) {
                console.error(
                    "Erro ao carregar histórico do contato:",
                    error
                );
                contactHistoryCount.textContent =
                    "Erro";
                contactHistoryList.innerHTML =
                    `
                        <div class="contact-history-empty">
                            Não foi possível carregar o histórico.
                        </div>
                    `;
            }
        );
}
/* =========================================================
   MOTIVO DA PERDA
========================================================= */
function updateLossReasonVisibility() {
    const isLost =
        modalStatus.value ===
        "perdido";
    if (isLost) {
        modalLossReasonGroup
            .classList
            .remove(
                "hidden"
            );
        return;
    }
    modalLossReasonGroup
        .classList
        .add(
            "hidden"
        );
    modalLossReason.value =
        "";
    lossReasonError.textContent =
        "";
}
modalStatus.addEventListener(
    "change",
    function () {
        updateLossReasonVisibility();
        if (
            modalStatus.value ===
                "fechado"
        ) {
            openClosingModal();
        }
    }
);
function parseBrazilianMoneyToCents(
    value
) {
    let clean =
        String(
            value || ""
        )
            .trim()
            .replace(
                /R\$/gi,
                ""
            )
            .replace(
                /\s/g,
                ""
            );
    if (!clean) {
        return null;
    }
    /*
       Formato brasileiro:
       1.500,00
    */
    if (
        clean.includes(",")
    ) {
        clean =
            clean
                .replace(
                    /\./g,
                    ""
                )
                .replace(
                    ",",
                    "."
                );
    }
    /*
       Permite também:
       1500.50
       Mas interpreta:
       1.500
       como mil e quinhentos.
    */
    else {
        const parts =
            clean.split(".");
        if (
            parts.length === 2
            &&
            parts[1].length === 3
        ) {
            clean =
                parts.join("");
        }
        else if (
            parts.length > 2
        ) {
            clean =
                parts.join("");
        }
    }
    if (
        !/^\d+(\.\d{1,2})?$/.test(
            clean
        )
    ) {
        return null;
    }
    const amount =
        Number(
            clean
        );
    if (
        !Number.isFinite(amount)
        ||
        amount <= 0
    ) {
        return null;
    }
    const cents =
        Math.round(
            amount * 100
        );
    return Number.isSafeInteger(
        cents
    )
        ? cents
        : null;
}
/* =========================================================
   FECHAMENTO — MODAL
========================================================= */
function updateClosingBillingFields() {
    const isMonthly =
        closingBillingType.value ===
            "monthly";
    closingRecurringGroup
        .classList
        .toggle(
            "hidden",
            !isMonthly
        );
    if (
        !isMonthly
    ) {
        closingRecurringDay.value =
            "";
    }
}
   closingBillingType.addEventListener(
       "change",
       updateClosingBillingFields
   );
   closingCancelButton.addEventListener(
       "click",
       cancelClosingModal
   );
   closingModalClose.addEventListener(
       "click",
       cancelClosingModal
   );
   closingModalOverlay.addEventListener(
       "click",
       cancelClosingModal
   );
   let closingRequestInFlight = false;
   closingConfirmButton.addEventListener(
    "click",
    async function () {
        if (
            !selectedContactId ||
            closingRequestInFlight
        ) {
            return;
        }
        const closingContactId = selectedContactId;
        closingError.textContent =
            "";
        const contractValueCents =
            parseBrazilianMoneyToCents(
                closingValue.value
            );
        if (
            contractValueCents ===
                null
        ) {
            closingError.textContent =
                "Informe um valor de contrato válido.";
            closingValue.focus();
            return;
        }
        const billingType =
            closingBillingType.value;
        if (
            billingType !==
                "monthly"
            &&
            billingType !==
                "one_time"
        ) {
            closingError.textContent =
                "Selecione um tipo de cobrança válido.";
            return;
        }
        const paymentDueDate =
            closingPaymentDate.value;
        if (
            !paymentDueDate
        ) {
            closingError.textContent =
                "Informe a data do primeiro pagamento.";
            closingPaymentDate.focus();
            return;
        }
        let recurringDay =
            null;
        if (
            billingType ===
                "monthly"
        ) {
            recurringDay =
                Number(
                    closingRecurringDay.value
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
                closingError.textContent =
                    "Informe um dia recorrente entre 1 e 31.";
                closingRecurringDay.focus();
                return;
            }
        }
         closingRequestInFlight = true;
        closingConfirmButton.disabled =
            true;
        closingConfirmButton.textContent =
            "Concluindo...";
        try {
            const user =
                session.currentUser;
            if (!user) {
                throw new Error(
                    "A demonstração precisa ser recarregada."
                );
            }
            
            const apiResponse =
                await localRequest(
                    "admin-close-contact",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify({
                                contactId:
                                    closingContactId,
                                contractValueCents:
                                    contractValueCents,
                                billingType:
                                    billingType,
                                paymentDueDate:
                                    paymentDueDate,
                                recurringDay:
                                    recurringDay
                            })
                    }
                );
            const apiData =
                await apiResponse
                    .json();
            if (
                !apiResponse.ok
            ) {
                throw new Error(
                    apiData.error ||
                    "Erro ao concluir fechamento."
                );
            }
            closingConfirmButton.textContent =
                "Venda fechada ✓";
            setTimeout(
                function () {
                    closingModal
                        .classList
                        .add(
                            "hidden"
                        );
                    closeModal();
                    closingRequestInFlight = false;
                },
                700
            );
        }
        catch (error) {
         closingRequestInFlight = false;
            console.error(
                "Erro ao fechar venda:",
                error
            );
            closingError.textContent =
                error.message ||
                "Não foi possível concluir o fechamento.";
            closingConfirmButton.disabled =
                false;
            closingConfirmButton.textContent =
                "Confirmar fechamento";
        }
    }
);
    function openClosingModal() {
      if (closingRequestInFlight) {
         return;
      }
       if (
           !selectedContactId
       ) {
           return;
       }
       const contact =
           contacts.find(
               function (item) {
                   return (
                       item.id ===
                       selectedContactId
                   );
               }
           );
       if (
           !contact
       ) {
           return;
       }
       closingClientName.textContent =
           contact.company ||
           contact.name ||
           "Cliente";
    closingValue.value =
        "";
    closingBillingType.value =
        "monthly";
    closingPaymentDate.value =
        "";
    closingRecurringDay.value =
        "";
    closingError.textContent =
        "";
   closingConfirmButton.disabled =
    false;
   closingConfirmButton.textContent =
       "Confirmar fechamento";
    updateClosingBillingFields();
    closingModal
        .classList
        .remove(
            "hidden"
        );
    setTimeout(
        function () {
            closingValue.focus();
        },
        50
    );
}
function cancelClosingModal() {
    if (closingRequestInFlight) {
        return;
    }
    closingModal
        .classList
        .add(
            "hidden"
        );
    /*
       Enquanto a API financeira ainda
       não existe, voltar ao status anterior
       impede fechamento sem registro.
    */
    const contact =
        contacts.find(
            function (item) {
                return (
                    item.id ===
                    selectedContactId
                );
            }
        );
    modalStatus.value =
        contact?.status ||
        "novo";
    updateLossReasonVisibility();
    closingError.textContent =
        "";
}
/* =========================================================
   ARQUIVAMENTO DO CONTATO
========================================================= */
function configureArchiveButton(
    contact
) {
    /*
       Somente owner e manager
       possuem essa ação.
    */
    const canArchive =
        currentAdminProfile
        &&
        [
            "owner",
            "manager"
        ].includes(
            currentAdminProfile.role
        );
    if (
        !canArchive
    ) {
        archiveContactButton
            .classList
            .add(
                "hidden"
            );
        return;
    }
    archiveContactButton
        .classList
        .remove(
            "hidden"
        );
    const isArchived =
        contact.archived ===
        true;
    archiveContactButton
        .classList
        .toggle(
            "is-restore",
            isArchived
        );
    archiveContactButton.textContent =
        isArchived
            ? "Restaurar contato"
            : "Arquivar contato";
    archiveContactButton.disabled =
        false;
}
/* =========================================================
   NOVO LEAD — MODAL
========================================================= */
function openManualContactModal() {
    manualContactForm.reset();
    manualCreateError.textContent =
        "";
    createManualContactButton.disabled =
        false;
    createManualContactButton.textContent =
        "Criar lead";
    manualContactModal
        .classList
        .remove(
            "hidden"
        );
    document.body.style.overflow =
        "hidden";
    setTimeout(
        function () {
            manualName.focus();
        },
        50
    );
}
function closeManualContactModal() {
    manualContactModal
        .classList
        .add(
            "hidden"
        );
    manualCreateError.textContent =
        "";
    document.body.style.overflow =
        "";
}
openManualContactButton
    .addEventListener(
        "click",
        openManualContactModal
    );
manualContactClose
    .addEventListener(
        "click",
        closeManualContactModal
    );
manualContactOverlay
    .addEventListener(
        "click",
        closeManualContactModal
    );
/* =========================================================
   NOVO LEAD — TAGS
========================================================= */
function parseManualTags(
    value
) {
    const rawTags =
        String(
            value || ""
        )
            .split(",");
    const tags = [];
    const seen =
        new Set();
    for (
        const rawTag
        of rawTags
    ) {
        const tag =
            rawTag.trim();
        if (!tag) {
            continue;
        }
        const key =
            tag.toLowerCase();
        if (
            seen.has(key)
        ) {
            continue;
        }
        seen.add(key);
        tags.push(tag);
    }
    return tags;
}
/* =========================================================
   NOVO LEAD — CRIAÇÃO
========================================================= */
createManualContactButton
    .addEventListener(
        "click",
        async function () {
            manualCreateError.textContent =
                "";
            const name =
                manualName.value.trim();
            const company =
                manualCompany.value.trim();
            const contactValue =
                manualContact.value.trim();
            const service =
                manualService.value.trim();
            const origin =
                manualOrigin.value;
            const tags =
                parseManualTags(
                    manualTags.value
                );
            const message =
                manualMessage.value.trim();
            const notes =
                manualNotes.value.trim();
            const nextContactAt =
                manualNextContactAt.value;
            /*
               CAMPOS OBRIGATÓRIOS
            */
            if (!name) {
                manualCreateError.textContent =
                    "Informe o nome do lead.";
                manualName.focus();
                return;
            }
            if (!contactValue) {
                manualCreateError.textContent =
                    "Informe um WhatsApp, e-mail ou contato.";
                manualContact.focus();
                return;
            }
            if (
                tags.length > 12
            ) {
                manualCreateError.textContent =
                    "Use no máximo 12 tags por lead.";
                manualTags.focus();
                return;
            }
            const invalidTag =
                tags.find(
                    function (tag) {
                        return (
                            tag.length >
                            40
                        );
                    }
                );
            if (
                invalidTag
            ) {
                manualCreateError.textContent =
                    "Cada tag pode possuir no máximo 40 caracteres.";
                manualTags.focus();
                return;
            }
            const user =
                session.currentUser;
            if (!user) {
                manualCreateError.textContent =
                    "Recarregue a página para continuar a demonstração.";
                return;
            }
            createManualContactButton.disabled =
                true;
            createManualContactButton.textContent =
                "Criando...";
            try {
                /* Operação local com a identidade fictícia do visitante. */
                
                /*
                   EXECUTA A AÇÃO LOCAL
                */
                const response =
                    await localRequest(
                        "admin-create-contact",
                        {
                            method:
                                "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify(
                                    {
                                        name,
                                        company,
                                        contact:
                                            contactValue,
                                        service,
                                        origin,
                                        tags,
                                        message,
                                        notes,
                                        nextContactAt:
                                            nextContactAt ||
                                            null
                                    }
                                )
                        }
                    );
                let result = {};
                try {
                    result =
                        await response.json();
                }
                catch {
                    result = {};
                }
                if (
                    !response.ok ||
                    result.success !== true
                ) {
                    throw new Error(
                        result.error ||
                        result.message ||
                        "Não foi possível criar o lead."
                    );
                }
                /*
                   VOLTA PARA A VISÃO ATIVA.
                   O onSnapshot existente receberá
                   o novo documento automaticamente.
                */
                contactsViewMode =
                    "ativos";
                statusFilter.value =
                    "todos";
                contactSearch.value =
                    "";
                updateContactsViewButtons();
                closeManualContactModal();
            }
            catch (error) {
                console.error(
                    "Erro ao criar lead manual:",
                    error
                );
                manualCreateError.textContent =
                    error.message ||
                    "Não foi possível criar o lead.";
            }
            finally {
                createManualContactButton.disabled =
                    false;
                createManualContactButton.textContent =
                    "Criar lead";
            }
        }
    );
document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key ===
                "Escape"
            &&
            !manualContactModal
                .classList
                .contains(
                    "hidden"
                )
        ) {
            closeManualContactModal();
        }
    }
);
function openContact(id) {
    const contact =
        contacts.find(
            item =>
                item.id === id
        );
    if (!contact) {
        return;
    }
    selectedContactId =
        id;
   configureArchiveButton(
    contact
);
    /*
       Aqui usamos textContent porque
       os dados vieram de usuários.
    */
    modalName.textContent =
        contact.name ||
        "Sem nome";
    modalCompany.textContent =
        contact.company ||
        "Não informado";
    modalContact.textContent =
        contact.contact ||
        "Não informado";
   configureContactActions(
       contact
   );
    modalService.textContent =
        contact.service ||
        "Não definido";
    modalDate.textContent =
        formatDate(
            contact.createdAt
        );
    modalMessage.textContent =
        contact.message ||
        "Sem mensagem";
   modalNotes.value =
       contact.notes || "";  
   notesCounter.textContent =
       `${modalNotes.value.length}/3000`;
   modalFollowUp.value =
      formatDateTimeLocal(
         contact.nextContactAt
      );
   /*
      ORIGEM
      Compatibilidade com leads antigos
      que ainda não possuem origin.
   */
   let contactOrigin =
       typeof contact.origin ===
           "string"
           ? contact.origin
           : (
               contact.source ===
                   "site"
                   ? "site"
                   : "nao_informado"
           );
   const originExists =
       Array
           .from(
               modalOrigin.options
           )
           .some(
               function (option) {
                   return (
                       option.value ===
                       contactOrigin
                   );
               }
           );
   if (
       !originExists
   ) {
       contactOrigin =
           "nao_informado";
   }
   modalOrigin.value =
       contactOrigin;
   /*
      TAGS
   */
   modalTags.value =
       Array.isArray(
           contact.tags
       )
           ? contact.tags.join(
               ", "
           )
           : "";
   classificationError.textContent =
       "";
   modalStatus.value =
    contact.status ||
    "novo";
   modalLossReason.value =
       contact.lossReason ||
       "";
   lossReasonError.textContent =
       "";
   updateLossReasonVisibility();
/*
   Histórico individual disponível
   somente para o owner.
*/
startContactHistoryListener(
    id
);
contactModal.classList.remove(
    "hidden"
);
    document.body.style.overflow =
        "hidden";
}
/* =========================================================
   FECHA MODAL
========================================================= */
function closeModal() {
    stopContactHistoryListener();
    contactModal.classList.add(
        "hidden"
    );
    selectedContactId =
        null;
    document.body.style.overflow =
        "";
}
modalClose.addEventListener(
    "click",
    closeModal
);
modalOverlay.addEventListener(
    "click",
    closeModal
);
document.addEventListener(
    "keydown",
    function (event) {
        if (event.key !== "Escape") {
            return;
        }
        /* -----------------------------------------
           FECHAMENTO DE VENDA
        ----------------------------------------- */
        if (
            !closingModal.classList.contains(
                "hidden"
            )
        ) {
            event.preventDefault();
            /*
               Aguarda o processamento do fechamento.
            */
            if (
                !closingConfirmButton.disabled
            ) {
                cancelClosingModal();
            }
            return;
        }
        /* -----------------------------------------
           CONFIRMAÇÃO DE PAGAMENTO
        ----------------------------------------- */
        if (
            !paymentModal.classList.contains(
                "hidden"
            )
        ) {
            closePaymentModal();
            return;
        }
        /* -----------------------------------------
           HISTÓRICO DE PAGAMENTOS
        ----------------------------------------- */
        if (
            !paymentHistoryModal.classList.contains(
                "hidden"
            )
        ) {
            closePaymentHistoryModal();
            return;
        }
        /* -----------------------------------------
           EDIÇÃO DO CONTRATO
        ----------------------------------------- */
        if (
            !financeEditModal.classList.contains(
                "hidden"
            )
        ) {
            if (
                !financeEditSaveButton.disabled
            ) {
                closeFinanceEditModal();
            }
            return;
        }
        /* -----------------------------------------
           CADASTRO MANUAL
           Possui seu próprio evento de Escape.
        ----------------------------------------- */
        if (
            !manualContactModal.classList.contains(
                "hidden"
            )
        ) {
            return;
        }
        /* -----------------------------------------
           DETALHES DO CONTATO
        ----------------------------------------- */
        if (
            !contactModal.classList.contains(
                "hidden"
            )
        ) {
            closeModal();
        }
    }
);
/* =========================================================
   ALTERA STATUS
========================================================= */
saveStatusButton.addEventListener(
    "click",
    async function () {
        if (
            !selectedContactId
        ) {
            return;
        }
         /*
            Lead perdido precisa possuir
            um motivo obrigatório.
         */
         if (
             modalStatus.value ===
                 "perdido"
             &&
             !modalLossReason.value
         ) {
             lossReasonError.textContent =
                 "Selecione o motivo da perda.";
             modalLossReason.focus();
             return;
         }
         lossReasonError.textContent =
             "";
         classificationError.textContent =
             "";
         const tags =
             parseManualTags(
                 modalTags.value
             );
         if (
             tags.length > 12
         ) {
             classificationError.textContent =
                 "Use no máximo 12 tags por lead.";
             modalTags.focus();
             return;
         }
         const invalidTag =
             tags.find(
                 function (tag) {
                     return (
                         tag.length >
                         40
                     );
                 }
             );
         if (
             invalidTag
         ) {
             classificationError.textContent =
                 "Cada tag pode possuir no máximo 40 caracteres.";
             modalTags.focus();
             return;
         }
        saveStatusButton.disabled =
            true;
        saveStatusButton.textContent =
            "Salvando...";
        try {
            const user =
                session.currentUser;
            if (!user) {
                throw new Error(
                    "A demonstração precisa ser recarregada."
                );
            }
            /* Operação local com a identidade fictícia do visitante. */
            
            const apiResponse =
                await localRequest(
                    "admin-update-contact",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify({
                                contactId:
                                    selectedContactId,
                                status:
                                    modalStatus.value,
                                notes:
                                    modalNotes
                                        .value
                                        .trim(),
                                nextContactAt:
                                    modalFollowUp.value
                                        ? new Date(
                                            modalFollowUp.value
                                        ).toISOString()
                                        : null,
                                lossReason:
                                    modalStatus.value ===
                                        "perdido"
                                        ? modalLossReason.value
                                        : null,
                                origin:
                                    modalOrigin.value,
                                tags:
                                    tags
                            })
                    }
                );
            const apiData =
                await apiResponse.json();
            if (
                !apiResponse.ok
            ) {
                throw new Error(
                    apiData.error ||
                    "Erro ao atualizar contato."
                );
            }
            /*
               Atualização concluída com sucesso.
            */
            saveStatusButton.textContent =
                "Salvo ✓";
            setTimeout(
                function () {
                    saveStatusButton.textContent =
                        "Salvar alterações";
                    saveStatusButton.disabled =
                        false;
                    closeModal();
                },
                700
            );
            }
        catch (error) {
            console.error(
                "Erro ao atualizar status:",
                error
            );
            saveStatusButton.textContent =
                "Erro ao salvar";
            setTimeout(
                function () {
                    saveStatusButton.textContent =
                        "Salvar alteração";
                    saveStatusButton.disabled =
                        false;
                },
                1500
            );
        }
    }
);
/* =========================================================
   ARQUIVA / RESTAURA CONTATO
========================================================= */
archiveContactButton.addEventListener(
    "click",
    async function () {
        if (
            !selectedContactId
        ) {
            return;
        }
        const contact =
            contacts.find(
                function (item) {
                    return (
                        item.id ===
                        selectedContactId
                    );
                }
            );
        if (
            !contact
        ) {
            return;
        }
        const currentlyArchived =
            contact.archived ===
            true;
        const newArchivedState =
            !currentlyArchived;
        archiveContactButton.disabled =
            true;
        archiveContactButton.textContent =
            newArchivedState
                ? "Arquivando..."
                : "Restaurando...";
        try {
            const user =
                session.currentUser;
            if (
                !user
            ) {
                throw new Error(
                    "A demonstração precisa ser recarregada."
                );
            }
            
            const apiResponse =
                await localRequest(
                    "admin-archive-contact",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify({
                                contactId:
                                    selectedContactId,
                                archived:
                                    newArchivedState
                            })
                    }
                );
            const apiData =
                await apiResponse
                    .json();
            if (
                !apiResponse.ok
            ) {
                throw new Error(
                    apiData.error ||
                    "Erro ao alterar arquivamento."
                );
            }
            archiveContactButton.textContent =
                newArchivedState
                    ? "Arquivado ✓"
                    : "Restaurado ✓";
            setTimeout(
                function () {
                    closeModal();
                },
                650
            );
        }
        catch (error) {
            console.error(
                "Erro ao alterar arquivamento:",
                error
            );
            archiveContactButton.textContent =
                currentlyArchived
                    ? "Restaurar contato"
                    : "Arquivar contato";
            archiveContactButton.disabled =
                false;
        }
    }
);
// Inicializar após todas as constantes e os listeners da interface.
startDemo();

manualContactForm.addEventListener("submit", event => { event.preventDefault(); createManualContactButton.click(); });
