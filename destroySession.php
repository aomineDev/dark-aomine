<style>
	body{
		margin: 0;
		background-color: #000;
	}
</style>

<?php 
session_start();
if (isset($_SESSION['admin'])) {
	session_destroy();
}
echo "<script>location.href='index.html'</script>";
?>