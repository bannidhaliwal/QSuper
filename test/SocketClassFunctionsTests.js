var assert = require('assert');
var socketFunctions = require("../lib/SocketFunctions.js");

describe('#SocketFunctions.checkIfElementIsInFirstRow(yCoord)', function() {
  it('Should be true as the yCoord is = 1', function() {
    assert.equal(true,socketFunctions.checkIfElementIsInFirstRow("1"));
    });

  it('Should be false as the yCoord is not = 1',function(){
    assert.equal(false,socketFunctions.checkIfElementIsInFirstRow("2"));
  });
});

describe('#SocketFunctions.checkIfElementIsInLastRow(yCoord)',function(){
  it('Should return true as the yCoord is = 8',function(){
    assert.equal(true,socketFunctions.checkIfElementIsInLastRow("8"));
  });
  it('Should return fasle as the yCoord is not = 8',function(){
    assert.equal(false,socketFunctions.checkIfTheElementIsInLastColumn("7"));
  });
});

describe('#SocketFunctions.checkIfTheElementIsInTheLastColumn(xCoord)',function(){
  it('Should return true as the xCoord is = 8',function(){
    assert.equal(true,socketFunctions.checkIfTheElementIsInLastColumn("8"));
  });
  it('Should return false as the xCoord is not = 8',function(){
    assert.equal(false,socketFunctions.checkIfTheElementIsInLastColumn("7"));
  });
});

describe('#SocketFunctions.checkIfTheElementIsInTheFirstColumn(xCoord)',function(){
  it('Should return true as the xCoord is = 1',function(){
    assert.equal(true,socketFunctions.checkIfTheElementIsInTheFirstColumn("1"));
  });
  it('Should return false as the xCoord is not = 1',function(){
    assert.equal(false,socketFunctions.checkIfTheElementIsInTheFirstColumn("2"));
  });
});

describe('#SocketFunctions.checkIfElementCanHaveAllLegalMoves(id)',function(){
  it('Should return false as the ID provided is 22 and the element can move in all four directions',function(){
    assert.equal(false,socketFunctions.checkIfElementCanHaveAllLegalMoves("22"));
  });
  it('Should return true as the ID provided is 11 and the element is in first row and column',function(){
    assert.equal(true,socketFunctions.checkIfElementCanHaveAllLegalMoves("11"));
  });
  it('Should return true as the ID provided is 28 and the element is in last column hence cannot move forward',function(){
    assert.equal(true,socketFunctions.checkIfElementCanHaveAllLegalMoves("28"));
  });
  it('Should return true as the ID provided is 21 and the element is in the first column',function(){
    assert.equal(true,socketFunctions.checkIfElementCanHaveAllLegalMoves("21"));
  });
  it('Should return false as the ID provided is 24 and the element can move in all directions',function(){
    assert.equal(false,socketFunctions.checkIfElementCanHaveAllLegalMoves("24"));
  });
});

describe('#SocketFunctions.ifElementIsInTheFirstRowOnly',function(){
  it('Should throw an error because the ID is invalid',function(){
    assert.throws(() => { socketFunctions.ifElementIsInTheFirstRowOnly("19")}, Error, "Invalid ID provided");
  });
  it('Should return true as the element is in the first row only and not in the last or first column',function(){
    assert.equal(true,socketFunctions.ifElementIsInTheFirstRowOnly("17"));
  });
  it('Should return false as the element is in the last column and first row',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheFirstRowOnly("18"));
  });
  it('Should return false as the element is is the first column and first row as well.',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheFirstRowOnly("11"));
  });
  it('Should return false as the element is not in first row.',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheFirstRowOnly("23"));
  });
  it('Should return true as the element is in the first row only',function(){
    assert.equal(true,socketFunctions.ifElementIsInTheFirstRowOnly("15"));
  });
});

describe('#SocketFunctions.ifElementIsInTheLastInRowOnly',function(){
  it('Should return true as the element is in the last row only',function(){
    assert.equal(true,socketFunctions.ifElementIsInTheLastRowOnly("82"));
  });
  it('Should return false as the element is not in the last row',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheLastRowOnly("12"))
  });
  it('Should return false as the element is in last row but in last column as well',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheLastRowOnly("88"))
  });
  it('Should return false as the element is in the last row and in first column as well',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheLastRowOnly("81"))
  });
  it('Should return true as the element is in the last row only.',function(){
    assert.equal(true,socketFunctions.ifElementIsInTheLastRowOnly("85"))
  });
});

describe('#SocketFunctions.ifElementIsInFirstRowAndLastColumn',function(){
  it('Should return true as the element is in the first row and last column',function(){
    assert.equal(true,socketFunctions.ifElementIsInFirstRowAndLastColumn("18"));
  });
  it('Should return false as the element is in the first row and not in the last column',function(){
    assert.equal(false,socketFunctions.ifElementIsInFirstRowAndLastColumn("15"));
  });
  it('Should return false as the element is in the last column but not in first row',function(){
    assert.equal(false,socketFunctions.ifElementIsInFirstRowAndLastColumn("28"));
  });
  it('Should return false as the element is in the last row and last column',function(){
    assert.equal(false,socketFunctions.ifElementIsInFirstRowAndLastColumn("88"));
  });
});

describe('#SocketFunctions.ifElementIsInLastColumnOnly',function(){
  it('Should return true as the element is in the last column only and not in the first or the last row',function(){
    assert.equal(true,socketFunctions.ifElementIsInLastColumnOnly("28"));
  });
  it('Should return false as the element is in last column but in last row as well',function(){
    assert.equal(false,socketFunctions.ifElementIsInLastColumnOnly("88"));
  });
  it('Should return false as the element is in the last column but in first row as well',function(){
    assert.equal(false,socketFunctions.ifElementIsInLastColumnOnly("18"));
  });
  it('Should return false as the element is in first column',function(){
    assert.equal(false,socketFunctions.ifElementIsInLastColumnOnly("51"));
  });
  it('Should return true as the element is in the last column and not in first or last row',function(){
    assert.equal(true,socketFunctions.ifElementIsInLastColumnOnly("58"));
  });

});

describe('#SocketFunctions.ifElementIsInFirstColumnOnly',function(){
  it('Should return true as the element is in the first column only and not in the first or the last row',function(){
    assert.equal(true,socketFunctions.ifElementIsInFirstColumnOnly("21"));
  });
  it('Should return false as the element is in first column but in last row as well',function(){
    assert.equal(false,socketFunctions.ifElementIsInFirstColumnOnly("81"));
  });
  it('Should return false as the element is in the first column but in first row as well',function(){
    assert.equal(false,socketFunctions.ifElementIsInFirstColumnOnly("11"));
  });
  it('Should return false as the element is in last column',function(){
    assert.equal(false,socketFunctions.ifElementIsInFirstColumnOnly("15"));
  });
  it('Should return true as the element is in the first column and not in first or last row',function(){
    assert.equal(true,socketFunctions.ifElementIsInFirstColumnOnly("51"));
  });
});

describe('#SocketFunctions.ifElementIsInFirstRowAndFirstColumn',function(){
  it('Should return true as the element is in the first row and first column',function(){
    assert.equal(true,socketFunctions.ifElementIsInFirstRowAndFirstColumn("11"));
  });
  it('Should return false as the element is in first column but not in the first row',function(){
    assert.equal(false,socketFunctions.ifElementIsInFirstRowAndFirstColumn("21"));
  });
  it('Should return false as the element is in first row and last column',function(){
    assert.equal(false,socketFunctions.ifElementIsInFirstRowAndFirstColumn("18"));
  });
  it('Should return false as the element is in last row and first column',function(){
    assert.equal(false,socketFunctions.ifElementIsInFirstRowAndFirstColumn("81"));
  });

});

describe('#SocketFunctions.ifElementIsInTheLastRowAndLastColumn',function(){
  it('Should return true as the element is in last row and last column',function(){
    assert.equal(true,socketFunctions.ifElementIsInTheLastRowAndLastColumn("88"));
  });
  it('Should return false as the element is in last column but not in the last row',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheLastRowAndLastColumn("28"));
  });
  it('Should return false as the element is in the last row but not in the last column',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheLastRowAndLastColumn("82"));
  });

});

describe('#SocketFunctions.ifElementIsInLastRowAndFirstColumn',function(){
  it('Should return true as the element is in last row and first column',function(){
    assert.equal(true,socketFunctions.ifElementIsInTheLastRowAndFirstColumn("81"));
  });
  it('Should return false as the element is in last row and last column',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheLastRowAndFirstColumn("88"));
  });
  it('Should return false as the element is in the last row but not in the first column',function(){
    assert.equal(false,socketFunctions.ifElementIsInTheLastRowAndFirstColumn("82"));
  });

});
