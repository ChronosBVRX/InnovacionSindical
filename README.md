# Innovación Sindical

Sitio web estático en tonos azules con página principal, sección "¿Quiénes somos?" y formulario de registro para la iniciativa Innovación Sindical.

## Estructura

- `index.html`: landing page con hero, métricas, soluciones y llamado a la acción.
- `quienes-somos.html`: misión, visión, valores, hitos y equipo.
- `registro.html`: formulario detallado para incorporar sindicatos.
- `assets/styles.css`: hoja de estilos compartida para todas las páginas.

## Publicación en GitHub Pages

El repositorio incluye un flujo de trabajo de GitHub Actions (`.github/workflows/deploy.yml`) que publica automáticamente el sitio en GitHub Pages cada vez que se hace push a la rama `main`.

1. En GitHub ve a **Settings → Pages** y selecciona **GitHub Actions** como fuente.
2. Confirma que la rama principal se llama `main`. Si estás trabajando en otra rama, haz merge a `main`.
3. Desde tu entorno local ejecuta:
   ```bash
   git add .
   git commit -m "Describe tus cambios"
   git push origin main
   ```
4. GitHub Actions ejecutará el workflow **Deploy static site** y, al finalizar, mostrará la URL pública en la sección de deployments.
5. Comparte la URL generada; tu sitio estará disponible en unos minutos.

## Vista previa local

Para revisar los cambios antes de publicarlos puedes levantar un servidor estático simple:

```bash
python -m http.server 8000
```

Luego abre <http://localhost:8000/index.html> en tu navegador.
