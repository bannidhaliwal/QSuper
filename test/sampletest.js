var assert = require('assert');
var GameBox = require('../lib/GameClass.js');

describe('#CreateGameBox()', function() {
  it('Should equal to 64 as number of total boxes in game.', function() {
    assert.equal(64,GameBox.CreateGameBox(function(){}));
  });
});

describe('#GameBox(12)',function() {
  it('X pos Should equal to 125 as ID is 12 means Gamebox is on column 2 in first row',function() {
    var tempGameBox = new GameBox.GameBox(12);
    assert.equal(125,tempGameBox.ReturnXPos());
  });
});

describe('#GameBox(21)',function() {
  it('Y pos Should equal to 125 as ID is 21 means Gamebox is on column 1 in second row',function() {
    var tempGameBox = new GameBox.GameBox(21);
    assert.equal(125,tempGameBox.ReturnYPos());
  });
});
