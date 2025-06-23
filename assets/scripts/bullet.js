export default class {
  SPEED = 100;
  MAX_LIFE_TIME = 2;

  currentLifeTime = 0;

  onCreate() { }

  onUpdate(dt) {
    const localTransform = hiber3d.getComponent(this.entity, "Hiber3D::Transform");
    const worldTransform = hiber3d.getComponent(this.entity, "Hiber3D::ComputedWorldTransform");
    if(!localTransform || !worldTransform) {
      return;
    }
    const toMove = { x: 0, y: 0, z: -dt * this.SPEED };
    const toMoveRotated = worldTransform.rotation.rotateDirection(toMove);
    const newPosition = {x: localTransform.position.x + toMoveRotated.x, y: localTransform.position.y + toMoveRotated.y, z: localTransform.position.z + toMoveRotated.z};
    hiber3d.setComponent(this.entity, "Hiber3D::Transform", "position", newPosition);

    this.currentLifeTime += dt;
    if (this.currentLifeTime > this.MAX_LIFE_TIME) {
      hiber3d.destroyEntity(this.entity);
    }
  }

  onEvent(event, payload) { }
}
