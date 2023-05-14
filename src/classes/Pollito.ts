import { Point, Sprite, Texture } from 'pixi.js'
import Intersect from 'yy-intersects'
import { getRandomPoint } from '../utils/functions'

export class Pollito extends Sprite {
	private pointLeftTop: Point
	private pointBottomRight: Point
	public shape: Intersect.Rectangle

	constructor(image: Texture, x: number, y: number, mass: number, pointLeftTop: Point, pointBottomRight: Point) {
		super(image)
		this.anchor.set(0.5)
		this.position.set(x, y)
		this.acceleration = getRandomPoint()
		this.mass = mass
		this.pointLeftTop = pointLeftTop
		this.pointBottomRight = pointBottomRight
		this.shape = new Intersect.Rectangle(this/* , [
			19, 4, 14, 6, 10, 9, 7, 13, 3, 17, 2, 20, 1, 25, 3, 29, 5, 32, 8, 34, 4, 37, 0, 40, 3, 42, 6, 41, 10, 40, 13, 40, 13, 42, 12, 46, 12, 50, 15, 53, 20, 54, 22, 50, 22, 57, 25, 59, 30, 58, 33, 53, 32, 48, 30, 43, 33, 40, 35, 38, 39, 40, 43, 40, 44, 37, 39, 34, 33, 34, 38, 30, 40, 24, 40, 17, 36, 12, 31, 7, 25, 4, 21, 0
		] */)
	}

	// Chechar limites del campo
	private checkLimits(): void {
		// Check whether the little chicken ever moves off the screen
		// If so, reverse acceleration in that direction

		if (this.x < (this.pointLeftTop.x + this.width / 2) || this.x > (this.pointBottomRight.x - this.width / 2)) {
			this.acceleration.x = -this.acceleration.x
			this.x += this.acceleration.x
		}

		if (this.y < (this.pointLeftTop.y + this.height / 2) || this.y > (this.pointBottomRight.y - this.height / 2)) {
			this.acceleration.y = -this.acceleration.y
			this.y += this.acceleration.y
		}
	}

	// Acciones del balón en el loop
	public loop(): void {
		// Limits
		this.checkLimits()
	}

	public move(delta: number): void {
		// Move ball
		this.x += this.acceleration.x * delta
		this.y += this.acceleration.y * delta
	}
}