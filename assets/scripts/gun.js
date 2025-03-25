{
  const KEYS = {
    FIRE: 1, // SPACE
  };

  const BULLET_SCENE = 'scenes/bullet.scene';

  ({
    onCreate() { },

    update(dt) {
      if (hiber3d.call("keyJustPressed", KEYS.FIRE)) {
        // Create bullet
        const bulletEntity = hiber3d.createEntity();

        hiber3d.addComponent(bulletEntity, "Hiber3D::SceneRoot");
        hiber3d.setValue(bulletEntity, "Hiber3D::SceneRoot", "scene", BULLET_SCENE);

        hiber3d.addComponent(bulletEntity, "Hiber3D::Transform");
        hiber3d.setValue(bulletEntity, "Hiber3D::Transform", hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform"));

        hiber3d.addComponent(bulletEntity, "Hiber3D::Name");
        hiber3d.setValue(bulletEntity, "Hiber3D::Name", "Bullet");
      }
    },

    onEvent(event, payload) { }
  });
}