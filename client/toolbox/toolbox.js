import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";

Template.toolbox.onCreated(function()
{
	this.subscribe("worldData");
});

Template.toolbox.onRendered(function()
{
	subscribeToDebugKeys(this);
});

Template.toolbox.events({
	'click button[name="clear-local-log"]': function(event, template)
	{
		LocalLog.remove({});
		cn.local('Log cleared');
	},
	'click button[name="clear-server-log"]': function(event, template)
	{
		Meteor.call('clearServerLog', [], (err, result) =>
		{
			if (err) {
				alert(err);
			} else {
				cn.server('Log cleared');
			}
		});
	},
	// 	'keydown button[name="camera-l"]': function(event, template)
	// 	{
	// 		unfollow(template, $('.player-follow-btn'));
	// 		template.data.player.world.camera.moveLeft(10);
	// 	},
	// 	'click button[name="camera-r"]': function(event, template)
	// 	{
	// 		unfollow(template, $('.player-follow-btn'));
	// 		template.data.player.world.camera.moveRight(10);
	// 	},
	// 	'click button[name="camera-u"]': function(event, template)
	// 	{
	// 		unfollow(template, $('.player-follow-btn'));
	// 		template.data.player.world.camera.moveUp(10);
	// 	},
	// 	'click button[name="camera-d"]': function(event, template)
	// 	{
	// 		unfollow(template, $('.player-follow-btn'));
	// 		template.data.player.world.camera.moveDown(10);
	// 	},

	'click button[name="toggle-player-follow"]': function(event, template)
	{
		let player                 = template.data.player;
		let alreadyFollowingPlayer = false;
		if (event.target.innerHTML == 'Unfollow') {
			alreadyFollowingPlayer = true;
		}
		toggleFollowPlayer(player, template, event, alreadyFollowingPlayer);
	},

	'click button[name="thug-follow-button"]': function(event, template)
	{
		let alreadyFollowingPlayer = false;
		if (event.target.innerHTML == 'Unfollow') {
			alreadyFollowingPlayer = true;
		}
		let index  = $(event.target).data('thug-index');
		let player = template.data.world.thugPlayers[index];
		toggleFollowPlayer(player, template, event, alreadyFollowingPlayer);
	},

});

var unfollow = function(template)
{
	template.data.camera.unfollow();
	$('.follow-btn').text('Follow');
};
var follow   = function(template, player, target)
{
	template.data.camera.follow(player);
	$('.follow-btn').text('Follow');
	$(target).text('Unfollow');
};

var toggleFollowPlayer = function(player, template, event, alreadyFollowingPlayer)
{
	let following = template.data.camera.following;
	if (following) {
		unfollow(template, event.target);
		if (!alreadyFollowingPlayer) {
			follow(template, player, event.target);
		}
	} else {
		follow(template, player, event.target);
	}
};

Template.toolbox.helpers({
	world: function()
	{
		return this;
	},
	chunkCount: function()
	{
		return WorldMap.find().count();
	},
	playerEnergy: function()
	{
		return this.player.energy;
	},
	playerCount: function()
	{
		return Players.find().count();
	},
	thugs: function()
	{
		return Players.find({_id: {$ne: this.player.id}});
	},
	localLog: function()
	{
		return LocalLog.find({}, {sort: {createdAt: -1}});
	},
	thugLog: function()
	{
		return ThugLog.find({}, {sort: {createdAt: -1}});
	},
});

Template.registerHelper('formatDate', function(date)
{
	return moment(date).format('HH:MM:SS');
});

let subscribeToDebugKeys = function(template)
{
	key('0', () =>
	{
		let layer = template.data.settings.debug.tile;
		layer.set(!layer.get());
	});

	key('1', () =>
	{
		let layer = template.data.settings.debug.chunk;
		layer.set(!layer.get());
	});
	key('right', () =>
	{
		unfollow(template);
		template.data.camera.moveRight(10);
	});
	key('left', () =>
	{
		unfollow(template);
		template.data.camera.moveLeft(10);
	});
	key('up', () =>
	{
		unfollow(template);
		template.data.camera.moveUp(10);
	});

	key('down', () =>
	{
		unfollow(template);
		template.data.camera.moveDown(10);
	});
};