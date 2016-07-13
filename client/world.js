import "../imports/startup/routes.js";
import {Template} from "meteor/templating";
import {MapRenderer} from "../imports/game/world/renderer";
import {World} from "../imports/game/world/world";
import {GameSettings} from "../imports/game/settings";
import {ReactiveVar} from "meteor/reactive-var";
import {Random} from "meteor/random";
import {Session} from "meteor/session";
import "../node_modules/keymaster";

WorldMap = new Mongo.Collection("WorldMap");
Players  = new Mongo.Collection("Players");

Template.world.onCreated(function()
{
	this.gameSettings = new GameSettings();
	this.subscribe("worldmap");
	this.subscribe("players");
	
});

Template.world.onRendered(function()
{
	var playerSessionId = getPlayerSessionId();
	this.subscribe("player", playerSessionId);
	subscribeToDebugKeys(this);
	const stage       = new createjs.Stage("world-canvas");
	createjs.Ticker.setFPS(10);
	const world       = new World(new MapRenderer(stage, this.gameSettings), this.gameSettings);
	let mapRendered = new ReactiveVar(false);
	let player        = findOrInsertPlayer(playerSessionId);

	// When map is loaded into the client, render world
	this.autorun(() =>
	{
		if (this.subscriptionsReady()) {
			world.debug('World loaded');
			world.installWorld(WorldMap.find().fetch(), player);
			stage.update();
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
		stage.update();
	});

	// Bind ticking event
	createjs.Ticker.addEventListener("tick", world.tick.bind(world));
});

let findOrInsertPlayer = function(playerSessionId)
{
	var player = Players.findOne({session_id: playerSessionId});
	if (!player) {
		let playerId = Players.insert({session_id: playerSessionId, x: Math.random() * 1024, y: Math.random() * 1024});
		player       = Players.findOne(playerId);
	}
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
};

let getPlayerSessionId = function()
{
	let playerSessionId = Session.get('playerSessionId');
	if (!playerSessionId) {
		let randomId = playerSessionId = Random.id();
		Session.set('playerSessionId', randomId);
	}
	return playerSessionId;
};

