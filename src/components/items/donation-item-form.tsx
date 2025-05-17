import { createSignal, createEffect, For, Show } from "solid-js";
import type { NewItem } from "~/types/item.types";
import { useCategories, useConditions, useLocations, useSources } from "~/hooks/useLookups";
import type { ItemSource } from "~/types/lookup.types";
import ImageUpload from "./image-upload";
import { formatRupiah, formatRupiahInput } from "~/utils/formatters";
import { UUID } from "crypto";
import { createStore } from "solid-js/store";

type DonationItemFormProps = {
  initialData?: Partial<NewItem>;
  onSubmit: (data: NewItem) => void;
  onCancel?: () => void;
  onImageSelected?: (file: File) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export default function DonationItemForm(props: DonationItemFormProps) {
  const categoriesQuery = useCategories();
  const conditionsQuery = useConditions();
  const locationsQuery = useLocations();
  const sourcesQuery = useSources();
  
  // State untuk menyimpan ID sumber donasi
  const [donationSourceId, setDonationSourceId] = createSignal<UUID | undefined>(undefined);
  
  // Ambil ID sumber "Donasi" dari API
  createEffect(() => {
    if (sourcesQuery.data) {
      console.log("Sources data loaded:", sourcesQuery.data);
      const donationSource = sourcesQuery.data.find((source: ItemSource) => 
        source.name.toLowerCase() === "donasi");
      
      console.log("Found donation source:", donationSource);
      
      if (donationSource) {
        // Pastikan ID memiliki format UUID yang benar
        setDonationSourceId(donationSource.id as UUID);
        // Update formData dengan source_id (wajib di backend)
        setFormData(prev => ({ ...prev, source_id: donationSource.id as UUID }));
        console.log("Updated form data with source_id:", donationSource.id);
      } else {
        // Jika tidak menemukan sumber "Donasi", gunakan sumber pertama yang tersedia
        if (sourcesQuery.data.length > 0) {
          const firstSource = sourcesQuery.data[0];
          setDonationSourceId(firstSource.id as UUID);
          setFormData(prev => ({ ...prev, source_id: firstSource.id as UUID }));
          console.log("Using first available source:", firstSource.id);
        }
      }
    }
  });
  
  const [formData, setFormData] = createSignal<Partial<NewItem>>(props.initialData || {
    name: "",
    category_id: undefined,
    quantity: 1,
    condition_id: undefined,
    location_id: undefined,
    photo_url: undefined,
    source_id: undefined, // Akan diisi setelah data sumber dimuat
    donor_id: undefined, // Field ini khusus untuk donasi, akan diisi oleh user
    procurement_id: undefined, // Tidak digunakan untuk donasi
    value: "" // Nilai barang (opsional)
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
  
  const handleImageSelected = (file: File) => {
    if (props.onImageSelected) {
      props.onImageSelected(file);
    }
  };
  
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (props.isSubmitting) return;
    
    // Debug form data
    console.log("Current form data:", formData());
    console.log("Donation source ID:", donationSourceId());
    
    // Periksa apakah source_id sudah tersedia (wajib di backend)
    if (!formData().source_id && !donationSourceId()) {
      console.error("Source ID belum tersedia, menunggu data dari API");
      return;
    }
    
    // Jika source_id tidak ada di formData tapi donationSourceId ada, gunakan donationSourceId
    if (!formData().source_id && donationSourceId()) {
      setFormData(prev => ({ ...prev, source_id: donationSourceId() }));
    }
    
    // Buat salinan data form
    const finalData = {
      ...formData()
    };
    
    // Bersihkan nilai Rupiah dari karakter non-numerik sebelum dikirim ke server
    if (finalData.value) {
      finalData.value = finalData.value.toString().replace(/[^0-9]/g, '');
    }
    
    console.log('Submitting donation item with data:', finalData);
    props.onSubmit(finalData as NewItem);
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
        itemId={undefined /* Tidak ada ID untuk item baru */}
        initialValue={formData().photo_url || undefined} 
        onImageUploaded={handleImageUploaded}
        onImageSelected={handleImageSelected}
      />
      
      {/* Field khusus untuk donasi */}
      <div>
        <label class="font-semibold block mb-1">ID Donatur</label>
        <input 
          name="donor_id" 
          class="border rounded text-sm px-3 py-2 w-full" 
          value={formData().donor_id || ""} 
          onInput={handleChange} 
          placeholder="Masukkan ID donatur atau nama donatur"
        />
        <p class="text-xs text-gray-500 mt-1">ID atau nama donatur yang memberikan barang ini</p>
      </div>
      
      {/* Field nilai barang */}
      <div>
        <label class="font-semibold block mb-1">Nilai Barang (opsional)</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span class="text-gray-500">Rp</span>
          </div>
          <input 
            name="value" 
            class="border rounded text-sm px-3 py-2 w-full pl-10" 
            value={formData().value ? formatRupiah(formData().value, false) : ""} 
            onInput={(e) => {
              // Gunakan fungsi formatRupiahInput untuk memformat input dan mendapatkan nilai bersih
              const input = e.target as HTMLInputElement;
              const sanitizedValue = formatRupiahInput(input);
              
              // Update state dengan nilai yang sudah difilter (tanpa format)
              setFormData(prev => ({ ...prev, value: sanitizedValue }));
            }} 
            placeholder="1.000.000"
            type="text"
            inputmode="numeric"
          />
        </div>
        <p class="text-xs text-gray-500 mt-1">Perkiraan nilai barang dalam Rupiah</p>
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
          disabled={props.isSubmitting || (!formData().source_id && !donationSourceId())}
          onClick={() => {
            // Debug button click
            console.log("Button clicked, form data:", formData());
            console.log("Button clicked, donation source ID:", donationSourceId());
          }}
        >
          {props.isSubmitting ? "Menyimpan..." : (props.submitLabel || "Simpan")}
        </button>
      </div>
    </form>
  );
}
