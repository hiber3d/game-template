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
#include <Hiber3D/BaseAssets/Material.hpp>
#include <Hiber3D/Core/Registry.hpp>

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

    // auto skybox = server->loadProcedural<Hiber3D::Cubemap>(
    //     Hiber3D::AssetPath("skybox"),
    //     [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
    //         return Hiber3D::Cubemap{
    //             .posX = ctx.load<Hiber3D::Texture>("environments/space_bottom.png"),
    //             .negX = ctx.load<Hiber3D::Texture>("environments/space_bottom.png"),
    //             .posY = ctx.load<Hiber3D::Texture>("environments/space_bottom.png"),
    //             .negY = ctx.load<Hiber3D::Texture>("environments/space_bottom.png"),
    //             .posZ = ctx.load<Hiber3D::Texture>("environments/space_bottom.png"),
    //             .negZ = ctx.load<Hiber3D::Texture>("environments/space_bottom.png"),
    //         };
    //     });

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

    // env->skybox.cubemap = skybox;

    env->lightbox.brightness = 1.0f;
    env->lightbox.cubemap    = lightbox;

    env->reflectionbox.brightness = 1.0f;
    env->reflectionbox.cubemap    = reflectionbox;

    env->fog.enabled        = false;
    env->fog.density        = 0.00003f;
    env->fog.height         = 30.0f;
    env->fog.color          = Hiber3D::float3{0.2f, 0.4f, 0.6f};
    env->fog.skyboxAlpha    = 1.0f;
    env->fog.skyboxGradient = 0.01f;

    env->bloom.enabled            = true;
    env->bloom.brightnessTreshold = 0.95f;
    env->bloom.blendAlpha         = 0.3f;

    env->colorGrading.enabled    = true;
    env->colorGrading.saturation = 1.0f;
    env->colorGrading.contrast   = 1.01f;

    env->sun.strength    = 1.5f;
    env->sun.directionWS = Hiber3D::float3{1.1f, 1.57f, -1.00f};
    env->sun.color       = Hiber3D::float3{1.0f, 1.0f, 1.0f};
}

struct PlayerMaterial {
    std::string name;
    std::string texture;
}; 

struct PlayerMaterialState {
    std::vector<PlayerMaterial> materials;
};

void applyPlayerMaterials(
    Hiber3D::Registry& registry,
    Hiber3D::View<PlayerName, Hiber3D::Renderable> playerNames,
    Hiber3D::Singleton<Hiber3D::AssetServer>       server) {
    for (auto [entity, playerName, renderable] : playerNames.each()) {
        if (renderable.material.handle == Hiber3D::AssetBaseHandleType(0) && playerName.name != "") {
            Hiber3D::FixedString<320> url     = Hiber3D::formatFixedString<320>("https://placehold.co/400x30/transparent/white/png?text={}&.png", playerName.name);
            auto& materials      = registry.singleton<Hiber3D::Assets<Hiber3D::StandardMaterial>>();
            auto  materialHandle = materials.add(Hiber3D::StandardMaterial{
                 .albedoColor   = Hiber3D::float4(1.0f, 1.0f, 1.0f, 1.0f),
                 .albedoTexture = server->load<Hiber3D::Texture>(Hiber3D::AssetPath(url.str())),
                 .alphaClipping = {.enabled = true, .threshold = 0.5f},
            });

            renderable.material = materialHandle;
        }
    }
}

void ExampleModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_START, loadEnvironment);
    context.addSystem(Hiber3D::Schedule::ON_START_EDIT, loadEnvironment);
    context.addSystem(Hiber3D::Schedule::ON_TICK, applyPlayerMaterials);

    // Show in editor inspector
    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::EditorModule>().registerComponent<ExampleComponent>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<PlayerName>(context);
    }

    // Make available in scripts
    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<ExampleComponent>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<PlayerName>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<GameStarted>(context);
    }

    // Saved to scene file
    if (context.isModuleRegistered<Hiber3D::SceneModule>()) {
        context.getModule<Hiber3D::SceneModule>().registerComponent<ExampleComponent>(context);
        context.getModule<Hiber3D::SceneModule>().registerComponent<PlayerName>(context);
    }
    
}