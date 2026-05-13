// ==UserScript==
// @name         ITSM - Change Templates Automator (Visual Panel)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Generador con panel visual y BOTÓN FLOTANTE para rellenar campos de Cambio.
// @author       Fernando González Cienfuegos
// @match        https://itsm.mecalux.com/pages/UI.php?*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
    'use strict';

    // Función para obtener la instancia de CKEditor
    function getEditorByLabel(labelText) {
        if (typeof CKEDITOR === 'undefined') return null;
        const labels = Array.from(document.querySelectorAll('.ibo-field--label, legend, .ibo-panel--header-title, .ibo-tab-content'));
        const targetLabel = labels.find(l => l.innerText.trim().toLowerCase().includes(labelText.toLowerCase()));
        if (!targetLabel) return null;
        
        // En modo edición a veces el contenedor cambia
        const container = targetLabel.closest('.ibo-field, .ibo-panel, fieldset, .form_field');
        if (!container) return null;
        
        const cke = container.querySelector('.cke');
        if (!cke) return null;
        
        const id = cke.id.replace(/^cke_/, '');
        return CKEDITOR.instances[id] || null;
    }

    function getChangeNumber() {
        const titleMatch = document.title.match(/(C-\d{6,})/);
        if (titleMatch) return titleMatch[1];
        const pageText = document.body.innerText.match(/(C-\d{6,})/);
        if (pageText) return pageText[1];
        return "[C-XXXXXX]";
    }

    // Lógica para generar los textos
    function generateTexts(type, objName, appName, serverName) {
        const cNum = getChangeNumber();
        let htmlPrev = "", htmlImpl = "", htmlFall = "", htmlSpec = "", htmlCheck = "", htmlNext = "";

        const titleStyle = "color: #0284c7; font-weight: bold; font-size: 14px;";
        const highlight = "background-color: #fef08a; font-weight: bold;";

        htmlNext = `
            <p style="${titleStyle}">GIT UPDATE</p>
            <ul>
                <li>Update all the related documentation (Manual de retén, functional analysis, test plan...)</li>
                <li>From EasyB create an Expres Deployment Package (.pck) and upload to folder /deploy/custom/ in the project GIT route.</li>
                <li>From EasyB export the application in text mode and upload to folder /deploy/custom/ with your modified object.</li>
            </ul>
            <p><em>[PEGAR CAPTURA DE GIT AQUÍ]</em></p>`;

        switch (type) {
            case "VIEW":
                htmlPrev = `
                    <p style="${titleStyle}">Previous Actions</p>
                    <ul>
                        <li>Check EasyB version and license in <span style="${highlight}">${serverName}</span>.</li>
                        <li>Save the new view version in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                        <li>Export old view version and save it in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                    </ul>
                    <p><em>[PEGAR CAPTURAS DE CARPETAS/EASYB]</em></p>`;
                htmlImpl = `
                    <p style="${titleStyle}">Implementation Actions</p>
                    <ul>
                        <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                        <li>From EasyB go to view screen of application <strong>${appName}</strong>.</li>
                        <li>Import the new view <strong>${objName}</strong> located in folder C:\\TEMP\\${cNum}\\Deploy.</li>
                        <li>Take care about the new view is in Read Only status, if not, do CheckIn.</li>
                        <li>Activate the application.</li>
                        <li>Check in ApplicationService.log the correct compilation.</li>
                        <li>Notify using wg-OnGoingChanges Teams channel the end of the intervention.</li>
                    </ul>
                    <p><em>[PEGAR CAPTURA DEL AS LOG]</em></p>`;
                htmlFall = `
                    <p style="${titleStyle}">Fallback Actions</p>
                    <p>If intervention must be reverted in <span style="${highlight}">${serverName}</span>:</p>
                    <ul>
                        <li><strong>Option 1 (AD Backup):</strong> Access localhost/AD > Backup tab > Restore previous backup.</li>
                        <li><strong>Option 2 (EasyB Manual):</strong> Import the old view <strong>${objName}</strong> located in folder C:\\TEMP\\${cNum}\\Backup. CheckIn and Activate application.</li>
                    </ul>`;
                htmlSpec = `<p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the new view is generating errors.</p>`;
                htmlCheck = `<p>Test the operative affected for the view modification following the test plan agreed with customer.</p>`;
                break;

            case "QUERY":
                htmlPrev = `
                    <p style="${titleStyle}">Previous Actions</p>
                    <ul>
                        <li>Check EasyB version and license in <span style="${highlight}">${serverName}</span>.</li>
                        <li>Save the new query version in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                        <li>Export old query version and save it in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                    </ul>
                    <p><em>[PEGAR CAPTURAS DE CARPETAS/EASYB]</em></p>`;
                htmlImpl = `
                    <p style="${titleStyle}">Implementation Actions</p>
                    <ul>
                        <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                        <li>From EasyB go to query screen of application <strong>${appName}</strong>.</li>
                        <li>Import the new query <strong>${objName}</strong> located in folder C:\\TEMP\\${cNum}\\Deploy.</li>
                        <li>Take care about the new query is in Read Only status, if not, do CheckIn.</li>
                        <li>Check in ApplicationService.log the correct compilation.</li>
                        <li>Notify using wg-OnGoingChanges Teams channel the end of the intervention.</li>
                    </ul>
                    <p><em>[PEGAR CAPTURA DEL AS LOG AQUÍ]</em></p>`;
                htmlFall = `
                    <p style="${titleStyle}">Fallback Actions</p>
                    <ul>
                        <li><strong>Option 1:</strong> Access localhost/AD > Backup tab > Restore previous backup.</li>
                        <li><strong>Option 2:</strong> Import the old query <strong>${objName}</strong> located in folder C:\\TEMP\\${cNum}\\Backup. CheckIn.</li>
                    </ul>`;
                htmlSpec = `<p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the new query is generating errors.</p>`;
                htmlCheck = `<p>Test the operative affected for the query modification following the test plan agreed with customer.</p>`;
                break;

            case "WF_NO_IMPACT":
                htmlPrev = `
                    <p style="${titleStyle}">Previous Actions</p>
                    <ul>
                        <li>Check EasyB version and license in <span style="${highlight}">${serverName}</span>.</li>
                        <li>Save the new WF version in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                        <li>Export old WF version and save it in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                    </ul>`;
                htmlImpl = `
                    <p style="${titleStyle}">Implementation Actions (Without Modifying Records)</p>
                    <ul>
                        <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                        <li>[SPECIAL CASE] Sessions related to workstations or RF should be closed before starting.</li>
                        <li>From EasyB go to WF screen of application <strong>${appName}</strong>.</li>
                        <li>Import the new WF <strong>${objName}</strong> located in folder C:\\TEMP\\${cNum}\\Deploy. Select only elements to modify.</li>
                        <li>Take care about the new WF is in Read Only status, if not, do CheckIn.</li>
                        <li>Check in ApplicationService.log the correct compilation.</li>
                        <li>Notify using wg-OnGoingChanges Teams channel the end of the intervention.</li>
                    </ul>
                    <p><em>[PEGAR CAPTURA DEL AS LOG AQUÍ]</em></p>`;
                htmlFall = `
                    <p style="${titleStyle}">Fallback Actions</p>
                    <ul>
                        <li><strong>Option 1:</strong> Access localhost/AD > Backup tab > Restore previous backup.</li>
                        <li><strong>Option 2:</strong> Import the old WF <strong>${objName}</strong> from C:\\TEMP\\${cNum}\\Backup. CheckIn.</li>
                    </ul>`;
                htmlSpec = `<p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the new WF is generating errors.</p>`;
                htmlCheck = `
                    <p>Test the operative affected for the WF modification following the test plan.</p>
                    <p>Is advisable activate EasyWMS Web trace from ApplicationService web interface.</p>`;
                break;

            case "WF_IMPACT":
                htmlPrev = `
                    <p style="${titleStyle}">Previous Actions</p>
                    <ul>
                        <li>Check EasyB version and license in <span style="${highlight}">${serverName}</span>.</li>
                        <li>Save the new WF version in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                        <li>Export old WF version and save it in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                    </ul>`;
                htmlImpl = `
                    <p style="${titleStyle}">Implementation Actions (Modifying Records - Stop Facility)</p>
                    <ul>
                        <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                        <li><strong>Confirm that the facility is completely stopped.</strong> We need to stop the jobs before the intervention.</li>
                        <li>From EasyB go to WF screen of application <strong>${appName}</strong>.</li>
                        <li>Import the new WF <strong>${objName}</strong> located in folder C:\\TEMP\\${cNum}\\Deploy.</li>
                        <li>Take care about the new WF is in Read Only status, if not, do CheckIn.</li>
                        <li>Check in ApplicationService.log the correct compilation.</li>
                        <li><strong>[ERRORS / COMPILATION CASE]:</strong> Stop IIS. Remove directory <em>C:\\Windows\\temp\\Mecalux</em>. Start IIS.</li>
                        <li>Start the jobs. Check ApplicationService.log to be sure IIS is starting without problems.</li>
                        <li>Once started, facility can be started again. Notify wg-OnGoingChanges.</li>
                    </ul>
                    <p><em>[PEGAR CAPTURA DEL AS LOG / JOBS AQUÍ]</em></p>`;
                htmlFall = `
                    <p style="${titleStyle}">Fallback Actions</p>
                    <ul>
                        <li><strong>Option 1:</strong> Stop jobs. Access localhost/AD > Restore previous backup. Start jobs again.</li>
                        <li><strong>Option 2:</strong> Stop jobs. Import the old WF <strong>${objName}</strong> from C:\\TEMP\\${cNum}\\Backup. CheckIn. Stop IIS > Remove Temp > Start IIS > Start jobs.</li>
                    </ul>`;
                htmlSpec = `
                    <p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the new WF is generating errors.</p>
                    <p>If compilation errors exist, system should be stopped and perform actions described.</p>`;
                htmlCheck = `
                    <p>Test the operative affected for the WF modification following the test plan.</p>
                    <p>Is advisable activate EasyWMS Web trace from ApplicationService web interface.</p>`;
                break;

            case "REPORT":
                htmlPrev = `
                    <p style="${titleStyle}">Previous Actions</p>
                    <ul>
                        <li>Check EasyB version and license in <span style="${highlight}">${serverName}</span>.</li>
                        <li>Check if Printer Service is on the server or somewhere else.</li>
                        <li>Save the new report version in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                        <li>Export old report version and save it in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                    </ul>`;
                htmlImpl = `
                    <p style="${titleStyle}">Implementation Actions</p>
                    <ul>
                        <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                        <li>From EasyB go to report screen of application <strong>${appName}</strong>.</li>
                        <li>Import the new report <strong>${objName}</strong> from C:\\TEMP\\${cNum}\\Deploy.</li>
                        <li>Take care about the new report is in Read Only status, if not, do CheckIn.</li>
                        <li>Activate the application.</li>
                        <li><strong>Restart the Printer Service.</strong></li>
                        <li>Check the PrinterService.log to verify it started properly. Check ApplicationService.log for correct compilation.</li>
                        <li>Notify using wg-OnGoingChanges Teams channel the end of the intervention.</li>
                    </ul>`;
                htmlFall = `
                    <p style="${titleStyle}">Fallback Actions</p>
                    <ul>
                        <li><strong>Option 1:</strong> Access localhost/AD > Restore previous backup.</li>
                        <li><strong>Option 2:</strong> Import the old report <strong>${objName}</strong> from C:\\TEMP\\${cNum}\\Backup. CheckIn. Activate App. Restart Printer Service.</li>
                    </ul>`;
                htmlSpec = `<p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the new report is generating errors.</p>`;
                htmlCheck = `<p>Test the operative affected for the report modification, checking that it is being showed as expected.</p>`;
                break;
                
            case "RESOURCE":
                htmlPrev = `
                    <p style="${titleStyle}">Previous Actions</p>
                    <ul>
                        <li>Copy the new resource version in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                        <li>If resource is modified, save the old version in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                    </ul>`;
                htmlImpl = `
                    <p style="${titleStyle}">Implementation Actions</p>
                    <ul>
                        <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                        <li>From EasyB go to resources screen of application <strong>${appName}</strong>.</li>
                        <li>Import resource <strong>${objName}</strong> from C:\\TEMP\\${cNum}\\Deploy OR perform Checkout, modify translation and CheckIn.</li>
                        <li>Check that it was modified and it is in read only mode.</li>
                        <li>Notify using wg-OnGoingChanges Teams channel the end of the intervention.</li>
                    </ul>`;
                htmlFall = `
                    <p style="${titleStyle}">Fallback Actions</p>
                    <ul>
                        <li><strong>Option 1:</strong> Access localhost/AD > Restore previous backup.</li>
                        <li><strong>Option 2:</strong> Define the translation of the resource as it was before the change.</li>
                    </ul>`;
                htmlSpec = `<p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the new resource is generating errors.</p>`;
                htmlCheck = `<p>Test the operative affected for the resource modification, checking that it is being showed as expected.</p>`;
                break;
        }

        const edPrev = getEditorByLabel("Previous actions");
        if (edPrev) edPrev.setData(htmlPrev);
        
        const edImpl = getEditorByLabel("Implementation actions");
        if (edImpl) edImpl.setData(htmlImpl);

        const edFall = getEditorByLabel("Fallback");
        if (edFall) edFall.setData(htmlFall);

        const edSpec = getEditorByLabel("Special attention");
        if (edSpec) edSpec.setData(htmlSpec);

        const edCheck = getEditorByLabel("Implementation check");
        if (edCheck) edCheck.setData(htmlCheck);

        const edNext = getEditorByLabel("Next actions");
        if (edNext) edNext.setData(htmlNext);
    }

    function buildUI() {
        if (document.getElementById('meca-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'meca-modal-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 10000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(2px);';

        const panel = document.createElement('div');
        panel.style.cssText = 'background: white; padding: 25px; border-radius: 8px; width: 450px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); font-family: sans-serif; position: relative;';

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '✖';
        closeBtn.style.cssText = 'position: absolute; top: 15px; right: 15px; cursor: pointer; color: #666; font-size: 16px;';
        closeBtn.onclick = () => { overlay.style.display = 'none'; };

        const title = document.createElement('h2');
        title.innerText = '🚀 Generador de Cambios ITSM';
        title.style.cssText = 'margin-top: 0; color: #0284c7; font-size: 20px; margin-bottom: 20px;';

        const inputStyle = 'width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px;';
        const labelStyle = 'font-weight: bold; font-size: 13px; color: #333; display: block; margin-bottom: 5px;';

        const formHtml = `
            <label style="${labelStyle}">1. Tipo de Cambio</label>
            <select id="meca-type" style="${inputStyle}">
                <option value="VIEW">Vista (View)</option>
                <option value="QUERY">Consulta (Query)</option>
                <option value="WF_NO_IMPACT">Workflow (Sin impacto / No detiene operativa)</option>
                <option value="WF_IMPACT">Workflow (Con impacto / Modifica datos - Requiere Parada)</option>
                <option value="REPORT">Reporte (Report)</option>
                <option value="RESOURCE">Recurso (Resource / Traducción)</option>
            </select>

            <label style="${labelStyle}">2. Nombre del Objeto Modificado</label>
            <input type="text" id="meca-obj" placeholder="Ej: Task_GenerateMovementJob_PR" style="${inputStyle}">

            <label style="${labelStyle}">3. Aplicación (EasyB)</label>
            <input type="text" id="meca-app" placeholder="Ej: TILEBAR, AghasaCustom..." style="${inputStyle}">

            <label style="${labelStyle}">4. Servidor y Entorno</label>
            <input type="text" id="meca-srv" placeholder="Ej: PRO WMS01, TEST DEVADV273-VM" style="${inputStyle}">
        `;

        const formContainer = document.createElement('div');
        formContainer.innerHTML = formHtml;

        const btnGen = document.createElement('button');
        btnGen.innerText = 'Rellenar Documentación';
        btnGen.style.cssText = 'width: 100%; padding: 10px; background-color: #10b981; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 15px; cursor: pointer; margin-top: 10px;';
        
        btnGen.onclick = () => {
            const type = document.getElementById('meca-type').value;
            const obj = document.getElementById('meca-obj').value || "[OBJETO]";
            const app = document.getElementById('meca-app').value || "[APP]";
            const srv = document.getElementById('meca-srv').value || "[SERVIDOR]";

            generateTexts(type, obj, app, srv);
            overlay.style.display = 'none';
        };

        panel.appendChild(closeBtn);
        panel.appendChild(title);
        panel.appendChild(formContainer);
        panel.appendChild(btnGen);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    function injectLauncher() {
        // Solo inyectar si la página contiene un número de Cambio (C-XXXXXX)
        const isChange = document.title.match(/(C-\d{6,})/i) || document.body.innerText.match(/(C-\d{6,})/i);
        if (!isChange) return;

        if (document.getElementById('mecalux-launcher-btn')) return;

        buildUI(); 

        const btn = document.createElement('button');
        btn.id = 'mecalux-launcher-btn';
        btn.innerHTML = '🚀 Rellenar Cambio';
        
        // ESTILO FLOTANTE FIJO (BOTTOM RIGHT)
        btn.style.cssText = 'position: fixed; bottom: 30px; right: 30px; z-index: 9997; padding: 12px 20px; background-color: #0ea5e9; color: white; border: none; border-radius: 50px; font-weight: bold; cursor: pointer; font-size: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.2s;';
        
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';

        btn.onclick = (e) => {
            e.preventDefault();
            const overlay = document.getElementById('meca-modal-overlay');
            if (overlay) overlay.style.display = 'flex';
        };

        // Lo anclamos directamente al cuerpo de la página
        document.body.appendChild(btn);
    }

    const obs = new MutationObserver(() => injectLauncher());
    obs.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', injectLauncher);
    } else {
        injectLauncher();
    }
})();