export class MapRenderer {
	constructor(stage, settings)
	{
		this.stage    = stage;
		this.settings = settings;

		this.layers = {
			world: this.createLayer(),
			trees: this.createLayer(),
			players: this.createLayer(),
			player: this.createLayer()
		};

		for (let layer in this.layers) {
			if (this.layers.hasOwnProperty(layer)) {
				this.stage.addChild(this.layers[layer]);
			}
		}

		this.debugLayers = {
			tile: null,
			chunk: null
		};
	}




	createPlayerShape(player)
	{
		let container   = new createjs.Container();
		let playerShape = new createjs.Shape();
		var color       = "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")";
		playerShape.graphics.beginFill(color).drawCircle(16, 16, 16);
		playerShape.x = player.position.x;
		playerShape.y = player.position.y;
		container.addChild(playerShape);

		return container;
	}

	createTreeShape(tile)
	{
		//var tempTree = new createjs.Shape();
		var image    = new Image();
		image.src    = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAadJREFUWEe9kb1VxDAQhF0EAQEFEBIQXAEEhFcAIQEBJVxMETQLDM+fGa9WtnS2mfcGS/szM+KGHtychi/4A/2Z6L1xfF9I+P3zPNENs964dj0Q5izh8+U00Q2znu9ybgaGCGHw+HJXmDm957ucR/k6NOSGCHHvDRDv6I92c2DsizJ0geycMeujKxYhslfrqwCQXmTWc62sVoSIAXzBQ0Cf8xmvZSFgEUAghC9KlBomcaaH7FbNGXSzWOPuPT+3cBbCzTFxc69BRLj7rL70s7PXfkPUAvQQQTS4c87YHGAtnIs6CVCbmQLEn0F0g1pdpJ7tZDNwZg4IgWEUdNFWZsZi1ZzBTCzS5z0ctSUWITyAm6xRO27udLNYrwZgqCbaSu0TwGv6pgEEQmw1h5kWtcIcxP9ED/21NS6agxiiJ1CcjTqr5oAQLEUhzpFxLuqM8m3QAksu9HT/d470nu9y3gSEZLLE3QxrkMnr821K9cax4xADfLw9TDw8QO31/xIie3m8HxYCc8SzAHD3ENGcGkYi5j7r85shIRcjAHU3o8b9MLjB9WbD8A3HZv97K9JtEgAAAABJRU5ErkJggg==";
		var tempTree = new createjs.Bitmap(image);
		tempTree.x   = tile.x;
		tempTree.y   = tile.y;

		return tempTree;
	}

	// Debugging
	renderDebugWorld(mapCollection)
	{
		this.renderTileDebugLayer(mapCollection);
		this.renderChunkDebugLayer(mapCollection);
	}

	/**
	 * @param key
	 * @param visibility
	 */
	setDebugLayerVisibility(key, visibility)
	{
		this.debugLayers[key].visible = visibility;
	}

	/**
	 */
	renderTileDebugLayer(mapCollection)
	{
		this.debugLayers.tile = new createjs.Container();
		// Tile Outline
		mapCollection.map((chunk) =>
		{
			let tileLayer = new createjs.Container();
			for (let index = 0; index < chunk.tiles.length; index++) {
				let tile = chunk.tiles[index];
				let text = new createjs.Text(index, "10px Tahoma", "#FFFFFF");
				text.x   = tile.x + 10;
				text.y   = tile.y + 10;

				var line1 = new createjs.Shape();
				line1.graphics.setStrokeStyle(1)
					.beginStroke("#d3d3d3")
					.moveTo(tile.x, tile.y)
					.lineTo(tile.x + 32, tile.y)
					.endStroke();

				var line2 = new createjs.Shape();
				line2.graphics.setStrokeStyle(1)
					.beginStroke("#d3d3d3")
					.moveTo(tile.x, tile.y)
					.lineTo(tile.x, tile.y + 32)
					.endStroke();

				tileLayer.addChild(text);
				tileLayer.addChild(line1);
				tileLayer.addChild(line2);
			}
			this.debugLayers.tile.addChild(tileLayer);
		});

		this.debugLayers.tile.cache(0, 0, 16384, 16384);

		this.stage.addChild(this.debugLayers.tile);

	}

	/**
	 * @param mapCollection
	 */
	renderChunkDebugLayer(mapCollection)
	{
		this.debugLayers.chunk = new createjs.Container();
		mapCollection.map((chunk) =>
		{
			// Chunk Outline
			var line1 = new createjs.Shape();
			line1.graphics.setStrokeStyle(5).beginStroke("#000000").moveTo(chunk.x, chunk.y).lineTo(chunk.x + 1024, chunk.y).endStroke();
			this.debugLayers.chunk.addChild(line1);

			var line2 = new createjs.Shape();
			line2.graphics.setStrokeStyle(5)
				.beginStroke("#000000")
				.moveTo(chunk.x, chunk.y)
				.lineTo(chunk.x, chunk.y + 1024)
				.endStroke();
			this.debugLayers.chunk.addChild(line2);

			var line3 = new createjs.Shape();
			line3.graphics.setStrokeStyle(5)
				.beginStroke("#000000")
				.moveTo(chunk.x, chunk.y + 1024)
				.lineTo(chunk.x + 1024, chunk.y + 1024)
				.endStroke();
			this.debugLayers.chunk.addChild(line3);

			var line4 = new createjs.Shape();
			line4.graphics.setStrokeStyle(5)
				.beginStroke("#000000")
				.moveTo(chunk.x + 1024, chunk.y)
				.lineTo(chunk.x + 1024, chunk.y + 1024)
				.endStroke();
			this.debugLayers.chunk.addChild(line4);
		});

		this.stage.addChild(this.debugLayers.chunk);

	}

	/**
	 * @param n
	 * @returns {*}
	 */
	static getColorFromNoiseValue(n)
	{
		var color;

		if (n <= -0.5) {
			color = "darkblue";
		} else if (n > -0.5 && n <= 0) {
			color = "blue";
		} else if (n > 0 && n <= 0.15) {
			color = "beige";
		} else if (n > 0.15 && n <= 0.50) {
			color = "green";
		} else if (n > 0.50 && n <= 0.75) {
			color = "darkgreen";
		} else if (n > 0.75 && n <= 0.90) {
			color = "darkgrey";
		} else if (n > 0.90) {
			color = "white";
		}

		return color;
	}
}

