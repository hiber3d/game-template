const GUN_KEYS = {
  FIRE: 1, // SPACE
};

const BULLET_SCENE = "glbs/sphere.glb#scene0";
const BULLET_SCALE = 0.1;

({
  fire(){
    const bulletEntity = hiber3d.createEntity();

    hiber3d.addComponent(bulletEntity, "Hiber3D::SceneRoot");
    hiber3d.setValue(bulletEntity, "Hiber3D::SceneRoot", "scene", BULLET_SCENE);

    const gunWorldTransform = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform");
    hiber3d.addComponent(bulletEntity, "Hiber3D::Transform");
    hiber3d.setValue(bulletEntity, "Hiber3D::Transform", "position", gunWorldTransform.position);
    hiber3d.setValue(bulletEntity, "Hiber3D::Transform", "rotation", gunWorldTransform.rotation);
    hiber3d.setValue(bulletEntity, "Hiber3D::Transform", "scale", {x:BULLET_SCALE, y:BULLET_SCALE, z:BULLET_SCALE});

    hiber3d.addComponent(bulletEntity, "Hiber3D::Name");
    hiber3d.setValue(bulletEntity, "Hiber3D::Name", "Bullet");

    hiber3d.addScript(bulletEntity, "scripts/bullet.js");
  },
  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::TouchEvent");
  },

  update(dt) {
    if (hiber3d.call("keyJustPressed", GUN_KEYS.FIRE)) {
      this.fire();
    }
  },

  onEvent(event, payload) {
    if(event == "Hiber3D::TouchEvent") {
      this.fire();
    }
  }
});