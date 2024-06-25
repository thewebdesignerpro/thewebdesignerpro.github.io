var shades = {
	fsGlow: [
		'#ifdef GL_ES',
		'precision mediump float;',
		'#endif',
		'uniform float time;',
		'uniform float alpha;', 
		'uniform vec2 resolution;',
		'varying vec2 vUv;', 		

		'void main( void ) {',
			'vec2 position = -1.0 + 2.0 * vUv;',		
			'float d = length(position - vec2(0, 0));', 
			//'d = .6 / d - .8;', 			
			'd = .4 / d - .8;', 			
			'float xx = d;',
			'float yy = d * .8;',
			'float zz = d * .2;',				
			//'gl_FragColor = vec4(xx, yy, zz, (xx+yy+zz)*alpha);',
			'gl_FragColor = vec4(xx, yy, zz, 1.);',
		'}'	
	].join('\r\n'), 	
	
	vsGlow: [
		'varying vec2 vUv;',
		'void main()	{',
			'vUv = uv;',
			'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
			'gl_Position = projectionMatrix * mvPosition;',
		'}'	
	].join('\r\n')
	
}; 

