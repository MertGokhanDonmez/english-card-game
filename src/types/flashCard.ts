export interface FlashCardType {
    id: string;
    frontImage: string;
    backText: string;
    createdAt: Date;
    tags?: string[];
  }