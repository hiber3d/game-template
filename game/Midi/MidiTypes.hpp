#pragma once

#include <Hiber3D/Interop/Defines.hpp>

struct MidiState {
    int dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(MidiState), HIBER3D_MEMBER(dummy));