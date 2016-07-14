import {Vector} from "../lib/vector";

export class BaseElement {
	/**
	 * @param id
	 * @param {Vector} position
	 * @param {World} world
	 * @param shape
	 */
	constructor(id, position, world, shape)
	{
		this._id       = id;
		this._position = position;
		this._world    = world;
		this._shape    = shape;
	}

	/**
	 * @param {Vector} vector
	 */
	set position(vector)
	{
		this._position = vector;
	}
	
	get shape()
	{
		return this._shape;
	}
	
	set shape(shape)
	{
		this._shape = shape;
	}

	/**
	 * @returns {Vector}
	 */
	get position()
	{
		return this._position;
	}

	get world()
	{
		return this._world;
	}

	/**
	 * @returns {string}
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * @returns {int}
	 */
	getCellInChunk()
	{
		let cellSize  = this.world.settings.cellSize;
		let chunkSize = this.world.settings.chunkSize;
		let tiles     = chunkSize / cellSize;

		let x = Math.floor(this._position.x / cellSize);
		let y = Math.floor(this._position.y / cellSize);

		let cell = (y * tiles) + x;

		return cell;
	}

	getCellIFromPosition(x, y)
	{
		let cellSize  = this.world.settings.cellSize;
		let chunkSize = this.world.settings.cellSize;
		let tiles     = chunkSize / cellSize;

		let _x = Math.floor(x / cellSize);
		let _y = Math.floor(y / cellSize);

		let cell = (_y * tiles) + _x;

		return cell;
	}

	/**
	 * @returns {Vector}
	 */
	getCellPositionFromCellNumber(n)
	{
// 		return new Vector(this.world.settings.cellSize / n, this.world.settings.cellSize / n);
	}
}