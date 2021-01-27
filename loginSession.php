<style>
  body{
    margin: 0;
    background-color: #000;
  }
</style>

<?php 
if(isset($_POST)){
  // Conexion
  require_once 'conex.php';

  // Iniciando la sesion
  session_start();

  // Recolección de datos
  $username = isset($_POST['username']) ? $conex->real_escape_string(trim($_POST['username'])) : null;
  $password = isset($_POST['password']) ? $conex->real_escape_string(trim($_POST['password'])) : null;
  $invalid = 0;

  // Obteniendo usuario de la base de datos
  $sql = "SELECT * FROM usuarios";
  $usuario = $conex->query($sql);

  if ($usuario && $usuario->num_rows == 1) {
    $usuario = $usuario->fetch_object();

  // Verificando username
    if($usuario->username != $username){
      $_SESSION['invalid']['username'] = 'usuario incorrecto ¬¬';
      $invalid++;
    }
    
  // Verificando password
    $verify = password_verify($password, $usuario->password);
    if(!$verify){
      $_SESSION['invalid']['password'] = 'password incorrecta ¬¬';
      $invalid++;
    }

    if ($invalid == 0) {
      $_SESSION['admin'] = $usuario;
      echo "<script> alert('Bienvenido... 👑')</script>";
    }

  }else {
    $password = password_hash($password, PASSWORD_BCRYPT, ['cost' => 4]);
    $email = $username.'@gmail.com';
    $sql = "INSERT INTO usuarios VALUES(null, '$username', '$email', '$password')";
    $query = $conex->query($sql);
    if ($query) {
      $sql = "SELECT * FROM usuarios";
      $usuario = $conex->query($sql);
      $usuario = $usuario->fetch_object();  
      $_SESSION['admin'] = $usuario;
      echo "<script> alert('Ahora eres parte de la nueva era... 🎯')</script>";
    }else {
      echo "<script> alert('Que mal... no se puedo crear la cuenta :\'v')</script>";
    }
  }
  echo "<script>location.href='adminSession.php'</script>";
}
?>