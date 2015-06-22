/* global dat */

var RoboBase = function() {
  this.name = 'Robot Base';
  this.joints = 0;

  this.length = 50;
  this.width = 20;
};

var roboBase = new RoboBase();
var gui = new dat.GUI();
gui.add(roboBase, 'name');
gui.add(roboBase, 'joints', 0, 99);
gui.add(roboBase, 'length', 1, 99);
gui.add(roboBase, 'width', 1, 99);
