import { Point, Polygon, Sprite, Texture } from 'pixi.js'

export class Pollito extends Sprite {
	private screenWidth: number
	private screenHeight: number

	constructor(image: Texture, width: number, height: number, x: number, y: number, mass: number, screenWidth: number, screenHeight: number) {
		super(image)
		this.anchor.set(0.5)
		this.position.set(x, y)
		this.width = width
		this.height = height
		this.acceleration = new Point(3, 2)
		this.mass = mass
		this.screenWidth = screenWidth
		this.screenHeight = screenHeight
		this.hitArea = new Polygon([
			228, 717, 227, 727, 226, 741, 225, 754, 223, 767, 221, 778, 216, 801, 214, 817, 213, 831, 212, 846, 211, 860, 212, 873, 218, 886, 226, 898, 232, 903, 240, 909, 252, 914, 262, 920, 275, 923, 286, 923, 295, 924, 308, 925, 323, 928, 335, 925, 347, 922, 354, 922, 362, 919, 373, 916, 379, 910, 388, 905, 392, 899, 391, 915, 385, 926, 382, 937, 379, 952, 377, 971, 382, 986, 391, 997, 407, 1007, 418, 1013, 435, 1015, 451, 1018, 467, 1018, 488, 1017, 501, 1015, 516, 1010, 528, 1005, 540, 1000, 549, 990, 554, 981, 560, 972, 562, 962, 563, 951, 563, 940, 563, 918, 560, 902, 556, 888, 556, 873, 552, 857, 551, 846, 549, 830, 547, 815, 546, 797, 542, 781, 539, 768, 533, 753, 521, 741, 534, 727, 547, 704, 556, 689, 565, 675, 567, 663, 576, 668, 592, 669, 607, 673, 636, 681, 652, 683, 670, 687, 691, 689, 708, 692, 723, 692, 746, 689, 767, 683, 776, 674, 779, 657, 772, 644, 757, 631, 734, 618, 718, 613, 702, 603, 682, 597, 664, 593, 649, 588, 632, 584, 616, 580, 603, 572, 618, 558, 623, 551, 633, 543, 643, 527, 654, 513, 660, 498, 667, 484, 674, 473, 678, 457, 686, 433, 689, 410, 692, 398, 694, 378, 695, 358, 693, 347, 690, 332, 687, 313, 680, 291, 673, 266, 662, 246, 651, 229, 638, 209, 621, 190, 608, 174, 598, 163, 577, 145, 564, 137, 553, 129, 539, 119, 519, 107, 499, 100, 479, 92, 463, 87, 443, 85, 431, 70, 424, 36, 416, 19, 406, 9, 390, 5, 375, 6, 363, 11, 353, 18, 347, 30, 341, 47, 336, 64, 333, 82, 322, 83, 314, 84, 303, 85, 293, 87, 272, 95, 254, 102, 244, 108, 229, 115, 214, 123, 197, 140, 182, 149, 167, 160, 154, 175, 135, 191, 122, 201, 113, 208, 100, 224, 87, 242, 76, 256, 66, 272, 56, 292, 49, 303, 41, 318, 36, 331, 30, 345, 26, 362, 20, 380, 19, 397, 17, 410, 16, 429, 20, 455, 28, 475, 34, 494, 42, 508, 52, 522, 64, 538, 73, 549, 83, 561, 94, 570, 109, 583, 123, 594, 131, 600, 140, 608, 129, 611, 116, 614, 102, 621, 89, 629, 78, 638, 69, 639, 55, 646, 43, 654, 31, 661, 21, 666, 6, 681, 3, 698, 3, 711, 16, 719, 33, 726, 56, 726, 77, 722, 91, 719, 108, 715, 120, 713, 137, 705, 160, 699, 177, 693, 200, 686, 209, 685, 216, 698, 221, 707
		])
	}

	// Chechar limites del campo
	private checkLimits(): void {
		// Check whether the little chicken ever moves off the screen
		// If so, reverse acceleration in that direction
		const boundX = 45 + this.width / 2
		const boundY = 25 + this.height / 2

		if (this.x < boundX || this.x > (this.screenWidth - boundX)) {
			this.acceleration.x = -this.acceleration.x
		}

		if (this.y < boundY || this.y > (this.screenHeight - boundY)) {
			this.acceleration.y = -this.acceleration.y
		}
	}

	// Acciones del balón en el loop
	public loop(): void {
		//Reducing the acceleration by 0.01% of the acceleration
		//this.acceleration.set(this.acceleration.x * 0.99, this.acceleration.y * 0.99)

		// Limits
		this.checkLimits()
	}

	public move(delta: number): void {
		// Move ball
		this.x += this.acceleration.x * delta
		this.y += this.acceleration.y * delta
	}
}