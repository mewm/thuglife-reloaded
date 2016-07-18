import {Vector} from "../lib/vector";

export class BaseElement {
	/**
	 * @param id
	 * @param {Vector} position
	 * @param {World} world
	 * @param shape
	 */
	constructor(id, position, game, shape)
	{
		this._id        = id;
		// This positions is GRID coordinates
		this._position  = position;
		this._game      = game;
		this._world     = game.world; //legacy
		this._shape     = shape;
		this._maxEnergy = 100;
		this._energy    = 100;
		this._isAlive   = true;

		//Collections
		this.elementsInRange  = [];
		this.collidedElements = [];

		//Features
		this.canCollideWithOthers = true;
		this.canBeCollidedWith    = false;
		this.proximityDetector    = {
			enabled: true,
			radius: 200,
			visible: false
		};
	}

	tick()
	{
	}
	
	get position()
	{
		return this._position;
	}

	/**
	 * @returns {string}
	 */
	get id()
	{
		return this._id;
	}
	
	get game()
	{
		return this._game;
	}

	get shape()
	{
		return this._shape;
	}

	set shape(shape)
	{
		this._shape = shape;
	}

	get world()
	{
		return this._world;
	}

	set maxEnergy(maxEnergy)
	{
		this._maxEnergy = maxEnergy;
	}

	get maxEnergy()
	{
		return this._maxEnergy;
	}

	set energy(energy)
	{
		this._energy = energy;
	}

	get energy()
	{
		return this._energy;
	}

	set isAlive(isAlive)
	{
		this._isAlive = isAlive;
	}

	get isAlive()
	{
		return this._isAlive;
	}

	drainEnergy()
	{
		this.removeEnergy(this.energyDrainPerTick);
		if (this.getEnergy() <= 0) {
			this.kill();
		}
	}

	kill()
	{
		this.isAlive = false;
	};

	detectCollisions(worldElements)
	{
		this.collidedElements = [];
		for (var i = 0; i < worldElements.length; i++) {
			var worldElement = worldElements[i];
			if (worldElement != this && this.isInRange(worldElement)) {

				// True if there is a collision.
				if (this.isCollidingWith(worldElement)) {
					this.addCollidedElement(worldElement);
				}
			}
		}
	};

	isCollidingWith(element)
	{
		var selfPos    = {
			left: this.position.x - (this.shape.width / 2),
			top: this.position.y - (this.shape.height / 2),
			right: this.position.x + (this.shape.width / 2),
			bottom: this.position.y + (this.shape.height / 2)
		};
		var elementPos = {
			left: element.position.x - (element.shape.width / 2),
			top: element.position.y - (element.shape.height / 2),
			right: element.position.x + (element.shape.width / 2),
			bottom: element.position.y + (element.shape.height / 2)
		};

		return !(elementPos.left > selfPos.right || elementPos.right < selfPos.left || elementPos.top > selfPos.bottom || elementPos.bottom < selfPos.top);
	}

	addCollidedElement(element)
	{
		this.collidedElements.push(element);
	}

	detectElementsInRange(worldElements)
	{
		this.elementsInRange = [];
		for (var i = 0; i < worldElements.length; i++) {
			var worldElement = worldElements[i];
			if (worldElement != this) {
				if (this.isInRange(worldElement)) {
					this.addElementInRange(worldElement);
				}
			}
		}
	}

	isInRange(worldElement)
	{
		return this.position.distanceTo(worldElement.position) <= this.proximityDetector.radius;
	}

	addElementInRange(element)
	{
		this.elementsInRange.push(element);
	}

	getClosestElementOfTypeInRange(type)
	{
		var closestElement         = null;
		var closestElementDistance = null;

		// Loop through all elements in range.
		for (var i = 0; i < this.elementsInRange.length; i++) {
			var worldElement = this.elementsInRange[i];
			// If the element is a shroom.
			if (worldElement.type == type) {
				// Distance to target element.
				var distance = this.position.distanceTo(worldElement.position);

				// If we dont have a closest element or the new measured distance is lower than the last then set this element as new closestElement.
				if (distance < closestElementDistance || closestElementDistance === null) {
					closestElement         = worldElement;
					closestElementDistance = distance;
				}
			}
		}

		if (!closestElement) {
			return null;
		}
		return closestElement;
	}

	addEnergy(energy)
	{
		if (this.energy + energy <= this.maxEnergy) {
			this.energy += energy;
		} else {
			this.energy = this.maxEnergy;
		}
	}

	removeEnergy(energy)
	{
		if (this.energy - energy <= 0) {
			this.kill();
		} else {
			this.energy -= energy;
		}
	}

	/**
	 * @returns {int}
	 */
	getCellInChunk()
	{
		let cellSize  = this.world.settings.cellSize;
		let chunkSize = this.world.settings.chunkSize;
		let tiles     = chunkSize / cellSize;

		let x = Math.floor(this._position.x / cellSize);
		let y = Math.floor(this._position.y / cellSize);

		let cell = (y * tiles) + x;

		return cell;
	}

	getCellIFromPosition(x, y)
	{
		let cellSize  = this.world.settings.cellSize;
		let chunkSize = this.world.settings.cellSize;
		let tiles     = chunkSize / cellSize;

		let _x = Math.floor(x / cellSize);
		let _y = Math.floor(y / cellSize);

		let cell = (_y * tiles) + _x;

		return cell;
	}

	/**
	 * @returns {Vector}
	 */
	getCellPositionFromCellNumber(n)
	{
		// 		return new Vector(this.world.settings.cellSize / n, this.world.settings.cellSize / n);
	}
}