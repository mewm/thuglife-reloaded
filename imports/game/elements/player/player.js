import {AnimateElement} from "../animate-element";
import PF from "../../../../node_modules/pathfinding";
import {Vector} from "../../lib/vector";
import {GoTo} from "../../actions/goto-action";

export class Player extends AnimateElement {
	/**
	 *
	 * @param id
	 * @param position
	 * @param {World} world
	 * @param shape
	 * @param playerEventCollection
	 */
	constructor(id, position, world, playerEventCollection, shape)
	{
		super(id, position, world, shape);
		console.log('Player constructed');
		this.playerEventCollection = playerEventCollection;
		this._queue = [];
		this._timers = [];

	}

	onClick(event)
	{
		let chunkSize = this.world.settings.chunkSize;
		let cellSize  = this.world.settings.cellSize;
		let clickX = event.data.global.x + (this.world.camera.world.pivot.x - 512);
		let clickY = event.data.global.y + (this.world.camera.world.pivot.y - 512);

		this.playerEventCollection.insert({a: 'c', t: this.id, x: clickX, y: clickY});
		let originX = Math.floor((chunkSize / cellSize) / (chunkSize / this.shape.x));
		let originY = Math.floor((chunkSize / cellSize) / (chunkSize / this.shape.y));
		let moveX   = Math.floor((chunkSize / cellSize) / (chunkSize / clickX));
		let moveY   = Math.floor((chunkSize / cellSize) / (chunkSize / clickY));

		let tiles      = chunkSize / cellSize;
		let x          = Math.floor(clickX / cellSize);
		let y          = Math.floor(clickY / cellSize);
		let chunkIndex = (y * tiles) + x;

		let chunk = this.world.chunks[0];

		let pathFinder = chunk.pathFinder.clone();
		let finder     = new PF.AStarFinder({
			allowDiagonal: true
		});

		let path = finder.findPath(originX, originY, moveX, moveY, pathFinder);

		this._queue = _.reject(this._queue, (item) => 
		{
			return item.constructor.name == "GoTo";
		});

		this._timers.map((timer) => 
		{
			clearTimeout(timer);
		});
		

		let i = 0;
		path.map((v) =>
		{
			let vector = new Vector(v[0], v[1]);
			let timeout = setTimeout(() => {
				super.queue(new GoTo(vector));
			}, i);

			this._timers.push(timeout);

			i += 100;
		});
	}
} 