export interface FlashCardType {
    id: string;
    frontImage: string; // URI formatında
    backText: string;
    createdAt: Date;
    tags?: string[]; // Opsiyonel kategori etiketleri
  }