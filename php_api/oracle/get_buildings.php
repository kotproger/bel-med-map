<?php 
    include_once('_requests.php'); 
    $sql = new RequestsOci();
	$sql->ExecQuery('set_decimal_delimiter', []);
	$tmp = $sql->ExecQuery('get_buildings',  []);
	echo json_encode($tmp);
?>