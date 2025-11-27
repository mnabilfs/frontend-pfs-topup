import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineUserCircle,
  HiOutlineX,
  HiOutlineUpload,
  HiOutlinePhotograph,
} from "react-icons/hi";

const API_URL = "http://127.0.0.1:8000/api";

const formatRupiah = (num) => {
  if (!num) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

const EMPTY_GAME_FORM = {
  name: "",
  publisher: "",
  image_url: "",
  banner_url: "",
};
const EMPTY_PRODUCT_FORM = { game_id: "", name: "", price: "", image_url: "" };

// Helper function untuk API calls
const apiCall = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token");

  // if (!token) {
  //   throw new Error("No authentication token found");
  // }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};

// Komponen Upload Image
const ImageUpload = ({ label, value, onChange, preview }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    // Maksimal 5MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB!");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      onChange(reader.result);
      setIsUploading(false);
    };

    reader.onerror = () => {
      alert("Gagal membaca file!");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="URL gambar atau upload file"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <label
          className={`flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <HiOutlineUpload className="w-5 h-5" />
          {isUploading ? "Loading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 object-cover rounded border"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ukuran: {(preview.length / 1024).toFixed(0)} KB
          </p>
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ text, Icon, name, activePage, setActivePage }) => {
  const isActive = activePage === name;
  return (
    <button
      onClick={() => setActivePage(name)}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-purple-600 text-white shadow-lg"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon
        className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-gray-400"}`}
      />
      <span className="font-medium">{text}</span>
    </button>
  );
};

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg z-20">
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <h1 className="text-xl font-bold text-purple-700">PFSStore_Admin</h1>
      </div>
      <nav className="p-4 space-y-2">
        <SidebarLink
          text="Kelola Game"
          Icon={HiOutlineCube}
          name="games"
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <SidebarLink
          text="Kelola Harga"
          Icon={HiOutlineTag}
          name="prices"
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <SidebarLink
          text="Kelola Banner"
          Icon={HiOutlinePhotograph} // import dari react-icons/hi
          name="banners"
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <div className="pt-4 border-t border-gray-200">
          <a
            href="/"
            className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <HiOutlineHome className="w-5 h-5 mr-3 text-gray-400" />
            <span className="font-medium">Lihat Toko</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

const Header = ({ onLogout }) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-full px-8">
        <div className="relative">
          <HiOutlineSearch className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-96 pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Admin</span>
          <HiOutlineUserCircle className="w-10 h-10 text-gray-400" />
          <button
            onClick={onLogout}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("games");
  const [games, setGames] = useState([]);
  const [products, setProducts] = useState([]);
  const [gameForm, setGameForm] = useState(EMPTY_GAME_FORM);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [selectedGameForPrices, setSelectedGameForPrices] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    image_url: "",
    order: 0,
    is_active: true,
  });

  // // Check authentication
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     alert("Anda harus login terlebih dahulu!");
  //     navigate("/login");
  //     return;
  //   }
  // }, [navigate]);

  // Load data dari API saat pertama kali
  useEffect(() => {
    loadGames();
    loadProducts();
    loadBanners();
  }, []);

  useEffect(() => {
    if (games.length > 0 && !editingId) {
      const defaultGameId = games[0].id.toString();
      setSelectedGameForPrices(defaultGameId);
      setProductForm((pf) => ({ ...pf, game_id: defaultGameId }));
    }
  }, [games, editingId]);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall("/games");
      setGames(data);
    } catch (error) {
      console.error("Error loading games:", error);
      setError("Gagal memuat data game: " + error.message);

      if (error.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await apiCall("/products");
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Gagal memuat data produk: " + error.message);
    }
  };

  const loadBanners = async () => {
    try {
      const data = await apiCall("/banners/all");
      setBanners(data);
    } catch (error) {
      console.error("Error loading banners:", error);
      setError("Gagal memuat data banner: " + error.message);
    }
  };

  const handleEditClick = (type, item) => {
    setEditingId(item.id);
    setEditingType(type);

    if (type === "game") {
      setGameForm(item);
      setActivePage("games");
    } else if (type === "product") {
      setProductForm(item);
      setSelectedGameForPrices(item.game_id.toString());
      setActivePage("prices");
    } else if (type === "banner") {
      setBannerForm(item);
      setActivePage("banners");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingType(null);
    setGameForm(EMPTY_GAME_FORM);
    setProductForm({ ...EMPTY_PRODUCT_FORM, game_id: selectedGameForPrices });
    setBannerForm({ title: "", image_url: "", order: 0, is_active: true });
  };

  const handleGameSubmit = async () => {
    if (!gameForm.name || !gameForm.image_url) {
      alert("Nama Game dan Gambar wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingType === "game" && editingId) {
        await apiCall(`/games/${editingId}`, "PUT", gameForm);
        alert("Game berhasil di-update!");
      } else {
        await apiCall("/games", "POST", gameForm);
        alert("Game berhasil disimpan!");
      }

      await loadGames();
      handleCancelEdit();
    } catch (error) {
      console.error("Error saving game:", error);
      alert("Gagal menyimpan game: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async () => {
    const game_id = parseInt(productForm.game_id);
    const price = parseInt(productForm.price);

    if (!game_id || !productForm.name || !price) {
      alert("Game, Nama Item, dan Harga wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const productData = {
        ...productForm,
        game_id: game_id,
        name: productForm.name,
        price: price,
        image_url:
          productForm.image_url ||
          "https://www.transparentpng.com/thumb/diamond/O3UOts-diamond-best-png.png",
      };

      if (editingType === "product" && editingId) {
        await apiCall(`/products/${editingId}`, "PUT", productData);
        alert("Harga berhasil di-update!");
      } else {
        await apiCall("/products", "POST", productData);
        alert("Harga berhasil disimpan!");
      }

      await loadProducts();
      handleCancelEdit();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Gagal menyimpan produk: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerSubmit = async () => {
    if (!bannerForm.image_url) {
      alert("Gambar banner wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bannerData = {
        title: bannerForm.title,
        image_url: bannerForm.image_url,
        order: parseInt(bannerForm.order) || 0,
        is_active: bannerForm.is_active,
      };

      if (editingType === "banner" && editingId) {
        await apiCall(`/banners/${editingId}`, "PUT", bannerData);
        alert("Banner berhasil di-update!");
      } else {
        await apiCall("/banners", "POST", bannerData);
        alert("Banner berhasil disimpan!");
      }

      await loadBanners();
      handleCancelEdit();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Gagal menyimpan banner: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      setLoading(true);
      setError(null);

      if (type === "games") {
        await apiCall(`/games/${id}`, "DELETE");
        await loadGames();
      } else if (type === "products") {
        await apiCall(`/products/${id}`, "DELETE");
        await loadProducts();
      } else if (type === "banners") {
        await apiCall(`/banners/${id}`, "DELETE");
        await loadBanners();
      }

      handleCancelEdit();
      alert("Data berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Gagal menghapus data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiCall("/logout", "POST");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="ml-64">
        <Header onLogout={handleLogout} />

        <main className="pt-20">
          <div className="p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                <div className="text-center text-white">
                  <div className="w-28 h-28 mx-auto mb-8 border-t-8 border-b-8 border-purple-600 rounded-full animate-spin"></div>
                  <p className="text-2xl text-gray-400">Memproses</p>
                </div>
              </div>
            )}

            {activePage === "games" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Kelola Game
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        {editingType === "game"
                          ? `Edit Game: ${gameForm.name}`
                          : "Tambah Game Baru"}
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Nama Game
                        </label>
                        <input
                          type="text"
                          placeholder="Cth: Valorant"
                          value={gameForm.name}
                          onChange={(e) =>
                            setGameForm({ ...gameForm, name: e.target.value })
                          }
                          className="block w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Publisher
                        </label>
                        <input
                          type="text"
                          placeholder="Cth: Riot Games"
                          value={gameForm.publisher}
                          onChange={(e) =>
                            setGameForm({
                              ...gameForm,
                              publisher: e.target.value,
                            })
                          }
                          className="block w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <ImageUpload
                        label="Gambar Card (di Home)"
                        value={gameForm.image_url}
                        onChange={(val) =>
                          setGameForm({ ...gameForm, image_url: val })
                        }
                        preview={gameForm.image_url}
                      />

                      <ImageUpload
                        label="Gambar Banner (di Topup)"
                        value={gameForm.banner_url}
                        onChange={(val) =>
                          setGameForm({ ...gameForm, banner_url: val })
                        }
                        preview={gameForm.banner_url}
                      />

                      <div className="flex justify-end pt-2 gap-3">
                        {editingType === "game" && (
                          <button
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                          >
                            <HiOutlineX className="w-5 h-5" />
                            Batal
                          </button>
                        )}
                        <button
                          onClick={handleGameSubmit}
                          disabled={loading}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                        >
                          {editingType === "game" ? (
                            <HiOutlinePencil className="w-5 h-5" />
                          ) : (
                            <HiOutlinePlus className="w-5 h-5" />
                          )}
                          {editingType === "game"
                            ? "Update Game"
                            : "Simpan Game"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Game
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {games.map((game) => (
                            <tr
                              key={game.id}
                              className={`hover:bg-gray-50 ${
                                editingId === game.id && editingType === "game"
                                  ? "bg-purple-50"
                                  : ""
                              }`}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={game.image_url}
                                    alt=""
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {game.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {game.publisher}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 space-x-2">
                                <button
                                  onClick={() => handleEditClick("game", game)}
                                  disabled={loading}
                                  className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 disabled:opacity-50"
                                >
                                  <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete("games", game.id)}
                                  disabled={loading}
                                  className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50"
                                >
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {games.length === 0 && (
                        <p className="text-center text-sm text-gray-500 p-6">
                          Belum ada game. Tambahkan game pertama Anda!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "prices" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Kelola Harga
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4 sticky top-28">
                      <h3 className="text-lg font-semibold text-gray-700">
                        {editingType === "product"
                          ? `Edit Item: ${productForm.name}`
                          : "Tambah Harga Baru"}
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Pilih Game
                        </label>
                        <select
                          value={productForm.game_id || selectedGameForPrices}
                          disabled={editingType === "product" || loading}
                          onChange={(e) => {
                            setSelectedGameForPrices(e.target.value);
                            setProductForm({
                              ...productForm,
                              game_id: e.target.value,
                            });
                          }}
                          className="block w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                        >
                          {games.length === 0 && (
                            <option value="">Belum ada game</option>
                          )}
                          {games.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Nama Item
                        </label>
                        <input
                          type="text"
                          placeholder="Cth: 86 Diamonds"
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              name: e.target.value,
                            })
                          }
                          className="block w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          placeholder="Cth: 20000"
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              price: e.target.value,
                            })
                          }
                          className="block w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <ImageUpload
                        label="Ikon Item (Opsional)"
                        value={productForm.image_url || ""}
                        onChange={(val) =>
                          setProductForm({ ...productForm, image_url: val })
                        }
                        preview={productForm.image_url}
                      />

                      <div className="flex justify-end pt-2 gap-3">
                        {editingType === "product" && (
                          <button
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                          >
                            <HiOutlineX className="w-5 h-5" />
                            Batal
                          </button>
                        )}
                        <button
                          onClick={handleProductSubmit}
                          disabled={loading || games.length === 0}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                        >
                          {editingType === "product" ? (
                            <HiOutlinePencil className="w-5 h-5" />
                          ) : (
                            <HiOutlinePlus className="w-5 h-5" />
                          )}
                          {editingType === "product"
                            ? "Update Harga"
                            : "Simpan Harga"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Nama Item
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Harga
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {products
                            .filter(
                              (p) =>
                                p.game_id === parseInt(selectedGameForPrices)
                            )
                            .map((product) => (
                              <tr
                                key={product.id}
                                className={`hover:bg-gray-50 ${
                                  editingId === product.id &&
                                  editingType === "product"
                                    ? "bg-purple-50"
                                    : ""
                                }`}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={
                                        product.image_url ||
                                        "https://www.transparentpng.com/thumb/diamond/O3UOts-diamond-best-png.png"
                                      }
                                      alt=""
                                      className="w-8 h-8 object-contain"
                                    />
                                    <span className="text-sm font-medium text-gray-900">
                                      {product.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm font-semibold text-gray-700">
                                    {formatRupiah(product.price)}
                                  </div>
                                </td>
                                <td className="px-4 py-3 space-x-2">
                                  <button
                                    onClick={() =>
                                      handleEditClick("product", product)
                                    }
                                    disabled={loading}
                                    className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 disabled:opacity-50"
                                  >
                                    <HiOutlinePencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete("products", product.id)
                                    }
                                    disabled={loading}
                                    className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50"
                                  >
                                    <HiOutlineTrash className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {products.filter(
                        (p) => p.game_id === parseInt(selectedGameForPrices)
                      ).length === 0 && (
                        <p className="text-center text-sm text-gray-500 p-6">
                          Belum ada data harga untuk game ini.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "banners" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Kelola Banner
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* FORM TAMBAH/EDIT BANNER */}
                  <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4 sticky top-28">
                      <h3 className="text-lg font-semibold text-gray-700">
                        {editingType === "banner"
                          ? `Edit Banner: ${bannerForm.title || "Tanpa Judul"}`
                          : "Tambah Banner Baru"}
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Judul Banner (Opsional)
                        </label>
                        <input
                          type="text"
                          placeholder="Cth: Promo Spesial"
                          value={bannerForm.title}
                          onChange={(e) =>
                            setBannerForm({
                              ...bannerForm,
                              title: e.target.value,
                            })
                          }
                          className="block w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <ImageUpload
                        label="Gambar Banner"
                        value={bannerForm.image_url}
                        onChange={(val) =>
                          setBannerForm({ ...bannerForm, image_url: val })
                        }
                        preview={bannerForm.image_url}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Urutan Tampil
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={bannerForm.order}
                          onChange={(e) =>
                            setBannerForm({
                              ...bannerForm,
                              order: e.target.value,
                            })
                          }
                          className="block w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Semakin kecil angka, semakin depan urutannya
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="banner-active"
                          checked={bannerForm.is_active}
                          onChange={(e) =>
                            setBannerForm({
                              ...bannerForm,
                              is_active: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label
                          htmlFor="banner-active"
                          className="ml-2 text-sm font-medium text-gray-700"
                        >
                          Aktif (Tampilkan di Home)
                        </label>
                      </div>

                      <div className="flex justify-end pt-2 gap-3">
                        {editingType === "banner" && (
                          <button
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                          >
                            <HiOutlineX className="w-5 h-5" />
                            Batal
                          </button>
                        )}
                        <button
                          onClick={handleBannerSubmit}
                          disabled={loading}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                        >
                          {editingType === "banner" ? (
                            <HiOutlinePencil className="w-5 h-5" />
                          ) : (
                            <HiOutlinePlus className="w-5 h-5" />
                          )}
                          {editingType === "banner"
                            ? "Update Banner"
                            : "Simpan Banner"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* TABEL DAFTAR BANNER */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Preview
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Judul
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Urutan
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {banners.map((banner) => (
                            <tr
                              key={banner.id}
                              className={`hover:bg-gray-50 ${
                                editingId === banner.id &&
                                editingType === "banner"
                                  ? "bg-purple-50"
                                  : ""
                              }`}
                            >
                              <td className="px-4 py-3">
                                <img
                                  src={banner.image_url}
                                  alt={banner.title}
                                  className="w-20 h-12 object-cover rounded"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {banner.title || "-"}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm text-gray-700">
                                  {banner.order}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {banner.is_active ? (
                                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                    Aktif
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
                                    Nonaktif
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 space-x-2">
                                <button
                                  onClick={() =>
                                    handleEditClick("banner", banner)
                                  }
                                  disabled={loading}
                                  className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 disabled:opacity-50"
                                >
                                  <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete("banners", banner.id)
                                  }
                                  disabled={loading}
                                  className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50"
                                >
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {banners.length === 0 && (
                        <p className="text-center text-sm text-gray-500 p-6">
                          Belum ada banner. Tambahkan banner pertama Anda!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;