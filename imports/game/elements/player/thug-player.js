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
	 * @param {Game} game
	 */
	constructor(id, name, position, game)
	{
		super(id, position, game);
		this._name   = name;
		this._timers = [];
		this._queue  = [];
		this._shape  = game.engine.ef.createPlayerContainer(this);
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
		// Absolute world coordinates 

		let clickX = event.x;
		let clickY = event.y;

		let path = this.getPathFinderFromClicksAndClearTimers(clickX, clickY, false, event);
		let i    = 0;
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

	getPathFinderFromClicksAndClearTimers(clickX, clickY, isPlaying, event)
	{

		let cellSize = this.game.settings.cellSize;
		let world    = this.game.world;

		let originX    = Math.floor((this.shape.x - world.position.x) / cellSize);
		let originY    = Math.floor((this.shape.y - world.position.y) / cellSize);
		let moveX      = Math.floor((clickX - world.position.x) / cellSize);
		let moveY      = Math.floor((clickY - world.position.y) / cellSize);
		let pathFinder = this.game.pathFinder.clone();
		let finder     = new PF.AStarFinder({
			allowDiagonal: true
		});

		let path = finder.findPath(originX, originY, moveX, moveY, pathFinder);

		this._queue = _.reject(this._queue, (item) =>
		{
			return item.constructor.name == "GoTo";
		});

		// 		this._timers.map((timer) =>
		// 		{
		// 			clearTimeout(timer);
		// 		});
		//
		if (isPlaying) {
			cn.local([
				"Currently at grid: " + this._position.x + ',' + this._position.y,
				"Origin: " + originX + "," + originY,
				"I'm going to relative click xy: " + event.data.global.x + "," + event.data.global.y,
				"Absolute: " + moveX + "," + moveY,
				"Current shape xy: " + this.shape.x + "," + this.shape.y,
			].join('<br>'));
		} else {
			cn.local('Click received. Moving <b>' + this.name + '</b> to ' + event.x + ',' + event.y);
		}
		return path;
	}
} 