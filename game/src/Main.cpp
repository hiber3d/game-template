#include <Modules/ExampleModule.hpp>

#include <Hiber3D/Asset/AssetModule.hpp>
#include <Hiber3D/BaseAssets/Cubemap.hpp>
#include <Hiber3D/BaseAssets/Material.hpp>
#include <Hiber3D/BaseAssets/Mesh.hpp>
#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Gltf/GltfModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Modules/Log/LogModule.hpp>
#include <Hiber3D/Modules/Renderer/RenderModule.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>

#include <Generated/EventModule.hpp>
#include <stdio.h>

class MainModule : public Hiber3D::Module {
public:
    std::string_view name() override { return "MainModule"; }

    void onRegister(Hiber3D::InitContext& context) override {
        context.registerModule<Hiber3D::AssetModule>();
        context.registerModule<Hiber3D::LogModule>();
        context.registerModule<Hiber3D::RenderModule>();
        context.registerModule<Hiber3D::GltfModule>();
        context.registerModule<Hiber3D::SceneModule>();
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::Mesh>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::StandardMaterial>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::Cubemap>(context);

        context.registerModule<EventModule>();

        context.registerModule<ExampleModule>();
    }
};

int main(int argc, char* argv[]) {
    Hiber3D::run("GameTemplate", std::make_unique<MainModule>(), argc, argv);
    return 0;
}
