import { Timestamp } from '../lib/firebase';

interface IPost {
  username: string;
  slug: string;
  title: string;
  heartCount: number;
  published: boolean;
  content: string;
  createdAt: Timestamp;
}

export type { IPost };
