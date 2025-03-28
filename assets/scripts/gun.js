({
    MOUSE: {
        LEFT: 1, // SPACE
    },

    bulletScene: 'scenes/bullet.scene',

    onCreate() {},

    update(dt) {
        if (hiber3d.call("mouseJustPressed", this.MOUSE.LEFT)) {
            // Create bullet entity
            const worldTransform = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform"); 
            hiber3d.print("Bullet position", JSON.stringify(worldTransform));
            const bulletEntity = hiber3d.createEntity();
            worldTransform.scale = { x: 0.1, y: 0.1, z: 0.1 };
            hiber3d.addComponent(bulletEntity, "Hiber3D::SceneRoot");
            hiber3d.setValue(bulletEntity, "Hiber3D::SceneRoot", "scene", this.bulletScene);
            hiber3d.addComponent(bulletEntity, "Hiber3D::Transform");
            hiber3d.setValue(bulletEntity, "Hiber3D::Transform", worldTransform);
            hiber3d.addComponent(bulletEntity, "Hiber3D::Name");
            hiber3d.setValue(bulletEntity, "Hiber3D::Name", "Bullet");
        }
    },

    onEvent(event, payload) {}
});