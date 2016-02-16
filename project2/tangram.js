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
var program;
var prevx = 0;
var prevy = 0;

var redrawT1 = false;
var redrawT2 = false;
var redrawT3 = false;
var redrawT4 = false;
var redrawT5 = false;
var redrawS = false;
var redrawTrap = false;

var rotate = false;
var rotateT1 = false;
var rotateT2 = false;
var rotateT3 = false;
var rotateT4 = false;
var rotateT5 = false;
var rotateS = false;
var rotateTrap = false;
var theta = 0.0;
var shift = false;


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
		if (inside([2*event.clientX/canvas.width - 1,1 - 2*event.clientY/canvas.height],triangleThree)){
		    redrawT3 = true;
			if(rotate){rotateT3 = true;}
	    }
		if (inside([2*event.clientX/canvas.width - 1,1 - 2*event.clientY/canvas.height],triangleFour)){
		    redrawT4 = true;
			if(rotate){rotateT4 = true;}
	    }
		if (inside([2*event.clientX/canvas.width - 1,1 - 2*event.clientY/canvas.height],triangleFive)){
		    redrawT5 = true;
			if(rotate){rotateT5 = true;}
	    }
		if (inside([2*event.clientX/canvas.width - 1,1 - 2*event.clientY/canvas.height],square)){
		    redrawS = true;
			if(rotate){rotateS = true;}
	    }
		if (inside([2*event.clientX/canvas.width - 1,1 - 2*event.clientY/canvas.height],trap)){
		    redrawTrap = true;
			if(rotate){rotateTrap = true;}
	    }
		
		if(rotateT1){
			var s = Math.sin( theta );
			var c = Math.cos( theta );
			for(var i = 1; i < triangleOne.length;i++){
				var originx = triangleOne[0][0]; var originy = triangleOne[0][1];
				triangleOne[i][0]-=originx;triangleOne[i][1]-=originy;
				if(shift){
					var x = -s * triangleOne[i][1] + c * triangleOne[i][0];
					var y = s * triangleOne[i][0] + c * triangleOne[i][1];					
				}
				else{
					var x = s * triangleOne[i][1] + c * triangleOne[i][0];
					var y = -s * triangleOne[i][0] + c * triangleOne[i][1];
				}
				triangleOne[i][0] = x + originx; triangleOne[i][1] = y + originy;
			}
			rotateT1 = false;
		}
		
		if(rotateT2){
			var s = Math.sin( theta );
			var c = Math.cos( theta );
			for(var i = 1; i < triangleTwo.length;i++){
				var originx = triangleTwo[0][0]; var originy = triangleTwo[0][1];
				triangleTwo[i][0]-=originx;triangleTwo[i][1]-=originy;
				if(shift){
					var x = -s * triangleTwo[i][1] + c * triangleTwo[i][0];
					var y = s * triangleTwo[i][0] + c * triangleTwo[i][1];					
				}
				else{
					var x = s * triangleTwo[i][1] + c * triangleTwo[i][0];
					var y = -s * triangleTwo[i][0] + c * triangleTwo[i][1];
				}
				triangleTwo[i][0] = x + originx; triangleTwo[i][1] = y + originy;
			}
			rotateT2 = false;
			
		}	
		
		if(rotateT3){
			var s = Math.sin( theta );
			var c = Math.cos( theta );
			for(var i = 1; i < triangleThree.length;i++){
				var originx = triangleThree[0][0]; var originy = triangleThree[0][1];
				triangleThree[i][0]-=originx;triangleThree[i][1]-=originy;
				if(shift){
					var x = -s * triangleThree[i][1] + c * triangleThree[i][0];
					var y = s * triangleThree[i][0] + c * triangleThree[i][1];					
				}
				else{
					var x = s * triangleThree[i][1] + c * triangleThree[i][0];
					var y = -s * triangleThree[i][0] + c * triangleThree[i][1];
				}
				triangleThree[i][0] = x + originx; triangleThree[i][1] = y + originy;
			}
			rotateT3 = false;
			
		}

		if(rotateT4){
			var s = Math.sin( theta );
			var c = Math.cos( theta );
			for(var i = 1; i < triangleFour.length;i++){
				var originx = triangleFour[0][0]; var originy = triangleFour[0][1];
				triangleFour[i][0]-=originx;triangleFour[i][1]-=originy;
				if(shift){
					var x = -s * triangleFour[i][1] + c * triangleFour[i][0];
					var y = s * triangleFour[i][0] + c * triangleFour[i][1];					
				}
				else{
					var x = s * triangleFour[i][1] + c * triangleFour[i][0];
					var y = -s * triangleFour[i][0] + c * triangleFour[i][1];
				}
				triangleFour[i][0] = x + originx; triangleFour[i][1] = y + originy;
			}
			rotateT4 = false;
			
		}
		if(rotateT5){
			var s = Math.sin( theta );
			var c = Math.cos( theta );
			for(var i = 1; i < triangleFive.length;i++){
				var originx = triangleFive[0][0]; var originy = triangleFive[0][1];
				triangleFive[i][0]-=originx;triangleFive[i][1]-=originy;
				if(shift){
					var x = -s * triangleFive[i][1] + c * triangleFive[i][0];
					var y = s * triangleFive[i][0] + c * triangleFive[i][1];					
				}
				else{
					var x = s * triangleFive[i][1] + c * triangleFive[i][0];
					var y = -s * triangleFive[i][0] + c * triangleFive[i][1];
				}
				triangleFive[i][0] = x + originx; triangleFive[i][1] = y + originy;
			}
			rotateT5 = false;
			
		}
		if(rotateS){
			var s = Math.sin( theta );
			var c = Math.cos( theta );
			for(var i = 1; i < square.length;i++){
				var originx = square[0][0]; var originy = square[0][1];
				square[i][0]-=originx;square[i][1]-=originy;
				if(shift){
					var x = -s * square[i][1] + c * square[i][0];
					var y = s * square[i][0] + c * square[i][1];					
				}
				else{
					var x = s * square[i][1] + c * square[i][0];
					var y = -s * square[i][0] + c * square[i][1];
				}
				square[i][0] = x + originx; square[i][1] = y + originy;
			}
			rotateS = false;
			
		}
		if(rotateTrap){
			var s = Math.sin( theta );
			var c = Math.cos( theta );
			for(var i = 1; i < trap.length;i++){
				var originx = trap[0][0]; var originy = trap[0][1];
				trap[i][0]-=originx;trap[i][1]-=originy;
				if(shift){
					var x = -s * trap[i][1] + c * trap[i][0];
					var y = s * trap[i][0] + c * trap[i][1];					
				}
				else{
					var x = s * trap[i][1] + c * trap[i][0];
					var y = -s * trap[i][0] + c * trap[i][1];
				}
				trap[i][0] = x + originx; trap[i][1] = y + originy;
			}
			rotateTrap = false;
			
		}
    });

    canvas.addEventListener("mouseup", function(event){
      redrawT1 = false;
	  redrawT2 = false;
	  redrawT3 = false;
	  redrawT4 = false;
	  redrawT5 = false;
	  redrawS = false;
	  redrawTrap = false;
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
		if(redrawT3) {
			//console.log(inside([0,.5],triangleTwo));		
			for(var i = 0; i < triangleThree.length;i++){triangleThree[i][0] += tranx; triangleThree[i][1] += trany;}
		}
		if(redrawT4) {
			//console.log(inside([0,.5],triangleTwo));		
			for(var i = 0; i < triangleFour.length;i++){triangleFour[i][0] += tranx; triangleFour[i][1] += trany;}
		}
		if(redrawT5) {
			//console.log(inside([0,.5],triangleTwo));		
			for(var i = 0; i < triangleFive.length;i++){triangleFive[i][0] += tranx; triangleFive[i][1] += trany;}
		}
		if(redrawS) {
			//console.log(inside([0,.5],triangleTwo));		
			for(var i = 0; i < square.length;i++){square[i][0] += tranx; square[i][1] += trany;}
		}
		if(redrawTrap) {
			//console.log(inside([0,.5],triangleTwo));		
			for(var i = 0; i < trap.length;i++){trap[i][0] += tranx; trap[i][1] += trany;}
		}
		

    } );
	window.addEventListener("keydown", function(event){
		//console.log(event.keyCode);
		switch(event.keyCode){
			case 17:
				rotate = true;
				theta = 0.0872665;
				break;
			case 16:
				rotate = true;
				theta = 0.0872665;
				shift = true;
				break;
		}
		
    });
	window.addEventListener("keyup", function(event){
		//console.log(event.keyCode);
		switch(event.keyCode){
			case 17:
				rotate = false;
				break;
			case 16:
				rotate = false;
				shift = false;
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
	
	
	triangleOne.push(vec2(-.25,.25),vec2(0,0));
	triangleOne.push(vec2(-.25,-.25),vec2(0,0));
	triangleOne.push(vec2(-.25,-.25),vec2(-.25,.25));
	
	triangleTwo.push(vec2(-.25,.25),vec2(.25,.25));
	triangleTwo.push(vec2(.25,.25),vec2(0,0));
	triangleTwo.push(vec2(0,0),vec2(-.25,.25));	
	
	triangleThree.push(vec2(.125,.125),vec2(.25,.25));
	triangleThree.push(vec2(.25,.25),vec2(.25,0));
	triangleThree.push(vec2(.25,0),vec2(.125,.125));
	
	triangleFour.push(vec2(.25,0),vec2(.25,-.25));
	triangleFour.push(vec2(.25,-.25),vec2(0,-.25));
	triangleFour.push(vec2(0,-.25),vec2(.25,0));
	
	triangleFive.push(vec2(0,0),vec2(.125,-.125));
	triangleFive.push(vec2(.125,-.125),vec2(-.125,-.125));
	triangleFive.push(vec2(-.125,-.125),vec2(0,0));
	
	square.push(vec2(0,0),vec2(.125,.125));
	square.push(vec2(.125,.125),vec2(.25,0));
	square.push(vec2(.25,0),vec2(.125,-.125));
	square.push(vec2(.125,-.125),vec2(0,0));
	
	trap.push(vec2(-.25,-.25),vec2(-.125,-.125));
	trap.push(vec2(-.125,-.125),vec2(.125,-.125));
	trap.push(vec2(.125,-.125),vec2(0,-.25));
	trap.push(vec2(0,-.25),vec2(-.25,-.25));

	
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
	for(var i = 0; i < triangleThree.length;i++){allShapes.push(triangleThree[i]);}
	for(var i = 0; i < triangleFour.length;i++){allShapes.push(triangleFour[i]);}
	for(var i = 0; i < triangleFive.length;i++){allShapes.push(triangleFive[i]);}
	for(var i = 0; i < square.length;i++){allShapes.push(square[i]);}
	for(var i = 0; i < trap.length;i++){allShapes.push(trap[i]);}
	
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
	
	
	