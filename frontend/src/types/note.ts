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
}
