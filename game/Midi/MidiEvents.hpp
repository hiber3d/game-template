#pragma once

#include <Hiber3D/Core/TypeAlias.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct MidiEvent {
    Hiber3D::u8 byte0;
    Hiber3D::u8 byte1;
    Hiber3D::u8 byte2;
};

struct MidiInputEvent : public MidiEvent {};


HIBER3D_REFLECT(HIBER3D_TYPE(MidiInputEvent), HIBER3D_MEMBER(byte0), HIBER3D_MEMBER(byte1), HIBER3D_MEMBER(byte2));
HIBER3D_INTEROP_RECEIVE_FROM_JS(MidiInputEvent);

struct MidiOutputEvent : public MidiEvent {};

HIBER3D_REFLECT(HIBER3D_TYPE(MidiOutputEvent), HIBER3D_MEMBER(byte0), HIBER3D_MEMBER(byte1), HIBER3D_MEMBER(byte2));
HIBER3D_INTEROP_SEND_TO_JS(MidiOutputEvent);