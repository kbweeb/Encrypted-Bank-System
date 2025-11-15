(() => {
  const LS_KEY = 'bank.accounts.v1';
  const SESSION_KEY = 'bank.session.v1';
  const ADMIN_PIN = '1234';

  const $ = (id) => document.getElementById(id);
  const qs = (sel) => document.querySelector(sel);

  function load() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
  }
  function save(list) { localStorage.setItem(LS_KEY, JSON.stringify(list)); }
  function saveSession(id) { localStorage.setItem(SESSION_KEY, id || ''); }
  function loadSession() { return localStorage.getItem(SESSION_KEY) || ''; }

  const state = { accounts: load(), currentId: loadSession() };
  const byId = (id) => state.accounts.find(a => a.id === id);

  function create(id, name, pin) {
    if (!id || !name || !pin) return 'All fields required';
    if (byId(id)) return 'ID already exists';
    state.accounts.push({ id, name, pin, balance: 0 });
    save(state.accounts);
    return 'Account created';
  }
  function login(id, pin) {
    const a = byId(id);
    if (!a || a.pin !== pin) return 'Invalid credentials';
    state.currentId = id; saveSession(id);
    return `Welcome ${a.name}`;
  }
  function logout() {
    state.currentId = ''; saveSession('');
  }
  function current() { return state.currentId ? byId(state.currentId) : null; }

  function deposit(amt) {
    const a = current(); if (!a) return 'Not logged in';
    const n = Number(amt); if (!Number.isFinite(n) || n <= 0) return 'Invalid amount';
    a.balance += n; save(state.accounts); return `Deposited ${n}`;
  }
  function withdraw(amt) {
    const a = current(); if (!a) return 'Not logged in';
    const n = Number(amt); if (!Number.isFinite(n) || n <= 0) return 'Invalid amount';
    if (a.balance < n) return 'Insufficient funds';
    a.balance -= n; save(state.accounts); return `Withdrew ${n}`;
  }
  function balance() {
    const a = current(); return a ? `${a.name}: ${a.balance}` : 'Not logged in';
  }
  function list(pin) {
    if (pin !== ADMIN_PIN) return 'Invalid admin PIN';
    return state.accounts.map(a => `${a.id} — ${a.name} — ${a.balance}`).join('\n') || '(no accounts)';
  }

  // Tabs
  function activateTab(name) {
    document.querySelectorAll('.navbar button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    qs(`.navbar button[data-tab="${name}"]`).classList.add('active');
    $(`${name}`).classList.add('active');
  }
  document.querySelectorAll('.navbar button').forEach(b => {
    b.onclick = () => {
      if (b.dataset.tab === 'dashboard' && !current()) return alert('Login first');
      activateTab(b.dataset.tab);
    };
  });

  function refreshSessionUI() {
    const a = current();
    const dashBtn = document.querySelector('.navbar button[data-tab="dashboard"]');
    if (a) {
      dashBtn.removeAttribute('disabled');
      $('currentUserName').textContent = a.name;
      activateTab('dashboard');
    } else {
      dashBtn.setAttribute('disabled', '');
      $('currentUserName').textContent = '-';
      activateTab('auth');
    }
  }

  // Wire UI
  $('createBtn').onclick = () => alert(create($('newId').value, $('newName').value, $('newPin').value));
  $('loginBtn').onclick = () => { const msg = login($('loginId').value, $('loginPin').value); alert(msg); refreshSessionUI(); };
  $('logoutBtn').onclick = () => { logout(); refreshSessionUI(); };
  $('depBtn').onclick = () => alert(deposit($('depAmt').value));
  $('wdBtn').onclick = () => alert(withdraw($('wdAmt').value));
  $('balBtn').onclick = () => $('balOut').textContent = balance();
  $('listBtn').onclick = () => $('listOut').textContent = list($('adminPin').value);

  refreshSessionUI();
})();
