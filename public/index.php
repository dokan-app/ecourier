<?php
$names = [
    4 => "Rayhan",
    3 => "Robin",
    0 => "Sazid",
    2 => "Omar",
    1 => "Ohi"
];


ksort($names);

foreach ($names as $key => $name) {
    echo "$key - $name<br/>";
}