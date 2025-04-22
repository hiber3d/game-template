({
    transform: {},
    update() {
        if (hiber3d.hasComponents(this.entity, "Hiber3D::Children")) {
            const children = hiber3d.getValue(this.entity, "Hiber3D::Children", "entities");
            hiber3d.setValue(children[0], "Hiber3D::Transform", this.transform);
            hiber3d.removeScript(this.entity, "scripts/setTransform.js");
        }
    },

})