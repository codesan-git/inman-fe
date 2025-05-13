import { createSignal, For, Show } from "solid-js";
import { useCategories, useConditions, useSources, useLocations } from "~/hooks/useLookups";
import ImageUpload from "./image-upload";
import type { Item, NewItem } from "~/types/item.types";

type ItemFormProps = {
  initialData?: Partial<Item>;
  onSubmit: (data: NewItem) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  onCancel?: () => void;
};

export default function ItemForm(props: ItemFormProps) {
  const categoriesQuery = useCategories();
  const conditionsQuery = useConditions();
  const sourcesQuery = useSources();
  const locationsQuery = useLocations();
  
  const [formData, setFormData] = createSignal<Partial<NewItem>>(props.initialData || {
    name: "",
    category_id: undefined,
    quantity: 1,
    condition_id: undefined,
    location_id: undefined,
    photo_url: undefined,
    source_id: undefined,
    donor_id: undefined,
    procurement_id: undefined
  });
  
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData(prev => ({ 
      ...prev, 
      [target.name]: target.type === 'number' ? Number(target.value) : target.value 
    }));
  };
  
  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, photo_url: url }));
  };
  
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData() as NewItem);
  };
  
  return (
    <form class="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label class="font-semibold block mb-1">Nama Barang</label>
        <input 
          name="name" 
          class="border rounded text-sm px-3 py-2 w-full" 
          value={formData().name || ""} 
          onInput={handleChange} 
          required 
        />
      </div>
      
      <div>
        <label class="font-semibold block mb-1">Kategori</label>
        <select 
          name="category_id" 
          class="border rounded text-sm px-3 py-2 w-full" 
          value={formData().category_id || ""} 
          onInput={handleChange} 
          required
        >
          <option value="">Pilih Kategori</option>
          <For each={categoriesQuery.data}>
            {(cat: any) => (
              <option value={cat.id}>{cat.name}</option>
            )}
          </For>
        </select>
      </div>
      
      <div>
        <label class="font-semibold block mb-1">Jumlah</label>
        <input 
          name="quantity" 
          type="number" 
          min="1" 
          class="border rounded text-sm px-3 py-2 w-full" 
          value={formData().quantity || 1} 
          onInput={handleChange} 
          required 
        />
      </div>
      
      <div>
        <label class="font-semibold block mb-1">Kondisi</label>
        <select 
          name="condition_id" 
          class="border rounded text-sm px-3 py-2 w-full" 
          value={formData().condition_id || ""} 
          onInput={handleChange} 
          required
        >
          <option value="">Pilih Kondisi</option>
          <For each={conditionsQuery.data}>
            {(cond: any) => (
              <option value={cond.id}>{cond.name}</option>
            )}
          </For>
        </select>
      </div>
      
      <div>
        <label class="font-semibold block mb-1">Lokasi</label>
        <select 
          name="location_id" 
          class="border rounded text-sm px-3 py-2 w-full" 
          value={formData().location_id || ""} 
          onInput={handleChange}
        >
          <option value="">Pilih Lokasi</option>
          <For each={locationsQuery.data}>
            {(loc: any) => (
              <option value={loc.id}>{loc.name}</option>
            )}
          </For>
        </select>
      </div>
      
      {/* Komponen Upload Gambar */}
      <ImageUpload 
        initialValue={formData().photo_url || undefined} 
        onImageUploaded={handleImageUploaded} 
      />
      
      <div>
        <label class="font-semibold block mb-1">Asal</label>
        <select 
          name="source_id" 
          class="border rounded text-sm px-3 py-2 w-full" 
          value={formData().source_id || ""} 
          onInput={handleChange} 
          required
        >
          <option value="">Pilih Asal</option>
          <For each={sourcesQuery.data}>
            {(src: any) => (
              <option value={src.id}>{src.name}</option>
            )}
          </For>
        </select>
      </div>
      
      <div>
        <label class="font-semibold block mb-1">Donor ID (opsional)</label>
        <input 
          name="donor_id" 
          class="border rounded text-sm px-3 py-2 w-full" 
          value={formData().donor_id || ""} 
          onInput={handleChange} 
        />
      </div>
      
      <div>
        <label class="font-semibold block mb-1">Procurement ID (opsional)</label>
        <input 
          name="procurement_id" 
          class="border rounded text-sm px-3 py-2 w-full" 
          value={formData().procurement_id || ""} 
          onInput={handleChange} 
        />
      </div>
      
      <div class="flex justify-end gap-2 pt-2">
        <Show when={props.onCancel}>
          <button 
            type="button" 
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded" 
            onClick={props.onCancel}
          >
            Batal
          </button>
        </Show>
        <button 
          type="submit" 
          class="px-4 py-2 bg-primary text-white rounded" 
          disabled={props.isSubmitting}
        >
          {props.isSubmitting ? "Menyimpan..." : (props.submitLabel || "Simpan")}
        </button>
      </div>
    </form>
  );
}
