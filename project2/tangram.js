//CS435
//Alan Donham
//Project 2
//This program will implement tangram


var gl;
var canvas;

var points = [];
var triangleOne = [];
var triangleTwo = [];
var triangleThree = [];
var triangleFour = [];
var triangleFive = [];
var square = [];
var trap = [];
var allShapes = [];
var size = 0;

var tranxLock;
var tranyLock;
var tranx = 0.0;
var trany = 0.0;
var redraw = false;
var program;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
	
	canvas.addEventListener("mousedown", function(event){
	  redraw = true;
    });

    canvas.addEventListener("mouseup", function(event){
      redraw = false;
    });
	
	canvas.addEventListener("mousemove", function(event){
        if(redraw) {
			tranx = 2*event.clientX/canvas.width-1;
			trany = 2*event.clientY/canvas.height-1;

      }

    } );
	//
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0  );

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
		

		
	//render(triangleOne);
	
	
    // Associate out shader variables with our data buffer


	tranxLock = gl.getUniformLocation(program,"tranx");
	tranyLock = gl.getUniformLocation(program,"trany");

	setUpTangram();
	renderAllShapes();
};

function render() {
    
		
	//gl.clear( gl.COLOR_BUFFER_BIT );
	
	//tran += .1;
	gl.uniform1f(tranxLock,tranx);
	gl.uniform1f(tranyLock,trany);
	
    gl.drawArrays( gl.LINES, 0, size );
	//window.requestAnimFrame(render);
}

function setUpTangram(){
	
	
	triangleOne.push(vec2(-.5,.5),vec2(0,0));
	triangleOne.push(vec2(-.5,-.5),vec2(0,0));
	triangleOne.push(vec2(-.5,-.5),vec2(-.5,.5));
	
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triangleOne), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	
	triangleTwo.push(vec2(-.5,.5),vec2(.5,.5));
	triangleTwo.push(vec2(.5,.5),vec2(0,0));
	triangleTwo.push(vec2(0,0),vec2(-.5,.5));	
	
    var bufferIdT2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdT2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triangleTwo), gl.STATIC_DRAW );
	
	var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	//size = 6;
	//render();
	
}

function inside(point,polygon){
	
	var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][0], yi = polygon[i][1];
        var xj = polygon[j][0], yj = polygon[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
}

function renderAllShapes(){
	
	for(var i = 0; i < triangleOne.length;i++){allShapes.push(triangleOne[i]);}
	for(var i = 0; i < triangleTwo.length;i++){allShapes.push(triangleTwo[i]);}
	
	console.log(inside([0,.5],triangleTwo));
	size = allShapes.length;
	
	var finalbuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, finalbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(allShapes), gl.STATIC_DRAW);
	
	var vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	render();
}
	
	
	