({
  speed: 100,
  maxLifeTime: 2,

  currentLifeTime: 0,

  onCreate() { },

  update(dt) {
    const localTransform = hiber3d.getValue(this.entity, "Hiber3D::Transform");
    const worldTransform = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform");
    if(!localTransform || !worldTransform) {
      return;
    }
    const toMove = { x: 0, y: 0, z: -dt * this.speed };
    const toMoveRotated = hiber3d.call("quaternionRotateDirection", worldTransform.rotation, toMove);
    const newPosition = {x: localTransform.position.x + toMoveRotated.x, y: localTransform.position.y + toMoveRotated.y, z: localTransform.position.z + toMoveRotated.z};
    hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", newPosition);

    this.currentLifeTime += dt;
    if (this.currentLifeTime > this.maxLifeTime) {
      hiber3d.call("destroyEntityWithChildrenRecursive", this.entity);
    }
  },

  onEvent(event, payload) { }
});
