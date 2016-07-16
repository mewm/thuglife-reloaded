import {AnimateElement} from "../animate-element";
import PF from "../../../../node_modules/pathfinding";
import {Vector} from "../../lib/vector";
import {GoTo} from "../../actions/goto-action";

export class ThugPlayer extends AnimateElement {
	/**
	 *
	 * @param id
	 * @param name
	 * @param position
	 * @param {World} world
	 * @param shape
	 */
	constructor(id, name, position, world, shape)
	{
		super(id, position, world, shape);
		this._name = name;
		this._timers = [];
		this._queue  = [];
	}
	
	get name()
	{
	return this._name;
	}
	
	
	set name(name)
	{
		this._name = name;
	}

	onClick(event)
	{
		cn.local('Click received. Moving <b>' + this.name + '</b> to ' + event.x +',' + event.y);
		
		let chunkSize = this.world.settings.chunkSize;
		let cellSize  = this.world.settings.cellSize;
		let chunks    = this.world.settings.chunks;
		let clickX    = event.x;
		let clickY    = event.y;
		let originX   = Math.floor(((chunkSize * chunks) / cellSize) / ((chunkSize * chunks) / this.shape.x));
		let originY   = Math.floor(((chunkSize * chunks) / cellSize) / ((chunkSize * chunks) / this.shape.y));
		let moveX     = Math.floor(((chunkSize * chunks) / cellSize) / ((chunkSize * chunks) / clickX));
		let moveY     = Math.floor(((chunkSize * chunks) / cellSize) / ((chunkSize * chunks) / clickY));

		let pathFinder = this.world.pathFinder.clone();
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
			let vector  = new Vector(v[0], v[1]);
			let timeout = setTimeout(() =>
			{
				super.queue(new GoTo(vector));
			}, i);

			this._timers.push(timeout);

			i += 100;
		});
	}
} 