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
	 * @param {World} world
	 * @param shape
	 * @param playerEventCollection
	 */
	constructor(id, name, position, world, playerEventCollection, shape)
	{
		super(id, name, position, world, shape);
		this.playerEventCollection = playerEventCollection;
		this._queue                = [];
		this._timers               = [];
		this._name                 = name;
		this._energy               = new ReactiveVar(100);
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
		// Calculate absolute coordinates
		let clickX = event.data.global.x + (this.world.camera.scene.pivot.x - this.world.settings.canvasW / 2);
		let clickY = event.data.global.y + (this.world.camera.scene.pivot.y - this.world.settings.canvasH / 2);
		let path   = super.getPathFinderFromClicksAndClearTimers(clickX, clickY, true, event);
		this.playerEventCollection.insert({a: 'c', t: this.id, x: clickX, y: clickY, createdAt: new Date()});
		let i = 0;
		path.map((v) =>
		{
			let vector = new Vector(v[0], v[1]);
			vector.fixForPathfinder(this.world.worldX, this.world.worldY);
// 			let timeout = setTimeout(() =>
// 			{
				super.queue(new GoTo(vector));
// 			}, i);

// 			this._timers.push(timeout);

			i += 10;
		});
	}
} 