const stats = [
  { label: "Total Barang", value: 128 },
  { label: "Stok Masuk", value: 45 },
  { label: "Stok Keluar", value: 22 },
  { label: "Kategori", value: 8 },
];

import InventoryDataTable from "~/components/inventory/data-table";
import { useMe } from "~/hooks/useMe";

const Home = () => {

  const user = useMe()

  return (
    <div class="px-2 sm:px-4 md:px-8 py-4 w-full max-w-full mx-auto">
      <h1 class="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-sidebar text-center">Dashboard Inventaris Masjid {user.data?.name}</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
        {stats.map(stat => (
          <div class="bg-white rounded-xl shadow p-3 sm:p-6 flex flex-col items-center border border-gray-100">
            <span class="text-xs sm:text-sm text-gray-500 mb-1">{stat.label}</span>
            <span class="text-xl sm:text-2xl font-semibold text-sidebar">{stat.value}</span>
          </div>
        ))}
      </div>
      <div class="bg-white rounded-xl shadow p-2 sm:p-4 md:p-6 border border-gray-100">
        <h2 class="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-sidebar">Barang Terbaru</h2>
        <InventoryDataTable />
      </div>
    </div>
  );
};

export default Home;
