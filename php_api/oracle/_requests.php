<?php
    include_once('_oci_base_class.php');   
    class RequestsOci extends BaseOciClass { 

		//изменение знака десетячного разделителя
		 protected  function set_decimal_delimiter() {
			$conn = $this->connection;
			$this->query_result = oci_parse($conn, "ALTER session  SET NLS_NUMERIC_CHARACTERS= '.,'");
			oci_execute($this->query_result);
		}
		 
		//Получение массива зданий 
        protected  function get_buildings() {
            $conn = $this->connection;
			$this->query_result = oci_parse($conn, 'SELECT build_id, geo_id, building_name, organization_id, organization,  usage_type_id, usage_type_name, lon, lat FROM V_BELRRPABUILDING_MAP_BUILDING');
			oci_execute($this->query_result);
        } 
        protected  function post_get_buildings() {
            $rez_array = array();
			while ($row = oci_fetch_array($this->query_result, OCI_NUM)) {
				$rez_array[] = array(
					'id' => intval($row[0]), 
					'geoId' => intval($row[1]), 
					'name' => $row[2], 
					'organizationId' => intval($row[3]), 
					'organizationName' => $row[4], 
					'usageTypeId' => $row[5], 
					'usageTypeName' => $row[6], 
					'lon' => floatval($row[7]),
					'lat' => floatval($row[8])
				);
			}
			$this->result['data'] = $rez_array;
        }
		
		// Получение дерева геообъектов
        protected  function get_geo_tree() {
            $conn = $this->connection;
			$this->query_result = oci_parse($conn, 'SELECT rn, prn, geogr_name, geogr_type_name, geogr_type_fullname, row_level FROM V_BELRRPABUILDING_MAP_GEOTREE');
			oci_execute($this->query_result);
        } 
        protected  function post_get_geo_tree() {
            $rez_array = array();
			while ($row = oci_fetch_array($this->query_result, OCI_NUM)) {
				$rez_array[] = array(
					'id' => intval($row[0]), 
					'pid' => intval($row[1]), 
					'name' => $row[2], 
					'typeShortName' => $row[3], 
					'typeFullName' => $row[4], 
					'level' => intval($row[5])
				);
			}
			$this->result['data'] = $rez_array;
        }
		
		
		// Получение информации по зданию
        protected  function get_building_detail() {
            $conn = $this->connection;
			$this->query_result = oci_parse($conn, 'SELECT build_id, building_name, organization_id, organization,  usage_type_id, usage_type_name, lon, lat, year_of_construction, floors, total_area, plan_count_visits, address, phone, email, site, eregistry_url, worktime FROM V_BELRRPABUILDING_MAP_BUILDING WHERE build_id=:building_id');
			oci_bind_by_name($this->query_result, ":building_id", $this->params['id']);
			oci_execute($this->query_result);
        } 
        protected  function post_get_building_detail() {
            $rez_array = null;
			if ($row = oci_fetch_array($this->query_result, OCI_NUM)) {
				$rez_array = array(
					'id' => intval($row[0]), 
					'name' => $row[1], 
					'organizationId' => intval($row[2]), 
					'organizationName' => $row[3], 
					'usageTypeId' => $row[4], 
					'usageTypeName' => $row[5], 
					'lon' => floatval($row[6]),
					'lat' => floatval($row[7]),
					'yearOfConstruction' => intval($row[8]),
					'floors' => intval($row[9]),
					'totalArea' => floatval($row[10]),
					'planCountVisits' => intval($row[11]),
					'address' => $row[12],
					'phone' => $row[13],
					'email' => $row[14],
					'site' => $row[15],
					'eregistryUrl' => $row[16],
					'worktime' => $row[17]
				);
			}
			$this->result['data'] = $rez_array;
        }
		
		// Получение массива фотографий у здания
        protected  function get_building_photos() {
            $conn = $this->connection;
			$this->query_result = oci_parse($conn, 'SELECT building_id, id, path, type_id, type_name, type_code, note FROM V_BELRRPABUILDING_MAP_ATTACHED WHERE building_id=:building_id AND type_id = 3304498431');
			oci_bind_by_name($this->query_result, ":building_id", $this->params['id']);
			oci_execute($this->query_result);
        } 
        protected  function post_get_building_photos() {
            $rez_array = array();
			while ($row = oci_fetch_array($this->query_result, OCI_NUM)) {
				$rez_array[] = array(
					'buildingId' => intval($row[0]), 
					'id' => intval($row[1]), 
					'path' => $row[2], 
					'typeId' => intval($row[3]), 
					'typeName' => $row[4], 
					'typeCode' => $row[5], 
					'note' => $row[6]
				);
			}
			$this->result['data'] = $rez_array;
        }
		
		// Получение значения прикрепленного документа
        protected  function get_attached_file() {
            $conn = $this->connection;
			$this->query_result = oci_parse($conn, 'SELECT rn, bdata FROM filelinks WHERE rn=:file_id');
			oci_bind_by_name($this->query_result, ":file_id", $this->params['id']);
			oci_execute($this->query_result);
        } 
        protected  function post_get_attached_file() {
            $rez_array = null;
			if ($row = oci_fetch_array($this->query_result, OCI_NUM)) {
				$rez_array = array(
					'id' => intval($row[0]), 
					'blobValue' => base64_encode($row[1]->load())
				);
			}
			$this->result['data'] = $rez_array;
        }
	}
?>