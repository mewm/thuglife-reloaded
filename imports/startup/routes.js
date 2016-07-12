FlowRouter.route('/', {
	name: 'World',
	action(params, queryParams) {
		BlazeLayout.render('world-layout', { main: "world"});
	}
});

FlowRouter.route('/gen', {
	name: 'Generate world',
	action(params, queryParams) {
		console.log("Should generate");

	}
});