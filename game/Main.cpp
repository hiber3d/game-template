#include <Example/ExampleModule.hpp>

#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Editor/Editor.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Hiber3DModule.hpp>
#include <Hiber3D/Physics/PhysicsComponents.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

#include <stdio.h>

class MainModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override {
        context.registerModule<Hiber3D::Hiber3DModule>();

        context.registerModule<ExampleModule>();
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::ExternalImpulse>(context);
    }
};

int main(int argc, char* argv[]) {
    Hiber3D::run("GameTemplate", std::make_unique<MainModule>(), Hiber3D::ApplicationRunMode::GraphicalApp, argc, argv);
    return 0;
}
