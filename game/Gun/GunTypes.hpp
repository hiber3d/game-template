#pragma once

#include <Hiber3D/Asset/Assets.hpp>
#include <Hiber3D/Interop/Defines.hpp>
#include <Hiber3D/Scene/Scene.hpp>

#include <string>

struct Gun {
    Hiber3D::AssetHandle<Hiber3D::Scene> bulletSceneHandle;
};

HIBER3D_REFLECT(HIBER3D_TYPE(Gun), HIBER3D_MEMBER(bulletSceneHandle));