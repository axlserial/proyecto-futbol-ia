import { Point, Sprite, Texture } from 'pixi.js'
import Intersect from 'yy-intersects'

export class Balon extends Sprite {
	private screenWidth: number
	private screenHeight: number
	public shape: Intersect.Circle

	constructor(image: Texture, width: number, height: number, x: number, y: number, mass: number, screenWidth: number, screenHeight: number) {
		super(image)
		this.anchor.set(0.5)
		this.position.set(x, y)
		this.width = width
		this.height = height
		this.acceleration = new Point(0)
		this.mass = mass
		this.screenWidth = screenWidth
		this.screenHeight = screenHeight
		this.shape = new Intersect.Circle(this)
	}

	// Chechar limites del campo
	private checkLimits(): void {
		// Check whether the ball ever moves off the screen
		// If so, reverse acceleration in that direction
		const boundX = 45 + this.width / 2
		const boundY = 25 + this.height / 2

		if (this.x < boundX || this.x > (this.screenWidth - boundX)) {
			this.acceleration.x = -this.acceleration.x
			this.x += this.acceleration.x
		}

		if (this.y < boundY || this.y > (this.screenHeight - boundY)) {
			this.acceleration.y = -this.acceleration.y
			this.y += this.acceleration.y
		}
	}

	// Acciones del balón en el loop
	public loop(): void {
		//Reducing the acceleration by 0.01% of the acceleration
		this.acceleration.set(this.acceleration.x * 0.999, this.acceleration.y * 0.999)

		// Limits
		this.checkLimits()
	}

	public move(delta: number): void {
		// Move ball
		this.x += this.acceleration.x * delta
		this.y += this.acceleration.y * delta
	}

	public pause() {
		this.acceleration.set(0)
	}
}