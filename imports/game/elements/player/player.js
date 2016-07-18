import {ThugPlayer} from "../player/thug-player";
import {Vector} from "../../lib/vector";
import {GoTo} from "../../actions/goto-action";
import {ReactiveVar} from "meteor/reactive-var";

export class Player extends ThugPlayer {
	/**
	 *
	 * @param id
	 * @param name
	 * @param position
	 * @param {Game} game
	 */
	constructor(id, name, position, game)
	{
		super(id, name, position, game);
		this._queue  = [];
		this._timers = [];
		this._name   = name;
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

	onClick(event)
	{
		let scene    = this.game.scene;
		let settings = this.game.settings;
		let world    = this.game.world;

		// Calculate absolute coordinates
		let clickX   = event.data.global.x + (scene.pivot.x - settings.canvasW / 2);
		let clickY   = event.data.global.y + (scene.pivot.y - settings.canvasH / 2);
		let path     = super.getPathFinderFromClicksAndClearTimers(clickX, clickY, true, event);
		PlayerEvents.insert({a: 'c', t: this.id, x: clickX, y: clickY, createdAt: new Date()});
		let i = 0;
		path.map((v) =>
		{
			let vector = new Vector(v[0], v[1]);
			vector.fixForPathfinder(world.position.x, world.position.y, settings.cellSize);
			// 			let timeout = setTimeout(() =>
			// 			{
			super.queue(new GoTo(vector));
			// 			}, i);

			// 			this._timers.push(timeout);

			i += 10;
		});
	}
} 