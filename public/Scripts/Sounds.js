//This function will play the music for the pop tiles and score increasing.
//Every time there is movement at the tiles we can play these sounds..
function PlayMusic(){
  var popTilesMusic = "SoundFiles/PopTiles.wav";
  var scoreIncreasedMusic = "SoundFiles/ScoreIncreased.wav";
  new Audio(popTilesMusic).play();
  new Audio(scoreIncreasedMusic).play();
}
