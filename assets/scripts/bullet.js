({
    speed: 1000,
    maxLifeTime: 5,
    lifeTime: 0,

    onCreate() {},

    update(dt) {
        const transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");
        const newX =  transform.position.x + dt * this.speed;
        hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "x", newX);

        this.lifeTime += dt;
        if (this.lifeTime > this.maxLifeTime) {
            const parent = hiber3d.getValue(this.entity, "Hiber3D::Parent", "parent");
            hiber3d.call("destroyEntityWithChildrenRecursive", parent);
        }
    },

    onEvent(event, payload) {}
});
