<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $test = $_POST['test'] ?? '';

    if ($test === 'test1') {
        echo 'ok1';
    } elseif ($test === 'test2') {
        echo 'ok2';
    } else {
        echo 'Invalid request';
    }
} else {
    echo 'This endpoint only accepts POST requests.';
}
?>