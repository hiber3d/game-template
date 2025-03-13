function rotateVectorByQuaternion(vec, quat) {
  // Extract quaternion components
  var qx = quat.x;
  var qy = quat.y;
  var qz = quat.z;
  var qw = quat.w;

  // Extract vector components
  var vx = vec.x;
  var vy = vec.y;
  var vz = vec.z;

  // First half: multiply q * v  (treating v as a pure quaternion [vx, vy, vz, 0])
  var ix = qw * vx + qy * vz - qz * vy;
  var iy = qw * vy + qz * vx - qx * vz;
  var iz = qw * vz + qx * vy - qy * vx;
  var iw = -qx * vx - qy * vy - qz * vz;

  // Second half: multiply the result by conj(q) = ( -qx, -qy, -qz, qw )
  // NOTE the critical signs on the cross terms here:
  var rx = ix * qw - iw * qx - iy * qz + iz * qy;
  var ry = iy * qw - iw * qy - iz * qx + ix * qz;
  var rz = iz * qw - iw * qz - ix * qy + iy * qx;

  return { x: rx, y: ry, z: rz };
}

function axisAngleToQuaternion(axisX, axisY, axisZ, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180.0;
  const halfAngle = angleRad / 2;
  const s = Math.sin(halfAngle);

  return {
    x: axisX * s,
    y: axisY * s,
    z: axisZ * s,
    w: Math.cos(halfAngle),
  };
}

function multiplyQuaternions(q1, q2) {
  // q1 = (x1, y1, z1, w1)
  // q2 = (x2, y2, z2, w2)
  // result = q1 * q2
  return {
    w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
    x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
    y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
    z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w,
  };
}

function rotateQuaternionAroundY(q, deltaDeg) {
  // 1) Create the small “delta” rotation around Y by deltaDeg
  const deltaRot = axisAngleToQuaternion(0, 1, 0, deltaDeg);

  // 2) Multiply: q_new = q * deltaRot
  //    (this applies a rotation around the *local* Y-axis of q)
  return multiplyQuaternions(q, deltaRot);
}

({
  holdingKeys: {},
  speed: 3,
  rotationSpeed: 3,
  cameraOffset: {
    x: 0,
    y: 4,
    z: 8,
  },
  lookDirOffset: {
    x: 0,
    y: 2,
    z: 0,
  },

  // TODO: Move to separate script
  numberOfPickups: 10,
  placementRadius: 30,
  pickups: [],
  points: [],

  onCreate() {
    hiber3d.addEventListener(this.entity, "Hiber3D::KeyEvent");

    const children = hiber3d.getValue(
      this.entity,
      "Hiber3D::Children",
      "entities"
    );

    this.camera = hiber3d.createEntity();
    hiber3d.addComponent(this.camera, "Hiber3D::Camera");
    hiber3d.setValue(this.camera, "Hiber3D::Camera", "priority", 1001);
    hiber3d.addComponent(this.camera, "Hiber3D::Transform");

    hiber3d.addComponent(this.camera, "Hiber3D::Parent");
    hiber3d.setValue(this.camera, "Hiber3D::Parent", this.entity);
    hiber3d.setValue(this.camera, "Hiber3D::Transform", "rotation", {x:0,y:1,z:0,w:0});
    children.push(this.camera);

    // TODO: Move to separate script
    for (var i = 0; i < this.numberOfPickups; i++) {
      const entity = hiber3d.createEntity();
      this.pickups.push(entity);
      hiber3d.addComponent(entity, "Hiber3D::Transform");
      hiber3d.addComponent(entity, "Hiber3D::SceneRoot");
      hiber3d.setValue(
        entity,
        "Hiber3D::SceneRoot",
        "scene",
        "glbs/sphere.glb#scene0"
      );

      const x = Math.random() * this.placementRadius * 2 - this.placementRadius;
      const z = Math.random() * this.placementRadius * 2 - this.placementRadius;
      hiber3d.setValue(entity, "Hiber3D::Transform", "position", {
        x,
        y: 0,
        z,
      });
    }

    for (var i = 0; i < this.pickups.length; i++) {
      const cube = hiber3d.createEntity();
      this.points.push(cube);
      hiber3d.addComponent(cube, "Hiber3D::Transform");
      hiber3d.addComponent(cube, "Hiber3D::Renderable");
      hiber3d.setValue(
        cube,
        "Hiber3D::Renderable",
        "mesh",
        "glbs/cube.glb#mesh0/primitive0"
      );
      hiber3d.setValue(
        cube,
        "Hiber3D::Renderable",
        "material",
        "glbs/cube.glb#material0"
      );
      hiber3d.setValue(cube, "Hiber3D::Transform", "position", {
        x: (this.pickups.length / 2) * 0.3 - i * 0.3,
        y: 5,
      });
      hiber3d.setValue(cube, "Hiber3D::Transform", "scale", {
        x: 0.1,
        y: 0.3,
        z: 0.1,
      });

      // Add children and parent components
      hiber3d.addComponent(cube, "Hiber3D::Parent");
      hiber3d.setValue(cube, "Hiber3D::Parent", this.entity);
      children.push(cube);
    }

    hiber3d.setValue(this.entity, "Hiber3D::Children", "entities", children);
  },

  update() {
    hiber3d.setValue(this.camera, "Hiber3D::Transform", "position", {
      x: 0,
      y: 3,
      z: -7,
    });

    var x = hiber3d.getValue(
      this.entity,
      "Hiber3D::Transform",
      "position",
      "x"
    );
    var z = hiber3d.getValue(
      this.entity,
      "Hiber3D::Transform",
      "position",
      "z"
    );
    var y = hiber3d.getValue(
      this.entity,
      "Hiber3D::Transform",
      "position",
      "y"
    );
    var rotation = hiber3d.getValue(
      this.entity,
      "Hiber3D::Transform",
      "rotation"
    );

    var worldForward = rotateVectorByQuaternion(
      { x: 0, y: 0, z: 1 },
      rotation
    );
    var worldLeft = rotateVectorByQuaternion({ x: -1, y: 0, z: 0 }, rotation);
    var step = 0.1 * this.speed;

    if (this.holdingKeys[41]) {
      x += worldForward.x * step;
      y += worldForward.y * step;
      z += worldForward.z * step;
    }
    if (this.holdingKeys[37]) {
      x -= worldForward.x * step;
      y -= worldForward.y * step;
      z -= worldForward.z * step;
    }
    if (this.holdingKeys[19]) {
      x -= worldLeft.x * step;
      y -= worldLeft.y * step;
      z -= worldLeft.z * step;
    }
    if (this.holdingKeys[22]) {
      x += worldLeft.x * step;
      y += worldLeft.y * step;
      z += worldLeft.z * step;
    }
    if (this.holdingKeys[1]) {
      y += 0.1 * this.speed;
    }
    if (this.holdingKeys[112]) {
      y -= 0.1 * this.speed;
    }

    if (this.holdingKeys[58]) {
      rotation = rotateQuaternionAroundY(rotation, this.rotationSpeed);
    }
    if (this.holdingKeys[57]) {
      rotation = rotateQuaternionAroundY(rotation, -this.rotationSpeed);
    }

    y = Math.max(0, y);

    hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "x", x);
    hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "z", z);
    hiber3d.setValue(this.entity, "Hiber3D::Transform", "position", "y", y);
    hiber3d.setValue(this.entity, "Hiber3D::Transform", "rotation", rotation);

    // TODO: Move to separate script
    // Check if this entity is within range of any pickups
    for (var i = 0; i < this.pickups.length; i++) {
      const pickup = this.pickups[i];
      const pickupX = hiber3d.getValue(
        pickup,
        "Hiber3D::Transform",
        "position",
        "x"
      );
      const pickupZ = hiber3d.getValue(
        pickup,
        "Hiber3D::Transform",
        "position",
        "z"
      );
      const pickupY = hiber3d.getValue(
        pickup,
        "Hiber3D::Transform",
        "position",
        "y"
      );
      const distance = Math.sqrt(
        (x - pickupX) * (x - pickupX) +
          (z - pickupZ) * (z - pickupZ) +
          (y - pickupY) * (y - pickupY)
      );
      if (distance < 1) {
        hiber3d.setValue(pickup, "Hiber3D::Transform", "position", "y", -100);
        this.pickups.splice(i, 1);
        i--;
        hiber3d.print("Picked up a pickup! " + this.pickups.length + " left.");
        // Change material on point
        hiber3d.setValue(
          this.points[this.pickups.length],
          "Hiber3D::Renderable",
          "material",
          "glbs/ooze_01.glb#material0"
        );

        if (this.pickups.length === 0) {
          const win = hiber3d.createEntity();
          hiber3d.addComponent(win, "Hiber3D::Transform");
          hiber3d.setValue(win, "Hiber3D::Transform", "scale", {
            x: 30,
            y: 30,
            z: 30,
          });
          hiber3d.addComponent(win, "Hiber3D::SceneRoot");
          hiber3d.setValue(
            win,
            "Hiber3D::SceneRoot",
            "scene",
            "glbs/skeleton_01.glb#scene0"
          );
        }
      }
    }
  },

  onEvent(event, payload) {
    if (event === "Hiber3D::KeyEvent") {
      // hiber3d.print(payload.key)
      this.holdingKeys[payload.key] = payload.type === 0;
      return;
    }
  },
});
