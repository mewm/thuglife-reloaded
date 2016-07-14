import {Player} from "../elements/player/player";
import {ThugPlayer} from "../elements/player/thug-player";
import {Vector} from "../lib/vector";
import PF from "../../../node_modules/pathfinding";
import {Chunk} from "./chunk";
import PIXI from "../../../node_modules/pixi.js";
import {ElementFactory} from "./elementFactory";

export class World {
	/**
	 * @param {GameSettings} gameSettings
	 * @param renderer
	 */
	constructor(gameSettings, renderer)
	{
		this.chunks         = [];
		this.thugPlayers    = [];
		this.player         = null;
		this.thugs          = [];
		this.objects        = [];
		this.settings       = gameSettings;
		this.elementFactory = new ElementFactory(this.settings);

		this.renderer          = renderer;
		this.stage             = new PIXI.Container();
		this.stage.interactive = true;

		this.layers = {
			chunks: null,
			trees: null,
			thugPlayers: null,
			player: null,
		};

		this.ticker = new PIXI.ticker.Ticker();
		this.ticker.add(this.tick.bind(this));
		this.ticker.speed = 0.1;
		this.ticker.start();

	}

	/**
	 * Every world tick calls this method
	 * @param event
	 */
	tick(event)
	{
		// Actions carried out each tick (aka frame)
		if (!event.paused) {
			if (this.player !== null) {
				this.player.tick(event);
				this.thugPlayers.map((thugPlayer) => {
					thugPlayer.tick();
				});
			}
			this.renderer.render(this.stage);
		}

	}

	installWorld(chunks, player, thugPlayers, playerEventCollection, playerCollection)
	{
		console.log('player', player);
		console.log('players', thugPlayers);
		// Install chunks
		this.layers.chunks = this.elementFactory.createEmptyContainer();
		chunks.map((primitiveChunk) =>
		{
			let pathFinder = new PF.Grid(this.settings.chunkSize, this.settings.chunkSize);
			let chunk      = new Chunk(new Vector(primitiveChunk.x, primitiveChunk.y), primitiveChunk.tiles, pathFinder);
			chunk.shape    = this.elementFactory.createSingleChunkContainer(chunk);
			this.chunks.push(chunk);
			this.layers.chunks.addChild(chunk.shape);
		});
		this.layers.chunks.cacheAsBitmap = true;
		this.stage.addChild(this.layers.chunks);

		// Install trees
		this.layers.trees = this.elementFactory.createEmptyContainer();
		chunks.map((primitiveChunk) =>
		{
			for (let index = 0; index < primitiveChunk.tiles.length; index++) {
				let tile = primitiveChunk.tiles[index];
				if (tile.tree === null) {
					continue;
				}
				let treeShape = this.elementFactory.createTreeContainer(tile);
				this.layers.trees.addChild(treeShape);
				let tree = {name: 'tree', shape: treeShape};
				this.objects.push(tree);

			}
		});
		this.layers.trees.cacheAsBitmap = true;
		this.stage.addChild(this.layers.trees);

		// Install player
		this.player        = new Player(player._id, new Vector(player.x, player.y), this, playerEventCollection);
		this.player.shape  = this.elementFactory.createPlayerContainer(this.player);
		this.layers.player = this.player.shape;
		this.stage.addChild(this.layers.player);
		this.stage.on('mousedown', this.player.onClick.bind(this.player));

		// Install ThugPlayers
		this.layers.thugPlayers = this.elementFactory.createEmptyContainer();
		thugPlayers.map((thugPlayer) =>
		{
			this.loadPlayer(thugPlayer);
		});
		
		// Listen to new thug players
		var self = this;
		let thugPlayerList = this.thugPlayers;
		playerCollection.find().observe({
			added: (document) => {
				self.loadPlayer(document);
			}
		});
		
		// Listen to thug player clicks
		playerEventCollection.find({ a: 'c'}).observe({
			added: (document) => {
				let targetPlayer = _.findWhere(thugPlayerList, { _id: document['t'] });
				if(targetPlayer !== undefined) {
					targetPlayer.onClick(document);
				}
			}
		});
		this.stage.addChild(this.layers.thugPlayers);

		// Load debug world
		// 		this.renderer.renderDebugWorld(chunks);

	}

	loadPlayer(thugPlayer)
	{
		let player   = new ThugPlayer(thugPlayer._id, new Vector(thugPlayer.x, thugPlayer.y), this);
		player.shape = this.elementFactory.createPlayerContainer(player);
		this.thugPlayers.push(player);
		this.layers.thugPlayers.addChild(player.shape);
	}

	debugVisibility(key, toggle)
	{
		// 		this.renderer.setDebugLayerVisibility(key, toggle);
	}

	debug(message)
	{
		console.log("%c" + message, 'color: green');
	}
}