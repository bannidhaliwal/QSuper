var assert = require('assert');
var GameBox = require('../lib/GameClass.js');

describe('#CreateGameBox()', function() {
  it('Should equal to 89 as we have last ID which is 88', function() {
    assert.equal(89,GameBox.CreateGameBox(function(){}));
  });
});

describe('#getElementFromArray(21)',function() {
  it('ID should be 21 and Token should be SUN',function() {
    var gameBox = GameBox.CreateGameBox(function(){});
    var tempGameBox = GameBox.ReturnSpecificElementFromArray(21);
    tempGameBox.SetToken(GameBox.TOKENS.SUN);
    assert.equal(21,tempGameBox.ReturnId());
    assert.equal(GameBox.TOKENS.SUN,tempGameBox.ReturnToken());
  });
});
