#pragma once

#include <Hiber3D/Interop/Defines.hpp>

struct ExampleComponent {
    int value;
};

HIBER3D_REFLECT(HIBER3D_TYPE(ExampleComponent), HIBER3D_MEMBER(value));