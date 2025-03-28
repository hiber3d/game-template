#include <Gun/GunEvents.hpp>
#include <Gun/GunModule.hpp>
#include <Gun/GunTypes.hpp>

#include <Hiber3D/Asset/AssetServer.hpp>
#include <Hiber3D/Core/KeyEvent.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Input/Types.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scene/SceneRoot.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>
#include <Hiber3D/WorldTransform/ComputedWorldTransform.hpp>

static void shootGun(
    Hiber3D::Registry&                                                    registry,
    Hiber3D::Singleton<Hiber3D::AssetServer>                              assetServer,
    const Hiber3D::View<const Gun, const Hiber3D::ComputedWorldTransform> guns,
    const Hiber3D::Singleton<const Hiber3D::KeyboardState>                keyboardState,
    Hiber3D::EventWriter<GunFired>&                                       eventWriter) {

    if (keyboardState->justPressed(Hiber3D::Key::SPACE)) {
        for (auto [gunEntity, gun, gunComputedWorldTransform] : guns.each()) {
            const auto bulletEntity = registry.create();

            auto& bulletSceneRoot = registry.emplace<Hiber3D::SceneRoot>(bulletEntity);
            bulletSceneRoot.scene = gun.bulletSceneHandle;

            registry.emplace<Hiber3D::Transform>(bulletEntity, gunComputedWorldTransform);

            auto& name = registry.emplace<Hiber3D::Name>(bulletEntity);
            name += "Bullet";

            auto& scriptInstance = registry.emplace<Hiber3D::ScriptInstance>(bulletEntity);
            scriptInstance.scripts.emplace_back(assetServer->load<Hiber3D::Script>("scripts/bullet.js"));

            eventWriter.writeEvent({.gunEntity = gunEntity, .bulletEntity = bulletEntity});
        }
    }
}

void GunModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_TICK, shootGun);

    // Show in editor inspector
    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::EditorModule>().registerComponent<Gun>(context);
    }

    // Available in scripts
    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Gun>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<GunFired>(context);
    }

    // Saved to scene file
    if (context.isModuleRegistered<Hiber3D::SceneModule>()) {
        context.getModule<Hiber3D::SceneModule>().registerComponent<Gun>(context);
    }
}