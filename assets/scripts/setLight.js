({
  isEnemy: false,
  update() {
    if (hiber3d.hasComponents(this.entity, "Hiber3D::Children")) {
      const children = hiber3d.getValue(this.entity, "Hiber3D::Children", "entities");
      hiber3d.addComponent(children[0], "Hiber3D::Light");
      hiber3d.setValue(children[0], "Hiber3D::Light", {
        color: this.isEnemy ? { x: 1, y: 0, z: 0, w: 1 } : { x: 0, y: 1, z: 0, w: 1 },
        strength: 10,
        radius: 1,
      });
      hiber3d.removeScript(this.entity, "scripts/setLight.js");
    }
  },
});
