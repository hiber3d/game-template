({
    players: {},
    onCreate() {
      hiber3d.addEventListener(this.entity, "PlayerJoined");
      hiber3d.addEventListener(this.entity, "PlayerLeft");
      hiber3d.addEventListener(this.entity, "PlayerUpdate");
    },

    update(deltaTime) {

    },

    onEvent(event, payload) {
      if (event == "PlayerJoined") {
        hiber3d.print("Player joined: ", payload.id);

        if (this.players[payload.id]) {
          hiber3d.print("Player already exists: ", payload);
          return;
        }
        const player = hiber3d.createEntity();
        this.players[payload.id] = player;
        hiber3d.addComponent(player, "Hiber3D::SceneRoot");
        hiber3d.setValue(player, "Hiber3D::SceneRoot", "scene", "scenes/Enemy.scene");
        hiber3d.addComponent(player, "Hiber3D::Transform");

      } else if (event == "PlayerLeft") {
        hiber3d.print("Player left: ", payload);
        const player = this.players[payload.id];
        if (!player) {
          hiber3d.print("Player not found: ", payload);
          return;
        }
        hiber3d.destroyEntity(player);
        delete this.players[payload.id];
      } else if (event == "PlayerUpdate") {
        const player = this.players[payload.id];
        if (!player) {
          hiber3d.print("Player not found: ", payload);
          return;
        }
        hiber3d.setValue(player, "Hiber3D::Transform", "position", "x", payload.x);
        hiber3d.setValue(player, "Hiber3D::Transform", "position", "z", payload.z);
        hiber3d.setValue(player, "Hiber3D::Transform", "rotation", "x", payload.rotX);
        hiber3d.setValue(player, "Hiber3D::Transform", "rotation", "y", payload.rotY);
        hiber3d.setValue(player, "Hiber3D::Transform", "rotation", "z", payload.rotZ);
        hiber3d.setValue(player, "Hiber3D::Transform", "rotation", "w", payload.rotW);
      }
    }
});


/**

// Print to console
hiber3d.print(...) // use JSON.stringify for object

// Create / destroy entity
const newEntity = hiber3d.createEntity()
hiber3d.destroyEntity(entity)

// Add / remove / get other script instance
hiber3d.addScript(entity, "Other.js")
hiber3d.getScript(entity, "Other.js")
hiber3d.removeScript(entity, "Other.js")
hiber3d.hasScript(entity, "Other.js")

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

// Inputs - find key codes in <Hiber3D/Core/KeyEvent.hpp>
hiber3d.call("keyIsPressed", 1)
hiber3d.call("keyJustPressed", 1)
hiber3d.call("keyJustReleased", 1)

// Events
hiber3d.addEventListener(this.entity, "EventName")
hiber3d.writeEvent("EventName", {});

*/