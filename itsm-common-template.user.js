// ==UserScript==
// @name         ITSM – Common Template (Multilanguage)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Selector de plantillas (Common Template). Inyección magnética inteligente compatible con script TL.
// @author       Fernando González Cienfuegos
// @match        https://itsm.mecalux.com/pages/UI.php?*
// @updateURL    https://raw.githubusercontent.com/Bluexabaz/Movides/main/itsm-common-template.user.js
// @downloadURL  https://raw.githubusercontent.com/Bluexabaz/Movides/main/itsm-common-template.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
    'use strict';

    /*********************************
    * 1. CONFIGURACIÓN Y ESTILOS
    *********************************/
    const pubStyle = `background-color: #eaf3f8; padding: 15px; border-radius: 4px; border-left: 4px solid #3b82f6; font-family: sans-serif; color: #333; line-height: 1.5;`;
    const PUBLIC_WRAP_SEL = '[data-attribute-code="public_log"]';
    const LANG_KEY = 'itsm_publiclog_lang';

    /*********************************
    * 2. DICCIONARIO DE PLANTILLAS
    *********************************/
    const TPL = {
        es: {
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
                </div>`,
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
                </div>`,
            nuevos_ejemplos_propuesta_1: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Continuamos revisando el caso <strong>[NÚM. DEL CASO]</strong>. Hemos intentado reproducir el error sin éxito, ya que no disponemos de registros en el servidor correspondientes a esa fecha.</p>
                    <p>A fin de determinar la causa raíz del problema y proceder con su corrección, necesitamos que nos proporcionen un ejemplo reciente de orden/tarea/contenedor en el que se produzca dicho error.</p>
                    <p>Quedamos a la espera de esta información y le agradecemos su colaboración.</p>
                    <p>Un saludo.</p>
                </div>`,
            nuevos_ejemplos_propuesta_2: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Nos ponemos en contacto en referencia al caso <strong>[NÚM. DEL CASO]</strong>.</p>
                    <p>Hasta el momento, no hemos logrado reproducir el error debido a la ausencia de registros en el servidor correspondientes a esa fecha.</p>
                    <p>Para identificar y corregir el problema de manera efectiva, le agradeceríamos que nos proporcione un ejemplo reciente del mismo. Una vez recibido, podremos avanzar con la investigación del caso.</p>
                    <p>Quedamos atentos a su respuesta.</p>
                    <p>Agradecemos su colaboración.</p>
                </div>`,
            solicitar_info_propuesta_1: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Nos ponemos en contacto en referencia al caso <strong>[NÚM. DEL CASO]</strong>.</p>
                    <p>Con la información disponible hasta el momento, hemos logrado los siguientes avances: <strong>[EXPONER AVANCES]</strong>.</p>
                    <p>Para poder continuar con su revisión e identificar la causa raíz de este ticket, requerimos que nos proporcionen más detalles sobre <strong>[EXPLICAR QUÉ NECESITAMOS: FECHA DE INICIO DEL PROBLEMA, OPERATIVA, ETC.]</strong>.</p>
                    <p>Quedamos a la espera de noticias suyas y le agradecemos de antemano su tiempo y colaboración.</p>
                    <p>Un saludo.</p>
                </div>`,
            solicitar_info_propuesta_2: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>A fin de avanzar en la resolución del caso <strong>[NÚM. DEL CASO]</strong>, requerimos de información adicional.</p>
                    <p>¿Podrían, por favor, indicarnos los pasos operativos que siguen hasta que se presenta el problema? <strong>[MENCIONAR LA INFORMACIÓN ESPECÍFICA QUE SE NECESITA]</strong>.</p>
                    <p>Agradecemos de antemano su colaboración y quedamos a la espera de noticias suyas.</p>
                    <p>Un saludo.</p>
                </div>`,
            solicitar_info_propuesta_3: `
                <div style="${pubStyle}">
                    <p>Buenos días,</p>
                    <p>En primer lugar, rogamos disculpe nuestra insistencia respecto al caso <strong>[NÚM. DEL CASO]</strong>.</p>
                    <p>Para poder continuar con la revisión de este, necesitamos que nos faciliten la información solicitada en comunicaciones anteriores.</p>
                    <p>En caso de que continuemos sin tener los datos necesarios para la revisión del ticket, no tendremos más remedio que proceder con su cierre en los próximos días.</p>
                    <p>Gracias de antemano por su tiempo y comprensión.</p>
                </div>`,
            bajo_investigacion_general: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Nos ponemos en contacto con ustedes para informarles de los avances producidos en la investigación del caso <strong>[NÚM. DEL CASO]</strong>.</p>
                    <p>Hemos identificado <strong>[HALLAZGO RELEVANTE]</strong> y hemos llevado a cabo <strong>[ACCIÓN TOMADA]</strong>. Sin embargo, aún no hemos llegado a una conclusión final.</p>
                    <p>Cualquier avance significativo que se produzca en este caso será comunicado a la mayor brevedad posible.</p>
                    <p>Agradecemos de antemano su paciencia y colaboración.</p>
                    <p>Un saludo.</p>
                </div>`,
            bajo_investigacion_pequenos_avances: `
                <div style="${pubStyle}">
                    <p>Queremos informarle que continuamos analizando su caso <strong>[NÚM. DEL CASO]</strong>. Hasta el momento, hemos logrado los siguientes avances: <strong>[AVANCES]</strong>.</p>
                    <p>Cualquier novedad o avance adicional que se produzca será comunicado a la mayor brevedad posible. Asimismo, no duden en ponerse en contacto con nosotros para cualquier consulta o aclaración.</p>
                    <p>Agradecemos su comprensión.</p>
                </div>`,
            bajo_investigacion_cancelar_linea: `
                <div style="${pubStyle}">
                    <p>Queremos informarle que seguimos analizando su caso <strong>[NÚM. DEL CASO]</strong>. Lamentablemente, hemos descartado la línea de investigación que estábamos siguiendo debido a <strong>[MOTIVOS]</strong>. Por este motivo, iniciaremos una nueva línea de investigación para estudiar en más profundidad <strong>[HIPÓTESIS NUEVA]</strong>.</p>
                    <p>Esperamos poder comunicarles novedades y avances pronto.</p>
                    <p>Muchas gracias por su compresión y colaboración.</p>
                </div>`,
            bajo_investigacion_no_avances_1: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Queremos informarle que seguimos analizando su caso <strong>[NÚM. DEL CASO]</strong> con detenimiento. Continúan los trabajos para encontrar una solución definitiva y se están evaluando las acciones a realizar para subsanar este caso de forma permanente.</p>
                    <p>Lamentablemente, no se han producido avances significativos en la investigación pero, tenga por seguro, que estamos comprometidos a solventar esta anomalía en el sistema.</p>
                    <p>Muchas gracias por su paciencia y colaboración.</p>
                </div>`,
            caso_reproducido: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Nos complace informarle que hemos logrado reproducir con éxito su caso <strong>[NÚM. DEL CASO]</strong> en nuestro entorno de pruebas.</p>
                    <p>Durante este proceso, hemos identificado <strong>[COMPORTAMIENTO O ERROR ENCONTRADO]</strong>. A la vista de este descubrimiento, procederemos a evaluar las siguientes acciones necesarias para corregir y solventar este caso.</p>
                    <p>Quedamos a su disposición para cualquier consulta adicional que pueda surgir.</p>
                    <p>Reciba un cordial saludo.</p>
                </div>`,
            diagnosticado: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Nos ponemos en contacto con ustedes para informarles de los avances producidos en la investigación del caso <strong>[NÚM. DEL CASO]</strong>.</p>
                    <p>Hemos diagnosticado la causa raíz de este ticket: <strong>[INDICAR CAUSA Y SI REQUIERE INTERVENCIÓN]</strong>.</p>
                    <p>En comunicaciones posteriores, les indicaremos los pasos y acciones que hemos de realizar para solventar definitivamente este caso.</p>
                    <p>Como siempre, agradecemos su paciencia y colaboración en este asunto.</p>
                    <p>Reciba un cordial saludo.</p>
                </div>`,
            escalado_investigacion: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Nos gustaría informar de que el caso <strong>[NÚM. DEL CASO]</strong> ha sido escalado internamente a nuestro equipo de investigación para profundizar en el estudio del mismo, determinar su causa raíz y valorar las posibles vías para solventarlo de forma permanente.</p>
                    <p>Cualquier avance relevante que se produzca en la investigación será comunicado a la mayor brevedad posible.</p>
                    <p>Le agradecemos de antemano su paciencia y colaboración en este proceso.</p>
                    <p>Reciba un cordial saludo.</p>
                </div>`,
            escalado_desarrollo: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Nos ponemos en contacto para informarle que se ha completado la investigación sobre la causa raíz del caso <strong>[NÚM. DEL CASO]</strong> y hemos observado <strong>[SITUACIÓN]</strong>. Por esto, hemos procedido a escalar este caso a nuestro equipo de desarrollo para preparar una corrección permanente y solventar así este ticket.</p>
                    <p>Comunicaremos cualquier progreso que se produzca a la mayor brevedad posible.</p>
                    <p>Le agradecemos de antemano su paciencia y colaboración en este proceso.</p>
                    <p>Reciba un cordial saludo.</p>
                </div>`,
            escalado_actualizaciones_no_publicada: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Queremos notificarle que nos encontramos a la espera de la publicación de la última versión del software, lo cual nos impide, por el momento, establecer una fecha concreta para la actualización. Cualquier avance que se produzca respecto de dicha versión será comunicada a la mayor brevedad posible.</p>
                    <p>Agradecemos su paciencia y colaboración.</p>
                </div>`,
            escalado_actualizaciones_publicada: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Nos ponemos en contacto con usted para informarle sobre el estado del caso <strong>[NÚM. DEL CASO]</strong>. Hemos determinado que la solución al problema requiere una actualización de <strong>[MAP/Binarios]</strong>.</p>
                    <p>Actualmente estamos elaborando el documento con los detalles para la implementación del cambio en su entorno. En cuanto el documento esté listo, nos comunicaremos con usted para coordinar y planificar la intervención.</p>
                    <p>Quedamos a su disposición para cualquier aclaración adicional.</p>
                </div>`,
            preparando_correccion: `
                <div style="${pubStyle}">
                    <p>Buenos días/tardes,</p>
                    <p>Nos gustaría informarles de que hemos identificado una solución para el caso <strong>[NÚM. DEL CASO]</strong>. En estos momentos, nuestro equipo se encuentra trabajando en el desarrollo de dicha solución, tras haber evaluado diversas alternativas para garantizar su efectividad.</p>
                    <p>Una vez que la corrección esté lista para su implementación, coordinaremos con usted la planificación de su despliegue a través del correspondiente documento RFC (Request for Change).</p>
                    <p>Agradecemos su paciencia y colaboración durante este proceso.</p>
                </div>`
        },
        en: {
            solicitar_conexion: `
                <div style="${pubStyle}">
                    <p>Dear <strong>[CUSTOMER NAME]</strong>,</p>
                    <p>We are contacting you to request remote access to the <strong>[SERVER NAME]</strong> server in order to review the issue <strong>[CASE NUMBER]</strong> reported by [CALLER NAME].</p>
                    <p><strong>Connection details:</strong></p>
                    <ul>
                        <li><strong>Reason:</strong> [BRIEF EXPLANATION OF THE REVIEW]</li>
                        <li><strong>Remarks:</strong> [IF APPLICABLE, INCLUDE ANY REQUIREMENT OR WARNING]</li>
                    </ul>
                    <p>We await your confirmation to access the server and review your case.</p>
                    <p>Thank you in advance for your attention and cooperation.</p>
                    <p>Best regards.</p>
                </div>`,
            informar_conexion_sin_confirmacion: `
                <div style="${pubStyle}">
                    <p>Dear <strong>[CUSTOMER NAME]</strong>,</p>
                    <p>We would like to inform you that we will be connecting to the <strong>[SERVER NAME]</strong> server to carry out the review of the issue <strong>[I-XXXXXX]</strong>, reported on <strong>[REPORT DATE]</strong>.</p>
                    <p><strong>Connection details:</strong></p>
                    <ul>
                        <li><strong>Reason:</strong> [BRIEF EXPLANATION OF THE REVIEW]</li>
                        <li><strong>Remarks:</strong> [IF APPLICABLE, INCLUDE ANY REQUIREMENT OR WARNING]</li>
                    </ul>
                    <p>We will keep you informed about the progress of the review and any corrective actions that may be necessary. Should you need to coordinate any additional details, please do not hesitate to contact us.</p>
                    <p>We appreciate your cooperation and remain at your disposal for any queries.</p>
                </div>`,
            nuevos_ejemplos_propuesta_1: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We continue reviewing the issue <strong>[CASE NUMBER]</strong>. We have tried to reproduce the error without success, as we do not have server logs corresponding to that date.</p>
                    <p>In order to determine the root cause of the problem and proceed with its correction, we need you to provide a recent example of an order/task/container where this error occurs.</p>
                    <p>We await this information and thank you for your cooperation.</p>
                    <p>Best regards.</p>
                </div>`,
            nuevos_ejemplos_propuesta_2: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We are contacting you regarding the issue <strong>[CASE NUMBER]</strong>.</p>
                    <p>So far, we have not been able to reproduce the error due to the lack of server logs corresponding to that date.</p>
                    <p>To identify and effectively correct the problem, we would appreciate it if you could provide a recent example of it. Once received, we will be able to move forward with the investigation of the case.</p>
                    <p>We look forward to hearing from you.</p>
                    <p>Thank you for your cooperation.</p>
                </div>`,
            solicitar_info_propuesta_1: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We are contacting you regarding the issue <strong>[CASE NUMBER]</strong>.</p>
                    <p>With the information available so far, we have made the following progress: <strong>[STATE PROGRESS]</strong>.</p>
                    <p>In order to continue with our review and identify the root cause of this ticket, we require you to provide more details regarding <strong>[EXPLAIN WHAT WE NEED: START DATE OF THE PROBLEM, OPERATIONS, ETC.]</strong>.</p>
                    <p>We look forward to hearing from you and thank you in advance for your time and cooperation.</p>
                    <p>Best regards.</p>
                </div>`,
            solicitar_info_propuesta_2: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>In order to advance the resolution of the issue <strong>[CASE NUMBER]</strong>, we require some additional information.</p>
                    <p>Could you please indicate the operational steps you follow until the problem occurs? <strong>[MENTION THE SPECIFIC INFORMATION NEEDED]</strong>.</p>
                    <p>We thank you in advance for your cooperation and look forward to hearing from you.</p>
                    <p>Best regards.</p>
                </div>`,
            solicitar_info_propuesta_3: `
                <div style="${pubStyle}">
                    <p>Good morning,</p>
                    <p>First of all, please excuse our insistence regarding the issue <strong>[CASE NUMBER]</strong>.</p>
                    <p>In order to continue with the review, we need you to provide the information requested in previous communications.</p>
                    <p>If we continue without having the necessary data to review the ticket, we will have no choice but to proceed with its closure in the coming days.</p>
                    <p>Thank you in advance for your time and understanding.</p>
                </div>`,
            bajo_investigacion_general: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We are contacting you to inform you of the progress made in the investigation of the issue <strong>[CASE NUMBER]</strong>.</p>
                    <p>We have identified <strong>[RELEVANT FINDING]</strong> and we have carried out <strong>[ACTION TAKEN]</strong>. However, we have not yet reached a final conclusion.</p>
                    <p>Any significant progress that occurs in this case will be communicated as soon as possible.</p>
                    <p>We thank you in advance for your patience and cooperation.</p>
                    <p>Best regards.</p>
                </div>`,
            bajo_investigacion_pequenos_avances: `
                <div style="${pubStyle}">
                    <p>We would like to inform you that we continue analyzing your issue <strong>[CASE NUMBER]</strong>. So far, we have achieved the following progress: <strong>[PROGRESS]</strong>.</p>
                    <p>Any further news or progress will be communicated as soon as possible. Also, please do not hesitate to contact us for any query or clarification.</p>
                    <p>We appreciate your understanding.</p>
                </div>`,
            bajo_investigacion_cancelar_linea: `
                <div style="${pubStyle}">
                    <p>We would like to inform you that we continue analyzing your issue <strong>[CASE NUMBER]</strong>. Unfortunately, we have discarded the line of investigation we were following due to <strong>[REASONS]</strong>. For this reason, we will start a new line of investigation to study in more depth <strong>[NEW HYPOTHESIS]</strong>.</p>
                    <p>We hope to be able to communicate news and progress soon.</p>
                    <p>Thank you very much for your understanding and cooperation.</p>
                </div>`,
            bajo_investigacion_no_avances_1: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We would like to inform you that we are still carefully analyzing your issue <strong>[CASE NUMBER]</strong>. Work continues to find a definitive solution, and we are evaluating the actions to take to permanently resolve this.</p>
                    <p>Unfortunately, there has been no significant progress in the investigation, but rest assured that we are committed to solving this anomaly in the system.</p>
                    <p>Thank you very much for your patience and cooperation.</p>
                </div>`,
            caso_reproducido: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We are pleased to inform you that we have successfully reproduced your issue <strong>[CASE NUMBER]</strong> in our test environment.</p>
                    <p>During this process, we have identified <strong>[BEHAVIOR OR ERROR FOUND]</strong>. In light of this discovery, we will proceed to evaluate the next actions required to correct and resolve this case.</p>
                    <p>We remain at your disposal for any further queries that may arise.</p>
                    <p>Best regards.</p>
                </div>`,
            diagnosticado: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We are contacting you to inform you of the progress made in the investigation of the issue <strong>[CASE NUMBER]</strong>.</p>
                    <p>We have diagnosed the root cause of this ticket: <strong>[INDICATE CAUSE AND WHETHER IT REQUIRES INTERVENTION]</strong>.</p>
                    <p>In subsequent communications, we will indicate the steps and actions we must take to definitively resolve this case.</p>
                    <p>As always, we appreciate your patience and cooperation in this matter.</p>
                    <p>Best regards.</p>
                </div>`,
            escalado_investigacion: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We would like to inform you that the issue <strong>[CASE NUMBER]</strong> has been escalated internally to our research team to deepen its study, determine its root cause, and evaluate possible ways to resolve it permanently.</p>
                    <p>Any relevant progress that occurs in the investigation will be communicated as soon as possible.</p>
                    <p>We thank you in advance for your patience and cooperation in this process.</p>
                    <p>Best regards.</p>
                </div>`,
            escalado_desarrollo: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We are contacting you to inform you that the investigation into the root cause of the issue <strong>[CASE NUMBER]</strong> has been completed and we have observed <strong>[SITUATION]</strong>. Therefore, we have proceeded to escalate this case to our development team to prepare a permanent fix and thus resolve this ticket.</p>
                    <p>We will communicate any progress that occurs as soon as possible.</p>
                    <p>We thank you in advance for your patience and cooperation in this process.</p>
                    <p>Best regards.</p>
                </div>`,
            escalado_actualizaciones_no_publicada: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We would like to notify you that we are currently waiting for the release of the latest software version, which prevents us, for the moment, from establishing a specific date for the update. Any progress that occurs regarding said version will be communicated as soon as possible.</p>
                    <p>We appreciate your patience and cooperation.</p>
                </div>`,
            escalado_actualizaciones_publicada: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We are contacting you to inform you about the status of the issue <strong>[CASE NUMBER]</strong>. We have determined that the solution to the problem requires an update of <strong>[MAP/Binaries]</strong>.</p>
                    <p>We are currently preparing the document with the details for the implementation of the change in your environment. As soon as the document is ready, we will contact you to coordinate and plan the intervention.</p>
                    <p>We remain at your disposal for any further clarification.</p>
                </div>`,
            preparando_correccion: `
                <div style="${pubStyle}">
                    <p>Good morning/afternoon,</p>
                    <p>We would like to inform you that we have identified a solution for the issue <strong>[CASE NUMBER]</strong>. Currently, our team is working on the development of this solution, having evaluated various alternatives to ensure its effectiveness.</p>
                    <p>Once the fix is ready for implementation, we will coordinate the planning of its deployment with you through the corresponding RFC (Request for Change) document.</p>
                    <p>We appreciate your patience and cooperation during this process.</p>
                </div>`
        }
    };

    /*********************************
    * 3. LÓGICA CORE
    *********************************/
    function getLang() {
        const saved = localStorage.getItem(LANG_KEY);
        return (saved === 'en' || saved === 'es') ? saved : 'es';
    }

    function setLang(lang) {
        localStorage.setItem(LANG_KEY, lang);
    }

    function getActiveEditor() {
        if (typeof CKEDITOR === 'undefined') return null;
        const cke = Array.from(document.querySelectorAll('.cke')).find(el => !!(el && el.offsetParent));
        if (!cke) return null;
        const id = cke.id.replace(/^cke_/, '');
        return CKEDITOR.instances[id] || null;
    }

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
    * 4. INYECCIÓN INTELIGENTE
    *********************************/
    function injectUI() {
        let container = document.querySelector('.itsm-adv-public-templates');

        // Miramos en qué pantalla estamos
        const isPublicLog = !!document.querySelector('[data-attribute-code="public_log"]');
        const isFirstContact = !!document.querySelector('.itsm-firstcontact-controls') || !!document.querySelector('[data-attribute-code="first_contact_reason"]');

        let targetHost = null;
        let insertMode = '';

        if (isPublicLog) {
            // EN PUBLIC LOG: Lo quieres a la derecha del todo (A la izquierda del botón Cancel)
            const publicMainActions = document.querySelector('[data-attribute-code="public_log"] .ibo-caselog-entry-form--action-buttons--main-actions');
            if (publicMainActions) {
                targetHost = publicMainActions;
                insertMode = 'public_right';
            }
        } else if (isFirstContact) {
            // EN FIRST CONTACT: Lo quieres pegado al botón del TL ("Insert Call Template")
            const tlFlexContainer = document.querySelector('.itsm-firstcontact-controls .itsm-publiclog-controls');
            const tlGenericContainer = document.querySelector('.itsm-firstcontact-controls');

            if (tlFlexContainer) {
                targetHost = tlFlexContainer;
                insertMode = 'fc_next_to_btn';
            } else if (tlGenericContainer) {
                targetHost = tlGenericContainer;
                insertMode = 'fc_next_to_btn';
            }
        }

        // Si la pantalla ha cargado rápido pero el TL aún no, lo ponemos encima del editor de forma segura temporalmente
        if (!targetHost) {
            const visibleEditor = Array.from(document.querySelectorAll('.cke')).find(el => !!(el && el.offsetParent));
            if (visibleEditor) {
                targetHost = visibleEditor.parentNode;
                insertMode = 'fallback';
            } else {
                return;
            }
        }

        // --- SISTEMA AUTOCORRECTOR: Si ya existe el contenedor pero está en el sitio equivocado (por la carrera de scripts), lo reubica ---
        if (container) {
            if (insertMode === 'public_right' && container.parentNode !== targetHost) {
                targetHost.insertBefore(container, targetHost.firstChild);
                container.style.cssText = 'display: inline-flex; align-items: center; margin-right: 15px; padding-right: 15px; border-right: 2px solid #ccc; gap: 8px;';
            } else if (insertMode === 'fc_next_to_btn' && container.parentNode !== targetHost) {
                targetHost.appendChild(container); // Lo manda a la derecha del botón del TL
                container.style.cssText = 'display: inline-flex; align-items: center; margin-left: 15px; padding-left: 15px; border-left: 2px solid #ccc; gap: 8px;';
            } else if (insertMode === 'fallback' && container.parentNode !== targetHost) {
                targetHost.insertBefore(container, targetHost.querySelector('.cke'));
                container.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 6px; background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px;';
            }
            return; // Ya existe y ha sido reubicado correctamente, salimos
        }

        // --- CREACIÓN DEL CONTENEDOR DESDE CERO ---
        container = document.createElement('div');
        container.className = 'itsm-adv-public-templates';

        const langSelect = document.createElement('select');
        langSelect.style.cssText = 'padding: 4px; font-size: 12px; border: 1px solid #94a3b8; border-radius: 4px; background-color: #f8fafc; cursor: pointer; font-weight: bold; height: 28px;';
        langSelect.innerHTML = `<option value="es">ES</option><option value="en">EN</option>`;
        langSelect.value = getLang();
        langSelect.addEventListener('change', () => setLang(langSelect.value));

        const label = document.createElement('span');
        label.innerText = 'Common Template:';
        label.style.cssText = 'font-size: 13px; font-weight: bold; color: #0284c7;';

        const select = document.createElement('select');
        select.style.cssText = 'padding: 4px; font-size: 13px; border: 1px solid #bae6fd; border-radius: 4px; background-color: #f0f9ff; color: #0c4a6e; outline: none; cursor: pointer; max-width: 250px; height: 28px;';

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

        select.addEventListener('change', () => {
            const val = select.value;
            if (val === 'empty') return;
            const ed = getActiveEditor();
            if (!ed) { select.value = 'empty'; return; }

            if (!isEditorEmpty(ed)) {
                if (!confirm("El editor ya contiene texto. ¿Deseas reemplazarlo con la plantilla seleccionada?")) {
                    select.value = 'empty';
                    return;
                }
            }

            const currentLang = langSelect.value;
            if (TPL[currentLang] && TPL[currentLang][val]) {
                ed.setData(TPL[currentLang][val]);
            }
            setTimeout(() => { select.value = 'empty'; }, 300);
        });

        container.appendChild(label);
        container.appendChild(langSelect);
        container.appendChild(select);

        // Aplicamos la inyección final y el estilo dependiendo de dónde lo vamos a meter
        if (insertMode === 'public_right') {
            container.style.cssText = 'display: inline-flex; align-items: center; margin-right: 15px; padding-right: 15px; border-right: 2px solid #ccc; gap: 8px;';
            targetHost.insertBefore(container, targetHost.firstChild);
        } else if (insertMode === 'fc_next_to_btn') {
            container.style.cssText = 'display: inline-flex; align-items: center; margin-left: 15px; padding-left: 15px; border-left: 2px solid #ccc; gap: 8px;';
            targetHost.appendChild(container);
        } else {
            container.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 6px; background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px;';
            targetHost.insertBefore(container, targetHost.querySelector('.cke'));
        }
    }

    /*********************************
    * 5. MOTOR DE OBSERVACIÓN
    *********************************/
    function bindEditors() {
        if (typeof CKEDITOR === 'undefined') return;

        if (!CKEDITOR.__itsm_adv_tpl_hooked) {
            CKEDITOR.on('instanceReady', () => injectUI());
            CKEDITOR.__itsm_adv_tpl_hooked = true;
        }
        injectUI();
    }

    // El observador ahora reacciona si el script del TL inyecta algo nuevo, para revisar y corregir si es necesario
    const obs = new MutationObserver((muts) => {
        let shouldCheck = false;
        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.nodeType !== 1) continue;
                if (
                    n.id?.startsWith?.('cke_') || n.querySelector?.('[id^="cke_"]') ||
                    n.matches?.(PUBLIC_WRAP_SEL) || n.querySelector?.(PUBLIC_WRAP_SEL) ||
                    n.matches?.('.itsm-firstcontact-controls') || n.querySelector?.('.itsm-firstcontact-controls') ||
                    n.matches?.('.itsm-publiclog-controls') || n.querySelector?.('.itsm-publiclog-controls')
                ) { shouldCheck = true; break; }
            }
            if (shouldCheck) break;
        }
        if (shouldCheck) bindEditors();
    });

    function boot() {
        obs.observe(document.body, { childList: true, subtree: true });
        bindEditors();
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();