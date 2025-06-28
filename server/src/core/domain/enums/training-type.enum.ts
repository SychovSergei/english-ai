/**
 * Represents the available types of training exercises in the system.
 *
 * - `FlashCard`: Shows a word or phrase on one side and the answer on the other.
 * - `MultipleChoice`: Presents a question with multiple answer options.
 * - `SentenceTranslation`: Requires the user to translate a full sentence.
 */
export enum ETrainingType {
  FlashCard = 'flashcard',
  MultipleChoice = 'multipleChoice',
  SentenceTranslation = 'sentenceTranslation',
}
