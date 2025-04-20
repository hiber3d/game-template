({
  force: 10000,
  maxLifeTime: 2,

  currentLifeTime: 0,

  onCreate() {
    hiber3d.addComponent(this.entity, "Hiber3D::ExternalImpulse");
    const parent = hiber3d.getValue(this.entity, "Hiber3D::Parent", "parent");
    const transform = hiber3d.getValue(parent, "Hiber3D::Transform");

    const force = hiber3d.call("quaternionRotateDirection", transform.rotation, { x: 0, y: 0, z: -this.force });
    hiber3d.setValue(this.entity, "Hiber3D::ExternalImpulse", "linear", force);

    hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", 0);
  },

  destroy() {
    const parent = hiber3d.getValue(this.entity, "Hiber3D::Parent", "parent");
    hiber3d.call("destroyEntityWithChildrenRecursive", parent);
  },

  update(dt) {
    this.currentLifeTime += dt;
    if (this.currentLifeTime > this.maxLifeTime) {
      this.destroy();
    }
  },

  onEvent(event, payload) {}
});
