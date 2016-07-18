import PIXI from "../../../node_modules/pixi.js";
import {Vector} from "../lib/vector";
import {GameEngine} from "../game-engine";
PIXI.utils._saidHello = true;

export class World {
	constructor(game)
	{
		this.game       = game;
		this.chunks      = [];
		this.thugs       = [];
		this.objects     = [];
		this.thugPlayers = [];

		this._position = new Vector(0, 0);

		this.initialiseLayers();
	}

	get position()
	{
		return this._position;
	}
	
	initialiseLayers()
	{
		// Create world container
		this._layers      = {
			chunks: GameEngine.createEmptyContainer(),
			trees: GameEngine.createEmptyContainer(),
			thugPlayers: GameEngine.createEmptyContainer()
		};
		this._debugLayers = {
			tile: GameEngine.createEmptyContainer(),
			chunk: GameEngine.createEmptyContainer()
		};
	}

	addChunk(chunk)
	{
		chunk.shape = this.game.engine.ef.createSingleChunkContainer(chunk);
		this.chunks.push(chunk);
		this._layers.chunks.addChild(chunk.shape);
	}

	addTreeFromTile(tile)
	{
		let treeShape = this.game.engine.ef.createTreeContainer(tile);
		let tree      = {name: 'tree', shape: treeShape};
		this._layers.trees.addChild(treeShape);
	}

	/**
	 * @param {Player|ThugPlayer} player
	 */
	addPlayer(player)
	{
		// 		cn.local('Loaded player: <b>' + player.nickname + '</b>', player, 'success');
		// 		cn.local('Loaded thugs: <b>' + thugPlayers.length + '</b>', thugPlayers, 'success');
		// Playing player should be added straight to the scene
		if (player === this.game.player) {
			this.game.scene.addChild(player.shape);
		} else {
			this.thugPlayers.push(player);
			this._layers.thugPlayers.addChild(player.shape);
		}
	}

}