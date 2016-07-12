import {Template} from "meteor/templating";
import "../imports/startup/routes.js";
import {MapRenderer} from "../imports/game/world/renderer";
import {settings} from "../imports/game/settings";
WorldMap = new Mongo.Collection("WorldMap");

Template.world.onCreated(function()
{
	this.subscribe("WorldMap");
});

Template.world.onRendered(function()
{
	let stage       = new createjs.Stage("world-canvas");
	let mapRenderer = new MapRenderer(stage);
	this.autorun(() =>
	{
		if (this.subscriptionsReady()) {
			WorldMap.find().map(function(chunk, key)
			{
				mapRenderer.loadChunk(chunk, settings.chunkSize, settings.tileSize);
				mapRenderer.renderTrees(chunk, settings);
			});

			// Add Debug Visualzorz.
			WorldMap.find().map(function(chunk, key)
			{
				if (settings.debug.renderTileDebug) {
					mapRenderer.renderTileDebug(chunk, key);
				}

				if (settings.debug.renderChunkDebug) {
					mapRenderer.renderChunkDebug(chunk);
				}
			});

			stage.update();
		}
	});
});
