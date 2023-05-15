import { Pollito } from "./classes/Pollito";
import { Balon } from "./classes/Balon";

// Función que inicializa el timer
const inicioTimer = (timer: HTMLElement | null) => {
    timer!.innerHTML = "00:00";
    const iniciarTimer = new Date().getTime();
    return iniciarTimer;
};

// Función que actualiza el timer
const actualizarTimer = (timer: HTMLElement | null, iniciarTimer: number) => {
    const tiempoActual = new Date().getTime();
    const tiempoTranscurrido = new Date(tiempoActual - iniciarTimer);
    const minutos = tiempoTranscurrido.getMinutes();
    const segundos = tiempoTranscurrido.getSeconds();
    timer!.innerHTML = `${minutos < 10 ? "0" + minutos : minutos}:${segundos < 10 ? "0" + segundos : segundos
        }`;
    return tiempoTranscurrido;
};

export const timer = (e: Event) => {
    const timer = document.getElementById("timer");
    const iniciarTimer = inicioTimer(timer);
    const boton = e.target as HTMLButtonElement;

    boton.disabled = true;

    let idIntervalo = setInterval(() => {
        let actual = actualizarTimer(timer, iniciarTimer);
        if (actual.getMinutes() === 3) {
            timer!.innerHTML = "03:00";
            boton.disabled = false;
            clearInterval(idIntervalo);
        }
    }, 1000);
};

export const clouserTimer = (jugadores: Pollito[], balon: Balon) => {
    const timer = (e: Event) => {
        const timer = document.getElementById("timer");
        const iniciarTimer = inicioTimer(timer);
        const boton = e.target as HTMLButtonElement;
    
        boton.disabled = true;
    
        let idIntervalo = setInterval(() => {
            let actual = actualizarTimer(timer, iniciarTimer);
            if (actual.getMinutes() === 3) {
                timer!.innerHTML = "03:00";
                boton.disabled = false;
                clearInterval(idIntervalo);

                // Pausar el juego
                balon.pause();
                jugadores.forEach(jugador => {
                    jugador.pause();
                })
            }
        }, 1000);
    };

    return timer;
}