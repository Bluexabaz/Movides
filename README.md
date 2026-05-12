# 🛠️ ITSM Automation Scripts

Este repositorio contiene una colección de scripts de Tampermonkey (JavaScript) diseñados para optimizar el flujo de trabajo diario, reducir la fricción de la interfaz y automatizar tareas repetitivas en las plataformas de gestión de Mecalux.

## 📦 Requisitos Previos

Para utilizar estos scripts, necesitas tener instalada la extensión **Tampermonkey** en tu navegador web. Si quieres instalar los scripts directamente, haz clic en los enlaces de cada sección.

| Script | Enlace de Instalación |
| :--- | :--- |
| **Common Template (v4.1)** | [📥 Instalar Script](https://raw.githubusercontent.com/Bluexabaz/Movides/main/itsm-common-template.user.js) |
| **Timesheet Auto** | [📥 Instalar Script](https://raw.githubusercontent.com/Bluexabaz/Movides/main/itsm-timesheet.user.js) |
---

## 📄 Script 1: ITSM Common Template (Multilanguage)

Un inyector inteligente de interfaz que añade un menú desplegable directamente en los editores de texto. Permite insertar respuestas predefinidas y estandarizadas de forma instantánea, adaptándose al idioma necesario (ES/EN) para comunicarse con el cliente.

### ✨ Características
* **🚀 Autocompletado Inteligente:** Detecta automáticamente el nombre del **Caller** y el número de incidencia (**I-XXXXXX**) para insertarlos en el saludo.
* **🧠 Memoria Local:** Gracias a la persistencia de datos, el script "recuerda" la información del ticket incluso al abrir ventanas emergentes o modales donde la información no es visible.
* **🌍 Multilingüe:** Soporte completo para plantillas en **Castellano** e **Inglés**.
* **📂 Nuevas Funciones v4.1:** * Plantilla de **Unificación de Incidencias** (para cierres por duplicidad).
    * Estandarización de **"Servidor Principal"** para evitar tecleos manuales.
    * Ajuste automático de observaciones (**N/A**) en avisos de conexión.

### ⚙️ Configuración y Modificación
Para añadir o modificar plantillas, edita el objeto `TPL` dentro del código fuente. Mantén la estructura de llaves por idioma (`es`, `en`).

---

## ⏱️ Script 2: ITSM Timesheet Smart Paste Ultimate

Un panel de control flotante que actúa como un robot RPA. Permite la entrada ultrarrápida de tiempos diarios superando las restricciones del framework *DevExtreme*.

### ✨ Características
* **Panel Flotante Inteligente:** Escribe o pega texto (ej. `0.25 cafe` -> `Enter`).
* **Procesamiento Regex:** Extrae las horas y la descripción limpiamente, ignorando sufijos ("h", "min").
* **Bypass de Interfaz:** Simula clics humanos con pausas asíncronas para desplegar menús y seleccionar opciones sin rechazo del servidor.
* **Autoguardado (Zero-clicks):** Rellena la duración, tarea, selecciona "OTHER - Various tasks" y guarda automáticamente.

### ⚙️ Modificación de Conceptos
Por defecto selecciona `RN10808 OTHER - Various tasks`. Se puede modificar cambiando la variable `conceptText` en el bloque `CONFIG` superior del código.