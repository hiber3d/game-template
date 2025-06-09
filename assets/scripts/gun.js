export default class {
  GUN_KEYS = {
    FIRE: 1, // SPACE
  };

  ammo = 100;
  hits = 0;

  fire() {
    if (this.ammo <= 0) {
      return;
    }
    this.ammo--;

    const bulletEntity = hiber3d.createEntity();

    hiber3d.addComponent(bulletEntity, "Hiber3D::Renderable");
    hiber3d.setComponent(bulletEntity, "Hiber3D::Renderable", "mesh", "glbs/Sphere.glb#mesh0/primitive0");
    hiber3d.setComponent(bulletEntity, "Hiber3D::Renderable", "material", "materials/BasicPaint.material");

    const gunWorldTransform = hiber3d.getComponent(this.entity, "Hiber3D::ComputedWorldTransform");
    hiber3d.addComponent(bulletEntity, "Hiber3D::Transform");
    hiber3d.setComponent(bulletEntity, "Hiber3D::Transform", "position", gunWorldTransform.position);

    hiber3d.addComponent(bulletEntity, "Hiber3D::Name");
    hiber3d.setComponent(bulletEntity, "Hiber3D::Name", "Bullet");

    hiber3d.addScript(bulletEntity, "scripts/bullet.js");
  }

  onCreate() {
    hiber3d.addEventListener(this, "Hiber3D::TouchEvent");
  }

  onUpdate(dt) {
    if (hiber3d.call("keyJustPressed", this.GUN_KEYS.FIRE)) {
      this.fire();
    }
  }

  onEvent(event, payload) {
    if (event == "Hiber3D::TouchEvent") {
      this.fire();
    }
  }
}
