

setTag(apiStatus, 'Llamando…');
if(apiResult) apiResult.textContent = 'Llamando API...';
const { data: { session } } = await supabase.auth.getSession();
if(!session){ setTag(apiStatus, 'Sin sesión', 'err'); if(apiResult) apiResult.textContent = 'Inicia sesión primero.'; return; }
try{
const res = await fetch(`${API_BASE}/profile`, { headers: { 'Authorization': `Bearer ${session.access_token}` } });
const json = await res.json();
if(apiResult) apiResult.textContent = JSON.stringify(json, null, 2);
setTag(apiStatus, res.ok ? 'OK' : `Error ${res.status}`, res.ok ? 'ok' : 'err');
}catch(e){ setTag(apiStatus, 'Error', 'err'); if(apiResult) apiResult.textContent = 'Error: ' + e.message; }
});


reflectSession();
}


if(page === 'protected'){
const guardCard = document.getElementById('guard-card');
const contentCard = document.getElementById('content-card');
const whoamiBtn = document.getElementById('whoami');
const whoamiResult = document.getElementById('whoamiResult');
const logoutBtn = document.getElementById('logout');


const { data: { session } } = await supabase.auth.getSession();
if(!session){
guardCard?.removeAttribute('hidden');
contentCard?.setAttribute('hidden', '');
return;
}
contentCard?.removeAttribute('hidden');


whoamiBtn?.addEventListener('click', async () => {
try{
const res = await fetch(`${API_BASE}/profile`, { headers: { 'Authorization': `Bearer ${session.access_token}` } });
const json = await res.json();
whoamiResult.textContent = JSON.stringify(json, null, 2);
}catch(e){
whoamiResult.textContent = 'Error: ' + e.message;
}
});


logoutBtn?.addEventListener('click', async () => {
await supabase.auth.signOut();
location.href = './login.html';
});
}
});
```
