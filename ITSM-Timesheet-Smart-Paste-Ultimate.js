// ==UserScript==
// @name         ITSM Timesheet - Smart Paste Ultimate
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Autocompletar tiempos. Regex corregido para no borrar palabras.
// @match        https://msscc.mecalux.com/TimeSheet
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    /*********************************
    * 1. CONFIGURACIÓN
    *********************************/
    const CONFIG = {
        autoSave: true,
        conceptText: 'RN10808 OTHER - Various tasks',

        // Selectores
        btnAdd: '.dx-datagrid-addrow-button, div[aria-label="Add row"], .dx-icon-plus',
        inputTime: 'input[id$="_Duration"]',
        inputTask: 'textarea[id$="_Task"]',
        inputConcept: 'div[id$="_TimeSheetServiceTypeId"]', // El desplegable
        btnSaveAndContinue: 'div[aria-label="Save & Continue"]'
    };

    /*********************************
    * 2. UTILIDADES
    *********************************/
    const delay = ms => new Promise(res => setTimeout(res, ms));

    function parseCopiedText(rawText) {
        const text = rawText.trim();

        // REGEX CORREGIDO: Ahora solo ignora "h", "hr", "m" o "min". No se come el texto.
        // Soporta: "0.25 cafe", "0,5 h llamada", "1.5 - revisar log"
        const match = text.match(/^([\d.,]+)\s*(?:h|hr|hrs|m|min|mins)?\s*(?:-\s*)?(.*)$/i);

        if (match) {
            let timeVal = match[1].replace(',', '.');
            let taskText = match[2].trim();

            return { time: timeVal, task: taskText };
        }
        return null;
    }

    function setNativeValue(selector, value) {
        const el = document.querySelector(selector);
        if (el) {
            el.focus();
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.blur();
        }
    }

    /*********************************
    * 3. MOTOR ASÍNCRONO
    *********************************/
    async function processTimesheet(parsedData) {
        const isModalOpen = document.querySelector(CONFIG.inputTime) !== null;

        if (!isModalOpen) {
            const addBtn = document.querySelector(CONFIG.btnAdd);
            if (addBtn) {
                addBtn.click();
                await delay(600);
            } else {
                alert("No se encuentra el botón '+'.");
                return;
            }
        }

        // Rellenar Texto y Duración
        setNativeValue(CONFIG.inputTime, parsedData.time);
        setNativeValue(CONFIG.inputTask, parsedData.task);

        // Clic real en el desplegable
        const conceptDropdown = document.querySelector(CONFIG.inputConcept);
        if (conceptDropdown) {
            conceptDropdown.click();
            await delay(400);

            const listItems = Array.from(document.querySelectorAll('.dx-list-item-content'));
            const targetItem = listItems.find(item => item.textContent.includes(CONFIG.conceptText));

            if (targetItem) {
                targetItem.click();
                await delay(400); // Pausa tras seleccionar el concepto
            }
        }

        // Autoguardado con un poco más de margen de seguridad para evitar "Object not found"
        if (CONFIG.autoSave) {
            await delay(600); // Dejamos respirar a DevExtreme antes de guardar
            const saveBtn = document.querySelector(CONFIG.btnSaveAndContinue);
            if (saveBtn) {
                saveBtn.click();
            }
        }
    }

    /*********************************
    * 4. INTERFAZ Y EVENTOS
    *********************************/
    function injectSmartPanel() {
        if (document.getElementById('itsm-smart-paste-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'itsm-smart-paste-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #ffffff;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 999999;
            font-family: sans-serif;
            width: 250px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const title = document.createElement('strong');
        title.innerText = '⚡ Smart Paste (Tiempos)';
        title.style.color = '#1e40af';
        title.style.fontSize = '14px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Pega (Ctrl+V) o escribe y pulsa Enter...';
        input.style.cssText = `
            padding: 8px;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            font-size: 13px;
            outline: none;
            transition: all 0.3s ease;
        `;

        const processInputText = (rawText) => {
            const parsed = parseCopiedText(rawText);
            if (parsed) {
                input.style.backgroundColor = '#dcfce7';
                input.value = '';
                input.placeholder = '¡Magia en proceso...!';

                processTimesheet(parsed);

                setTimeout(() => {
                    input.style.backgroundColor = '#ffffff';
                    input.placeholder = 'Pega (Ctrl+V) o escribe y pulsa Enter...';
                }, 2000);
            } else {
                input.style.backgroundColor = '#fee2e2';
                input.value = '';
                input.placeholder = 'Formato no reconocido';
                setTimeout(() => {
                    input.style.backgroundColor = '#ffffff';
                    input.placeholder = 'Pega (Ctrl+V) o escribe y pulsa Enter...';
                }, 1500);
            }
        };

        input.addEventListener('paste', (e) => {
            setTimeout(() => processInputText(input.value), 50);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                processInputText(input.value);
            }
        });

        panel.appendChild(title);
        panel.appendChild(input);
        document.body.appendChild(panel);
    }

    /*********************************
    * 5. ARRANQUE
    *********************************/
    function boot() {
        injectSmartPanel();
        const observer = new MutationObserver(() => injectSmartPanel());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();