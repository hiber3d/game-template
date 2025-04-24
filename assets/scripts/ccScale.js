// This script scales the entity based on MIDI CC values

({
  originalScale: { x: 1, y: 1, z: 1 },

  onCreate() {
    // Get the transform component
    this.originalScale = hiber3d.getValue(this.entity, "Hiber3D::Transform", "scale");
   },

  update(dt) {
    cc = hiber3d.getValue("MidiState", "cc");

    if (hiber3d.hasComponents(this.entity, "Hiber3D::Name") === true && hiber3d.getValue(this.entity, "Hiber3D::Name").substring(0, 2) === "Eq") {
      const name = hiber3d.getValue(this.entity, "Hiber3D::Name");
      const ccId = parseInt(name.substring(2, 4));
      hiber3d.print("Name: " + name + ", CC: " + ccId);
      scale = this.originalScale.y + (cc[ccId] / 32);
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", scale);
    } else {
      scale = {x: this.originalScale.x + (cc[0] / 64), y: this.originalScale.y + (cc[1] / 64), z: this.originalScale.z + (cc[2] / 64)};
      hiber3d.setValue(this.entity, "Hiber3D::Transform", "scale", scale);
    }
  },

  onEvent(event, payload) { },
});