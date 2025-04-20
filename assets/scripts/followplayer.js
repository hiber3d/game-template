/**
 * This script handles keyboard movement for the entity it is attached to.
 */
const MOVEMENT_KEYS = {
  FORWARD: 41, // W
  BACKWARD: 37, // S
  STRAFE_LEFT: 19, // A
  STRAFE_RIGHT: 22, // D
};

const MOVEMENT_SPEED = 10000; // meters per second

({
  onCreate() { },

  update(dt) {
    // Get the transform component
    const entities = hiber3d.findEntitiesWithScript("scripts/movement.js");

    if (entities.length > 0) {
      const transform = hiber3d.getValue(entities[0], "Hiber3D::Transform");

      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "x", transform.position.x);
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "z", transform.position.z);
    }

  },

  onEvent(event, payload) { },
});