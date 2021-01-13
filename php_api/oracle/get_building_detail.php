<?php 
    include_once('_requests.php'); 
    $sql = new RequestsOci();
	$sql->ExecQuery('set_decimal_delimiter', []);
	$tmp = $sql->ExecQuery('get_building_detail',  array('id' => $_GET["id"]));
	
	if($tmp['success'] && $tmp['data']){
		
		$photos = $sql->ExecQuery('get_building_photos',  array('id' => $_GET["id"]));
		if($photos['success'] && $photos['data']){
			$tmp['data']['photos'] = $photos['data'];
		} else {
			$tmp['data']['photos'] = array();
		}
	}
	echo json_encode($tmp);
?>