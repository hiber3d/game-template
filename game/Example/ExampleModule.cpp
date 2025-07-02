#include <Example/ExampleEvents.hpp>
#include <Example/ExampleModule.hpp>
#include <Example/ExampleTypes.hpp>

#include <Hiber3D/Asset/AssetModule.hpp>
#include <Hiber3D/Asset/AssetPath.hpp>
#include <Hiber3D/Asset/AssetServer.hpp>
#include <Hiber3D/BaseAssets/Cubemap.hpp>
#include <Hiber3D/BaseAssets/Texture.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Renderer/RenderEnvironment.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

void loadEnvironment(
    Hiber3D::Singleton<Hiber3D::RenderEnvironment>        env,
    Hiber3D::Singleton<Hiber3D::AssetServer>              server,
    Hiber3D::Singleton<Hiber3D::Assets<Hiber3D::Cubemap>> cubemaps) {
    auto lightbox = server->loadProcedural<Hiber3D::Cubemap>(
        Hiber3D::AssetPath("lightbox"),
        [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
            return Hiber3D::Cubemap{
                .posX = ctx.load<Hiber3D::Texture>("environments/light_px.png"),
                .negX = ctx.load<Hiber3D::Texture>("environments/light_nx.png"),
                .posY = ctx.load<Hiber3D::Texture>("environments/light_py.png"),
                .negY = ctx.load<Hiber3D::Texture>("environments/light_ny.png"),
                .posZ = ctx.load<Hiber3D::Texture>("environments/light_pz.png"),
                .negZ = ctx.load<Hiber3D::Texture>("environments/light_nz.png"),
            };
        });

    auto skybox = server->loadProcedural<Hiber3D::Cubemap>(
        Hiber3D::AssetPath("skybox"),
        [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
            return Hiber3D::Cubemap{
                .posX = ctx.load<Hiber3D::Texture>("environments/sky_px.png"),
                .negX = ctx.load<Hiber3D::Texture>("environments/sky_nx.png"),
                .posY = ctx.load<Hiber3D::Texture>("environments/sky_py.png"),
                .negY = ctx.load<Hiber3D::Texture>("environments/sky_ny.png"),
                .posZ = ctx.load<Hiber3D::Texture>("environments/sky_pz.png"),
                .negZ = ctx.load<Hiber3D::Texture>("environments/sky_nz.png"),
            };
        });

    auto reflectionbox = server->loadProcedural<Hiber3D::Cubemap>(
        Hiber3D::AssetPath("reflectionbox"),
        [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
            return Hiber3D::Cubemap{
                .posX = ctx.load<Hiber3D::Texture>("environments/reflection_px.png"),
                .negX = ctx.load<Hiber3D::Texture>("environments/reflection_nx.png"),
                .posY = ctx.load<Hiber3D::Texture>("environments/reflection_py.png"),
                .negY = ctx.load<Hiber3D::Texture>("environments/reflection_ny.png"),
                .posZ = ctx.load<Hiber3D::Texture>("environments/reflection_pz.png"),
                .negZ = ctx.load<Hiber3D::Texture>("environments/reflection_nz.png"),
            };
        });

    env->exposureCompensation = 0.5f;

    env->skybox.cubemap = skybox;

    env->lightbox.brightness = 1.0f;
    env->lightbox.cubemap    = lightbox;

    env->reflectionbox.brightness = 1.0f;
    env->reflectionbox.cubemap    = reflectionbox;

    env->fog.enabled        = true;
    env->fog.density        = 0.00003f;
    env->fog.height         = 30.0f;
    env->fog.color          = Hiber3D::float3{0.2f, 0.4f, 0.6f};
    env->fog.skyboxAlpha    = 1.0f;
    env->fog.skyboxGradient = 0.01f;

    env->bloom.enabled             = true;
    env->bloom.brightnessThreshold = 0.95f;
    env->bloom.blendAlpha          = 0.3f;

    env->colorGrading.enabled    = true;
    env->colorGrading.saturation = 1.0f;
    env->colorGrading.contrast   = 1.01f;

    env->sun.strength    = 1.5f;
    env->sun.directionWS = Hiber3D::float3{1.1f, 1.57f, -1.00f};
    env->sun.color       = Hiber3D::float3{1.0f, 1.0f, 1.0f};
}

void ExampleModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_START, loadEnvironment);
    context.addSystem(Hiber3D::Schedule::ON_START_EDIT, loadEnvironment);

    // Show in editor inspector
    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::EditorModule>().registerComponent<ExampleComponent>(context);
    }

    // Make available in scripts
    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<ExampleComponent>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<GunStateChangedEvent>(context);
    }

    // Saved to scene file
    if (context.isModuleRegistered<Hiber3D::SceneModule>()) {
        context.getModule<Hiber3D::SceneModule>().registerComponent<ExampleComponent>(context);
    }
}