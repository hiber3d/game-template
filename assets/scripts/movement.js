/**
 * This script handles keyboard movement for the entity it is attached to.
 */

({
  onCreate() {},

  update(dt) {
    // Get the transform component
    const worldTransform = hiber3d.getValue(this.entity, "Hiber3D::ComputedWorldTransform");

    mousePosition = hiber3d.getValue("Hiber3D::MouseState", "currentPosition");

    const res = hiber3d.call("raycastFromMouse", mousePosition);

    const direction = { 
      x: res.x - worldTransform.position.x, 
      y: res.y - worldTransform.position.y, 
      z: res.z - worldTransform.position.z 
    };
    hiber3d.print(JSON.stringify(direction),'direction');
    
    const transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");
    transform.rotation = hiber3d.call("lookRotation", direction);
    hiber3d.setValue(this.entity, "Hiber3D::Transform", transform);
  },

  onEvent(event, payload) {},
});
