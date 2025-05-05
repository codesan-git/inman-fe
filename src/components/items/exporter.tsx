import { JSX } from "solid-js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import type { Item } from "~/types/item.types";

type Lookup = { id: string; name: string };

type ExporterProps = {
  items: Item[];
  categories?: Lookup[];
  conditions?: Lookup[];
  sources?: Lookup[];
  locations?: Lookup[];
};

function getName(list: Lookup[] | undefined, id: string | null | undefined) {
  if (!id || !list) return "";
  return list.find(l => l.id === String(id))?.name || String(id);
}

export default function Exporter(props: ExporterProps): JSX.Element {
  const columns = [
    { header: "No", accessor: (_: Item, idx: number) => String(idx + 1) },
    { header: "Nama Barang", accessor: (item: Item) => item.name },
    { header: "Kategori", accessor: (item: Item) => getName(props.categories, item.category_id) },
    { header: "Kondisi", accessor: (item: Item) => getName(props.conditions, item.condition_id) },
    { header: "Jumlah", accessor: (item: Item) => String(item.quantity) },
    { header: "Asal", accessor: (item: Item) => getName(props.sources, item.source_id) },
    { header: "Lokasi", accessor: (item: Item) => getName(props.locations, item.location_id) },
  ];

  function exportCSV() {
    const header = columns.map(c => c.header).join(",");
    const rows = props.items.map((item, idx) =>
      columns.map(c => c.accessor(item, idx)).join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "items.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportExcel() {
    const header = columns.map(c => c.header);
    const data = props.items.map((item, idx) => columns.map(c => c.accessor(item, idx)));
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Items");
    XLSX.writeFile(wb, "items.xlsx");
  }

  function exportPDF() {
    const header = columns.map(c => c.header);
    const data = props.items.map((item, idx) => columns.map(c => c.accessor(item, idx)));
    const doc = new jsPDF({ orientation: "landscape" });
    let y = 10;
    doc.setFontSize(10);
    doc.text(header.join(" | "), 10, y);
    y += 8;
    data.forEach(row => {
      doc.text(row.join(" | "), 10, y);
      y += 8;
      if (y > 190) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("items.pdf");
  }

  return (
    <div class="flex items-center justify-end mb-2 gap-2">
      <button class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs sm:text-sm" onClick={exportCSV}>
        Export CSV
      </button>
      <button class="px-3 py-1 rounded bg-green-200 hover:bg-green-300 text-xs sm:text-sm" onClick={exportExcel}>
        Export Excel
      </button>
      <button class="px-3 py-1 rounded bg-red-200 hover:bg-red-300 text-xs sm:text-sm" onClick={exportPDF}>
        Export PDF
      </button>
    </div>
  );
}
