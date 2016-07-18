import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import logger from "../imports/game/lib/logger";
import "../node_modules/keymaster";
import "../imports/startup/routes.js";
import {Game} from "../imports/game/game";

WorldMap     = new Mongo.Collection("WorldMap");
Games        = new Mongo.Collection("Games");
Players      = new Mongo.Collection("Players");
PlayerEvents = new Mongo.Collection("PlayerEvents");
ThugLog      = new Mongo.Collection("ThugLog");
LocalLog     = new Mongo.Collection(null);
cn           = logger.bootstrap(LocalLog, ThugLog);

Template.thuglife.onCreated(function()
{
	this.gameState = new ReactiveVar('NOT_LOADED');

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
	this.subscribe("worldData");

});

Template.thuglife.onRendered(function()
{
	this.game = null;
	Tracker.autorun(() =>
	{
		if (this.subscriptionsReady()) {
			if (this.gameState.get() == 'NOT_LOADED') {
				this.gameState.set('LOADING');
				let gameData = Games.findOne({});
				this.game    = new Game(gameData._id, gameData.seed, $('#canvas'), {
					worldMap: WorldMap,
					players: Players,
					playerEvents: Players,
				});
				this.game.initialize(() =>
				{
					this.gameState.set('LOADED');
					this.game.start();
					cn.local('Game startet, start thuggin!');
				});
			} else if (this.gameState.get() == 'LOADED') {
				this.game.hotReload();
			}

			// Assign new players
			Players.find({nickname: {$ne: this.thugName}}).observe({
				added: this.game.listenToNewThugPlayers.bind(this.game)
			});

			// Assign player event listener
			PlayerEvents.find({a: 'c'}).observe({
				added: this.game.listenToPlayerClick.bind(this.game)
			});
		}
	});

	// Toggle debug tool rendering
	this.autorun(() =>
	{
		if (this.gameState.get() !== 'LOADED') {
			return;
		}

		let settings = this.game.settings;
		cn.local('Debug tools invoked');
		for (let debugLayer in settings.debug) {
			if (settings.debug.hasOwnProperty(debugLayer) && this.gameState.get()) {
				this.game.camera.debugVisibility(debugLayer, settings.debug[debugLayer].get());
			}
		}
		this.game.camera.update();
	});

});

Template.thuglife.helpers({
	gameLoaded: function()
	{
		if (Template.instance().gameState.get() === 'LOADED') {
			return true;
		}
		return false;
	},

	getGame: function()
	{
		return Template.instance().game;
	}
});
