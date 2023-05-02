import "./style.css";
import * as PIXI from "pixi.js";
import fieldUrl from "./assets/field.jpg";
import bg from "./assets/bg.svg";
import { timer } from "./timer";
import { MOVEMENT_SPEED, PELOTA_TEXTURA, POLLITO_BLANCO_TEXTURA, POLLITO_CAFE_TEXTURA } from "./utils/constants";
import { collisionResponse, distanceBetweenTwoPoints, testForAABB } from "./utils/functions";
import { Balon } from "./classes/Balon";
import { Pollito } from "./classes/Pollito";

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
	const porteriaDerecha = new PIXI.Sprite(PIXI.Texture.WHITE);
	porteriaDerecha.width = 34;
	porteriaDerecha.height = 88;

	porteriaDerecha.x = 975;
	porteriaDerecha.y = 291;

	porteriaDerecha.tint = 0x3500FA;

	app.stage.addChild(porteriaDerecha);

	// Porteria izquierda
	const porteriaIzquierda = new PIXI.Sprite(PIXI.Texture.WHITE);
	porteriaIzquierda.width = 34;
	porteriaIzquierda.height = 88;

	porteriaIzquierda.x = app.screen.width - 1009;
	porteriaIzquierda.y = app.screen.height - 380;

	porteriaIzquierda.tint = 0x3500FA;

	app.stage.addChild(porteriaIzquierda);

	// Ball
	const balon = new Balon(PELOTA_TEXTURA, 25, 25, app.screen.width / 2, app.screen.height / 2, 2, 1020, 670);

	const polloBlanco1 = new Pollito(POLLITO_BLANCO_TEXTURA, 60 * (781 / 1019), 60, 80, 330, 4, 1020, 670)
	const polloBlanco2 = new Pollito(POLLITO_BLANCO_TEXTURA, 60 * (781 / 1019), 60, 250, 200, 4, 1020, 670)
	const polloBlanco3 = new Pollito(POLLITO_BLANCO_TEXTURA, 60 * (781 / 1019), 60, 250, 460, 4, 1020, 670)
	const polloBlanco4 = new Pollito(POLLITO_BLANCO_TEXTURA, 60 * (781 / 1019), 60, 400, 150, 4, 1020, 670)
	const polloBlanco5 = new Pollito(POLLITO_BLANCO_TEXTURA, 60 * (781 / 1019), 60, 400, 330, 4, 1020, 670)
	const polloBlanco6 = new Pollito(POLLITO_BLANCO_TEXTURA, 60 * (781 / 1019), 60, 400, 530, 4, 1020, 670)

	const polloCafe1 = new Pollito(POLLITO_CAFE_TEXTURA, 60 * (781 / 1019), 60, 930, 330, 4, 1020, 670)
	const polloCafe2 = new Pollito(POLLITO_CAFE_TEXTURA, 60 * (781 / 1019), 60, 770, 200, 4, 1020, 670)
	const polloCafe3 = new Pollito(POLLITO_CAFE_TEXTURA, 60 * (781 / 1019), 60, 770, 460, 4, 1020, 670)
	const polloCafe4 = new Pollito(POLLITO_CAFE_TEXTURA, 60 * (781 / 1019), 60, 620, 150, 4, 1020, 670)
	const polloCafe5 = new Pollito(POLLITO_CAFE_TEXTURA, 60 * (781 / 1019), 60, 620, 330, 4, 1020, 670)
	const polloCafe6 = new Pollito(POLLITO_CAFE_TEXTURA, 60 * (781 / 1019), 60, 620, 530, 4, 1020, 670)

	const mouseCoords = new PIXI.Point(0, 0);
	app.stage.interactive = true;
	app.stage.hitArea = app.screen;
	app.stage.on('mousemove', (event) => {
		mouseCoords.x = event.global.x;
		mouseCoords.y = event.global.y;
	});

	// Listen for animate update
	app.ticker.add((delta) => {
		polloBlanco1.loop()
		polloBlanco2.loop()
		polloBlanco3.loop()
		polloBlanco4.loop()
		polloBlanco5.loop()
		polloBlanco6.loop()

		polloCafe1.loop()
		polloCafe2.loop()
		polloCafe3.loop()
		polloCafe4.loop()
		polloCafe5.loop()
		polloCafe6.loop()

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
				polloBlanco1.x,
				polloBlanco1.y,
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
			polloBlanco1.acceleration.set(
				Math.cos(angleToMouse) * redSpeed,
				Math.sin(angleToMouse) * redSpeed,
			);
		} */

		// If the two squares are colliding
		if (testForAABB(balon, polloBlanco1)) {
			// Calculate the changes in acceleration that should be made between
			// each square as a result of the collision
			const collisionPush = collisionResponse(balon, polloBlanco1);
			// Set the changes in acceleration for both squares
			polloBlanco1.acceleration.set(
				(collisionPush.x * balon.mass),
				(collisionPush.y * balon.mass),
			);
			balon.acceleration.set(
				-(collisionPush.x * polloBlanco1.mass),
				-(collisionPush.y * polloBlanco1.mass),
			);
		}

		if (testForAABB(balon, polloBlanco2)) {
			// Calculate the changes in acceleration that should be made between
			// each square as a result of the collision
			const collisionPush = collisionResponse(balon, polloBlanco2);
			// Set the changes in acceleration for both squares
			polloBlanco2.acceleration.set(
				(collisionPush.x * balon.mass),
				(collisionPush.y * balon.mass),
			);
			balon.acceleration.set(
				-(collisionPush.x * polloBlanco2.mass),
				-(collisionPush.y * polloBlanco2.mass),
			);
		}

		if (testForAABB(balon, polloBlanco3)) {
			// Calculate the changes in acceleration that should be made between
			// each square as a result of the collision
			const collisionPush = collisionResponse(balon, polloBlanco3);
			// Set the changes in acceleration for both squares
			polloBlanco3.acceleration.set(
				(collisionPush.x * balon.mass),
				(collisionPush.y * balon.mass),
			);
			balon.acceleration.set(
				-(collisionPush.x * polloBlanco3.mass),
				-(collisionPush.y * polloBlanco3.mass),
			);
		}

		if (testForAABB(balon, porteriaIzquierda)) {
			console.log("Gol en la izquierda");
		};

		if (testForAABB(balon, porteriaDerecha)) {
			console.log("Gol en la derecha");
		};


		balon.move(delta)
		polloBlanco1.move(delta)
		polloBlanco2.move(delta)
		polloBlanco3.move(delta)
		polloBlanco4.move(delta)
		polloBlanco5.move(delta)
		polloBlanco6.move(delta)

		polloCafe1.move(delta)
		polloCafe2.move(delta)
		polloCafe3.move(delta)
		polloCafe4.move(delta)
		polloCafe5.move(delta)
		polloCafe6.move(delta)
	});

	// Add to stage
	app.stage.addChild(polloBlanco1, polloBlanco2, polloBlanco3, polloBlanco4, polloBlanco5, polloBlanco6, balon)
	app.stage.addChild(polloCafe1, polloCafe2, polloCafe3, polloCafe4, polloCafe5, polloCafe6)

};

Main();
