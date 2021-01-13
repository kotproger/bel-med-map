<?php 
    include_once('_requests.php'); 
    $sql = new RequestsOci();
	$sql->ExecQuery('set_decimal_delimiter', []);
	$tmp = $sql->ExecQuery('get_attached_file',  array('id' => $_GET["id"]));
	echo json_encode($tmp);
?>