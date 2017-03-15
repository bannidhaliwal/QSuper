var assert = require('assert');
var Constants = require("../lib/Constants.js");
var GameClass = require('../lib/GameClass.js');

describe('#CreateGameBox(callback)', function() {
  it('Should Initialize the Gamebox and length of array should be 89.', function() {
    GameClass.CreateGameBox((array)=>{
      assert.equal(89,array.length);
    });
  });

  it('Should reterieve 11 when we access the 11 element. ID is always same as location of element in array.', function() {
    GameClass.CreateGameBox((array)=>{
      assert.equal(11,array[11].id);
    });
  });

  it('Height and Width always should be relevent to ID. Such as XOffset * Width-width', function() {
    GameClass.CreateGameBox((array)=>{
      assert.equal(Constants().LENGTH_OF_ONE_BOX,array[12].xPosition);
      assert.equal((3*(Constants().LENGTH_OF_ONE_BOX))-Constants().LENGTH_OF_ONE_BOX,array[13].xPosition);
    });
  });

});
