// import { useEffect, useRef, useState } from "react";
// import RecordRTC, { StereoAudioRecorder } from "recordrtc";
// import { MdDelete, MdStop } from "react-icons/md";
// import { Button } from "@/components/ui/button";

// interface VoiceRecorderProps {
//   isRecording: boolean;
//   onComplete: (blob: Blob) => void;
//   onCancel: () => void;
// }

// const VoiceRecorder = ({
//   isRecording,
//   onComplete,
//   onCancel,
// }: VoiceRecorderProps) => {
//   const recorderRef = useRef<RecordRTC | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   const [recordingTime, setRecordingTime] = useState(0);

//   useEffect(() => {
//     startRecording();

//     return () => {
//       stopTracks();
//     };
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRecordingTime((p) => p + 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const stopTracks = () => {
//     streamRef.current?.getTracks().forEach((t) => t.stop());
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });

//       streamRef.current = stream;

//       const recorder = new RecordRTC(stream, {
//         type: "audio",
//         recorderType: StereoAudioRecorder,
//         mimeType: "audio/ogg",
//         desiredSampRate: 16000,
//         numberOfAudioChannels: 1,
//       });

//       recorder.startRecording();

//       recorderRef.current = recorder;
//     } catch (err) {
//       console.error(err);
//       onCancel();
//     }
//   };

//   const stopRecording = () => {
//     if (!recorderRef.current) return;

//     recorderRef.current.stopRecording(() => {
//       const blob = recorderRef.current!.getBlob();

//       stopTracks();

//       onComplete(blob);
//     });
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;

//     return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   };

//   return (
//     <div className="flex items-center justify-between rounded-xl border bg-primary/5 px-4 py-3 w-full">
//       {!isRecording && (
//         <Button
//           type="button"
//           onClick={onCancel}
//           className="actions-btn text-red-500!"
//         >
//           <MdDelete size={24} />
//         </Button>
//       )}

//       <div className="flex items-center gap-3">
//         <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
//         <span className="font-medium">Recording...</span>
//         <span>{formatTime(recordingTime)}</span>
//       </div>

//       <button
//         type="button"
//         onClick={stopRecording}
//         className="rounded-full bg-primary p-3 text-white"
//       >
//         <MdStop />
//       </button>
//     </div>
//   );
// };

// export default VoiceRecorder;

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { MdDelete, MdStop } from "react-icons/md";

interface VoiceRecorderProps {
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
  isRecording?: boolean;
}

const VoiceRecorder = ({
  onComplete,
  onCancel,
  isRecording,
}: VoiceRecorderProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    startRecording();

    return () => {
      mediaRecorderRef.current?.stream
        .getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        chunksRef.current = [];

        onComplete(blob);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
    } catch (error) {
      console.error(error);
      onCancel();
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-between rounded-xl border bg-primary/5 px-4 py-3 w-full">
      {!isRecording && (
        <Button
          type="button"
          onClick={onCancel}
          className="actions-btn text-red-500!"
        >
          <MdDelete size={24} />
        </Button>
      )}

      <div className="flex items-center gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
        <span className="font-medium">Recording...</span>
        <span>{formatTime(recordingTime)}</span>
      </div>

      <button
        type="button"
        onClick={stopRecording}
        className="rounded-full bg-primary p-3 text-white"
      >
        <MdStop />
      </button>
    </div>
  );
};

export default VoiceRecorder;
