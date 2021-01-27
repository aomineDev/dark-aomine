<style>
	body{
		margin: 0;
		background-color: #000;
	}
</style>
<?php 
// Verificando la llegada de todos los datos
if (isset($_POST)) {
	require_once 'conex.php';
	// Recolectando Datos
	$name =isset( $_POST['name']) ?  $conex->real_escape_string(trim($_POST['name'])) : null;
	$email = isset($_POST['email']) ? $conex->real_escape_string(trim($_POST['email'])) : null;
	$phone = isset($_POST['phone']) ? (int)$_POST['phone'] : null;
	$message = isset($_POST['message']) ? $conex->real_escape_string(trim($_POST['message'])) : null;

	// Enviando Datos
	$sql = "INSERT INTO contacto VALUES(null, '$name', '$email', $phone, '$message', CURTIME(), CURDATE())";
	$query= $conex->query($sql);

	// Verificando envio de datos
	if ($query) {
		echo "<script> alert('Tus valiosos datos me han sido entregados... 🐱‍👤')</script>";
	}else{
		echo "<script> alert('Lamentablemente ocurrio un error al guardar tus valiosos datos... lo siento :\'v')</script>";
	}
}else{
	echo "<script> alert('No puede ser, ocurrio un error al enviar tus valiosos datos... lo siento :'v')</script>";
}

// Redireccion a index
echo "<script>location.href='index.html'</script>";
?>