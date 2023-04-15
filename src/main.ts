import './style.css';
import {Application, Texture, Sprite} from 'pixi.js';
import fieldUrl from './assets/field.jpg';

const Main = () => {
	// Elemento HTML donde se va a agregar el canvas de PixiJS
	const section = document.getElementById('field') as HTMLElement;

	// Crear la aplicación de PixiJS
	const app = new Application({
		width: section.offsetWidth,
		height: section.offsetHeight,
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

};

Main();