FlowRouter.route('/', {
	name: 'World',
	action(params, queryParams) {
		BlazeLayout.render('game-layout', { main: "game"});
	}
});

FlowRouter.route('/gen', {
	name: 'Generate world',
	action(params, queryParams) {
		console.log("Should generate");

	}
});