// ================== CONFIGURA TUS VALORES ==================
const SUPABASE_URL = https://axsncdwshdvsysrpikwj.supabase.co;      // Supabase → Settings → API → Project URL
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4c25jZHdzaGR2c3lzcnBpa3dqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIyOTAyNCwiZXhwIjoyMDc1ODA1MDI0fQ.YnkHpHoeSs3W0fquG_FwGi4DU-qJ7N7huQoEtr_kh1M; // Supabase → Settings → API → anon public
const API_BASE = "https://sinos-api.onrender.com";            // URL pública de tu API en Render
// ===========================================================

if (!window.supabase) {
  console.error("No se cargó @supabase/supabase-js. Revisa el <script> CDN en tu HTML.");
}

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Utils UI
const $ = (id) => document.getElementById(id);
function setTag(el, text, klass = '') {
  if (!el) return;
  el.textContent = text;
  el.className = 'tag ' + klass;
}
async function reflectSession() {
  const state = $("authState");
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) console.error("[auth.getSession]", error);
  if (state) setTag(state, session?.user ? `Autenticado: ${session.user.email}` : 'No autenticado', session?.user ? 'ok' : '');
  return session || null;
}

window.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.getAttribute('data-page');

  // ================== LOGIN PAGE ==================
  if (page === 'login') {
    const signupBtn = $("signup");
    const signinBtn = $("signin");
    const signoutBtn = $("signout");
    const callApiBtn = $("callApi");
    const apiStatus = $("apiStatus");
    const apiResult = $("apiResult");

    signupBtn?.addEventListener('click', async () => {
      const email = $("email").value.trim();
      const password = $("password").value;
      if (!email || !password) return alert('Completa correo y contraseña.');
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
        setTag($("authState"), 'Error al registrar', 'err');
      } else {
        alert('Registro enviado. Revisa tu correo si se requiere confirmación.');
      }
      reflectSession();
    });

    signinBtn?.addEventListener('click', async () => {
      const email = $("email").value.trim();
      const password = $("password").value;
      if (!email || !password) return alert('Completa correo y contraseña.');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
        setTag($("authState"), 'Error al iniciar sesión', 'err');
      } else {
        alert('Sesión iniciada.');
      }
      reflectSession();
    });

    signoutBtn?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      alert('Sesión cerrada.');
      reflectSession();
    });

    callApiBtn?.addEventListener('click', async () => {
      setTag(apiStatus, 'Llamando…');
      if (apiResult) apiResult.textContent = 'Llamando API...';
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setTag(apiStatus, 'Sin sesión', 'err');
        if (apiResult) apiResult.textContent = 'Inicia sesión primero.';
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const json = await res.json();
        if (apiResult) apiResult.textContent = JSON.stringify(json, null, 2);
        setTag(apiStatus, res.ok ? 'OK' : `Error ${res.status}`, res.ok ? 'ok' : 'err');
      } catch (e) {
        setTag(apiStatus, 'Error', 'err');
        if (apiResult) apiResult.textContent = 'Error: ' + e.message;
      }
    });

    reflectSession();
  }

  // ================== PROTECTED PAGE ==================
  if (page === 'protected') {
    const guardCard = document.getElementById('guard-card');
    const contentCard = document.getElementById('content-card');
    const whoamiBtn = document.getElementById('whoami');
    const whoamiResult = document.getElementById('whoamiResult');
    const logoutBtn = document.getElementById('logout');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      guardCard?.removeAttribute('hidden');
      contentCard?.setAttribute('hidden', '');
      return;
    }

    contentCard?.removeAttribute('hidden');

    whoamiBtn?.addEventListener('click', async () => {
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const json = await res.json();
        whoamiResult.textContent = JSON.stringify(json, null, 2);
      } catch (e) {
        whoamiResult.textContent = 'Error: ' + e.message;
      }
    });

    logoutBtn?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      location.href = './login.html';
    });
  }
});
