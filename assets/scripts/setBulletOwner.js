({
    ownerId: undefined,
    update() {
        if (hiber3d.hasComponents(this.entity, "Hiber3D::Children")) {
            const children = hiber3d.getValue(this.entity, "Hiber3D::Children", "entities");
            const bulletScript = hiber3d.addScript(children[0], "scripts/bullet-with-physics.js");
            bulletScript.ownerId = this.ownerId;
            hiber3d.removeScript(this.entity, "scripts/setBulletOwner.js");
        }
    },

})