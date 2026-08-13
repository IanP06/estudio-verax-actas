# 🚀 Guía de Despliegue en Vercel - Estudio Verax

La aplicación **Generador Automático de Actas de Desistimiento (Estudio Verax)** está completamente optimizada y lista para ser desplegada en **Vercel**.

---

## 📋 Requisitos Previos
- Cuenta en [Vercel](https://vercel.com) (gratuita).
- Cuenta en GitHub, GitLab o Bitbucket (para despliegue automático).

---

## ⚡ Opción 1: Despliegue desde GitHub (Recomendado)

1. **Subir el código a GitHub**:
   Si aún no has subido el proyecto a un repositorio de GitHub, ejecuta en la terminal dentro de la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Generador de Actas Estudio Verax"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/estudio-verax-actas.git
   git push -u origin main
   ```

2. **Conectar en Vercel**:
   - Ingresa a tu panel en [vercel.com/new](https://vercel.com/new).
   - Haz clic en **Import Git Repository** y selecciona el repositorio `estudio-verax-actas`.

3. **Configurar el Proyecto**:
   - **Framework Preset**: `Vite` (Vercel lo detectará automáticamente).
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Desplegar**:
   - Haz clic en **Deploy**. En menos de 1 minuto el proyecto estará publicado con certificado SSL (HTTPS) y URL propia.

---

## 💻 Opción 2: Despliegue Directo vía Vercel CLI (Sin Git)

Si prefieres subir la aplicación directamente desde tu consola sin usar GitHub:

1. Abre la terminal en la carpeta del proyecto:
   ```bash
   cd C:\Users\peric\.gemini\antigravity\scratch\estudio-verax-actas
   ```

2. Ejecuta el comando de despliegue de Vercel:
   ```bash
   npx vercel
   ```

3. Responde a las preguntas interactivas en la consola:
   - *Set up and deploy?* → `Y`
   - *Which scope?* → Tu usuario/cuenta de Vercel.
   - *Link to existing project?* → `N`
   - *What's your project's name?* → `estudio-verax-actas`
   - *In which directory is your code located?* → `./`
   - *Want to modify these settings?* → `N`

4. Para publicar la versión final a producción, ejecuta:
   ```bash
   npx vercel --prod
   ```

---

## ✅ Verificaciones de Producción
- El archivo `vercel.json` ya está configurado para manejar la navegación SPA y las rutas estáticas.
- Los logos e imágenes en `public/assets/logos/` están empaquetados y optimizados en Base64 para garantizar que el motor de PDF (`@react-pdf/renderer`) funcione sin problemas de CORS ni fallos en producción.
