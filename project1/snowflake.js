//CS435
//Alan Donham
//Project 1
//This program will generate a Koch snowflake

var point1 = vec2(0,1);
var point2 = vec2(-1,0);
var point3 = vec2(1,0);
var iterations = 1;
var gl;
var points = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

//Code will go here for snowflake//////////////////



    kochSnowflake(point1,point2,1);
	kochSnowflake(point2,point3,iterations);
	kochSnowflake(point3,point1,1);
	//line(point1,point2);
	//line(point2,point3);
	//line(point3,point1);


///////////////////////////////////////////////////

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
function triangleHeight(pointx,pointy){
	return Math.sqrt(	Math.pow(pointx[0]-pointy[0],2) + 
						Math.pow(pointx[1]-pointy[1],2));	
}

function line( a, b)
{
    points.push(a, b);
}

//This function is designed to draw one curve of the snowflake	
function kochSnowflake(x, y, iterations )
{
	//We do not draw anything if iterations < 1
	if(iterations < 1){return null;}
	
	//Base Case when iterations == 1
	if(iterations ===1){
		line(x,y);
	}
	
	//The line will be broken down into 4 new lines

	//Get the point 1/3 of the way along the path of the line
	var P1 = divide(add(multiply(x,2),y),3);
	//Get the point 2/3 of the way along the path of the line
	var P2 = divide(add(multiply(y,2),x),3);
	//Now we need to calculate the additional triangle to add
	var midPoint = divide(add(x,y),2);
	
	var P4 = divide(sub(midPoint,x), triangleHeight(midPoint,x));
	var P5 = vec2(P4[1], 1-P4[0]);
	
	var P6 = add(multiply(P5,Math.sqrt(3)/6 * triangleHeight(y,x)),midPoint);
	
	
	kochSnowflake(x,P1,iterations-1);
	kochSnowflake(P2,y,iterations-1);
	kochSnowflake(P1,P6,iterations-1);
	kochSnowflake(P6,P2,iterations-1);
	
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_LOOP, 0, points.length );
}

	
	
	