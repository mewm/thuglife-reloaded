import {Meteor} from "meteor/meteor";
import {MapGenerator} from "../imports/game/world/generator";
import {GameSettings} from "../imports/game/settings";

WorldMap     = new Mongo.Collection('WorldMap');
PlayerEvents = new Mongo.Collection('PlayerEvents');
ThugLog      = new Mongo.Collection('ThugLog');
Players      = new Mongo.Collection('Players');

Meteor.publish('players', function()
{
	return Players.find();
});

Meteor.publish('thug_log', function()
{
	return ThugLog.find();
});

Meteor.publish('player_events', function()
{
	return PlayerEvents.find();
});

Meteor.publish('worldmap', function()
{
	return WorldMap.find();
});

Meteor.startup(function()
{
	WorldMap.remove({});
	Players.remove({});
	PlayerEvents.remove({});
	console.log(WorldMap.find().count());

	if (WorldMap.find().count() === 0) {
		const mapGenerator = new MapGenerator(new GameSettings());
		const world        = mapGenerator.world;
		world.map(function(chunk)
		{
			WorldMap.insert(chunk, function(err, id)
			{
			});
			console.log(world.indexOf(chunk));
		});
	}
});

// Kadira.connect('w5wdSz9dKFKBs3HMY', 'd29c4d76-de41-44f0-8ace-cb20ed1795dd');

ThugLog.allow({
	insert: function(userId, doc)
	{
		return true;
	},
	update: function(userId, doc, fields, modifier)
	{
		return true;
	},
	remove: function(userId, doc)
	{
		return true;
	}
});

PlayerEvents.allow({
	insert: function(userId, doc)
	{
		return true;
	},
	update: function(userId, doc, fields, modifier)
	{
		return true;
	},
	remove: function(userId, doc)
	{
		return true;
	}
});

Players.allow({
	insert: function(userId, doc)
	{
		return true;
	},
	update: function(userId, doc, fields, modifier)
	{
		return true;
	},
	remove: function(userId, doc)
	{
		return true;
	}
});

WorldMap.allow({
	insert: function(userId, doc)
	{
		return true;
	},
	update: function(userId, doc, fields, modifier)
	{
		return true;
	},
	remove: function(userId, doc)
	{
		return true;
	}
});
