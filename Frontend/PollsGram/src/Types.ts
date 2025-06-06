export type Poll = {
  id: number;
  question: string;
  options: Option[];
}

export type Option = {
  id: number;
  optionText: string;
  votesCount: number;
  pollId: number;
}

export type JwtPayload = {
  id: number;
  email: string;
  iat: number; // issued at time
  exp: number; // expiration time
}