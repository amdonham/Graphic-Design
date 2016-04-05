//Alan Donham
//CS 435
//Project 6
//This program plays a gif in a TV scrren


"use strict";

var canvas;
var gl;
var points = [];
var colors = [];


var program;
var frameCount = 1;

///////////////Set up the View///////////////
var near = 0.3;
var far = 3.0;
var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 1.0);
var up = vec3(0.0, 1.0, 0.0);
/////////////////////////////////////////////

///////////////Set up textures///////////////
var texSize = 128;
var texCoordsArray = [];
var texture;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
/////////////////////////////////////////////


var vertexColors = [[ 0.0, 0.0, 0.0, 1.0 ],  // black
					[ 1.0, 0.0, 0.0, 1.0 ],  // red
					[ 1.0, 1.0, 0.0, 1.0 ],  // yellow
					[ 0.0, 1.0, 0.0, 1.0 ],  // green
					[ 0.0, 0.0, 1.0, 1.0 ],  // blue
					[ 1.0, 0.0, 1.0, 1.0 ],  // magenta
					[ 0.0, 1.0, 1.0, 1.0 ],  // cyan
					[ 1.0, 1.0, 1.0, 1.0 ]   // white
					];
	
var display = [	vec4( -.5,  -.5,  0.5, 1.0 ),
				vec4( -.5, .5,  0.5, 1.0 ),
				vec4(  .5, .5,  0.5, 1.0 ),
				vec4(  .5,  -.5,  0.5, 1.0 ),
				vec4( -.5,  -.5,  0.4, 1.0 ),
				vec4( -.5, .5,  0.4, 1.0 ),
				vec4(  .5, .5,  0.4, 1.0 ),
				vec4(  .5,  -.5,  0.4, 1.0 )
				];
var display2 = [vec4( -.5,  .5,  0.4, 1.0 ),
				vec4( -.5, -.5,  0.4, 1.0 ),
				vec4(  .5, -.5,  0.4, 1.0 ),
				vec4(  .5,  .5,  0.4, 1.0 ),
				vec4( -.5,  .5,  0.3, 1.0 ),
				vec4( -.5, -.5,  0.3, 1.0 ),
				vec4(  .5, -.5,  0.3, 1.0 ),
				vec4(  .5,  .5,  0.3, 1.0 )
				];
var axis = 0;

window.onload = function init()
{
	canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
 
 
	
	
	var carTex = document.getElementById("carTex");
	var roadTex = document.getElementById("roadTex");

	bufferObjects();
	
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

	/*
	document.getElementById("forward").onclick = function(){
		if(!play){
			if(currentAnimation == 40){currentAnimation = 0;}
			else{currentAnimation++;}
		}
	};
	*/
    render();
}


function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function bufferObjects(){
     //
    //  Load shaders and initialize attribute buffers
    //
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

}

function setDisplay(){
	setDisplayPoints( 1, 0, 3, 2);

}

function setDisplayPoints(a,b,c,d){
     points.push(display[a]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[0]);

     points.push(display[b]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[1]);

     points.push(display[c]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[2]);

     points.push(display[a]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[0]);

     points.push(display[c]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[2]);

     points.push(display[d]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[3]);
}

function setDisplay2(){
	setDisplay2Points( 1, 0, 3, 2);

}

function setDisplay2Points(a,b,c,d){
     points.push(display[a]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[0]);

     points.push(display[b]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[1]);

     points.push(display[c]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[2]);

     points.push(display[a]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[0]);

     points.push(display[c]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[2]);

     points.push(display[d]);
     colors.push(vertexColors[3]);
     texCoordsArray.push(texCoord[3]);
}


function render(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	eye = vec3(0.0,0.0,2.5);
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	
	points = [];
	setDisplay();
	configureTexture(roadTex);
	bufferObjects();
	gl.drawArrays( gl.TRIANGLES, 0, points.length );

	
	points = [];
	setDisplay2();
	configureTexture(carTex);
	bufferObjects();
	gl.drawArrays( gl.TRIANGLES, 0, points.length );
	


	
	window.requestAnimFrame(render);
}
