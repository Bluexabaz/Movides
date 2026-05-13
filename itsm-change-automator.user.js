// ==UserScript==
// @name         ITSM - Change Templates Automator (Visual Panel)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Generador Bilingüe. Añadido paso de creación de rama GIT en Previous Actions.
// @author       Fernando González Cienfuegos
// @match        https://itsm.mecalux.com/pages/UI.php?*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
    'use strict';

    function getEditorByLabel(labelText) {
        if (typeof CKEDITOR === 'undefined') return null;
        const labels = Array.from(document.querySelectorAll('.ibo-field--label, legend, .ibo-panel--header-title, .ibo-tab-content'));
        const targetLabel = labels.find(l => l.innerText.trim().toLowerCase().includes(labelText.toLowerCase()));
        if (!targetLabel) return null;
        
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

    function generateTexts(type, objName, appName, serverName, lang) {
        const cNum = getChangeNumber();
        let htmlPrev = "", htmlImpl = "", htmlFall = "", htmlSpec = "", htmlCheck = "", htmlNext = "";

        const titleStyle = "color: #0284c7; font-weight: bold; font-size: 14px;";
        const highlight = "background-color: #fef08a; font-weight: bold;";

        const formattedObj = objName.trim().replace(/\n/g, ', ').replace(/,\s*,/g, ',');

        if (lang === 'es') {
            htmlNext = `
                <p style="${titleStyle}">ACTUALIZACIÓN EN GIT</p>
                <ul>
                    <li>Actualizar toda la documentación relacionada (Manual de retén, functional analysis, test plan...)</li>
                    <li>Desde EasyB crear un Express Deployment Package (.pck) y subirlo a la carpeta /deploy/custom/ en la ruta GIT del proyecto.</li>
                    <li>Desde EasyB exportar la aplicación en modo texto y subir los objetos modificados a la carpeta /deploy/custom/.</li>
                </ul>
                <p><em>[PEGAR CAPTURA DE GIT AQUÍ]</em></p>`;
        } else {
            htmlNext = `
                <p style="${titleStyle}">GIT UPDATE</p>
                <ul>
                    <li>Update all the related documentation (Manual de retén, functional analysis, test plan...)</li>
                    <li>From EasyB create an Expres Deployment Package (.pck) and upload to folder /deploy/custom/ in the project GIT route.</li>
                    <li>From EasyB export the application in text mode and upload to folder /deploy/custom/ with your modified objects.</li>
                </ul>
                <p><em>[PEGAR CAPTURA DE GIT AQUÍ]</em></p>`;
        }

        switch (type) {
            case "VIEW":
                if (lang === 'es') {
                    htmlPrev = `
                        <p style="${titleStyle}">Acciones Previas</p>
                        <ul>
                            <li>Comprobar versión y licencia de EasyB en <span style="${highlight}">${serverName}</span>.</li>
                            <li>Guardar la nueva versión en la carpeta <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                            <li>Exportar la versión antigua y guardarla en <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                            <li>Se crea rama en GIT del cambio basada en PRE/PRO (depende el cambio si es en pre o en pro).</li>
                        </ul>
                        <p><em>[PEGAR CAPTURAS DE CARPETAS/EASYB]</em></p>`;
                    htmlImpl = `
                        <p style="${titleStyle}">Acciones de Implementación</p>
                        <ul>
                            <li>Notificar el inicio de la intervención en <span style="${highlight}">${serverName}</span> por el canal wg-OnGoingChanges.</li>
                            <li>Desde EasyB, ir a la pantalla correspondiente de la aplicación <strong>${appName}</strong>.</li>
                            <li>Importar la nueva vista / objeto(s): <strong>${formattedObj}</strong> desde C:\\TEMP\\${cNum}\\Deploy.</li>
                            <li>Asegurarse de que queden en modo "Solo lectura" (Read Only); si no, hacer CheckIn.</li>
                            <li>Activar la aplicación.</li>
                            <li>Comprobar en el ApplicationService.log la correcta compilación.</li>
                            <li>Notificar el fin de la intervención por el canal wg-OnGoingChanges.</li>
                        </ul>
                        <p><em>[PEGAR CAPTURA DEL AS LOG]</em></p>`;
                    htmlFall = `
                        <p style="${titleStyle}">Plan de Marcha Atrás (Fallback)</p>
                        <p>Si la intervención debe revertirse en <span style="${highlight}">${serverName}</span>:</p>
                        <ul>
                            <li><strong>Opción 1 (Backup AD):</strong> Acceder a localhost/AD > pestaña Backup > Restaurar backup anterior.</li>
                            <li><strong>Opción 2 (Manual EasyB):</strong> Importar la versión antigua de <strong>${formattedObj}</strong> desde C:\\TEMP\\${cNum}\\Backup. Hacer CheckIn y Activar la aplicación.</li>
                        </ul>`;
                    htmlSpec = `<p>Revisar el <strong>ApplicationService.errors.log</strong> para detectar si se generan errores.</p>`;
                    htmlCheck = `<p>Probar la operativa afectada siguiendo el plan de pruebas acordado con el cliente.</p>`;
                } else {
                    htmlPrev = `
                        <p style="${titleStyle}">Previous Actions</p>
                        <ul>
                            <li>Check EasyB version and license in <span style="${highlight}">${serverName}</span>.</li>
                            <li>Save the new versions in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                            <li>Export old versions and save them in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                            <li>Create GIT branch of the change based on PRE/PRO (depending on whether the change is in PRE or PRO).</li>
                        </ul>
                        <p><em>[PEGAR CAPTURAS DE CARPETAS/EASYB]</em></p>`;
                    htmlImpl = `
                        <p style="${titleStyle}">Implementation Actions</p>
                        <ul>
                            <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                            <li>From EasyB go to the corresponding screen of application <strong>${appName}</strong>.</li>
                            <li>Import the new view / object(s): <strong>${formattedObj}</strong> located in folder C:\\TEMP\\${cNum}\\Deploy.</li>
                            <li>Take care about the objects being in Read Only status, if not, do CheckIn.</li>
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
                            <li><strong>Option 2 (EasyB Manual):</strong> Import the old versions of <strong>${formattedObj}</strong> located in folder C:\\TEMP\\${cNum}\\Backup. CheckIn and Activate application.</li>
                        </ul>`;
                    htmlSpec = `<p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the changes generate errors.</p>`;
                    htmlCheck = `<p>Test the operative affected following the test plan agreed with customer.</p>`;
                }
                break;

            case "QUERY":
                if (lang === 'es') {
                    htmlPrev = `
                        <p style="${titleStyle}">Acciones Previas</p>
                        <ul>
                            <li>Comprobar versión y licencia de EasyB en <span style="${highlight}">${serverName}</span>.</li>
                            <li>Guardar la nueva versión en la carpeta <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                            <li>Exportar la versión antigua y guardarla en <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                            <li>Se crea rama en GIT del cambio basada en PRE/PRO (depende el cambio si es en pre o en pro).</li>
                        </ul>
                        <p><em>[PEGAR CAPTURAS DE CARPETAS/EASYB]</em></p>`;
                    htmlImpl = `
                        <p style="${titleStyle}">Acciones de Implementación</p>
                        <ul>
                            <li>Notificar el inicio de la intervención en <span style="${highlight}">${serverName}</span> por el canal wg-OnGoingChanges.</li>
                            <li>Desde EasyB, ir a la pantalla correspondiente de la aplicación <strong>${appName}</strong>.</li>
                            <li>Importar la nueva query / objeto(s): <strong>${formattedObj}</strong> desde C:\\TEMP\\${cNum}\\Deploy.</li>
                            <li>Asegurarse de que queden en modo "Solo lectura"; si no, hacer CheckIn.</li>
                            <li>Comprobar en el ApplicationService.log la correcta compilación.</li>
                            <li>Notificar el fin de la intervención por el canal wg-OnGoingChanges.</li>
                        </ul>
                        <p><em>[PEGAR CAPTURA DEL AS LOG AQUÍ]</em></p>`;
                    htmlFall = `
                        <p style="${titleStyle}">Plan de Marcha Atrás (Fallback)</p>
                        <ul>
                            <li><strong>Opción 1:</strong> Acceder a localhost/AD > pestaña Backup > Restaurar backup anterior.</li>
                            <li><strong>Opción 2:</strong> Importar la versión antigua de <strong>${formattedObj}</strong> desde C:\\TEMP\\${cNum}\\Backup. Hacer CheckIn.</li>
                        </ul>`;
                    htmlSpec = `<p>Revisar el <strong>ApplicationService.errors.log</strong> para detectar si se generan errores.</p>`;
                    htmlCheck = `<p>Probar la operativa afectada siguiendo el plan de pruebas acordado con el cliente.</p>`;
                } else {
                    htmlPrev = `
                        <p style="${titleStyle}">Previous Actions</p>
                        <ul>
                            <li>Check EasyB version and license in <span style="${highlight}">${serverName}</span>.</li>
                            <li>Save the new versions in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                            <li>Export old versions and save them in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                            <li>Create GIT branch of the change based on PRE/PRO (depending on whether the change is in PRE or PRO).</li>
                        </ul>
                        <p><em>[PEGAR CAPTURAS DE CARPETAS/EASYB]</em></p>`;
                    htmlImpl = `
                        <p style="${titleStyle}">Implementation Actions</p>
                        <ul>
                            <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                            <li>From EasyB go to the corresponding screen of application <strong>${appName}</strong>.</li>
                            <li>Import the new query / object(s): <strong>${formattedObj}</strong> located in folder C:\\TEMP\\${cNum}\\Deploy.</li>
                            <li>Take care about the objects being in Read Only status, if not, do CheckIn.</li>
                            <li>Check in ApplicationService.log the correct compilation.</li>
                            <li>Notify using wg-OnGoingChanges Teams channel the end of the intervention.</li>
                        </ul>
                        <p><em>[PEGAR CAPTURA DEL AS LOG AQUÍ]</em></p>`;
                    htmlFall = `
                        <p style="${titleStyle}">Fallback Actions</p>
                        <ul>
                            <li><strong>Option 1:</strong> Access localhost/AD > Backup tab > Restore previous backup.</li>
                            <li><strong>Option 2:</strong> Import the old versions of <strong>${formattedObj}</strong> located in folder C:\\TEMP\\${cNum}\\Backup. CheckIn.</li>
                        </ul>`;
                    htmlSpec = `<p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the changes generate errors.</p>`;
                    htmlCheck = `<p>Test the operative affected following the test plan agreed with customer.</p>`;
                }
                break;

            case "WF_NO_IMPACT":
                if (lang === 'es') {
                    htmlPrev = `
                        <p style="${titleStyle}">Acciones Previas</p>
                        <ul>
                            <li>Comprobar versión y licencia de EasyB en <span style="${highlight}">${serverName}</span>.</li>
                            <li>Guardar las nuevas versiones en la carpeta <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                            <li>Exportar las versiones antiguas y guardarlas en <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                            <li>Se crea rama en GIT del cambio basada en PRE/PRO (depende el cambio si es en pre o en pro).</li>
                        </ul>`;
                    htmlImpl = `
                        <p style="${titleStyle}">Acciones de Implementación (Sin modificación de datos / Sin Parada)</p>
                        <ul>
                            <li>Notificar inicio de intervención en <span style="${highlight}">${serverName}</span> por el canal wg-OnGoingChanges.</li>
                            <li>[CASO ESPECIAL] Las sesiones relacionadas con Workstations o RF deben cerrarse antes de comenzar.</li>
                            <li>Desde EasyB, ir a la pantalla correspondiente de la aplicación <strong>${appName}</strong>.</li>
                            <li>Importar el nuevo WF / objeto(s): <strong>${formattedObj}</strong> desde C:\\TEMP\\${cNum}\\Deploy. Seleccionar solo los elementos a modificar.</li>
                            <li>Asegurarse de que queden en modo "Solo lectura"; si no, hacer CheckIn.</li>
                            <li>Comprobar en el ApplicationService.log la correcta compilación.</li>
                            <li>Notificar el fin de la intervención por el canal wg-OnGoingChanges.</li>
                        </ul>
                        <p><em>[PEGAR CAPTURA DEL AS LOG AQUÍ]</em></p>`;
                    htmlFall = `
                        <p style="${titleStyle}">Plan de Marcha Atrás (Fallback)</p>
                        <ul>
                            <li><strong>Opción 1:</strong> Acceder a localhost/AD > pestaña Backup > Restaurar backup anterior.</li>
                            <li><strong>Opción 2:</strong> Importar la versión antigua de <strong>${formattedObj}</strong> desde C:\\TEMP\\${cNum}\\Backup. Hacer CheckIn.</li>
                        </ul>`;
                    htmlSpec = `<p>Revisar el <strong>ApplicationService.errors.log</strong> para detectar si se generan errores.</p>`;
                    htmlCheck = `
                        <p>Probar la operativa afectada siguiendo el plan de pruebas.</p>
                        <p>Es aconsejable activar la traza web de EasyWMS (EasyWMS Web trace).</p>`;
                } else {
                    htmlPrev = `
                        <p style="${titleStyle}">Previous Actions</p>
                        <ul>
                            <li>Check EasyB version and license in <span style="${highlight}">${serverName}</span>.</li>
                            <li>Save the new versions in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                            <li>Export old versions and save them in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                            <li>Create GIT branch of the change based on PRE/PRO (depending on whether the change is in PRE or PRO).</li>
                        </ul>`;
                    htmlImpl = `
                        <p style="${titleStyle}">Implementation Actions (Without Modifying Records)</p>
                        <ul>
                            <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                            <li>[SPECIAL CASE] Sessions related to workstations or RF should be closed before starting.</li>
                            <li>From EasyB go to the corresponding screen of application <strong>${appName}</strong>.</li>
                            <li>Import the new WF / object(s): <strong>${formattedObj}</strong> located in folder C:\\TEMP\\${cNum}\\Deploy. Select only elements to modify.</li>
                            <li>Take care about the objects being in Read Only status, if not, do CheckIn.</li>
                            <li>Check in ApplicationService.log the correct compilation.</li>
                            <li>Notify using wg-OnGoingChanges Teams channel the end of the intervention.</li>
                        </ul>
                        <p><em>[PEGAR CAPTURA DEL AS LOG AQUÍ]</em></p>`;
                    htmlFall = `
                        <p style="${titleStyle}">Fallback Actions</p>
                        <ul>
                            <li><strong>Option 1:</strong> Access localhost/AD > Backup tab > Restore previous backup.</li>
                            <li><strong>Option 2:</strong> Import the old versions of <strong>${formattedObj}</strong> from C:\\TEMP\\${cNum}\\Backup. CheckIn.</li>
                        </ul>`;
                    htmlSpec = `<p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the changes generate errors.</p>`;
                    htmlCheck = `
                        <p>Test the operative affected following the test plan.</p>
                        <p>Is advisable activate EasyWMS Web trace from ApplicationService web interface.</p>`;
                }
                break;

            case "WF_IMPACT":
                if (lang === 'es') {
                    htmlPrev = `
                        <p style="${titleStyle}">Acciones Previas</p>
                        <ul>
                            <li>Comprobar versión y licencia de EasyB en <span style="${highlight}">${serverName}</span>.</li>
                            <li>Guardar las nuevas versiones en la carpeta <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                            <li>Exportar las versiones antiguas y guardarlas en <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                            <li>Se crea rama en GIT del cambio basada en PRE/PRO (depende el cambio si es en pre o en pro).</li>
                        </ul>`;
                    htmlImpl = `
                        <p style="${titleStyle}">Acciones de Implementación (Modifica Datos - Parada Requerida)</p>
                        <ul>
                            <li>Notificar inicio de intervención en <span style="${highlight}">${serverName}</span> por el canal wg-OnGoingChanges.</li>
                            <li><strong>Confirmar que la instalación está completamente parada.</strong> Debemos detener los Jobs antes de la intervención.</li>
                            <li>Desde EasyB, ir a la pantalla correspondiente de la aplicación <strong>${appName}</strong>.</li>
                            <li>Importar el nuevo WF / objeto(s): <strong>${formattedObj}</strong> desde C:\\TEMP\\${cNum}\\Deploy.</li>
                            <li>Asegurarse de que queden en modo "Solo lectura"; si no, hacer CheckIn.</li>
                            <li>Comprobar en el ApplicationService.log la correcta compilación.</li>
                            <li><strong>[CASO ERRORES / COMPILACIÓN]:</strong> Parar IIS. Borrar el directorio <em>C:\\Windows\\temp\\Mecalux</em>. Arrancar IIS.</li>
                            <li>Arrancar los Jobs. Comprobar el ApplicationService.log para asegurar que IIS arranca sin problemas.</li>
                            <li>Una vez arrancado, la instalación puede reanudar la actividad. Notificar por wg-OnGoingChanges.</li>
                        </ul>
                        <p><em>[PEGAR CAPTURA DEL AS LOG / JOBS AQUÍ]</em></p>`;
                    htmlFall = `
                        <p style="${titleStyle}">Plan de Marcha Atrás (Fallback)</p>
                        <ul>
                            <li><strong>Opción 1:</strong> Parar Jobs. Acceder a localhost/AD > Restaurar backup anterior. Arrancar Jobs de nuevo.</li>
                            <li><strong>Opción 2:</strong> Parar Jobs. Importar la versión antigua de <strong>${formattedObj}</strong> desde C:\\TEMP\\${cNum}\\Backup. Hacer CheckIn. Parar IIS > Borrar carpeta Temp > Arrancar IIS > Arrancar Jobs.</li>
                        </ul>`;
                    htmlSpec = `
                        <p>Revisar el <strong>ApplicationService.errors.log</strong> para detectar si se generan errores.</p>
                        <p>Si existen errores de compilación, el sistema debe pararse y realizar las acciones descritas (limpieza de Temp e IIS).</p>`;
                    htmlCheck = `
                        <p>Probar la operativa afectada siguiendo el plan de pruebas.</p>
                        <p>Es aconsejable activar la traza web de EasyWMS (EasyWMS Web trace).</p>`;
                } else {
                    htmlPrev = `
                        <p style="${titleStyle}">Previous Actions</p>
                        <ul>
                            <li>Check EasyB version and license in <span style="${highlight}">${serverName}</span>.</li>
                            <li>Save the new versions in folder <strong>C:\\TEMP\\${cNum}\\Deploy</strong>.</li>
                            <li>Export old versions and save them in folder <strong>C:\\TEMP\\${cNum}\\Backup</strong>.</li>
                            <li>Create GIT branch of the change based on PRE/PRO (depending on whether the change is in PRE or PRO).</li>
                        </ul>`;
                    htmlImpl = `
                        <p style="${titleStyle}">Implementation Actions (Modifying Records - Stop Facility)</p>
                        <ul>
                            <li>Notify using wg-OnGoingChanges Teams channel the start of the intervention in <span style="${highlight}">${serverName}</span>.</li>
                            <li><strong>Confirm that the facility is completely stopped.</strong> We need to stop the jobs before the intervention.</li>
                            <li>From EasyB go to the corresponding screen of application <strong>${appName}</strong>.</li>
                            <li>Import the new WF / object(s): <strong>${formattedObj}</strong> located in folder C:\\TEMP\\${cNum}\\Deploy.</li>
                            <li>Take care about the objects being in Read Only status, if not, do CheckIn.</li>
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
                            <li><strong>Option 2:</strong> Stop jobs. Import the old versions of <strong>${formattedObj}</strong> from C:\\TEMP\\${cNum}\\Backup. CheckIn. Stop IIS > Remove Temp > Start IIS > Start jobs.</li>
                        </ul>`;
                    htmlSpec = `
                        <p>Check the <strong>ApplicationService.errors.log</strong> in order to detect if the changes generate errors.</p>
                        <p>If compilation errors exist, system should be stopped and perform actions described.</p>`;
                    htmlCheck = `
                        <p>Test the operative affected following the test plan.</p>
                        <p>Is advisable activate EasyWMS Web trace from ApplicationService web interface.</p>`;
                }
                break;

            case "REPORT":
            case "RESOURCE":
                if (lang === 'es') {
                    htmlPrev = `<p style="${titleStyle}">Acciones Previas</p><ul><li>Preparar los objetos: <strong>${formattedObj}</strong> en C:\\TEMP\\${cNum}.</li><li>Se crea rama en GIT del cambio basada en PRE/PRO (depende el cambio si es en pre o en pro).</li></ul>`;
                    htmlImpl = `<p style="${titleStyle}">Acciones de Implementación</p><ul><li>Importar <strong>${formattedObj}</strong> en ${appName} sobre el servidor <span style="${highlight}">${serverName}</span>.</li></ul>`;
                    htmlFall = `<p style="${titleStyle}">Plan de Marcha Atrás</p><ul><li>Restaurar versiones anteriores de <strong>${formattedObj}</strong>.</li></ul>`;
                    htmlSpec = `<p>Comprobar errores.</p>`;
                    htmlCheck = `<p>Validar el funcionamiento.</p>`;
                } else {
                    htmlPrev = `<p style="${titleStyle}">Previous Actions</p><ul><li>Prepare objects: <strong>${formattedObj}</strong> in C:\\TEMP\\${cNum}.</li><li>Create GIT branch of the change based on PRE/PRO (depending on whether the change is in PRE or PRO).</li></ul>`;
                    htmlImpl = `<p style="${titleStyle}">Implementation Actions</p><ul><li>Import <strong>${formattedObj}</strong> in ${appName} on server <span style="${highlight}">${serverName}</span>.</li></ul>`;
                    htmlFall = `<p style="${titleStyle}">Fallback Actions</p><ul><li>Restore previous versions of <strong>${formattedObj}</strong>.</li></ul>`;
                    htmlSpec = `<p>Check for errors.</p>`;
                    htmlCheck = `<p>Validate functionality.</p>`;
                }
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

        const savedLang = localStorage.getItem('meca_change_lang') || 'es';

        const formHtml = `
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <div style="flex: 1;">
                    <label style="${labelStyle}">🌍 Idioma / Language</label>
                    <select id="meca-lang" style="${inputStyle}; margin-bottom: 0;">
                        <option value="es" ${savedLang === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
                        <option value="en" ${savedLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                    </select>
                </div>
            </div>

            <label style="${labelStyle}">1. Tipo de Cambio (Modelo principal a seguir)</label>
            <select id="meca-type" style="${inputStyle}">
                <option value="VIEW">Vista (View)</option>
                <option value="QUERY">Consulta (Query)</option>
                <option value="WF_NO_IMPACT">Workflow (Sin impacto / No detiene operativa)</option>
                <option value="WF_IMPACT">Workflow (Con impacto / Modifica datos - Requiere Parada)</option>
                <option value="REPORT">Reporte (Report)</option>
                <option value="RESOURCE">Recurso (Resource / Traducción)</option>
            </select>

            <label style="${labelStyle}">2. Nombre del Objeto(s) Modificado(s)</label>
            <textarea id="meca-obj" rows="2" placeholder="Ej: Task_GenerateMovementJob_PR\nView_Inventory_PR" style="${inputStyle} resize: vertical;"></textarea>

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
            const lang = document.getElementById('meca-lang').value;
            const type = document.getElementById('meca-type').value;
            const obj = document.getElementById('meca-obj').value || "[OBJETO]";
            const app = document.getElementById('meca-app').value || "[APP]";
            const srv = document.getElementById('meca-srv').value || "[SERVIDOR]";

            localStorage.setItem('meca_change_lang', lang);

            generateTexts(type, obj, app, srv, lang);
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
        const isChange = document.title.match(/(C-\d{6,})/i) || document.body.innerText.match(/(C-\d{6,})/i);
        if (!isChange) return;

        if (document.getElementById('mecalux-launcher-btn')) return;

        buildUI(); 

        const btn = document.createElement('button');
        btn.id = 'mecalux-launcher-btn';
        btn.innerHTML = '🚀 Rellenar Cambio';
        
        btn.style.cssText = 'position: fixed; bottom: 30px; right: 30px; z-index: 9997; padding: 12px 20px; background-color: #0ea5e9; color: white; border: none; border-radius: 50px; font-weight: bold; cursor: pointer; font-size: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.2s;';
        
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';

        btn.onclick = (e) => {
            e.preventDefault();
            const overlay = document.getElementById('meca-modal-overlay');
            if (overlay) overlay.style.display = 'flex';
        };

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