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
	}
} 