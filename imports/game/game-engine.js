import {ElementFactory} from "./world/elementFactory";
import PF from "../../node_modules/pathfinding";
export class GameEngine {
	constructor(game)
	{
		this._game   = game;
		this._ticker = new PIXI.ticker.Ticker();
		this.ef      = new ElementFactory(game);
	}

	get ticker()
	{
		return this._ticker;
	}

	static createPathFinder(width, height)
	{
		return new PF.Grid(width, height);
	}

	static createEmptyContainer()
	{
		return new PIXI.Container();
	}

	createRenderer()
	{
		let settings = this._game.settings;
		return PIXI.autoDetectRenderer(settings.canvasW, settings.canvasH, {backgroundColor: 0x34495e});
	}

}