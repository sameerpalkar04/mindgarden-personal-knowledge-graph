import type { Tag } from "./tag";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  isPinned?: boolean;
  archivedAt?: string | null;
  deletedAt?: string | null;
  reminderAt?: string | null;
  dailyDate?: string | null;
  isShared?: boolean;
  tags?: Array<{ tag: Tag }>;
}
