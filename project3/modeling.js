"use strict";

var canvas;
var gl;

var NumVertices  = 108;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var rotateLeft = false;
var rotateRight = false;
var rotateUp = false;
var rotateDown = false;

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

var post = [	vec4( -0.05, -0.85,  0.05, 1.0 ),
				vec4( -0.05, .5,     0.05, 1.0 ),
				vec4(  0.05, .5,     0.05, 1.0 ),
				vec4(  0.05, -0.85,  0.05, 1.0 ),
				vec4( -0.05, -0.85, -0.05, 1.0 ),
				vec4( -0.05, .5,    -0.05, 1.0 ),
				vec4(  0.05, .5,    -0.05, 1.0 ),
				vec4(  0.05, -0.85, -0.05, 1.0 )
				];
			
var base = [	vec4( -0.75, -0.9,  0.5, 1.0 ),
				vec4( -0.75, -0.85,  0.5, 1.0 ),
				vec4(  0.75, -0.85,  0.5, 1.0 ),
				vec4(  0.75, -0.9,  0.5, 1.0 ),
				vec4( -0.75, -0.9, -0.5, 1.0 ),
				vec4( -0.75, -0.85, -0.5, 1.0 ),
				vec4(  0.75, -0.85, -0.5, 1.0 ),
				vec4(  0.75, -0.9, -0.5, 1.0 )
				];

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	setBase();
	setDisplay();
	setPost();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
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

    //event listeners for buttons

    /*document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };*/
    render();
}
function setAllPoints(){
	points = [];
	setBase();
	setDisplay();
	setPost();
	
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
function setBase(){
	setBasePoints( 1, 0, 3, 2, 1 );
    setBasePoints( 2, 3, 7, 6, 1 );
    setBasePoints( 3, 0, 4, 7, 1 );
    setBasePoints( 6, 5, 1, 2, 4 );
    setBasePoints( 4, 5, 6, 7, 1 );
    setBasePoints( 5, 4, 0, 1, 0 );
	
}
function setDisplay(){
	setDisplayPoints( 1, 0, 3, 2, 1 );
    setDisplayPoints( 2, 3, 7, 6, 4 );
    setDisplayPoints( 3, 0, 4, 7, 1 );
    setDisplayPoints( 6, 5, 1, 2, 5 );
    setDisplayPoints( 4, 5, 6, 7, 1 );
    setDisplayPoints( 5, 4, 0, 1, 4 );
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

function setDisplayPoints(a,b,c,d,colorIndex){
	var indices = [ a, b, c, a, c, d ];
    for ( var i = 0; i < indices.length; ++i ) {
        points.push( display[indices[i]] );
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
}

function rotateXY( object, degrees){
    var angles = radians( degrees );
    var c = Math.cos( angles );
    var s = Math.sin( angles );
	

	for(var i = 0; i < object.length; i++){
		var x = -s * object[i][2] + c * object[i][0];
		var y = s * object[i][0] + c * object[i][2];
		object[i][0] = x; object[i][2] = y;
	}
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if(rotateLeft){	rotateXY(display,2); rotateXY(post,2); setAllPoints();}
	if(rotateRight){rotateXY(display,-2); rotateXY(post,-2); setAllPoints();}
	if(rotateUp){rotateYZ(display,-2); setAllPoints();}
	if(rotateDown){	rotateYZ(display, 2); setAllPoints();}
    //theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
