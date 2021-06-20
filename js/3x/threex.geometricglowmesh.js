var THREEx = THREEx || {}

THREEx.GeometricGlowMesh = function(mesh, gw, coe, pwv){
	var object3d = new THREE.Object3D

	var geometry = mesh.geometry.clone()
	THREEx.dilateGeometry(geometry, gw)
	var material = THREEx.createAtmosphereMaterial()
	material.uniforms.glowColor.value = new THREE.Color('cyan')
	material.uniforms.coeficient.value = coe
	material.uniforms.power.value = pwv
	material.side = THREE.BackSide
	var outsideMesh	= new THREE.Mesh( geometry, material );
	object3d.add( outsideMesh );

	// expose a few variable
	this.object3d = object3d
	this.outsideMesh = outsideMesh
}
