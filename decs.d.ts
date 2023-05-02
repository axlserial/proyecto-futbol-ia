declare module "yy-intersects" {
	import { Sprite, Point } from "pixi.js";

	declare class Shape {
		constructor(article: Sprite);
		shape: Sprite;
		update(): void;
		AABBs(AABB: object): boolean;
		collidesPoint(point: Point): boolean;
		collidesCircle();
		collidesRectangle();
		collidesPolygon(polygon: any[], isAABB: boolean): boolean;
		collidesLine(p1: Point, p2: Point): boolean;
		collides(shape: Shape): boolean;
		static lineLine(p1: Point, p2: Point, p3: Point, p4: Point): boolean;
	}

	const options = {
		width: number, 
		height: number, 
		square?: boolean, 
		center?: object, 
		rotation?: object, 
		noRotate?: boolean
	};

	declare class Rectangle extends Shape {
		constructor(article: Sprite, options?: options);
		set(article: Sprite, options?: options): void;
		get width(): number;
		get width(value: number): number;
		get height(): number;
		get height(value: number): number;
		update(): void;
		updateVertices(): void;
		get vertices(): any[];
		collidesRectangle(rectangle: Rectangle): boolean;
		collidesCircle(circle: Circle): boolean;
		static fromRectangle(x: number, y: number, width: number, height: number): Rectangle;
	}

	declare class Circle extends Shape {
		constructor(article: Sprite, options?: options);
		set(options?: options): void;
		update(): void;
		collidesCircle(circle: Circle): boolean;
		collidesPoint(point: Point): boolean;
		collidesLine(p1: Point, p2: Point): boolean;
		collidesRectangle(rectangle: Rectangle): boolean;
	}

	declare class Polygon extends Shape {
		constructor(article: Sprite, points: any[], options?: object);
		set(options?: object): void;
		update(): void;
		collidesRectangle(rectangle: Rectangle): boolean;
		collidesCircle(circle: Circle): boolean;
		collidesPoint(point: Point): boolean;
	}
		

	export const Shape: Shape;
	export const Rectangle: Rectangle;
	export const Polygon: Polygon;
	export const Circle: Circle;
}