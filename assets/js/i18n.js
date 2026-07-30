(function () {
    "use strict";

    var STORAGE_KEY = "enrique-portfolio-language";
    var DEFAULT_LANGUAGE = "es";
    var lastEnglishFlagIndex = -1;

    function createSubdivisionFlag(code) {
        var codePoints = [0x1F3F4];

        code.toLowerCase().split("").forEach(function (character) {
            codePoints.push(0xE0000 + character.charCodeAt(0));
        });

        codePoints.push(0xE007F);
        return String.fromCodePoint.apply(String, codePoints);
    }

    var englishFlagChoices = [
        { region: "united-kingdom", symbol: "🇬🇧" },
        { region: "england", symbol: createSubdivisionFlag("gbeng") },
        { region: "scotland", symbol: createSubdivisionFlag("gbsct") },
        { region: "wales", symbol: createSubdivisionFlag("gbwls") },
        { region: "ireland", symbol: "🇮🇪" },
        { region: "canada", symbol: "🇨🇦" },
        { region: "australia", symbol: "🇦🇺" },
        { region: "new-zealand", symbol: "🇳🇿" }
    ];

    var translations = {
        es: {
            "meta.title": "Enrique Juan | Videojuegos, Software y DevOps",
            "meta.description": "Desarrollador de videojuegos y software, consultor técnico especializado en integración de sistemas, DevOps y Cloud DevOps.",
            "language.selector": "Cambiar idioma",
            "language.spanish": "Cambiar a castellano",
            "language.english": "Cambiar a inglés británico",
            "hero.technical": "Software · Integración · DevOps",
            "hero.creative": "Videojuegos · Entornos interactivos · Gameplay",
            "hero.portfolioCta": "Ver portfolio",
            "hero.experienceCta": "Ver experiencia",
            "hero.scrollCue": "Ir a la sección Sobre mí",
            "nav.toggle": "Abrir o cerrar la navegación",
            "nav.home": "Inicio",
            "nav.about": "Sobre mí",
            "nav.portfolio": "Portfolio",
            "nav.cv": "CV",
            "nav.contact": "Contacto",
            "about.title": "Sobre mí",
            "about.role": "Desarrollador de Videojuegos y Software | DevOps y Cloud DevOps | Integración de Sistemas | Consultor Técnico",
            "about.summary": "Soy desarrollador de software y videojuegos con experiencia como consultor técnico. Mi formación y mis proyectos me han llevado a trabajar con gameplay, físicas, motores, sonido, diseño de niveles, arte 3D y experiencias interactivas. Actualmente combino esa mirada técnica y creativa con el análisis de requisitos, el desarrollo e implantación de soluciones, la integración de sistemas y las prácticas DevOps y Cloud DevOps.<br><br>Me gusta participar en todo el recorrido de un proyecto: diagnosticar el problema, diseñar una solución clara, construirla, probarla y mejorar su entrega. Disfruto resolviendo retos complejos y adaptándome rápidamente a nuevas herramientas y contextos.<br><br>También me interesan la electrónica y reparación de hardware, el modelado 3D, los proyectos de carpintería y descubrir la historia de otras culturas.",
            "personal.title": "Información personal",
            "personal.location": "Ubicación",
            "personal.locationValue": "Madrid, España",
            "personal.workMode": "Modalidad",
            "personal.workModeValue": "Presencial · Híbrido · Remoto",
            "personal.email": "Email",
            "personal.phone": "Teléfono",
            "strengths.title": "En qué destaco",
            "strengths.gameplayTitle": "Programación y Gameplay",
            "strengths.gameplayText": "Mecánicas, físicas, partículas, sonido, controles y ajuste de la sensación de juego.",
            "strengths.artTitle": "Diseño y Arte 3D",
            "strengths.artText": "Diseño funcional de niveles, modelado de entornos y optimización de escenarios interactivos.",
            "strengths.integrationTitle": "Desarrollo e Integración",
            "strengths.integrationText": "Soluciones conectadas, workflows y desarrollo con Python, JavaScript, C#, C++ y SQL.",
            "strengths.devopsTitle": "DevOps y Sistemas",
            "strengths.devopsText": "Automatización, despliegues, control de versiones, Docker, Linux y soporte cloud.",
            "strengths.analysisTitle": "Análisis y Planificación",
            "strengths.analysisText": "Resolución de problemas, diseño de soluciones, gestión de riesgos y seguimiento de objetivos.",
            "strengths.teamTitle": "Comunicación y Equipo",
            "strengths.teamText": "Comunicación técnica bilingüe, trabajo colaborativo y aprendizaje autónomo.",
            "portfolio.title": "Portfolio",
            "portfolio.filtersLabel": "Filtros del portfolio",
            "portfolio.projectsFilter": "Algunos proyectos",
            "portfolio.artFilter": "Un poco de arte",
            "portfolio.codeFilter": "Ejemplos de código",
            "portfolio.llmAttorneyText": "Creación y simulación de casos jurídicos con LLMs para estudiantes de abogacía",
            "portfolio.vsSkills": "Planificación, gestión, animaciones, balance",
            "portfolio.vsText": "Un platform-fighter con personajes originales, controlable con un mando de NES",
            "portfolio.ascensoAlt": "Ascenso de Riquezas",
            "portfolio.ascensoSkills": "Animaciones, mecánica de juego",
            "portfolio.ascensoText": "¡Consigue todo el oro posible sin perder el ascensor!",
            "portfolio.carsAlt": "Juego de Autos",
            "portfolio.carsSkills": "Físicas, componentes, VFX (motor in-house)",
            "portfolio.carsText": "¡Da la vuelta al circuito lo más rápido posible en este throwback a F-Zero!",
            "portfolio.nostamalSkills": "Arte, diseño",
            "portfolio.nostamalText": "Cocina descifrando jeroglíficos con un amigo en este juego online para dos jugadores",
            "portfolio.bungalowText": "Modelado 3D de un concepto de casa y jardín",
            "portfolio.landscapeAlt": "Boceto de paisaje",
            "portfolio.hakimboAlt": "Maquetado dinámico de un personaje con garrote",
            "portfolio.hakimboTitle": "Maquetado de golpe sísmico",
            "portfolio.hakimboText": "Un personaje mío, Hakimbo, rompiendo el suelo de un golpe con su kanabo",
            "portfolio.dragonAlt": "Dragón estilizado",
            "portfolio.dragonTitle": "Dragón",
            "portfolio.dsText": "Renderizado low-poly de una consola Nintendo DS Lite que tenía hace un tiempo.",
            "portfolio.bodyTitle": "Modelado de cuerpo humano",
            "portfolio.llmCodeAlt": "Generación e integración de casos civiles y documentos legales con LLMs",
            "portfolio.llmCodeTitle": "Generación e integración de casos civiles y documentos legales desde un LLM al simulador",
            "portfolio.llmCodeText": "Integración de LLMs a un simulador de casos civiles para generar casos y documentos, incluyendo el pipeline, prompt-engineering, contexto e interacción usuario-simulador-LLM.",
            "portfolio.physicsAlt": "Render reimaginado de la demo de mis físicas",
            "portfolio.physicsTitle": "Simulación física de varios elementos",
            "portfolio.physicsText": "Pequeño proyecto en C++ para probar gravedad, vientos, resistencia, partículas y flotabilidad en distintos medios.",
            "portfolio.physicsDemo": "Tiene una pequeña demo jugable, «El barquito vago».",
            "portfolio.coordinatesTitle": "Transformación de coordenadas y unidades físicas, partículas",
            "portfolio.coordinatesText": "Traducción de vectores, velocidades y unidades entre los diferentes elementos de nuestro motor, además de partículas presentes en el escenario y el jugador.",
            "portfolio.audioTitle": "Sonido, gameplay, escenarios",
            "portfolio.audioText": "Reproducción con SDL2 de sonido al compás con movimientos, ajuste de latencia y output.<br>Arquitectura de escenarios y movimientos de personaje.",
            "cv.title": "Mi CV",
            "cv.download": "Descargar mi CV",
            "cv.careerTitle": "Carrera profesional",
            "cv.qubiqTitle": "Consultor Técnico - QubiQ",
            "cv.qubiqDate": "Julio 2025 - Actual | Madrid, España",
            "cv.qubiqText": "<strong>Desarrollo e integración de soluciones sobre Odoo</strong> con <strong>Python, JavaScript y XML</strong>.<br><strong>Análisis funcional, GAP Analysis y definición de requisitos</strong>, diseño de workflows y modelado de procesos.<br>Desarrollo de funcionalidades, resolución de incidencias y documentación técnica.<br>Participación en tareas de <strong>DevOps y Cloud DevOps</strong>, automatización de despliegues y mejora de procesos de entrega bajo metodología ágil <strong>QGo</strong>.",
            "cv.teacherTitle": "Profesor de Robótica, Diseño y Programación bilingüe - Robots in Action",
            "cv.teacherDate": "Febrero 2023 - Marzo 2025 | España",
            "cv.teacherText": "Impartición de <strong>programación, robótica y diseño en español e inglés</strong>, adaptando contenidos a distintos niveles.<br>Refuerzo de la <strong>comunicación técnica</strong>, resolución de dudas y seguimiento del aprendizaje.<br>Planificación de sesiones, materiales y objetivos a corto y medio plazo.",
            "cv.oubitaTitle": "Diseñador de Metaverso - Oubita",
            "cv.oubitaDate": "Febrero 2022 - Octubre 2022 | Alcobendas, España",
            "cv.oubitaText": "<strong>Programación, integración y despliegue de entornos virtuales multiplataforma</strong>.<br>Optimización de modelos y rendimiento para asegurar estabilidad, junto con <strong>control de versiones</strong>, preparación de demos técnicas y validación de requisitos.",
            "cv.freelanceTitle": "Técnico de Sistemas y Diagnóstico de Hardware - Particular / Freelance",
            "cv.freelanceDate": "Junio 2017 - Actual | Colmenar Viejo, España",
            "cv.freelanceText": "<strong>Montaje, optimización, diagnóstico y mantenimiento</strong> de ordenadores y electrónica de consumo.<br>Resolución de incidencias de <strong>hardware, redes básicas y sistemas operativos</strong>, con aprendizaje continuo mediante documentación técnica.",
            "cv.educationTitle": "Educación",
            "cv.degreeTitle": "Grado en Desarrollo de Videojuegos<br> - UCM",
            "cv.degreeDate": "Septiembre 2020 - Junio 2026 | Madrid, España",
            "cv.degreeText": "<strong>Universidad Complutense de Madrid, Facultad de Informática.</strong><br>Trabajo Fin de Grado: <strong>LLMAttorney</strong>, proyecto de creación y simulación de casos jurídicos con LLMs presentado por la UCM en el <strong>V Congreso Español de Videojuegos 2026</strong>.",
            "cv.tudTitle": "Ingeniería Informática<br> - Technological University Dublin",
            "cv.tudDate": "Septiembre 2023 - Junio 2024 | Dublín, Irlanda",
            "cv.tudText": "<strong>Formación internacional en Ingeniería Informática</strong> y colaboración en equipos multiculturales.",
            "cv.icaiTitle": "Curso de Ingeniería Electrónica<br> - ICAI",
            "cv.icaiDate": "Julio 2017 | Madrid, España",
            "cv.technicalTitle": "Competencias técnicas",
            "cv.languagesTitle": "Lenguajes",
            "cv.devopsSystemsTitle": "DevOps y Sistemas",
            "cv.skillNetworking": "Redes",
            "cv.skillHardwareDiagnostics": "Diagnóstico de hardware",
            "cv.methodologiesTitle": "Metodologías",
            "cv.skillRiskManagement": "Gestión de riesgos",
            "cv.skillTechnicalDocumentation": "Documentación técnica",
            "cv.toolsTitle": "Herramientas",
            "cv.spokenLanguagesTitle": "Idiomas",
            "cv.englishLevel": "Inglés - Nativo",
            "cv.spanishLevel": "Español - Nativo",
            "cv.professionalSkillsTitle": "Competencias profesionales",
            "cv.skillProblemSolving": "Resolución de problemas",
            "cv.skillAnalytical": "Pensamiento analítico",
            "cv.skillLateral": "Pensamiento lateral",
            "cv.skillTeamwork": "Trabajo en equipo",
            "cv.skillTime": "Gestión del tiempo",
            "cv.skillIndependent": "Aprendizaje autónomo",
            "cv.skillCommunication": "Comunicación técnica",
            "contact.title": "Contacto",
            "contact.phone": "Teléfono",
            "contact.email": "Email",
            "footer.createdBy": "Creado por",
            "footer.thanks": ", con un agradecimiento especial a",
            "footer.devcrudTitle": "Temas y paneles de Bootstrap 4",
            "footer.template": "por la plantilla."
        },
        en: {
            "meta.title": "Enrique Juan | Video Games, Software and DevOps",
            "meta.description": "Video game and software developer and technical consultant specialising in systems integration, DevOps and Cloud DevOps.",
            "language.selector": "Choose language",
            "language.spanish": "Switch to Spanish",
            "language.english": "Switch to British English",
            "hero.technical": "Software · Integration · DevOps",
            "hero.creative": "Video Games · Interactive Environments · Gameplay",
            "hero.portfolioCta": "View portfolio",
            "hero.experienceCta": "View experience",
            "hero.scrollCue": "Go to the About me section",
            "nav.toggle": "Open or close navigation",
            "nav.home": "Home",
            "nav.about": "About me",
            "nav.portfolio": "Portfolio",
            "nav.cv": "CV",
            "nav.contact": "Contact",
            "about.title": "About me",
            "about.role": "Video Game and Software Developer | DevOps and Cloud DevOps | Systems Integration | Technical Consultant",
            "about.summary": "I am a software and video game developer with experience as a technical consultant. My studies and projects have led me to work across gameplay, physics, game engines, audio, level design, 3D art and interactive experiences. I currently combine this technical and creative perspective with requirements analysis, solution development and implementation, systems integration, and DevOps and Cloud DevOps practices.<br><br>I enjoy contributing throughout a project’s lifecycle: understanding the problem, designing a clear solution, building and testing it, and improving its delivery. I enjoy solving complex challenges and adapting quickly to new tools and contexts.<br><br>I am also interested in electronics and hardware repair, 3D modelling, woodworking projects, and learning about the history of other cultures.",
            "personal.title": "Personal information",
            "personal.location": "Location",
            "personal.locationValue": "Madrid, Spain",
            "personal.workMode": "Work mode",
            "personal.workModeValue": "On-site · Hybrid · Remote",
            "personal.email": "Email",
            "personal.phone": "Phone",
            "strengths.title": "What I do best",
            "strengths.gameplayTitle": "Programming and Gameplay",
            "strengths.gameplayText": "Mechanics, physics, particles, audio, controls and fine-tuning game feel.",
            "strengths.artTitle": "Design and 3D Art",
            "strengths.artText": "Functional level design, environment modelling and optimisation for interactive settings.",
            "strengths.integrationTitle": "Development and Integration",
            "strengths.integrationText": "Connected solutions, workflows and development with Python, JavaScript, C#, C++ and SQL.",
            "strengths.devopsTitle": "DevOps and Systems",
            "strengths.devopsText": "Automation, deployments, version control, Docker, Linux and cloud support.",
            "strengths.analysisTitle": "Analysis and Planning",
            "strengths.analysisText": "Problem-solving, solution design, risk management and progress tracking.",
            "strengths.teamTitle": "Communication and Teamwork",
            "strengths.teamText": "Bilingual technical communication, collaborative work and independent learning.",
            "portfolio.title": "Portfolio",
            "portfolio.filtersLabel": "Portfolio filters",
            "portfolio.projectsFilter": "Selected projects",
            "portfolio.artFilter": "A little art",
            "portfolio.codeFilter": "Code examples",
            "portfolio.llmAttorneyText": "Creation and simulation of legal cases with LLMs for law students",
            "portfolio.vsSkills": "Planning, management, animation and balancing",
            "portfolio.vsText": "A platform fighter with original characters, playable with an NES controller",
            "portfolio.ascensoAlt": "Ascenso de Riquezas game",
            "portfolio.ascensoSkills": "Animation and gameplay mechanics",
            "portfolio.ascensoText": "Collect as much gold as possible without losing the lift!",
            "portfolio.carsAlt": "Juego de Autos game",
            "portfolio.carsSkills": "Physics, components and VFX (in-house engine)",
            "portfolio.carsText": "Race around the circuit as fast as possible in this throwback to F-Zero!",
            "portfolio.nostamalSkills": "Art and design",
            "portfolio.nostamalText": "Cook by deciphering hieroglyphs with a friend in this online two-player game",
            "portfolio.bungalowText": "3D model of a house and garden concept",
            "portfolio.landscapeAlt": "Landscape sketch",
            "portfolio.hakimboAlt": "Dynamic model of a character wielding a club",
            "portfolio.hakimboTitle": "Seismic strike model",
            "portfolio.hakimboText": "My own character, Hakimbo, smashing the ground with his kanabō",
            "portfolio.dragonAlt": "Stylised dragon",
            "portfolio.dragonTitle": "Dragon",
            "portfolio.dsText": "Low-poly render of a Nintendo DS Lite console I owned some time ago.",
            "portfolio.bodyTitle": "Human body sculpt",
            "portfolio.llmCodeAlt": "Generation and integration of civil cases and legal documents with LLMs",
            "portfolio.llmCodeTitle": "Generation and integration of civil cases and legal documents from an LLM into the simulator",
            "portfolio.llmCodeText": "Integration of LLMs into a civil case simulator to generate cases and documents, including the pipeline, prompt engineering, context, and user–simulator–LLM interaction.",
            "portfolio.physicsAlt": "Reimagined render of my physics demo",
            "portfolio.physicsTitle": "Physics simulation of several elements",
            "portfolio.physicsText": "Small C++ project testing gravity, wind, drag, particles and buoyancy in different media.",
            "portfolio.physicsDemo": "It includes a short playable demo, “The Lazy Little Boat”.",
            "portfolio.coordinatesTitle": "Coordinate and physical unit transformations, particles",
            "portfolio.coordinatesText": "Translation of vectors, velocities and units between the various elements of our engine, along with particles in the environment and player.",
            "portfolio.audioTitle": "Audio, gameplay and environments",
            "portfolio.audioText": "SDL2 audio playback synchronised with movement, with latency and output tuning.<br>Environment architecture and character movement.",
            "cv.title": "My CV",
            "cv.download": "Download my CV",
            "cv.careerTitle": "Professional experience",
            "cv.qubiqTitle": "Technical Consultant - QubiQ",
            "cv.qubiqDate": "July 2025 - Present | Madrid, Spain",
            "cv.qubiqText": "<strong>Development and integration of solutions built on Odoo</strong> with <strong>Python, JavaScript and XML</strong>.<br><strong>Functional analysis, gap analysis and requirements definition</strong>, workflow design and process modelling.<br>Feature development, issue resolution and technical documentation.<br>Contribution to <strong>DevOps and Cloud DevOps</strong> tasks, deployment automation and delivery process improvement using the agile <strong>QGo</strong> methodology.",
            "cv.teacherTitle": "Bilingual Robotics, Design and Programming Teacher - Robots in Action",
            "cv.teacherDate": "February 2023 - March 2025 | Spain",
            "cv.teacherText": "Delivery of <strong>programming, robotics and design lessons in Spanish and English</strong>, adapting content to different ability levels.<br>Strengthening <strong>technical communication</strong>, answering questions and monitoring learning.<br>Planning sessions, materials and short- and medium-term objectives.",
            "cv.oubitaTitle": "Metaverse Designer - Oubita",
            "cv.oubitaDate": "February 2022 - October 2022 | Alcobendas, Spain",
            "cv.oubitaText": "<strong>Programming, integration and deployment of cross-platform virtual environments</strong>.<br>Model and performance optimisation to ensure stability, alongside <strong>version control</strong>, technical demo preparation and requirements validation.",
            "cv.freelanceTitle": "Systems and Hardware Diagnostics Technician - Private / Freelance",
            "cv.freelanceDate": "June 2017 - Present | Colmenar Viejo, Spain",
            "cv.freelanceText": "<strong>Assembly, optimisation, diagnostics and maintenance</strong> of computers and consumer electronics.<br>Troubleshooting <strong>hardware, basic networking and operating-system issues</strong>, with continuous learning through technical documentation.",
            "cv.educationTitle": "Education",
            "cv.degreeTitle": "BSc in Video Game Development<br> - UCM",
            "cv.degreeDate": "September 2020 - June 2026 | Madrid, Spain",
            "cv.degreeText": "<strong>Complutense University of Madrid, Faculty of Computer Science.</strong><br>Final-year dissertation: <strong>LLMAttorney</strong>, a project for creating and simulating legal cases with LLMs, presented by UCM at the <strong>5th Spanish Video Games Conference 2026</strong>.",
            "cv.tudTitle": "Computer Engineering<br> - Technological University Dublin",
            "cv.tudDate": "September 2023 - June 2024 | Dublin, Ireland",
            "cv.tudText": "<strong>International studies in Computer Engineering</strong> and collaboration in multicultural teams.",
            "cv.icaiTitle": "Electronic Engineering Course<br> - ICAI",
            "cv.icaiDate": "July 2017 | Madrid, Spain",
            "cv.technicalTitle": "Technical skills",
            "cv.languagesTitle": "Programming languages",
            "cv.devopsSystemsTitle": "DevOps and Systems",
            "cv.skillNetworking": "Networking",
            "cv.skillHardwareDiagnostics": "Hardware diagnostics",
            "cv.methodologiesTitle": "Methodologies",
            "cv.skillRiskManagement": "Risk management",
            "cv.skillTechnicalDocumentation": "Technical documentation",
            "cv.toolsTitle": "Tools",
            "cv.spokenLanguagesTitle": "Languages",
            "cv.englishLevel": "English - Native",
            "cv.spanishLevel": "Spanish - Native",
            "cv.professionalSkillsTitle": "Professional skills",
            "cv.skillProblemSolving": "Problem-solving",
            "cv.skillAnalytical": "Analytical thinking",
            "cv.skillLateral": "Lateral thinking",
            "cv.skillTeamwork": "Teamwork",
            "cv.skillTime": "Time management",
            "cv.skillIndependent": "Independent learning",
            "cv.skillCommunication": "Technical communication",
            "contact.title": "Contact",
            "contact.phone": "Phone",
            "contact.email": "Email",
            "footer.createdBy": "Created by",
            "footer.thanks": ", with many thanks to",
            "footer.devcrudTitle": "Bootstrap 4 themes and dashboards",
            "footer.template": "for the template."
        }
    };

    function readStoredLanguage() {
        try {
            return window.localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return null;
        }
    }

    function storeLanguage(language) {
        try {
            window.localStorage.setItem(STORAGE_KEY, language);
        } catch (error) {
            // The language still changes when storage is unavailable.
        }
    }

    function applyTranslatedContent(language) {
        var dictionary = translations[language];
        var bindings = [
            { selector: "[data-i18n]", keyAttribute: "data-i18n", property: "textContent" },
            { selector: "[data-i18n-html]", keyAttribute: "data-i18n-html", property: "innerHTML" },
            { selector: "[data-i18n-aria-label]", keyAttribute: "data-i18n-aria-label", attribute: "aria-label" },
            { selector: "[data-i18n-alt]", keyAttribute: "data-i18n-alt", attribute: "alt" },
            { selector: "[data-i18n-title]", keyAttribute: "data-i18n-title", attribute: "title" },
            { selector: "[data-i18n-content]", keyAttribute: "data-i18n-content", attribute: "content" }
        ];

        bindings.forEach(function (binding) {
            document.querySelectorAll(binding.selector).forEach(function (element) {
                var key = element.getAttribute(binding.keyAttribute);
                var translation = dictionary[key];

                if (typeof translation !== "string") {
                    return;
                }

                if (binding.attribute) {
                    element.setAttribute(binding.attribute, translation);
                } else {
                    element[binding.property] = translation;
                }
            });
        });

        document.title = dictionary["meta.title"];
    }

    function refreshDynamicLayout() {
        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                if (window.jQuery) {
                    var portfolio = window.jQuery(".portfolio-container");

                    if (portfolio.length && portfolio.data("isotope")) {
                        portfolio.isotope("layout");
                    }
                }

                window.dispatchEvent(new Event("resize"));
            });
        });
    }

    function randomiseEnglishFlag() {
        var englishButton = document.querySelector('.language-option[data-language="en"]');

        if (!englishButton || !englishFlagChoices.length) {
            return;
        }

        var nextIndex = Math.floor(Math.random() * englishFlagChoices.length);

        if (englishFlagChoices.length > 1 && nextIndex === lastEnglishFlagIndex) {
            nextIndex = (
                nextIndex +
                1 +
                Math.floor(Math.random() * (englishFlagChoices.length - 1))
            ) % englishFlagChoices.length;
        }

        var choice = englishFlagChoices[nextIndex];
        var flag = englishButton.querySelector(".language-flag");

        if (flag) {
            flag.textContent = choice.symbol;
        }

        englishButton.setAttribute("data-flag-region", choice.region);
        lastEnglishFlagIndex = nextIndex;
    }

    function resetEnglishFlag() {
        var englishButton = document.querySelector('.language-option[data-language="en"]');

        if (!englishButton) {
            return;
        }

        var flag = englishButton.querySelector(".language-flag");

        if (flag) {
            flag.textContent = englishFlagChoices[0].symbol;
        }

        englishButton.setAttribute("data-flag-region", englishFlagChoices[0].region);
        lastEnglishFlagIndex = 0;
    }

    function setLanguage(language, persist) {
        var selectedLanguage = Object.prototype.hasOwnProperty.call(translations, language)
            ? language
            : DEFAULT_LANGUAGE;

        applyTranslatedContent(selectedLanguage);
        document.documentElement.lang = selectedLanguage === "en" ? "en-GB" : "es";
        document.body.setAttribute("data-language", selectedLanguage);

        if (selectedLanguage === "en") {
            randomiseEnglishFlag();
        } else {
            resetEnglishFlag();
        }

        document.querySelectorAll(".language-option").forEach(function (button) {
            var isActive = button.getAttribute("data-language") === selectedLanguage;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
            button.setAttribute("title", button.getAttribute("aria-label"));
        });

        if (persist) {
            storeLanguage(selectedLanguage);
        }

        refreshDynamicLayout();
        window.dispatchEvent(new CustomEvent("languagechange", {
            detail: { language: selectedLanguage }
        }));
    }

    document.querySelectorAll(".language-option").forEach(function (button) {
        button.addEventListener("click", function () {
            setLanguage(button.getAttribute("data-language"), true);
        });
    });

    var storedLanguage = readStoredLanguage();
    setLanguage(
        Object.prototype.hasOwnProperty.call(translations, storedLanguage)
            ? storedLanguage
            : DEFAULT_LANGUAGE,
        false
    );

    window.portfolioI18n = {
        getLanguage: function () {
            return document.body.getAttribute("data-language") || DEFAULT_LANGUAGE;
        },
        setLanguage: function (language) {
            setLanguage(language, true);
        }
    };
})();
