<?php
require 'metaphone.php';

use Metaphone\Metaphone;

echo Metaphone::getPhraseMetaphone('é um teste super legal') . PHP_EOL;
echo Metaphone::getPhraseMetaphone('chocolate e farinha') . PHP_EOL;
echo Metaphone::getPhraseMetaphone('acerola asserola aserola') . PHP_EOL;
echo Metaphone::getPhraseMetaphone('calça calsa calssa') . PHP_EOL;

