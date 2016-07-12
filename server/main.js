import {Meteor} from "meteor/meteor";
import {MapGenerator} from "../imports/game/world/generator";
import {GameSettings} from "../imports/game/settings";

WorldMap = new Mongo.Collection('WorldMap');
Meteor.publish('WorldMap', function()
{
	console.log('Published ' + WorldMap.find().count());
	return WorldMap.find();
});

Meteor.startup(function()
{
	WorldMap.remove({});
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