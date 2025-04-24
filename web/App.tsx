import { Hiber3D, useHiber3D } from "@hiber3d/web";
import { moduleFactory as webGPU } from "GameTemplate_webgpu";
import { moduleFactory as webGL } from "GameTemplate_webgl";
import { useEffect, useRef, useState } from "react";

const ExampleEvent = () => {
  const { api } = useHiber3D();

  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onExampleEvent((payload) => {
      console.debug(payload);
    });

    return () => {
      api.removeEventCallback(listener);
    };
  }, [api]);

  return null;
};

const MidiEvent = () => {
  const { api } = useHiber3D();

  const [MIDIAccess, setMIDIAccess] = useState<MIDIAccess | null>(null);
  const MIDIInitializationInProgress = useRef<boolean>(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    function onMIDIMessage(message: MIDIMessageEvent) {
      api?.writeMidiInputEvent({ byte0: message.data[0], byte1: message.data[1], byte2: message.data[2] });
    }

    function onMIDISuccess(midiAccess: MIDIAccess) {
      console.log("MIDI ready!");

      setMIDIAccess(midiAccess);

      for (const entry of midiAccess.inputs) {
        const input = entry[1];
        console.log(
          `Input port [type:'${input.type}']` +
            ` id:'${input.id}'` +
            ` manufacturer:'${input.manufacturer}'` +
            ` name:'${input.name}'` +
            ` version:'${input.version}'`
        );
        if (!entry[1].name.startsWith("OutFromHiber3D")) {
          const input = midiAccess.inputs.get(entry[1].id);
          input.onmidimessage = onMIDIMessage;
        }
      }

      for (const entry of midiAccess.outputs) {
        const output = entry[1];
        console.log(
          `Output port [type:'${output.type}']` +
            ` id:'${output.id}'` +
            ` manufacturer:'${output.manufacturer}'` +
            ` name:'${output.name}'` +
            ` version:'${output.version}'`
        );
      }
    }

    function onMIDIFailure(msg: string) {
      console.error(`Failed to get MIDI access - ${msg}`);
    }

    if (MIDIAccess) {
      return;
    }

    if (MIDIInitializationInProgress.current) {
      return;
    }
    MIDIInitializationInProgress.current = true;

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }, [api, MIDIAccess]);

  useEffect(() => {
    console.log("Before if");

    if (!api || !MIDIAccess) {
      return;
    }

    console.log("After if", api, MIDIAccess);

    const listener = api.onMidiOutputEvent((payload) => {
      console.log("MIDI event from WASM with value" + JSON.stringify(payload));
      const noteOnMessage = [payload.byte0, payload.byte1, payload.byte2];
      const output = MIDIAccess?.outputs.get("output-2");
      console.log("Output: " + JSON.stringify(output));
      if (output) {
        console.log("Sending MIDI message to output");
        output?.send(noteOnMessage);
      }
    });

    return () => {
      console.log("Removing MIDI event listener");
      api.removeEventCallback(listener);
    };
  }, [api, MIDIAccess]);

  return null;
};

export const App = () => (
  <Hiber3D build={{ webGPU, webGL }}>
    <ExampleEvent />
    <MidiEvent />
  </Hiber3D>
);
