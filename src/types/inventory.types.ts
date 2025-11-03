export interface InventorySlot {
    itemId: string | null; 
    quantity: number;                 
}

export interface Equipment {
    weapon_mainId: string | null;
    weapon_offId: string | null;
    helmetId: string | null;
    chestId: string | null;
    glovesId: string | null;
    legsId: string | null;
    bootsId: string | null;
    ring_1Id: string | null;
    ring_2Id: string | null;
    amuletId: string | null;
}
