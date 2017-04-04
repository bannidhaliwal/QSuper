//This class is for the testing purposes of the socket functions.
//It will test all the logics and return values which are passed for
//just testing purposes and will match them to the expected results.
//Make sure after making any changes these tests pass.
var assert = require('assert');
var socketFunctions = require("../lib/SocketFunctions.js");
var Constants = require('../lib/Constants.js');

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
  it('Should return true as the ID provided is 22 and the element can move in all four directions',function(){
    assert.equal(true,socketFunctions.checkIfElementCanHaveAllLegalMoves("22"));
  });
  it('Should return false as the ID provided is 11 and the element is in first row and column',function(){
    assert.equal(false,socketFunctions.checkIfElementCanHaveAllLegalMoves("11"));
  });
  it('Should return false as the ID provided is 28 and the element is in last column hence cannot move forward',function(){
    assert.equal(false,socketFunctions.checkIfElementCanHaveAllLegalMoves("28"));
  });
  it('Should return false as the ID provided is 21 and the element is in the first column',function(){
    assert.equal(false,socketFunctions.checkIfElementCanHaveAllLegalMoves("21"));
  });
  it('Should return true as the ID provided is 24 and the element can move in all directions',function(){
    assert.equal(true,socketFunctions.checkIfElementCanHaveAllLegalMoves("24"));
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

describe("#SocketFunctions.DetermineThePositionOfClickedElement",function(){
  it('Should return AL as the all movements are legal.',function(){
    assert.equal(Constants().ALL_LEGAL,socketFunctions.DetermineThePositionOfClickedElement("27"));
  });
  it('Should return LE as the elements is on the left edge.',function(){
    assert.equal(Constants().LEFT_EDGE,socketFunctions.DetermineThePositionOfClickedElement("11"));
  });
  it('Should return RE as the element is on the right edge.',function(){
    assert.equal(Constants().RIGHT_EDGE,socketFunctions.DetermineThePositionOfClickedElement("18"));
  });
  it('Should return BLE as the element is on the bottom left edge.',function(){
    assert.equal(Constants().BOTTOM_LEFT_EDGE,socketFunctions.DetermineThePositionOfClickedElement("81"));
  });
  it('Should return BRE as the element is on the bottom right edge.',function(){
    assert.equal(Constants().BOTTOM_RIGHT_EDGE,socketFunctions.DetermineThePositionOfClickedElement("88"));
  });
  it('Should return BR as the element is in the bottom row.',function(){
    assert.equal(Constants().BOTTOM_ROW,socketFunctions.DetermineThePositionOfClickedElement("85"));
  });
  it('Should return BR as the element is in the bottom row.',function(){
    assert.equal(Constants().BOTTOM_ROW,socketFunctions.DetermineThePositionOfClickedElement("83"));
  });
  it('Should return UR as the element is in the upper row.',function(){
    assert.equal(Constants().UPPER_ROW,socketFunctions.DetermineThePositionOfClickedElement("15"));
  });
  it('Should return UR as the element is in the upper row.',function(){
    assert.equal(Constants().UPPER_ROW,socketFunctions.DetermineThePositionOfClickedElement("16"));
  });
  it('Should return RC as the element is in the right column.',function(){
    assert.equal(Constants().RIGHT_COLUMN,socketFunctions.DetermineThePositionOfClickedElement("68"));
  });
  it('Should return LC as the element is in the left column.',function(){
    assert.equal(Constants().LEFT_COLUMN,socketFunctions.DetermineThePositionOfClickedElement("61"));
  });

});

describe("#SocketFunctions.AssignPositions",function(){
  it('Should return 21,12 because the element is on the left edge and can just move to east and south only',function(){
    assert.equal(21,socketFunctions.AssignPositions("",null,11,Constants().LEFT_EDGE)[0]);
    assert.equal(12,socketFunctions.AssignPositions("",null,11,Constants().LEFT_EDGE)[1]);
  });
  it('Should return 28,17 as the element is on the right edge and only can move west and south only',function(){
    assert.equal(28,socketFunctions.AssignPositions("",null,18,Constants().RIGHT_EDGE)[0]);
    assert.equal(17,socketFunctions.AssignPositions("",null,18,Constants().RIGHT_EDGE)[1]);
  });
  it('Should return 25,14,16 as the element is in the first row and cannot move north only.',function(){
    assert.equal(25,socketFunctions.AssignPositions("",null,15,Constants().UPPER_ROW)[0]);
    assert.equal(14,socketFunctions.AssignPositions("",null,15,Constants().UPPER_ROW)[1]);
    assert.equal(16,socketFunctions.AssignPositions("",null,15,Constants().UPPER_ROW)[2]);
  });
  it('Should return 87,78 as the element is in the Bottom right edge and can move north and west only.',function(){
    assert.equal(78,socketFunctions.AssignPositions(null,null,88,Constants().BOTTOM_RIGHT_EDGE)[0]);
    assert.equal(87,socketFunctions.AssignPositions(null,null,88,Constants().BOTTOM_RIGHT_EDGE)[1]);
  });
  it('Should return 82,71 as the element is in the Bottom left edge and can move east and north only.',function(){
    assert.equal(71,socketFunctions.AssignPositions(null,null,81,Constants().BOTTOM_LEFT_EDGE)[0]);
    assert.equal(82,socketFunctions.AssignPositions(null,null,81,Constants().BOTTOM_LEFT_EDGE)[1]);
  });
  it('Should return 75,86,84 as the element is in the last row and cannot move in south direction only',function(){
    assert.equal(75,socketFunctions.AssignPositions(null,null,85,Constants().BOTTOM_ROW)[0]);
    assert.equal(86,socketFunctions.AssignPositions(null,null,85,Constants().BOTTOM_ROW)[1]);
    assert.equal(84,socketFunctions.AssignPositions(null,null,85,Constants().BOTTOM_ROW)[2]);
  });
  it('Should return 68,88,77 as the element is in the last column and cannot move in east direction only.',function(){
    assert.equal(68,socketFunctions.AssignPositions(null,null,78,Constants().RIGHT_COLUMN)[0]);
    assert.equal(88,socketFunctions.AssignPositions(null,null,78,Constants().RIGHT_COLUMN)[1]);
    assert.equal(77,socketFunctions.AssignPositions(null,null,78,Constants().RIGHT_COLUMN)[2]);
  });
  it('Should return 61,81,72 as the element is in the left edge and cannot move in west direction only',function(){
    assert.equal(61,socketFunctions.AssignPositions(null,null,71,Constants().LEFT_COLUMN)[0]);
    assert.equal(81,socketFunctions.AssignPositions(null,null,71,Constants().LEFT_COLUMN)[1]);
    assert.equal(72,socketFunctions.AssignPositions(null,null,71,Constants().LEFT_COLUMN)[2]);
  });
  it('Should should return 36,16,25,27 as the element is in the position where it can move in all directions.',function(){
    assert.equal(36,socketFunctions.AssignPositions(null,null,26,Constants().ALL_LEGAL)[0]);
    assert.equal(16,socketFunctions.AssignPositions(null,null,26,Constants().ALL_LEGAL)[1]);
    assert.equal(27,socketFunctions.AssignPositions(null,null,26,Constants().ALL_LEGAL)[2]);
    assert.equal(25,socketFunctions.AssignPositions(null,null,26,Constants().ALL_LEGAL)[3]);
  });
});
