export class BaseElement {
	/**
	 * @param id
	 * @param {Vector} position
	 */
	constructor(id, position)
	{
		this._id       = id;
		this._position = position;
	}

	/**
	 * @returns {Vector|*}
	 */
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

}
