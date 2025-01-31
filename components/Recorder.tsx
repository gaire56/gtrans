/**Gaire Ananta Prasad(M24W0272)
 * This code defines a Recorder component that handles audio recording using the MediaRecorder API,
 * with states to manage permission, recording status, and audio chunks. The component provides
 * functionality to start and stop recording, and it uploads the recorded audio using the provided uploadAudio function.
 */
'use client'

import { MicIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
// import { useFormStatus } from "react-dom";

export const mimeType = "audio/webm";

function Recorder(
    {uploadAudio}: {uploadAudio: (blob: Blob) => void}
) 
{
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef <MediaRecorder | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive")
    // const {pending} = useFormStatus();
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    
    useEffect(() => {
        getMicrophonePermission();
    }, []);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
                
            } catch (err: any) {
                alert(err.message);
            }
        } else {
            alert("Your browser does not suppot the MediaRecorder API");
        }
    };

    const startRecording = async () => {
        if (stream === null ) return;
        // if (stream === null || pending) return;


        setRecordingStatus("recording");

        //Create a new media recorder instance using the stream
        const media = new MediaRecorder(stream, {mimeType});
        mediaRecorder.current = media;
        mediaRecorder.current.start();

        let localAudioChunks: Blob[] = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;

            localAudioChunks.push(event.data);
        };

        setAudioChunks(localAudioChunks);

    };

    const stopRecording = async () => {
        if (mediaRecorder.current === null) return;
        // if (mediaRecorder.current === null || pending) return;


        setRecordingStatus("inactive");
        mediaRecorder.current.stop();

        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, {type: mimeType});
            uploadAudio(audioBlob);
            setAudioChunks([])
        }
    };

  return (
    <div
    className={`flex items-center group text-blue-500 cursor-pointer border rounded-md w-fit px-3 py-2 mb-5 ${recordingStatus === "recording" ? "bg-red-500 text-white" : "hover:bg-[#E7F0FE]"}`}
    >
    <MicIcon size ={20} className=" group-hover:underline" />

    {!permission && (
        <button onClick={getMicrophonePermission}>Speak</button>
    )}

    {/* {pending && <p>Translating</p>
    // (
    //     <p>
    //         {recordingStatus === "recording"
    //         ? "Recording..."
    //     : "Stop recording..."}
    //     </p>
    // )
    } */}

    {permission && recordingStatus === "inactive" && (
    // {permission && recordingStatus === "inactive" && !pending && (

        <button
        onClick={startRecording}
        className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
            Speak
        </button>
    )}

    {recordingStatus === "recording" && (
        <button
        onClick={stopRecording}
        className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
            Stop
        </button>
    )}
    </div>
  )
}

export default Recorder