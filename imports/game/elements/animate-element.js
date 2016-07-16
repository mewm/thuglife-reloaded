import {BaseElement} from "./base-element";
import {Vector} from "../lib/vector";

export class AnimateElement extends BaseElement {
	constructor(id, position, world, shape)
	{
		super(id, position, world, shape);
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
		super.tick();
		if (this.isThugging === null) {
			let action = this.next();
			//console.log('shoud do', action);
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
			// 			console.log(this.queue);
			this.actionsPerformed.push(this.isThugging);
			this.isThugging = null;
		});
	}

	moveTo(vector)
	{
		let x = vector.x * this.world.settings.cellSize;
		let y = vector.y * this.world.settings.cellSize;

		this.position = vector;
		this.shape.x  = x;
		this.shape.y  = y;
	}

	getChunkPosition(x, y) 
	{
		let worldSize = this.world.settings.chunkSize*this.world.settings.chunks;
		let chunkSize = this.world.settings.chunkSize;
		let chunkX   = Math.floor((worldSize / chunkSize) / (worldSize / x)) * chunkSize;
		let chunkY   = Math.floor((worldSize / chunkSize) / (worldSize / y)) * chunkSize;

		return new Vector(chunkX, chunkY);
	}

	getNewChunkPositionsFromPlayerPosition() 
	{
		let worldSize = this.world.settings.chunkSize*this.world.settings.chunks;
		let chunkSize = this.world.settings.chunkSize;
		let chunkRadius = this.world.settings.chunks;
		let chunkLoadRadius = 3;
		let currentChunkPosition = this.getChunkPosition(this.position.x*this.world.settings.cellSize, this.position.y*this.world.settings.cellSize);

		let newChunks = []
		let searchX = (this.position.x*this.world.settings.cellSize) - (worldSize/chunkLoadRadius);
		let searchY = (this.position.y*this.world.settings.cellSize) - (worldSize/chunkLoadRadius);

		for(let y = searchY; y < searchY+(chunkLoadRadius*chunkSize); y += chunkSize) {
			for(let x = searchX; x < searchX+(chunkLoadRadius*chunkSize); x += chunkSize) {
			  let searchChunkPosition = this.getChunkPosition(x,y);
			  newChunks.push(searchChunkPosition);
			}
		}

		return newChunks;
	}

}