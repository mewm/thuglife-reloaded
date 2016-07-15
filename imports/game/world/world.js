import {Player} from "../elements/player/player";
import {ThugPlayer} from "../elements/player/thug-player";
import {Vector} from "../lib/vector";
import PF from "../../../node_modules/pathfinding";
import {Chunk} from "./chunk";
import PIXI from "../../../node_modules/pixi.js";
import {ElementFactory} from "./elementFactory";
import {Camera} from "./camera";

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

		this.renderer = renderer;

		// Create world container
		this.worldContainer   = this.elementFactory.createEmptyContainer();
		this.worldLayers      = {
			chunks: this.elementFactory.createEmptyContainer(),
			trees: this.elementFactory.createEmptyContainer(),
			thugPlayers: this.elementFactory.createEmptyContainer()
		};
		this.debugWorldLayers = {
			tile: this.elementFactory.createEmptyContainer(),
			chunk: this.elementFactory.createEmptyContainer()
		};

		// To world container
		_.map(this.worldLayers, (layer, key) =>
		{
			this.worldContainer.addChild(layer);
		});
		_.map(this.debugWorldLayers, (layer) =>
		{
			this.worldContainer.addChild(layer);
		});

		// Camera 
		this.cameraContainer             = new PIXI.Container();
		this.cameraContainer.interactive = true;
		this.camera       = new Camera(0, 0, this.settings.canvasW, this.settings.canvasH, this.settings.chunks * this.settings.chunkSize, this.settings.chunks * this.settings.chunkSize);
		this.cameraContainer.position.x = 512;
		this.cameraContainer.position.y = 512;
		this.camera.world = this.worldContainer;

		this.cameraContainer.addChild(this.worldContainer);
		

		this.ticker = new PIXI.ticker.Ticker();
		this.ticker.add(this.tick.bind(this));
		// 		this.ticker.speed = 0.1;
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
				this.camera.tick();
				this.player.tick(event);
				this.thugPlayers.map((thugPlayer) =>
				{
					thugPlayer.tick();
				});
			}
			this.renderer.render(this.cameraContainer);
		}

	}

	installWorld(chunks, player, thugPlayers, playerEventCollection, playerCollection)
	{
		// Install chunks
		chunks.map((primitiveChunk) =>
		{
			let pathFinder = new PF.Grid(this.settings.chunkSize, this.settings.chunkSize);

			for (let index = 0; index < primitiveChunk.tiles.length; index++) {
				let tile = primitiveChunk.tiles[index];

				if (tile.noise > 0.50 && tile.noise <= 0.75) {
					pathFinder.setWalkableAt(tile.x / this.settings.cellSize, tile.y / this.settings.cellSize, false);
					tile.walkable = false;
				}
			}

			let chunk   = new Chunk(new Vector(primitiveChunk.x, primitiveChunk.y), primitiveChunk.tiles, pathFinder);
			chunk.shape = this.elementFactory.createSingleChunkContainer(chunk);
			this.chunks.push(chunk);
			this.worldLayers.chunks.addChild(chunk.shape);
		});
		this.worldLayers.chunks.cacheAsBitmap = true;

		// Install trees
		chunks.map((primitiveChunk) =>
		{
			for (let index = 0; index < primitiveChunk.tiles.length; index++) {
				let tile = primitiveChunk.tiles[index];

				if (tile.tree === null) {
					continue;
				}
				let treeShape = this.elementFactory.createTreeContainer(tile);
				this.worldLayers.trees.addChild(treeShape);
				let tree = {name: 'tree', shape: treeShape};
				this.objects.push(tree);

			}
		});
		this.worldLayers.trees.cacheAsBitmap = false;

		// Install player
		this.player       = new Player(player._id, new Vector(player.x, player.y), this, playerEventCollection);
		this.player.shape = this.camera.follower = this.elementFactory.createPlayerContainer(this.player);
		console.log(this.player);
		this.worldContainer.addChild(this.player.shape);
		
		this.cameraContainer.mousedown = this.player.onClick.bind(this.player);
		this.cameraContainer.tap = this.player.onClick.bind(this.player);

		// Install ThugPlayers
		thugPlayers.map((thugPlayer) =>
		{
			this.loadPlayer(thugPlayer);
		});

		// Listen to new thug players
		var self           = this;
		let thugPlayerList = this.thugPlayers;
		playerCollection.find().observe({
			added: (document) =>
			{
				self.loadPlayer(document);
			}
		});

		// Listen to thug player clicks
		playerEventCollection.find({a: 'c'}).observe({
			added: (document) =>
			{
				let targetPlayer = _.findWhere(thugPlayerList, {_id: document['t']});
				if (targetPlayer !== undefined) {
					targetPlayer.onClick(document);
				}
			}
		});

		// Load debug world
		this.debugWorldLayers.chunk.cacheAsBitmap = true;
		this.debugWorldLayers.tile.cacheAsBitmap  = true;
		this.debugWorldLayers.tile.addChild(this.elementFactory.createTileDebugContainer(chunks));
		this.debugWorldLayers.chunk.addChild(this.elementFactory.createChunkDebugContainer(chunks));
	}

	loadPlayer(thugPlayer)
	{
		let player   = new ThugPlayer(thugPlayer._id, new Vector(thugPlayer.x, thugPlayer.y), this);
		player.shape = this.elementFactory.createPlayerContainer(player);
		this.thugPlayers.push(player);
		this.worldLayers.thugPlayers.addChild(player.shape);
	}

	debugVisibility(key, toggle)
	{
		this.setDebugLayerVisibility(key, toggle);
	}

	/**
	 * @param key
	 * @param visibility
	 */
	setDebugLayerVisibility(key, visibility)
	{
		this.debugWorldLayers[key].visible = visibility;
	}

	debug(message)
	{
		console.log("%c" + message, 'color: green');
	}
}