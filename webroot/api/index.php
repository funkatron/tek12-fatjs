<?php

require __DIR__ . "/../../vendor/autoload.php";


/**
 * get MongoDB collection
 * @return MongoCollection
 */
function get_db_coll() {
	$conn = new Mongo();
	$db = $conn->toodoo;
	return $db->items;
}

$app = new Slim();

/**
 * get the full data set
 */
$app->get('/items', function() use ($app) {

	$items = array();

	$cur = get_db_coll()->find()->limit(1000);
	foreach ($cur as $obj) {
		$item = array();
		$item['id'] = (string)$obj['_id'];
		$item['order'] = $obj['order'];
		$item['done'] = $obj['done'];
		$item['text'] = $obj['text'];
		$items[] = $item;
	}

	$response = $app->response();
	$response['Content-Type'] = 'application/json';
	$response->body(json_encode($items));

});

/**
 * get a single item
 */
$app->get('/items/:id', function($id) use ($app) {

	$item = null;

	$obj = get_db_coll()->findOne(array(
		'_id' => new MongoId($id)
	));

	$item = array();
	$item['id'] = (string)$obj['_id'];
	$item['order'] = $obj['order'];
	$item['done'] = $obj['done'];
	$item['text'] = $obj['text'];

	$response = $app->response();
	$response['Content-Type'] = 'application/json';
	$response->body(json_encode($item));

});


/**
 * add a new item
 */
$app->post('/items/?', function() use ($app) {

	$item = null;

	$requestBody = $app->request()->getBody();
	$new_item = json_decode($requestBody, true);

	if ($new_item) {

		$insert = array();
		$insert['order'] = $new_item['order'];
		$insert['done'] = $new_item['done'];
		$insert['text'] = $new_item['text'];
		get_db_coll()->insert($insert);

	}

	if (isset($insert)) {

		$item = array();
		$item['id'] = (string)$insert['_id'];
		$item['order'] = $insert['order'];
		$item['done'] = $insert['done'];
		$item['text'] = $insert['text'];
		$response = $app->response();
		$response['Content-Type'] = 'application/json';
		$response->body(json_encode($item));

	} else {

		$response->status(500);
		echo "crap";

	}

});

/**
 * update an existing item
 */
$app->put('/items/:id', function ($id) use ($app) {

	$item = null;

	$obj = get_db_coll()->findOne(array('_id' => new MongoId($id)));

	if (!$obj) {
		$response->status(500);
		echo "crap";
	}

	$requestBody = $app->request()->getBody();
	$updated_item = json_decode($requestBody, true);

	$obj['order'] = $updated_item['order'];
	$obj['done'] = $updated_item['done'];
	$obj['text'] = $updated_item['text'];

	get_db_coll()->save($obj);

	// retrieve so we're getting exactly what's in the DB
	$obj = get_db_coll()->findOne(array('_id'=>$obj['_id']));

	$item = array();
	$item['id'] = (string)$obj['_id'];
	$item['order'] = $obj['order'];
	$item['done'] = $obj['done'];
	$item['text'] = $obj['text'];

	$response = $app->response();
	$response['Content-Type'] = 'application/json';
	$response->body(json_encode($item));

});


/**
 * delete an item
 */
$app->delete('/items/:id', function ($id) use ($app) {

	get_db_coll()->remove(
		array(
			'_id' => new MongoId($id)
		),
		array("justOne" => true)
	);

	$response = $app->response();
	$response['Content-Type'] = 'application/json';

	$response->body(null);

});


$app->run();