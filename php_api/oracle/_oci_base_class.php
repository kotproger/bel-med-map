<?php

	error_reporting(E_ERROR | E_PARSE);
    // include_once('cfg.php');   
    class BaseOciClass {
        protected $connection = false;
        protected $query_result = false;
        protected $params = false;
        protected $result = array('success' => true, 'data' => '', 'message' => false);
        function __construct() {
			$this->connection = oci_connect('PARUS', 'Ao3RMLK8','10.101.39.40:1521/DEPZDRAV','UTF8');
			if (!$this->connection) {
				$m = oci_error();
				$this->result['success'] = false;
                $this->result['message'] = $m['message'];
			}
        }
        function __destruct() {
			oci_close($this->connection);
        }       
        function ExecQuery($query_name, $query_qparams = false) {
            if(method_exists($this, $query_name)){
                $this->params = $query_qparams;
                $this->$query_name();
                if(!$this->query_result){
                    $m = oci_error();
					$this->result['success'] = false;
					$this->result['message'] = $m['message'];
                } else {
                    $prepare = 'post_'.$query_name;
                    if(method_exists($this, $prepare))
                        $this->$prepare();
					try {
						if ($this->query_result)
							oci_free_statement($this->query_result);
					} catch (Exception $e) {
						$this->result['success'] = false;
						$this->result['message'] = 'inner error';
					}
                }
            } else {
                $this->result['success'] = false;
                $this->result['message'] = 'wrong query name';
            }
            return $this->result;
        }  
    }
?>