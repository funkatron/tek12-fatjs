define([

	'libs/backbone'

], function(Backbone){

	var ItemModel = Backbone.Model.extend({

		defaults: {
			done: false,
			text: 'Enter what it do',
			order: 99
		},

		urlRoot: 'api/items' // need this to create & save model independently

	});

	return ItemModel;

});
