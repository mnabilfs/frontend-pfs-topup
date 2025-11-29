import React, { useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Default avatar
  const defaultAvatar = "https://freesvg.org/img/abstract-user-flat-4.png";

  // Handle perubahan file avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle submit update profile
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const form = new FormData();

      // Hanya kirim field yang terisi
      if (name && name !== user?.name) form.append("name", name);
      if (email && email !== user?.email) form.append("email", email);
      if (password) form.append("password", password);
      
      if (avatarFile) {
        // Buat filename yang aman
        const timestamp = Date.now();
        const extension = avatarFile.name.split('.').pop();
        const safeFilename = `avatar_${timestamp}.${extension}`;
        
        // Buat file baru dengan nama yang sudah di-sanitize
        const renamedFile = new File([avatarFile], safeFilename, {
          type: avatarFile.type
        });
        
        form.append("avatar", renamedFile);
        console.log("Uploading file:", safeFilename);
      }

      // Debug FormData
      for (let [key, value] of form.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await API.post("/user/profile/update", form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Response:", response.data);

      // 🔥 UPDATE LOCALSTORAGE
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // 🔥 DISPATCH CUSTOM EVENT UNTUK REFRESH NAVBAR
      window.dispatchEvent(new Event("userUpdated"));
      
      // 🔥 UPDATE STATE LOKAL
      setUser(response.data.user);
      setAvatarPreview(response.data.user.avatar);
      
      alert("Profil berhasil diperbarui!");
      
      // Reset password field
      setPassword("");
      setAvatarFile(null);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        let errorMsg = "Validasi gagal:\n";
        Object.keys(errors).forEach(key => {
          errorMsg += `- ${errors[key][0]}\n`;
        });
        alert(errorMsg);
      } else {
        alert(error.response?.data?.message || "Terjadi kesalahan saat update profil");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Edit Profil</h2>

      {/* Avatar */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Avatar</label>
        <img
          src={avatarPreview || defaultAvatar}
          alt="Avatar"
          className="object-cover w-24 h-24 mb-2 border rounded-full"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
        <input 
          type="file" 
          accept="image/jpeg,image/jpg,image/png,image/gif" 
          onChange={handleAvatarChange}
          className="text-sm"
        />
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nama</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Password Baru (opsional)
        </label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Biarkan kosong jika tidak diganti"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}