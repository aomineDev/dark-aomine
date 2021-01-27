<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
	<?php if(isset($_COOKIE['admin'])): ?>
		<title>dark aomine | Messages 📫</title>
		<?php else: ?>
			<title>dark aomine | Login 🔒</title>
		<?php endif; ?>
		<!-- GOOGLE FONTS -->
		<link href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900" rel="stylesheet">
		<!-- DEVELOPMENT -->
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css">
		<!-- CDN -->
		<link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css">
		<!-- OUR STYLES -->
		<link rel="stylesheet" href="assets/css/styles.css" />
		<!-- ICON -->
		<link rel="shortcut icon" href="https://aomineDev.github.io/ico/aomine.ico">
	</head>
	<body>
		<!-- LOADING -->
		<div class="loading"></div>

		<!-- INTERFACE -->
		<div class="interface">
			<div class="interface-wrapper">

				<!-- HEADER -->
				<header class="admin-header">
					<div class="admin-header-wrapper">
						<a href="index.html" class="admin-header-action waves waves-light"><i class="fas fa-arrow-left"></i></a>
						<?php if(isset($_COOKIE['admin'])): ?>
							<p class="admin-header-name"><?= $_COOKIE['admin'] ?></p>
							<a href="destroyCookies.php" class="admin-header-action waves waves-light"><i class="fas fa-sign-out-alt"></i></a>
							<?php else: ?>
								<span></span>
								<span></span>
							<?php endif; ?>
						</div>
					</header>

					<?php if(!isset($_COOKIE['admin'])): ?>
						<!-- LOGIN -->
						<div class="login">
							<form action="loginCookies.php" method="POST" class="login-form" autocomplete="off" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
								<h2 class="login-title">Log in <i class="fas fa-user-ninja"></i></h2>
								<div class="login-form-box">
									<input type="text" name="username" id="username" class="login-form-input" required>
									<label for="username" class="login-form-label">Username</label>
								</div>
								<?php if(isset($_COOKIE['invalid']['username'])): ?>
									<span class="login-form-invalid"><?= $_COOKIE['invalid']['username'] ?></span>
									<?php setcookie('invalid[username]', '', time() - 100, '/');
								endif; ?>
								<div class="login-form-box">
									<input type="password" name="password" id="password" class="login-form-input" required>
									<label for="password" class="login-form-label">Password</label>
								</div>
								<?php if(isset($_COOKIE['invalid']['password'])): ?>
									<span class="login-form-invalid"><?= $_COOKIE['invalid']['password'] ?></span>
									<?php setcookie('invalid[password]', '', time() - 100, '/');
								endif; ?>
								<button type="submit" class="login-form-btn waves waves-light">Empezemos...</button>
							</form>
						</div>
						<?php else: ?>
							<!-- MESSAGES -->
							<div class="messages">
								<h2 class="messages-title">Buzón de Mensajes</h2>
								<?php require_once 'conex.php';
								$sql = "SELECT *, DATE_FORMAT(date, '%d-%m-%Y') AS 'dateMod' FROM contacto ORDER BY date, time DESC";
								$mensajes = $conex->query($sql);?>
								<?php if ($mensajes && $mensajes->num_rows > 0): 
									$index = 1;
									while($mensaje = $mensajes->fetch_object()): ?>
										<div class="messages-box">
											<h3 class="messages-data"><span class="messages-name"><?= $index++ . ". $mensaje->name"?></span> | <span class="messages-date"><?= $mensaje->dateMod ?></span> | <span class="messages-time"><?= $mensaje->time ?></span></h3>
											<p class="messages-email"><span class="messages-desc">Email:</span> <?= $mensaje->email ?></p>
											<p class="messages-phone"><span class="messages-desc">Telefono:</span> <?=  $mensaje->phone ?></p>
											<p class="messages-message"><span class="messages-desc">Mensaje:</span><br><?=  $mensaje->message ?></p>
										</div>
									<?php endwhile;?>
									<?php else: ?>
										<p>No tienes mensajes :'v</p>
									<?php endif; ?>
								</div>
							<?php endif; 
							?>
						</div>
					</div>

					<!-- JAVASCRIPT -->
					<!-- CDN -->
					<script src="https://unpkg.com/aos@next/dist/aos.js"></script>
					<!-- MY JS FILES -->
					<script src="assets/js/admin.js"></script>
				</body>
				</html>