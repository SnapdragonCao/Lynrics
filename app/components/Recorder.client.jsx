import { useReactMediaRecorder } from "react-media-recorder";

/**
 * The recorder component to record media file from the environment.
 * 
 * Hook credit: https://github.com/0x006F/react-media-recorder.
 * 
 * This package is built based on the MediaRecorder API: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder,
 * so should be rendered only on the client side.
 */
export default function Recorder({
  setSongFile,
  submit
}) {
  let timerId; // used to record the timer id

  const { status, startRecording, stopRecording, mediaBlobUrl } = 
    useReactMediaRecorder({ 
      blobPropertyBag: {type: 'audio/mp3'}, // define the .mp3 extension
      askPermissionOnMount: true,

      // stop the recording after 5 seconds
      onStart: async() => {
        timerId = setTimeout(stopRecording, 5000);
      },

      // save the new recorded song when stop recording
      onStop: async(blobUrl, blob) => {
        clearTimeout(timerId);

        // generate file from blob object
        const file = new File([blob], 'input.mp3', { type: 'audio/mpeg' });

        // Pass the file to parent component
        // Another way to do this is by base64 encoding
        setSongFile(file);
        console.log("File recorded!");
        
        const formData = new FormData();
        formData.append("songFile", file, "input.mp3");
        submit(
          formData,
          { method: "post", action: "searchResults", encType: "multipart/form-data" }
        );
      },
  });

  return (
    <div>
      <button type="button" onClick={startRecording}>Start Recognition</button>
    </div>
  )
}