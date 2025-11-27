import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import CardTopup from "../components/CardTopup";
import { Button, Card, Checkbox, Label } from "flowbite-react";
import ModalDetailPesanan from "../components/ModalDetailPesanan";
import FooterUniversal from "../components/FooterUniversal";
import Navbar from "../components/NavBar";
import CustomerService from "../components/CustomerService";

const API_URL = "http://127.0.0.1:8000/api";

const TopupPage = () => {
  const { gameId } = useParams();

  // State untuk game dan produk
  const [gameDetails, setGameDetails] = useState(null);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk form
  const [selectedTopup, setSelectedTopup] = useState(null);
  const [snapToken, setSnapToken] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [nickname, setNickname] = useState(null);
  const [formError, setFormError] = useState(false);
  const [userIdError, setUserIdError] = useState("");
  const [zoneIdError, setZoneIdError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const step2Ref = useRef(null);
  const [orderId, setOrderId] = useState(null);

  // ✅ FUNGSI UNTUK LOAD DATA DARI API DAN SIMPAN KE LOCALSTORAGE
  const loadData = useCallback(async () => {
    console.log("🔄 Loading data for game ID:", gameId);
    setIsLoading(true);
    const currentGameId = parseInt(gameId);

    try {
      // 1. Load produk dari API
      const productsResponse = await fetch(`${API_URL}/products`);
      const productsFromAPI = await productsResponse.json();

      // Format dan simpan ke localStorage
      const formattedProducts = productsFromAPI.map((product) => ({
        id: product.id,
        gameId: product.game_id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      }));
      localStorage.setItem("db_products", JSON.stringify(formattedProducts));
      console.log("✅ Products synced:", formattedProducts.length);

      // 2. Load game dari API
      const gameResponse = await fetch(`${API_URL}/games/${currentGameId}`);
      const gameFromAPI = await gameResponse.json();

      // Update localStorage games
      const storedGames = JSON.parse(localStorage.getItem("db_games")) || [];
      const gameIndex = storedGames.findIndex((g) => g.id === currentGameId);
      if (gameIndex !== -1) {
        storedGames[gameIndex] = gameFromAPI;
      } else {
        storedGames.push(gameFromAPI);
      }
      localStorage.setItem("db_games", JSON.stringify(storedGames));

      // 3. Set state
      if (gameFromAPI) {
        setGameDetails(gameFromAPI);
        document.title = `Top Up ${gameFromAPI.name} | Paper Fires Store`;
        console.log("✅ Game loaded:", gameFromAPI.name);
      }

      // 4. Filter produk untuk game ini
      const products = formattedProducts.filter(
        (p) => p.gameId === currentGameId
      );
      setProductList(products);
      console.log("✅ Products for this game:", products.length);
    } catch (error) {
      console.error("❌ Error loading data:", error);
      // Fallback ke localStorage jika API gagal
      const storedGames = JSON.parse(localStorage.getItem("db_games")) || [];
      const storedProducts =
        JSON.parse(localStorage.getItem("db_products")) || [];

      const game = storedGames.find((g) => g.id === currentGameId);
      if (game) {
        setGameDetails(game);
        document.title = `Top Up ${game.name} | Paper Fires Store`;
      }

      const products = storedProducts.filter((p) => p.gameId === currentGameId);
      setProductList(products);
    } finally {
      setIsLoading(false);
    }
  }, [gameId]);

  // ✅ Load data saat component mount
  useEffect(() => {
    loadData();
    const handleStorageChange = (e) => {
      if (e.key === "db_products" || e.key === "db_games") {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [gameId, loadData]);

  // Fungsi untuk menangani klik beli
  const handleBuyClick = async () => {
    setUserIdError("");
    setZoneIdError("");
    setNicknameError("");

    // Validasi input User ID dan Zone ID untuk Mobile Legends
    if (gameDetails && gameDetails.name.toLowerCase() === "mobile legends") {
      if (!userId || !zoneId) {
        setFormError(true);
        step2Ref.current.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (userId.length < 8) {
        setFormError(false);
        setUserIdError("*Format ID salah. Isikan sesuai format yang benar.");
        step2Ref.current.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (zoneId.length !== 4) {
        setFormError(false);
        setZoneIdError("*Format ID salah. Isikan sesuai format yang benar.");
        step2Ref.current.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (nicknameError) {
        setFormError(true);
        step2Ref.current.scrollIntoView({ behavior: "smooth" });
        return;
      }
    } else {
      // Validasi untuk game non-ML (hanya butuh User ID)
      if (!userId) {
        setFormError(true);
        step2Ref.current.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    setFormError(false);

    if (!selectedTopup) {
      alert("Silakan pilih nominal topup terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch(
        "https://pfs-topup-production-5a0d.up.railway.app/api/payment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            zoneId,
            waNumber,
            selectedTopup,
            gameName: gameDetails.name,
          }),
        }
      );

      const data = await response.json();

      if (data.token) {
        setSnapToken(data.token);
        setOrderId(data.order_id);
        setOpenModal(true);
      } else {
        alert("Gagal memproses transaksi. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error saat memproses pembayaran:", error);
      alert("Terjadi kesalahan saat menghubungkan ke server.");
    }
  };

  // Fungsi untuk mengecek status transaksi
  const checkTransactionStatus = async (orderId) => {
    console.log("Checking status for orderId:", orderId);
    try {
      const response = await fetch(
        `https://pfs-topup-production-5a0d.up.railway.app/api/payment/status/${orderId}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch transaction status: ${response.statusText}`
        );
      }

      const result = await response.json();
      const transactionStatus =
        result.status || result.data?.transaction_status;

      console.log("Transaction status from backend:", transactionStatus);

      if (transactionStatus === "settlement") {
        console.log("Pembayaran berhasil");
      } else {
        console.log("Status pembayaran:", transactionStatus);
      }

      return transactionStatus;
    } catch (error) {
      console.error("Error checking transaction status:", error);
      return null;
    }
  };

  // Fungsi untuk menangani penutupan modal dan memeriksa status transaksi
  const handleModalClose = async () => {
    if (orderId) {
      await checkTransactionStatus(orderId);
      console.log("Checking status for orderId:", orderId);
    } else {
      console.warn("⚠ Tidak ada orderId yang tersedia.");
    }

    setOpenModal(false);
  };

  // Fungsi untuk lookup nickname berdasarkan userId dan zoneId (hanya untuk Mobile Legends)
  const handleLookup = useCallback(async () => {
    if (gameDetails && gameDetails.name.toLowerCase() === "mobile legends") {
      if (!userId || !zoneId) return;

      try {
        const response = await fetch(
          `https://api.isan.eu.org/nickname/ml?id=${userId}&zone=${zoneId}`
        );
        const data = await response.json();

        if (data.success && data.name) {
          setNickname(data.name);
          setNicknameError("");
        } else {
          setNickname("");
          setNicknameError("*Nickname tidak ditemukan");
        }
      } catch (error) {
        console.error("Error saat mengambil data user:", error);
        setNickname("");
        setNicknameError("Gagal mengambil data");
      }
    }
  }, [userId, zoneId, gameDetails]);

  // Memanggil handleLookup setiap kali userId dan zoneId berubah
  useEffect(() => {
    if (gameDetails && gameDetails.name.toLowerCase() === "mobile legends") {
      if (userId && zoneId) {
        handleLookup();
      }
    }
  }, [userId, zoneId, handleLookup, gameDetails]);

  // Reset error dan nickname jika userId atau zoneId kosong
  useEffect(() => {
    if (gameDetails && gameDetails.name.toLowerCase() === "mobile legends") {
      if (!userId || !zoneId) {
        setNicknameError("");
        setNickname("");
      }
    }
  }, [userId, zoneId, gameDetails]);

  // Loading state
  if (isLoading || !gameDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="text-center text-white">
          <div className="w-28 h-28 mx-auto mb-8 border-t-8 border-b-8 border-purple-600 rounded-full animate-spin"></div>
          <p className="text-2xl text-gray-400">Memproses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800">
      <div className="flex flex-col gap-5 px-2 md:px-15 md:gap-10">
        {/* Banner Dinamis */}
        <div className="relative flex justify-center w-full mt-10 md:w-full">
          <img
            src={gameDetails.banner_url}
            alt={`Banner ${gameDetails.name}`}
            className="object-cover object-center w-full h-auto md:h-[530px] md:w-[1470px] rounded-2xl"
          />
        </div>

        {/* Grid layout */}
        <div className="grid w-full grid-cols-1 gap-0 md:grid-cols-3 md:gap-8 ">
          {/* Step 1 */}
          <div className="col-span-1 md:col-span-2 rounded-xl">
            <HeaderBar step={1} label={"Pilih Nominal"} width={"w-full"} />
            <CardTopup
              products={productList}
              selectedTopup={selectedTopup}
              setSelectedTopup={setSelectedTopup}
            />
          </div>

          {/* Wrapper Steps 2, 3, and 4 */}
          <div className="flex flex-col col-span-1 gap-5 mt-5 md:mt-0 md:col-span-1 md:gap-5">
            {/* Step 2 */}
            <div
              ref={step2Ref}
              className="flex flex-col items-center w-full gap-5 rounded-xl"
            >
              <HeaderBar step={2} label={"Masukan User ID"} width={"w-full"} />
              <Card className=" w-full !bg-purple-900 !border-purple-900">
                <form className="flex flex-col gap-4">
                  <div>
                    <div className="block">
                      <Label className="text-xs text-white">
                        *Isikan User ID{" "}
                        {gameDetails.name.toLowerCase() === "mobile legends" &&
                          "dan ID Zona"}{" "}
                        sesuai akun anda.
                      </Label>
                    </div>
                  </div>

                  {gameDetails.name.toLowerCase() === "mobile legends" ? (
                    <div className="grid items-center grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <input
                          id="idplayer"
                          type="number"
                          placeholder="Masukan User ID"
                          value={userId}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 9);
                            setUserId(value);
                          }}
                          required
                          className="w-full h-8 p-3 text-xs tracking-wide text-center placeholder-gray-400 bg-white rounded-lg md:h-10 focus:outline-none focus:ring-1 focus:border-purple-200"
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          id="idserverplayer"
                          type="number"
                          placeholder="Zone ID"
                          value={zoneId}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 4);
                            setZoneId(value);
                          }}
                          required
                          className="w-full h-8 p-3 text-xs tracking-wide text-center placeholder-gray-400 bg-white rounded-lg md:h-10 focus:outline-none focus:ring-1 focus:border-purple-200"
                        />
                      </div>
                    </div>
                  ) : (
                    <input
                      id="idplayer"
                      type="text"
                      placeholder="Masukan User ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      className="w-full h-8 p-3 text-xs tracking-wide text-center placeholder-gray-400 bg-white rounded-lg md:h-10 focus:outline-none focus:ring-1 focus:border-purple-200"
                    />
                  )}

                  {formError && (
                    <p className="text-xs text-red-500">
                      *
                      {gameDetails.name.toLowerCase() === "mobile legends"
                        ? "User ID dan Zone ID harus diisi."
                        : "User ID harus diisi."}
                    </p>
                  )}
                  {userIdError && (
                    <p className="text-xs text-red-500">{userIdError}</p>
                  )}
                  {zoneIdError && (
                    <p className="text-xs text-red-500">{zoneIdError}</p>
                  )}

                  {/* Menampilkan Nickname untuk Mobile Legends */}
                  {gameDetails.name.toLowerCase() === "mobile legends" && (
                    <>
                      {nicknameError ? (
                        <p className="text-xs text-red-500">{nicknameError}</p>
                      ) : (
                        nickname && (
                          <p className="text-xs text-white">
                            Nickname:{" "}
                            <span className="font-semibold">{nickname}</span>
                          </p>
                        )
                      )}
                      <p className="text-xs text-white">
                        Untuk menemukan ID Anda, klik pada ikon karakter. User
                        ID tercantum di bawah nama karakter Anda. Contoh:
                        '536326644(1234)'.
                      </p>
                    </>
                  )}
                </form>
              </Card>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center w-full gap-5 rounded-xl">
              <HeaderBar step={3} label={"Beli"} width={"w-full"} />
              <Card className="!bg-purple-900 !border-purple-900 w-full">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBuyClick();
                  }}
                >
                  <div>
                    <div className="block mb-4">
                      <Label htmlFor="inputWa" className="text-xs text-white">
                        Opsional: Jika ingin mendapatkan bukti pembayaran atas
                        pembelian anda, harap mengisi nomer whatsapp kamu.
                      </Label>
                      <p className="mt-2 text-xs text-gray-300">
                        Format nomor:{" "}
                        <span className="text-xs font-medium text-white ">
                          6281234567890
                        </span>
                      </p>
                    </div>
                    <input
                      id="inputWa"
                      type="tel"
                      placeholder="Harap Masukan Nomer Whatsapp"
                      value={waNumber}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 13);
                        setWaNumber(value);
                      }}
                      className="w-full p-3 text-xs tracking-wide text-center placeholder-gray-400 bg-white rounded-lg h-9 md:h-10 focus:outline-none focus:ring-1 focus:border-purple-200"
                    />
                  </div>

                  <div className="flex items-center gap-2 md:gap-1">
                    <Checkbox
                      id="AccWa"
                      className="!bg-purple-900 !border-1 !border-white focus:ring-2 hover:!bg-gray-600 w-6 h-4.5 md:w-4 md:h-4"
                    />
                    <p className="text-xs text-white">
                      Ya, Saya ingin menerima berita dan promosi dari Whatsapp
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="self-end cursor-pointer h-9 w-35 rounded-3xl text-md"
                    disabled={
                      nicknameError !== "" &&
                      gameDetails.name.toLowerCase() === "mobile legends"
                    }
                  >
                    Beli
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <FooterUniversal />
      <CustomerService />

      {/* Modal Detail Pesanan */}
      {openModal && !nicknameError && (
        <ModalDetailPesanan
          open={openModal}
          onClose={handleModalClose}
          data={{
            selectedTopup,
            userId,
            zoneId,
            waNumber,
          }}
          userId={userId}
          zoneId={zoneId}
          nickname={nickname}
          snapToken={snapToken}
          gameName={gameDetails.name} // ✅ TAMBAHKAN INI
        />
      )}
    </div>
  );
};

export default TopupPage;