/**
 * This script handles keyboard movement for the entity it is attached to.
 */

const KEYS = {
  FORWARD: 41, // W
  BACKWARD: 37, // S
  STRAFE_LEFT: 19, // A
  STRAFE_RIGHT: 22, // D

  ASCEND: 1, // SPACE
  DESCEND: 112, // LSHIFT
};

({
  speed: 10,

  onCreate() {},

  update(dt) {
    // Get the transform component
    const transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");

    // Update the transform based on the keys pressed
    if (hiber3d.call("keyIsPressed", KEYS.FORWARD)) {
      transform.position.z -= dt * this.speed;
    }
    if (hiber3d.call("keyIsPressed", KEYS.BACKWARD)) {
      transform.position.z += dt * this.speed;
    }
    if (hiber3d.call("keyIsPressed", KEYS.STRAFE_LEFT)) {
      transform.position.x -= dt * this.speed;
    }
    if (hiber3d.call("keyIsPressed", KEYS.STRAFE_RIGHT)) {
      transform.position.x += dt * this.speed;
    }
    if (hiber3d.call("keyIsPressed", KEYS.ASCEND)) {
      transform.position.y += dt * this.speed;
    }
    if (hiber3d.call("keyIsPressed", KEYS.DESCEND)) {
      transform.position.y -= dt * this.speed;
      transform.position.y = Math.max(0, transform.position.y);
    }

    // Set the updated transform
    hiber3d.setValue(this.entity, "Hiber3D::Transform", transform);
  },

  onEvent(event, payload) {},
});
