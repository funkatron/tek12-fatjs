<?php

require __DIR__ . "/../../vendor/autoload.php";

$app = new Slim();

/**
 * get the full data set
 */
$app->get('/items', function() use ($app) {

	$response = $app->response();
	$response['Content-Type'] = 'application/json';

	$json = '[
		{ "id": 1, "order": 2, "done": false, "text": "Eggs" },
		{ "id": 2, "order": 1, "done": false, "text": "Milk" },
		{ "id": 3, "order": 4, "done": false, "text": "Butter" },
		{ "id": 4, "order": 3, "done": true, "text": "Cat food" }
	]';

	$response->body($json);

});

/**
 * get a single item
 */
$app->get('/item/:id', function() use ($app) {

	$response = $app->response();
	$response['Content-Type'] = 'application/json';

	$response->body(null);

});


/**
 * add a new item
 */
$app->post('/item/?', function() use ($app) {

	$response = $app->response();
	$response['Content-Type'] = 'application/json';

	$requestBody = $app->request()->getBody();
	$json = json_decode($requestBody, true);
	$response->body(json_encode($json));

});

/**
 * update an existing item
 */
$app->put('/item/:id', function ($id) use ($app) {

	$response = $app->response();
	$response['Content-Type'] = 'application/json';

	$requestBody = $app->request()->getBody();
	$json = json_decode($requestBody, true);
	error_log($requestBody);
	$response->body(json_encode($json));

});

/**
 * delete an item
 */
$app->delete('/item/:id', function ($id) use ($app) {

	$response = $app->response();
	$response['Content-Type'] = 'application/json';

	$response->body(true);

});


$app->run();