export class Vector {
	constructor(x, y)
	{
		this._x = x;
		this._y = y;
	}
	
	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	plus(other)
	{
		return new Vector(this.x + other.x, this.y + other.y);
	}

	times(factor)
	{
		return new Vector(this.x * factor, this.y * factor);
	}
}