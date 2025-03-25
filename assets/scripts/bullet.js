{
  const SPEED = 150;
  const MAX_LIFE_TIME = 2;

  ({
    currentLifeTime: 0,

    onCreate() { },

    update(dt) {
      const transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");
      const newZ = transform.position.z - dt * SPEED;
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "z", newZ);

      this.currentLifeTime += dt;
      if (this.currentLifeTime > MAX_LIFE_TIME) {
        const parent = hiber3d.getValue(this.entity, "Hiber3D::Parent", "parent");
        hiber3d.call("destroyEntityWithChildrenRecursive", parent);
      }
    },

    onEvent(event, payload) { }
  });

}
