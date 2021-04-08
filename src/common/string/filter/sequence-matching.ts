import { html, TemplateResult } from "lit-html";
import { createMatches, FuzzyScore, fuzzyScore } from "./filter";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

/**
 * Determine whether a sequence of letters exists in another string,
 *   in that order, allowing for skipping. Ex: "chdr" exists in "chandelier")
 *
 * @param {string} filter - Sequence of letters to check for
 * @param {string} word - Word to check for sequence
 *
 * @return {number} Score representing how well the word matches the filter. Return of 0 means no match.
 */

export const fuzzySequentialMatch = (
  filter: string,
  item: ScorableTextItem
) => {
  let topScore = Number.NEGATIVE_INFINITY;
  const words = item.words;
  const decoratedWords: TemplateResult[][] = [];

  for (const word of words) {
    const scores = fuzzyScore(
      filter,
      filter.toLowerCase(),
      0,
      word,
      word.toLowerCase(),
      0,
      true
    );

    decoratedWords.push(decorateMatch(word, scores));

    if (!scores) {
      continue;
    }

    // The VS Code implementation of filter returns a:
    //    - Negative score for a good match that starts in the middle of the string
    //    - Positive score if the match starts at the beginning of the string
    //    - 0 if the filter string is just barely a match
    //    - undefined for no match
    // The "0" return is problematic since .filter() will remove that match, even though a 0 == good match.
    // So, if we encounter a 0 return, set it to 1 so the match will be included, and still respect ordering.
    const score = scores[0] === 0 ? 1 : scores[0];

    if (score > topScore) {
      topScore = score;
    }
  }

  if (topScore === Number.NEGATIVE_INFINITY) {
    return undefined;
  }

  return {
    score: topScore,
    words,
    decoratedWords,
  };
};

export interface ScorableTextItem {
  score?: number;
  words: string[];
  decoratedWords?: TemplateResult[][];
}

type FuzzyFilterSort = <T extends ScorableTextItem>(
  filter: string,
  items: T[]
) => T[];

export const fuzzyFilterSort: FuzzyFilterSort = (filter, items) => {
  return items
    .map((item) => {
      const match = fuzzySequentialMatch(filter, item);

      item.score = match?.score;
      item.decoratedWords = match?.decoratedWords;

      return item;
    })
    .filter((item) => item.score !== undefined)
    .sort(({ score: scoreA = 0 }, { score: scoreB = 0 }) =>
      scoreA > scoreB ? -1 : scoreA < scoreB ? 1 : 0
    );
};

type MatchDecorator = (word: string, scores?: FuzzyScore) => TemplateResult[];
export const decorateMatch: MatchDecorator = (word, scores) => {
  if (!scores) {
    return [html`${word}`];
  }

  const decoratedText: TemplateResult[] = [];
  const matches = createMatches(scores);
  let pos = 0;

  let actualWord = "";
  for (const match of matches) {
    actualWord += word.substring(pos, match.start);
    actualWord += `<span class="highlight-letter">${word.substring(
      match.start,
      match.end
    )}</span>`;
    pos = match.end;
  }
  actualWord += word.substring(pos);

  const fragments = actualWord.split("::");

  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i];
    decoratedText.push(html`${unsafeHTML(fragment)}`);
  }

  return decoratedText;
};
