//Alan Donham
//CS435
//Project 7
//This project shows a view from orbiting Earth

"use strict";

var canvas;
var gl;
var program;

var numTimesToSubdivide = 4;

var index = 0;
var colors = [];
var pointsArray = [];
var normalsArray = [];
var planetArray = [];
var planetNorms = [];

var star;
var stars = [];
var starPoints = [];

var vertexColors = [[ 0.0, 0.0, 0.0, 1.0 ],  // black
					[ 1.0, 0.0, 0.0, 1.0 ],  // red
					[ 1.0, 1.0, 0.0, 1.0 ],  // yellow
					[ 0.0, 1.0, 0.0, 1.0 ],  // green
					[ 0.0, 0.0, 1.0, 1.0 ],  // blue
					[ 1.0, 0.0, 1.0, 1.0 ],  // magenta
					[ 0.0, 1.0, 1.0, 1.0 ],  // cyan
					[ 1.0, 1.0, 1.0, 1.0 ]   // white
					];
var earth;
var starTex;
var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(1.0, 0.3, 1.0, 0.0 );
var lightAmbient = vec4(0.0, 0.0, 0.0, 1.0 );
var lightDiffuse = vec4( 0.65, 0.65, 0.65, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 60.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eyeLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

///////////////Set up textures///////////////
var texSize = 512;
var texCoordsArray = [];
var texture;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
/////////////////////////////////////////////

function triangle(a, b, c) {

     // normals are vectors

     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);


     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 ); 
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
	if(planetArray.length == 0){planetArray.push(pointsArray);pointsArray = [];planetNorms.push(normalsArray);normalsArray = [];}
	else{starArray.push(pointsArray);pointsArray = [];starNorms.push(normalsArray);normalsArray = [];}
}
function bufferThingsPlanet(){

	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
}
function bufferThingsStars(){
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	
	var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

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

function setStars(){
	for(var i = 0; i < 100; ++i){
		var offsetx = Math.random();
		offsetx = offsetx;
		offsetx = offsetx * Math.random();
		offsetx = offsetx * 10;
		var offsety = Math.random();
		offsety = offsety;
		offsety = offsety * Math.random();
		offsety = offsety * 10;
		var offsetz = Math.random();
		offsetz = offsetz;
		offsetz = offsetz * Math.random();
		offsetz = offsetz * 10;
		
		stars.push([vec4( -3+offsetx, -3+offsety,  -2.97+offsetz, 1.0 ),
					vec4( -3+offsetx, -2.97+offsety,   -2.97+offsetz, 1.0 ),
					vec4(  -2.97+offsetx,  -2.97+offsety,   -2.97+offsetz, 1.0 ),
					vec4(  -2.97+offsetx, -3+offsety,   -2.97+offsetz, 1.0 ),
					vec4( -3+offsetx, -3+offsety, -3+offsetz, 1.0 ),
					vec4( -3+offsetx, -2.97+offsety,  -3+offsetz, 1.0 ),
					vec4(-2.97+offsetx,  -2.97+offsety,  -3+offsetz, 1.0 ),
					vec4( -2.97+offsetx, -3+offsety,  -3+offsetz, 1.0 )
					]);
	}
	
	for(var i = 0; i < stars.length;++i){
		star = stars[i];
		setStar();
	}
}
function setStar(){
	setStarPoints( 1, 0, 3, 2);
    setStarPoints( 2, 3, 7, 6);
    setStarPoints( 3, 0, 4, 7);
    setStarPoints( 6, 5, 1, 2);
    setStarPoints( 4, 5, 6, 7);
    setStarPoints( 5, 4, 0, 1);
}

function setStarPoints(a,b,c,d){
     starPoints.push(star[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     starPoints.push(star[b]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[1]);

     starPoints.push(star[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     starPoints.push(star[a]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     starPoints.push(star[c]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     starPoints.push(star[d]);
     colors.push(vertexColors[1]);
     texCoordsArray.push(texCoord[3]);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	setStars();
	console.log(starPoints[0]);
	console.log(starPoints[1]);
	console.log(starPoints[2]);
	console.log(starPoints[3]);
	console.log(starPoints[4]);
	console.log(starPoints[5]);
	
	earth = document.getElementById("earth");
	starTex = document.getElementById("stars");
	
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

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



function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	theta += .002;
	
	//eye = vec3(0,0,2);
    eye = vec3(Math.sin(theta)*Math.cos(phi),
        radius*Math.cos(theta)*Math.sin(phi), Math.cos(theta));

    gl.uniform3fv(gl.getUniformLocation(program,
       "eyePosition"), flatten(eye));


    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

	pointsArray = planetArray[0];
	normalsArray = planetNorms[0];
	configureTexture( earth );
	bufferThingsPlanet();
    for( var i=0; i<pointsArray.length; i+=3){
		gl.drawArrays( gl.TRIANGLES, i, 3 );
	}	
	
	pointsArray = starPoints;
	configureTexture( starTex );
	bufferThingsStars();
	gl.drawArrays( gl.TRIANGLES, 0, starPoints.length );

    window.requestAnimFrame(render);
}