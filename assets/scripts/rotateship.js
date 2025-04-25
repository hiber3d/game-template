
({

  onCreate() {
  },

  update(dt) {
    // Get the transform component
    const parent = hiber3d.getValue(this.entity, "Hiber3D::Parent", "parent");
    const transform = hiber3d.getValue(parent, "Hiber3D::Transform");

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
    // hiber3d.print(hiber3d.call('quaternionGetY', transform.rotation));

    // Get updated transform component
    transform.position.y = 0.4;
    hiber3d.setValue(parent, "Hiber3D::Transform", transform);
  },

  onEvent(event, payload) {
    if (event === 'Hiber3D::CollisionStarted') {
      if (payload.entity1 === this.entity && hiber3d.hasScripts(payload.entity2, "scripts/bullet-with-physics.js") ||
      payload.dentity2 === this.entity && hiber3d.hasScripts(payload.entity1, "scripts/bullet-with-physics.js")) {
        const me = payload.entity1 === this.entity ? payload.entity1 : payload.entity2;
        const bullet = payload.entity1 === this.entity ? payload.entity2 : payload.entity1;
        const bulletScript = hiber3d.getScript(bullet, "scripts/bullet-with-physics.js");
        const parent = hiber3d.getValue(me, "Hiber3D::Parent", "parent");
        hiber3d.destroyEntity(parent);
        hiber3d.writeEvent("LocalPlayerDied", {
          killedById: bulletScript.ownerId
        });
      }
    }
  },
});