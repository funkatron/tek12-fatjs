require.config({
	baseUrl: "js"
});

define([
	'libs/jquery',
	'models/my_model',
	'collections/my_collection',
	'views/my_view',
	'libs/ujs'
], function($, MyModel, MyCollection, MyView) {
	var App = Backbone.View.extend({
		initialize: function() {
			this.collection = new MyCollection(window.collection);
			this.collection.bind('add', this.renderModel, this);
			this.render();
		},
		events: {
			'click #add-one': 'addOne'
		},
		addOne: function() {
			var model = new MyModel({name: 'scoates', motto: ':dukedog'});
			this.collection.add(model);
			return false;
		},
		render: function() {
			this.collection.each(this.renderModel, this);
		},
		renderModel: function(model) {
			var view = new MyView({model: model});
			$('#my-view').append(view.el);
		}
	});
	new App({el: document.body});
});