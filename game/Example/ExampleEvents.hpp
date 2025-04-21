#pragma once

#include <Hiber3D/Interop/Defines.hpp>

#include <string>
#include <Hiber3D/Math/Transform.hpp>

struct ExampleEvent {
    int value;
};

HIBER3D_REFLECT(HIBER3D_TYPE(ExampleEvent), HIBER3D_MEMBER(value));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(ExampleEvent);


struct PlayerPosition {
    float x;
    float z;
    float rotX;
    float rotY;
    float rotZ;
    float rotW;
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayerPosition), HIBER3D_MEMBER(x), HIBER3D_MEMBER(z),
    HIBER3D_MEMBER(rotX), HIBER3D_MEMBER(rotY), HIBER3D_MEMBER(rotZ), HIBER3D_MEMBER(rotW));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(PlayerPosition);

struct BulletShot {
    float originX;
    float originZ;
    float direction;
};

HIBER3D_REFLECT(HIBER3D_TYPE(BulletShot), HIBER3D_MEMBER(originX), HIBER3D_MEMBER(originZ), HIBER3D_MEMBER(direction));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(BulletShot);

struct PlayerJoined {
    std::string id = "";
};
HIBER3D_REFLECT(HIBER3D_TYPE(PlayerJoined), HIBER3D_MEMBER(id));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(PlayerJoined);
struct PlayerLeft {
    std::string id = "";
};
HIBER3D_REFLECT(HIBER3D_TYPE(PlayerLeft), HIBER3D_MEMBER(id));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(PlayerLeft);

struct PlayerUpdate {
    std::string id = "";
    float x;
    float z;
    float rotX;
    float rotY;
    float rotZ;
    float rotW;
};
HIBER3D_REFLECT(HIBER3D_TYPE(PlayerUpdate), HIBER3D_MEMBER(id), HIBER3D_MEMBER(x), HIBER3D_MEMBER(z),
    HIBER3D_MEMBER(rotX), HIBER3D_MEMBER(rotY), HIBER3D_MEMBER(rotZ), HIBER3D_MEMBER(rotW));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(PlayerUpdate);