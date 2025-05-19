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