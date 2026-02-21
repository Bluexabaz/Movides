// ==UserScript==
// @name         ITSM – Advanced Public Log Templates
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Añade un selector de plantillas avanzadas al Public Log. Script aislado para pruebas.
// @match        https://itsm.mecalux.com/pages/UI.php?operation=details&class=Incident&id=*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    /*********************************
    * 1. CONFIGURACIÓN Y ESTILOS
    *********************************/
    // Estilo base para el recuadro de las comunicaciones
    const pubStyle = `background-color: #eaf3f8; padding: 15px; border-radius: 4px; border-left: 4px solid #3b82f6; font-family: sans-serif; color: #333; line-height: 1.5;`;

    // Selector donde inyectaremos el desplegable
    const EXTRA_ACTIONS_SEL = '[data-attribute-code="public_log"] .ibo-caselog-entry-form--action-buttons--extra-actions';
    const PUBLIC_WRAP_SEL = '[data-attribute-code="public_log"]';

    /*********************************
    * 2. DICCIONARIO DE PLANTILLAS
    *********************************/
    const TPL = {
        // --- SOLICITAR CONEXIÓN ---
        solicitar_conexion: `
            <div style="${pubStyle}">
                <p>Estimado/a <strong>[NOMBRE DEL CUSTOMER]</strong>,</p>
                <p>Nos ponemos en contacto con ustedes para solicitar el acceso remoto al servidor <strong>[NOMBRE DEL SERVIDOR]</strong> con el fin de revisar la issue <strong>[NÚM. DEL CASO]</strong> que nos ha comunicado [NOMBRE Y APELLIDOS DEL CALLER].</p>
                <p><strong>Detalles de la conexión:</strong></p>
                <ul>
                    <li><strong>Motivo:</strong> [BREVE EXPLICACIÓN DE LA REVISIÓN]</li>
                    <li><strong>Observaciones:</strong> [SI APLICA, INCLUIR CUALQUIER REQUERIMIENTO O ADVERTENCIA]</li>
                </ul>
                <p>Quedamos a la espera de su confirmación para acceder al servidor y revisar su caso.</p>
                <p>Gracias de antemano por su atención y colaboración.</p>
                <p>Un saludo.</p>
            </div>
        `,
        informar_conexion_sin_confirmacion: `
            <div style="${pubStyle}">
                <p>Estimado/a <strong>[NOMBRE DEL CUSTOMER]</strong>,</p>
                <p>Le informamos que procederemos a conectarnos al servidor <strong>[NOMBRE DEL SERVIDOR]</strong> para llevar a cabo la revisión de la issue <strong>[I-XXXXXX]</strong>, reportada el <strong>[FECHA DE REPORTE]</strong>.</p>
                <p><strong>Detalles de la conexión:</strong></p>
                <ul>
                    <li><strong>Motivo:</strong> [BREVE EXPLICACIÓN DE LA REVISIÓN]</li>
                    <li><strong>Observaciones:</strong> [SI APLICA, INCLUIR CUALQUIER REQUERIMIENTO O ADVERTENCIA]</li>
                </ul>
                <p>Le mantendremos informado/a sobre el avance de la revisión y cualquier acción correctiva que sea necesaria. En caso de que requiera coordinar algún detalle adicional, no dude en comunicarse con nosotros.</p>
                <p>Agradecemos su colaboración y quedamos a su disposición para cualquier consulta.</p>
            </div>
        `,

        // --- NUEVOS EJEMPLOS ---
        nuevos_ejemplos_propuesta_1: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Continuamos revisando el caso <strong>[NÚM. DEL CASO]</strong>. Hemos intentado reproducir el error sin éxito, ya que no disponemos de registros en el servidor correspondientes a esa fecha.</p>
                <p>A fin de determinar la causa raíz del problema y proceder con su corrección, necesitamos que nos proporcionen un ejemplo reciente de orden/tarea/contenedor en el se produzca dicho error.</p>
                <p>Quedamos a la espera de esta información y le agradecemos su colaboración.</p>
                <p>Un saludo.</p>
            </div>
        `,
        nuevos_ejemplos_propuesta_2: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Nos ponemos en contacto en referencia al caso <strong>[NÚM. DEL CASO]</strong>.</p>
                <p>Hasta el momento, no hemos logrado reproducir el error debido a la ausencia de registros en el servidor correspondientes a esa fecha.</p>
                <p>Para identificar y corregir el problema de manera efectiva, le agradeceríamos que nos proporcione un ejemplo reciente del mismo. Una vez recibido, podremos avanzar con la investigación del caso.</p>
                <p>Quedamos atentos a su respuesta.</p>
                <p>Agradecemos su colaboración.</p>
            </div>
        `,

        // --- SOLICITAR INFORMACIÓN ---
        solicitar_info_propuesta_1: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Nos ponemos en contacto en referencia al caso <strong>[NÚM. DEL CASO]</strong>.</p>
                <p>Con la información disponible hasta el momento, hemos logrado los siguientes avances: <strong>[EXPONER AVANCES]</strong>.</p>
                <p>Para poder continuar con su revisión e identificar la causa raíz de este ticket, requerimos que nos proporcionen más detalles sobre <strong>[EXPLICAR QUÉ NECESITAMOS: FECHA DE INICIO DEL PROBLEMA, OPERATIVA, ETC.]</strong>.</p>
                <p>Quedamos a la espera de noticias suyas y le agradecemos de antemano su tiempo y colaboración.</p>
                <p>Un saludo.</p>
            </div>
        `,
        solicitar_info_propuesta_2: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>A fin de avanzar en la resolución del caso <strong>[NÚM. DEL CASO]</strong>, requerimos de información adicional.</p>
                <p>¿Podrían, por favor, indicarnos los pasos operativos que siguen hasta que se presenta el problema? <strong>[MENCIONAR LA INFORMACIÓN ESPECÍFICA QUE SE NECESITA]</strong>.</p>
                <p>Agradecemos de antemano su colaboración y quedamos a la espera de noticias suyas.</p>
                <p>Un saludo.</p>
            </div>
        `,
        solicitar_info_propuesta_3: `
            <div style="${pubStyle}">
                <p>Buenos días,</p>
                <p>En primer lugar, rogamos disculpe nuestra insistencia respecto al caso <strong>[NÚM. DEL CASO]</strong>.</p>
                <p>Para poder continuar con la revisión de este, necesitamos que nos faciliten la información solicitada en comunicaciones anteriores.</p>
                <p>En caso de que continuemos sin tener los datos necesarios para la revisión del ticket, no tendremos más remedio que proceder con su cierre en los próximos días.</p>
                <p>Gracias de antemano por su tiempo y comprensión.</p>
            </div>
        `,

        // --- BAJO INVESTIGACIÓN ---
        bajo_investigacion_general: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Nos ponemos en contacto con ustedes para informarles de los avances producidos en la investigación del caso <strong>[NÚM. DEL CASO]</strong>.</p>
                <p>Hemos identificado <strong>[HALLAZGO RELEVANTE]</strong> y hemos llevado a cabo <strong>[ACCIÓN TOMADA]</strong>. Sin embargo, aún no hemos llegado a una conclusión final.</p>
                <p>Cualquier avance significativo que se produzca en este caso será comunicado a la mayor brevedad posible.</p>
                <p>Agradecemos de antemano su paciencia y colaboración.</p>
                <p>Un saludo.</p>
            </div>
        `,
        bajo_investigacion_pequenos_avances: `
            <div style="${pubStyle}">
                <p>Queremos informarle que continuamos analizando su caso <strong>[NÚM. DEL CASO]</strong>. Hasta el momento, hemos logrado los siguientes avances: <strong>[AVANCES]</strong>.</p>
                <p>Cualquier novedad o avance adicional que se produzca será comunicado a la mayor brevedad posible. Asimismo, no duden en ponerse en contacto con nosotros para cualquier consulta o aclaración.</p>
                <p>Agradecemos su comprensión.</p>
            </div>
        `,
        bajo_investigacion_cancelar_linea: `
            <div style="${pubStyle}">
                <p>Queremos informarle que seguimos analizando su caso <strong>[NÚM. DEL CASO]</strong>. Lamentablemente, hemos descartado la línea de investigación que estábamos siguiendo debido a <strong>[MOTIVOS]</strong>. Por este motivo, iniciaremos una nueva línea de investigación para estudiar en más profundidad <strong>[HIPÓTESIS NUEVA]</strong>.</p>
                <p>Esperamos poder comunicarles novedades y avances pronto.</p>
                <p>Muchas gracias por su compresión y colaboración.</p>
            </div>
        `,
        bajo_investigacion_no_avances_1: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Queremos informarle que seguimos analizando su caso <strong>[NÚM. DEL CASO]</strong> con detenimiento. Continúan los trabajos para encontrar una solución definitiva y se están evaluando las acciones a realizar para subsanar este caso de forma permanente.</p>
                <p>Lamentablemente, no se han producido avances significativos en la investigación pero, tenga por seguro, que estamos comprometidos a solventar esta anomalía en el sistema.</p>
                <p>Muchas gracias por su paciencia y colaboración.</p>
            </div>
        `,

        // --- DIAGNOSTICADO & REPRODUCIDO ---
        diagnosticado: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Nos ponemos en contacto con ustedes para informarles de los avances producidos en la investigación del caso <strong>[NÚM. DEL CASO]</strong>.</p>
                <p>Hemos diagnosticado la causa raíz de este ticket: <strong>[INDICAR CAUSA Y SI REQUIERE INTERVENCIÓN]</strong>.</p>
                <p>En comunicaciones posteriores, les indicaremos los pasos y acciones que hemos de realizar para solventar definitivamente este caso.</p>
                <p>Como siempre, agradecemos su paciencia y colaboración en este asunto.</p>
                <p>Reciba un cordial saludo.</p>
            </div>
        `,
        caso_reproducido: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Nos complace informarle que hemos logrado reproducir con éxito su caso <strong>[NÚM. DEL CASO]</strong> en nuestro entorno de pruebas.</p>
                <p>Durante este proceso, hemos identificado <strong>[COMPORTAMIENTO O ERROR ENCONTRADO]</strong>. A la vista de este descubrimiento, procederemos a evaluar las siguientes acciones necesarias para corregir y solventar este caso.</p>
                <p>Quedamos a su disposición para cualquier consulta adicional que pueda surgir.</p>
                <p>Reciba un cordial saludo.</p>
            </div>
        `,

        // --- ESCALADOS ---
        escalado_investigacion: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Nos gustaría informar de que el caso <strong>[NÚM. DEL CASO]</strong> ha sido escalado internamente a nuestro equipo de investigación para profundizar en el estudio del mismo, determinar su causa raíz y valorar las posibles vías para solventarlo de forma permanente.</p>
                <p>Cualquier avance relevante que se produzca en la investigación será comunicado a la mayor brevedad posible.</p>
                <p>Le agradecemos de antemano su paciencia y colaboración en este proceso.</p>
                <p>Reciba un cordial saludo.</p>
            </div>
        `,
        escalado_desarrollo: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Nos ponemos en contacto para informarle que se ha completado la investigación sobre la causa raíz del caso <strong>[NÚM. DEL CASO]</strong> y hemos observado <strong>[SITUACIÓN]</strong>. Por esto, hemos procedido a escalar este caso a nuestro equipo de desarrollo para preparar una corrección permanente y solventar así este ticket.</p>
                <p>Comunicaremos cualquier progreso que se produzca a la mayor brevedad posible.</p>
                <p>Le agradecemos de antemano su paciencia y colaboración en este proceso.</p>
                <p>Reciba un cordial saludo.</p>
            </div>
        `,
        escalado_actualizaciones_no_publicada: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Queremos notificarle que nos encontramos a la espera de la publicación de la última versión del software, lo cual nos impide, por el momento, establecer una fecha concreta para la actualización. Cualquier avance que se produzca respecto de dicha versión será comunicada a la mayor brevedad posible.</p>
                <p>Agradecemos su paciencia y colaboración.</p>
            </div>
        `,
        escalado_actualizaciones_publicada: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Nos ponemos en contacto con usted para informarle sobre el estado del caso <strong>[NÚM. DEL CASO]</strong>. Hemos determinado que la solución al problema requiere una actualización de <strong>[MAP/Binarios]</strong>.</p>
                <p>Actualmente estamos elaborando el documento con los detalles para la implementación del cambio en su entorno. En cuanto el documento esté listo, nos comunicaremos con usted para coordinar y planificar la intervención.</p>
                <p>Quedamos a su disposición para cualquier aclaración adicional.</p>
            </div>
        `,
        preparando_correccion: `
            <div style="${pubStyle}">
                <p>Buenos días/tardes,</p>
                <p>Nos gustaría informarles de que hemos identificado una solución para el caso <strong>[NÚM. DEL CASO]</strong>. En estos momentos, nuestro equipo se encuentra trabajando en el desarrollo de dicha solución, tras haber evaluado diversas alternativas para garantizar su efectividad.</p>
                <p>Una vez que la corrección esté lista para su implementación, coordinaremos con usted la planificación de su despliegue a través del correspondiente documento RFC (Request for Change).</p>
                <p>Agradecemos su paciencia y colaboración durante este proceso.</p>
            </div>
        `
    };

    /*********************************
    * 3. FUNCIONES DE APOYO (DOM & CKEditor)
    *********************************/
    // Función nativa del otro script para leer CKEditor de forma segura
    function getActivePublicEditor() {
        if (typeof CKEDITOR === 'undefined') return null;
        const wrap = document.querySelector(PUBLIC_WRAP_SEL);
        if (!wrap) return null;
        // Buscar el editor visible dentro del contenedor público
        const cke = Array.from(wrap.querySelectorAll('.cke')).find(el => !!(el && el.offsetParent));
        if (!cke) return null;
        const id = cke.id.replace(/^cke_/, '');
        return CKEDITOR.instances[id] || null;
    }

    // Comprueba si el editor está vacío o tiene solo espacios html
    function isEditorEmpty(ed) {
        const t = (ed.getData() || '')
            .replace(/<p>\s*&nbsp;\s*<\/p>/gi, '')
            .replace(/&nbsp;/gi, ' ')
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        return t.length === 0;
    }

    /*********************************
    * 4. INYECTOR DE LA INTERFAZ
    *********************************/
    function injectAdvancedTemplateSelector() {
        // Asegurarnos de que estamos en la pestaña pública
        const targetBar = document.querySelector(EXTRA_ACTIONS_SEL);
        if (!targetBar) return;

        // Si ya lo inyectamos antes, no lo duplicamos
        if (targetBar.querySelector('.itsm-adv-public-templates')) return;

        // Crear contenedor para nuestro desplegable
        const container = document.createElement('div');
        container.className = 'itsm-adv-public-templates';
        container.style.cssText = 'display: inline-flex; align-items: center; margin-left: 15px; border-left: 2px solid #ccc; padding-left: 15px;';

        const label = document.createElement('span');
        label.innerText = 'Plantillas ITSM:';
        label.style.cssText = 'font-size: 13px; font-weight: bold; color: #0284c7; margin-right: 8px;';

        const select = document.createElement('select');
        select.style.cssText = 'padding: 4px; font-size: 13px; border: 1px solid #bae6fd; border-radius: 4px; background-color: #f0f9ff; color: #0c4a6e; outline: none; cursor: pointer; max-width: 250px;';

        select.innerHTML = `
            <option value="empty">-- Seleccionar --</option>
            <optgroup label="Solicitar Conexión">
                <option value="solicitar_conexion">Pedir Confirmación</option>
                <option value="informar_conexion_sin_confirmacion">Solo Informar</option>
            </optgroup>
            <optgroup label="Nuevos Ejemplos">
                <option value="nuevos_ejemplos_propuesta_1">Propuesta 1 (Pedir ejemplo)</option>
                <option value="nuevos_ejemplos_propuesta_2">Propuesta 2 (Pedir ejemplo alt)</option>
            </optgroup>
            <optgroup label="Solicitar Información">
                <option value="solicitar_info_propuesta_1">Propuesta 1 (Con avances)</option>
                <option value="solicitar_info_propuesta_2">Propuesta 2 (Pasos operativos)</option>
                <option value="solicitar_info_propuesta_3">Propuesta 3 (Ultimátum de cierre)</option>
            </optgroup>
            <optgroup label="Bajo Investigación">
                <option value="bajo_investigacion_general">General</option>
                <option value="bajo_investigacion_pequenos_avances">Pequeños Avances</option>
                <option value="bajo_investigacion_cancelar_linea">Cancelar Línea actual</option>
                <option value="bajo_investigacion_no_avances_1">Sin Avances</option>
            </optgroup>
            <optgroup label="Estado del Caso">
                <option value="caso_reproducido">✅ Caso Reproducido</option>
                <option value="diagnosticado">🎯 Diagnosticado</option>
            </optgroup>
            <optgroup label="Escalados">
                <option value="escalado_investigacion">↗️ A Investigación</option>
                <option value="escalado_desarrollo">💻 A Desarrollo</option>
                <option value="escalado_actualizaciones_no_publicada">📦 Actualización (No publicada)</option>
                <option value="escalado_actualizaciones_publicada">📦 Actualización (Publicada)</option>
                <option value="preparando_correccion">🛠️ Preparando Corrección</option>
            </optgroup>
        `;

        // Lógica al seleccionar una opción
        select.addEventListener('change', () => {
            const val = select.value;
            if (val === 'empty') return;

            const ed = getActivePublicEditor();
            if (!ed) {
                console.warn("[ITSM-Templates] No se encontró el CKEditor activo.");
                select.value = 'empty';
                return;
            }

            // Si hay texto escrito, avisamos para no machacarlo por accidente
            if (!isEditorEmpty(ed)) {
                if (!confirm("El editor ya contiene texto. ¿Deseas reemplazarlo con la plantilla seleccionada?")) {
                    select.value = 'empty'; // Reseteamos si el usuario cancela
                    return;
                }
            }

            // Insertamos la plantilla
            if (TPL[val]) {
                ed.setData(TPL[val]);
            }

            // Devolvemos el selector a su estado inicial
            setTimeout(() => { select.value = 'empty'; }, 300);
        });

        container.appendChild(label);
        container.appendChild(select);
        targetBar.appendChild(container);
    }

    /*********************************
    * 5. OBSERVER (Para inyectar cuando cargue la página)
    *********************************/
    const observer = new MutationObserver((mutations) => {
        for (const mut of mutations) {
            if (mut.addedNodes.length) {
                // Buscamos si la barra de acciones del log público ha sido inyectada en el DOM
                const hasPublicLog = document.querySelector(EXTRA_ACTIONS_SEL);
                if (hasPublicLog) {
                    injectAdvancedTemplateSelector();
                }
            }
        }
    });

    // Iniciar el script
    function boot() {
        observer.observe(document.body, { childList: true, subtree: true });
        injectAdvancedTemplateSelector(); // Intento inicial por si ya estaba cargado
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();