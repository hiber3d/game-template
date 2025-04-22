function generateArena(seed, cols, rows, tileSize, wallThickness, openness) {
  // 0) Seeded RNG (Mulberry32)
  function createSeededRNG(s) {
    return function () {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var rand = createSeededRNG(seed);

  // compute center offset
  var totalWidth = cols * tileSize;
  var totalDepth = rows * tileSize;
  var originX = -totalWidth / 2;
  var originZ = -totalDepth / 2;

  // helper: spawn one wall via your Wall.scene + setTransform.js
  function generateWall(px, py, pz, sx, sy, sz) {
    var wall = hiber3d.createEntity();
    hiber3d.addComponent(wall, "Hiber3D::Transform");
    hiber3d.addComponent(wall, "Hiber3D::SceneRoot");
    hiber3d.setValue(wall, "Hiber3D::SceneRoot", "scene", "scenes/Wall.scene");

    var script = hiber3d.addScript(wall, "scripts/setTransform.js");
    script.transform = {
      position: { x: originX + px, y: py, z: originZ + pz },
      scale: { x: sx, y: sy, z: sz },
    };
  }

  // 1) Outer boundary
  for (var x = 0; x < cols; x++) {
    generateWall((x + 0.5) * tileSize, 0, 0, tileSize + wallThickness, 1, wallThickness);
    generateWall((x + 0.5) * tileSize, 0, rows * tileSize, tileSize + wallThickness, 1, wallThickness);
  }
  for (var y = 0; y < rows; y++) {
    generateWall(0, 0, (y + 0.5) * tileSize, wallThickness, 1, tileSize + wallThickness);
    generateWall(cols * tileSize, 0, (y + 0.5) * tileSize, wallThickness, 1, tileSize + wallThickness);
  }

  // 2) Interior maze carve
  var iCols = cols - 2,
    iRows = rows - 2;

  // visited flags
  var visited = [];
  for (var yy = 0; yy < iRows; yy++) {
    visited[yy] = [];
    for (var xx = 0; xx < iCols; xx++) visited[yy][xx] = false;
  }

  // interior edges present
  var hEdges = [],
    vEdges = [];
  for (yy = 0; yy <= iRows; yy++) {
    hEdges[yy] = [];
    for (xx = 0; xx < iCols; xx++) hEdges[yy][xx] = true;
  }
  for (xx = 0; xx <= iCols; xx++) {
    vEdges[xx] = [];
    for (yy = 0; yy < iRows; yy++) vEdges[xx][yy] = true;
  }

  function carve(cx, cy) {
    visited[cy][cx] = true;
    var dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    // shuffle with rand()
    for (var i = dirs.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1)),
        tmp = dirs[i];
      dirs[i] = dirs[j];
      dirs[j] = tmp;
    }
    for (i = 0; i < dirs.length; i++) {
      var d = dirs[i],
        nx = cx + d[0],
        ny = cy + d[1];
      if (nx >= 0 && nx < iCols && ny >= 0 && ny < iRows && !visited[ny][nx]) {
        if (d[0] === 1) vEdges[cx + 1][cy] = false;
        else if (d[0] === -1) vEdges[cx][cy] = false;
        else if (d[1] === 1) hEdges[cy + 1][cx] = false;
        else hEdges[cy][cx] = false;
        carve(nx, ny);
      }
    }
  }
  carve(0, 0);

  // 3) Randomly remove extra walls by openness
  for (yy = 0; yy <= iRows; yy++) {
    for (xx = 0; xx < iCols; xx++) {
      if (hEdges[yy][xx] && rand() < openness) hEdges[yy][xx] = false;
    }
  }
  for (xx = 0; xx <= iCols; xx++) {
    for (yy = 0; yy < iRows; yy++) {
      if (vEdges[xx][yy] && rand() < openness) vEdges[xx][yy] = false;
    }
  }

  // 4) Draw interior walls
  for (yy = 0; yy <= iRows; yy++) {
    for (xx = 0; xx < iCols; xx++) {
      if (hEdges[yy][xx]) {
        generateWall((xx + 1 + 0.5) * tileSize, 0, (yy + 1) * tileSize, tileSize + wallThickness, 1, wallThickness);
      }
    }
  }
  for (xx = 0; xx <= iCols; xx++) {
    for (yy = 0; yy < iRows; yy++) {
      if (vEdges[xx][yy]) {
        generateWall((xx + 1) * tileSize, 0, (yy + 1 + 0.5) * tileSize, wallThickness, 1, tileSize + wallThickness);
      }
    }
  }
}

({
  onCreate() {
    generateArena(1, 10, 10, 6, 0.2, 0.4);
  },
});
