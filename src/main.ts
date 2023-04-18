import "./style.css";
import { Application, Texture, Sprite } from "pixi.js";
import fieldUrl from "./assets/field.jpg";
import bg from "./assets/bg.svg";
import { timer } from "./timer";

const Main = () => {
	// Agregar el fondo de la página
	document.body.style.backgroundImage = `url(${bg})`;

	// Elemento HTML donde se va a agregar el canvas de PixiJS
	const section = document.getElementById("field") as HTMLElement;

	// Crear la aplicación de PixiJS
	const app = new Application({
		resizeTo: section,
	});

	// Agregar el canvas de PixiJS al elemento HTML
	section.appendChild(app.view as any);

	// Agregar el campo de juego (background)
	const background = Texture.from(fieldUrl);

	// Crear el campo de juego
	const field = new Sprite(background);
	field.width = app.screen.width;
	field.height = app.screen.height;

	// Agregar el campo de juego al stage
	app.stage.addChild(field);

	// Inicia el timer al dar click en el botón de inicio
	const startButton = document.getElementById("iniciar") as HTMLButtonElement;
	startButton.addEventListener("click", () => {
		const timerElement = document.getElementById("timer") as HTMLObjectElement;
		startButton.disabled = true;
		timer(timerElement, startButton);
	});
};

Main();
