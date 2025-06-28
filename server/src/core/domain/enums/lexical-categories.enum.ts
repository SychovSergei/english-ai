/**
 * Represents the lexical category (part of speech) of a word.
 *
 * - `Noun (n.)` — A word that represents a person, place, thing, or idea.
 * - `Verb (v.)` — A word that represents an action or state.
 * - `Adjective (adj.)` — A word that describes a noun.
 * - `Adverb (adv.)` — A word that modifies a verb, adjective, or other adverb.
 * - `Pronoun (pron.)` — A word that replaces a noun.
 * - `Preposition (prep.)` — A word that shows the relationship between a noun and another word.
 * - `Conjunction (conj.)` — A word that connects words, phrases, or clauses.
 * - `Determiner (det.)` — A word that introduces a noun (e.g., articles, demonstratives).
 * - `Interjection (int.)` — A short exclamation or expression of emotion.
 * - `Article (art.)` — A word used to define a noun as specific or unspecific.
 * - `Phrase` — A group of words that act as a single part of speech.
 * - `Idiom` — A phrase or expression with a figurative meaning.
 * - `Empty` — Not specified.
 */
export enum ELexicalCategory {
  Empty = '',
  Noun = 'noun', // существительное
  Verb = 'verb', // глагол
  Adjective = 'adjective', // прилагательное
  Adverb = 'adverb', // наречие
  Pronoun = 'pronoun', // местоимение
  Preposition = 'preposition', // предлог
  Conjunction = 'conjunction', // союз
  Determiner = 'determiner', // детерминатив
  Interjection = 'interjection', // междометие
  Article = 'article', // артикль
  PhrasalVerb = 'phrasal_verb', // фразовый глагол
  Idiom = 'idiom', // идиома
}

/**
 * A mapping of lexical categories to their standard abbreviations.
 */
export const lexicalAbbr = {
  Empty: '',
  Noun: 'n.', // существительное
  Verb: 'v.', // глагол
  Adjective: 'adj.', // прилагательное
  Adverb: 'adv.', // наречие
  Pronoun: 'pron.', // местоимение
  Preposition: 'prep.', // предлог
  Conjunction: 'conj.', // союз
  Determiner: 'det.', // детерминатив
  Interjection: 'int.', // междометие
  Article: 'art.', // артикль
};

/*
Noun (n.) — существительное
Verb (v.) — глагол
Adjective (adj.) — прилагательное
Adverb (adv.) — наречие
Pronoun (pron.) — местоимение
Preposition (prep.) — предлог
Conjunction (conj.) — союз
Determiner (det.) — детерминатив
Interjection (int.) — междометие
Article (art.) — артикль
*/
