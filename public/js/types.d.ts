export interface Post {
  id: number;
  userid: number;
  title: string;
  body: string;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
}

export interface User {
  id: number;
  nickname: string;
  age: number;
  gender: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: CreatedAt;
}

export interface CreatedAt {
  Time: string;
  Valid: boolean;
}

export interface UpdatedAt {
  Time: string;
  Valid: boolean;
}

export type Paths = "/register" | "/posts/:id" | "/login" | "/404" | "/";

