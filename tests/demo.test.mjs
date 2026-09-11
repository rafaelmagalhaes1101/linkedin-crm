import { test } from 'node:test';
import assert from 'node:assert/strict';
const storage = new Map();
globalThis.localStorage = { getItem:k => storage.get(k) || null, setItem:(k,v) => storage.set(k,v) };
const { db, resetDemo } = await import('../admin/local-store.js');
const { localRequest } = await import('../admin/local-actions.js');
const call = async (name, body) => {
    const response = await localRequest('admin-' + name, {method:'POST',body:JSON.stringify(body)});
    const data = await response.json();
    assert.ok(response.ok, `${name}: ${response.status} ${JSON.stringify(data)}`);
    return data;
};
const get = async (name,id) => (await db.collection(name).doc(id).get()).data();
const items = async name => (await db.collection(name).get()).docs.map(d=>d.data());

test('Jornada comercial, eventos, finanças, exportações e reinício', async () => {
    resetDemo();
    const originalCount = (await items('contacts')).length;
    const { contactId } = await call('create-contact', {name:'Teste <script>',company:'Empresa "Demo"',contact:'demo@example.com',service:'Gestão Total',message:'Exemplo',notes:'Inicial',nextContactAt:null,origin:'whatsapp',tags:['Teste']});
    assert.equal((await get('contacts',contactId)).status,'novo');
    assert.equal((await items('contacts')).length,originalCount+1);
    const fields = {contactId,status:'em_contato',notes:'Inicial',origin:'whatsapp',tags:['Teste'],lossReason:''};
    const next = new Date(Date.now()+86400000).toISOString();
    await call('update-contact',{...fields,nextContactAt:next});
    let feed = (await items('activity_feed')).filter(a=>a.contactId===contactId);
    assert.ok(feed.some(a=>a.type==='status_changed'));
    assert.ok(feed.some(a=>a.type==='followup_scheduled'));
    await call('update-contact',{...fields,nextContactAt:new Date(Date.now()+2*86400000).toISOString()});
    await call('update-contact',{...fields,nextContactAt:null});
    feed = (await items('activity_feed')).filter(a=>a.contactId===contactId);
    assert.ok(feed.some(a=>a.type==='followup_rescheduled'));
    assert.ok(feed.some(a=>a.type==='followup_removed'));
    const count = feed.length;
    await call('update-contact',{...fields,notes:'Outra observação',tags:['Nova tag'],nextContactAt:null});
    assert.equal((await items('activity_feed')).filter(a=>a.contactId===contactId).length,count);
    await call('archive-contact',{contactId,archived:true});
    const audits=(await items('audit_logs')).length;
    await call('archive-contact',{contactId,archived:true});
    assert.equal((await items('audit_logs')).length,audits);
    await call('archive-contact',{contactId,archived:false});
    await call('close-contact',{contactId,contractValueCents:150000,billingType:'monthly',paymentDueDate:'2026-01-31',recurringDay:31});
    assert.equal((await get('contacts',contactId)).status,'fechado');
    assert.equal((await get('finance_records',contactId)).contractValueCents,150000);
    const body = {contactId,cycleKey:'2026-01-31',expectedAmountCents:150000,expectedBillingType:'monthly'};
    await call('mark-payment-paid',body);
    const record=await get('finance_records',contactId);
    assert.equal(record.nextPaymentDueAt.toDate().toISOString().slice(0,10),'2026-02-28');
    assert.equal(record.recurringDay,31);
    const payments=(await items('finance_payments')).length;
    await call('mark-payment-paid',body);
    assert.equal((await items('finance_payments')).length,payments);
    await call('update-finance',{contactId,contractValueCents:180000,billingType:'monthly',paymentDueDate:'2026-02-28',recurringDay:31});
    assert.equal((await get('finance_records',contactId)).contractValueCents,180000);
    for (const [name,body] of [
        ['export-contacts',{contactIds:['demo-lead-01']}],
        ['export-finance-contracts',{financeIds:[contactId]}],
        ['export-finance-payments',{financeIds:[contactId]}],
        ['export-commercial-report',{startMs:null,endMs:null}],
        ['export-financial-report',{startMs:null,endMs:null}]
    ]) {
        const r=await localRequest('admin-'+name,{body:JSON.stringify(body)});
        assert.ok(r.ok,`${name}: ${await r.clone().text()}`);
        assert.ok(r.headers.get('Content-Type').includes('text/csv'));
        const bytes=new Uint8Array(await r.arrayBuffer());
        assert.deepEqual([...bytes.slice(0,3)],[239,187,191]);
        assert.ok(bytes.length>100);
    }
    assert.ok(storage.get('roasce-crm-demo-v1').includes(contactId));
    resetDemo();
    assert.equal((await items('contacts')).length,originalCount);
    assert.equal((await db.collection('contacts').doc(contactId).get()).exists,false);
});
