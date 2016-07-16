import {Template} from "meteor/templating";
import {World} from "../imports/game/world/world";
import {GameSettings} from "../imports/game/settings";
import logger from "../imports/game/lib/logger";
import "../node_modules/keymaster";
import "../imports/startup/routes.js";

WorldMap     = new Mongo.Collection("WorldMap");
Players      = new Mongo.Collection("Players");
PlayerEvents = new Mongo.Collection("PlayerEvents");
ThugLog      = new Mongo.Collection("ThugLog");
LocalLog     = new Mongo.Collection(null);
cn           = logger.bootstrap(LocalLog, ThugLog);

Template.game.onCreated(function()
{
	this.settings    = new GameSettings();
	this.mapRendered = new ReactiveVar(false);

	// Get thug name or generate one
	this.thugName = Session.get('thugName');
	if (!this.thugName) {
		this.thugName = FlowRouter.getQueryParam('thug');
		if (!this.thugName) {
			this.thugName = faker.internet.userName();
		}
	}
	Session.set('thugName', this.thugName);

	// Collection subscriptions
	this.subscribe("worldmap");
	this.subscribe("player_events");
	this.subscribe("players");
	this.subscribe("thug_log");

});

Template.game.onRendered(function()
{
	// Canvas and settings
	const $canvas         = $('#canvas');
	this.settings.canvasW = $canvas.width() - 300;
	this.settings.canvasH = $canvas.height();

	// Create world
	this.world             = new World($canvas, this.settings);
	this.world.mapRendered = new ReactiveVar(false);
	subscribeToDebugKeys(this);
	$canvas.append(this.world.camera.renderer.view);

	// When map is loaded into the client, render world
	this.autorun(() =>
	{
		if (this.subscriptionsReady() && !this.mapRendered.get()) {
			// World loaded
			this.mapRendered.set(true);
			cn.local('World data loaded', null, 'success');

			// Find player
			let player      = findOrInsertPlayer(this.thugName);
			let thugPlayers = Players.find({nickname: {$ne: this.thugName}}, {reactive: false}).fetch();
			cn.local('Loaded player: <b>' + player.nickname + '</b>', player, 'success');
			cn.local('Loaded thugs: <b>' + thugPlayers.length + '</b>', thugPlayers, 'success');

			// Install world
			this.world.installWorld(WorldMap.find({}).fetch(), player, thugPlayers, PlayerEvents, Players);
			this.world.start();
			this.world.camera.update();
		}
	});

	// Toggle debug tool rendering
	this.autorun(() =>
	{
		cn.local('Debug tools invoked');
		for (let debugLayer in this.settings.debug) {
			if (this.settings.debug.hasOwnProperty(debugLayer) && this.mapRendered.get()) {
				this.world.camera.debugVisibility(debugLayer, this.settings.debug[debugLayer].get());
			}
		}
		this.world.camera.update();
	});

	// Assign new players
	Players.find({nickname: {$ne: this.thugName}}).observe({
		added: this.world.listenToNewThugPlayers.bind(this.world)
	});

	// Assign player event listener
	PlayerEvents.find({a: 'c'}).observe({
		added: this.world.listenToPlayerClick.bind(this.world)
	});

});

Template.game.helpers({
	world: function()
	{
		if (Template.instance().mapRendered.get()) {
			return Template.instance().world;
		}
		return false;
	}
});

let findOrInsertPlayer = function(name)
{
	if (name) {
		var player = Players.findOne({nickname: name});
		if (player) {
			return player;
		} else {
			let playerId = Players.insert({nickname: name, x: 512, y: 512});
			let player   = Players.findOne(playerId);
			return player;

		}
	}

	let playerId = Players.insert({x: 512, y: 512});
	return Players.findOne(playerId);
};

let subscribeToDebugKeys = function(template)
{
	key('0', () =>
	{
		let layer = template.settings.debug.tile;
		layer.set(!layer.get());
	});

	key('1', () =>
	{
		let layer = template.settings.debug.chunk;
		layer.set(!layer.get());
	});
	key('right', () =>
	{
		template.game.camera.world.x = template.game.camera.world.x - 10;
	});
	key('left', () =>
	{
		template.game.camera.world.x = game.world.camera.world.x + 10;
	});
	key('up', () =>
	{
		template.game.camera.world.y = template.game.camera.world.y + 10;
	});

	key('down', () =>
	{
		template.world.game.world.y = template.world.game.world.y + 10;
	});
};
