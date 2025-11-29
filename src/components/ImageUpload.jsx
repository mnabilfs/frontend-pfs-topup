import React, { useState } from "react";
import { HiOutlineUpload, HiOutlineX } from "react-icons/hi";

const ImageUpload = ({ label, value, onChange, preview }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    // Maksimal 20MB untuk kualitas HD
    if (file.size > 20 * 1024 * 1024) {
      alert("Ukuran file maksimal 20MB!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    const reader = new FileReader();

    reader.onloadend = () => {
      // Buat image object untuk mendapatkan dimensi asli
      const img = new Image();
      img.onload = () => {
        // Buat canvas untuk mengoptimalkan gambar tanpa kehilangan kualitas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Untuk banner, kita gunakan ukuran yang lebih besar untuk HD
        const MAX_WIDTH = 1920; // Full HD width
        const MAX_HEIGHT = 1080; // Full HD height

        let width = img.width;
        let height = img.height;

        // Hanya resize jika gambar lebih besar dari MAX
        // Jika lebih kecil, kita pertahankan ukuran asli
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Enable image smoothing untuk kualitas terbaik
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert ke base64 dengan kualitas maksimal (0.95 = 95%)
        // Gunakan image/jpeg untuk file yang lebih kecil tapi tetap HD
        // Gunakan image/png jika ingin lossless (file lebih besar)
        const quality = 0.95; // 95% quality - hampir tanpa kompresi
        const optimizedBase64 = canvas.toDataURL("image/jpeg", quality);

        clearInterval(progressInterval);
        setUploadProgress(100);

        setTimeout(() => {
          onChange(optimizedBase64);
          setIsUploading(false);
          setUploadProgress(0);
        }, 300);
      };

      img.src = reader.result;
    };

    reader.onerror = () => {
      clearInterval(progressInterval);
      alert("Gagal membaca file!");
      setIsUploading(false);
      setUploadProgress(0);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onChange("");
  };

  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="URL gambar atau upload file (Rekomendasi: Upload untuk kualitas HD)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <label
          className={`flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all shadow-md hover:shadow-lg ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <HiOutlineUpload className="w-5 h-5" />
          {isUploading ? `${uploadProgress}%` : "Upload HD"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="mt-2">
          <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
            <div
              className="h-2 transition-all duration-300 ease-out bg-gradient-to-r from-purple-500 to-purple-600"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Mengoptimalkan gambar HD...
          </p>
        </div>
      )}

      {/* Preview dengan kualitas HD */}
      {preview && !isUploading && (
        <div className="relative mt-3 group">
          <div className="relative overflow-hidden border-2 border-gray-300 rounded-lg shadow-lg">
            <img
              src={preview}
              alt="Preview HD"
              className="object-contain w-full h-auto"
              style={{
                imageRendering: "-webkit-optimize-contrast",
                "crisp-edges": "crisp-edges",
              }}
            />
            <button
              onClick={handleRemoveImage}
              className="absolute p-2 text-white transition-opacity bg-red-500 rounded-full shadow-lg opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600"
              title="Hapus gambar"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-gray-600">
              📊 Ukuran: {(preview.length / 1024).toFixed(0)} KB
            </span>
            <span className="font-semibold text-green-600">
              ✨ Kualitas HD (95%)
            </span>
          </div>
        </div>
      )}

      {/* Tips */}
      {!preview && (
        <div className="p-3 mt-2 border border-blue-200 rounded-lg bg-blue-50">
          <p className="text-xs text-blue-700">
            💡 <strong>Tips untuk Banner HD:</strong>
          </p>
          <ul className="mt-1 ml-4 space-y-1 text-xs text-blue-600 list-disc">
            <li>Gunakan gambar minimal 1920x1080px (Full HD)</li>
            <li>Format JPG/PNG untuk hasil terbaik</li>
            <li>Upload langsung untuk kualitas optimal</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;