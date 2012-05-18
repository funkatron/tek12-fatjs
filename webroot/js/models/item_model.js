define([
	'libs/backbone'
], function(Backbone){
	var ItemModel = Backbone.Model.extend({
		defaults: {
			done: false,
			text: 'Enter what to be doin',
			order: 99
		}
	});
	return ItemModel;
});
