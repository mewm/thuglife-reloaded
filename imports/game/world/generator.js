import {Noise} from "../util/noise";

export class MapGenerator {
	constructor(settings)
	{
		this.world     = [];
		this.tweak     = settings.tweak;
		this.chunkSize = settings.chunkSize;
		this.cellSize  = settings.cellSize;
		this.chunks    = settings.chunks;

		this.seed = 0.86810414;

		Noise.seed(this.seed);

		if(this.chunks > 1) { 
			for (var x = 0; x < this.chunks; x++) { 
				this.createChunk(x * this.chunkSize, 0);
				for (var y = 1; y < this.chunks; y++) {
					this.createChunk(x * this.chunkSize, y * this.chunkSize);
				}
			}
		} else {
			this.createChunk(0, 0);
		}
		
		console.log('Done generation');
	}

	static isForrestable(bedrockValue, treeValue)
	{
		if (bedrockValue >= 0.55 && bedrockValue <= 0.725) { 
			if(treeValue >= 0.55 && treeValue <= 0.6) {
				return 1;
			}
		}

		return null;
	}

	createChunk(x, y)
	{
		var chunk = {x: x, y: y, tiles: []};

		let tweak = this.tweak;

		for (var _y = y; _y < y + this.chunkSize; _y += this.cellSize) {
			for (var _x = x; _x < x + this.chunkSize; _x += this.cellSize) {
				var bedrockValue = +Noise.simplex2(_x / tweak, _y / tweak).toFixed(2);

				var treeValue = +Noise.simplex2(_x / tweak/2, _y / tweak/2).toFixed(2);
				var tree  = MapGenerator.isForrestable(bedrockValue, treeValue);

				chunk.tiles.push({x: _x, y: _y, noise: bedrockValue, tree: tree});

				tweak += Math.random() > 0.5 ? 32 : -32;
			}
		}

		this.world.push(chunk);

		this.tweak += Math.random() > 0.5 ? 256 : -256;
	}

}
