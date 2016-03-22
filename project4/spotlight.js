//Alan Donham
//CS 435
//Project 3
//This program generates a 3d display of text that you can rotate


"use strict";

var canvas;
var gl;

var NumVertices  = 108;

var points = [];
var colors = [];
var textArray = [];
var program;

var wordIndex = 0;
var paragraph;
var frameCount = 1;
var xAxis = 0;
var yAxis = 0;
var zAxis = 0;
var rotateLeft = false;
var rotateRight = false;
var rotateUp = false;
var rotateDown = false;
var zoom;
var angle;



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
var theta = [ 4, 0, 0 ];

var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	//View 1
	calcWalls(0.17,.4,.7);
	zoom = 1.2;
	angle = 10;
	
	/*View 2
	calcWalls(-.2,.4,.8);
	zoom = 1.2;
	angle = 47;*/
	
	/*View 3
	calcWalls(-.2,.4,1.3);
	zoom = 1.4;
	angle = 88;
	*/
	
	/*View 4
	calcWalls(.23,.4,.8);
	zoom = 1.3;
	angle = 132;
	*/
	
	/*View 5
	calcWalls(-.3,.4,.7);
	zoom = 1.8;
	angle = -13;
	*/
	setWalls();
	//setDisplay();
	//setPost();

	setAllPoints();
	handleRotation();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	
    render();
}

function calcWalls(x,y,z){
		x = 0-x;
		z = 0 - z + 1;
		walls = [];
		walls.push([vec4( -0.75+x, -0.87+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4( -0.72+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4( -0.72+x, -0.87+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.87+y,  0.5+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( -0.72+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( -0.72+x, -0.87+y,  0.5+z, 1.0 )
					]);
		walls.push([vec4( 0.72+x, -0.87+y, -0.5+z, 1.0 ),
					vec4( 0.72+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4( 0.75+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4( 0.75+x, -0.87+y, -0.5+z, 1.0 ),
					vec4( 0.72+x, -0.87+y,  0.5+z, 1.0 ),
					vec4( 0.72+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( 0.75+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( 0.75+x, -0.87+y,  0.5+z, 1.0 )
					]);
		walls.push([vec4( -0.75+x, -0.87+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4(  0.75+x, -0.2+y,  -0.5+z, 1.0 ),
					vec4(  0.75+x, -0.87+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.87+y, -0.47+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,  -0.47+z, 1.0 ),
					vec4(  0.75+x, -0.2+y,  -0.47+z, 1.0 ),
					vec4(  0.75+x, -0.87+y, -0.47+z, 1.0 )
					]);
		walls.push([vec4( -0.75+x, -0.87+y, 0.47+z, 1.0 ),
					vec4( -0.75+x, -0.2+y,  0.47+z, 1.0 ),
					vec4( -0.25+x, -0.2+y,  0.47+z, 1.0 ),
					vec4( -0.25+x, -0.87+y, 0.47+z, 1.0 ),
					vec4( -0.75+x, -0.87+y, 0.5+z,  1.0 ),
					vec4( -0.75+x, -0.2+y,  0.5+z,  1.0 ),
					vec4( -0.25+x, -0.2+y,  0.5+z,  1.0 ),
					vec4( -0.25+x, -0.87+y, 0.5+z,  1.0 )
					]);
		walls.push([vec4( 0.25+x, -0.87+y, 0.47+z, 1.0 ),
					vec4( 0.25+x, -0.2+y,  0.47+z, 1.0 ),
					vec4( 0.75+x, -0.2+y,  0.47+z, 1.0 ),
					vec4( 0.75+x, -0.87+y, 0.47+z, 1.0 ),
					vec4( 0.25+x, -0.87+y, 0.5+z,  1.0 ),
					vec4( 0.25+x, -0.2+y,  0.5+z,  1.0 ),
					vec4( 0.75+x, -0.2+y,  0.5+z,  1.0 ),
					vec4( 0.75+x, -0.87+y, 0.5+z,  1.0 )
					]);
		walls.push([vec4( -0.25+x, -0.87+y, -0.015+z, 1.0 ),
					vec4( -0.25+x, -0.2+y,  -0.015+z, 1.0 ),
					vec4( 0.25+x, -0.2+y,   -0.015+z, 1.0 ),
					vec4( 0.25+x, -0.87+y,  -0.015+z, 1.0 ),
					vec4( -0.25+x, -0.87+y, 0.015+z,  1.0 ),
					vec4( -0.25+x, -0.2+y,  0.015+z,  1.0 ),
					vec4( 0.25+x, -0.2+y,   0.015+z,  1.0 ),
					vec4( 0.25+x, -0.87+y,  0.015+z,  1.0 )
					]);
		walls.push([vec4( -0.25+x, -0.87+y,  0.015+z, 1.0 ),
					vec4( -0.25+x, -0.2+y,   0.015+z, 1.0 ),
					vec4( -0.22+x, -0.2+y,   0.015+z, 1.0 ),
					vec4( -0.22+x, -0.87+y,  0.015+z, 1.0 ),
					vec4( -0.25+x, -0.87+y,  0.5+z, 1.0 ),
					vec4( -0.25+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( -0.22+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( -0.22+x, -0.87+y,  0.5+z, 1.0 )
					]);
		walls.push([vec4( 0.22+x, -0.87+y,  0.015+z, 1.0 ),
					vec4( 0.22+x, -0.2+y,   0.015+z, 1.0 ),
					vec4( 0.25+x, -0.2+y,   0.015+z, 1.0 ),
					vec4( 0.25+x, -0.87+y,  0.015+z, 1.0 ),
					vec4( 0.22+x, -0.87+y,  0.5+z, 1.0 ),
					vec4( 0.22+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( 0.25+x, -0.2+y,   0.5+z, 1.0 ),
					vec4( 0.25+x, -0.87+y,  0.5+z, 1.0 )
					]);
					
		//Floor
		walls.push([vec4( -0.75+x, -0.9+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.87+y,-0.5+z, 1.0 ),
					vec4( -0.22+x, -0.87+y,-0.5+z, 1.0 ),
					vec4( -0.22+x, -0.9+y, -0.5+z, 1.0 ),
					vec4( -0.75+x, -0.9+y,  0.5+z, 1.0 ),
					vec4( -0.75+x, -0.87+y, 0.5+z, 1.0 ),
					vec4( -0.22+x, -0.87+y, 0.5+z, 1.0 ),
					vec4( -0.22+x, -0.9+y,  0.5+z, 1.0 )
					]);
		walls.push([vec4( -0.22+x, -0.9+y,  -0.5+z, 1.0 ),
					vec4( -0.22+x, -0.87+y, -0.5+z, 1.0 ),
					vec4(  0.25+x, -0.87+y, -0.5+z, 1.0 ),
					vec4(  0.25+x, -0.9+y,  -0.5+z, 1.0 ),
					vec4( -0.22+x, -0.9+y, 0.015+z, 1.0 ),
					vec4( -0.22+x, -0.87+y,0.015+z, 1.0 ),
					vec4(  0.25+x, -0.87+y,0.015+z, 1.0 ),
					vec4(  0.25+x, -0.9+y, 0.015+z, 1.0 )
					]);
		walls.push([vec4( 0.22+x, -0.9+y, -0.5+z, 1.0 ),
					vec4( 0.22+x, -0.87+y,-0.5+z, 1.0 ),
					vec4( 0.75+x, -0.87+y,-0.5+z, 1.0 ),
					vec4( 0.75+x, -0.9+y, -0.5+z, 1.0 ),
					vec4( 0.22+x, -0.9+y,  0.5+z, 1.0 ),
					vec4( 0.22+x, -0.87+y, 0.5+z, 1.0 ),
					vec4( 0.75+x, -0.87+y, 0.5+z, 1.0 ),
					vec4( 0.75+x, -0.9+y,  0.5+z, 1.0 )
					]);
}

function handleRotation(){
	window.addEventListener("keydown", function(event){
	//console.log(event.keyCode);
	switch(event.keyCode){
		case 37:
			rotateLeft = true;
			break;
		case 38:
			rotateUp = true;
			break;
		case 39:
			rotateRight = true;
			break;
		case 40:
			rotateDown = true;
			break;
			
	}
		
    });
	
	window.addEventListener("keyup", function(event){
		//console.log(event.keyCode);
		switch(event.keyCode){
		case 37:
			rotateLeft = false;
			break;
		case 38:
			rotateUp = false;
			break;
		case 39:
			rotateRight = false;
			break;
		case 40:
			rotateDown = false;
			break;
		}
		
    });	
}

function drawObjects(){
	if(rotateLeft){	
		xAxis += 2;
		rotateXY(display,2); 
		rotateXY(post,2); 
		for(var i = 0; i < textArray.length;i++){rotateXY(textArray[i],2);}
		setAllPoints();}
	if(rotateRight){
		xAxis += -2;
		rotateXY(display,-2); 
		rotateXY(post,-2);
		for(var i = 0; i < textArray.length;i++){rotateXY(textArray[i],-2);}
		setAllPoints();}
	if(rotateUp){
		yAxis += -2;
		rotateYZ(display,-2);
		for(var i = 0; i < textArray.length;i++){rotateYZ(textArray[i],-2);}		
		setAllPoints();}
	if(rotateDown){	
		yAxis+= 2;
		rotateYZ(display, 2); 
		for(var i = 0; i < textArray.length;i++){rotateYZ(textArray[i],2);}
		setAllPoints();}

    gl.uniform3fv(thetaLoc, theta);
	gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function bufferObjects(){
     //
    //  Load shaders and initialize attribute buffers
    //
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

    thetaLoc = gl.getUniformLocation(program, "theta");
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
	//setDisplay();
	//setPost();
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
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
	thetaLoc = gl.getUniformLocation(program, "theta");
}

function setYColumn(col){
	setYColumnPoints( 1, 0, 3, 2, 1,col );
    setYColumnPoints( 2, 3, 7, 6, 0,col );
    setYColumnPoints( 3, 0, 4, 7, 0,col );
    setYColumnPoints( 6, 5, 1, 2, 0,col );
    setYColumnPoints( 4, 5, 6, 7, 0,col );
    setYColumnPoints( 5, 4, 0, 1, 0,col );
}

function setYColumnPoints(a,b,c,d,colorIndex,col){
	var indices = [ a, b, c, a, c, d ];
    for ( var i = 0; i < indices.length; ++i ) {
        points.push( col[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[colorIndex]);

    }
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
		wall = rotateXY(walls[i],angle);
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

function setPost(){
	setPostPoints( 1, 0, 3, 2, 3 );
    setPostPoints( 2, 3, 7, 6, 6 );
    setPostPoints( 3, 0, 4, 7, 3 );
    setPostPoints( 6, 5, 1, 2, 6 );
    setPostPoints( 4, 5, 6, 7, 3 );
    setPostPoints( 5, 4, 0, 1, 6 );
}

function setPostPoints(a,b,c,d,colorIndex){
	var indices = [ a, b, c, a, c, d ];
    for ( var i = 0; i < indices.length; ++i ) {
        points.push( post[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[colorIndex]);

    }
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

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	bufferObjects();
    drawObjects();
	frameCount += 1;
	requestAnimationFrame(render);
}
