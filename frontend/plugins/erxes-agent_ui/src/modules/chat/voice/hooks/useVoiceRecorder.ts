import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Push-to-talk microphone capture over MediaRecorder. The caller starts and
// stops a take; stop() resolves the recorded audio as a Blob (or null when
// nothing usable was captured). No always-listening / VAD in v1.

// Prefer Opus-in-WebM (broad browser support, small, Whisper-friendly); fall
// back to whatever the browser offers.
const PREFERRED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/mp4',
];

const pickMimeType = (): string | undefined => {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return PREFERRED_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t));
};

export interface VoiceRecorder {
  recording: boolean;
  supported: boolean;
  error?: string;
  start: () => Promise<void>;
  stop: () => Promise<Blob | null>;
  cancel: () => void;
}

export const useVoiceRecorder = (): VoiceRecorder => {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string>();

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const supported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined';

  // Release the mic so the browser's recording indicator clears between takes.
  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (!supported) {
      setError('Your browser does not support voice recording.');
      return;
    }
    setError(undefined);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (err) {
      stopTracks();
      setError(
        (err as Error)?.name === 'NotAllowedError'
          ? 'Microphone access was denied.'
          : 'Could not start recording.',
      );
    }
  }, [supported, stopTracks]);

  const stop = useCallback((): Promise<Blob | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      setRecording(false);
      return Promise.resolve(null);
    }
    return new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm';
        const blob = chunksRef.current.length
          ? new Blob(chunksRef.current, { type })
          : null;
        chunksRef.current = [];
        recorderRef.current = null;
        stopTracks();
        setRecording(false);
        resolve(blob);
      };
      recorder.stop();
    });
  }, [stopTracks]);

  // Drop the current take without producing a blob (mode closed mid-record).
  const cancel = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null;
      recorder.stop();
    }
    chunksRef.current = [];
    recorderRef.current = null;
    stopTracks();
    setRecording(false);
  }, [stopTracks]);

  // Safety net: free the mic if the component unmounts mid-take.
  useEffect(() => () => stopTracks(), [stopTracks]);

  return useMemo(
    () => ({ recording, supported, error, start, stop, cancel }),
    [recording, supported, error, start, stop, cancel],
  );
};
