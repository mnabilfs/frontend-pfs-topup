import React, { useState, useEffect } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

const MusicManager = () => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    loadMusics();
  }, []);

  // Load semua musik
  const loadMusics = async () => {
    try {
      setLoading(true);
      const response = await API.get("api/background-music");
      setMusics(response.data);
    } catch (error) {
      console.error("Error loading musics:", error);
      Swal.fire("Error", "Gagal memuat daftar musik", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle upload musik baru
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !audioFile) {
      Swal.fire("Error", "Judul dan file audio wajib diisi", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (artist) formData.append("artist", artist);
    formData.append("audio", audioFile);
    formData.append("is_active", isActive ? "1" : "0");

    try {
      setLoading(true);
      await API.post("api/background-music", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Berhasil!", "Musik berhasil diupload", "success");

      // Reset form
      setTitle("");
      setArtist("");
      setAudioFile(null);
      setIsActive(false);
      setShowUploadForm(false);

      // Reload data
      loadMusics();
    } catch (error) {
      console.error("Error uploading music:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Gagal upload musik",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Set musik aktif
  const handleSetActive = async (id) => {
    try {
      await API.post(`api/background-music/${id}/activate`);
      Swal.fire("Berhasil!", "Musik berhasil diaktifkan", "success");
      loadMusics();
    } catch (error) {
      console.error("Error activating music:", error);
      Swal.fire("Error", "Gagal mengaktifkan musik", "error");
    }
  };

  // Hapus musik
  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`api/background-music/${id}`);
        Swal.fire("Terhapus!", "Musik berhasil dihapus", "success");
        loadMusics();
      } catch (error) {
        console.error("Error deleting music:", error);
        Swal.fire("Error", "Gagal menghapus musik", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Background Music Manager
        </h2>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          {showUploadForm ? "Tutup Form" : "+ Upload Musik"}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="p-6 mb-6 bg-gray-800 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Upload Musik Baru
          </h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-white">
                Judul Musik <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 text-white bg-gray-700 rounded"
                placeholder="Masukkan judul musik"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">
                Artis (Opsional)
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full p-2 text-white bg-gray-700 rounded"
                placeholder="Masukkan nama artis"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">
                File Audio (MP3/WAV/OGG, Max 10MB){" "}
                <span className="text-red-400">*</span>
              </label>
              <input
                type="file"
                accept=".mp3,.wav,.ogg"
                onChange={(e) => setAudioFile(e.target.files[0])}
                className="w-full p-2 text-white bg-gray-700 rounded"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm text-white">
                Aktifkan musik ini sebagai background music
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600"
            >
              {loading ? "Uploading..." : "Upload Musik"}
            </button>
          </form>
        </div>
      )}

      {/* Music List */}
      <div className="bg-gray-800 rounded-lg">
        {loading && !showUploadForm ? (
          <div className="p-8 text-center text-white">
            <div className="inline-block w-8 h-8 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="mt-2">Loading...</p>
          </div>
        ) : musics.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Belum ada musik yang diupload
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-white">Judul</th>
                  <th className="px-4 py-3 text-left text-white">Artis</th>
                  <th className="px-4 py-3 text-center text-white">Status</th>
                  <th className="px-4 py-3 text-center text-white">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {musics.map((music) => (
                  <tr
                    key={music.id}
                    className="border-b border-gray-700 hover:bg-gray-750"
                  >
                    <td className="px-4 py-3 text-white">{music.title}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {music.artist || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {music.is_active ? (
                        <span className="px-3 py-1 text-xs text-green-300 bg-green-900 rounded-full">
                          Aktif
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs text-gray-400 bg-gray-700 rounded-full">
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {!music.is_active && (
                          <button
                            onClick={() => handleSetActive(music.id)}
                            className="px-3 py-1 text-xs text-white transition bg-blue-600 rounded hover:bg-blue-700"
                          >
                            Aktifkan
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(music.id, music.title)}
                          className="px-3 py-1 text-xs text-white transition bg-red-600 rounded hover:bg-red-700"
                        >
                          Hapus
                        </button>
                        <audio
                          controls
                          src={music.audio_url}
                          className="h-8"
                          preload="none"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicManager;