<?php 
// Creando conexion
$conex = new mysqli('localhost', 'nibbhvsh_aomine', 'aominenibbleframedb', 'nibbhvsh_dark_aomine');
if (!$conex) {
	echo "<script> alert('Lo siento... no pudimos conectarnos con la base de datos :\'v)</script>";
}
$conex->set_charset("utf8");
?>