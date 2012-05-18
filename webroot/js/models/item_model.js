define([
	'libs/backbone'
], function(Backbone){
	var ItemModel = Backbone.Model.extend({
		defaults: {
			done: false,
			text: 'Enter what to be doin',
			order: 99
		},
		url : function() {
			var base =  'api/item';
			if (this.isNew()) return base;
			else return base + '/' + this.id;
		}
	});
	return ItemModel;
});
