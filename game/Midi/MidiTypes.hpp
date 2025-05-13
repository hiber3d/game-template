#pragma once

#include <Hiber3D/Core/FixedArray.hpp>
#include <Hiber3D/Core/TypeAlias.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct MidiChannel {
    std::array<Hiber3D::u8, 128> notes = {Hiber3D::u8{0}};
    std::array<Hiber3D::u8, 128> cc    = {Hiber3D::u8{0}};

    float pitchBend = 0.0f;

    Hiber3D::u8 lastNote = -1;
    Hiber3D::u8 lastCc   = -1;
};

struct MidiPort {
    std::array<MidiChannel, 16> channels = {};
};

struct MidiState {
    MidiPort input;
    MidiPort output;
};

HIBER3D_REFLECT(HIBER3D_TYPE(MidiChannel), HIBER3D_MEMBER(notes), HIBER3D_MEMBER(cc), HIBER3D_MEMBER(pitchBend), HIBER3D_MEMBER(lastNote), HIBER3D_MEMBER(lastCc));
HIBER3D_REFLECT(HIBER3D_TYPE(MidiPort), HIBER3D_MEMBER(channels));
HIBER3D_REFLECT(HIBER3D_TYPE(MidiState), HIBER3D_MEMBER(input), HIBER3D_MEMBER(output));
