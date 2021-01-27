<style>
	body{
		margin: 0;
		background-color: #000;
	}
</style>

<?php 
if (isset($_COOKIE['admin'])) {
	setcookie('admin', '', time() - 100, '/');
}
echo "<script>location.href='../index.html'</script>";
?>