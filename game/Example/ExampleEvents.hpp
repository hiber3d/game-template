#pragma once

#include <Hiber3D/Interop/Defines.hpp>
#include <Hiber3D/Math/Transform.hpp>

#include <string>

struct GameStarted {
    bool dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(GameStarted), HIBER3D_MEMBER(dummy));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(GameStarted);

struct PlayerPosition {
    float x;
    float z;
    float rotX;
    float rotY;
    float rotZ;
    float rotW;
    float velocityX;
    float velocityZ;
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayerPosition), HIBER3D_MEMBER(x), HIBER3D_MEMBER(z),
                HIBER3D_MEMBER(rotX), HIBER3D_MEMBER(rotY), HIBER3D_MEMBER(rotZ), HIBER3D_MEMBER(rotW), HIBER3D_MEMBER(velocityX), HIBER3D_MEMBER(velocityZ));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(PlayerPosition);

struct BulletShot {
    float           originX;
    float           originZ;
    Hiber3D::float4 rotation;
};

HIBER3D_REFLECT(HIBER3D_TYPE(BulletShot), HIBER3D_MEMBER(originX), HIBER3D_MEMBER(originZ), HIBER3D_MEMBER(rotation));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(BulletShot);

struct RemoteBulletShot {
    BulletShot bulletShot;
};

HIBER3D_REFLECT(HIBER3D_TYPE(RemoteBulletShot), HIBER3D_MEMBER(bulletShot));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(RemoteBulletShot);

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

struct LocalPlayerDied {
    bool dummy;
};
HIBER3D_REFLECT(HIBER3D_TYPE(LocalPlayerDied), HIBER3D_MEMBER(dummy));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(LocalPlayerDied);

struct PlayerUpdate {
    std::string id = "";
    float       x;
    float       z;
    float       rotX;
    float       rotY;
    float       rotZ;
    float       rotW;
    float       velocityX;
    float       velocityZ;
    bool        isDead = false;
};
HIBER3D_REFLECT(HIBER3D_TYPE(PlayerUpdate), HIBER3D_MEMBER(id), HIBER3D_MEMBER(x), HIBER3D_MEMBER(z),
                HIBER3D_MEMBER(rotX), HIBER3D_MEMBER(rotY), HIBER3D_MEMBER(rotZ), HIBER3D_MEMBER(rotW), HIBER3D_MEMBER(velocityX), HIBER3D_MEMBER(velocityZ), HIBER3D_MEMBER(isDead));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(PlayerUpdate);

struct PlayerIsDeadChanged {
    std::string id            = "";
    bool        isDead        = false;
    bool        isLocalPlayer = false;
};
HIBER3D_REFLECT(HIBER3D_TYPE(PlayerIsDeadChanged), HIBER3D_MEMBER(id), HIBER3D_MEMBER(isDead), HIBER3D_MEMBER(isLocalPlayer));
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(PlayerIsDeadChanged);