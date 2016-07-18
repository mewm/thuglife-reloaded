import {BaseAction} from "./base-action";
import {MapGenerator} from "../world/generator";
import {Chunk} from "../world/chunk";
import {Noise} from "../util/noise";
import {Vector} from "../lib/vector";
import PIXI from "../../../node_modules/pixi.js";

export class GoTo extends BaseAction {
	constructor(destination)
	{
		super(destination);

		// This destination is tile coordinates!
		this.destination = destination;

		this.noiseColors = [
			{name: "Deep Water", color: 0x0000cc},
			{name: "Water", color: 0x0066ff},
			{name: "Sand", color: 0xffff99},
			{name: "Grass", color: 0x009933},
			{name: "Woodland", color: 0x006600},
			{name: "Mountain", color: 0xa9a9a9},
			{name: "Snow", color: 0xffffff}
		];
	}

	perform(animateElement, callback)
	{
		animateElement.moveTo(this.destination);
		if (animateElement.isAtTileCoordinate(this.destination)) {
			if (animateElement.game.player.id == animateElement.id) {
				let dumpChunks     = [];
				let chunks         = animateElement.getNewChunkPositionsFromPlayerPosition();
				let existingChunks = animateElement.game.world.chunks;
				let minX           = 0;
				let minY           = 0;
				existingChunks.map((existingChunk) =>
				{
					minX = existingChunk.position.x < minX ? existingChunk.position.x : minX;
					minY = existingChunk.position.y < minY ? existingChunk.position.y : minY;

					chunks.map((chunk) =>
					{
						if (chunk.equals(existingChunk.position)) {
							chunks.splice(chunks.indexOf(chunk), 1);
						}
					});
				});
				
				animateElement.world.position.set(minX, minY);

				let world       = animateElement.game.world;
				let worldLayers = world._layers;

				chunks.map((chunk) =>
				{
					let generatedChunk = this.createChunk(chunk.x, chunk.y, world);
					let newChunk       = new Chunk(new Vector(chunk.x, chunk.y), generatedChunk.tiles);
					newChunk.shape     = this.createSingleChunkContainer(newChunk, world);
					world.chunks.push(newChunk);

					worldLayers.chunks.cacheAsBitmap = null;
					worldLayers.chunks.addChild(newChunk.shape);
					worldLayers.chunks.cacheAsBitmap = true;

					//console.log("Created Chunk");
				});

				/*existingChunks.map((dumpChunk) => 
				 {
				 let distance = animateElement.position.distanceTo(new Vector(dumpChunk.position.x, dumpChunk.position.y));

				 if(distance > 8000) {
				 animateElement.world.chunks.splice(animateElement.world.chunks.indexOf(dumpChunk), 1);
				 animateElement.world.camera.worldLayers.chunks.removeChild(dumpChunk.shape);
				 console.log("Dumped");
				 }
				 });*/
			}

			callback();
		}
	}

	createChunk(x, y, world)
	{
		Noise.seed(0.532811);

		let chunk = {x: x, y: y, tiles: []};

		let settings  = world.game.settings;
		let chunkSize = settings.chunkSize;
		let cellSize  = settings.cellSize;
		let tweak     = settings.tweak;

		for (let _y = y; _y < y + chunkSize; _y += cellSize) {
			for (let _x = x; _x < x + chunkSize; _x += cellSize) {
				let bedrockValue = +Noise.simplex2(_x / tweak, _y / tweak).toFixed(2);

				let treeValue = +Noise.simplex2(_x / tweak / 2, _y / tweak / 2).toFixed(2);
				let tree      = MapGenerator.isForrestable(bedrockValue, treeValue);

				chunk.tiles.push({x: _x, y: _y, noise: bedrockValue, tree: tree});

				//tweak += Math.random() > 0.5 ? 32 : -32;
			}
		}

		//tweak += Math.random() > 0.5 ? 256 : -256;

		return chunk;
	}

	createSingleChunkContainer(chunk, world)
	{
		let settings = world.game.settings;
		let chunkContainer = new PIXI.Container();
		for (let index = 0; index < chunk.tiles.length; index++) {
			let tile = chunk.tiles[index];

			let chunkGraphics        = new PIXI.Graphics();
			chunkGraphics.position.x = tile.x;
			chunkGraphics.position.y = tile.y;

			let color = tile._walkable == false ? 0x000000 : this.getColorFromNoiseValue(tile.noise);
			chunkGraphics.beginFill(color).drawRect(0, 0, settings.cellSize, settings.cellSize).endFill();

			chunkContainer.addChild(chunkGraphics);
		}

		return chunkContainer;
	}

	getColorFromNoiseValue(n)
	{
		let type = this.getCellTypeFromNoiseValue(n);
		return this.noiseColors[type].color;
	}

	getCellTypeFromNoiseValue(n)
	{

		let type;

		if (n <= -0.5) {
			type = 0; // Deep Water
		} else if (n > -0.5 && n <= 0) {
			type = 1; // Water
		} else if (n > 0 && n <= 0.15) {
			type = 2; // Sand
		} else if (n > 0.15 && n <= 0.50) {
			type = 3; // Grass
		} else if (n > 0.50 && n <= 0.75) {
			type = 4; // Woodland
		} else if (n > 0.75 && n <= 0.90) {
			type = 5; // Mountain
		} else if (n > 0.90) {
			type = 6; // Snow
		}

		return type;
	}
}
