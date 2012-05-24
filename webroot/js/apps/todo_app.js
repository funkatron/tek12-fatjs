require.config({
	baseUrl: "js"
});


define([

	'libs/jquery',
	'libs/backbone',
	'models/item_model',
	'collections/item_collection',
	'views/item_view',
	'libs/ujs'

], function($, Backbone, ItemModel, ItemCollection, ItemView) {

	var TodoApp = Backbone.View.extend({

		initialize: function() {
			// this.collection = new ItemCollection(window.collection);
			this.collection = new ItemCollection();
			this.collection.url = "/api/items";
			this.collection.fetch({
				'reset' : true,
				'success' : _.bind(function(resp, status, xhr) {
					this.render();
				}, this)
			});
			this.collection.bind('add', this.renderModel, this);
		},

		events: {
			'click #add-one': 'addOne'
		},

		addOne: function() {
			var model = new ItemModel();
			model.save();
			this.collection.add(model);
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