export class MapRenderer {

	constructor(stage, settings)
	{
		this.stage    = stage;
		this.settings = settings;
		
		this.debugLayers = [];
	}

	renderChunk(chunk)
	{

		for (let index = 0; index < chunk.tiles.length; index++) {
			let tile  = chunk.tiles[index];
			let color = MapRenderer.getColorFromNoiseValue(tile.noise);

			let shape = new createjs.Shape();
			shape.graphics.beginFill(color).drawRect(0, 0, this.settings.tileSize, this.settings.tileSize);
			shape.x = tile.x;
			shape.y = tile.y;

			this.stage.addChild(shape);
		}
		
	}

	renderDebugChunk(chunk, index)
	{
		this.renderTileDebug(chunk, index);
	}
	
	renderTrees(chunk)
	{
		for (let index = 0; index < chunk.tiles.length; index++) {
			let tile = chunk.tiles[index];
			if (tile.tree !== null) {
				//var tempTree = new createjs.Shape();
				var image    = new Image();
				image.src    = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAadJREFUWEe9kb1VxDAQhF0EAQEFEBIQXAEEhFcAIQEBJVxMETQLDM+fGa9WtnS2mfcGS/szM+KGHtychi/4A/2Z6L1xfF9I+P3zPNENs964dj0Q5izh8+U00Q2znu9ybgaGCGHw+HJXmDm957ucR/k6NOSGCHHvDRDv6I92c2DsizJ0geycMeujKxYhslfrqwCQXmTWc62sVoSIAXzBQ0Cf8xmvZSFgEUAghC9KlBomcaaH7FbNGXSzWOPuPT+3cBbCzTFxc69BRLj7rL70s7PXfkPUAvQQQTS4c87YHGAtnIs6CVCbmQLEn0F0g1pdpJ7tZDNwZg4IgWEUdNFWZsZi1ZzBTCzS5z0ctSUWITyAm6xRO27udLNYrwZgqCbaSu0TwGv6pgEEQmw1h5kWtcIcxP9ED/21NS6agxiiJ1CcjTqr5oAQLEUhzpFxLuqM8m3QAksu9HT/d470nu9y3gSEZLLE3QxrkMnr821K9cax4xADfLw9TDw8QO31/xIie3m8HxYCc8SzAHD3ENGcGkYi5j7r85shIRcjAHU3o8b9MLjB9WbD8A3HZv97K9JtEgAAAABJRU5ErkJggg==";
				var tempTree = new createjs.Bitmap(image);

				//if (tile.tree == 1) {
				//tempTree.graphics.beginFill("orange").drawCircle(0, 0, settings.tileSize / 2);
				//}

				tempTree.x = tile.x;
				tempTree.y = tile.y;

				this.stage.addChild(tempTree);
			}
		}

	}

	renderTileDebug(chunk, chunkIndex)
	{
		let tileDebugContainer = new createjs.Container(); 
		// Tile Outline
		for (let index = 0; index < chunk.tiles.length; index++) {
			let tile = chunk.tiles[index];
			let text = new createjs.Text((index + 1) * (chunkIndex + 1), "5px Tahoma", "#FFFFFF");
			text.x   = tile.x + 14;
			text.y   = tile.y + 14;

			var line1 = new createjs.Shape();
			line1.graphics.setStrokeStyle(1);
			line1.graphics.beginStroke("#d3d3d3");
			line1.graphics.moveTo(tile.x, tile.y);
			line1.graphics.lineTo(tile.x + 32, tile.y);
			line1.graphics.endStroke();

			var line2 = new createjs.Shape();
			line2.graphics.setStrokeStyle(1);
			line2.graphics.beginStroke("#d3d3d3");
			line2.graphics.moveTo(tile.x, tile.y);
			line2.graphics.lineTo(tile.x, tile.y + 32);
			line2.graphics.endStroke();
			
// 			tileDebugContainer.addChild(text);
			this.stage.addChild(text);
		}
		
		
		
	}

	renderChunkDebug(chunk)
	{
		// Chunk Outline
		var line1 = new createjs.Shape();
		line1.graphics.setStrokeStyle(5);
		line1.graphics.beginStroke("#000000");
		line1.graphics.moveTo(chunk.x, chunk.y);
		line1.graphics.lineTo(chunk.x + 1024, chunk.y);
		line1.graphics.endStroke();
		this.stage.addChild(line1);

		var line2 = new createjs.Shape();
		line2.graphics.setStrokeStyle(5);
		line2.graphics.beginStroke("#000000");
		line2.graphics.moveTo(chunk.x, chunk.y);
		line2.graphics.lineTo(chunk.x, chunk.y + 1024);
		line2.graphics.endStroke();
		this.stage.addChild(line2);

		var line3 = new createjs.Shape();
		line3.graphics.setStrokeStyle(5);
		line3.graphics.beginStroke("#000000");
		line3.graphics.moveTo(chunk.x, chunk.y + 1024);
		line3.graphics.lineTo(chunk.x + 1024, chunk.y + 1024);
		line3.graphics.endStroke();
		this.stage.addChild(line3);

		var line4 = new createjs.Shape();
		line4.graphics.setStrokeStyle(5);
		line4.graphics.beginStroke("#000000");
		line4.graphics.moveTo(chunk.x + 1024, chunk.y);
		line4.graphics.lineTo(chunk.x + 1024, chunk.y + 1024);
		line4.graphics.endStroke();
		this.stage.addChild(line4);
	}

	static getColorFromNoiseValue(n)
	{
		var color;

		if (n <= 0) {
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

