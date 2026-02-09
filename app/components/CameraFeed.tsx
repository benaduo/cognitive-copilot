"use-client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw } from "lucide-react";

const videoConstraints = {
  width: 720,
  height: 1280,
  facingMode: "environment",
};

export default function CameraFeed() {
  const webcamRef = useRef<Webcam>(null);
  const [image] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setLoading(true);
        setAnalysis(null);
        try {
          const response = await fetch("api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageSrc }),
          });
          const data = await response.json();
          console.log("Generated instruction:", data.text);
          setAnalysis(data.text);

          const utterance = new SpeechSynthesisUtterance(data.text);
          speechSynthesis.speak(utterance);
        } catch (error) {
          console.error("Error analyzing image:", error);
        } finally {
          setLoading(false);
        }
      }
    }
  }, [webcamRef]);

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {(analysis || isLoading) && (
        <div className="absolute top-20 left-4 right-4 bg-white p-6 rounded-2xl shadow-2xl border-4 border-blue-500 z-20 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-black font-bold text-xl mb-2">Co-Pilot Guide:</h2>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="animate-spin text-blue-500" />
              <p className="text-gray-600">Thinking...</p>
            </div>
          ) : (
            <p className="text-black text-2xl font-semibold leading-tight">
              {analysis}
            </p>
          )}
        </div>
      )}

      <div className="absolute bottom-10 flex flex-col items-center gap-4 z-10">
        {image && (
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
            <p className="text-green-400 text-sm font-mono">✓ Frame Captured</p>
          </div>
        )}

        <button
          onClick={capture}
          className="bg-white text-black rounded-full p-6 shadow-lg active:scale-95 transition-transform hover:bg-gray-200 border-4 border-gray-400"
        >
          <Camera size={32} />
        </button>
        <p className="text-white/60 text-xs">Tap to Capture Context</p>
      </div>
    </div>
  );
}
