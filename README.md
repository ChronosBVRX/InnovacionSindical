```markdown
# Innovación Sindical – Frontend (GitHub Pages)


Este paquete contiene una página de **login** y un ejemplo de **zona protegida** que consumen una API en **Render** con **Supabase Auth**.


## 🔧 Configuración rápida
1. Crea tu proyecto en **Supabase** y copia:
- `Project URL`
- `anon public key`
- (para el backend) `service_role key`
2. En `assets/app.js` configura:
```js
const SUPABASE_URL = "https://xxxx.supabase.co";
const SUPABASE_ANON_KEY = "ey...";
const API_BASE = "https://tu-api.onrender.com";
```
3. Publica esta carpeta dentro de tu repo de Pages, por ejemplo:
- `chronosbvrx.github.io/InnovacionSindical/`
- Accede a: `/InnovacionSindical/login.html` y `/InnovacionSindical/protected.html`.


## 🌐 CORS en tu API (Render)
Agrega en variables de entorno de tu servicio:
- `ALLOWED_ORIGIN = https://chronosbvrx.github.io`
- `SUPABASE_URL = https://xxxx.supabase.co`
- `SUPABASE_SERVICE_ROLE = <clave secreta>`


## 🧪 Flujo de prueba
1. Abre `login.html` → Crear cuenta → confirma email (si aplica) → Entrar.
2. Pulsa **GET /profile** para verificar el token contra tu API.
3. Abre `protected.html` → debe mostrar guard si no hay sesión, o contenido si sí.


## ❗ Seguridad
- Nunca expongas `service_role` en el frontend.
- La "protección real" siempre está en el servidor (verificación de JWT en Render).


## 🆘 Problemas comunes
- **CORS**: asegúrate de `ALLOWED_ORIGIN` exacto y redeploy.
- **401**: sin token válido o usuario sin confirmar.
- **404 en rutas**: usa `404.html` si navegas rutas tipo SPA.
