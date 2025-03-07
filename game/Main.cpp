#include <Modules/ExampleModule/ExampleModule.hpp>

#include <Hiber3D/Asset/AssetModule.hpp>
#include <Hiber3D/BaseAssets/Cubemap.hpp>
#include <Hiber3D/BaseAssets/Material.hpp>
#include <Hiber3D/BaseAssets/Mesh.hpp>
#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Gltf/GltfModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Interop/InteropModule.hpp>
#include <Hiber3D/Hierarchy/HierarchyModule.hpp>
#include <Hiber3D/Log/LogModule.hpp>
#include <Hiber3D/Renderer/RenderModule.hpp>
#include <Hiber3D/WorldTransform/WorldTransformModule.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scene/SceneManagerModule.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Debug/DebugModule.hpp>

#include <stdio.h>

class MainModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override {
        context.registerModule<Hiber3D::AssetModule>(Hiber3D::AssetModuleSettings{
            .defaultReaderAssetPath = "",
            .defaultWriterAssetPath = "",
            .enableWatcher = true 
        });
        context.registerModule<Hiber3D::LogModule>(Hiber3D::LogSettings{.logLevel = Hiber3D::LogLevel::INFO});
        context.registerModule<Hiber3D::GltfModule>();
        context.registerModule<Hiber3D::SceneModule>();
        context.registerModule<Hiber3D::SceneManagerModule>(Hiber3D::SceneManagerSettings{.defaultScene = "main.scene"});
        context.registerModule<Hiber3D::WorldTransformModule>();
        context.registerModule<Hiber3D::RenderModule>();
        context.registerModule<Hiber3D::HierarchyModule>();
        context.registerModule<Hiber3D::DebugModule>();
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::Mesh>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::StandardMaterial>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::Cubemap>(context);
        context.registerModule<Hiber3D::InteropModule>();

        context.registerModule<Hiber3D::EditorModule>();

        context.registerModule<ExampleModule>();
    }
};

int main(int argc, char* argv[]) {
    Hiber3D::run("GameTemplate", std::make_unique<MainModule>(), Hiber3D::ApplicationRunMode::GraphicalApp, argc, argv);
    return 0;
}
