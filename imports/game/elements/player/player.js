import {AnimateElement} from "../animate-element";
import PF from "../../../../node_modules/pathfinding";
import {Vector} from "../../lib/vector";
import {GoTo} from "../../actions/goto-action";
import {ReactiveVar} from "meteor/reactive-var";

export class Player extends AnimateElement {
	/**
	 *
	 * @param id
	 * @param name
	 * @param position
	 * @param {World} world
	 * @param shape
	 * @param playerEventCollection
	 */
	constructor(id, name, position, world, playerEventCollection, shape)
	{
		super(id, position, world, shape);
		this.playerEventCollection = playerEventCollection;
		this._queue = [];
		this._timers = [];
		this._name = name;
		this._energy = new ReactiveVar(100);
	}
	
	get energy()
	{
		return this._energy.get();
	}

	set energy(level)
	{
		this._energy.set(level);
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
		console.log('clock');
		let chunkSize = this.world.settings.chunkSize;
		let cellSize  = this.world.settings.cellSize;
		let chunks = this.world.settings.chunks;
		let clickX = event.data.global.x + (this.world.camera.scene.pivot.x - 512);
		let clickY = event.data.global.y + (this.world.camera.scene.pivot.y - 512);

		this.playerEventCollection.insert({a: 'c', t: this.id, x: clickX, y: clickY, createdAt: new Date()});
		let originX = Math.floor(((chunkSize * chunks) / cellSize) / ((chunkSize * chunks) / this.shape.x));
		let originY = Math.floor(((chunkSize * chunks) / cellSize) / ((chunkSize * chunks) / this.shape.y));
		let moveX   = Math.floor(((chunkSize * chunks) / cellSize) / ((chunkSize * chunks) / clickX));
		let moveY   = Math.floor(((chunkSize * chunks) / cellSize) / ((chunkSize * chunks) / clickY));

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
			let vector = new Vector(v[0], v[1]);
			let timeout = setTimeout(() => {
				super.queue(new GoTo(vector));
			}, i);

			this._timers.push(timeout);

			i += 100;
		});
	}
} 