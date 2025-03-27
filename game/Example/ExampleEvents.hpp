#pragma once

#include <Hiber3D/Interop/Defines.hpp>

struct ExampleEvent {
    int value;
};

HIBER3D_REFLECT(HIBER3D_TYPE(ExampleEvent), HIBER3D_MEMBER(value));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(ExampleEvent);