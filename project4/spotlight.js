//Alan Donham
//CS 435
//Project 4
//This program generates a 3d display of a room with lighting


"use strict";

var canvas;
var gl;

var NumVertices  = 108;

var points = [];
var colors = [];
var normalsArray = [];

var program;

var frameCount = 1;
var near = 0.3;
var far = 3.0;
var radius = 2.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

var lightPosition = vec4(0.7, -.5, 1.0, 1.0 );
var lightAmbient = vec4(1, 1, 1, 1.0 );
var lightDiffuse = vec4( 0.3, 0.3, 0.3, 0.3 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;
var cangle = 3.5

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, -0.8, 0.8);
var up = vec3(0.0, 1.0, 0.0);
var zoom;
var angle;
var pos = 0;



var vertexColors = [[ 0.0, 0.0, 0.0, 1.0 ],  // black
					[ 1.0, 0.0, 0.0, 1.0 ],  // red
					[ 1.0, 1.0, 0.0, 1.0 ],  // yellow
					[ 0.0, 1.0, 0.0, 1.0 ],  // green
					[ 0.0, 0.0, 1.0, 1.0 ],  // blue
					[ 1.0, 0.0, 1.0, 1.0 ],  // magenta
					[ 0.0, 1.0, 1.0, 1.0 ],  // cyan
					[ 1.0, 1.0, 1.0, 1.0 ]   // white
					];
	
var display = [	vec4( -0.75, .5,  0.5, 1.0 ),
				vec4( -0.75, .9,  0.5, 1.0 ),
				vec4(  0.75, .9,  0.5, 1.0 ),
				vec4(  0.75, .5,  0.5, 1.0 ),
				vec4( -0.75, .5, -0.5, 1.0 ),
				vec4( -0.75, .9, -0.5, 1.0 ),
				vec4(  0.75, .9, -0.5, 1.0 ),
				vec4(  0.75, .5, -0.5, 1.0 )
				];
var wall;
var walls;			
var base;
var axis = 0;
//var theta = [ 4, 0, 0 ];

//var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	
	var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
	
	calcWalls(0,0,0);
	setAllPoints();
	
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
	
	gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );
	
	document.getElementById("inc").addEventListener("click", function(){
		cangle += 1;
	});
	document.getElementById("dec").addEventListener("click", function(){
		cangle -= 1;
	});
	window.addEventListener("keydown", function(event){
	//console.log(event.keyCode);
	switch(event.keyCode){
		case 13:
			if(pos == 5){pos = 0;}
			else{pos++;}
	}
		
    });
	
	
	
    render();
}

function setLight(){
	eye = vec3(0.0,0.2,0.0);
	at = vec3(0,-2,-1);
	up = vec3(0.0, 1.0, 0.0);
	lightAmbient = vec4(1, 1, 1, 1.0 );
	lightDiffuse = vec4( 0.0, 0.0, 0.0, 0.0 );
	lightSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );

	if(document.getElementById("1").checked){eye = vec3(-.7,0.2,0.5); lightPosition = vec4( 1.5, 4.5, cangle, 1.0 );}
	if(document.getElementById("2").checked){eye = vec3(0.0,0.2,0.0); lightPosition = vec4( 8.0, 1.0, cangle, 1.0 );}
	if(document.getElementById("3").checked){eye = vec3(0.0,0.2,0.0); lightPosition = vec4( 0.0, 1.0, cangle, 1.0 );}
	if(document.getElementById("4").checked){eye = vec3(0.0,0.2,0.0); lightPosition = vec4( -8.0, 1.0, cangle, 1.0 );}
	if(document.getElementById("5").checked){eye = vec3(-0.3,0.3,0.0); lightPosition = vec4( -14.0, 22.0, cangle, 1.0 );}

	modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);
	
	
	var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
	
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
	
	gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );
}

function setEye(){
	if(pos == 0){eye = vec3(0,1.7,1.5);}
	if(pos == 1){eye = vec3(.6,0,1.4);}
	if(pos == 2){eye = vec3(.6,0,.6);}
	if(pos == 3){eye = vec3(0,0,.6);}
	if(pos == 4){eye = vec3(-.6,0,.8);}
	if(pos == 5){eye = vec3(-.6,0,1.4);}
}

function calcWalls(x,y,z){
		x = 0-x;
		z = 0 - z + 1;
		walls = [];
		walls.push([vec4( -0.75+x, -0.89+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4( -0.74+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4( -0.74+x, -0.89+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.89+y,  0.5+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( -0.74+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( -0.74+x, -0.89+y,  0.5+z, 1.0 )
					]);
		walls.push([vec4( 0.74+x, -0.89+y, -0.5+z, 1.0 ),
					vec4( 0.74+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4( 0.75+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4( 0.75+x, -0.89+y, -0.5+z, 1.0 ),
					vec4( 0.74+x, -0.89+y,  0.5+z, 1.0 ),
					vec4( 0.74+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( 0.75+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( 0.75+x, -0.89+y,  0.5+z, 1.0 )
					]);
		walls.push([vec4( -0.75+x, -0.89+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4(  0.75+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4(  0.75+x, -0.89+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.89+y, -0.49+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,  -0.49+z, 1.0 ),
					vec4(  0.75+x, -0.2+y,  -0.49+z, 1.0 ),
					vec4(  0.75+x, -0.89+y, -0.49+z, 1.0 )
					]);
		walls.push([vec4( -0.75+x, -0.89+y, 0.49+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,  0.49+z, 1.0 ),
					vec4( -0.25+x, -0.2+y,  0.49+z, 1.0 ),
					vec4( -0.25+x, -0.89+y, 0.49+z, 1.0 ),
					vec4( -0.75+x, -0.89+y, 0.5+z,  1.0 ),
					vec4( -0.75+x, -0.2+y,  0.5+z,  1.0 ),
					vec4( -0.25+x, -0.2+y,  0.5+z,  1.0 ),
					vec4( -0.25+x, -0.89+y, 0.5+z,  1.0 )
					]);
		walls.push([vec4( 0.25+x, -0.89+y, 0.49+z, 1.0 ),
					vec4( 0.25+x, -0.2+y,  0.49+z, 1.0 ),
					vec4( 0.75+x, -0.2+y,  0.49+z, 1.0 ),
					vec4( 0.75+x, -0.89+y, 0.49+z, 1.0 ),
					vec4( 0.25+x, -0.89+y, 0.5+z,  1.0 ),
					vec4( 0.25+x, -0.2+y,  0.5+z,  1.0 ),
					vec4( 0.75+x, -0.2+y,  0.5+z,  1.0 ),
					vec4( 0.75+x, -0.89+y, 0.5+z,  1.0 )
					]);
		walls.push([vec4( -0.25+x, -0.89+y, -0.005+z, 1.0 ),
					vec4( -0.25+x, -0.2+y,  -0.005+z, 1.0 ),
					vec4( 0.25+x, -0.2+y,   -0.005+z, 1.0 ),
					vec4( 0.25+x, -0.89+y,  -0.005+z, 1.0 ),
					vec4( -0.25+x, -0.89+y, 0.005+z,  1.0 ),
					vec4( -0.25+x, -0.2+y,  0.005+z,  1.0 ),
					vec4( 0.25+x, -0.2+y,   0.005+z,  1.0 ),
					vec4( 0.25+x, -0.89+y,  0.005+z,  1.0 )
					]);
		walls.push([vec4( -0.25+x, -0.89+y,  0.015+z, 1.0 ),
					vec4( -0.25+x, -0.2+y,   0.015+z, 1.0 ),
					vec4( -0.24+x, -0.2+y,   0.015+z, 1.0 ),
					vec4( -0.24+x, -0.89+y,  0.015+z, 1.0 ),
					vec4( -0.25+x, -0.89+y,  0.5+z, 1.0 ),
					vec4( -0.25+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( -0.24+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( -0.24+x, -0.89+y,  0.5+z, 1.0 )
					]);
		walls.push([vec4( 0.24+x, -0.89+y,  0.015+z, 1.0 ),
					vec4( 0.24+x, -0.2+y,   0.015+z, 1.0 ),
					vec4( 0.25+x, -0.2+y,   0.015+z, 1.0 ),
					vec4( 0.25+x, -0.89+y,  0.015+z, 1.0 ),
					vec4( 0.24+x, -0.89+y,  0.5+z, 1.0 ),
					vec4( 0.24+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( 0.25+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( 0.25+x, -0.89+y,  0.5+z, 1.0 )
					]);
					
		//Floor
		walls.push([vec4( -0.75+x, -0.9+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.89+y,-0.5+z, 1.0 ),
					vec4( -0.24+x, -0.89+y,-0.5+z, 1.0 ),
					vec4( -0.24+x, -0.9+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.9+y,  0.5+z, 1.0 ),
					vec4( -0.75+x, -0.89+y, 0.5+z, 1.0 ),
					vec4( -0.24+x, -0.89+y, 0.5+z, 1.0 ),
					vec4( -0.24+x, -0.9+y,  0.5+z, 1.0 )
					]);
		walls.push([vec4( -0.24+x, -0.9+y,  -0.5+z, 1.0 ),
					vec4( -0.24+x, -0.89+y, -0.5+z, 1.0 ),
					vec4(  0.25+x, -0.89+y, -0.5+z, 1.0 ),
					vec4(  0.25+x, -0.9+y,  -0.5+z, 1.0 ),
					vec4( -0.24+x, -0.9+y, 0.015+z, 1.0 ),
					vec4( -0.24+x, -0.89+y,0.015+z, 1.0 ),
					vec4(  0.25+x, -0.89+y,0.015+z, 1.0 ),
					vec4(  0.25+x, -0.9+y, 0.015+z, 1.0 )
					]);
		walls.push([vec4( 0.24+x, -0.9+y, -0.5+z, 1.0 ),
					vec4( 0.24+x, -0.89+y,-0.5+z, 1.0 ),
					vec4( 0.75+x, -0.89+y,-0.5+z, 1.0 ),
					vec4( 0.75+x, -0.9+y, -0.5+z, 1.0 ),
					vec4( 0.24+x, -0.9+y,  0.5+z, 1.0 ),
					vec4( 0.24+x, -0.89+y, 0.5+z, 1.0 ),
					vec4( 0.75+x, -0.89+y, 0.5+z, 1.0 ),
					vec4( 0.75+x, -0.9+y,  0.5+z, 1.0 )
					]);
}


function bufferObjects(){
     //
    //  Load shaders and initialize attribute buffers
    //
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

   // var vColor = gl.getAttribLocation( program, "vColor" );
    //gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    //gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

}

function addXColumn(x,y){
	var column =[	vec4( x+.01,     y,      0.54, 1.0 ),
					vec4( x+.01,     y+.01, 0.54, 1.0 ),
					vec4( x+.06,     y+.01, 0.54, 1.0 ),
					vec4( x+.06,     y,      0.54, 1.0 ),
					vec4( x+.01,     y,      0.5, 1.0 ),
					vec4( x+.01,     y+.01, 0.5, 1.0 ),
					vec4( x+.06,     y+.01, 0.5, 1.0 ),
					vec4( x+.06,     y,      0.5, 1.0 )
				];
	textArray.push(column);
	/*for(var i = 0;i < column.length;i++){
		textArray.push(column[i]);
	}*/
}

function addYColumnRotate(x,y,degrees){
	var column =[	vec4( x,     y,    0.54, 1.0 ),
					vec4( x,     y+.115, 0.54, 1.0 ),
					vec4( x+.012, y+.115, 0.54, 1.0 ),
					vec4( x+.012, y,    0.54, 1.0 ),
					vec4( x,     y,    0.5, 1.0 ),
					vec4( x,     y+.115, 0.5, 1.0 ),
					vec4( x+.012, y+.115, 0.5, 1.0 ),
					vec4( x+.012, y,    0.5, 1.0 )
				];
	column = rotateXZ(column,degrees);
	textArray.push(column);
	/*for(var i = 0;i < column.length;i++){
		textArray.push(column[i]);
	}*/
}

function addYColumn(x,y){
	var column =[	vec4( x,     y,    0.54, 1.0 ),
					vec4( x,     y+.1, 0.54, 1.0 ),
					vec4( x+.012, y+.1, 0.54, 1.0 ),
					vec4( x+.012, y,    0.54, 1.0 ),
					vec4( x,     y,    0.5, 1.0 ),
					vec4( x,     y+.1, 0.5, 1.0 ),
					vec4( x+.012, y+.1, 0.5, 1.0 ),
					vec4( x+.012, y,    0.5, 1.0 )
				];
	textArray.push(column);
	/*for(var i = 0;i < column.length;i++){
		textArray.push(column[i]);
	}*/
}


function setAllPoints(){
	points = [];
	colors = [];
	setWalls();

	program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	


    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
}


function setBase(){
	setBasePoints( 1, 0, 3, 2, 0 );
    setBasePoints( 2, 3, 7, 6, 0 );
    setBasePoints( 3, 0, 4, 7, 0 );
    setBasePoints( 6, 5, 1, 2, 4 );
    setBasePoints( 4, 5, 6, 7, 0 );
    setBasePoints( 5, 4, 0, 1, 0 );
	
}

function setWalls(){
	for(var i = 0; i < walls.length;++i){
		wall = walls[i];
		setWall();
	}
}
function setWall(){
	setWallPoints( 1, 0, 3, 2, 4 );
    setWallPoints( 2, 3, 7, 6, 0 );
    setWallPoints( 3, 0, 4, 7, 4 );
    setWallPoints( 6, 5, 1, 2, 2 );
    setWallPoints( 4, 5, 6, 7, 4 );
    setWallPoints( 5, 4, 0, 1, 1 );
}


function setWallPoints(a,b,c,d,colorIndex){
	var indices = [ a, b, c, a, c, d ];
    for ( var i = 0; i < indices.length; ++i ) {
        points.push( wall[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[colorIndex]);

    }
}

function setBasePoints(a,b,c,d,colorIndex){
	var indices = [ a, b, c, a, c, d ];
    for ( var i = 0; i < indices.length; ++i ) {
        points.push( base[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[colorIndex]);

    }
}

function rotateYZ( object, degrees){
    var angles = radians( degrees );
    var c = Math.cos( angles );
    var s = Math.sin( angles );
	

	for(var i = 0; i < object.length; i++){
		var x = -s * object[i][2] + c * object[i][1];
		var y = s * object[i][1] + c * object[i][2];
		object[i][1] = x; object[i][2] = y;
	}
	return object;
}

function rotateXY( object, degrees){
    var angles = radians( degrees );
    var c = Math.cos( angles );
    var s = Math.sin( angles );
	

	for(var i = 0; i < object.length; i++){
		var x = -s * object[i][2] + c * object[i][0];
		var y = s * object[i][0] + c * object[i][2];
		object[i][0] = x*zoom; object[i][2] = y*zoom;
	}
	return object;
}

function rotateXZ( object, degrees){
    var angles = radians( degrees );
    var c = Math.cos( angles );
    var s = Math.sin( angles );
	
	var originX = object[0][0]; var originY = object[0][1];
	for(var i = 0; i < object.length; i++){
		object[i][0] -= originX; object[i][1] -= originY;
		var x = -s * object[i][1] + c * object[i][0];
		var y = s * object[i][0] + c * object[i][1];
		object[i][0] = x + originX*zoom; object[i][1] = y + originY*zoom;
	}
	console.log(object[0][0]);
	return object;
}

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
	bufferObjects();

	setEye();
	at = vec3(0.0, -0.8, 0.8);
	up = vec3(0.0, 1.0, 0.0);
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);
	


    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	
	
	setLight();
	modelViewMatrix = lookAt(eye, at , up);
	projectionMatrix = perspective(fovy, aspect, near, far);
	normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

	gl.drawArrays( gl.TRIANGLES, 0, points.length );
	window.requestAnimFrame(render);
}
