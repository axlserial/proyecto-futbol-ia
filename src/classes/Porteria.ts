import { Sprite, Texture } from 'pixi.js'
import Intersect from 'yy-intersects'

export class Porteria extends Sprite {
	public shape

	constructor(x: number, y: number) {
		super(Texture.EMPTY)

		this.width = 34
		this.height = 88

		this.x = x
		this.y = y

		this.shape = new Intersect.Rectangle(this)
	}

}