import {BaseElement} from "./base-element";
import {Vector} from "../lib/vector";

export class AnimateElement extends BaseElement {
	constructor(id, position, world, shape)
	{
		super(id, position, world, shape);
		this.queue            = [];
		this.isThugging       = null;
		this.actionsPerformed = [];
		this.speed            = 1;
	}

	queue(action)
	{
		this.queue.push(action);
		return this.queue;
	}

	next()
	{
		return this.queue.shift();
	}

	tick(event)
	{
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
			console.log(this.queue);
			this.actionsPerformed.push(this.isThugging);
			this.isThugging = null;
		});
	}

	moveTo(vector)
	{
		let x = vector.x*this.world.settings.cellSize;
		let y = vector.y*this.world.settings.cellSize;

		this.position = vector;
		this.shape.x = x;
		this.shape.y = y;
	}

}