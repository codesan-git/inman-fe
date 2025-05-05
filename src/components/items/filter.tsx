import { For } from "solid-js";

interface ItemsFilterProps {
  filterNama: string;
  setFilterNama: (v: string) => void;
  filterKategori: string;
  setFilterKategori: (v: string) => void;
  filterKondisi: string;
  setFilterKondisi: (v: string) => void;
  filterAsal: string;
  setFilterAsal: (v: string) => void;
  filterLokasi: string;
  setFilterLokasi: (v: string) => void;
  categories?: { id: string; name: string }[];
  conditions?: { id: string; name: string }[];
  sources?: { id: string; name: string }[];
  locations?: { id: string; name: string }[];
}

export default function ItemsFilter(props: ItemsFilterProps) {
  return (
    <div class="flex flex-wrap gap-2 mb-2">
      <input
        class="rounded border px-2 py-1 text-xs"
        placeholder="Cari nama barang..."
        value={props.filterNama}
        onInput={e => props.setFilterNama(e.currentTarget.value)}
        style="min-width: 140px;"
      />
      <select
        class="rounded border px-2 py-1 text-xs"
        value={props.filterKategori}
        onInput={e => props.setFilterKategori(e.currentTarget.value)}
      >
        <option value="">Semua Kategori</option>
        <For each={props.categories}>{cat => <option value={cat.id}>{cat.name}</option>}</For>
      </select>
      <select
        class="rounded border px-2 py-1 text-xs"
        value={props.filterKondisi}
        onInput={e => props.setFilterKondisi(e.currentTarget.value)}
      >
        <option value="">Semua Kondisi</option>
        <For each={props.conditions}>{cond => <option value={cond.id}>{cond.name}</option>}</For>
      </select>
      <select
        class="rounded border px-2 py-1 text-xs"
        value={props.filterAsal}
        onInput={e => props.setFilterAsal(e.currentTarget.value)}
      >
        <option value="">Semua Asal</option>
        <For each={props.sources}>{src => <option value={src.id}>{src.name}</option>}</For>
      </select>
      <select
        class="rounded border px-2 py-1 text-xs"
        value={props.filterLokasi}
        onInput={e => props.setFilterLokasi(e.currentTarget.value)}
      >
        <option value="">Semua Lokasi</option>
        <For each={props.locations}>{loc => <option value={loc.id}>{loc.name}</option>}</For>
      </select>
    </div>
  );
}
