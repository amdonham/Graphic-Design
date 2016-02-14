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
var redrawT1 = false;
var redrawT2 = false;
var program;
var prevx = 0;
var prevy = 0;

var rotate = false;
var rotateT1 = false;
var thetaT1 = 0.0;
var rotateT2 = false;
var thetaT2 = 0.0;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
	
	canvas.addEventListener("mousedown", function(event){
					
	    //console.log(inside([2*event.clientX/canvas.width - 1, 1 - 2*event.clientY/canvas.height],triangleTwo));
	    //console.log([2*event.clientX/canvas.width - 1, 1 - 2*event.clientY/canvas.height]);
	    if (inside([2*event.clientX/canvas.width - 1,1 - 2*event.clientY/canvas.height],triangleOne)){
	    	redrawT1 = true;
			if(rotate){rotateT1 = true;}
	    }
	    if (inside([2*event.clientX/canvas.width - 1,1 - 2*event.clientY/canvas.height],triangleTwo)){
		    redrawT2 = true;
			if(rotate){rotateT2 = true;}
	    }
		if(rotateT1){
			var s = Math.sin( .05 );
			var c = Math.cos( .05 );
			for(var i = 1; i < triangleOne.length;i++){
				var originx = triangleOne[0][0]; var originy = triangleOne[0][1];
				triangleOne[i][0]-=originx;triangleOne[i][1]-=originy;
				var x = -s * triangleOne[i][1] + c * triangleOne[i][0];
				var y = s * triangleOne[i][0] + c * triangleOne[i][1];
				triangleOne[i][0] = x + originx; triangleOne[i][1] = y + originy;
			}
			rotateT1 = false;
		}
		if(rotateT2){
			var s = Math.sin( .05 );
			var c = Math.cos( .05 );
			for(var i = 1; i < triangleTwo.length;i++){
				var originx = triangleTwo[0][0]; var originy = triangleTwo[0][1];
				triangleTwo[i][0]-=originx;triangleTwo[i][1]-=originy;
				var x = -s * triangleTwo[i][1] + c * triangleTwo[i][0];
				var y = s * triangleTwo[i][0] + c * triangleTwo[i][1];
				triangleTwo[i][0] = x + originx; triangleTwo[i][1] = y + originy;
			}
			rotateT2 = false;
		}
	  //console.log(2*event.clientX/canvas.width - 1);
    });

    canvas.addEventListener("mouseup", function(event){
      redrawT1 = false;
	  redrawT2 = false;
    });
	
	canvas.addEventListener("mousemove", function(event){
		tranx = (2*event.clientX/canvas.width-1)- prevx;
		trany = (1 - 2*event.clientY/canvas.height) - prevy;
		prevx = 2*event.clientX/canvas.width-1;
		prevy = 1 - 2*event.clientY/canvas.height;
		if(redrawT1) {
			//console.log(inside([0,.5],triangleTwo));		
			for(var i = 0; i < triangleOne.length;i++){triangleOne[i][0] += tranx; triangleOne[i][1] += trany;}
		}
		if(redrawT2) {
			//console.log(inside([0,.5],triangleTwo));		
			for(var i = 0; i < triangleTwo.length;i++){triangleTwo[i][0] += tranx; triangleTwo[i][1] += trany;}
		}
		

    } );
	window.addEventListener("keydown", function(event){
		//console.log(event.keyCode);
		switch(event.keyCode){
			case 17:
				
				rotate = true;
				break;
		}
		
    });
	window.addEventListener("keyup", function(event){
		//console.log(event.keyCode);
		switch(event.keyCode){
			case 17:
				rotate = false;
				break;
		}
		
    });
	
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
	render();
	//renderAllShapes();
};

function render() {
    
		
	//gl.clear( gl.COLOR_BUFFER_BIT );
	
	//tran += .1;
	gl.uniform1f(tranxLock,tranx);
	gl.uniform1f(tranyLock,trany);
	renderAllShapes();
    gl.drawArrays( gl.LINES, 0, size );
	window.requestAnimFrame(render);
}

function setUpTangram(){
	
	
	triangleOne.push(vec2(-.5,.5),vec2(0,0));
	triangleOne.push(vec2(-.5,-.5),vec2(0,0));
	triangleOne.push(vec2(-.5,-.5),vec2(-.5,.5));
	
	triangleTwo.push(vec2(-.5,.5),vec2(.5,.5));
	triangleTwo.push(vec2(.5,.5),vec2(0,0));
	triangleTwo.push(vec2(0,0),vec2(-.5,.5));	

	
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
	
	//console.log(inside([0,.5],triangleTwo));
	size = allShapes.length;
	
	var finalbuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, finalbuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(allShapes), gl.STATIC_DRAW);
	
	var vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	//render();
}
	
	
	