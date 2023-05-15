import "./style.css";
import * as PIXI from "pixi.js";
import fieldUrl from "./assets/field.jpg";
import bg from "./assets/bg.svg";
import { clouserTimer } from "./timer";
import { PELOTA_TEXTURA, POLLITO_BLANCO_TEXTURA, POLLITO_CAFE_TEXTURA } from "./utils/constants";
import { collisionResponse, testForAABB } from "./utils/functions";
import { Balon } from "./classes/Balon";
import { Pollito } from "./classes/Pollito";
import { Porteria } from "./classes/Porteria";

declare module "pixi.js" {
	interface Sprite {
		acceleration: PIXI.Point;
		mass: number;
	}
}

const goles = {
	izquierda: 0,
	derecha: 0
}


const Main = () => {
	// Agregar el fondo de la página
	document.body.style.backgroundImage = `url(${bg})`;

	// Elemento HTML donde se va a agregar el canvas de PixiJS
	const section = document.getElementById("field") as HTMLElement;

	// Crear la aplicación de PixiJS
	const app = new PIXI.Application({
		resizeTo: section,
	});

	const screenWidth = section.clientWidth;
	const screenHeight = section.clientHeight;

	// Agregar el canvas de PixiJS al elemento HTML
	section.appendChild(app.view as any);

	// Agregar el campo de juego (background)
	const background = PIXI.Texture.from(fieldUrl);

	// Crear el campo de juego
	const field = new PIXI.Sprite(background);
	field.width = app.screen.width;
	field.height = app.screen.height;

	// Agregar el campo de juego al stage
	app.stage.addChild(field);

	// Porteria derecha
	const porteriaDerecha = new Porteria(972, 291)
	app.stage.addChild(porteriaDerecha);

	// Porteria izquierda
	const porteriaIzquierda = new Porteria(app.screen.width - 1004, app.screen.height - 380)
	app.stage.addChild(porteriaIzquierda);

	// Ball
	const balon = new Balon(PELOTA_TEXTURA, 25, 25, screenWidth / 2, screenHeight / 2, 2, screenWidth, screenHeight);

	const jugadorLimites: [PIXI.Point, PIXI.Point] = [new PIXI.Point(45, 25), new PIXI.Point(screenWidth - 45, screenHeight - 25)]

	const jugadores = [
		new Pollito(POLLITO_BLANCO_TEXTURA, 80, 330, 4, new PIXI.Point(45, 100), new PIXI.Point(screenWidth / 4, screenHeight - 100)), // portero
		new Pollito(POLLITO_BLANCO_TEXTURA, 250, 200, 4, ...jugadorLimites), // defensa
		new Pollito(POLLITO_BLANCO_TEXTURA, 250, 460, 4, ...jugadorLimites), // defensa
		new Pollito(POLLITO_BLANCO_TEXTURA, 350, 140, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_BLANCO_TEXTURA, 350, 340, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_BLANCO_TEXTURA, 350, 500, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_BLANCO_TEXTURA, 450, 100, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_BLANCO_TEXTURA, 450, 320, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_BLANCO_TEXTURA, 450, 540, 4, ...jugadorLimites), // delantero

		new Pollito(POLLITO_CAFE_TEXTURA, 920, 330, 4, new PIXI.Point(screenWidth - 230, 100), new PIXI.Point(screenWidth - 45, screenHeight - 100)), // portero
		new Pollito(POLLITO_CAFE_TEXTURA, 770, 200, 4, ...jugadorLimites), // defensa
		new Pollito(POLLITO_CAFE_TEXTURA, 770, 460, 4, ...jugadorLimites), // defensa
		new Pollito(POLLITO_CAFE_TEXTURA, 670, 140, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_CAFE_TEXTURA, 670, 340, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_CAFE_TEXTURA, 670, 500, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_CAFE_TEXTURA, 570, 100, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_CAFE_TEXTURA, 570, 320, 4, ...jugadorLimites), // delantero
		new Pollito(POLLITO_CAFE_TEXTURA, 570, 540, 4, ...jugadorLimites), // delantero
	]

	// Add players
	app.stage.addChild(...jugadores, balon)

	// Inicia el timer al dar click en el botón de inicio
	const startButton = document.getElementById("iniciar") as HTMLButtonElement
	startButton.addEventListener("click", clouserTimer(jugadores, balon))
	startButton.addEventListener("click", () => {
		goles.derecha = 0
		goles.izquierda = 0
		actualizarGoles()
		for (const jugador of jugadores) {
			jugador.start()
		}
	});

	const actualizarGoles = () => {
		const golesIzquierda = document.getElementById('left-goals') as HTMLElement
		const golesDerecha = document.getElementById("right-goals") as HTMLElement

		golesIzquierda.innerText = goles.izquierda.toString()
		golesDerecha.innerText = goles.derecha.toString()
		balon.x = screenWidth / 2
		balon.y = screenHeight / 2
		balon.acceleration = new PIXI.Point(0, 0)
	}

	// Listen for animate update
	app.ticker.add((delta) => {
		// BALOOOON
		balon.loop()

		// If the green square pops out of the cordon, it pops back into the
		// middle
		if ((balon.x < 45 || balon.x > screenWidth - 45)
			|| balon.y < 25 || balon.y > screenHeight - 25) {
			balon.position.set(app.screen.width / 2, app.screen.height / 2);
			balon.acceleration.set(balon.acceleration.x * 0.2, balon.acceleration.y * 0.2);
		}

		// Movimiento Jugadores
		for (const jugador of jugadores) {
			jugador.loop()

			if (testForAABB(jugador, balon)) {
				// Calculate the changes in acceleration that should be made between
				// each square as a result of the collision
				const collisionPush = collisionResponse(balon, jugador);
				// Set the changes in acceleration for both squares
				jugador.acceleration.set(
					-jugador.acceleration.x,
					-jugador.acceleration.y
				)

				balon.acceleration.set(
					-collisionPush.x,
					-collisionPush.y
				)
			}

			jugador.move(delta)
		}


		if (testForAABB(balon, porteriaIzquierda)) {
			goles.derecha++
			actualizarGoles()
		};

		if (testForAABB(balon, porteriaDerecha)) {
			goles.izquierda++
			actualizarGoles()
		};

		balon.move(delta)
	});

};

Main();
