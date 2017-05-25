//This function will update the score box..
function UpdateHTML(score,moves){
  //update score, super and moves left.
  document.getElementById("score").innerHTML = score;
  document.getElementById("super").innerHTML = score * (9.5)/100;
  document.getElementById("moves").innerHTML = moves;
}//End UpdateScore

function UpdateFinalStatsOfGame(score){
  var WITH_SUPER = 1;
  var WITHOUT_SUPER = 0;

  //Update the final elements which will be shown after the completion of game..
  CalculateStats(score,12000,1,1,function(stats){
    document.getElementById("totalSalaryWithSuper").innerHTML = stats.salary;
    document.getElementById("taxWithSuper").innerHTML = stats.tax[WITH_SUPER];
    document.getElementById("takeHomeWithSuper").innerHTML = stats.netSalary[WITH_SUPER];
    document.getElementById("superFundsWithSuper").innerHTML = stats.netSuperBalance[WITH_SUPER];
    document.getElementById('totalScoreWithSuper').innerHTML = stats.assets[WITH_SUPER];

    document.getElementById("totalSalaryWithoutSuper").innerHTML = stats.salary;
    document.getElementById("taxWithoutSuper").innerHTML = stats.tax[WITHOUT_SUPER];
    document.getElementById("takeHomeWithoutSuper").innerHTML = stats.netSalary[WITHOUT_SUPER];
    document.getElementById("superFundsWithoutSuper").innerHTML = stats.netSuperBalance[WITHOUT_SUPER];
    document.getElementById('totalScoreWithoutSuper').innerHTML = stats.assets[WITHOUT_SUPER];
  });
}
