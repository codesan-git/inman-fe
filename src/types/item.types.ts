import { UUID } from "crypto";

export type Item = {
  id: UUID;
  name: string;
  category_id: UUID;
  quantity: number;
  condition_id: UUID;
  location_id?: UUID | null;
  photo_url?: string | null;
  source_id: UUID;
  donor_id?: UUID | null;
  procurement_id?: UUID | null;
  created_at: string;
};

export type NewItem = Omit<Item, "id" | "created_at">;
export type UpdateItem = Partial<NewItem>;
