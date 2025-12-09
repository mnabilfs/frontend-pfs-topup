import React, { useState, useEffect, useRef } from "react";
import { HiVolumeUp, HiVolumeOff, HiPlay, HiPause } from "react-icons/hi";
import { API_BASE_URL } from "../services/api.js";

const API_URL = `${API_BASE_URL}/api`;

const GlobalAudioPlayer = () => {
  const [music, setMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef(null);

  // Load musik aktif dari API
  useEffect(() => {
    loadActiveMusic();
  }, []);

  const loadActiveMusic = async () => {
    try {
      const response = await fetch(`${API_URL}/background-music/active`);
      const data = await response.json();

      if (data && data.audio_url) {
        setMusic(data);
        console.log("✅ Music loaded:", data.title);
      } else {
        console.log("ℹ️ No active music found");
      }
    } catch (error) {
      console.error("❌ Error loading music:", error);
    }
  };

  // Auto-play saat musik dimuat
  useEffect(() => {
    if (music && audioRef.current) {
      audioRef.current.volume = volume;

      // Auto-play dengan user gesture fallback
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error);
            // User harus klik play manual
          });
      }
    }
  }, [music]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle audio end - loop
  const handleAudioEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  // Jika tidak ada musik, jangan render apa-apa
  if (!music) return null;

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={music.audio_url}
        onEnded={handleAudioEnd}
        preload="auto"
      />

      {/* Floating Audio Player */}
      <div
        className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 ${
          isMinimized ? "scale-75" : "scale-100"
        }`}
      >
        <div className="border shadow-2xl bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl border-purple-600/50 backdrop-blur-sm">
          {/* Main Player */}
          <div className={`p-4 ${isMinimized ? "hidden" : "block"}`}>
            <div className="flex items-center gap-4 min-w-[280px]">
              {/* Album Art Placeholder */}
              <div className="flex items-center justify-center flex-shrink-0 bg-purple-700 w-14 h-14 rounded-xl">
                <svg
                  className="w-8 h-8 text-purple-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>

              {/* Music Info & Controls */}
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm truncate max-w-[160px]">
                  {music.title}
                </h3>
                {music.artist && (
                  <p className="text-purple-300 text-xs truncate max-w-[160px]">
                    {music.artist}
                  </p>
                )}

                {/* Controls */}
                <div className="flex items-center gap-2 mt-2">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="flex items-center justify-center w-8 h-8 transition-colors bg-white rounded-full hover:bg-purple-100"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <HiPause className="w-4 h-4 text-purple-900" />
                    ) : (
                      <HiPlay className="w-4 h-4 text-purple-900 ml-0.5" />
                    )}
                  </button>

                  {/* Volume Control */}
                  <button
                    onClick={toggleMute}
                    className="text-white transition-colors hover:text-purple-300"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <HiVolumeOff className="w-5 h-5" />
                    ) : (
                      <HiVolumeUp className="w-5 h-5" />
                    )}
                  </button>

                  {/* Volume Slider */}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-purple-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                        volume * 100
                      }%, #6b21a8 ${volume * 100}%, #6b21a8 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Minimize Button */}
              <button
                onClick={() => setIsMinimized(true)}
                className="self-start text-purple-300 transition-colors hover:text-white"
                aria-label="Minimize"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Minimized View */}
          {isMinimized && (
            <div className="flex items-center gap-3 p-3">
              <button
                onClick={togglePlay}
                className="flex items-center justify-center w-10 h-10 transition-colors bg-white rounded-full hover:bg-purple-100"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <HiPause className="w-5 h-5 text-purple-900" />
                ) : (
                  <HiPlay className="w-5 h-5 text-purple-900 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setIsMinimized(false)}
                className="text-white transition-colors hover:text-purple-300"
                aria-label="Expand"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

export default GlobalAudioPlayer;