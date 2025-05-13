import { useEffect, useRef, useState } from "react";
import { Hiber3D, useHiber3D, GunStateChangedEvent } from "./hiber3d";

const ExampleUI = () => {
  const { api } = useHiber3D();
  const [gunState, setGunState] = useState<GunStateChangedEvent | undefined>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onGunStateChangedEvent((payload) => {
      setGunState(payload);
    });

    return () => {
      api.removeEventCallback(listener);
    };
  }, [api]);

  if (!gunState) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        color: "white",
        padding: "12px 25px",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      <div>AMMO: {gunState.ammo}</div>
      {/* <div>HITS: {gunState.hits}</div> */}
    </div>
  );
};

const MidiEvent = ({ MIDIAccess }: { MIDIAccess: MIDIAccess | null }) => {
  const { api } = useHiber3D();
  
  const outputId = "output-2";
  const outputName = "OutFromHiber3D";

  useEffect(() => {
    if (!api || !MIDIAccess) {
      return;
    }

    const listener = api.onMidiOutputEvent((payload) => {
      //console.log("MIDI event from WASM with value" + JSON.stringify(payload), MIDIAccess);
      const noteOnMessage = [payload.byte0, payload.byte1, payload.byte2];
      const output = MIDIAccess?.outputs.get(outputId);
      //console.log("Output: " + JSON.stringify(output));
      if (output) {
        //console.log("Sending MIDI message to output");
        output?.send(noteOnMessage);
      }
    });

    return () => {
      api.removeEventCallback(listener);
    };
  }, [api, MIDIAccess]);

  useEffect(() => {
    if (!api) {
      return;
    }

    function onMIDIMessage(message: MIDIMessageEvent) {
      api?.writeMidiInputEvent({ byte0: message.data?.[0], byte1: message.data?.[1], byte2: message.data?.[2] });
    }

    if (!MIDIAccess) {
      return;
    }

    for (const entry of MIDIAccess.inputs) {
      const input = entry[1];
      console.log(
        `Input port [type:'${input.type}']` +
          ` id:'${input.id}'` +
          ` manufacturer:'${input.manufacturer}'` +
          ` name:'${input.name}'` +
          ` version:'${input.version}'`
      );
      if (!entry[1].name?.startsWith(outputName)) {
        const input = MIDIAccess.inputs.get(entry[1].id);
        if (input) {
          input.onmidimessage = onMIDIMessage;
        }
      }
    }
  }, [api, MIDIAccess]);

  return null;
};

export const App = () => {
  const [MIDIAccess, setMIDIAccess] = useState<MIDIAccess | null>(null);
  const MIDIInitializationInProgress = useRef<boolean>(false);

  useEffect(() => {
    function onMIDISuccess(midiAccess: MIDIAccess) {
      console.log("MIDI ready!");

      setMIDIAccess(midiAccess);
    }

    function onMIDIFailure(msg: string) {
      console.error(`Failed to get MIDI access - ${msg}`);
    }

    if (MIDIInitializationInProgress.current) {
      return;
    }
    MIDIInitializationInProgress.current = true;

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }, [MIDIAccess]);

  return (
    <Hiber3D>
      <ExampleUI />
      <MidiEvent MIDIAccess={MIDIAccess} />
    </Hiber3D>
  );
};