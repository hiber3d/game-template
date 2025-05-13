#pragma once

#include <Hiber3D/Interop/Defines.hpp>

struct GunStateChangedEvent {
    int ammo;
    int hits;
};

HIBER3D_REFLECT(HIBER3D_TYPE(GunStateChangedEvent), HIBER3D_MEMBER(ammo), HIBER3D_MEMBER(hits));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(GunStateChangedEvent);