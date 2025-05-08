/**
 * This script handles keyboard movement for the entity it is attached to.
 */
const MOVEMENT_KEYS = {
  FORWARD: 41, // W
  BACKWARD: 37, // S
  STRAFE_LEFT: 19, // A
  STRAFE_RIGHT: 22, // D
};

const MOVEMENT_SPEED = 10; // meters per second

({
  onCreate() { },

  update(dt) {
    // Get the transform component
    const transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");

    // Update position based on the keys pressed
    var toMove = { x: 0, y: 0, z: 0 };
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.FORWARD)) {
      toMove.z -= dt * MOVEMENT_SPEED;
    }
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.BACKWARD)) {
      toMove.z += dt * MOVEMENT_SPEED;
    }
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.STRAFE_LEFT)) {
      toMove.x -= dt * MOVEMENT_SPEED;
    }
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.STRAFE_RIGHT)) {
      toMove.x += dt * MOVEMENT_SPEED;
    }
    const toMoveRotated = hiber3d.call("quaternionRotateDirection", transform.rotation, toMove);
    transform.position = {x: transform.position.x + toMoveRotated.x, y: transform.position.y + toMoveRotated.y, z: transform.position.z + toMoveRotated.z};
    
    // Get updated transform component
    hiber3d.setValue(this.entity, "Hiber3D::Transform", transform);
  },

  onEvent(event, payload) { },
});