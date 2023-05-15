import { Sprite, Point } from "pixi.js"
import { IMPULSE_POWER } from "./constants"

// Test For Hit
// A basic AABB check between two different squares
export const testForAABB = (object1: Sprite, object2: Sprite): boolean => {
	const bounds1 = object1.getBounds()
	const bounds2 = object2.getBounds()

	return bounds1.x < bounds2.x + bounds2.width
		&& bounds1.x + bounds1.width > bounds2.x
		&& bounds1.y < bounds2.y + bounds2.height
		&& bounds1.y + bounds1.height > bounds2.y
}

// Calculates the results of a collision, allowing us to give an impulse that
// shoves objects apart
export const collisionResponse = (object1: Sprite, object2: Sprite): Point => {
	if (!object1 || !object2)
		return new Point(0)

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

	return new Point(
		vCollisionNorm.x * IMPULSE_POWER,
		vCollisionNorm.y * IMPULSE_POWER,
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
	const points = [[0, 2.83], [1.08, 2.61], [2, 2], [2.61, 1.08],
	[2.83, 0], [2.61, -1.08], [2, -2], [1.08, -2.61],
	[0, -2.83], [-1.08, -2.61], [-2, -2], [-2.61, -1.08],
	[-2.83, 0], [-2.61, 1.08], [-2, 2], [-1.08, 2.61]];

	// Se obtiene un punto aleatorio
	const randomPoint = points[Math.floor(Math.random() * points.length)];

	// Se regresa el punto
	return new Point(randomPoint[0], randomPoint[1]);

}