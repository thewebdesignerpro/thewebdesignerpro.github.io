<?php 
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$formcontent="From: $name \nMessage: $message";
$recipient = "armychiu@gmail.com";
$subject = "Message from TWDP";
$mailheader = "From: $email \r\n";

if ( !preg_match( "/[\r\n]/", $name ) && !preg_match( "/[\r\n]/", $email ) ) {
mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
header("location:index.html");
}
?>