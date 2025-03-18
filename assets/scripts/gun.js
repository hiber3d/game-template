({
    KEYS: {
        FIRE: 1, // SPACE
    },

    bulletScene: 'scenes/bullet.scene',

    onCreate() {

    },

    update(dt) {
        if (hiber3d.call("keyJustPressed", this.KEYS.FIRE)) {
            // Create bullet entity
            const worldTransform = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform"); 
            const bulletEntity = hiber3d.createEntity();
            hiber3d.addComponent(bulletEntity, "Hiber3D::SceneRoot");
            hiber3d.setValue(bulletEntity, "Hiber3D::SceneRoot", "scene", this.bulletScene);
            hiber3d.addComponent(bulletEntity, "Hiber3D::Transform");
            hiber3d.setValue(bulletEntity, "Hiber3D::Transform", worldTransform);
            hiber3d.addComponent(bulletEntity, "Hiber3D::Name");
            hiber3d.setValue(bulletEntity, "Hiber3D::Name", "Bullet");
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