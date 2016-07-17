import {Player} from "../elements/player/player";
import {ThugPlayer} from "../elements/player/thug-player";
import {Vector} from "../lib/vector";
import {Chunk} from "./chunk";
import {ElementFactory} from "./elementFactory";
import PF from "../../../node_modules/pathfinding";
import PIXI from "../../../node_modules/pixi.js";
import {Session} from "meteor/session";
PIXI.utils._saidHello = true;

export class World {
	/**
	 * @param canvas
	 * @param {GameSettings} settings
	 * @param camera
	 */
	constructor(canvas, settings, camera)
	{
		this.canvas      = canvas;
		this.chunks      = [];
		this.thugs       = [];
		this.objects     = [];
		this.thugPlayers = [];
		this.player      = null;
		
		this.worldX = 0;
		this.worldY = 0;
		
		this.settings       = settings;
		this.elementFactory = new ElementFactory(this.settings);
		this.camera = camera;
		this.ticker = camera.ticker;

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
				this.camera.tick();
				this.player.tick(event);
				this.thugPlayers.map((thugPlayer) =>
				{
					thugPlayer.tick();
				});
			}
			
			this.camera.update();
		}

	}

	installWorld(chunks, player, thugPlayers, playerEventCollection)
	{
		// Install chunks
		this.installChunks(chunks);

		// Install trees
		this.installTrees(chunks);

		// Install player
		this.installPlayer(player, playerEventCollection);

		// Install ThugPlayers
		thugPlayers.map((thugPlayer) =>
		{
			this.loadPlayer(thugPlayer);
		});

		// Load debug world
		this.camera.debugWorldLayers.chunk.cacheAsBitmap = true;
		this.camera.debugWorldLayers.tile.cacheAsBitmap  = true;
		this.camera.debugWorldLayers.tile.addChild(this.elementFactory.createTileDebugContainer(chunks));
		this.camera.debugWorldLayers.chunk.addChild(this.elementFactory.createChunkDebugContainer(chunks));
	}

	listenToNewThugPlayers(playerEvent)
	{
		cn.local('Player joined: ' + playerEvent.nickname);
		this.loadPlayer(playerEvent);
	}

	listenToPlayerClick(event)
	{
		let targetPlayer = _.findWhere(this.thugPlayers, {_id: event['t']});
		if (targetPlayer !== undefined) {
			targetPlayer.onClick(event);
		}
	}

	installPlayer(player, playerEventCollection)
	{
		if (this.player === null) {
			this.player       = new Player(player._id, player.nickname, new Vector(player.x, player.y), this, playerEventCollection);
			
			this.player.shape =  this.elementFactory.createPlayerContainer(this.player);
			this.camera.addPlayerAndFollow(this.player);
			this.camera.cameraContainer.mousedown = this.player.onClick.bind(this.player);
			this.camera.cameraContainer.tap       = this.player.onClick.bind(this.player);
		}
	}

	installTrees(chunks)
	{
		chunks.map((primitiveChunk) =>
		{
			for (let index = 0; index < primitiveChunk.tiles.length; index++) {
				let tile = primitiveChunk.tiles[index];

				if (tile.tree === null) {
					continue;
				}
				let treeShape = this.elementFactory.createTreeContainer(tile);
				let tree = {name: 'tree', shape: treeShape};
				this.camera.addToLayer(treeShape, 'trees');
				this.objects.push(tree);
			}
		});
		this.camera.worldLayers.trees.cacheAsBitmap = true;
	}

	installChunks(chunks)
	{
		this.pathFinder = new PF.Grid(this.settings.chunkSize, this.settings.chunkSize);
		chunks.map((primitiveChunk) =>
		{
			for (let index = 0; index < primitiveChunk.tiles.length; index++) {
				let tile = primitiveChunk.tiles[index];

				if (tile.noise > 0.50 && tile.noise <= 0.75) {
					this.pathFinder.setWalkableAt(tile.x / this.settings.cellSize, tile.y / this.settings.cellSize, false);
					tile.walkable = false;
				}
			}

			let chunk   = new Chunk(new Vector(primitiveChunk.x, primitiveChunk.y), primitiveChunk.tiles);
			chunk.shape = this.elementFactory.createSingleChunkContainer(chunk);
			this.chunks.push(chunk);
			this.camera.addToLayer(chunk.shape, 'chunks');
		});
		this.camera.worldLayers.chunks.cacheAsBitmap = true;
	}

	loadPlayer(thugPlayer)
	{
		let player   = new ThugPlayer(thugPlayer._id, thugPlayer['nickname'], new Vector(thugPlayer.x, thugPlayer.y), this);
		player.shape = this.elementFactory.createPlayerContainer(player);
		this.thugPlayers.push(player);
		this.camera.addToLayer(player.shape, 'thugPlayers');
		
	}
	
	

}