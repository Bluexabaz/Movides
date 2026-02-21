# 🛠️ ITSM Automation Scripts

Este repositorio contiene una colección de scripts de Tampermonkey (JavaScript) diseñados para optimizar el flujo de trabajo diario, reducir la fricción de la interfaz y automatizar tareas repetitivas en las plataformas de gestión.

## 📦 Requisitos Previos

Para utilizar estos scripts, necesitas tener instalada la extensión **Tampermonkey** en tu navegador web (compatible con Chrome, Edge, Firefox, etc.).

---

## 📄 Script 1: ITSM Advanced Public Log Templates (Multilanguage)

Un inyector de interfaz que añade un menú desplegable directamente en el editor del *Public Log*. Permite insertar respuestas predefinidas y estandarizadas de forma instantánea, adaptándose al idioma necesario para comunicarse con el *customer* de manera profesional.

### ✨ Características
* **Motor estable (MutationObserver):** Detecta dinámicamente la carga del `CKEditor` para garantizar que el menú se inyecte siempre, incluso si la página recarga partes del DOM.
* **Multilenguaje (ES/EN):** Selector rápido para alternar el idioma de la plantilla. El idioma seleccionado se guarda en la memoria local (`localStorage`) para mantener la preferencia en futuros usos.
* **Seguridad anti-sobrescritura:** Si el cuadro de texto ya contiene información sobre la *issue*, el script pedirá confirmación antes de reemplazar el texto para evitar pérdidas accidentales.

### ⚙️ Configuración y Modificación
Para añadir o modificar plantillas, edita el objeto `TPL` dentro del script. Mantén la estructura de llaves por idioma (`es`, `en`) e inserta el HTML necesario respetando la variable de estilos `pubStyle`.

---

## ⏱️ Script 2: ITSM Timesheet Smart Paste Ultimate

Un panel de control flotante inyectado en la plataforma de registro de tiempos que actúa como un robot RPA (Robotic Process Automation). Permite la entrada ultrarrápida de tiempos (especialmente para tareas administrativas) superando las restricciones del framework *DevExtreme*.

### ✨ Características
* **Panel Flotante (UI):** Accesible desde la esquina inferior derecha.
* **Soporte de copiado/pegado y escritura manual:** Puedes pegar un texto desde otra aplicación (ej. `Ctrl+V: 0.25 cafe`) o escribirlo manualmente y pulsar `Enter`.
* **Procesamiento Inteligente (Regex):** Extrae automáticamente el número (convirtiendo comas en puntos) y el texto descriptivo, ignorando sufijos como "h" o "min".
* **Bypass de DevExtreme:** Simula clics humanos con pausas asíncronas (`async/await`) para desplegar menús, forzar la renderización de las listas ocultas y seleccionar las opciones sin que el servidor rechace los datos.
* **Autoguardado (Zero-clicks):** Abre el modal, rellena la duración, el texto de la tarea, selecciona el concepto "OTHER - Various tasks" y pulsa *Save & Continue* automáticamente.

### ⚙️ Configuración y Modificación
En la parte superior del script se encuentra el bloque `CONFIG`:

\`\`\`javascript
const CONFIG = {
    autoSave: true, // Cambiar a false para revisar los datos antes de guardar
    conceptText: 'RN10808 OTHER - Various tasks', // Texto exacto a buscar en el desplegable
    // Selectores del DOM (Modificar si la interfaz web se actualiza)
    btnAdd: '.dx-datagrid-addrow-button, div[aria-label="Add row"], .dx-icon-plus', 
    inputTime: 'input[id$="_Duration"]', 
    inputTask: 'textarea[id$="_Task"]',
    inputConcept: 'div[id$="_TimeSheetServiceTypeId"]',
    btnSaveAndContinue: 'div[aria-label="Save & Continue"]'
};
\`\`\`

---

## 🚀 Despliegue y Control de Versiones

Para subir cambios a este repositorio de forma automática desde Windows:
1. Guarda tus scripts actualizados (`.user.js`) en el directorio local.
2. Ejecuta el archivo `subir_a_git.bat`.
3. Introduce el mensaje del *commit* cuando la consola te lo solicite.
4. El script empaquetará, confirmará y subirá los cambios a la rama principal (`main`).