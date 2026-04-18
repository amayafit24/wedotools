# INSTRUCCIONES PARA AMAYA — COPIA Y PEGA
## Herramienta: "Adivina tu edad metabólica"

---

## LO QUE TIENES EN ESTA CARPETA

```
wedotools/
├── index.html                    ← La herramienta (la web que verán tus seguidoras)
├── netlify.toml                  ← Configuración Netlify (no toques nada)
├── .gitignore                    ← Protección (no toques nada)
└── netlify/
    └── functions/
        └── claude.js             ← La IA segura (no toques nada)
```

---

## PASO 1 — Sube los archivos a GitHub

1. Ve a **github.com** e inicia sesión
2. Haz clic en el botón verde **"New"** (repositorio nuevo)
3. Ponle de nombre: `wedotools`
4. Deja todo por defecto y haz clic en **"Create repository"**
5. Haz clic en **"uploading an existing file"** (enlace que aparece en la página)
6. **Arrastra TODA la carpeta `wedotools`** al recuadro de subida
7. Escribe en el mensaje: `primera versión`
8. Haz clic en **"Commit changes"** (botón verde)

---

## PASO 2 — Conecta con Netlify

1. Ve a **app.netlify.com** e inicia sesión
2. Haz clic en **"Add new site"** → **"Import an existing project"**
3. Elige **GitHub**
4. Busca y selecciona el repositorio `wedotools`
5. Deja todo por defecto — haz clic en **"Deploy site"**
6. Espera 1-2 minutos — verás una URL tipo `algo-bonito-123.netlify.app`

---

## PASO 3 — Añade tu API key de Anthropic (MUY IMPORTANTE)

1. En Netlify, ve a tu sitio → **"Site configuration"** (menú lateral)
2. Busca **"Environment variables"**
3. Haz clic en **"Add a variable"**
4. Rellena así:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** tu API key (empieza por `sk-ant-...`)
5. Haz clic en **"Save"**
6. Ve a **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

---

## PASO 4 — Personaliza tu número de WhatsApp

Abre el archivo `index.html` con cualquier editor de texto (el Bloc de notas sirve).
Busca (Ctrl+F) el texto: `34600000000`
Cámbialo por tu número real (sin espacios, con código de país).

Ejemplo España: `34612345678`
Ejemplo Nicaragua: `50512345678`

Guarda el archivo, vuelve a subirlo a GitHub (paso 1, solo el index.html) y Netlify se actualiza solo.

---

## RESULTADO FINAL

Tu herramienta estará en: `tu-sitio.netlify.app`

- La IA de Claude genera mensajes personalizados para cada usuaria
- Tu API key está 100% segura — nunca visible en el código
- Las usuarias introducen su nombre y WhatsApp para ver el plan
- Botón directo a tu WhatsApp con mensaje pre-rellenado

---

## ¿NECESITAS AYUDA?

Dile a Claude exactamente qué paso no te funciona y te ayudará.
