#include <Modules/ExampleModule/ExampleModule.hpp>
#include <Hiber3D/Asset/AssetModule.hpp>
#include <Hiber3D/Asset/AssetPath.hpp>
#include <Hiber3D/BaseAssets/Cubemap.hpp>
#include <Hiber3D/Asset/AssetServer.hpp>
#include <Hiber3D/BaseAssets/Texture.hpp>
#include <Hiber3D/Renderer/RenderEnvironment.hpp>

void loadEnvironment(
    Hiber3D::Singleton<Hiber3D::RenderEnvironment>        env,
    Hiber3D::Singleton<Hiber3D::AssetServer>              server,
    Hiber3D::Singleton<Hiber3D::Assets<Hiber3D::Cubemap>> cubemaps) {
    auto lightbox = server->loadProcedural<Hiber3D::Cubemap>(
        Hiber3D::AssetPath("lightbox"),
        [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
            return Hiber3D::Cubemap{
                .posX = ctx.load<Hiber3D::Texture>("environments/night_light_posx.ktx2"),
                .negX = ctx.load<Hiber3D::Texture>("environments/night_light_negx.ktx2"),
                .posY = ctx.load<Hiber3D::Texture>("environments/night_light_posy.ktx2"),
                .negY = ctx.load<Hiber3D::Texture>("environments/night_light_negy.ktx2"),
                .posZ = ctx.load<Hiber3D::Texture>("environments/night_light_posz.ktx2"),
                .negZ = ctx.load<Hiber3D::Texture>("environments/night_light_negz.ktx2"),
            };
        });

    env->exposureCompensation = 0.5f;

    env->skybox.cubemap = lightbox;

    env->lightbox.brightness = 1.3f;
    env->lightbox.cubemap    = lightbox;

    env->reflectionbox.brightness = 1.0f;
    env->reflectionbox.cubemap    = lightbox;

    env->fog.enabled        = true;
    env->fog.density        = 0.00003f;
    env->fog.height         = 30.0f;
    env->fog.color          = Hiber3D::float3{0.2f, 0.4f, 0.6f};
    env->fog.skyboxAlpha    = 1.0f;
    env->fog.skyboxGradient = 0.01f;

    env->bloom.enabled            = false;
    env->bloom.brightnessTreshold = 0.65f;
    env->bloom.blendAlpha         = 1.0f;

    env->colorGrading.enabled    = true;
    env->colorGrading.saturation = 1.0f;
    env->colorGrading.contrast   = 1.01f;

    env->sun.strength    = 2.5f;
    env->sun.directionWS = Hiber3D::float3{-0.5f, 0.7f, 0.5f};
    env->sun.color       = Hiber3D::float3{1.0f, 1.0f, 1.0f};
}

void ExampleModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_START, loadEnvironment);
    context.addSystem(Hiber3D::Schedule::ON_START_EDIT, loadEnvironment);
}