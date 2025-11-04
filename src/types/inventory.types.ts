export interface InventorySlot {
    itemId: string | null; 
    quantity: number;                 
}

export interface Equipment {
    weapon_main: string | null;
    weapon_off: string | null;
    helmet: string | null;
    chest: string | null;
    gloves: string | null;
    legs: string | null;
    boots: string | null;
    ring_1: string | null;
    ring_2: string | null;
    amulet: string | null;
}
