<?php
$function = new Twig_SimpleFunction('render_pageparts', function ($arg) {
    return 'Content of ' . $arg['title'];
});
