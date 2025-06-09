export default class {
  FORCE = 100000000;
  MAX_LIFE_TIME = 2;

  currentLifeTime = 0;

  onCreate() {
    hiber3d.addComponent(this.entity, "Hiber3D::ExternalImpulse");
    hiber3d.setComponent(this.entity, "Hiber3D::ExternalImpulse", "linear", { x: 0, y: 0, z: -this.FORCE });
  }

  onUpdate(dt) {
    this.currentLifeTime += dt;
    if (this.currentLifeTime > this.MAX_LIFE_TIME) {
      hiber3d.destroyEntity(this.entity);
    }
  }

  onEvent(event, payload) {}
}
