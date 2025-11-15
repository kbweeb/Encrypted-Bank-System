(() => {
  const LS_KEY = 'bank.accounts.v1';
  const ADMIN_PIN = '1234';

  function load() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
  }
  function save(list) { localStorage.setItem(LS_KEY, JSON.stringify(list)); }

  const state = { accounts: load() };

  const byId = (id) => state.accounts.find(a => a.id === id);

  function create(id, name, pin) {
    if (!id || !name || !pin) return 'All fields required';
    if (byId(id)) return 'ID already exists';
    state.accounts.push({ id, name, pin, balance: 0 });
    save(state.accounts);
    return 'Account created';
  }
  function deposit(id, amt) {
    const a = byId(id); if (!a) return 'Account not found';
    const n = Number(amt); if (!Number.isFinite(n) || n <= 0) return 'Invalid amount';
    a.balance += n; save(state.accounts); return `Deposited ${n}`;
  }
  function withdraw(id, amt) {
    const a = byId(id); if (!a) return 'Account not found';
    const n = Number(amt); if (!Number.isFinite(n) || n <= 0) return 'Invalid amount';
    if (a.balance < n) return 'Insufficient funds';
    a.balance -= n; save(state.accounts); return `Withdrew ${n}`;
  }
  function balance(id) {
    const a = byId(id); return a ? `${a.name}: ${a.balance}` : 'Account not found';
  }
  function list(pin) {
    if (pin !== ADMIN_PIN) return 'Invalid admin PIN';
    return state.accounts.map(a => `${a.id} — ${a.name} — ${a.balance}`).join('\n') || '(no accounts)';
  }

  // Wire UI
  const $ = (id) => document.getElementById(id);
  $('createBtn').onclick = () => alert(create($('newId').value, $('newName').value, $('newPin').value));
  $('depBtn').onclick = () => alert(deposit($('depId').value, $('depAmt').value));
  $('wdBtn').onclick = () => alert(withdraw($('wdId').value, $('wdAmt').value));
  $('balBtn').onclick = () => $('balOut').textContent = balance($('balId').value);
  $('listBtn').onclick = () => $('listOut').textContent = list($('adminPin').value);
})();
