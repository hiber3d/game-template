#pragma once

#include <Hiber3D/Core/Entity.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct GunFired {
    Hiber3D::Entity gunEntity;
    Hiber3D::Entity bulletEntity;
};

HIBER3D_REFLECT(HIBER3D_TYPE(GunFired), HIBER3D_MEMBER(gunEntity), HIBER3D_MEMBER(bulletEntity));