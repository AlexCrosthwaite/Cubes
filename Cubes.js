
var canvas;
var gl;
var points = [];
var theta = 0;
var thetaLoc, vColorLoc, MVMatrixLoc, pMatrixLoc;
var pMatrix;    
var IMatrix = mat4(1);
var colorIndex = 0;
var displayCH = false;

//Variables related to the camera position and movement
var camera = {
    x : 0,
    y : 0,
    z : -45,
    fovx : 90,
    near : 0.1, 
    far : 70,
    aspect : undefined,
    heading : 0
}

//The 8 vertices for a cube centered around the origin
var vertices = [
        vec3( -2, -2,  2 ),
        vec3( -2,  2,  2 ),
        vec3(  2,  2,  2 ),
        vec3(  2, -2,  2 ),
        vec3( -2, -2, -2 ),
        vec3( -2,  2, -2 ),
        vec3(  2,  2, -2 ),
        vec3(  2, -2, -2 )
    ];

//The 8 different colors used for the 8 different cubes
var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 1.1, 0.5, 0.25, 1.0 ],  // white
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];

//The 8 different translation matrices used to instance the initial cube to 8 different locations
var translates = [
    translate(10, 10, 10),
    translate(10, 10, -10),
    translate(10, -10, 10),
    translate(10, -10, -10),
    translate(-10, 10, 10),
    translate(-10, 10, -10),
    translate(-10, -10, 10),
    translate(-10, -10, -10)
];


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();
    outLineCube();
    crosshair();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1 );

    camera.aspect = canvas.width/canvas.height;
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    vColorLoc = gl.getUniformLocation(program, "vColor");
    MVMatrixLoc = gl.getUniformLocation(program, "MVMatrix");
    pMatrixLoc = gl.getUniformLocation(program, "pMatrix");
    
    
    //The Event listeners for different key presses

    window.onkeypress = function(event) {
    	var key = String.fromCharCode(event.keyCode).toLowerCase();
    	switch(key){
    		case 'c': //Cycle through the colors of the cubes
    		colorIndex++;
            break;
            case 'r': //Reset the position of the cubes to the original specifications
            camera.x = 0;
            camera.y = 0;
            camera.z = -45;
            camera.fovx = 90;
            camera.heading = 0;
            break;
            case 'i': //Account for the current heading and move the camera forward in that direction
            camera.z += 0.25*Math.cos(radians(camera.heading));
            camera.x -= 0.25*Math.sin(radians(camera.heading));
            break;
            case 'j': //Account for the current heading and move the camera left in that direction
            camera.x += 0.25*Math.cos(radians(camera.heading));
            camera.z += 0.25*Math.sin(radians(camera.heading));
            break;
            case 'k': //Account for the current heading and move the camera right in that direction
            camera.x -= 0.25*Math.cos(radians(camera.heading));
            camera.z -= 0.25*Math.sin(radians(camera.heading));
            break;
            case 'm': //Account for the current heading and move the camera down in that direction
            camera.z -= 0.25*Math.cos(radians(camera.heading));
            camera.x += 0.25*Math.sin(radians(camera.heading));
            break;
            case 'n': //Make the field of view narrower
            camera.fovx -= 1;
            break;
            case 'w': //Make the field of view wider
            camera.fovx += 1;
            break;
            case '+':
            displayCH = !displayCH;
            break;

    	}
    }
    
    window.onkeydown = function(event) {
        var key = event.keyCode;
        switch(key){
            case 38: //Up arrow key
            camera.y -= 0.25;
            break;
            case 40: //Down arrow key
            camera.y += 0.25;
            break;
            case 37: //Left arrow key
            camera.heading -= 1;
            break;
            case 39: //Right arrow key
            camera.heading += 1;
            break;
        }
    }
    render();
        
}

function colorCube()
{
    //The cube is drawn using a single triangle strip and 14 points
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ 0, 4, 7, 6, 3, 2, 1, 6, 5, 4, 1, 0, 3, 7 ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );        
    }
}

function outLineCube()
{
    //The outline of the faces is generated by drawing each edge (line) on the cube.
    //The color of the outline will be chosen in render() to be white

	var indices = [ 0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 1, 5, 2, 6, 3, 7, 5, 6, 6, 7, 7, 4, 4, 5];

	for (var i = 0; i < indices.length; ++i) {
		points.push ( vertices[indices[i]]);
	}

}

function crosshair()
{
    points.push(vec3(-0.05, 0, 0));
    points.push(vec3( 0.05, 0, 0));
    points.push(vec3( 0,-0.05, 0));
    points.push(vec3( 0, 0.05, 0));
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);


    //delta theta is chosen to be 6 degrees to generate 60 rpm
    theta += 6.0;
    gl.uniform1f(thetaLoc, theta);

    //---Perspective matrix---
    //The fovy parameter is calculated using a conversion between fovx and fovy.
    //Other parameters are retreived from the camera variable
    pMatrix = perspective(camera.fovx / camera.aspect, camera.aspect, camera.near, camera.far);
    gl.uniformMatrix4fv(pMatrixLoc, false, flatten(pMatrix));


    //---View Matrix---
    //The view matrix is generated by multiplying the rotation matrix (chosen to be rotation about the y axis)
    // and the translation specified by the camera variable (based on previous input from the user).
    var viewMatrix = mult(rotate(camera.heading, [0, 1, 0]), translate(camera.x, camera.y, camera.z));


    //---Instancing---
    //Use each of the different instancing transformations to generate a new cube in world coordinates.
    //The color of each cube is generated by the current iteration of the loop.
    for(var i = 0; i < translates.length; i++)
    {
        //---Model View Matrix---
        //The model view Matrix is generated by multiplying the view matrix by the model matrix (for
        // each specific instance)
        gl.uniformMatrix4fv(MVMatrixLoc, false, flatten(mult(viewMatrix, translates[i])));
        vColor = vertexColors[(colorIndex + i)%8];
        gl.uniform4fv(vColorLoc, vColor)

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 14 );

        vColor = [1, 1, 1, 1]
        gl.uniform4fv(vColorLoc, vColor);

        gl.drawArrays( gl.LINES, 14, 24 );
    }

    if(displayCH == true)
    {
        gl.uniform4fv(vColorLoc, [1.0, 1.0, 1.0, 1.0])
        gl.uniform1f(thetaLoc, 0);
        gl.uniformMatrix4fv(pMatrixLoc, false, flatten(ortho(-1.0 * camera.aspect, 1.0 * camera.aspect, -1.0, 1.0, 0, 1.0)));
        gl.uniformMatrix4fv(MVMatrixLoc, false, flatten(IMatrix));
        gl.disable(gl.DEPTH_TEST);
        gl.drawArrays(gl.LINES, 38, 4);
    }
    

    requestAnimFrame( render );
}
