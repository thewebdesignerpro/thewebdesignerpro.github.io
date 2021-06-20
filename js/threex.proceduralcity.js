/* from @mrdoob http://www.mrdoob.com/lab/javascript/webgl/city/01/
This script by Jerome Etienne.
Modified by Armstrong Chiu for this demo. */
var THREEx = THREEx || {}
THREEx.ProceduralCity	= function(){
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
	var buildingMesh = new THREE.Mesh( geometry );
	var light	= new THREE.Color( 0xffffff )
	var shadow	= new THREE.Color( 0x304050 )
	var cityGeometry= new THREE.Geometry();
	var	geometry2 = new THREE.CylinderGeometry( 0.05, 0.6, 0.8, 4 );
	geometry2.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.4, 0 ) );
	var	buildingMesh2 = new THREE.Mesh( geometry2 );	
	var	geometry3 = new THREE.CylinderGeometry( 0.8, 0.8, 1, 12 );
	geometry3.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
	var	buildingMesh3 = new THREE.Mesh( geometry3 );
	for( var i = 0; i < 2300; i++ ) {
		buildingMesh.position.x	= Math.floor( Math.random() * 200 - 100 ) * 8;
		buildingMesh.position.z	= Math.floor( Math.random() * 200 - 100 ) * 8;
		buildingMesh.rotation.y	= Math.random()*Math.PI*2;
		buildingMesh.scale.x	= Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
		buildingMesh.scale.y	= (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 10;
		buildingMesh.scale.z	= buildingMesh.scale.x
		var value	= 1 - Math.random() * Math.random();
		var baseColor	= new THREE.Color().setRGB( value + Math.random() * 0.15, value, value + Math.random() * 0.2 );
		var topColor	= baseColor.clone().multiply( light );
		var bottomColor	= baseColor.clone().multiply( shadow );
		var geometry	= buildingMesh.geometry;		
		for ( var j = 0, jl = geometry.faces.length; j < jl; j ++ ) {
			if ( j === 2 ) {
				geometry.faces[ j ].vertexColors = [ baseColor, baseColor, baseColor, baseColor ];
			} else {
				geometry.faces[ j ].vertexColors = [ topColor, bottomColor, bottomColor, topColor ];
			}
		}
		buildingMesh.updateMatrix();
		cityGeometry.merge( buildingMesh.geometry, buildingMesh.matrix );		
	}
	for( var i = 0; i < 500; i++ ) {
		buildingMesh2.position.x	= Math.floor( Math.random() * 200 - 100 ) * 8;
		buildingMesh2.position.z	= Math.floor( Math.random() * 200 - 100 ) * 8;
		buildingMesh2.rotation.y	= Math.random()*Math.PI*2;
		buildingMesh2.scale.x	= Math.random() * Math.random() * Math.random() * Math.random() * 50 + 5;
		buildingMesh2.scale.y	= (Math.random() * Math.random() * Math.random() * buildingMesh2.scale.x) * 12 + 10;
		buildingMesh2.scale.z	= buildingMesh2.scale.x
		var value	= 1 - Math.random() * Math.random();
		var baseColor	= new THREE.Color().setRGB( value + Math.random() * 0.15, value, value + Math.random() * 0.2 );
		var topColor	= baseColor.clone().multiply( light );
		var bottomColor	= baseColor.clone().multiply( shadow );
		var geometry2	= buildingMesh2.geometry;		
		for ( var j = 0, jl = geometry2.faces.length; j < jl; j ++ ) {
			if ( j === 2 ) {
				geometry2.faces[ j ].vertexColors = [ baseColor, baseColor, baseColor, baseColor ];
			} else {
				geometry2.faces[ j ].vertexColors = [ topColor, bottomColor, bottomColor, topColor ];
			}
		}
		buildingMesh2.updateMatrix();
		cityGeometry.merge( buildingMesh2.geometry, buildingMesh2.matrix );				
	}
	for( var i = 0; i < 400; i++ ) {
		buildingMesh3.position.x	= Math.floor( Math.random() * 200 - 100 ) * 8;
		buildingMesh3.position.z	= Math.floor( Math.random() * 200 - 100 ) * 8;
		buildingMesh3.rotation.y	= Math.random()*Math.PI*2;
		buildingMesh3.scale.x	= Math.random() * Math.random() * Math.random() * Math.random() * 40 + 5;
		buildingMesh3.scale.y	= (Math.random() * Math.random() * Math.random() * buildingMesh3.scale.x) * 14 + 10;
		buildingMesh3.scale.z	= buildingMesh3.scale.x
		var value	= 1 - Math.random() * Math.random();
		var baseColor	= new THREE.Color().setRGB( value + Math.random() * 0.15, value, value + Math.random() * 0.2 );
		var topColor	= baseColor.clone().multiply( light );
		var bottomColor	= baseColor.clone().multiply( shadow );
		var geometry3	= buildingMesh3.geometry;		
		for ( var j = 0, jl = geometry3.faces.length; j < jl; j ++ ) {
			if ( j === 2 ) {
				geometry3.faces[ j ].vertexColors = [ baseColor, baseColor, baseColor, baseColor ];
			} else {
				geometry3.faces[ j ].vertexColors = [ topColor, bottomColor, bottomColor, topColor ];
			}
		}
		buildingMesh3.updateMatrix();
		cityGeometry.merge( buildingMesh3.geometry, buildingMesh3.matrix );				
	}	
	var texture		= new THREE.Texture( generateTextureCanvas() );
	texture.needsUpdate	= true;
	var material	= new THREE.MeshLambertMaterial({
		map		: texture,
		vertexColors	: THREE.VertexColors
	});
	var mesh = new THREE.Mesh(cityGeometry, material );
	return mesh
	function generateTextureCanvas(){
		var canvas	= document.createElement( 'canvas' );
		canvas.width	= 32;
		canvas.height	= 64;
		var context	= canvas.getContext( '2d' );
		context.fillStyle	= '#171717';
		context.fillRect( 0, 0, 32, 64 );
		for( var y = 2; y < 64; y += 2 ){
			for( var x = 0; x < 32; x += 2 ){
				var value	= Math.floor( Math.random() * 255 );
				context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
				context.fillRect( x, y, 2, 1 );
			}
		}
		var canvas2	= document.createElement( 'canvas' );
		canvas2.width	= 512;
		canvas2.height	= 1024;
		var context	= canvas2.getContext( '2d' );
		context.imageSmoothingEnabled		= false;
		context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
		return canvas2;
	}
}