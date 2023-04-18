// Función que inicializa el timer
const inicioTimer = (timer: HTMLObjectElement) => {
    timer.innerHTML = "00:00";
    const iniciarTimer = new Date().getTime();
    return iniciarTimer;
};

// Función que actualiza el timer
const actualizarTimer = (timer: HTMLObjectElement, iniciarTimer: number) => {
    const tiempoActual = new Date().getTime();
    const tiempoTranscurrido = new Date(tiempoActual - iniciarTimer);
    const minutos = tiempoTranscurrido.getMinutes();
    const segundos = tiempoTranscurrido.getSeconds();
    timer.innerHTML = `${minutos < 10 ? "0" + minutos : minutos}:${
        segundos < 10 ? "0" + segundos : segundos
    }`;
    return tiempoTranscurrido;
};

export const timer = (timer: HTMLObjectElement, boton:HTMLButtonElement) => {
    let iniciarTimer = inicioTimer(timer);
    
    let idIntervalo = setInterval(() => {
        let actual = actualizarTimer(timer, iniciarTimer);
        if (actual.getMinutes() === 3) {
            timer.innerHTML = "03:00";
            boton.disabled = false;
            clearInterval(idIntervalo);
        }
    }, 1000);
};
