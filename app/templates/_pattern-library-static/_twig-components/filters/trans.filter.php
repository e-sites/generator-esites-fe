<?php

require __DIR__ . '/../../../../../../../../vendor/autoload.php';

$instance = PatternLab\PatternEngine\Twig\TwigUtil::getInstance();
$loaders = PatternLab\PatternEngine\Twig\TwigUtil::getLoaders();

// Load Twig namespaces to make them consistent with Kunstmaan namespaces
$twigPaths = [
    'atoms' => __DIR__ . '/../../_patterns/atoms',
    'molecules' => __DIR__ . '/../../_patterns/molecules',
    'organisms' => __DIR__ . '/../../_patterns/organisms',
    'templates' => __DIR__ . '/../../_patterns/templates',
];

if (is_array($loaders) ) {
    foreach ($loaders as $loader) {
        foreach ($twigPaths as $pathAlias => $pathName) {
            $loader->addPath($pathName, $pathAlias);
        }
    }
}

// Add extensions
$instance->addExtension(new Twig_Extensions_Extension_I18n());
$instance->addExtension(new Twig_Extensions_Extension_Intl());
