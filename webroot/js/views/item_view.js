define([

	'libs/backbone',
	'libs/hbt!templates/item_template.html' // this uses hbt.js to compile the template

], function(Backbone, MyTemplate){

	var ItemView = Backbone.View.extend({

		tagName: 'div',

		className: 'row',

		initialize: function() {
			this.model.bind('change:text', this.render, this);
			this.model.bind('change:done', this.render, this);
			this.model.bind('change:order', this.render, this);
			this.render();
		},

		render: function() {
			this.$el.html(MyTemplate(this.model.toJSON()));
			this.textinput = this.$('.text');
			return this;
		},

		events: {
			'click .erase': 'erase',
			'click .done': 'done',
			'change .text': 'update'
		},

		update: function() {
			this.model.save({'text': this.textinput.val()});
			console.log(this.model.get('text'));
		},

		erase: function() {
			this.remove();
			this.model.destroy();
			return false;
		},

		done: function() {
			this.model.save({'done': !this.model.get('done')});
		}

	});

	return ItemView;

});