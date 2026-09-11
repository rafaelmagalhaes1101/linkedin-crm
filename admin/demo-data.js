// Todos os nomes, empresas, contatos e valores são fictícios.
// Datas relativas mantêm a demonstração útil quando ela é reiniciada.
export function createDemoData() {
    const day = (offset, hour = 12) => {
        const d = new Date(); d.setDate(d.getDate() + offset); d.setHours(hour, 0, 0, 0); return d;
    };
    const actor = { actorUid: 'demo-owner', actorEmail: 'visitante@example.com', actorRole: 'owner' };
    const people = [
        ['Marina Costa', 'Aurora Studio', 'Tráfego Pago', 'instagram', 'novo'],
        ['Lucas Almeida', 'Norte Café', 'Gestão Total', 'indicacao', 'em_contato'],
        ['Beatriz Lima', 'Casa Oliva', 'Criação de Sites', 'google', 'proposta'],
        ['Pedro Santos', 'Atlas Fitness', 'Tráfego Pago', 'whatsapp', 'follow_up'],
        ['Camila Rocha', 'Flora Cosméticos', 'Gestão Total', 'site', 'aguardando_cliente'],
        ['Rafael Mendes', 'Vértice Design', 'Consultoria Estratégica', 'prospeccao', 'novo'],
        ['Julia Martins', 'Brisa Viagens', 'Criação de Sites', 'evento', 'proposta'],
        ['Gustavo Alves', 'Raiz Orgânica', 'Tráfego Pago', 'site', 'em_contato'],
        ['Isabela Dias', 'Mundo Pet', 'Gestão Total', 'instagram', 'follow_up'],
        ['Felipe Ribeiro', 'Linha Urbana', 'Criação de Sites', 'indicacao', 'novo'],
        ['Ana Souza', 'Solare Energia', 'Tráfego Pago', 'google', 'aguardando_cliente'],
        ['Bruno Freitas', 'Ponto Criativo', 'Consultoria Estratégica', 'evento', 'proposta'],
        ['Larissa Melo', 'Lumina Decor', 'Gestão Total', 'instagram', 'fechado'],
        ['Daniel Oliveira', 'Horizonte Escola', 'Criação de Sites', 'site', 'fechado'],
        ['Fernanda Reis', 'Via Verde', 'Tráfego Pago', 'indicacao', 'fechado'],
        ['Thiago Barbosa', 'Estação Gourmet', 'Gestão Total', 'whatsapp', 'fechado'],
        ['Amanda Castro', 'Arco Arquitetura', 'Criação de Sites', 'google', 'fechado'],
        ['Diego Nunes', 'Movimento Pilates', 'Consultoria Estratégica', 'prospeccao', 'fechado'],
        ['Carolina Moreira', 'Trama Atelier', 'Gestão Total', 'instagram', 'perdido'],
        ['Vinicius Lopes', 'Viva Natural', 'Tráfego Pago', 'outro', 'perdido'],
        ['Sofia Teixeira', 'Papel & Ideia', 'Criação de Sites', 'site', 'novo'],
        ['Henrique Ramos', 'Oficina do Som', 'Consultoria Estratégica', 'nao_informado', 'em_contato'],
        ['Leticia Azevedo', 'Orla Presentes', 'Tráfego Pago', 'whatsapp', 'novo'],
        ['André Vieira', 'Caminho Livre', 'Gestão Total', 'evento', 'follow_up']
    ];
    const data = { contacts: {}, finance_records: {}, finance_payments: {}, audit_logs: {}, activity_feed: {} };
    people.forEach(([name, company, service, origin, status], i) => {
        const id = `demo-lead-${String(i + 1).padStart(2, '0')}`;
        const archived = i === 20 || i === 21;
        const createdAt = day(-Math.floor(i * 1.7));
        const nextContactAt = !archived && !['fechado', 'perdido'].includes(status) && i % 4 !== 0
            ? day([-2, 0, 1, 3, 5][i % 5], 16) : null;
        const c = {
            name, company, contact: `contato${i + 1}@example.com`, service, origin,
            source: origin === 'site' ? 'site' : 'manual', status, archived,
            tags: [i % 2 ? 'Prospecção' : 'Inbound', ['Comércio', 'Serviços', 'Educação'][i % 3]],
            message: `A ${company} busca apoio para ampliar sua presença digital. Registro fictício para demonstração.`,
            notes: 'Entender os objetivos da empresa e preparar uma proposta com escopo e prazo.',
            nextContactAt, createdAt, updatedAt: createdAt,
            archivedAt: archived ? day(-3) : null,
            lostAt: status === 'perdido' ? day(-5) : null,
            lossReason: status === 'perdido' ? 'Projeto adiado pelo cliente.' : null
        };
        data.contacts[id] = c;
        const meta = { ...actor, contactId: id, contactName: name, contactCompany: company, service, origin };
        data.activity_feed[`created-${id}`] = { ...meta, type: 'lead_created', fromStatus: null, toStatus: 'novo', fromNextContactAt: null, toNextContactAt: null, createdAt };
        data.audit_logs[`created-${id}`] = { ...meta, action: 'contact_created', changes: {}, createdAt };
        if (status === 'fechado') {
            const index = i - 12;
            const monthly = [0, 2, 3].includes(index);
            const dueOffsets = [5, 3, -3, 0, -7, 2];
            const due = day(dueOffsets[index]);
            const closedAt = day(-8 - index);
            const amount = [240000, 450000, 150000, 320000, 280000, 120000][index];
            const paid = index === 1 || index === 4;
            data.finance_records[id] = {
                contactId: id, contactName: name, contactCompany: company, service,
                contractValueCents: amount, billingType: monthly ? 'monthly' : 'one_time',
                closedAt, createdAt: closedAt, updatedAt: closedAt, nextPaymentDueAt: due,
                recurringDay: monthly ? due.getDate() : null, paymentStatus: paid ? 'paid' : 'pending',
                paidAt: paid ? day(-1) : null, lastPaidAt: paid || index === 0 ? day(-1) : null,
                lastPaidDueAt: paid ? due : index === 0 ? day(-25) : null,
                closedByUid: actor.actorUid, closedByEmail: actor.actorEmail, closedByRole: 'owner'
            };
            if (paid || index === 0) {
                const paymentDue = paid ? due : day(-25);
                const cycleKey = paymentDue.toISOString().slice(0, 10);
                const paymentId = `${id}_${cycleKey}`;
                data.finance_payments[paymentId] = {
                    financeId: id, contactId: id, contactName: name, contactCompany: company, service,
                    billingType: monthly ? 'monthly' : 'one_time', cycleKey, dueAt: paymentDue,
                    amountCents: amount, status: 'paid', paidAt: day(-1), createdAt: day(-1),
                    source: 'manual', recordedByUid: actor.actorUid, recordedByEmail: actor.actorEmail, recordedByRole: 'owner'
                };
            }
            data.activity_feed[`sale-${id}`] = { ...meta, type: 'sale_closed', fromStatus: 'proposta', toStatus: 'fechado', fromNextContactAt: null, toNextContactAt: null, createdAt: closedAt };
            data.audit_logs[`sale-${id}`] = { ...meta, action: 'contact_closed', changes: { status: { from: 'proposta', to: 'fechado' } }, createdAt: closedAt };
        }
    });
    // Exemplos recentes dos oito eventos que a interface reconhece.
    const recent = [
        ['contact_restored', 'demo-lead-04', { fromArchived: true, toArchived: false }],
        ['contact_archived', 'demo-lead-21', { fromArchived: false, toArchived: true }],
        ['sale_closed', 'demo-lead-13', { fromStatus: 'proposta', toStatus: 'fechado' }],
        ['followup_rescheduled', 'demo-lead-03', { fromNextContactAt: day(-1), toNextContactAt: data.contacts['demo-lead-03'].nextContactAt }],
        ['status_changed', 'demo-lead-02', { fromStatus: 'novo', toStatus: 'em_contato' }],
        ['followup_scheduled', 'demo-lead-06', { fromNextContactAt: null, toNextContactAt: data.contacts['demo-lead-06'].nextContactAt }],
        ['followup_removed', 'demo-lead-09', { fromNextContactAt: day(-1), toNextContactAt: null }],
        ['lead_created', 'demo-lead-01', { fromStatus: null, toStatus: 'novo' }]
    ];
    recent.forEach(([type, id, changes], i) => {
        const c = data.contacts[id];
        const createdAt = new Date(Date.now() - (i + 1) * 60 * 60000);
        if (type === 'lead_created') {
            c.createdAt = createdAt;
            data.activity_feed[`created-${id}`].createdAt = createdAt;
            data.audit_logs[`created-${id}`].createdAt = createdAt;
            delete data.activity_feed[`created-${id}`];
        }
        if (type === 'sale_closed') {
            data.finance_records[id].closedAt = createdAt;
            data.finance_records[id].createdAt = createdAt;
            data.finance_records[id].lastPaidAt = null;
            data.finance_records[id].lastPaidDueAt = null;
            // Este contrato acaba de ser fechado e ainda não tem pagamentos.
            for (const key of Object.keys(data.finance_payments)) {
                if (data.finance_payments[key].contactId === id) delete data.finance_payments[key];
            }
            delete data.activity_feed[`sale-${id}`];
            data.audit_logs[`sale-${id}`].createdAt = createdAt;
        }
        if (type === 'contact_archived') c.archivedAt = createdAt;
        if (type === 'contact_restored') c.archivedAt = null;
        if (type.startsWith('followup_')) c.nextContactAt = changes.toNextContactAt;
        c.updatedAt = createdAt;
        data.activity_feed[`recent-${i}`] = { ...actor, contactId: id, contactName: c.name, contactCompany: c.company, service: c.service, origin: c.origin, type, fromStatus: null, toStatus: null, fromNextContactAt: null, toNextContactAt: null, ...changes, createdAt };
    });
    // Garantir que as atividades recentes estejam refletidas na auditoria.
    for (const [id, item] of Object.entries(data.activity_feed)) {
        if (!id.startsWith('recent-') || ['lead_created','sale_closed'].includes(item.type)) continue;
        const changes = item.type.startsWith('followup_')
            ? { nextContactAt: { from: item.fromNextContactAt, to: item.toNextContactAt } }
            : item.type === 'status_changed' ? { status: { from: item.fromStatus, to: item.toStatus } }
            : { archived: { from: item.fromArchived, to: item.toArchived } };
        data.audit_logs[id] = { ...item, action: item.type.startsWith('contact_') ? item.type : 'contact_updated', changes };
    }
    return data;
}
