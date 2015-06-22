export default class RoboBase {
	constructor(scene) {
		this.scene = scene;
		this.name = 'Robot Base';
		this.joints = 0;

		this.length = 50;
		this.width = 20;
	}

	renderMenu() {
		var gui = new dat.GUI();
		gui.add(this, 'name');
		gui.add(this, 'joints', 0, 99);
		var lengthController = gui.add(this, 'length', 1, 99);
		var widthController = gui.add(this, 'width', 1, 99);

		var onChange = this.onChange.bind(this);
		widthController.onChange(onChange);
		lengthController.onChange(onChange);
	}

	onChange() {
		this.render();
	}

	render() {
		var rectShape = new THREE.Shape();
		rectShape.moveTo(0, 0);
		rectShape.lineTo(0, this.width);
		rectShape.lineTo(this.length, this.width);
		rectShape.lineTo(this.length, 0);
		rectShape.lineTo(0, 0);

		var rectGeom = new THREE.ShapeGeometry(rectShape);
		var rectMesh = new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({ color: 0xff0000 }));

		this.scene.add(rectMesh);
	}
}
