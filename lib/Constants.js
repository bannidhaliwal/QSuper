/*
    This file contains all the constants used in this 
    project. This file should be accessed by the require
    function.
    @author : Navjot Singh Dhaliwal
*/
var Constants = ()=>{
  return {
    HEIGHT_OF_CANVAS : 400,
    WIDTH_OF_CANVAS : 400,
    LENGTH_OF_ONE_BOX : 50,
    HEIGHT_OF_ONE_BOX : 50,
    TOTAL_BOXES_HORIZONTALLY_AND_VERTICALLY : 8,
    NUMBER_OF_ELEMENTS : 6,
    EMPTY_ELEMENT : 6,
    TIME_TAKEN_FOR_MOVING_ONE_TILE_DOWN : 500,
    FIRST_ROW : 1,
    FIRST_COLUMN : 1,
    LAST_ROW : 8,
    LAST_COLUMN : 8,
    ALL_LEGAL : "AL",
    LEFT_EDGE : "LE",
    RIGHT_EDGE : "RE",
    BOTTOM_LEFT_EDGE : "BLE",
    BOTTOM_RIGHT_EDGE : "BRE",
    BOTTOM_ROW : "BR",
    UPPER_ROW : "UR",
    LEFT_COLUMN : "LC",
    RIGHT_COLUMN : "RC",
    HORIZONTAL: 1,
    VERTICAL : 10,
    EMPTY : 0,
    VERTICAL_DIRECTION : "V",
    HORIZONTAL_DIRECTION : "H",
    CURRENT_ELEMENT : 0,
    LEFT_ELEMENT : -1,
    RIGHT_ELEMENT : 1,
    BOTTOM_ELEMENT : 10,
    UPPER_ELEMENT : -10,
    LEVEL_INFORMATION : 11, // index for the element which will store the score information..
    CASH_ELEMENT : 1,
    BALANCE_ELEMENT : 0,
    COCONTRIBUTION_ELEMENT : 2,
    FIRST_LEVEL_MOVES : 15,
    SECOND_LEVEL_MOVES : 20,
    THIRD_LEVEL_MOVES : 25,
    FOURTH_LEVEL_MOVES : 30,
    FIFTH_LEVEL_MOVES : 35,
    NO_OF_LEVELS : 5,
  };
}

module.exports = Constants;
