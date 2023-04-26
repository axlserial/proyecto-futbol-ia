import "./style.css";
import * as PIXI from "pixi.js";
import fieldUrl from "./assets/field.jpg";
import bg from "./assets/bg.svg";
import { timer } from "./timer";
import { MOVEMENT_SPEED, PELOTA_TEXTURA, POLLITO_BLANCO_TEXTURA } from "./utils/constants";
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


	// Poligono del pollito
	const coord = [
		228, 717, 227, 727, 226, 741, 225, 754, 223, 767, 221, 778, 216, 801,
		214, 817, 213, 831, 212, 846, 211, 860, 212, 873, 218, 886, 226, 898,
		232, 903, 240, 909, 252, 914, 262, 920, 275, 923, 286, 923, 295, 924,
		308, 925, 323, 928, 335, 925, 347, 922, 354, 922, 362, 919, 373, 916,
		379, 910, 388, 905, 392, 899, 391, 915, 385, 926, 382, 937, 379, 952,
		377, 971, 382, 986, 391, 997, 407, 1007, 418, 1013, 435, 1015, 451,
		1018, 467, 1018, 488, 1017, 501, 1015, 516, 1010, 528, 1005, 540, 1000,
		549, 990, 554, 981, 560, 972, 562, 962, 563, 951, 563, 940, 563, 918,
		560, 902, 556, 888, 556, 873, 552, 857, 551, 846, 549, 830, 547, 815,
		546, 797, 542, 781, 539, 768, 533, 753, 521, 741, 534, 727, 547, 704,
		556, 689, 565, 675, 567, 663, 576, 668, 592, 669, 607, 673, 636, 681,
		652, 683, 670, 687, 691, 689, 708, 692, 723, 692, 746, 689, 767, 683,
		776, 674, 779, 657, 772, 644, 757, 631, 734, 618, 718, 613, 702, 603,
		682, 597, 664, 593, 649, 588, 632, 584, 616, 580, 603, 572, 618, 558,
		623, 551, 633, 543, 643, 527, 654, 513, 660, 498, 667, 484, 674, 473,
		678, 457, 686, 433, 689, 410, 692, 398, 694, 378, 695, 358, 693, 347,
		690, 332, 687, 313, 680, 291, 673, 266, 662, 246, 651, 229, 638, 209,
		621, 190, 608, 174, 598, 163, 577, 145, 564, 137, 553, 129, 539, 119,
		519, 107, 499, 100, 479, 92, 463, 87, 443, 85, 431, 70, 424, 36, 416,
		19, 406, 9, 390, 5, 375, 6, 363, 11, 353, 18, 347, 30, 341, 47, 336, 64,
		333, 82, 322, 83, 314, 84, 303, 85, 293, 87, 272, 95, 254, 102, 244,
		108, 229, 115, 214, 123, 197, 140, 182, 149, 167, 160, 154, 175, 135,
		191, 122, 201, 113, 208, 100, 224, 87, 242, 76, 256, 66, 272, 56, 292,
		49, 303, 41, 318, 36, 331, 30, 345, 26, 362, 20, 380, 19, 397, 17, 410,
		16, 429, 20, 455, 28, 475, 34, 494, 42, 508, 52, 522, 64, 538, 73, 549,
		83, 561, 94, 570, 109, 583, 123, 594, 131, 600, 140, 608, 129, 611, 116,
		614, 102, 621, 89, 629, 78, 638, 69, 639, 55, 646, 43, 654, 31, 661, 21,
		666, 6, 681, 3, 698, 3, 711, 16, 719, 33, 726, 56, 726, 77, 722, 91,
		719, 108, 715, 120, 713, 137, 705, 160, 699, 177, 693, 200, 686, 209,
		685, 216, 698, 221, 707,
	];

	const poligono = new PIXI.Polygon(coord)
	
	// mostrar poligono
	const poligonoGrafico = new PIXI.Graphics();
	poligonoGrafico.lineStyle(1, 0x000000);
	// poligonoGrafico.beginFill(0x000000, 0.1);
	// poligonoGrafico.endFill();
	poligonoGrafico.beginTextureFill({texture: POLLITO_BLANCO_TEXTURA});
	poligonoGrafico.drawPolygon(poligono);
	poligonoGrafico.endFill();
	//poligonoGrafico.scale = new PIXI.Point(0.05, 0.05)
	app.stage.addChild(poligonoGrafico);


	// Ball
	const balon = new Balon(PELOTA_TEXTURA, 25, 25, app.screen.width / 2, app.screen.width / 2, 2, 1020, 670);

	const pollo = new Pollito(POLLITO_BLANCO_TEXTURA, 50 * (781 / 1019), 50, 100, 100, 1, 1020, 670)

	const mouseCoords = new PIXI.Point(0, 0);
	app.stage.interactive = true;
	app.stage.hitArea = app.screen;
	app.stage.on('mousemove', (event) => {
		mouseCoords.x = event.global.x;
		mouseCoords.y = event.global.y;
	});

	// Listen for animate update
	app.ticker.add((delta) => {
		pollo.loop()

		// BALOOOON
		balon.loop()

		// If the green square pops out of the cordon, it pops back into the
		// middle
		/* if ((balon.x < -30 || balon.x > (app.screen.width + 30))
			|| balon.y < -30 || balon.y > (app.screen.height + 30)) {
			balon.position.set(app.screen.width / 2, app.screen.height / 2);
		} */

		// If the mouse is off screen, then don't update any further
		if (app.screen.width > mouseCoords.x || mouseCoords.x > 0
			|| app.screen.height > mouseCoords.y || mouseCoords.y > 0) {
			// Get the red square's center point
			const redSquareCenterPosition = new PIXI.Point(
				pollo.x,
				pollo.y,
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
			pollo.acceleration.set(
				Math.cos(angleToMouse) * redSpeed,
				Math.sin(angleToMouse) * redSpeed,
			);
		}

		// If the two squares are colliding
		if (testForAABB(balon, pollo)) {
			// Calculate the changes in acceleration that should be made between
			// each square as a result of the collision
			const collisionPush = collisionResponse(balon, pollo);
			// Set the changes in acceleration for both squares
			pollo.acceleration.set(
				(collisionPush.x * balon.mass),
				(collisionPush.y * balon.mass),
			);
			balon.acceleration.set(
				-(collisionPush.x * pollo.mass),
				-(collisionPush.y * pollo.mass),
			);
		}

		if (testForAABB(balon, porteriaIzquierda)) {
			console.log("Gol en la izquierda");
		};

		if (testForAABB(balon, porteriaDerecha)) {
			console.log("Gol en la derecha");
		};


		balon.move(delta)
		pollo.move(delta)
	});

	// Add to stage
	app.stage.addChild(pollo, balon);

};

Main();
