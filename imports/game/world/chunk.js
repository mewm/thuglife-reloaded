export class Chunk {
	constructor(position, tiles, pathFinder, shape)
	{
		this._position   = position;
		this._tiles      = tiles;
		this._pathFinder = pathFinder;
		this._shape      = shape;
	}

	get shape()
	{
		return this._shape;
	}

	set shape(shape)
	{
		this._shape = shape;
	}

	get tiles()
	{
		return this._tiles;
	}

	get pathFinder()
	{
		return this._pathFinder;
	}

	get position()
	{
		return this._position;
	}
}