<?php
$filter = new Twig_SimpleFilter('replace_url', function ($arg) {
  return $arg;
});
