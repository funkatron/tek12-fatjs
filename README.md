Running
-----------

1. npm install node-static
2. Start the server with `node server.js`
3. visit localhost:8080

Explanation
-----------

Start in `index.html`

This line:

    <script type='text/javascript' data-main='/js/apps/my_app' src='/js/libs/require-min.js' charset='UTF-8'></script>

Is the `**require.js**` script.  The `data-main` attribute is the url of the top-level script that the loader....loads.  For some reason require.js doesn't use filename for js files so it's just `/js/apps/my_app`.

A quick discussion about directory structure: the way I typically structure stuff is as follows:

* `js/apps` - this would be like the "controller" in MVC - responsible for linking up views with models
* `js/collections` - Backbone collections (which are typically just holders of Backbone models)
* `js/libs` - 3rd party libraries
* `js/models` - Backbone models (talks to server, serializes to JSON, triggers change events)
* `js/templates` - handlebars.js templates
* `js/util` - Utility functions written by me
* `js/views` - Backbone views (render models, delegate DOM events)

Ok, so now let's look at `/js/apps/my_app.js`

The first 3 lines set the `baseUrl` of all files that will subsequently be loaded.  This lets the subsequent `define()`'s be shorter, but more importantly lets us do things like load off the VM in development mode, but from a CDN with a totally different hostname in production.  (The way you would do this would be to put the value of the baseUrl attribute into a javascript variable in the html, then use that instead of the hardcoded string `'js'`)

Next, is the **define**.  Every file that is loaded with require.js should have one of these.  The first argument is an array of strings which represent paths to JS files to load.  The second argument is a function.  Note that the function takes a number of arguments - these are the return values of the files included due to the first argument of `define()`. So, if you look at `models/my_model`, you'll see that it returns a Backbone model.  This model is what becomes the second argument to the function in `apps/my_app.js`:

    function($, MyModel, MyView) {
                 ^^^^^ This one!!!!!

OK, line 11:

    `var model = new MyModel(window.model);`

This instantiates a **model class** with attributes taken from `window.model` (defined in `index.html`).  Backbone models are just a bag of attributes - you don't define a schema or anything.  They're just a thin wrapper around JS objects

Line 12:

    `var view = new MyView({model: model, el: document.getElementById('my-view')});`

This instantiates a **view object**, with our model passed into it.  This means that "`this.model`" in the view will refer to our model.  We also pass in an "`el`" attribute, which is the element that will hold any rendering we do, and be the scope for any delegated jQuery events.  We don't have to pass in an el - if we don't, Backbone will create an element for us, and we can use that later to insert into the DOM wherever we want.  For simplicity in this case we just use an existing element with ID.


Ok, now on to `views/my_view.js`

`tagName` and `className` actually aren't used - they would only be used if we did NOT pass in an el, and therefore needed Backbone to create the element for us.

`initialize` is a function that is automatically called when a view is created - we use it to bind to a **change event** in our model.  Whenever the "motto" attribute of the model changes, we re-render. The third argument to bind is because javascript is stupid and would use the wrong context otherwise ('this' would be the model instead of the view)

The `render` function is pretty simple - we set the html of the view element to the result of rendering the template using the model.  The `toJSON` function on a model is a Backbone built-in, and just returns the model attributes as a raw JS object (NOT AS A JSON STRING WHICH YOU MIGHT SUSPECT BASED ON THE NAME OF THIS FUNCTION). You can override this function in a model if you need to support computed attributes or some other crap.

It should be pretty simple to see what's going on with rendering if you look at `templates/my_template.html`.  The template is a function because of Handlebars precompilation.  I can explain that magic to you if you want.


Ok, so we have now rendered a view, so what happens when I click on that link? ("I am a link").  Note that we have `data-remote="true"` and `data-method="POST"` as attributes on it.  This is a UJS thing.  When a link with `data-remote` is clicked, UJS intercepts it, prevents the default handler (i.e., visiting the link), and does an AJAX request to the server (path: `href` attribute, method: `data-method` attribute, additional params: `data-params` attribute (not present in this example)).  It also triggers the jQuery AJAX lifecycle events on the `<a>` tag.

Now, if you look at `views/my_view.js` line 17, you see that we bind to an `ajax:error` event (note that all Backbone events are scoped to the view element; so we're only going to see events that take place inside the #my-view element in this example).  I'm binding to `ajax:error` because there's no server handler set up because I'm lazy; normally you would have a server and bind to `ajax:success`.  Anyway, when `ajax:error` is triggered, we call `ajaxError` in the view. In that function, I'm changing the value of the `"motto"` attribute of the model.  Again, normally you would do something like:

    this.model.set(ajaxResponseData);

Where `ajaxResponseData` is an updated model coming back from the server.

Ok, so we set that field; this triggers a **change** event.  And you'll remember that back on line 9 of the view we bound an event handler to that change event.  So once we set the `'motto'` field, the view's "`render`" function is triggered, which goes in and replaces the HTML of the view element with the new stuff.

