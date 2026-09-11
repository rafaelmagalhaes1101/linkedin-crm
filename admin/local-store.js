import { createDemoData } from './demo-data.js';

// Banco local dedicado à demonstração. Nenhuma conexão externa.
const STORAGE_KEY = 'roasce-crm-demo-v1';
const VERSION = 1;
export const demoActor = Object.freeze({ uid: 'demo-owner', email: 'visitante@example.com', role: 'owner', active: true });
export class LocalTimestamp {
    constructor(ms) { this.ms = ms; this.seconds = Math.floor(ms / 1000); this.nanoseconds = (ms % 1000) * 1e6; }
    toDate() { return new Date(this.ms); }
    toMillis() { return this.ms; }
    valueOf() { return this.ms; }
}
function encode(value) {
    if (value instanceof Date || value instanceof LocalTimestamp) return { __demoDate: Number(value) };
    if (Array.isArray(value)) return value.map(encode);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, encode(v)]));
    return value;
}
function decode(value) {
    if (value && typeof value === 'object' && Number.isFinite(value.__demoDate)) return new LocalTimestamp(value.__demoDate);
    if (Array.isArray(value)) return value.map(decode);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, decode(v)]));
    return value;
}
const clone = value => decode(encode(value));
let warning = '';
let state;
const listeners = new Set();
function warn(message) {
    warning = message;
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('demo-storage-warning', { detail: message }));
}
function validData(data) {
    return data && ['contacts','finance_records','finance_payments','audit_logs','activity_feed'].every(k => data[k] && typeof data[k] === 'object' && !Array.isArray(data[k]));
}
try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        const saved = JSON.parse(raw);
        if (saved.version !== VERSION || !validData(saved.data)) throw new Error('invalid data');
        state = decode(saved.data);
    }
} catch {
    warn('Os dados locais não puderam ser recuperados. A demonstração foi iniciada com os exemplos originais.');
}
if (!state) state = clone(createDemoData());
function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, data: encode(state) })); }
    catch { warn('Não foi possível salvar neste navegador. Você pode continuar explorando, mas as alterações poderão ser perdidas ao sair.'); }
}
persist();
export function getStorageWarning() { return warning; }
export function resetDemo() { state = clone(createDemoData()); persist(); notify(); }
export const Clock = { now: () => new Date() };
function documentSnapshot(collectionName, id, source = state) {
    const data = source[collectionName]?.[id];
    return { id, exists: data !== undefined, data: () => clone(data) };
}
class Reference {
    constructor(name, id) { this.name = name; this.id = id; }
    get() { return Promise.resolve(documentSnapshot(this.name, this.id)); }
}
const comparable = value => value instanceof Date || value instanceof LocalTimestamp ? Number(value) : value;
class LocalQuery {
    constructor(name, filters = [], sorts = [], count = Infinity, fields = null) { Object.assign(this, { name, filters, sorts, count, fields }); }
    copy(patch) { return Object.assign(new LocalQuery(this.name, this.filters, this.sorts, this.count, this.fields), patch); }
    doc(id = crypto.randomUUID()) { return new Reference(this.name, id); }
    where(field, operator, value) { return this.copy({ filters: [...this.filters, { field, operator, value }] }); }
    orderBy(field, direction = 'asc') { return this.copy({ sorts: [...this.sorts, { field, direction }] }); }
    limit(count) { return this.copy({ count }); }
    select(...fields) { return this.copy({ fields }); }
    snapshot() {
        let entries = Object.entries(state[this.name] || {});
        for (const { field, operator, value } of this.filters) entries = entries.filter(([, data]) => {
            const a = comparable(data[field]); const b = comparable(value);
            if (a === undefined) return false;
            if (operator === '==') return a === b;
            if (operator === 'in') return value.includes(a);
            if (operator === '>=') return a >= b;
            if (operator === '<=') return a <= b;
            if (operator === '>') return a > b;
            if (operator === '<') return a < b;
            throw new Error('Operador local não suportado: ' + operator);
        });
        if (this.sorts.length) {
            entries = entries.filter(([,d]) => this.sorts.every(s => d[s.field] !== undefined));
            entries.sort(([idA, a],[idB, b]) => {
                for (const { field, direction } of this.sorts) {
                    const x = comparable(a[field]), y = comparable(b[field]);
                    if (x !== y) return (x < y ? -1 : 1) * (direction === 'desc' ? -1 : 1);
                }
                return idA.localeCompare(idB);
            });
        }
        const docs = entries.slice(0,this.count).map(([id,data]) => ({ id, exists: true, data: () => clone(this.fields ? Object.fromEntries(this.fields.filter(k => k in data).map(k => [k,data[k]])) : data) }));
        return { docs, size: docs.length, empty: !docs.length, forEach: cb => docs.forEach(cb) };
    }
    get() { return Promise.resolve(this.snapshot()); }
}
function notify() {
    for (const listener of listeners) queueMicrotask(() => {
        if (!listeners.has(listener)) return;
        try { listener.next(listener.query.snapshot()); } catch (error) { if (listener.error) listener.error(error); else console.error(error); }
    });
}
function batch() {
    const writes = [];
    return {
        get: reference => reference.get(),
        set(reference, data) { writes.push({ reference, data, update: false }); return this; },
        update(reference, data) { writes.push({ reference, data, update: true }); return this; },
        async commit() {
            const next = clone(state);
            for (const {reference:r, data, update} of writes) {
                if (!next[r.name]) throw new Error('Coleção demonstrativa desconhecida.');
                if (update && !next[r.name][r.id]) throw new Error('Registro não encontrado.');
                next[r.name][r.id] = clone(update ? { ...next[r.name][r.id], ...data } : data);
            }
            state = next; persist(); notify();
        }
    };
}
let transactionQueue = Promise.resolve();
export const db = {
    collection: name => new LocalQuery(name),
    getAll: (...references) => Promise.all(references.map(r => r.get())),
    batch,
    runTransaction(callback) {
        const operation = transactionQueue.then(async () => { const tx = batch(); const result = await callback(tx); await tx.commit(); return result; });
        transactionQueue = operation.catch(() => {}); return operation;
    }
};
export const collection = (_db, name) => db.collection(name);
export const where = (field, operator, value) => q => q.where(field,operator,value);
export const orderBy = (field, direction) => q => q.orderBy(field,direction);
export const limit = count => q => q.limit(count);
export const query = (source,...constraints) => constraints.reduce((q,apply) => apply(q),source);
export function onSnapshot(source,next,error) {
    const listener = { query: source, next, error }; listeners.add(listener);
    queueMicrotask(() => {
        if (!listeners.has(listener)) return;
        try { next(source.snapshot()); } catch (e) { if (error) error(e); else console.error(e); }
    });
    return () => listeners.delete(listener);
}
// Uma segunda aba do mesmo navegador acompanha o armazenamento compartilhado.
if (typeof window !== 'undefined') window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    try {
        const saved = JSON.parse(event.newValue);
        if (saved?.version === VERSION && validData(saved.data)) { state = decode(saved.data); notify(); }
    } catch { /* Uma escrita externa inválida não substitui a sessão em uso. */ }
});
