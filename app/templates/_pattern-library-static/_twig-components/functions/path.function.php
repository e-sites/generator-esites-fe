<?php
$function = new Twig_SimpleFunction('path', function ($type, $arg) {
    return $arg['url'];
});
