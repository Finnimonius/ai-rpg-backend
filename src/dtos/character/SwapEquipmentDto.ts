import { Equipment } from "../../types/inventory.types";

export interface SwapEquipmentDto {
  fromSlot: keyof Equipment;
  toSlot: keyof Equipment;
}