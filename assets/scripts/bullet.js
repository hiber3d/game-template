({
    speed: 150,
    maxLifeTime: 2,
    lifeTime: 0,

    onCreate() {

    },

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

    onEvent(event, payload) {

    }
});


/**

// Print to console
hiber3d.print(...) // use JSON.stringify for object

// Create / destroy entity
const newEntity = hiber3d.createEntity()
hiber3d.destroyEntity(entity)

// Access other script instance
hiber3d.getScript(entity, "Other.js")

// Add / remove / check if entity has components
hiber3d.addComponent(this.entity, "Hiber3D::Transform")
hiber3d.removeComponent(this.entity, "Hiber3D::Transform")
hiber3d.hasComponents(this.entity, "Hiber3D::Transform", "Hiber3D::Renderable")
hiber3d.findEntitiesWithComponent("Hiber3D::Transform")

// Change component values
hiber3d.getValue(this.entity, "Hiber3D::Transform", "position", "x")
hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "x", 1)

// Get and set singleton values
hiber3d.getValue("Hiber3D::ActiveCamera", "position")
hiber3d.setValue("Hiber3D::ActiveCamera", "position", {x:1, y:2, z:3})

// Call registered C function
hiber3d.call("Foo", 1, "hello")

// Events
hiber3d.addEventListener(this.entity, "EventName")
hiber3d.writeEvent("EventName", {});

*/