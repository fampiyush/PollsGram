export type Poll = {
  id: number | null;
  question: string;
  creator_id?: number | null;
  options: Option[];
  voted: boolean;
  votedOptionId: number | null;
}

export type Option = {
  id: number | null;
  optionText: string;
  votesCount: number;
  pollId: number | null;
}

export type JwtPayload = {
  id: number;
  email: string;
  iat: number; // issued at time
  exp: number; // expiration time
}