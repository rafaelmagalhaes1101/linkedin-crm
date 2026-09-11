// Dispatcher local: executa funções no navegador, sem fetch ou endpoints de rede.
import action0 from "./actions/admin-archive-contact.js";
import action1 from "./actions/admin-close-contact.js";
import action2 from "./actions/admin-create-contact.js";
import action3 from "./actions/admin-export-commercial-report.js";
import action4 from "./actions/admin-export-contacts.js";
import action5 from "./actions/admin-export-finance-contracts.js";
import action6 from "./actions/admin-export-finance-payments.js";
import action7 from "./actions/admin-export-financial-report.js";
import action8 from "./actions/admin-mark-payment-paid.js";
import action9 from "./actions/admin-update-contact.js";
import action10 from "./actions/admin-update-finance.js";
const actions = {
    "admin-archive-contact": action0,
    "admin-close-contact": action1,
    "admin-create-contact": action2,
    "admin-export-commercial-report": action3,
    "admin-export-contacts": action4,
    "admin-export-finance-contracts": action5,
    "admin-export-finance-payments": action6,
    "admin-export-financial-report": action7,
    "admin-mark-payment-paid": action8,
    "admin-update-contact": action9,
    "admin-update-finance": action10,
};
let queue = Promise.resolve();
export function localRequest(name, options = {}) {
    const operation = queue.then(async () => {
        const handler = actions[name];
        if (!handler) throw new Error('Ação demonstrativa não encontrada.');
        let status = 200, payload = '', headers = new Headers();
        const response = {
            setHeader(name, value) { headers.set(name, value); return this; },
            status(code) { status = code; return this; },
            json(data) { headers.set('Content-Type', 'application/json'); payload = JSON.stringify(data); return this; },
            send(data) { payload = data; return this; }
        };
        await handler({ method: options.method || 'POST', body: JSON.parse(options.body || '{}'), headers: {} }, response);
        return new Response(payload, { status, headers });
    });
    queue = operation.catch(() => {});
    return operation;
}
