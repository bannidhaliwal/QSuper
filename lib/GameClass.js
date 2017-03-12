const length = 125;
const height = 125;
function GameBox(id){
  this.id = id;
  this.element = null;
  this.LayoutBoxes = LayoutBoxes;
}
//Layout boxes on Canvas.
function LayoutBoxes(){
  //formula
  //id = ID  ID consists of two parts E.G -> 11. First part 1 repersents Y offset. Next part repersents X offset.
  //x offset = X-Offset
  //y Offset = Y-offset
  //length = 125
  //height = 125
  //(length * ID(X-offset))-length = X-offset.
}
module.exports = GameBox;
