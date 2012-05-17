define([
	'libs/backbone',
	'models/my_model'
], function(Backbone, MyModel){
	var MyCollection = Backbone.Collection.extend({
		model: MyModel
	});
	return MyCollection;
});