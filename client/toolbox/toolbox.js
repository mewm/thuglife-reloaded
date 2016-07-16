import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";

Template.toolbox.onCreated(function()
{
	this.subscribe("player_events");
	this.subscribe("players");
	this.subscribe("thug_log");
	this.subscribe("worldmap");
	this.subscribe("thug_log");
});

Template.toolbox.onRendered(function()
{
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
	}
});

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