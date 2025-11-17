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
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi";
import '../App.css'; 

// ... (semua DATA DUMMY & HELPER biarkan sama)
const INITIAL_GAMES = [
  { id: 1, name: 'Mobile Legends', publisher: 'Moonton', imageUrl: 'https://play-lh.googleusercontent.com/QXCVbZd0d71ho4MIYHHxnY6BJFGXI-fzRS5MXJXU1n4n2T-VdQgB1vrdJpydokA34UA', bannerUrl: 'https://i.imgur.com/exampleBanner.png' },
  { id: 2, name: 'Free Fire', publisher: 'Garena', imageUrl: 'https://play-lh.googleusercontent.com/T-M-jC-0G-bX-Kd5-9I-g-2-9tOruj-S-rGmLx-9i2d-i5AU-w-g2v_JmN6-4-h-Ug', bannerUrl: 'https://i.imgur.com/exampleBanner.png' }
];
const INITIAL_PRODUCTS = [
  { id: 1, gameId: 1, name: '86 Diamonds', price: 20000 },
  { id: 2, gameId: 1, name: '172 Diamonds', price: 40000 },
  { id: 3, gameId: 2, name: '140 Diamonds', price: 25000 }
];
const formatRupiah = (num) => {
  if (!num) return "Rp 0";
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

// ... (semua komponen SidebarLink, Sidebar, Header biarkan sama)
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
  // ... (semua STATE & LOGIC biarkan sama)
  const [activePage, setActivePage] = useState('games'); // 'games' atau 'prices'
  const [games, setGames] = useState([]);
  const [products, setProducts] = useState([]);
  const [gameForm, setGameForm] = useState({ name: '', publisher: '', imageUrl: '', bannerUrl: '' });
  const [productForm, setProductForm] = useState({ gameId: '', name: '', price: '' });
  const [selectedGameForPrices, setSelectedGameForPrices] = useState('');

  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem('db_games'));
    const storedProducts = JSON.parse(localStorage.getItem('db_products'));
    const loadedGames = (storedGames && storedGames.length > 0) ? storedGames : INITIAL_GAMES;
    const loadedProducts = (storedProducts && storedProducts.length > 0) ? storedProducts : INITIAL_PRODUCTS;
    setGames(loadedGames);
    setProducts(loadedProducts);
    if (loadedGames.length > 0) {
      setSelectedGameForPrices(loadedGames[0].id.toString());
    }
    if (!(storedGames && storedGames.length > 0)) localStorage.setItem('db_games', JSON.stringify(INITIAL_GAMES));
    if (!(storedProducts && storedProducts.length > 0)) localStorage.setItem('db_products', JSON.stringify(INITIAL_PRODUCTS));
  }, []);

  const handleAddGame = (e) => {
    e.preventDefault();
    if (!gameForm.name || !gameForm.imageUrl) return alert("Nama Game dan URL Gambar wajib diisi!");
    const newGame = { id: Date.now(), ...gameForm };
    const updatedGames = [...games, newGame];
    setGames(updatedGames);
    localStorage.setItem('db_games', JSON.stringify(updatedGames));
    setGameForm({ name: '', publisher: '', imageUrl: '', bannerUrl: '' });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const gameId = parseInt(selectedGameForPrices);
    if (!gameId || !productForm.name || !productForm.price) return alert("Semua field wajib diisi!");
    const newProduct = { id: Date.now(), gameId, name: productForm.name, price: parseInt(productForm.price) };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('db_products', JSON.stringify(updatedProducts));
    setProductForm({ ...productForm, name: '', price: '' });
  };

  const handleDelete = (type, id) => {
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
              // ... (Konten 'games' biarkan sama)
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola Game</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <form onSubmit={handleAddGame} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Tambah Game Baru</h3>
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
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                          <HiOutlinePlus className="w-5 h-5" />
                          Simpan Game
                        </button>
                      </div>
                    </form>
                  </div>
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
                            <tr key={game.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">{game.name}</div>
                                <div className="text-xs text-gray-500">{game.publisher}</div>
                              </td>
                              <td className="px-4 py-3 space-x-2">
                                <button onClick={() => alert('Fitur edit belum ada')} className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
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
                  
                  {/* Kolom Form */}
                  <div className="lg:col-span-1">
                    <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-lg shadow-md space-y-4 sticky top-28">
                      <h3 className="text-lg font-semibold text-gray-700">Tambah Harga Baru</h3>
                      <div>
                        {/* --- PERBAIKAN DI SINI ---
                          Mengganti </Tabel> menjadi </label> 
                        */}
                        <label className="block text-sm font-medium text-gray-600 mb-1">Pilih Game</label>
                        <select 
                          value={selectedGameForPrices}
                          onChange={e => setSelectedGameForPrices(e.target.value)}
                          className="block w-full text-sm rounded-md border-gray-300 focus:ring-purple-500 focus:border-purple-500"
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
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                          <HiOutlinePlus className="w-5 h-5" />
                          Simpan Harga
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Kolom Tabel */}
                  <div className="lg:col-span-2">
                    {/* ... (Konten Tabel 'prices' biarkan sama) ... */}
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
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-semibold text-gray-700">{formatRupiah(product.price)}</div>
                              </td>
                              <td className="px-4 py-3 space-x-2">
                                <button onClick={() => alert('Fitur edit belum ada')} className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
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