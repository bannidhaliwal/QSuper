//This function will update the score box..
function UpdateHTML(array){
  var LEVEL_INFORMATION = 11;
  document.getElementById("score").innerHTML = array[LEVEL_INFORMATION].score;
  document.getElementById("super").innerHTML = (array[LEVEL_INFORMATION].score) * 0.095;
  document.getElementById("moves").innerHTML = array[LEVEL_INFORMATION].moves;
  document.getElementById("level").innerHTML = array[LEVEL_INFORMATION].level;
}//End UpdateScore
//update the after level completion windows elements..
function UpdateFinalStatsOfGame(score){
  var WITH_SUPER = 1;
  var WITHOUT_SUPER = 0;
  var DEF_PER = 0.30;
  var defaultSuperContribution = DEF_PER * score;
  //Update the final elements which will be shown after the completion of game..
  CalculateStats(score,defaultSuperContribution,1,1,function(stats){
    document.getElementById('totalScore').innerHTML = score;
    document.getElementById('totalScore2').innerHTML = score;
    document.getElementById('noSuperTax').innerHTML = stats.tax[WITHOUT_SUPER];
    document.getElementById('noSuperTotalSuper').innerHTML = stats.netSuperBalance[WITHOUT_SUPER];
    document.getElementById('noSuperTotalAssets').innerHTML = stats.assets[WITHOUT_SUPER];
    document.getElementById('noSuperTotalScore').innerHTML = stats.assets[WITHOUT_SUPER];

    document.getElementById('taxWithSuper').innerHTML = stats.tax[WITH_SUPER];
    document.getElementById('contributedSuper').innerHTML = stats.salarySacrifice;
    document.getElementById('totalSuperWithSuper').innerHTML = stats.netSuperBalance[WITH_SUPER];
    document.getElementById('totalAssetsWithSuper').innerHTML = stats.assets[WITH_SUPER];
    document.getElementById('totalScoreWithSuper').innerHTML = stats.assets[WITH_SUPER];
  });
}
/*
  This function will update the game stats after each level completion.
  We are storing the super value on the base of user inputted contribution.
  The maximum and minumu values are 0-30 respectively.
*/
function UpdateOnKeyPress(){
  var WITH_SUPER = 1;
  var WITHOUT_SUPER = 0;
  var superContribution = document.getElementById('superContribution').value;
  if(superContribution > 30){
    superContribution = 30;
    document.getElementById('superContribution').value = 30;
  }
  if(superContribution < 0){
    superContribution = 0;
    document.getElementById('superContribution').value = 0;
  }
  if(superContribution == ""){
    superContribution = 30;
    document.getElementById('superContribution').value = 30;
  }
  var score = parseInt(document.getElementById('totalScore').innerHTML);
  superContribution = ((parseInt(superContribution))/100)*score;
  CalculateStats(score,superContribution,1,1,function(stats){
    document.getElementById('taxWithSuper').innerHTML = Math.round(stats.tax[WITH_SUPER]);
    document.getElementById('contributedSuper').innerHTML = Math.round(stats.salarySacrifice);
    document.getElementById('totalSuperWithSuper').innerHTML = Math.round(stats.netSuperBalance[WITH_SUPER]);
    document.getElementById('totalAssetsWithSuper').innerHTML = Math.round(stats.assets[WITH_SUPER]);
    document.getElementById('totalScoreWithSuper').innerHTML = Math.round(stats.assets[WITH_SUPER]);
  });
}
