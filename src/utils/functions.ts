import { Sprite, Point } from "pixi.js"
import { IMPULSE_POWER } from "./constants"
import { Balon } from "../classes/Balon"
import { Pollito } from "../classes/Pollito"

// Test For Hit
// A basic AABB check between two different squares
export const testForAABB = (object1: Pollito, object2: Balon): boolean => {
	const bounds1 = object1.getBounds()
	const bounds2 = object2.getBounds()

	return bounds1.x < bounds2.x + bounds2.width
		&& bounds1.x + bounds1.width > bounds2.x
		&& bounds1.y < bounds2.y + bounds2.height
		&& bounds1.y + bounds1.height > bounds2.y
	
	return object1.shape.collidesCircle(object2.shape)
}

// Calculates the results of a collision, allowing us to give an impulse that
// shoves objects apart
export const collisionResponse = (object1: Sprite, object2: Sprite): Point => {
	if (!object1 || !object2) {
		return new Point(0)
	}

	const vCollision = new Point(
		object2.x - object1.x,
		object2.y - object1.y,
	)

	const distance = Math.sqrt(
		(object2.x - object1.x) * (object2.x - object1.x)
		+ (object2.y - object1.y) * (object2.y - object1.y),
	)

	const vCollisionNorm = new Point(
		vCollision.x / distance,
		vCollision.y / distance,
	)

	const vRelativeVelocity = new Point(
		object1.acceleration.x - object2.acceleration.x,
		object1.acceleration.y - object2.acceleration.y,
	)

	const speed = vRelativeVelocity.x * vCollisionNorm.x
		+ vRelativeVelocity.y * vCollisionNorm.y

	const impulse = IMPULSE_POWER * speed / (object1.mass + object2.mass);

	return new Point(
		impulse * vCollisionNorm.x,
		impulse * vCollisionNorm.y,
	)
}

// Calculate the distance between two given points
export const distanceBetweenTwoPoints = (p1: Point, p2: Point): number => {
	const a = p1.x - p2.x
	const b = p1.y - p2.y

	return Math.hypot(a, b)
}

// Función que regresa un objeto Punto aleatorio
export const getRandomPoint = (): Point => {
	// Arreglo de posibles puntos de numeros
	const points = [ [0,2.83], [1.08,2.61], [2,2], [2.61,1.08], 
	[2.83,0], [2.61,-1.08], [2,-2], [1.08,-2.61], 
	[0,-2.83], [-1.08,-2.61], [-2,-2], [-2.61,-1.08],
	[-2.83,0], [-2.61,1.08], [-2,2], [-1.08,2.61]];

	// Se obtiene un punto aleatorio
	const randomPoint = points[Math.floor(Math.random() * points.length)];

	// Se regresa el punto
	return new Point(randomPoint[0], randomPoint[1]);

}