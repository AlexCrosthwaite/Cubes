
var canvas;
var gl;

var NumVertices  = 38;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc, vColorLoc, tranMatrixLoc, pMatrixLoc;
var pMatrix;
var colorIndex = 1;
var fov = 45;
var near = 2;
var far = 32;
var aspect;


var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 1.0, 1.0, 1.0, 1.0 ],  // white
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];

var translates = [
    translate(-5, 0, -10),
    translate(5, 0, -10),
    translate(0, 0, -10)
];


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();
    outLineCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1 );

    aspect = canvas.width/canvas.height;
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    /*var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );*/

    /*var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );*/

    

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    vColorLoc = gl.getUniformLocation(program, "vColor");
    tranMatrixLoc = gl.getUniformLocation(program, "tranMatrix");
    pMatrixLoc = gl.getUniformLocation(program, "pMatrix");
    pMatrix = perspective(fov, aspect, near, far);
    
    //event listeners for buttons
    
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };

    window.onkeypress = function(event) {
    	var key = String.fromCharCode(event.keyCode);
    	switch(key){
    		case 'c':
    		colorIndex++;
    		break;
    	}
    }
    
    render();
        
}

function colorCube()
{
    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ 0, 4, 7, 6, 3, 2, 1, 6, 5, 4, 1, 0, 3, 7 ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[5] );
    
        // for solid colored faces use 
        //colors.push(vertexColors[a]);
        
    }
}

function outLineCube()
{
	var indices = [ 0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 1, 5, 2, 6, 3, 7, 5, 6, 6, 7, 7, 4, 4, 5];

	for (var i = 0; i < indices.length; ++i) {
		points.push ( vertices[indices[i]]);
	}

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    gl.uniformMatrix4fv(pMatrixLoc, false, flatten(pMatrix));

    for(var i = 0; i < translates.length; i++)
    {
        gl.uniformMatrix4fv(tranMatrixLoc, false, flatten(translates[i]));
        vColor = vertexColors[(colorIndex + i)%8];
        gl.uniform4fv(vColorLoc, vColor)

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 14 );

        vColor = vertexColors[6];
        gl.uniform4fv(vColorLoc, vColor);

        gl.drawArrays( gl.LINES, 14, NumVertices - 14 );
    }
    requestAnimFrame( render );
}
