define([
	'libs/backbone',
	'libs/hbt!templates/my_template.html' // this uses hbt.js to compile the template
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
			this.model.set({'text': this.textinput.val()});
		},
		erase: function() {
			this.remove();
			return false;
		},
		done: function() {
			this.model.set({'done': !this.model.get('done')});
		}
	});
	return ItemView;
});