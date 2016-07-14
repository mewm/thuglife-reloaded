import {Meteor} from "meteor/meteor";
import {MapGenerator} from "../imports/game/world/generator";
import {GameSettings} from "../imports/game/settings";


WorldMap = new Mongo.Collection('WorldMap');
PlayerEvents = new Mongo.Collection('PlayerEvents');
Players  = new Mongo.Collection('Players');

Meteor.publish('thug_players', function(playerId)
{
	return Players.find({ _id: { $ne: playerId } });
});

Meteor.publish('player_events', function()
{
	return PlayerEvents.find();
});

Meteor.publish('player', function(sessionId)
{
	console.log('Publishing player for id ' + sessionId);
	return Players.find({ session_id: sessionId });
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

Kadira.connect('w5wdSz9dKFKBs3HMY', 'd29c4d76-de41-44f0-8ace-cb20ed1795dd');