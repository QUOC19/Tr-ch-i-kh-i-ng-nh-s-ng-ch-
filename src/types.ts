export type GameScreen =
  | 'intro'         // Màn hình 1 - Mở đầu
  | 'stage1'        // Chặng 1 - Ghép đúng thật nhanh
  | 'stage2'        // Chặng 2 - Dòng thời gian bí mật
  | 'stage3'        // Chặng 3 - Ai là ai? (Quiz 3 câu)
  | 'result'        // Màn hình Kết quả
  | 'summary'       // Màn hình Ghi nhớ
  | 'end';          // Màn hình Kết thúc

export interface InventorItem {
  id: string;
  name: string;
  originalName: string;
  years: string;
  country: string;
  profession: string;
  inventionId: string;
  inventionName: string;
  patentYear: number;
  image: string;
  inventionImage: string;
  color: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  funFact: string;
}

export interface InventionItem {
  id: string;
  name: string;
  inventorId: string;
  patentYear: number;
  image: string;
  description: string;
}

export interface TimelineSlot {
  year: number;
  colorName: string;
  accentColor: string;
  badgeClass: string;
  lineColor: string;
  correctInventionId: string;
  title: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface GameStats {
  startTime: number;
  endTime: number | null;
  retryCount: number;
}
