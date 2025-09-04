

import React, { useState, useRef, useEffect } from 'react';

const FacialRecognition: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScan = async () => {
    setIsVerified(false);
    setError(null);
    setIsScanning(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // Simulate scanning process
        setTimeout(() => {
          setIsScanning(false);
          setIsVerified(true);
          stopScan();
        }, 3000);
      } else {
        throw new Error("Camera access is not supported by this browser.");
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      let errorMessage = "Failed to access optical sensor.";
      if (err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
          errorMessage = "Optical sensor access denied.";
      }
      setError(errorMessage);
      setIsScanning(false);
    }
  };
  
  const stopScan = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      if (videoRef.current) {
          videoRef.current.srcObject = null;
      }
  };
  
  useEffect(() => {
    // Cleanup function to stop camera stream when component unmounts
    return () => {
      stopScan();
    };
  }, []);

  return (
    <div className="relative h-48 flex flex-col items-center justify-center font-mono">
      <div className="absolute inset-0 bg-cyan-900/30 rounded-md overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]"></video>
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4/5 h-4/5 border-2 border-cyan-400 rounded-lg animate-pulse relative">
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-cyan-400/0 via-cyan-400 to-cyan-400/0 animate-scan-y"></div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 text-center bg-black/50 p-2 rounded-md">
        {isVerified && (
          <p className="text-green-400 text-lg animate-fade-in">BIOMETRIC SIGNATURE VERIFIED: SIR</p>
        )}
        {error && (
            <p className="text-red-400 text-sm">{error}</p>
        )}
        {!isScanning && !isVerified && !error && (
          <p className="text-cyan-400 text-sm">Awaiting Biometric Verification</p>
        )}
      </div>

      {!isScanning && (
         <button 
            onClick={startScan} 
            className="mt-4 relative z-10 bg-cyan-700/80 text-cyan-200 py-2 px-4 rounded-lg font-mono tracking-wider border border-cyan-500/50 hover:bg-cyan-600/80 transition-colors"
            disabled={isScanning}
        >
            {isScanning ? 'SCANNING...' : 'INITIATE SCAN'}
        </button>
      )}
       {/* Fix: Replaced unsupported `<style jsx>` with a standard `<style>` tag for React compatibility. */}
       <style>{`
        @keyframes scan-y {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan-y {
          animation: scan-y 2s infinite linear;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FacialRecognition;