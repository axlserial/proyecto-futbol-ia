import "./style.css";
import * as PIXI from "pixi.js";
import fieldUrl from "./assets/field.jpg";
import bg from "./assets/bg.svg";
import { timer } from "./timer";
import { MOVEMENT_SPEED, PELOTA_TEXTURA, POLLITO_BLANCO_TEXTURA, POLLITO_CAFE_TEXTURA } from "./utils/constants";
import { collisionResponse, distanceBetweenTwoPoints, testForAABB } from "./utils/functions";
import { Balon } from "./classes/Balon";
import { Pollito } from "./classes/Pollito";
import { Porteria } from "./classes/Porteria";

declare module "pixi.js" {
	interface Sprite {
		acceleration: PIXI.Point;
		mass: number;
	}
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

	// Inicia el timer al dar click en el botón de inicio
	const startButton = document.getElementById("iniciar") as HTMLButtonElement;
	startButton.addEventListener("click", timer);

	// Porteria derecha
	const porteriaDerecha = new Porteria(975, 291)
	app.stage.addChild(porteriaDerecha);

	// Porteria izquierda
	const porteriaIzquierda = new Porteria(app.screen.width - 1009, app.screen.height - 380)
	app.stage.addChild(porteriaIzquierda);

	// Ball
	const balon = new Balon(PELOTA_TEXTURA, 25, 25, screenWidth / 2, screenHeight / 2, 2, screenWidth, screenHeight);

	const jugadores = [
		new Pollito(POLLITO_BLANCO_TEXTURA, 80, 330, 4, new PIXI.Point(45, 100), new PIXI.Point(screenWidth / 4, screenHeight - 100)), // portero
		new Pollito(POLLITO_BLANCO_TEXTURA, 250, 200, 4, new PIXI.Point(45, 25), new PIXI.Point(screenWidth / 2, screenHeight - 25)), // defensa
		new Pollito(POLLITO_BLANCO_TEXTURA, 250, 460, 4, new PIXI.Point(45, 25), new PIXI.Point(screenWidth / 2, screenHeight - 25)), // defensa
		new Pollito(POLLITO_BLANCO_TEXTURA, 400, 150, 4, new PIXI.Point(screenWidth / 3, 25), new PIXI.Point(screenWidth - 45, screenHeight - 25)), // delantero
		new Pollito(POLLITO_BLANCO_TEXTURA, 400, 330, 4, new PIXI.Point(screenWidth / 3, 25), new PIXI.Point(screenWidth - 45, screenHeight - 25)), // delantero
		new Pollito(POLLITO_BLANCO_TEXTURA, 400, 530, 4, new PIXI.Point(screenWidth / 3, 25), new PIXI.Point(screenWidth - 45, screenHeight - 25)), // delantero

		new Pollito(POLLITO_CAFE_TEXTURA, 920, 330, 4, new PIXI.Point(screenWidth - 230, 100), new PIXI.Point(screenWidth - 45, screenHeight - 100)), // portero
		new Pollito(POLLITO_CAFE_TEXTURA, 770, 200, 4, new PIXI.Point(screenWidth / 2, 25), new PIXI.Point(screenWidth - 45, screenHeight - 25)), // defensa
		new Pollito(POLLITO_CAFE_TEXTURA, 770, 460, 4, new PIXI.Point(screenWidth / 2, 25), new PIXI.Point(screenWidth - 45, screenHeight - 25)), // defensa
		new Pollito(POLLITO_CAFE_TEXTURA, 620, 150, 4, new PIXI.Point(45, 25), new PIXI.Point(screenWidth - 270, screenHeight - 25)), // delantero
		new Pollito(POLLITO_CAFE_TEXTURA, 620, 330, 4, new PIXI.Point(45, 25), new PIXI.Point(screenWidth - 270, screenHeight - 25)), // delantero
		new Pollito(POLLITO_CAFE_TEXTURA, 620, 530, 4, new PIXI.Point(45, 25), new PIXI.Point(screenWidth - 270, screenHeight - 25)), // delantero
	]

	// Add players
	app.stage.addChild(...jugadores, balon)


	const mouseCoords = new PIXI.Point(0, 0);
	app.stage.interactive = true;
	app.stage.hitArea = app.screen;
	app.stage.on('mousemove', (event) => {
		mouseCoords.x = event.global.x;
		mouseCoords.y = event.global.y;
	});

	// Listen for animate update
	app.ticker.add((delta) => {

		for (const jugador of jugadores)
			jugador.loop()

		// BALOOOON
		balon.loop()

		// If the green square pops out of the cordon, it pops back into the
		// middle
		/* if ((balon.x < -30 || balon.x > (app.screen.width + 30))
			|| balon.y < -30 || balon.y > (app.screen.height + 30)) {
			balon.position.set(app.screen.width / 2, app.screen.height / 2);
		} */

		// If the mouse is off screen, then don't update any further
		/* if (app.screen.width > mouseCoords.x || mouseCoords.x > 0
			|| app.screen.height > mouseCoords.y || mouseCoords.y > 0) {
			// Get the red square's center point
			const redSquareCenterPosition = new PIXI.Point(
				jugadores[0].x,
				jugadores[0].y,
			);

			// Calculate the direction vector between the mouse pointer and
			// the red square
			const toMouseDirection = new PIXI.Point(
				mouseCoords.x - redSquareCenterPosition.x,
				mouseCoords.y - redSquareCenterPosition.y,
			);

			// Use the above to figure out the angle that direction has
			const angleToMouse = Math.atan2(
				toMouseDirection.y,
				toMouseDirection.x,
			);

			// Figure out the speed the square should be travelling by, as a
			// function of how far away from the mouse pointer the red square is
			const distMouseRedSquare = distanceBetweenTwoPoints(
				mouseCoords,
				redSquareCenterPosition,
			);
			const redSpeed = distMouseRedSquare * MOVEMENT_SPEED;

			// Calculate the acceleration of the red square
			jugadores[0].acceleration.set(
				Math.cos(angleToMouse) * redSpeed,
				Math.sin(angleToMouse) * redSpeed,
			);
		} */

		// If the two squares are colliding
		if (balon.shape.collidesRectangle(jugadores[0].shape))
			console.log('si porfa')

		for (const jugador of jugadores) {
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
/* 					-(collisionPush.x * jugador.mass),
					-(collisionPush.y * jugador.mass), */
				)
			}
		}


		if (balon.shape.collidesRectangle(porteriaIzquierda.shape)) {
			console.log("Gol en la izquierda");
		};

		if (balon.shape.collidesRectangle(porteriaDerecha.shape)) {
			console.log("Gol en la derecha");
		};


		balon.move(delta)
		for (const jugador of jugadores)
			jugador.move(delta)
	});

};

Main();
