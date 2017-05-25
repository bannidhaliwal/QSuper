function DetermineTax(){}
function CalculateStats(salary,salarySacrifice,flagSalary,flagSalarySacrifice,callback){
  var WITH_SUPER = 1;
  var WITHOUT_SUPER = 0;
  var ANNUAL = 1;
  var MONTHLY = 0;
  var NUMBER_OF_MONTHS = 12;
  var FIRST_SALARY_CASE = 18200;
  var SECOND_SALARY_CASE = 37000;
  var THIRD_SALARY_CASE = 80000;
  var FOURTH_SALARY_CASE = 180000;
  var SECOND_SALARY_CASE_TAX = 3572;
  var THIRD_SALARY_CASE_TAX = 19822;
  var FOURTH_SALARY_CASE_TAX = 54232;
  var MEDICARE_LEVY_PERCENTAGE = 0.02;
  var SUPER_BALANCE_TAX = 0.15;
  var SUPER_CONTRIBUTION_EMPLOYER = 0.095;

  //Check the flags and decide which data is passed
  if(flagSalary == MONTHLY){
    salary = salary * NUMBER_OF_MONTHS;
  }//End

  if(flagSalarySacrifice == MONTHLY){
    salarySacrifice = salarySacrifice * NUMBER_OF_MONTHS;
  }//End

  //Now lets calculate
  var taxableIncome = [];
  var tax = [];
  var medicareLevy = [];
  var superBalance = [];
  var superBalanceTax = [];
  var netSuperBalance = [];
  var netSalary = [];
  var assets = [];
  var gainLoss = 0;

  //first contribution from employer
  superBalance[WITH_SUPER] = (salary * SUPER_CONTRIBUTION_EMPLOYER) + salarySacrifice;
  superBalance[WITHOUT_SUPER] = salary * SUPER_CONTRIBUTION_EMPLOYER;

  //Determine the taxable income
  taxableIncome[WITH_SUPER] = salary - salarySacrifice;
  taxableIncome[WITHOUT_SUPER] = salary;

  //Determine Tax now for both cases
  if(salary <= FIRST_SALARY_CASE){
    tax[WITH_SUPER] = 0;
    tax[WITHOUT_SUPER] = 0;
  }
  else if(salary <= SECOND_SALARY_CASE){
    tax[WITH_SUPER] = (taxableIncome[WITH_SUPER] - FIRST_SALARY_CASE) * 0.19;
    tax[WITHOUT_SUPER] = (taxableIncome[WITHOUT_SUPER] - FIRST_SALARY_CASE) * 0.19;
  }
  else if(salary <= THIRD_SALARY_CASE){
    tax[WITH_SUPER] = (taxableIncome[WITH_SUPER] - SECOND_SALARY_CASE) * 0.325
    + SECOND_SALARY_CASE_TAX;

    tax[WITHOUT_SUPER] = (taxableIncome[WITHOUT_SUPER] - SECOND_SALARY_CASE) * 0.325
    + SECOND_SALARY_CASE_TAX;
  }
  else if (salary <= FOURTH_SALARY_CASE){
    tax[WITH_SUPER] = (taxableIncome[WITH_SUPER] - THIRD_SALARY_CASE) * 0.37
    + THIRD_SALARY_CASE_TAX;

    tax[WITHOUT_SUPER] = (taxableIncome[WITHOUT_SUPER] - THIRD_SALARY_CASE) * 0.37
    + THIRD_SALARY_CASE_TAX;
  }
  else{
    tax[WITH_SUPER] = (taxableIncome[WITH_SUPER] - FOURTH_SALARY_CASE) * 0.45 + FOURTH_SALARY_CASE_TAX;
    tax[WITHOUT_SUPER] = (taxableIncome[WITHOUT_SUPER] - FOURTH_SALARY_CASE) * 0.45 + FOURTH_SALARY_CASE_TAX;
  }

  medicareLevy[WITH_SUPER] = taxableIncome[WITH_SUPER] * MEDICARE_LEVY_PERCENTAGE;
  medicareLevy[WITHOUT_SUPER] = taxableIncome[WITHOUT_SUPER] * MEDICARE_LEVY_PERCENTAGE;
  superBalanceTax[WITH_SUPER] = superBalance[WITH_SUPER] * SUPER_BALANCE_TAX;
  superBalanceTax[WITHOUT_SUPER] = 0; //Because we havent made any contribution to the super..
  netSuperBalance[WITH_SUPER] = superBalance[WITH_SUPER] - superBalanceTax[WITH_SUPER];
  netSuperBalance[WITHOUT_SUPER] = superBalance[WITHOUT_SUPER] - superBalanceTax[WITHOUT_SUPER];
  netSalary[WITH_SUPER] = taxableIncome[WITH_SUPER] - tax[WITH_SUPER] - medicareLevy[WITH_SUPER];
  netSalary[WITHOUT_SUPER] = taxableIncome[WITHOUT_SUPER] - tax[WITHOUT_SUPER] - medicareLevy[WITHOUT_SUPER];
  assets[WITH_SUPER] = netSalary[WITH_SUPER] + netSuperBalance[WITH_SUPER];
  assets[WITHOUT_SUPER] = netSalary[WITHOUT_SUPER] + netSuperBalance[WITHOUT_SUPER];
  gainLoss = assets[WITH_SUPER] - assets[WITHOUT_SUPER];
  //Make an object and pass that object to the callback..
  var stats = {
      salary:salary,
      tax:tax,
      medicareLevy:medicareLevy,
      superBalanceTax:superBalanceTax,
      netSuperBalance:netSuperBalance,
      netSalary:netSalary,
      assets:assets,
      gainLoss:gainLoss
    };
  console.log(stats);
  callback(stats);
}
function DrawChart(stats){
  var WITH_SUPER = 1;
  var WITHOUT_SUPER = 0;
  var idOfCanvas = "myChart";
  var ctx = document.getElementById(idOfCanvas).getContext('2d');
  document.getElementById(idOfCanvas).style.display = 'block';
  ctx.clearRect(0,0,1000,1000);
  var myChar = null;
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Net salary', 'Net super balance', 'Tax', 'Medicare'],
      datasets: [{
        label: 'Without contribution',
        data: [stats.netSalary[WITHOUT_SUPER], stats.netSuperBalance[WITHOUT_SUPER], stats.tax[WITHOUT_SUPER], stats.medicareLevy[WITHOUT_SUPER]],
        backgroundColor: "rgba(153,255,51,0.6)"
      }, {
        label: 'With contribution',
        data: [stats.netSalary[WITH_SUPER], stats.netSuperBalance[WITH_SUPER], stats.tax[WITH_SUPER], stats.medicareLevy[WITH_SUPER]],
        backgroundColor: "rgba(255,153,0,0.6)"
      }]
    }
  });
}
