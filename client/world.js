import {Template} from "meteor/templating";
import "../imports/startup/routes.js";
import {MapRenderer} from "../imports/game/world/renderer";
import {GameSettings} from "../imports/game/settings";
import "../node_modules/keymaster";
import { ReactiveVar } from "meteor/reactive-var";

WorldMap = new Mongo.Collection("WorldMap");

Template.world.onCreated(function()
{
	this.gameSettings = new GameSettings();
	this.subscribe("WorldMap");
});

Template.world.onRendered(function()
{
	subscribeToDebugKeys(this);
	let stage       = new createjs.Stage("world-canvas");
	let mapRenderer = new MapRenderer(stage, this.gameSettings);
	let mapRendered = new ReactiveVar(false);

	// When map is loaded into the client, render world
	this.autorun(() =>
	{
		console.log('Map loaded, rendering');
		if (this.subscriptionsReady()) {
			console.log('Subs ready');
			WorldMap.find().map((chunk, key) =>
			{
				mapRenderer.renderChunk(chunk);
				mapRenderer.renderTrees(chunk);
			});
			stage.update();
			mapRendered.set(true);
		}
	});

	// When map is loaded into the client, render world
	this.autorun(() =>
	{
		console.log('Rendering debug tools');

		if ((this.gameSettings.debug.renderTileDebug.get() || this.gameSettings.debug.renderChunkDebug.get()) && mapRendered.get()) {
			console.log('Debugging changed');
			WorldMap.find().map((chunk, key) =>
			{
				mapRenderer.renderDebugChunk(chunk, key);
			});
			stage.update();
		}
	});
});

let subscribeToDebugKeys = function(template)
{
	key('0', () =>
	{
		template.gameSettings.renderTileDebug.set(true);
	});

	key('1', () =>
	{
		template.gameSettings.renderChunkDebug.set(true);
	});
};
