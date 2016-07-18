import {GameEngine} from "./game-engine";
import {World} from "./world/world";
import {Chunk} from "./world/chunk";
import {Camera} from "./world/camera";
import {GameSettings} from "./settings";
import {Vector} from "./lib/vector";
import {Player} from "./elements/player/player";
import {ThugPlayer} from "./elements/player/thug-player";

export class Game {
	constructor(id, seed, $canvas, collections)
	{
		this._id          = id;
		this._seed        = seed;
		this._collections = collections;
		this._$canvas     = $canvas;

		this.settings = new GameSettings(this);
		this.engine   = new GameEngine(this);

		this.ticker   = this.engine.ticker;
		this.pathFinder = GameEngine.createPathFinder(this.settings.chunkSize, this.settings.chunkSize);

		// Containers
		this.scene    = GameEngine.createEmptyContainer();
		this.world  = new World(this);
		this.player = null;
		
		this.camera = new Camera(this);
		this.renderer = this.engine.createRenderer();
		this._$canvas.append(this.renderer.view);

	}

	hotReload()
	{
// 		console.log('Hot reloaded', this);
	}

	start()
	{
		this.camera.addFpsTicker();
		this.camera.addCameraStats();
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
				this.player.tick(event);
				this.world.thugPlayers.map((thugPlayer) =>
				{
					thugPlayer.tick();
				});
			}
			this.camera.tick();
			this.camera.update();
		}
	}

	initialize(callback)
	{
		let worldData = this._collections.worldMap.find().fetch();

		// Load player, then thug players
		this.installPlayer(() =>
		{
			this.installMap(worldData);
			this.installTrees(worldData);
			this.installDebugLayer(worldData);
			this.installThugPlayers();
			
			this.addLayersToScene();
			this.setupInputHandling();
			$(window).resize(this.camera.onResize.bind(this.camera));
			callback();
		});
	}

	setupInputHandling()
	{
		this.scene.interactive = true;
		this.scene.mousedown = this.player.onClick.bind(this.player);
		this.scene.tap       = this.player.onClick.bind(this.player);
	}

	listenToNewThugPlayers(playerEvent)
	{
		// 		cn.local('Player joined: ' + playerEvent.nickname);
		// 		this.loadPlayer(playerEvent);
	}

	listenToPlayerClick(event)
	{
		let targetPlayer = _.findWhere(this.world.thugPlayers, {_id: event['t']});
		if (targetPlayer !== undefined) {
			targetPlayer.onClick(event);
		}
	}

	installMap(chunks)
	{
		chunks.map((primitiveChunk) => {
			this.world.addChunk(this.createChunkFromData(primitiveChunk));
		});
		this.world._layers.chunks.cacheAsBitmap = true;
	}

	installTrees(chunks)
	{
		chunks.map((primitiveChunk) =>
		{
			for (let index = 0; index < primitiveChunk.tiles.length; index++) {
				let tile = primitiveChunk.tiles[index];
				if (tile.tree !== null) {
					this.world.addTreeFromTile(tile);
				}
			}
		});
		this.world._layers.trees.cacheAsBitmap = true;
	}

	installPlayer(doneCallback)
	{
		if (this.player !== null) {
			return;
		}
		Meteor.call('findOrInsertPlayer', Session.get('thugName'),
			(err, player) =>
			{
				if (err) {
					alert(err);
				}
				this.player = new Player(player._id, player.nickname, new Vector(player.x, player.y), this);
				this.world.addPlayer(this.player);
				this.camera.followPlayer(this.player);
				doneCallback();
			}
		);
	}

	installThugPlayers()
	{
		let thugPlayers = Players.find({nickname: {$ne: this.player.name}}).fetch();
		thugPlayers.map((thugPlayer) =>
		{
			let player = new ThugPlayer(thugPlayer._id, thugPlayer['nickname'], new Vector(thugPlayer.x, thugPlayer.y), this);
			this.world.addPlayer(player);
		});
	}

	installDebugLayer(worldData)
	{
		let debugLayers = this.world._debugLayers;

		debugLayers.chunk.addChild(this.engine.ef.createChunkDebugContainer(worldData));
		debugLayers.tile.addChild(this.engine.ef.createTileDebugContainer(worldData));
		debugLayers.chunk.cacheAsBitmap = true;
		debugLayers.tile.cacheAsBitmap  = true;

	}

	addLayersToScene()
	{
		// Add world layers (including player)
		_.map(this.world._layers, (layer) =>
		{
			this.scene.addChild(layer);
		});

		// Add debug layers
		_.map(this.world._debugLayers, (layer) =>
		{
			this.scene.addChild(layer);
		});

		// Add player to scene and scene to camera
		this.scene.addChild(this.player.shape);
		this.camera.addChildAt(this.scene, 0);
	}

	createChunkFromData(primitiveChunk)
	{
		for (let index = 0; index < primitiveChunk.tiles.length; index++) {
			let tile = primitiveChunk.tiles[index];
			if (tile.noise > 0.50 && tile.noise <= 0.75) {
				this.pathFinder.setWalkableAt(tile.x / this.settings.cellSize, tile.y / this.settings.cellSize, false);
				tile.walkable = false;
			}
		}
		return new Chunk(new Vector(primitiveChunk.x, primitiveChunk.y), primitiveChunk.tiles);
	}
}