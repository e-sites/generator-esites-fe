<?php
$function = new Twig_SimpleFunction('render_pagetemplate', function ($arg) {
    return 'Content of ' . $arg['title'];
});
