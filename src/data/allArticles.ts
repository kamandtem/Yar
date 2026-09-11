import { Article } from '../types';
import { ARTICLES_PART_1 } from './articlesPart1';
import { ARTICLES_PART_2 } from './articlesPart2';
import { ARTICLES_PART_3 } from './articlesPart3';
import { ARTICLES_PART_4 } from './articlesPart4';
import { ARTICLES_PART_5 } from './articlesPart5';

export const ALL_50_ARTICLES: Article[] = [
  ...ARTICLES_PART_1,
  ...ARTICLES_PART_2,
  ...ARTICLES_PART_3,
  ...ARTICLES_PART_4,
  ...ARTICLES_PART_5
];
