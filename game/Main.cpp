#include <Modules/ExampleModule/ExampleModule.hpp>

#include <Hiber3D/Asset/AssetModule.hpp>
#include <Hiber3D/Asset/Assets.hpp>
#include <Hiber3D/BaseAssets/Cubemap.hpp>
#include <Hiber3D/BaseAssets/Material.hpp>
#include <Hiber3D/BaseAssets/Mesh.hpp>
#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Core/KeyEvent.hpp>
#include <Hiber3D/Debug/DebugModule.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Gltf/GltfModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Hierarchy/HierarchyComponents.hpp>
#include <Hiber3D/Hierarchy/HierarchyModule.hpp>
#include <Hiber3D/Input/InputModule.hpp>
#include <Hiber3D/Input/Types.hpp>
#include <Hiber3D/Interop/InteropModule.hpp>
#include <Hiber3D/Log/LogModule.hpp>
#include <Hiber3D/Math/MathUtils.hpp>
#include <Hiber3D/Renderer/Camera.hpp>
#include <Hiber3D/Renderer/RenderModule.hpp>
#include <Hiber3D/Scene/SceneManagerModule.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>
#include <Hiber3D/ScriptingApi/ScriptFunctions.hpp>
#include <Hiber3D/WorldTransform/ComputedWorldTransform.hpp>
#include <Hiber3D/WorldTransform/WorldTransformModule.hpp>

#include <stdio.h>

struct IgnoreRaycast {};
HIBER3D_REFLECT(HIBER3D_TYPE(IgnoreRaycast));

using namespace Hiber3D;

class MainModule : public Module {
public:
    void onRegister(InitContext& context) override {
        context.registerModule<AssetModule>(AssetModuleSettings{
            .defaultReaderAssetPath = "",
            .defaultWriterAssetPath = "",
            .enableWatcher          = true});
        context.registerModule<LogModule>(LogSettings{.logLevel = LogLevel::INFO});
        context.registerModule<GltfModule>();
        context.registerModule<SceneModule>();
        context.getModule<SceneModule>().registerComponent<ScriptInstance>(context);
        context.registerModule<SceneManagerModule>(SceneManagerSettings{.defaultScene = "main.scene"});
        context.registerModule<WorldTransformModule>();
        context.registerModule<RenderModule>();
        context.registerModule<HierarchyModule>();
        context.registerModule<DebugModule>();
        context.registerModule<InputModule>();
        context.getModule<AssetModule>().registerAssetType<Mesh>(context);
        context.getModule<AssetModule>().registerAssetType<StandardMaterial>(context);
        context.getModule<AssetModule>().registerAssetType<Cubemap>(context);
        context.registerModule<InteropModule>();
        context.registerModule<JavaScriptScriptingModule>();
        context.getModule<JavaScriptScriptingModule>().registerComponent<Transform>(context);
        context.getModule<JavaScriptScriptingModule>().registerComponent<ComputedWorldTransform>(context);
        context.getModule<JavaScriptScriptingModule>().registerComponent<SceneRoot>(context);
        context.getModule<JavaScriptScriptingModule>().registerComponent<Renderable>(context);
        context.getModule<JavaScriptScriptingModule>().registerComponent<Children>(context);
        context.getModule<JavaScriptScriptingModule>().registerComponent<Parent>(context);
        context.getModule<JavaScriptScriptingModule>().registerComponent<Camera>(context);
        context.getModule<JavaScriptScriptingModule>().registerComponent<Name>(context);
        context.getModule<JavaScriptScriptingModule>().registerFunction<[](const Registry& registry, Key key) { return registry.singleton<const KeyboardState>().isPressed(key); }>(context, "keyIsPressed");
        context.getModule<JavaScriptScriptingModule>().registerFunction<[](const Registry& registry, Key key) { return registry.singleton<const KeyboardState>().justPressed(key); }>(context, "keyJustPressed");
        context.getModule<JavaScriptScriptingModule>().registerFunction<[](const Registry& registry, Key key) { return registry.singleton<const KeyboardState>().justReleased(key); }>(context, "keyJustReleased");
        context.getModule<JavaScriptScriptingModule>().registerFunction<[](const Registry& registry, MouseButton button) { return registry.singleton<const MouseState>().justPressed(button); }>(context, "mouseJustPressed");
        context.getModule<JavaScriptScriptingModule>().registerEvent<MouseEvent>(context);
        context.getModule<JavaScriptScriptingModule>().registerSingleton<MouseState>(context);

        registerHierarchyFunctions(context, context.getModule<JavaScriptScriptingModule>());
        registerIntersectFunctions(context, context.getModule<JavaScriptScriptingModule>());
        context.getModule<JavaScriptScriptingModule>().registerFunction<[](Registry& registry, float2 mousePosition) {
            auto  renderables = registry.view<Renderable, ComputedWorldTransform>();
            auto& meshes      = registry.singleton<Assets<Mesh>>();

            auto cameraEntity = Camera::getActive(registry.view<const Camera>());
            auto cameras      = registry.view<Camera, ComputedWorldTransform>();

            return cameras.withComponentOrDefault(float3{}, cameraEntity, [&](const Camera& camera, const ComputedWorldTransform& cameraTransform) {
                auto               ray = camera.getRayFromScreenCoords(registry.singleton<const ScreenInfo>(), cameraTransform, mousePosition);
                RayIntersectResult closestResult;
                for (auto [entity, renderable, transform] : renderables.each()) {
                    if (registry.hasComponents<IgnoreRaycast>(entity)) {
                        continue;
                    }
                    auto mesh = meshes.get(renderable.mesh);
                    if (mesh) {
                        auto hitResult = intersect(ray, *mesh, transform);

                        if (hitResult.hitCloserThan(closestResult)) {
                            closestResult = hitResult;
                        }
                    }
                }

                if (closestResult.hit) {
                    return ray.pointAt(closestResult.distance);
                } else {
                    return float3{};
                }
            });
        }>(context, "raycastFromMouse");

        context.getModule<JavaScriptScriptingModule>().registerFunction<[](float3 direction) {
            return Quaternion::makeLookRotation(normalizeSafe(direction));
        }>(context, "lookRotation");

        context.registerModule<EditorModule>();
        context.getModule<EditorModule>().registerComponent<IgnoreRaycast>(context);
        context.getModule<SceneModule>().registerComponent<IgnoreRaycast>(context);
        context.registerModule<ExampleModule>();
    }
};

int main(int argc, char* argv[]) {
    run("GameTemplate", std::make_unique<MainModule>(), ApplicationRunMode::GraphicalApp, argc, argv);
    return 0;
}
