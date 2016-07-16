import {BaseAction} from "./base-action";
import PF from "../../../node_modules/pathfinding";
import {MapGenerator} from "../world/generator";
import {Chunk} from "../world/chunk";
import {ElementFactory} from "../world/elementFactory";
import {Noise} from "../util/noise";
import {Vector} from "../lib/vector";
import PIXI from "../../../node_modules/pixi.js";

export class GoTo extends BaseAction {
	constructor(destination)
	{
		super(destination);
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
		if (animateElement.position == this.destination) {
			if(animateElement.world.player.id == animateElement.id) {
				let dumpChunks = [];
				let chunks = animateElement.getNewChunkPositionsFromPlayerPosition();
				let existingChunks = animateElement.world.chunks;
				let maxX = 0;
				let minX = 0;
				let maxY = 0;
				let minY = 0;
				existingChunks.map((existingChunk) => 
				{
					maxX = existingChunk.position.x > maxX ? existingChunk.position.x : maxX;
					maxY = existingChunk.position.y > maxY ? existingChunk.position.y : maxY;
					minX = existingChunk.position.x < minX ? existingChunk.position.x : minX;
					minY = existingChunk.position.y < minY ? existingChunk.position.y : minY;
					chunks.map((chunk) => 
					{
						if(chunk.equals(existingChunk.position)) {
							dumpChunks.push(chunks.splice(chunks.indexOf(chunk), 1)[0]);
						}
					});
				});

				animateElement.world.worldX = minX;
				animateElement.world.worldY = minY;

				let newWorldWidth = -minX+maxX;
				let newWorldHeight = -minY+maxY;

				chunks.map((chunk) => 
				{
					let generatedChunk = this.createChunk(chunk.x, chunk.y, animateElement.world);
					let newChunk   = new Chunk(new Vector(chunk.x, chunk.y), generatedChunk.tiles);
					newChunk.shape = this.createSingleChunkContainer(newChunk, animateElement.world);
					animateElement.world.chunks.push(newChunk);

					animateElement.world.camera.worldLayers.chunks.cacheAsBitmap = null;
					animateElement.world.camera.worldLayers.chunks.addChild(newChunk.shape);
					animateElement.world.camera.worldLayers.chunks.cacheAsBitmap = true;
				});

				console.log(dumpChunks);

				/*dumpChunks.map((dumpChunk) => 
				{
					animateElement.world.camera.worldLayers.chunks.removeChild(dumpChunk.shape);
					animateElement.world.chunks.splice(animateElement.world.chunks.indexOf(dumpChunk));
					console.log("Dumped chunk.");
				});*/

				if(chunks.length > 0) 
				{
					//animateElement.world.pathFinder = new PF.Grid(newWorldWidth, newWorldHeight);
					console.log("Generated new PathFinder Grid: " + newWorldWidth + ", " + newWorldHeight);
				}
			}

			callback();
		}
	}

	createChunk(x, y, world)
	{
		let seed = 0.86810414;

		Noise.seed(seed);

		let chunk = {x: x, y: y, tiles: []};

		let tweak = world.settings.tweak;

		for (let _y = y; _y < y + world.settings.chunkSize; _y += world.settings.cellSize) {
			for (let _x = x; _x < x + world.settings.chunkSize; _x += world.settings.cellSize) {
				let bedrockValue = +Noise.simplex2(_x / tweak, _y / tweak).toFixed(2);

				let treeValue = +Noise.simplex2(_x / tweak/2, _y / tweak/2).toFixed(2);
				let tree  = MapGenerator.isForrestable(bedrockValue, treeValue);

				chunk.tiles.push({x: _x, y: _y, noise: bedrockValue, tree: tree});

				//tweak += Math.random() > 0.5 ? 32 : -32;
			}
		}

		//tweak += Math.random() > 0.5 ? 256 : -256;

		return chunk;	
	}

	createSingleChunkContainer(chunk, world)
	{
		let chunkContainer = new PIXI.Container();
		for (let index = 0; index < chunk.tiles.length; index++) {
			let tile = chunk.tiles[index];

			let chunkGraphics        = new PIXI.Graphics();
			chunkGraphics.position.x = tile.x;
			chunkGraphics.position.y = tile.y;

			let color = tile._walkable == false ? 0x000000 : this.getColorFromNoiseValue(tile.noise);
			chunkGraphics.beginFill(color).drawRect(0, 0, world.settings.cellSize, world.settings.cellSize).endFill();

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
