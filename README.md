# 🛠️ ITSM Utilities - Mecalux Software Solution

Colección de scripts de **Tampermonkey** diseñados para optimizar la gestión de incidencias, automatizar tareas repetitivas y mejorar la productividad diaria en el portal ITSM de Mecalux.

---

## 📜 Scripts Disponibles

### 1️⃣ ITSM – Common Template (Multilanguage)
Gestor avanzado de plantillas para comunicaciones externas. Permite insertar textos predefinidos y profesionales tanto en el **Public Log** como en la ventana de **First Contact**.

* **🚀 Autocompletado Inteligente:** Detecta automáticamente el nombre del **Caller** y el número de incidencia (**I-XXXXXX**) para insertarlos en el saludo.
* **🧠 Memoria Local:** Gracias a la persistencia de datos, el script "recuerda" la información del ticket incluso al abrir ventanas emergentes o modales donde la información no es visible.
* **🛡️ Cortafuegos Inteligente:** Se desactiva automáticamente en los tickets de Cambio (C-XXXXXX) para no interferir con otras herramientas.
* **🌍 Multilingüe:** Soporte completo para plantillas en **Castellano** e **Inglés**.

### 2️⃣ ITSM - Change Templates Automator (Visual Panel)
Generador en cascada definitivo para rellenar la documentación técnica de los pases a producción y pre-producción (Tickets C-XXXXXX).

* **🛸 Botón Flotante:** Un panel visual accesible desde cualquier parte del ticket (esquina inferior derecha).
* **⚡ Inyección en Cascada:** Rellena automáticamente y de un solo clic los 6 cuadros de texto de la pestaña *Service Desk* (Previous actions, Implementation, Fallback, Special attention, Implementation check y Next actions).
* **📚 Adaptado a la Normativa Oficial:** Textos extraídos de la documentación de Mecalux para *Views*, *Queries*, *Workflows* (con y sin parada), *Reports* y *Resources*.
* **🔄 Soporte Multiobjeto:** Permite pegar listas de objetos para inyectarlos todos a la vez.
* **🌍 Bilingüe con Memoria:** Genera la documentación en Español o Inglés, recordando tu última elección.

### 3️⃣ ITSM - Timesheet Automation
*(Herramienta de automatización para el registro de tiempos)*.

---

## 🚀 Instalación y Configuración

Para utilizar estas herramientas, sigue estos sencillos pasos:

> [!IMPORTANT]
> **Requisito Previo:** Debes tener instalada la extensión **Tampermonkey** en tu navegador (Chrome, Edge o Firefox).

1.  **Selecciona el script** que desees instalar de la lista inferior.
2.  Haz clic en el enlace **"Instalar"**.
3.  Se abrirá una pestaña de Tampermonkey; pulsa el botón **"Instalar"** (o "Actualizar").
4.  Recarga tu página de ITSM y verás las nuevas funcionalidades integradas.

| Script | Enlace de Instalación |
| :--- | :--- |
| **Common Template (v4.2)** | [📥 Instalar Script](https://raw.githubusercontent.com/Bluexabaz/Movides/main/itsm-common-template.user.js) |
| **Change Automator (v3.3)** | [📥 Instalar Script](https://raw.githubusercontent.com/Bluexabaz/Movides/main/itsm-change-automator.user.js) |
| **Timesheet Auto** | [📥 Instalar Script](https://raw.githubusercontent.com/Bluexabaz/Movides/main/itsm-timesheet.user.js) |

---

## 🔄 Actualizaciones Automáticas

No necesitas preocuparte por las versiones. Los scripts están configurados para:
* **Verificar mejoras diariamente** de forma automática.
* Sincronizarse con los últimos cambios realizados en este repositorio.

> [!TIP]
> Si necesitas una mejora urgente que acaba de ser subida, simplemente vuelve a hacer clic en los enlaces de instalación de arriba para forzar la actualización manual.

---
*Desarrollado y mantenido por Fernando González Cienfuegos*