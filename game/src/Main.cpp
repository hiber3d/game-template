#include "generated/EventModule.hpp"

#include "modules/camera_module/CameraModule.hpp"
#include "modules/gameplay_module/GameplayModule.hpp"
#include "modules/performance_module/PerformanceModule.hpp"
#include "modules/screen_state_module/ScreenStateModule.hpp"

#include <Hiber3D/Asset/AssetModule.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Gltf/GltfModule.hpp>
#include <Hiber3D/BaseAssets/Cubemap.hpp>
#include <Hiber3D/BaseAssets/Mesh.hpp>
#include <Hiber3D/BaseAssets/Material.hpp>
#include <Hiber3D/BaseAssets/Texture.hpp>
#include <Hiber3D/BaseAssets/TextureLoader.hpp>
#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Modules/Animation/AnimationModule.hpp>
#include <Hiber3D/Modules/Log/LogModule.hpp>
#include <Hiber3D/Modules/Renderer/RenderModule.hpp>
#include <Hiber3D/Modules/SkinnedAnimation/SkinnedAnimationModule.hpp>

#include <stdio.h>

class RPGModule : public Hiber3D::Module {
public:
    std::string_view name() override { return "RPGModule"; }

    void onRegister(Hiber3D::InitContext& context) override {
        context.registerModule<Hiber3D::AssetModule>();
        context.registerModule<Hiber3D::LogModule>();
        context.registerModule<Hiber3D::RenderModule>();
        context.registerModule<Hiber3D::GltfModule>();
        context.registerModule<Hiber3D::SceneModule>();
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::Mesh>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::StandardMaterial>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::Texture>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::Cubemap>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetLoader<Hiber3D::TextureLoader>(context);

        context.registerModule<EventModule>();

        context.registerModule<ExampleModule>();
    }
};

int main(int argc, char* argv[]) {
    Hiber3D::run("RPG", std::make_unique<RPGModule>(), argc, argv);
    return 0;
}
