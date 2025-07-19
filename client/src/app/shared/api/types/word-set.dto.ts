// TODO надо ли????
export interface WordSetIncomingDto {
  id: string;
  title: string;
  description: string;
  words: {
    id: string;
    term: string;
    definition: string;
  }[];
}

export interface WordSetOutgoingDto {
  title: string;
  description: string;
  words: {
    term: string;
    definition: string;
  }[];
}
