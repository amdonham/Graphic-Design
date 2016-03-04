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
var theta = [ -1, 7, 0 ];

var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	setBase();
	setDisplay();
	setPost();
	paragraph = document.getElementById("paragraph").innerHTML;
	paragraph = paragraph.split(" ");
	
	readPar();
	setAllPoints();
	handleRotation();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	
    render();
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

function readPar(){
	if(frameCount == 120){
		textArray = [];
		if(paragraph.length > wordIndex){
			drawText(paragraph[wordIndex]);
			for(var i = 0; i < textArray.length;i++){rotateXY(textArray[i],xAxis);}
			for(var i = 0; i < textArray.length;i++){rotateYZ(textArray[i],yAxis);}
			setAllPoints();
			wordIndex += 1;
			frameCount = 0;
		}
	}
}

function drawText(word){
	word = word.split("");
	var position = -.72;
	for(var i = 0; i < word.length; i++){
		addLetter(word[i],position);
		position += .12
	}
	//addLetter("k",position);
		
}

function addLetter(letter,position){
	var distance = .06;
	if(letter == 'a' || letter == "A"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addXColumn(position, .65);
		addXColumn(position, .77);
	}
	if(letter == 'b' || letter == "B"){
		addYColumn(position+.0155,.55);
		addYColumn(position+.0155,.67);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addXColumn(position, .54);
		addXColumn(position+.01, .655);
		addXColumn(position, .77);
	}
	if(letter == 'c' || letter == "C"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addXColumn(position, .54);
		addXColumn(position, .77);
	}
	if(letter == 'd' || letter == "D"){
		addYColumn(position+.016,.55);
		addYColumn(position+.016,.66);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.66);
		addXColumn(position, .535);
		addXColumn(position, .765);
	}
	if(letter == 'e' || letter == "E"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addXColumn(position, .54);
		addXColumn(position, .655);
		addXColumn(position, .77);
	}
	if(letter == 'f' || letter == "F"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addXColumn(position, .655);
		addXColumn(position, .77);
	}
	if(letter == 'g' || letter == "G"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance +.007,.55);
		addXColumn(position, .54);
		addXColumn(position+.021, .655);
		addXColumn(position+.01, .77);
	}
	if(letter == 'h' || letter == "H"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addXColumn(position, .65);
	}
	if(letter == 'i' || letter == "I"){
		addYColumn(position + distance/2,.55);
		addYColumn(position + distance/2,.67);
		addXColumn(position, .54);
		addXColumn(position, .77);
	}
	if(letter == 'j' || letter == "J"){
		addYColumn(position,.55);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addXColumn(position, .54);
	}
	if(letter == 'k' || letter == "K"){
		addYColumn(position,.54);
		addYColumn(position,.68);
		addYColumnRotate(position+.02,.675,-25);
		addYColumnRotate(position+.03,.645,-155);
	}
	if(letter == 'l' || letter == "L"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addXColumn(position, .54);
	}
	if(letter == 'm' || letter == "M"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addYColumnRotate(position+distance/2,.645,10);
		addYColumnRotate(position+distance/2,.645,-10);
	}	
	if(letter == 'n' || letter == "N"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addYColumnRotate(position+distance/2,.655,10);
		addYColumnRotate(position+distance/2 + .02,.665,-170);
	}
	if(letter == 'o' || letter == "O"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addXColumn(position, .54);
		addXColumn(position, .77);
	}
	if(letter == 'p' || letter == "P"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.67);
		addXColumn(position, .77);
		addXColumn(position, .65);
	}
	if(letter == 'q' || letter == "Q"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addXColumn(position, .54);
		addXColumn(position, .77);
		addYColumnRotate(position+distance/2 + .01,.635,-160);
	}
	if(letter == 'r' || letter == "R"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.67);
		addXColumn(position, .77);
		addXColumn(position, .65);
		addYColumnRotate(position+distance/2 + .01,.655,-160);
	}
	if(letter == 's' || letter == "S"){
		addYColumn(position,.67);
		addYColumn(position + distance,.55);
		addXColumn(position, .55);
		addXColumn(position, .77);
		addXColumn(position, .65);
	}
	if(letter == 't' || letter == "T"){
		addYColumn(position + distance/2,.55);
		addYColumn(position + distance/2,.67);
		addXColumn(position-.03, .77);
		addXColumn(position+.03, .77);
	}
	if(letter == 'u' || letter == "U"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addXColumn(position, .55);
	}
	if(letter == 'v' || letter == "V"){
		addYColumnRotate(position+.01,.66,-170);
		addYColumnRotate(position-.01,.77,-170);
		addYColumnRotate(position+distance -.01,.66,170);
		addYColumnRotate(position+distance+.01,.77,170);
	}
	if(letter == 'w' || letter == "W"){
		addYColumn(position,.55);
		addYColumn(position,.67);
		addYColumn(position + distance,.55);
		addYColumn(position + distance,.67);
		addYColumnRotate(position+distance/2+.01,.66,170);
		addYColumnRotate(position+distance-.015,.66,-170);
	}
	if(letter == 'x' || letter == "X"){
		addYColumnRotate(position+distance -.02,.66,-165);
		addYColumnRotate(position+.01,.77,-165);
		addYColumnRotate(position+.04,.66,165);
		addYColumnRotate(position+distance+.01,.77,165);
	}
	if(letter == 'y' || letter == "Y"){
		addYColumnRotate(position+.01,.77,-165);
		addYColumnRotate(position+.04,.66,165);
		addYColumnRotate(position+distance+.01,.77,165);
	}
	if(letter == 'z' || letter == "Z"){
		addXColumn(position, .55);
		addXColumn(position, .76);
		addXColumn(position, .55);
		addXColumn(position, .76);
		addYColumnRotate(position+distance/2,.645,-10);
		addYColumnRotate(position+distance/2 + .015,.675,-190);
	}
}

function setAllPoints(){
	points = [];
	colors = [];
	setBase();
	setDisplay();
	setPost();
	setText();
	
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

function setText(){
	for(var i = 0; i < textArray.length;i++){
		setYColumn(textArray[i]);
	}
	
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
    setBasePoints( 2, 3, 7, 6, 1 );
    setBasePoints( 3, 0, 4, 7, 1 );
    setBasePoints( 6, 5, 1, 2, 4 );
    setBasePoints( 4, 5, 6, 7, 4 );
    setBasePoints( 5, 4, 0, 1, 4 );
	
}

function setDisplay(){
	setDisplayPoints( 1, 0, 3, 2, 6 );
    setDisplayPoints( 2, 3, 7, 6, 4 );
    setDisplayPoints( 3, 0, 4, 7, 1 );
    setDisplayPoints( 6, 5, 1, 2, 5 );
    setDisplayPoints( 4, 5, 6, 7, 3 );
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
	return object;
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
		object[i][0] = x + originX; object[i][1] = y + originY;
	}
	return object;
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	bufferObjects();
    drawObjects();
	readPar();
	frameCount += 1;
	requestAnimationFrame(render);
}
