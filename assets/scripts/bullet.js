{
  ({
    speed: 150,
    maxLifeTime: 2,

    currentLifeTime: 0,

    onCreate() { },

    update(dt) {
      const transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");
      const newZ = transform.position.z - dt * this.speed;
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "z", newZ);

      this.currentLifeTime += dt;
      if (this.currentLifeTime > maxLifeTime) {
        hiber3d.call("destroyEntityWithChildrenRecursive", this.entity);
      }
    },

    onEvent(event, payload) { }
  });

}
