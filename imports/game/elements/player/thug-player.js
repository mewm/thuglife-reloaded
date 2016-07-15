import {AnimateElement} from "../animate-element";
import PF from "../../../../node_modules/pathfinding";
import {Vector} from "../../lib/vector";
import {GoTo} from "../../actions/goto-action";

export class ThugPlayer extends AnimateElement {
	/**
	 *
	 * @param id
	 * @param position
	 * @param {World} world
	 * @param shape
	 */
	constructor(id, position, world, shape)
	{
		super(id, position, world, shape);
		this._timers = [];
		this._queue = [];
	}


	onClick(event)
	{
		let chunkSize = this.world.settings.chunkSize;
		let cellSize  = this.world.settings.cellSize;
		let clickX = event.x;
		let clickY = event.y;

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