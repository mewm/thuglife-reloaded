import PIXI from "../../../node_modules/pixi.js";

export class ElementFactory {
	constructor(settings)
	{
		this.settings = settings;
		this.textures = {
			bunny: PIXI.Texture.fromImage("bunny.png"),
		}
	}

	createEmptyContainer()
	{
		return new PIXI.Container();
	}

	createSingleChunkContainer(chunk)
	{
		let chunkContainer = this.createEmptyContainer();
		for (let index = 0; index < chunk.tiles.length; index++) {
			let tile = chunk.tiles[index];

			let chunkGraphics = new PIXI.Graphics();
			chunkGraphics.position.x   = tile.x;
			chunkGraphics.position.y   = tile.y;

			let color = ElementFactory.getColorFromNoiseValue(tile.noise);
			chunkGraphics.beginFill(color).drawRect(0, 0, this.settings.cellSize, this.settings.cellSize).endFill();

			chunkContainer.addChild(chunkGraphics);
		}

		return chunkContainer;
	}

	createPlayerContainer(player)
	{
		let playerContainer = this.createEmptyContainer();

		let image      = PIXI.Texture.fromImage("bunny.png");
		let playerSprite = new PIXI.Sprite(image);
		playerContainer.position.x   = player.position.x;
		playerContainer.position.y   = player.position.y;

		let text = new PIXI.Text(player.id, {font : '30px Arial', fill : 0xffffff, stroke: 0x000000, strokeThickness: 3});
		text.x   = playerContainer.position.x - 32;
		text.y   = playerContainer.position.y - 32;

		playerContainer.addChild(playerSprite);
		playerContainer.addChild(text);

		return playerContainer;
	}

	createTreeContainer(tile)
	{
		//var tempTree = new createjs.Shape();
		let treeContainer = this.createEmptyContainer();
		treeContainer.position.x = tile.x;
		treeContainer.position.y = tile.y;

		let image      = PIXI.Texture.fromImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAadJREFUWEe9kb1VxDAQhF0EAQEFEBIQXAEEhFcAIQEBJVxMETQLDM+fGa9WtnS2mfcGS/szM+KGHtychi/4A/2Z6L1xfF9I+P3zPNENs964dj0Q5izh8+U00Q2znu9ybgaGCGHw+HJXmDm957ucR/k6NOSGCHHvDRDv6I92c2DsizJ0geycMeujKxYhslfrqwCQXmTWc62sVoSIAXzBQ0Cf8xmvZSFgEUAghC9KlBomcaaH7FbNGXSzWOPuPT+3cBbCzTFxc69BRLj7rL70s7PXfkPUAvQQQTS4c87YHGAtnIs6CVCbmQLEn0F0g1pdpJ7tZDNwZg4IgWEUdNFWZsZi1ZzBTCzS5z0ctSUWITyAm6xRO27udLNYrwZgqCbaSu0TwGv6pgEEQmw1h5kWtcIcxP9ED/21NS6agxiiJ1CcjTqr5oAQLEUhzpFxLuqM8m3QAksu9HT/d470nu9y3gSEZLLE3QxrkMnr821K9cax4xADfLw9TDw8QO31/xIie3m8HxYCc8SzAHD3ENGcGkYi5j7r85shIRcjAHU3o8b9MLjB9WbD8A3HZv97K9JtEgAAAABJRU5ErkJggg==");
		let treeSprite = new PIXI.Sprite(image);

		treeContainer.addChild(treeSprite);

		return treeContainer;
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
		let debugConta = new this.createEmptyContainer();
		// Tile Outline
		mapCollection.map((chunk) =>
		{
			let tileContainer = new this.createEmptyContainer();

			for (let index = 0; index < chunk.tiles.length; index++) {
				let tile = chunk.tiles[index];
				let text = new createjs.Text(index, "10px Tahoma", "#FFFFFF");
				text.x   = tile.x + 10;
				text.y   = tile.y + 10;

				let line1 = new PIXI.Graphics();
				line1.beginFill(0xd3d3d3)
					.lineStyle(10, 0xd3d3d3, 1)
					.moveTo(tile.x, tile.y)
					.lineTo(tile.x + 32, tile.y)
					.endFill();

				let line2 = new PIXI.Graphics();
				line1.beginFill(0xd3d3d3)
					.lineStyle(10, 0xd3d3d3, 1)
					.moveTo(tile.x, tile.y)
					.lineTo(tile.x, tile.y + 32)
					.endFill();

				tileContainer.addChild(text);
				tileContainer.addChild(line1);
				tileContainer.addChild(line1);
			}
			tileContainer.addChild(tileContainer);
		});

		return tileContainer;

	}

	/**
	 * @param mapCollection
	 */
	renderChunkDebugLayer(mapCollection)
	{
		let debugContainer  = new this.createEmptyContainer();
		mapCollection.map((chunk) =>
		{
			// Chunk Outline
			let line1 = new PIXI.Graphics();
			line1.beginFill(0x000000)
				.lineStyle(10, 0xd3d3d3, 1)
				.moveTo(chunk.x, chunk.y)
				.lineTo(chunk.x + 1024, chunk.y)
				.endFill();
			debugContainer.addChild(line1);

			let line2 = new PIXI.Graphics();
			line2.beginFill(0x000000)
				.lineStyle(10, 0xd3d3d3, 1)
				.moveTo(chunk.x, chunk.y)
				.lineTo(chunk.x, chunk.y + 1024)
				.endFill();
			debugContainer.addChild(line2);

			let line3 = new PIXI.Graphics();
			line3.beginFill(0x000000)
				.lineStyle(10, 0xd3d3d3, 1)
				.moveTo(chunk.x, chunk.y + 1024)
				.lineTo(chunk.x + 1024, chunk.y + 1024)
				.endFill();
			debugContainer.addChild(line3);

			let line4 = new PIXI.Graphics();
			line4.beginFill(0x000000)
				.lineStyle(10, 0xd3d3d3, 1)
				.moveTo(chunk.x + 1024, chunk.y)
				.lineTo(chunk.x + 1024, chunk.y + 1024)
				.endFill();
			debugContainer.addChild(line4);
		});

		return debugContainer;

	}

	static getColorFromNoiseValue(n)
	{
		var color;

		if (n <= -0.5) {
			color = 0x0000cc;
		} else if (n > -0.5 && n <= 0) {
			color = 0x0066ff;
		} else if (n > 0 && n <= 0.15) {
			color = 0xffff99;
		} else if (n > 0.15 && n <= 0.50) {
			color = 0x009933;
		} else if (n > 0.50 && n <= 0.75) {
			color = 0x006600;
		} else if (n > 0.75 && n <= 0.90) {
			color = 0xa9a9a9;
		} else if (n > 0.90) {
			color = 0xffffff;
		}

		return color;
	}
}