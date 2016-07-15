import "../imports/startup/routes.js";
import {Template} from "meteor/templating";
import {World} from "../imports/game/world/world";
import {GameSettings} from "../imports/game/settings";
import {ReactiveVar} from "meteor/reactive-var";
import {Random} from "meteor/random";
import "../node_modules/keymaster";
import PIXI from "../node_modules/pixi.js";

WorldMap     = new Mongo.Collection("WorldMap");
Players      = new Mongo.Collection("Players");
PlayerEvents = new Mongo.Collection("PlayerEvents");
Template.world.onCreated(function()
{
	this.gameSettings = new GameSettings();
	this.subscribe("worldmap");
	this.subscribe("player_events");
});

Template.world.onRendered(function()
{
	let mapRendered = new ReactiveVar(false);
	let player      = findOrInsertPlayer();
	let renderer    = PIXI.autoDetectRenderer(this.gameSettings.canvasW, this.gameSettings.canvasH, {backgroundColor: 0x34495e});
	let world       = new World(this.gameSettings, renderer);
	this.subscribe("thug_players", player._id);
	subscribeToDebugKeys(this);

	$('#canvas').append(renderer.view);

	// When map is loaded into the client, render world
	this.autorun(() =>
	{
		console.log('Autorun1');
		if (this.subscriptionsReady()) {
			world.debug('World loaded');
			world.installWorld(WorldMap.find({}, {reactive: false}).fetch(), player, Players.find({}, {reactive: false}).fetch(), PlayerEvents, Players);
			renderer.render(world.cameraContainer);
			mapRendered.set(true);
		}
	});

	// Toggle debug tool rendering
	this.autorun(() =>
	{
		console.log('Rendering debug tools');
		for (let debugLayer in this.gameSettings.debug) {
			if (this.gameSettings.debug.hasOwnProperty(debugLayer) && mapRendered.get()) {
				world.debugVisibility(debugLayer, this.gameSettings.debug[debugLayer].get());
			}
		}
		renderer.render(world.cameraContainer);
	});

});

let findOrInsertPlayer = function()
{
	// 	var player = Players.findOne({session_id: playerSessionId});
	// 	if (!player) {
	let playerId = Players.insert({x: 512, y: 512});
	let player       = Players.findOne(playerId);
	// 	}
	return player;
};

let subscribeToDebugKeys = function(template)
{
	key('0', () =>
	{
		let layer = template.gameSettings.debug.tile;
		layer.set(!layer.get());
	});

	key('1', () =>
	{
		let layer = template.gameSettings.debug.chunk;
		layer.set(!layer.get());
	});
	key('right', () =>
	{
		template.world.camera.world.x = template.world.camera.world.x - 10;
	});
	key('left', () =>
	{
		template.world.camera.world.x = template.world.camera.world.x + 10;
	});
	key('up', () =>
	{
		template.world.camera.world.y = template.world.camera.world.y + 10;
	});

	key('down', () =>
	{
		template.world.camera.world.y = template.world.camera.world.y + 10;
	});
};


