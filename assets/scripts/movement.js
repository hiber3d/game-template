/**
 * This script handles keyboard movement for the entity it is attached to.
 */
const MOVEMENT_KEYS = {
  FORWARD: 41, // W
  BACKWARD: 37, // S
  STRAFE_LEFT: 19, // A
  STRAFE_RIGHT: 22, // D
};

const MOVEMENT_SPEED = 10000; // meters per second

function generateArena(cols, rows, tileSize, wallThickness, openness) {
  // helper to spawn one wall box
  function _createWall(px, py, pz, sx, sy, sz) {
    var wall = hiber3d.createEntity();
    hiber3d.addComponent(wall, "Hiber3D::Transform");
    hiber3d.setValue(wall, "Hiber3D::Transform", "position", { x: px, y: py, z: pz });
    hiber3d.setValue(wall, "Hiber3D::Transform", "scale",    { x: sx, y: sy, z: sz });
    hiber3d.addComponent(wall, "Hiber3D::SceneRoot");
    hiber3d.setValue(wall, "Hiber3D::SceneRoot", "scene", "scenes/Wall.scene");
    const children = hiber3d.getValue(wall, "Hiber3D::Children");
    hiber3d.print(children);
  }

  // ── 1) Outer boundary ───────────────────────────────────────
  for (var x = 0; x < cols; x++) {
    // top
    _createWall(
      (x + 0.5) * tileSize, 0, 0,
      tileSize + wallThickness, 1, wallThickness
    );
    // bottom
    _createWall(
      (x + 0.5) * tileSize, 0, rows * tileSize,
      tileSize + wallThickness, 1, wallThickness
    );
  }
  for (var y = 0; y < rows; y++) {
    // left
    _createWall(
      0, 0, (y + 0.5) * tileSize,
      wallThickness, 1, tileSize + wallThickness
    );
    // right
    _createWall(
      cols * tileSize, 0, (y + 0.5) * tileSize,
      wallThickness, 1, tileSize + wallThickness
    );
  }

  // ── 2) Interior maze setup ─────────────────────────────────
  var iCols = cols - 2,
      iRows = rows - 2;

  // visited flags
  var visited = [];
  for (var yy = 0; yy < iRows; yy++) {
    visited[yy] = [];
    for (var xx = 0; xx < iCols; xx++) {
      visited[yy][xx] = false;
    }
  }

  // all interior edges present initially
  var hEdges = [], vEdges = [];
  for (yy = 0; yy <= iRows; yy++) {
    hEdges[yy] = [];
    for (xx = 0; xx < iCols; xx++) {
      hEdges[yy][xx] = true;
    }
  }
  for (xx = 0; xx <= iCols; xx++) {
    vEdges[xx] = [];
    for (yy = 0; yy < iRows; yy++) {
      vEdges[xx][yy] = true;
    }
  }

  // carve a perfect maze via DFS
  function carve(cx, cy) {
    visited[cy][cx] = true;
    var dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    for (var i = dirs.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)),
          tmp = dirs[i];
      dirs[i] = dirs[j];
      dirs[j] = tmp;
    }
    for (i = 0; i < dirs.length; i++) {
      var d = dirs[i],
          nx = cx + d[0],
          ny = cy + d[1];
      if (nx >= 0 && nx < iCols && ny >= 0 && ny < iRows && !visited[ny][nx]) {
        // knock down corresponding edge
        if (d[0] === 1)       vEdges[cx+1][cy] = false;
        else if (d[0] === -1) vEdges[cx][cy]   = false;
        else if (d[1] === 1)  hEdges[cy+1][cx] = false;
        else                  hEdges[cy][cx]   = false;
        carve(nx, ny);
      }
    }
  }
  carve(0, 0);

  // ── 3) Randomly remove more walls based on `openness` ───────
  //  openness: 0 = keep perfect maze, 1 = remove all interior walls
  for (yy = 0; yy <= iRows; yy++) {
    for (xx = 0; xx < iCols; xx++) {
      if (hEdges[yy][xx] && Math.random() < openness) {
        hEdges[yy][xx] = false;
      }
    }
  }
  for (xx = 0; xx <= iCols; xx++) {
    for (yy = 0; yy < iRows; yy++) {
      if (vEdges[xx][yy] && Math.random() < openness) {
        vEdges[xx][yy] = false;
      }
    }
  }

  // ── 4) Draw interior walls ──────────────────────────────────
  for (yy = 0; yy <= iRows; yy++) {
    for (xx = 0; xx < iCols; xx++) {
      if (hEdges[yy][xx]) {
        _createWall(
          ((xx + 1) + 0.5) * tileSize, 0, (yy + 1) * tileSize,
          tileSize + wallThickness, 1, wallThickness
        );
      }
    }
  }
  for (xx = 0; xx <= iCols; xx++) {
    for (yy = 0; yy < iRows; yy++) {
      if (vEdges[xx][yy]) {
        _createWall(
          (xx + 1) * tileSize, 0, ((yy + 1) + 0.5) * tileSize,
          wallThickness, 1, tileSize + wallThickness
        );
      }
    }
  }
}



({

  onCreate() {
    // generateArena(10, 10, 10, 0.2, 0.4);
    hiber3d.addEventListener(this.entity, "Hiber3D::CollisionStarted");
  },

  update(dt) {
    // Get the transform component
    var force = { x: 0, y: 0, z: 0 };
    const transform = hiber3d.getValue(this.entity, "Hiber3D::Transform");



    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.FORWARD)) {
      force.z = -MOVEMENT_SPEED;
    }
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.BACKWARD)) {
      force.z = MOVEMENT_SPEED;
    }
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.STRAFE_LEFT)) {
      transform.rotation  = hiber3d.call("quaternionRotateAroundAxis", transform.rotation, {x: 0, y: 1, z: 0}, 0.05);
    }
    if (hiber3d.call("keyIsPressed", MOVEMENT_KEYS.STRAFE_RIGHT)) {
      transform.rotation  = hiber3d.call("quaternionRotateAroundAxis", transform.rotation, {x: 0, y: 1, z: 0}, -0.05);
    }

    const euler = hiber3d.call('toEulerRollPitchYaw', transform.rotation);
    euler.x = 0;
    euler.z = 0;

    transform.rotation = hiber3d.call('quaternionFromEuler', euler);

    const forceRotated = hiber3d.call("quaternionRotateDirection", transform.rotation, force);
    // hiber3d.print(hiber3d.call('quaternionGetY', transform.rotation));

    // Get updated transform component
    transform.position.y = 0.4;
    hiber3d.setValue(this.entity, "Hiber3D::Transform", transform);
    hiber3d.setValue(this.entity, "Hiber3D::ExternalForce", "force", forceRotated);
    const velocity = hiber3d.getValue(this.entity, "Hiber3D::Velocity", "linear");

    hiber3d.writeEvent("PlayerPosition", {
      x: transform.position.x,
      z: transform.position.z,
      rotX: transform.rotation.x,
      rotY: transform.rotation.y,
      rotZ: transform.rotation.z,
      rotW: transform.rotation.w,
      velocityX: velocity.x,
      velocityZ: velocity.z,
    });
  },

  onEvent(event, payload) {
    if (event === 'Hiber3D::CollisionStarted') {
      if (payload.entity1 === this.entity && hiber3d.hasScripts(payload.entity2, "scripts/bullet-with-physics.js") || 
      payload.entity2 === this.entity && hiber3d.hasScripts(payload.entity1, "scripts/bullet-with-physics.js")) {
        const me = payload.entity1 === this.entity ? payload.entity1 : payload.entity2;
        hiber3d.destroyEntity(me);
      }
    }
  },
});