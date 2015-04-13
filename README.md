# CS 174a Assignment 1
Alex Crosthwaite
* * *
## Project Requirements (Implemented):
1) Implement the assignment clearly, understandably, and with extensive comments.

2) Set up a simple WebGL capable HTML canvas able to display without error. Initialize it with a size of 960x540, the z-buffer enabled and cleared to a black background. Implement necessary shader codes without error.

3) Display 8 cubes using a perspective projection each centered at (+-10, +-10, +-10) from the origin and drawn in a different color. Draw each cube's outline in white. The c key should
cycle the colors of the ubes when pressed. The cubes should display in a square aspect ratio. All 8 cubes shoul be visble from the camera's inital position along the z axis.

4) Implement a navigation system using the keyboard. The up arrow, down arrow, j, and k keys should move the camera up, down, left, and right respectively along the X-Y plane.
The i and m keys should move the camera forward and backward respectively relative to the camera's current heading. The left and right arrow keys should control the heading of the camera.
The r key should reset the camera to its initial position.

5) The n and w keys should make the camera's horizontal field of view narrower or wider. The display of the scene should remain square as the field of view changes.
The + key should toggle a display of an orthographic projection of a cross hair centered over the scene.

* * *

## Project Requirements (Not Implemented):

  All Project requirements are implemented.
  
* * *

### Extra Credit Requirements:

1) Instance each of the eight cubes from the same data and implement the cube geometry as a single triangle strip primitive

I implemented this by first creating the vertices of a cube centered at the origin. I then created an array of numbered indices that correspond to specific vertices
and ordered them in such a way that when drawn using gl.TRIANGLE_STRIP it produces a cube. The instancing was performed using and array of 8 colors and an array of 8 different transformation matrices.
Each matrix in the transformation matrices array represented a different transformation to place a new cube in one of the specified locations (e.g. +10, -10, -10). Each different cube was produced using a loop
in the render function that accessed a different transformation and color for each cube.

2) Smoothly, continuosly and individually rotate and scale each of the cubes while the application is running. The rotation should be constant at 60 rpm
and the scale should vary by ten percent. The cubes shall remain centered around their inital positions.

I implemented this by usualy a variable theta that calculated the rotation as well as the scale. Every frame, theta was changed by +6 which accounted for the 60 rpm requirement.
This theta was passed to the vertex shader in which I constructed a rotation matrix (the x axis was chosen) and a scaling matrix. The rotation matrix was a standard rotation
matrix using sines and cosines of the theta parameter in radiance. To produce the scaling, I constructed the scaling matrix with the sine value along the x y and z diagonal positions.

3) Implement your navigation system using quaternions.

I used the matrix functions from MV.js which used quaternions.

4) Manage your code development and submission using the cs174A github repository.

I did this

5) Early submission when using github

Last modified on Sunday April 12
