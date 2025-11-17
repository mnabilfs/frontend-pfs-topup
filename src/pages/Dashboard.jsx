import React, { useState, useEffect } from 'react';
// ... (semua import biarkan sama)
import { 
  HiOutlineHome, 
  HiOutlineCube, 
  HiOutlineTag, 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlinePencil,
  HiOutlineChevronDown,
  HiOutlineSearch,
  HiOutlineUserCircle,
  HiOutlineX
} from "react-icons/hi";
import '../App.css'; 

// --- DATA DUMMY & HELPER ---
const FALLBACK_ICON_URL = 'https://www.transparentpng.com/thumb/diamond/O3UOts-diamond-best-png.png';

const INITIAL_GAMES = [
  { id: 1, name: 'Mobile Legends', publisher: 'Moonton', imageUrl: 'https://play-lh.googleusercontent.com/QXCVbZd0d71ho4MIYHHxnY6BJFGXI-fzRS5MXJXU1n4n2T-VdQgB1vrdJpydokA34UA', bannerUrl: 'https://i.imgur.com/exampleBanner.png' },
  { id: 2, name: 'Free Fire', publisher: 'Garena', imageUrl: 'https://play-lh.googleusercontent.com/T-M-jC-0G-bX-Kd5-9I-g-2-9tOruj-S-rGmLx-9i2d-i5AU-w-g2v_JmN6-4-h-Ug', bannerUrl: 'https://i.imgur.com/exampleBanner.png' }
];
const INITIAL_PRODUCTS = [
  { id: 1, gameId: 1, name: '86 Diamonds', price: 20000, imageUrl: FALLBACK_ICON_URL },
  { id: 2, gameId: 1, name: '172 Diamonds', price: 40000, imageUrl: FALLBACK_ICON_URL },
  { id: 3, gameId: 2, name: '140 Diamonds', price: 25000, imageUrl: 'https://cdn.icon-icons.com/icons2/3306/PNG/512/free_fire_garena_game_icon_209121.png' }
];
const formatRupiah = (num) => {
  if (!num) return "Rp 0";
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};
// --- (AKHIR DARI DATA DUMMY & HELPER) ---

// --- Form State Kosong (untuk reset) ---
const EMPTY_GAME_FORM = { name: '', publisher: '', imageUrl: '', bannerUrl: '' };
const EMPTY_PRODUCT_FORM = { gameId: '', name: '', price: '', imageUrl: '' };


// --- (semua komponen SidebarLink, Sidebar, Header biarkan sama) ---
const SidebarLink = ({ text, Icon, name, activePage, setActivePage }) => {
  const isActive = activePage === name;
  return (
    <button
      onClick={() => setActivePage(name)}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-purple-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
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
const Header = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-full px-8">
        <div className="relative">
          <HiOutlineSearch className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search (Ctrl+/)"
            className="w-96 pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Admin</span>
          <HiOutlineUserCircle className="w-10 h-10 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

// --- KOMPONEN UTAMA: DASHBOARD ---
const Dashboard = () => {
  const [activePage, setActivePage] = useState('games');
  
  // --- STATE DATA ---
  const [games, setGames] = useState([]);
  const [products, setProducts] = useState([]);
  
  // --- STATE FORM ---
  const [gameForm, setGameForm] = useState(EMPTY_GAME_FORM);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  
  // --- STATE UNTUK LOGIKA EDIT ---
  const [editingId, setEditingId] = useState(null); 
  const [editingType, setEditingType] = useState(null); 
  
  const [selectedGameForPrices, setSelectedGameForPrices] = useState('');

  // ... (useEffect dan semua fungsi logic biarkan sama persis seperti versi sebelumnya) ...
  // Load data dari LocalStorage
  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem('db_games'));
    const storedProducts = JSON.parse(localStorage.getItem('db_products'));
    const loadedGames = (storedGames && storedGames.length > 0) ? storedGames : INITIAL_GAMES;
    const loadedProducts = (storedProducts && storedProducts.length > 0) ? storedProducts : INITIAL_PRODUCTS;
    
    setGames(loadedGames);
    setProducts(loadedProducts);
    
    if (loadedGames.length > 0) {
      const defaultGameId = loadedGames[0].id.toString();
      setSelectedGameForPrices(defaultGameId);
      setProductForm(pf => ({...pf, gameId: defaultGameId}));
    }
    if (!(storedGames && storedGames.length > 0)) localStorage.setItem('db_games', JSON.stringify(INITIAL_GAMES));
    if (!(storedProducts && storedProducts.length > 0)) localStorage.setItem('db_products', JSON.stringify(INITIAL_PRODUCTS));
  }, []);

  // Update gameId di form produk saat dropdown berubah (HANYA JIKA TIDAK SEDANG EDIT)
  useEffect(() => {
    if (!editingId) {
      setProductForm(pf => ({ ...EMPTY_PRODUCT_FORM, gameId: selectedGameForPrices }));
    }
  }, [selectedGameForPrices, editingId]);


  // --- FUNGSI BARU UNTUK EDIT & CANCEL ---
  const handleEditClick = (type, item) => {
    setEditingId(item.id);
    setEditingType(type);
    
    if (type === 'game') {
      setGameForm(item);
      setActivePage('games');
    } else if (type === 'product') {
      setProductForm(item);
      setSelectedGameForPrices(item.gameId.toString()); // Sync dropdown
      setActivePage('prices');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingType(null);
    setGameForm(EMPTY_GAME_FORM);
    // Reset form produk ke game yg sedang dipilih di dropdown
    setProductForm({ ...EMPTY_PRODUCT_FORM, gameId: selectedGameForPrices });
  };
  

  // --- FUNGSI SUBMIT (Gabungan Add & Update) ---
  const handleGameSubmit = (e) => {
    e.preventDefault();
    if (!gameForm.name || !gameForm.imageUrl) return alert("Nama Game dan URL Gambar wajib diisi!");

    if (editingType === 'game' && editingId) {
      // --- LOGIKA UPDATE ---
      const updatedGames = games.map(g => 
        g.id === editingId ? { ...g, ...gameForm } : g
      );
      setGames(updatedGames);
      localStorage.setItem('db_games', JSON.stringify(updatedGames));
      alert('Game berhasil di-update!');
    } else {
      // --- LOGIKA ADD ---
      const newGame = { id: Date.now(), ...gameForm };
      const updatedGames = [...games, newGame];
      setGames(updatedGames);
      localStorage.setItem('db_games', JSON.stringify(updatedGames));
      alert('Game berhasil disimpan!');
    }
    handleCancelEdit(); // Reset form & state edit
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const gameId = parseInt(productForm.gameId);
    const price = parseInt(productForm.price);
    if (!gameId || !productForm.name || !price) return alert("Game, Nama Item, dan Harga wajib diisi!");

    if (editingType === 'product' && editingId) {
      // --- LOGIKA UPDATE ---
      const updatedProducts = products.map(p => 
        p.id === editingId ? { ...p, ...productForm, gameId, price } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('db_products', JSON.stringify(updatedProducts));
      alert('Harga berhasil di-update!');
    } else {
      // --- LOGIKA ADD ---
      const newProduct = { id: Date.now(), ...productForm, gameId, price };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('db_products', JSON.stringify(updatedProducts));
      alert('Harga berhasil disimpan!');
    }
    handleCancelEdit(); // Reset form & state edit
  };

  const handleDelete = (type, id) => {
    // ... (Logika Hapus tetap sama)
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    if (type === 'games') {
      const updated = games.filter(g => g.id !== id);
      setGames(updated);
      localStorage.setItem('db_games', JSON.stringify(updated));
    } else {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('db_products', JSON.stringify(updated));
    }
    handleCancelEdit(); // Pastikan reset form jika item yg diedit dihapus
  };


  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="ml-64"> 
        <Header />
        
        <main className="pt-20"> 
          <div className="p-8">

            {/* --- KONTEN HALAMAN KELOLA GAME --- */}
            {activePage === 'games' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola Game</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Kolom Form (DIKEMBALIKAN KE URL) */}
                  <div className="lg:col-span-2">
                    <form onSubmit={handleGameSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        {editingType === 'game' ? `Edit Game: ${gameForm.name}` : 'Tambah Game Baru'}
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nama Game</label>
                        <input type="text" placeholder="Cth: Valorant" value={gameForm.name} onChange={e => setGameForm({...gameForm, name: e.target.value})} className="block w-full text-sm rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Publisher</label>
                        <input type="text" placeholder="Cth: Riot Games" value={gameForm.publisher} onChange={e => setGameForm({...gameForm, publisher: e.target.value})} className="block w-full text-sm rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">URL Gambar Card (di Home)</label>
                        <input type="text" placeholder="https://..." value={gameForm.imageUrl} onChange={e => setGameForm({...gameForm, imageUrl: e.target.value})} className="block w-full text-sm rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">URL Gambar Banner (di Topup)</label>
                        <input type="text" placeholder="https://..." value={gameForm.bannerUrl} onChange={e => setGameForm({...gameForm, bannerUrl: e.target.value})} className="block w-full text-sm rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500" />
                      </div>
                      <div className="flex justify-end pt-2 gap-3">
                        {editingType === 'game' && (
                          <button type="button" onClick={handleCancelEdit} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all">
                            <HiOutlineX className="w-5 h-5" />
                            Batal
                          </button>
                        )}
                        <button type="submit" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                          {editingType === 'game' ? <HiOutlinePencil className="w-5 h-5" /> : <HiOutlinePlus className="w-5 h-5" />}
                          {editingType === 'game' ? 'Update Game' : 'Simpan Game'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Kolom Tabel (SAMA) */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Game</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {games.map(game => (
                            <tr key={game.id} className={`hover:bg-gray-50 ${editingId === game.id && editingType === 'game' ? 'bg-purple-50' : ''}`}>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">{game.name}</div>
                                <div className="text-xs text-gray-500">{game.publisher}</div>
                              </td>
                              <td className="px-4 py-3 space-x-2">
                                <button onClick={() => handleEditClick('game', game)} className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
                                  <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete('games', game.id)} className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}
            
            {/* --- KONTEN HALAMAN KELOLA HARGA --- */}
            {activePage === 'prices' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola Harga</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Kolom Form (DIKEMBALIKAN KE URL) */}
                  <div className="lg:col-span-1">
                    <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 sticky top-28">
                      <h3 className="text-lg font-semibold text-gray-700">
                        {editingType === 'product' ? `Edit Item: ${productForm.name}` : 'Tambah Harga Baru'}
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Pilih Game</label>
                        <select 
                          value={productForm.gameId || selectedGameForPrices} // Dinamis
                          disabled={editingType === 'product'} // Kunci jika sedang edit
                          onChange={e => setSelectedGameForPrices(e.target.value)}
                          className="block w-full text-sm rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                        >
                          {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nama Item</label>
                        <input type="text" placeholder="Cth: 86 Diamonds" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="block w-full text-sm rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Harga (Rp)</label>
                        <input type="number" placeholder="Cth: 20000" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="block w-full text-sm rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">URL Ikon Item (Opsional)</label>
                        <input type="text" placeholder="https://... .png" value={productForm.imageUrl || ''} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} className="block w-full text-sm rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500" />
                      </div>
                      <div className="flex justify-end pt-2 gap-3">
                        {editingType === 'product' && (
                          <button type="button" onClick={handleCancelEdit} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all">
                            <HiOutlineX className="w-5 h-5" />
                            Batal
                          </button>
                        )}
                        <button type="submit" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                          {editingType === 'product' ? <HiOutlinePencil className="w-5 h-5" /> : <HiOutlinePlus className="w-5 h-5" />}
                          {editingType === 'product' ? 'Update Harga' : 'Simpan Harga'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Kolom Tabel (DIKEMBALIKAN KE URL) */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Item</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {products.filter(p => p.gameId === parseInt(selectedGameForPrices)).map(product => (
                            <tr key={product.id} className={`hover:bg-gray-50 ${editingId === product.id && editingType === 'product' ? 'bg-purple-50' : ''}`}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={product.imageUrl || FALLBACK_ICON_URL} 
                                    alt="" 
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => e.target.src = FALLBACK_ICON_URL}
                                  />
                                  <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-semibold text-gray-700">{formatRupiah(product.price)}</div>
                              </td>
                              <td className="px-4 py-3 space-x-2">
                                <button onClick={() => handleEditClick('product', product)} className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
                                  <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete('products', product.id)} className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {products.filter(p => p.gameId === parseInt(selectedGameForPrices)).length === 0 && (
                        <p className="text-center text-sm text-gray-500 p-6">Belum ada data harga untuk game ini.</p>
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