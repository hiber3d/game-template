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

  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::CollisionStarted");
  },

  update(dt) {
    // Get the transform component
    var force = { x: 0, y: 0, z: 0 };
    const transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");


    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.FORWARD)) {
      force.z = -MOVEMENT_SPEED;
    }
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.BACKWARD)) {
      force.z = MOVEMENT_SPEED;
    }
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.STRAFE_LEFT)) {
      transform.rotation  = hiber3d.call("quaternionRotateAroundAxis", transform.rotation, {x: 0, y: 1, z: 0}, 0.07);
    }
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.STRAFE_RIGHT)) {
      transform.rotation  = hiber3d.call("quaternionRotateAroundAxis", transform.rotation, {x: 0, y: 1, z: 0}, -0.07);
    }

    const euler = hiber3d.call('toEulerRollPitchYaw', transform.rotation);
    euler.x = 0;
    euler.z = 0;

    transform.rotation = hiber3d.call('quaternionFromEuler', euler);

    const forceRotated = hiber3d.call("quaternionRotateDirection", transform.rotation, force);
    // hiber3d.print(hiber3d.call('quaternionGetY', transform.rotation));

    // Get updated transform component
    transform.position.y = 0.4;
    hiber3d.setValue(this.entity, "Hiber3D::Transform", transform);
    hiber3d.setValue(this.entity, "Hiber3D::ExternalForce", "force", forceRotated);
    const velocity = hiber3d.getValue(this.entity, "Hiber3D::Velocity", "linear");

    hiber3d.writeEvent("PlayerPosition", {
      x: transform.position.x,
      z: transform.position.z,
      rotX: transform.rotation.x,
      rotY: transform.rotation.y,
      rotZ: transform.rotation.z,
      rotW: transform.rotation.w,
      velocityX: velocity.x,
      velocityZ: velocity.z,
    });
  },

  onEvent(event, payload) {
    if (event === 'Hiber3D::CollisionStarted') {
      if (payload.entity1 === this.entity && hiber3d.hasScripts(payload.entity2, "scripts/bullet-with-physics.js") || 
      payload.dentity2 === this.entity && hiber3d.hasScripts(payload.entity1, "scripts/bullet-with-physics.js")) {
        const me = payload.entity1 === this.entity ? payload.entity1 : payload.entity2;
        hiber3d.destroyEntity(me);
        hiber3d.writeEvent("LocalPlayerDied", {});
      }
    }
  },
});