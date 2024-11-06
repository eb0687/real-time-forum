export interface Post {
  id: number;
  userid: number;
  title: string;
  body: string;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
}

export interface CreatedAt {
  Time: string;
  Valid: boolean;
}

export interface UpdatedAt {
  Time: string;
  Valid: boolean;
}
