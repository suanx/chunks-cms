export interface CommentInfo {
  id: number;
  content: string;
  userId: number;
  username?: string;
  avatar?: string;
  videoId?: number;
  movieId?: number;
  parentId: number;
  replyToUserId?: number;
  replyToUsername?: string;
  status: number;
  likeCount: number;
  replies?: CommentInfo[];
  createdAt: string;
}

export interface CreateCommentParams {
  content: string;
  videoId?: number;
  movieId?: number;
  parentId?: number;
  replyToUserId?: number;
}
