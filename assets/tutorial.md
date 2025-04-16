# Tutorial: Make a minigame

## 1. Add movement

1. Add the `movement.js` script to the Cube entity in the scene.
2. Press play to try (Move around using WASD keys). Then back to edit mode.
3. Lets make the camera follow the cube when moving: Move the camera entity to be a child of the Cube entity.
4. Press play to try. Then back to edit mode.
5. Adjust the camera transform via inspector to get a nice view of the cube when moving around.
6. Open the `movement.js` script and adjust movement speed, try changing it while play mode is active to see live results.

## 2. Add gun

1. Add a child entity to the cube, name it Gun.
2. Add the `gun.js` script to the entity.
3. Press play and try shooting with SPACE.
4. Adjust the transform position of the gun entity to change where the bullet shoots from.

## 3. Make a nicer gun

1. Add a child entity to the Gun entity and name it `Model`.
2. Add a Renderable component and choose the cylinder mesh.
3. Choose a material
4. Scale and rotate the cylinder to make it look nice.

## 4. Adjust bullet

1. Create a new scene: Right click the scenes folder, choose "New file..." and name it `bullet.scene`.
2. Open the `bullet.scene` and create your custom bullet by adding meshes and materials to it. Save the file when you are done.
3. Open the `gun.js` script and add the variable `BULLET_SCENE` to reference your new scene: `const BULLET_SCENE = "scenes/bullet.scene";`.
4. Replace the lines

   ```js
   hiber3d.addComponent(bulletEntity, "Hiber3D::Renderable");
   hiber3d.setValue(bulletEntity, "Hiber3D::Renderable", "mesh", "glbs/Sphere.glb#mesh0/primitive0");
   hiber3d.setValue(bulletEntity, "Hiber3D::Renderable", "material", "materials/BasicPaint.material");
   ```

   with:

   ```js
   hiber3d.addComponent(bulletEntity, "Hiber3D::SceneRoot");
   hiber3d.setValue(bulletEntity, "Hiber3D::SceneRoot", "scene", BULLET_SCENE);
   ```

5. Press play and shoot your newly created bullets!

## 5. Add some UI

1. Lets show the player how much ammo is left in the gun. Create a new entity and name it `UI`.
2. Add a `RmlDocumentInstance` component to it and select the `gun.rml` document.
3. Open the `gun.js` script and add the following to the end of the `onCreate()` function:

```js
hiber3d.call("rmlLoadFont", "fonts/Roboto-Regular.ttf");
hiber3d.call("rmlCreateDataModel", "gun");
hiber3d.call("rmlSetDataModelString", "gun", "ammo", this.ammo.toString());
```

4. Add the following line to the end of the `fire()` function:

```js
hiber3d.call("rmlSetDataModelString", "gun", "ammo", this.ammo.toString());
```

5. Press play again and shoot your gun. The UI should now update.
6. Open `gun.rml` and style your UI. The game will automatically update with your changes when you save the file.

## 6. Add something to shoot at (using physics)

1. To begin we need to replace the old bullet script with a physics based one. Remove the line `hiber3d.addScript(bulletEntity, "scripts/bullet.js");` from `gun.js`.
2. Open `bullet.scene`.
3. Add the script `bullet-with-physics.js` to the root entity.
4. Add the component `RigidBody` to the root entity.
5. Set these values:
   - `Type = Dynamic`
   - `MotionQuality = Continuous`
   - `CollisionGroup = Dynamic`
   - `CollisionMask = Static, Dynamic`
6. Create a new entity as a child to the root entity and name it `Shape`.
7. Add the component `Shape` to it and choose a shape that matches your bullet (You can add multiple shapes as children to a rigid body to match the form of your bullet).
8. Adjust the transform position of the Shape entity to align it with the model.
9. On the `Shape` component, set `Density = 10000`. (Adjust depending on how strong the bullet should push the target it hits).
10. Go back to the `main.scene`.
11. Open the `plane-piece.scene`, add a `RigidBody` component to it and set:
    - `CollisionGroup = Static`
    - `CollisionMask = Dynamic`
12. Add a child entity to the Plane, name it `Shape`, add a `Shape` component, set its shape to `PlaneShape` and `HalfExtent = 50`.
13. Add the `scenes/cubes.scene` to the `main.scene` (You can drag it from the assets panel to the Scene panel).
14. Press play and shoot the cubes!

## 7. Add scores (using collision events)

1. Open `bullet-with-physics.js` and add the following line to the `onCreate()` function:

```js
hiber3d.addEventListener(this.entity, "Hiber3D::CollisionStarted");
```

2. Replace the `onEvent()` function with this code block:

```js
onEvent(event, payload) {
    if (event === 'Hiber3D::CollisionStarted') {
        if (this.entity === payload.entity2) {
            const entitites = hiber3d.findEntitiesWithScript("scripts/gun.js");
            const gunScript = hiber3d.getScript(entitites[0], "scripts/gun.js");
            gunScript.hits++;
            hiber3d.call("rmlSetDataModelString", "gun", "hits", gunScript.hits.toString());
            this.destroy();
        }
    }
}
```

3. Open `gun.js` and add this to the end of the `onCreate()` function:

```js
hiber3d.call("rmlSetDataModelString", "gun", "hits", this.hits.toString());
```

4. Open `gun.rml` and add this line below the `<div>Ammo: {{ammo}}</div>`

```html
<div>Hits: {{hits}}</div>
```

5. Press play and watch the hits increase each time you hit a cube.
