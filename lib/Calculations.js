module.exports.ReturnStats = function(monthlySalary,monthlySalarySacrifice,callback){
  var monthsal = monthlySalary;
  var monthsalsac = monthlySalarySacrifice;
  var annsal = 0;
  var annsalsac = 0;
  var contributemonth = 0;
  var contributeannual = 0;
  var gainloss = 0;

  // First line for without contribution, second for with contribution.
  var taxincome = [0, 0];
  var tax = [0, 0];
  var medilevy = [0, 0];
  var superbal = [0, 0];
  var superbaltax = [0, 0];
  var netsuperbal = [0, 0];
  var netsalary = [0, 0];
  var yourasset = [0, 0];

  annsal = monthsal * 12;
  annsalsac = monthsalsac * 12;

  contributemonth = monthsal * 0.095;
  contributeannual = annsal * 0.095;

  taxincome[1] = annsal - annsalsac;
  taxincome[0] = annsal - 0;

  superbal[1] = contributeannual + annsalsac;
  superbal[0] = contributeannual;

  if (taxincome[1] < 18201)
  {
  	tax[1] = taxincome[1] * 0;
  }
  else if (taxincome[1] < 37001)
  {
  	tax[1] = (taxincome[1] - 18200) * 0.19;
  }
  else if (taxincome[1] < 80001)
  {
  	tax[1] = ((taxincome[1] - 37000) * 0.325) + 3572;
  }
  else if (taxincome[1] < 180001)
  {
  	tax[1] = ((taxincome[1] - 87000) * 0.37) + 19822;
  }
  else
  {
  	tax[1] = ((taxincome[1] - 180000) * 0.45) + 54232;
  }

  if (taxincome < 18201)
  {
  	tax[0] = taxincome[0] * 0;
  }
  else if (taxincome[0] < 37001)
  {
  	tax[0] = (taxincome[0] - 18200) * 0.19;
  }
  else if (taxincome[0] < 80001)
  {
  	tax[0] = ((taxincome[0] - 37000) * 0.325) + 3572;
  }
  else if (taxincome[0] < 180001)
  {
  	tax[0] = ((taxincome[0] - 87000) * 0.37) + 19822;
  }
  else
  {
  	tax[0] = ((taxincome[0] - 180000) * 0.45) + 54232;
  }

  medilevy[1] = taxincome[1] * 0.02;
  medilevy[0] = taxincome[0] * 0.02;
  superbaltax[1] = superbal[1] * 0.15;
  superbaltax[0] = superbal[0] * 0.15;
  netsuperbal[1] = superbal[1] - superbaltax[1];
  netsuperbal[0] = superbal[0] - superbaltax[0];
  netsalary[1] = taxincome[1] - tax[1] - medilevy[1];
  netsalary[0] = taxincome[0] - tax[0] - medilevy[0];
  yourasset[1] = netsuperbal[1] + netsalary[1];
  yourasset[0] = netsuperbal[0] + netsalary[0];
  gainloss = yourasset[1] - yourasset[0];
  var stats = {
    annualSalary:annsal,
    tax:tax,
    mediLevy:medilevy,
    superBalanceTax:superbaltax,
    netSuperBalance:netsuperbal,
    netSalary:netsalary,
    yourAsset:yourasset,
    gainLoss:gainloss
  };
  console.log(stats);
  callback(stats);
}
