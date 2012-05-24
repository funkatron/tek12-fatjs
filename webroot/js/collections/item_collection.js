define([

	'libs/backbone',
	'models/item_model'

], function(Backbone, ItemModel){

	var ItemCollection = Backbone.Collection.extend({

		model: ItemModel,

		comparator: function(item) {
			return item.get('order');
		}

	});

	return ItemCollection;

});