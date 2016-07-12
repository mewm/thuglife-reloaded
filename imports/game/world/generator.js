import {Noise} from "../util/noise";

export class MapGenerator {
	constructor(settings)
	{
		this.world     = [];
		this.tweak     = settings.tweak;
		this.chunkSize = settings.chunkSize;
		this.tileSize  = settings.tileSize;
		this.chunks    = settings.chunks;

		Noise.seed(Math.random());

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

	static isForrestable(n)
	{
		if (n >= 0.55 && n <= 0.75) {
			return 1;
		}

		return null;
	}

	createChunk(x, y)
	{
		var chunk = {x: x, y: y, tiles: []};

		for (var _y = y; _y < y + this.chunkSize; _y += this.tileSize) {
			for (var _x = x; _x < x + this.chunkSize; _x += this.tileSize) {
				var value = +Noise.simplex2(_x / this.tweak, _y / this.tweak).toFixed(2);
				var tree  = MapGenerator.isForrestable(value);

				chunk.tiles.push({x: _x, y: _y, noise: value, tree: tree});
			}
		}

		this.world.push(chunk);
	}

}
