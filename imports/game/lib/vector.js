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
		return new Vector(this._x + other._x, this._y + other._y);
	}

	times(factor)
	{
		return new Vector(this._x * factor, this._y * factor);
	}

	set(x, y) {
	this.x = x;
	this.y = y;

	return this;
	}

	copy(v) {
		this.x = v.x;
		this.y = v.y;

		return this;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	add(v1, v2) {
		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;

		return this;
	}

	addSelf(v) {
		this.x += v.x;
		this.y += v.y;

		return this;
	}

	multiplyScalar(s) {
		this.x *= s;
		this.y *= s;

		return this;
	}

	devideScalar(s) {
		if(s) {
			this.x /= s;
			this.y /= s;
		} else {
			this.x = 0;
			this.y = 0;
		}

		return this;
	}

	negate() {
		return this.multiplyScalar(-1);
	}

	dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y;
	}

	length() {
		return Math.sqrt( this.lengthSq() );
	}

	normalize() {
		return this.devideScalar( this.length() );
	}

	distanceTo(v) {
		return Math.sqrt( this.distanceToSquared(v) );
	}

	distanceToSquared(v) {
		var dx = this.x - v.x;
		var dy = this.y - v.y;

		return dx * dx + dy * dy;
	}

	setLength(l) {
		return this.normalize().multiplyScalar(l);
	}

	equals(v) {
		return ((v.x === this.x) && (v.y === this.y));
	}

	findAngleBetween(v) {
		return Math.atan2(v.x-this.x, v.y-this.y);
	}
}