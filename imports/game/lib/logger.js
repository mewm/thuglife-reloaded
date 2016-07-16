let logger = {
	bootstrap: function(localLogCollection, serverLogCollection)
	{
		this._localLogCollection  = localLogCollection;
		this._serverLogCollection = serverLogCollection;
		return this;
	},
	createLogObject: function(message, context, severity)
	{
		return {
			message,
			context,
			severity,
			createdAt: new Date()
		};
	}, 
	server: function(message, context, severity = 'info')
	{
		this._serverLogCollection.insert(this.createLogObject(message, context, severity));
	},
	local: function(message, context, severity = 'info')
	{
		this._localLogCollection.insert(this.createLogObject(message, context, severity));
	}
};

export default logger;