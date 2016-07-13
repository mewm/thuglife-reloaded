import {Player} from "../elements/player/player";
import {Vector} from "../lib/vector";
import PF from "../../../node_modules/pathfinding";
import {Chunk} from "./chunk";

export class World {
	/**
	 * @param {MapRenderer} mapRenderer
	 * @param {GameSettings} gameSettings
	 */
	constructor(mapRenderer, gameSettings)
	{

		this.chunks   = [];
		this.players  = [];
		this.player   = null;
		this.thugs    = [];
		this.objects  = [];
		this.settings = gameSettings;

		this.renderer = mapRenderer;
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
			}
			this.renderer.update();
		}
	}

	installWorld(chunks, player)
	{
		// Install chunks
		chunks.map((primitiveChunk) =>
		{
			let pathFinder = new PF.Grid(this.settings.chunkSize, this.settings.chunkSize);
			let chunk      = new Chunk(new Vector(primitiveChunk.x, primitiveChunk.y), primitiveChunk.tiles, pathFinder);
			chunk.shape    = this.renderer.createChunkShape(chunk);
			this.chunks.push(chunk);
			this.renderer.render('world', chunk);
		});

		// Install trees
		chunks.map((primitiveChunk) =>
		{
			for (let index = 0; index < primitiveChunk.tiles.length; index++) {
				let tile = primitiveChunk.tiles[index];
				if (tile.tree === null) {
					continue;
				}
				let treeShape = this.renderer.createTreeShape(tile);
				let tree      = {name: 'tree', shape: treeShape};
				this.objects.push(tree);
				this.renderer.render('trees', tree);
			}
		});

		// Install player
		this.player       = new Player(player._id, new Vector(player.x, player.y), this);
		this.player.shape = this.renderer.createPlayerShape(this.player);
		this.renderer.render('player', this.player);

		// Load debug world
		this.renderer.renderDebugWorld(chunks);

	}

	loadPlayers(players)
	{
		players.map((player) =>
		{
			this.players.push(new Player(player._id, new Vector(player.x, player.y), this));
			console.log('Loaded player', player);
		});
		this.renderer.renderPlayers(players);
	}

	spawnPlayer(player)
	{
		this.player = player;
	}

	debugVisibility(key, toggle)
	{
		this.renderer.setDebugLayerVisibility(key, toggle);
	}

	debug(message)
	{
		console.log("%c" + message, 'color: green');
	}
}