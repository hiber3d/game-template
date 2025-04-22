#include <Example/ExampleEvents.hpp>
#include <Example/ExampleModule.hpp>

#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Editor/Editor.hpp>
#include <Hiber3D/Editor/EditorSettings.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Hiber3DModule.hpp>
#include <Hiber3D/Math/Quaternion.hpp>
#include <Hiber3D/Physics/PhysicsComponents.hpp>
#include <Hiber3D/Renderer/Light.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

#include <stdio.h>

static void showDebugLines(Hiber3D::Singleton<Hiber3D::Editor> editor) {
    editor->setSettings(Hiber3D::EditorSettings{
        .physicsVisualization = Hiber3D::PhysicsSettings::DebugVisualization{
            .enabled              = true,
            .drawWireFrame        = true,
            .drawVelocity         = true,
            .drawSupportDirection = false,
            .drawBoundingBox      = false,
            .drawCenterOfMass     = false,
        },
    });
}

static void hideDebugLines(Hiber3D::Singleton<Hiber3D::Editor> editor) {
    editor->setSettings(Hiber3D::EditorSettings{
        .physicsVisualization = Hiber3D::PhysicsSettings::DebugVisualization{
            .enabled              = false,
            .drawWireFrame        = false,
            .drawVelocity         = false,
            .drawSupportDirection = false,
            .drawBoundingBox      = false,
            .drawCenterOfMass     = false,
        },
    });
}

class MainModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override {
        context.registerModule<Hiber3D::Hiber3DModule>();

        context.registerModule<ExampleModule>();
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::ExternalImpulse>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::ExternalForce>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::Velocity>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::Light>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerPosition>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<BulletShot>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerJoined>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerLeft>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerUpdate>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<RemoteBulletShot>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerFunction<[](Hiber3D::Quaternion& quaternion) { return quaternion.toEulerRollPitchYaw(); }>(context, "toEulerRollPitchYaw");

        context.addSystem(Hiber3D::Schedule::ON_START_EDIT, showDebugLines);
        context.addSystem(Hiber3D::Schedule::ON_START, hideDebugLines);
    }
};

int main(int argc, char* argv[]) {
    Hiber3D::run("GameTemplate", std::make_unique<MainModule>(), Hiber3D::ApplicationRunMode::GraphicalApp, argc, argv);
    return 0;
}
