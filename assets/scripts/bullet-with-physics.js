({
  force: 100000000,
  maxLifeTime: 2,

  currentLifeTime: 0,

  onCreate() {
    hiber3d.addComponent(this.entity, "Hiber3D::ExternalImpulse");
    hiber3d.setValue(this.entity, "Hiber3D::ExternalImpulse", "linear", { x: 0, y: 0, z: -this.force });
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
