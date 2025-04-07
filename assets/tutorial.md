# Tutorial: Make a minigame

## 1. Add movement

1. Add the `movement.js` script to the Cube entity in the scene.
2. Press play to try (Move around using WASD keys). Then back to edit mode.
3. Lets make the camera follow the cube when moving: Move the camera entity to be a child of the Cube entity.
4. Press play to try. Then back to edit mode.
5. Adjust the camera transform via inspector to get a nice view of the cube when moving around.
6. Open the `movement.js` script and adjust moevement speed, try changing it while play mode is active to see live results.

## 2. Add gun

1. Add a child entity to the cube, name it Gun.
2. Add the `gun.js` script to the entity.
3. Press play and try shooting with SPACE.
4. Adjust the transform position of the gun entity to change where the bullet shoots from.

## 3. Make a nicer gun

1. Add a child entity to the Gun entity.
2. Add a sceneRoot component and choose the cylinder.
3. Scale and rotate the cylinder to make it look nice.

## 4. Adjust bullet

1. Create a new scene: Right click the scenes folder, choose "New file..." and name it `bullet.scene`.
2. Open the `bullet.scene` and create you custom bullet by adding glbs to it. Save the file when you are done.
3. Open the `gun.js` script and change the `BULLET_SCENE` variable to reference your new scene: `BULLET_SCENE = "assets/bullet.scene"`.
4. Press play and shoot your newly created bullets!
