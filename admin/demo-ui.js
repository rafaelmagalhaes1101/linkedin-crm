import { resetDemo, getStorageWarning } from './local-store.js';
const guideButton = document.getElementById('demoGuideButton');
const guide = document.getElementById('demoGuide');
guideButton.addEventListener('click', () => {
    guide.hidden = !guide.hidden;
    guideButton.setAttribute('aria-expanded', String(!guide.hidden));
});
const dialog = document.getElementById('demoResetDialog');
document.getElementById('demoResetButton').addEventListener('click', () => dialog.showModal());
document.getElementById('demoResetCancel').addEventListener('click', () => dialog.close());
document.getElementById('demoResetConfirm').addEventListener('click', () => { resetDemo(); location.reload(); });
const showWarning = message => {
    const el = document.getElementById('demoStorageWarning');
    el.textContent = message; el.hidden = !message;
};
showWarning(getStorageWarning());
window.addEventListener('demo-storage-warning', event => showWarning(event.detail));
// Navegação por teclado e foco contido nos modais originais.
let previousFocus = null;
const modals = [...document.querySelectorAll('.contact-modal')];
const focusable = el => [...el.querySelectorAll('button, input, select, textarea, a[href], [tabindex="0"]')].filter(x => !x.disabled && x.getClientRects().length);
for (const modal of modals) {
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
    const heading = modal.querySelector('h2,h3');
    if (heading) { heading.id ||= `${modal.id}-heading`; modal.setAttribute('aria-labelledby',heading.id); }
    new MutationObserver(() => {
        if (!modal.classList.contains('hidden')) {
            previousFocus = document.activeElement;
            const items = focusable(modal); if (items[0]) items[0].focus({preventScroll:true});
        } else if (previousFocus?.isConnected && previousFocus.getClientRects().length) previousFocus.focus({preventScroll:true});
    }).observe(modal, { attributes:true, attributeFilter:['class'] });
}
document.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const modal = modals.filter(m => !m.classList.contains('hidden')).at(-1);
    if (!modal) return;
    const items = focusable(modal); const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});

window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
