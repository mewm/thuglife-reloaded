import { Meteor } from 'meteor/meteor';

Meteor.methods({
	clearServerLog() {
		ThugLog.remove({});
		return true;
	}
});