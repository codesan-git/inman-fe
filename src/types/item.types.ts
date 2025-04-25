import { UUID } from "crypto";

export type Item = {
  id: UUID;
  name: string;
  category: string;
  quantity: number;
  condition: string;
  location_id?: UUID | null;
  photo_url?: string | null;
  source: string;
  donor_id?: UUID | null;
  procurement_id?: UUID | null;
  created_at: string;
};

export type NewItem = Omit<Item, "id" | "created_at">;
export type UpdateItem = Partial<NewItem>;
