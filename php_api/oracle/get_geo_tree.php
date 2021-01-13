<?php 
    include_once('_requests.php'); 
    $sql = new RequestsOci();
	$tmp = $sql->ExecQuery('get_geo_tree',  []);
	echo json_encode($tmp);
?>