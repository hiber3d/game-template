({
  onCreate() {
    // Load font
    hiber3d.call("rmlLoadFont", "fonts/Roboto-Regular.ttf");

    // Create gun data model
    hiber3d.call("rmlCreateDataModel", "gun");
  },
});
