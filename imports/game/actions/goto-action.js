import {BaseAction} from "./base-action";
export class GoTo extends BaseAction {
	constructor(destination)
	{
		super(destination);
		this.destination = destination;
	}

	perform(animateElement, callback)
	{
		animateElement.moveTo(this.destination);
		if (animateElement.position == this.destination) {
			console.log("Performance done!")
			callback();
		}
	}
}