import {Noise} from "../util/noise";

export class MapGenerator {
	constructor(settings)
	{
		this.world     = [];
		this.tweak     = settings.tweak;
		this.chunksize = settings.chunkSize;
		this.tileSize  = settings.tileSize;
		this.chunks    = settings.chunks;

		Noise.seed(Math.random());

		for (var x = 0; x < this.chunks; x++) {
			this.createChunk(x * this.chunksize, 0);
			for (var y = 1; y < this.chunks; y++) {
				this.createChunk(x * this.chunksize, y * this.chunksize);
			}
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

		for(var _y = y; _y < y + this.chunksize; _y += this.tileSize) {
			for (var _x = x; _x < x + this.chunksize; _x += this.tileSize) {
				var value = +Noise.simplex2(_x / this.tweak, _y / this.tweak).toFixed(2);
				var tree = MapGenerator.isForrestable(value);

				chunk.tiles.push({x: _x, y: _y, noise: value, tree: tree});
			}
		}

		this.world.push(chunk);
	}
	
}
