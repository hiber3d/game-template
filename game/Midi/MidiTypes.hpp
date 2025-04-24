#pragma once

#include <Hiber3D/Core/TypeAlias.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct MidiState {
    // TODO: There should be 16 of each of these (one per MIDI channel)
    std::array<Hiber3D::u8, 128> notes = {Hiber3D::u8{0}};
    std::array<Hiber3D::u8, 128> cc    = {Hiber3D::u8{0}};

    Hiber3D::u16 pitchBend = 64 << 7;
    Hiber3D::u8 lastNote  = -1;
    Hiber3D::u8 lastCc    = -1;
};

HIBER3D_REFLECT(HIBER3D_TYPE(MidiState), HIBER3D_MEMBER(notes), HIBER3D_MEMBER(cc), HIBER3D_MEMBER(pitchBend), HIBER3D_MEMBER(lastNote), HIBER3D_MEMBER(lastCc));
