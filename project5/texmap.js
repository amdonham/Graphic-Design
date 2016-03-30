//Alan Donham
//CS 435
//Project 4
//This program plays a gif in a TV scrren


"use strict";

var canvas;
var gl;

var NumVertices  = 108;
var tablepoints = [];
var wallpoints = [];
var TVPoints = [];
var tvscreenPoints = [];
var floorPoints = [];
var points = [];
var colors = [];

var wall;
var table;
var floor;
var walls;
var tv;
var tvscreen;

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
var at = vec3(0.0, -0.8, 0.8);
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
	
var display = [	vec4( -0.75, .5,  0.5, 1.0 ),
				vec4( -0.75, .9,  0.5, 1.0 ),
				vec4(  0.75, .9,  0.5, 1.0 ),
				vec4(  0.75, .5,  0.5, 1.0 ),
				vec4( -0.75, .5, -0.5, 1.0 ),
				vec4( -0.75, .9, -0.5, 1.0 ),
				vec4(  0.75, .9, -0.5, 1.0 ),
				vec4(  0.75, .5, -0.5, 1.0 )
				];
			
var base;
var axis = 0;
var wallTex;
var tableTex;
var tvTex;
var tvOff;
var floorTex;
var animation = [];
var currentAnimation = 0;
var on = false;
var play = true;
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
	drawTable();
	drawFloor();
	drawTV();
	drawTVScreen();
	calcWalls(0,0,.3);
	setAllPoints();
	
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
	wallTex = document.getElementById("wallTexture");
	tableTex = document.getElementById("tableTexture");
	tvTex = document.getElementById("tvTexture");
	tvOff = document.getElementById("tvOff");
	floorTex = document.getElementById("floor");
	//Get all animation frames
	for(var i = 1; i <= 41; ++i){
		var fname = document.getElementById("anim" + i.toString());
		animation.push(fname);
		//console.log(fname);
	}
	document.getElementById("power").onclick = function(){on = !on;currentAnimation = 0;};
	document.getElementById("playpause").onclick = function(){play = !play};
	document.getElementById("rewind").onclick = function(){
		if(!play){
			if(currentAnimation == 0){currentAnimation = 40;}
			else{currentAnimation--;}
		}
	};
	document.getElementById("forward").onclick = function(){
		if(!play){
			if(currentAnimation == 40){currentAnimation = 0;}
			else{currentAnimation++;}
		}
	};
    render();
}


function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
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

function setAllPoints(){
	points = [];
	colors = [];
	texCoordsArray = [];
	setWalls();
	setTable();
	setTV();
	setFloor();
	setTVScreen();

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

function setTable(){
	setTablePoints( 1, 0, 3, 2);
    setTablePoints( 2, 3, 7, 6);
    setTablePoints( 3, 0, 4, 7);
    setTablePoints( 6, 5, 1, 2);
    setTablePoints( 4, 5, 6, 7);
    setTablePoints( 5, 4, 0, 1);
}

function setFloor(){
	setFloorPoints( 1, 0, 3, 2);
    setFloorPoints( 2, 3, 7, 6);
    setFloorPoints( 3, 0, 4, 7);
    setFloorPoints( 6, 5, 1, 2);
    setFloorPoints( 4, 5, 6, 7);
    setFloorPoints( 5, 4, 0, 1);
}

function setTV(){
	setTVPoints( 1, 0, 3, 2);
    setTVPoints( 2, 3, 7, 6);
    setTVPoints( 3, 0, 4, 7);
    setTVPoints( 6, 5, 1, 2);
    setTVPoints( 4, 5, 6, 7);
    setTVPoints( 5, 4, 0, 1);
}

function setTVScreen(){
	setTVScreenPoints( 1, 0, 3, 2);
    setTVScreenPoints( 2, 3, 7, 6);
    setTVScreenPoints( 3, 0, 4, 7);
    setTVScreenPoints( 6, 5, 1, 2);
    setTVScreenPoints( 4, 5, 6, 7);
    setTVScreenPoints( 5, 4, 0, 1);
}

function setWall(){
	setWallPoints( 1, 0, 3, 2);
    setWallPoints( 2, 3, 7, 6);
    setWallPoints( 3, 0, 4, 7);
    setWallPoints( 6, 5, 1, 2);
    setWallPoints( 4, 5, 6, 7);
    setWallPoints( 5, 4, 0, 1);
}

function drawTable(){
	table =([	vec4( -0.45,  -0.9,   0.5, 1.0 ),
				vec4( -0.45,  -0.65,  0.5, 1.0 ),
				vec4(  0.45,  -0.65,  0.5, 1.0 ),
				vec4(  0.45,  -0.9,   0.5, 1.0 ),
				vec4( -0.45,  -0.9,   0.75, 1.0 ),
				vec4( -0.45,  -0.65,  0.75, 1.0 ),
				vec4(  0.45,  -0.65,  0.75, 1.0 ),
				vec4(  0.45,  -0.9,   0.75, 1.0 )
				]);
}

function drawTV(){
	tv =([		vec4( -0.25,  -0.65,   0.5, 1.0 ),
				vec4( -0.25,  -0.15,  0.5, 1.0 ),
				vec4(  0.25,  -0.15,  0.5, 1.0 ),
				vec4(  0.25,  -0.65,   0.5, 1.0 ),
				vec4( -0.25,  -0.65,   0.7, 1.0 ),
				vec4( -0.25,  -0.15,  0.7, 1.0 ),
				vec4(  0.25,  -0.15,  0.7, 1.0 ),
				vec4(  0.25,  -0.65,   0.7, 1.0 )
				]);
}

function drawFloor(){
	floor =([		vec4( -0.75, -0.9, -0.5, 1.0 ),
					vec4( -0.75, -0.89,-0.5, 1.0 ),
					vec4(  0.75, -0.89,-0.5, 1.0 ),
					vec4(  0.75, -0.9, -0.5, 1.0 ),
					vec4( -0.75, -0.9,  1.5, 1.0 ),
					vec4( -0.75, -0.89, 1.5, 1.0 ),
					vec4(  0.75, -0.89, 1.5, 1.0 ),
					vec4(  0.75, -0.9,  1.5, 1.0 )
					]);
}

function drawTVScreen(){
	tvscreen =([vec4( -0.25,  -0.65,   0.7, 1.0 ),
				vec4( -0.25,  -0.15,  0.7, 1.0 ),
				vec4(  0.25,  -0.15,  0.7, 1.0 ),
				vec4(  0.25,  -0.65,   0.7, 1.0 ),
				vec4( -0.25,  -0.65,   0.71, 1.0 ),
				vec4( -0.25,  -0.15,  0.71, 1.0 ),
				vec4(  0.25,  -0.15,  0.71, 1.0 ),
				vec4(  0.25,  -0.65,   0.71, 1.0 )
				]);
}

function setTablePoints(a,b,c,d){
     tablepoints.push(table[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     tablepoints.push(table[b]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[1]);

     tablepoints.push(table[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     tablepoints.push(table[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     tablepoints.push(table[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     tablepoints.push(table[d]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[3]);
}

function setTVPoints(a,b,c,d){
     TVPoints.push(tv[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     TVPoints.push(tv[b]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[1]);

     TVPoints.push(tv[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     TVPoints.push(tv[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     TVPoints.push(tv[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     TVPoints.push(tv[d]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[3]);
}

function setFloorPoints(a,b,c,d){
     floorPoints.push(floor[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     floorPoints.push(floor[b]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[1]);

     floorPoints.push(floor[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     floorPoints.push(floor[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     floorPoints.push(floor[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     floorPoints.push(floor[d]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[3]);
}

function setTVScreenPoints(a,b,c,d){
     tvscreenPoints.push(tvscreen[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     tvscreenPoints.push(tvscreen[b]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[1]);

     tvscreenPoints.push(tvscreen[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     tvscreenPoints.push(tvscreen[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     tvscreenPoints.push(tvscreen[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     tvscreenPoints.push(tvscreen[d]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[3]);
}

function setWallPoints(a,b,c,d){
     wallpoints.push(wall[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     wallpoints.push(wall[b]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[1]);

     wallpoints.push(wall[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     wallpoints.push(wall[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     wallpoints.push(wall[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     wallpoints.push(wall[d]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[3]);
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
    if(play)
	{	
		frameCount++;
		if(frameCount%5 == 0){currentAnimation++;}
	}

	if(currentAnimation == 41){
		currentAnimation = 0;
	}
	eye = vec3(0.0,0.4,2.5);
	at = vec3(0.0, 0.0, 1.5);
	up = vec3(0.0, 1.0, 0.0);
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	
	points = wallpoints;
	configureTexture( wallTex );
	bufferObjects();
	gl.drawArrays( gl.TRIANGLES, 0, points.length );
	
	points = floorPoints;
	configureTexture( floorTex );
	bufferObjects();
	gl.drawArrays( gl.TRIANGLES, 0, points.length );

	points = tablepoints;
	configureTexture( tableTex );
	bufferObjects();
	gl.drawArrays( gl.TRIANGLES, 0, points.length);
	
	points = TVPoints;
	configureTexture( tvTex );
	bufferObjects();
	gl.drawArrays( gl.TRIANGLES, 0, points.length );
	
	points = tvscreenPoints;
	if(on){configureTexture( animation[currentAnimation] );}
	if(!on){configureTexture(tvOff);}
	bufferObjects();
	gl.drawArrays( gl.TRIANGLES, 0, points.length );
	
	
	window.requestAnimFrame(render);
}
