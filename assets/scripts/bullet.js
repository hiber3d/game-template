({
    speed: 150,
    maxLifeTime: 2,
    lifeTime: 0,

    onCreate() {},

    update(dt) {
        const transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");
        const newZ =  transform.position.z - dt * this.speed;
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "z", newZ);

        this.lifeTime += dt;
        if (this.lifeTime > this.maxLifeTime) {
            const parent = hiber3d.getValue(this.entity, "Hiber3D::Parent", "parent");
            hiber3d.call("destroyEntityWithChildrenRecursive", parent);
        }
    },

    onEvent(event, payload) {}
});
