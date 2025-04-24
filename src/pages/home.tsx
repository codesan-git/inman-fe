const stats = [
  { label: "Total Barang", value: 128 },
  { label: "Stok Masuk", value: 45 },
  { label: "Stok Keluar", value: 22 },
  { label: "Kategori", value: 8 },
];

import InventoryDataTable from "~/components/inventory/data-table";

const Home = () => {
  return (
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6 text-sidebar">Dashboard Inventaris Masjid</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
          <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-gray-100">
            <span class="text-sm text-gray-500 mb-1">{stat.label}</span>
            <span class="text-2xl font-semibold text-sidebar">{stat.value}</span>
          </div>
        ))}
      </div>
      <div class="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h2 class="text-lg font-semibold mb-4 text-sidebar">Barang Terbaru</h2>
        <InventoryDataTable />
      </div>
    </div>
  );
};

export default Home;
