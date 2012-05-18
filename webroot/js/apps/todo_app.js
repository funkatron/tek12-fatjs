require.config({
	baseUrl: "js"
});

define([
	'libs/jquery',
	'models/item_model',
	'collections/item_collection',
	'views/item_view',
	'libs/ujs'
], function($, ItemModel, ItemCollection, ItemView) {
	var TodoApp = Backbone.View.extend({
		initialize: function() {
			this.collection = new ItemCollection(window.collection);
			this.collection.bind('add', this.renderModel, this);
			this.render();
		},
		events: {
			'click #add-one': 'addOne'
		},
		addOne: function() {
			var model = new ItemModel({name: 'scoates', motto: ':dukedog'});
			this.collection.add(model);
			return false;
		},
		render: function() {
			this.collection.each(this.renderModel, this);
		},
		renderModel: function(model) {
			var view = new ItemView({model: model});
			$('#todo-list').append(view.el);
		}
	});
	new TodoApp({el: document.body});
});