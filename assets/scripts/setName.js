({
    name: undefined,
    update() {
        if (hiber3d.hasComponents(this.entity, "Hiber3D::Children")) {
            const children = hiber3d.getValue(this.entity, "Hiber3D::Children", "entities");
            const grandChildren = hiber3d.getValue(children[0], "Hiber3D::Children", "entities");
            for (var i = 0; i < grandChildren.length; i++) {
                if (hiber3d.hasComponents(grandChildren[i], "PlayerName")) {
                    hiber3d.setValue(grandChildren[i], "PlayerName", "name", this.name);
                    hiber3d.print("DID SET NAME: ", this.name);
                }
            }
            hiber3d.removeScript(this.entity, "scripts/setName.js");
        }
    },

})