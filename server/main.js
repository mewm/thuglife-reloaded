import {Meteor} from "meteor/meteor";
import {MapGenerator} from "../imports/game/world/generator";
import {GameSettings} from "../imports/game/settings";

WorldMap     = new Mongo.Collection('WorldMap');
Worlds       = new Mongo.Collection('Worlds');
PlayerEvents = new Mongo.Collection('PlayerEvents');
ThugLog      = new Mongo.Collection('ThugLog');
Players      = new Mongo.Collection('Players');

// Server
Meteor.publishComposite('worldData', {
	find: function()
	{
		// Find top ten highest scoring posts

		return Worlds.find({}, {sort: {createdAt: -1}, limit: 1});
	},
	children: [
		{
			find: function(world)
			{
				return WorldMap.find({world_id: world._id});
			}
		},
		{
			find: function(world)
			{
				return Players.find({world_id: world._id});
			}
		},
		{
			find: function(world)
			{
				return ThugLog.find({world_id: world._id});
			}
		},
		{
			find: function(world)
			{
				return PlayerEvents.find({world_id: world._id});
			}
		}
	]
});

Meteor.startup(function()
{
// 	Worlds.remove({});
// 	WorldMap.remove({});
// 	Players.remove({});
	PlayerEvents.remove({});
	console.log(WorldMap.find().count());
	let seed = 0.532811;
	if (Worlds.find().count() === 0) {
		let newWorld = Worlds.insert({seed});
		const mapGenerator = new MapGenerator(new GameSettings(), seed);
		const world        = mapGenerator.world;
		world.map(function(chunk)
		{
			chunk.world_id = newWorld;
			WorldMap.insert(chunk, function(err, id)
			{
			});
			console.log(world.indexOf(chunk));
		});
	}
});

// Kadira.connect('w5wdSz9dKFKBs3HMY', 'd29c4d76-de41-44f0-8ace-cb20ed1795dd');
Worlds.allow({});
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
