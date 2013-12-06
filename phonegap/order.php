<?php
$message = "";
$pizzas = $_GET['pizza'];
$p_price = $_GET['p_price'];

$drinks = $_GET['drink'];
$d_price = $_GET['d_price'];

$total = $_GET['total'];


for($x = 0; $x < count($pizzas); $x++){
    $pizza = str_replace("X", " ", $pizzas[$x]);
    $message .= "Pizza: " . $pizza . "- Price: " . $p_price[$x] . "\n";
}

for($x = 0; $x < count($drinks); $x++){
    $drink = str_replace("X", "x ", $drinks[$x]);
    $message .= "Drink: " . $drink . "- Price: " . $d_price[$x] . "\n";
}
$message .= "Total: $" . $total;

mail("kkaren509@gmail.com", "Customer Pizza Order", $message, "From: M&P Pizza");

echo json_encode("Order Sent!");