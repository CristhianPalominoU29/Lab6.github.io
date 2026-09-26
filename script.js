
// ============================================================
// CLASIFICADOR DE OBJETOS TECNOLÓGICOS
// MEDIANTE DEEP LEARNING
// ============================================================


// ============================================================
// URL DEL MODELO DE TEACHABLE MACHINE
// ============================================================

const URL_MODELO =
    "https://teachablemachine.withgoogle.com/models/9_ggDiY0_/";


// ============================================================
// VARIABLES GLOBALES
// ============================================================

let model = null;

let webcam = null;

let totalClasses = 0;

let isPlaying = false;


// ============================================================
// ELEMENTOS HTML
// ============================================================

const btnStart =
    document.getElementById("btn-start");


const loadingText =
    document.getElementById("loading-text");


const placeholderText =
    document.getElementById("placeholder-text");


const webcamContainer =
    document.getElementById("webcam-container");


const labelContainer =
    document.getElementById("label-container");


// ============================================================
// EVENTO DEL BOTÓN
// ============================================================

btnStart.addEventListener(
    "click",
    init
);


// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

async function init() {

    // Evitar iniciar varias veces

    if (isPlaying) {

        return;

    }


    // Cambiar estado del botón

    btnStart.disabled = true;

    btnStart.textContent =
        "Cargando modelo...";


    loadingText.classList.remove(
        "hidden"
    );


    try {

        // ====================================================
        // URLS DEL MODELO
        // ====================================================

        const modelURL =
            URL_MODELO + "model.json";


        const metadataURL =
            URL_MODELO + "metadata.json";


        console.log(
            "================================="
        );


        console.log(
            "Cargando modelo de Teachable Machine..."
        );


        console.log(
            "Modelo:",
            modelURL
        );


        // ====================================================
        // CARGAR MODELO
        // ====================================================

        model =
            await tmImage.load(
                modelURL,
                metadataURL
            );


        // Obtener número de clases

        totalClasses =
            model.getTotalClasses();


        console.log(
            "Modelo cargado correctamente."
        );


        console.log(
            "Número de clases:",
            totalClasses
        );


        // ====================================================
        // CONFIGURAR WEBCAM
        // ====================================================

        const flip = true;


        webcam =
            new tmImage.Webcam(
                400,
                300,
                flip
            );


        // Solicitar acceso a cámara

        await webcam.setup();


        // Iniciar cámara

        await webcam.play();


        console.log(
            "Cámara iniciada correctamente."
        );


        // ====================================================
        // MOSTRAR CÁMARA
        // ====================================================

        placeholderText.classList.add(
            "hidden"
        );


        webcamContainer.appendChild(
            webcam.canvas
        );


        // Ajustar canvas

        webcam.canvas.style.width =
            "100%";


        webcam.canvas.style.height =
            "100%";


        webcam.canvas.style.objectFit =
            "cover";


        // ====================================================
        // CREAR PREDICCIONES
        // ====================================================

        createPredictionElements();


        // ====================================================
        // CAMBIAR ESTADO
        // ====================================================

        isPlaying = true;


        loadingText.classList.add(
            "hidden"
        );


        btnStart.textContent =
            "Modelo en Ejecución";


        // ====================================================
        // INICIAR PREDICCIÓN
        // ====================================================

        window.requestAnimationFrame(
            loop
        );


    } catch (error) {

        console.error(
            "Error al iniciar:",
            error
        );


        alert(
            "No se pudo iniciar el modelo o acceder a la cámara.\n\n" +
            "Verifica:\n" +
            "1. La URL del modelo.\n" +
            "2. Los permisos de la cámara.\n" +
            "3. Que estés usando HTTPS o localhost."
        );


        // Restaurar botón

        btnStart.disabled = false;


        btnStart.textContent =
            "Iniciar Cámara y Modelo";


        loadingText.classList.add(
            "hidden"
        );

    }
}


// ============================================================
// CREAR ELEMENTOS DE PREDICCIÓN
// ============================================================

function createPredictionElements() {

    // Limpiar contenedor

    labelContainer.innerHTML = "";


    // Crear elemento para cada clase

    for (
        let i = 0;
        i < totalClasses;
        i++
    ) {

        const classWrapper =
            document.createElement(
                "div"
            );


        classWrapper.className =
            "class-wrapper";


        classWrapper.innerHTML = `

            <div class="class-info">

                <span class="class-name">
                    Clase ${i + 1}
                </span>

                <span class="class-percentage">
                    0%
                </span>

            </div>


            <div class="progress-track">

                <div class="class-bar"></div>

            </div>

        `;


        labelContainer.appendChild(
            classWrapper
        );

    }

}


// ============================================================
// BUCLE PRINCIPAL
// ============================================================

async function loop() {

    if (!isPlaying) {

        return;

    }


    // Actualizar cámara

    webcam.update();


    // Realizar predicción

    await predict();


    // Continuar ejecutando

    window.requestAnimationFrame(
        loop
    );

}


// ============================================================
// REALIZAR PREDICCIÓN
// ============================================================

async function predict() {

    // Obtener predicciones

    const predictions =
        await model.predict(
            webcam.canvas
        );


    // Obtener elementos HTML

    const names =
        labelContainer.getElementsByClassName(
            "class-name"
        );


    const percentages =
        labelContainer.getElementsByClassName(
            "class-percentage"
        );


    const bars =
        labelContainer.getElementsByClassName(
            "class-bar"
        );


    // ========================================================
    // ACTUALIZAR CADA CLASE
    // ========================================================

    for (
        let i = 0;
        i < totalClasses;
        i++
    ) {

        // Obtener predicción

        const prediction =
            predictions[i];


        // Nombre de la clase

        const className =
            prediction.className;


        // Probabilidad

        const probability =
            prediction.probability;


        // Convertir a porcentaje

        const percentage =
            Math.round(
                probability * 100
            );


        // ====================================================
        // ACTUALIZAR NOMBRE
        // ====================================================

        names[i].textContent =
            className;


        // ====================================================
        // ACTUALIZAR PORCENTAJE
        // ====================================================

        percentages[i].textContent =
            `${percentage}%`;


        // ====================================================
        // ACTUALIZAR BARRA
        // ====================================================

        bars[i].style.width =
            `${percentage}%`;


        // ====================================================
        // CAMBIAR COLOR SI HAY ALTA CONFIANZA
        // ====================================================

        if (percentage >= 70) {

            bars[i].classList.add(
                "bg-high-confidence"
            );

        } else {

            bars[i].classList.remove(
                "bg-high-confidence"
            );

        }

    }

}
