//CS435
//Alan Donham
//Project 1
//This program will generate a Koch snowflake


//Set the points for the triangle below and set number of iterations
var point1 = vec2(-.5,0);
var point2 = vec2(0,.8655);
var point3 = vec2(.5,0);
var iterations = 2;
var gl;
var points = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
//////////Calling the snowflake function///////////
    kochSnowflake(point1,point2,iterations);
	kochSnowflake(point2,point3,iterations);
	kochSnowflake(point3,point1,iterations);
///////////////////////////////////////////////////

/////////////WebGL stuff here//////////////////////
	//
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

///////////Helper functions below///////////////////

/* 
	The functions below perform basic mathematical operations
	on the vectors that are the points of the triangle
*/
function divide(point,number){
	return vec2(point[0]/number, point[1]/number);
}
function multiply(point,number){
	return vec2(point[0]*number, point[1]*number);
}
function add(pointx,pointy){
	return vec2(pointx[0] + pointy[0], pointx[1] + pointy[1]);
}
function sub(pointx,pointy){
	return vec2(pointx[0] - pointy[0], pointx[1] - pointy[1]);
}
function lineLength(pointx,pointy){
	return Math.sqrt(	Math.pow(pointx[0]-pointy[0],2) + 
						Math.pow(pointx[1]-pointy[1],2));	
}
function getSlope(x,y){
	var rise = x[1] - y[1];
	var run = x[0] - y[0];
	return [rise,run];
}
function line( a, b)
{
    points.push(a, b);
}


////////This function will draw one curve of the snowflake////////////
function kochSnowflake(x, y, its)
{
	//We do not draw anything if iterations < 1
	if(its < 1){return null;}
	
	//Base Case when iterations == 1
	if(its ===1){
		line(x,y);
		return null;
	}
	
	//////////The line will be broken down into 4 new lines//////////

	//Get the point 1/3 of the way along the path of the line
	var oneThird = divide(add(multiply(x,2),y),3);
	
	//Get the point 2/3 of the way along the path of the line
	var twoThirds = divide(add(multiply(y,2),x),3);
	
	//Now we need to calculate the midpoint
	var midPoint = divide(add(x,y),2);
	
	//Calculate the new point now that we have the midpoint
	var P4 = divide(sub(midPoint,x), lineLength(midPoint,x));
	var P5 = vec2(P4[1], 0-P4[0]);
	var newPoint = add(multiply(P5,Math.sqrt(3)/6 * (0-lineLength(x,y))),midPoint);
	
	//Recursive calls to draw the other curves of the snowflake
	kochSnowflake(x,oneThird,its-1);
	kochSnowflake(twoThirds,y,its-1);
	kochSnowflake(oneThird,newPoint,its-1);
	kochSnowflake(newPoint,twoThirds,its-1);
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length );
}

	
	
	