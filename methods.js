import {Meteor} from "meteor/meteor";

Meteor.methods({
	clearServerLog() {
		ThugLog.remove({});
		return true;
	},
	findOrInsertPlayer(name)
	{
		if (name) {
			var player = Players.findOne({nickname: name});
			if (player) {
				return player;
			} else {
				let playerId = Players.insert({
					nickname: name, x: 512, y: 512,
					world_id: Games.findOne()._id
				});
				let player   = Players.findOne(playerId);
				return player;
			}
		}
		let playerId = Players.insert({x: 512, y: 512});
		return Players.findOne(playerId);
	}
});