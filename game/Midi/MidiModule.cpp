#include <Hiber3D/Core/EventReader.hpp>
#include <Hiber3D/Core/EventWriter.hpp>
#include <Hiber3D/Core/FixedStringFormat.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

#include <Midi/MidiEvents.hpp>
#include <Midi/MidiModule.hpp>
#include <Midi/MidiTypes.hpp>

enum class MidiCommand {
    NOTE_OFF   = 8,
    NOTE_ON    = 9,
    CC         = 11,
    PITCH_BEND = 14,
};

static void receiveMidi(
    const Hiber3D::EventView<MidiInputEvent> events,
    Hiber3D::Singleton<MidiState>            midiState) {
    for (const auto& event : events) {
        MidiCommand command = MidiCommand{event.byte0 >> 4};
        Hiber3D::u8 channel = event.byte0 & 0xf;
        switch (command) {
            case MidiCommand::CC:
                midiState->input.channels[channel].cc[event.byte1] = event.byte2;
                break;
            case MidiCommand::NOTE_OFF:
                midiState->input.channels[channel].notes[event.byte1] = Hiber3D::u8{0};
                break;
            case MidiCommand::NOTE_ON:
                midiState->input.channels[channel].notes[event.byte1] = event.byte2;
                midiState->input.channels[channel].lastNote = event.byte1;
                break;
            case MidiCommand::PITCH_BEND:
                midiState->input.channels[channel].pitchBend = (static_cast<Hiber3D::s16>((event.byte2 << 7) | event.byte1) - 0x2000) / static_cast<float>(0x2000);
                break;
            default:
                break;
        }
    }
}

static void sendMidiOn(
    const Hiber3D::Singleton<MidiState>    midiState,
    Hiber3D::EventWriter<MidiOutputEvent>& writer) {
    LOG_INFO("Sending MIDI on event");
    writer.writeEvent({{
        .byte0 = 0b10010000,  // Note on, channel 0
        .byte1 = 60,          // Middle C
        .byte2 = 127,
    }});
}

static void sendMidiOff(
    const Hiber3D::Singleton<MidiState>    midiState,
    Hiber3D::EventWriter<MidiOutputEvent>& writer) {
    LOG_INFO("Sending MIDI off event");
    writer.writeEvent({{
        .byte0 = 0b10000000,  // Note on, channel 0
        .byte1 = 60,
        .byte2 = 127,
    }});
}

void MidiModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_FRAME, receiveMidi);
    context.addSystem(Hiber3D::Schedule::ON_START, sendMidiOn);
    context.addSystem(Hiber3D::Schedule::ON_START_EDIT, sendMidiOff);

    context.registerSingleton<MidiState>();

    // Show in editor inspector
    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        // context.getModule<Hiber3D::EditorModule>().registerComponent<ExampleComponent>(context);
    }

    // Make available in scripts
    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<MidiOutputEvent>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<MidiInputEvent>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerSingleton<MidiState>(context);
    }

    // Saved to scene file
    if (context.isModuleRegistered<Hiber3D::SceneModule>()) {
        // context.getModule<Hiber3D::SceneModule>().registerComponent<ExampleComponent>(context);
    }
}
