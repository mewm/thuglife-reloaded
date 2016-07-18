import {BaseElement} from "./base-element";
import {Vector} from "../lib/vector";

export class AnimateElement extends BaseElement {
	constructor(id, position, game, shape)
	{
		super(id, position, game, shape);
		this._queue           = [];
		this.isThugging       = null;
		this.actionsPerformed = [];
		this.speed            = 1;
	}

	queue(action)
	{
		this._queue.push(action);
		return this._queue;
	}

	next()
	{
		return this._queue.shift();
	}

	tick(event)
	{
		if (this.isThugging === null) {
			let action = this.next();
			if (action !== undefined) {
				this.thug(action);
			}
		}

	}

	thug(action)
	{
		this.isThugging = action;
		action.perform(this, (action) =>
		{
			if (this._queue.length == 0) {
				Players.update({_id: this.id}, {$set: {x: this._position._x, y: this._position._y}});
			}
			// 			console.log(this.queue);
			this.actionsPerformed.push(this.isThugging);
			this.isThugging = null;

		});
	}

	isAtTileCoordinate(vector)
	{
		let cellSize = this.game.settings.cellSize;
		let x        = Math.floor(this.position.x / cellSize);
		let y        = Math.floor(this.position.y / cellSize);
		if (vector._x == x && vector._y == y) {
			return true;
		}

	}

	moveTo(vector)
	{
		let cellSize = this.game.settings.cellSize;
		let x        = vector.x * cellSize;
		let y        = vector.y * cellSize;
		this.shape.x = x;
		this.shape.y = y;
		this.position.set(x, y);
	}

	getChunkPosition(x, y)
	{
		let settings = this.game.settings;
		let worldSize = settings.chunkSize * settings.chunks;
		let chunkSize = settings.chunkSize;
		let chunkX    = Math.floor((worldSize / chunkSize) / (worldSize / x)) * chunkSize;
		let chunkY    = Math.floor((worldSize / chunkSize) / (worldSize / y)) * chunkSize;

		return new Vector(chunkX, chunkY);
	}

	getNewChunkPositionsFromPlayerPosition()
	{
		let settings = this.game.settings;
		let worldSize       = settings.chunkSize * settings.chunks;
		let chunkSize       = settings.chunkSize;
		let chunkLoadRadius = 3;

		let newChunks = [];
		let searchX   = (this._position.x) - (worldSize / chunkLoadRadius);
		let searchY   = (this._position.y) - (worldSize / chunkLoadRadius);

		for (let y = searchY; y < searchY + (chunkLoadRadius * chunkSize); y += chunkSize) {
			for (let x = searchX; x < searchX + (chunkLoadRadius * chunkSize); x += chunkSize) {
				let searchChunkPosition = this.getChunkPosition(x, y);
				newChunks.push(searchChunkPosition);
			}
		}

		return newChunks;
	}

}