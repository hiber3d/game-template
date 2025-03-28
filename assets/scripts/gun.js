const GUN_KEYS = {
  FIRE: 1, // SPACE
};

const BULLET_SCENE = "glbs/sphere.glb#scene0";

({
  onCreate() { },

  update(dt) {
    if (hiber3d.call("keyJustPressed", GUN_KEYS.FIRE)) {
      // Create bullet
      const bulletEntity = hiber3d.createEntity();

      hiber3d.addComponent(bulletEntity, "Hiber3D::SceneRoot");
      hiber3d.setValue(bulletEntity, "Hiber3D::SceneRoot", "scene", BULLET_SCENE);

      hiber3d.addComponent(bulletEntity, "Hiber3D::Transform");
      hiber3d.setValue(bulletEntity, "Hiber3D::Transform", hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform"));

      hiber3d.addComponent(bulletEntity, "Hiber3D::Name");
      hiber3d.setValue(bulletEntity, "Hiber3D::Name", "Bullet");

      hiber3d.addScript(bulletEntity, "scripts/bullet.js");
    }
  },

  onEvent(event, payload) { }
});