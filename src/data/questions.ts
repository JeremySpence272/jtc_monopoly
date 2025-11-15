import questionsData from './questions.json';
import { Question } from '../types';

export const QUESTIONS = questionsData as Question[];

export function getQuestionByPropertyId(propertyId: string): Question | undefined {
  // Handle special cases for railroads and utilities
  const railroadMap: Record<string, string> = {
    "reading_railroad": "reading_railroad_q1",
    "pennsylvania_railroad": "pennsylvania_railroad_q1",
    "bo_railroad": "bo_railroad_q1",
    "b._&_o._railroad": "bo_railroad_q1",
    "short_line": "short_line_q1",
  };
  
  const utilityMap: Record<string, string> = {
    "electric_company": "electric_company_q1",
    "water_works": "water_works_q1",
  };
  
  // Handle special cases for multi-word properties
  const specialMap: Record<string, string> = {
    "park_place": "park_place_q1",
    "boardwalk": "boardwalk_q1",
    "new_york_avenue": "new_york_q1",
    "marvin_gardens": "marvin_gardens_q1",
    "north_carolina_avenue": "north_carolina_q1",
  };
  
  // Check railroad map
  const normalizedId = propertyId.toLowerCase().replace(/\s+/g, '_');
  if (railroadMap[normalizedId]) {
    return QUESTIONS.find(q => q.question_id === railroadMap[normalizedId]);
  }
  
  // Check utility map
  if (utilityMap[normalizedId]) {
    return QUESTIONS.find(q => q.question_id === utilityMap[normalizedId]);
  }
  
  // Check special map for multi-word properties
  if (specialMap[normalizedId]) {
    return QUESTIONS.find(q => q.question_id === specialMap[normalizedId]);
  }
  
  // Convert property_id like "mediterranean_avenue" to question_id like "mediterranean_q1"
  // For properties with "St." in the name, use first two parts: "st_charles_place" -> "st_charles_q1"
  // For properties like "new_york_avenue", use first two parts: "new_york_avenue" -> "new_york_q1"
  const parts = propertyId.split('_');
  if (parts.length >= 2) {
    let questionId: string;
    // Check if it starts with "st" (St. Charles, St. James, etc.)
    if (parts[0] === 'st' && parts.length >= 3) {
      questionId = `${parts[0]}_${parts[1]}_q1`;
    } else if (parts.length >= 3 && parts[0] === 'new' && parts[1] === 'york') {
      // Handle "new_york_avenue" -> "new_york_q1"
      questionId = `${parts[0]}_${parts[1]}_q1`;
    } else {
      questionId = `${parts[0]}_q1`;
    }
    return QUESTIONS.find(q => q.question_id === questionId);
  }
  return undefined;
}

export function getQuestionById(questionId: string): Question | undefined {
  return QUESTIONS.find(q => q.question_id === questionId);
}

export function getQuestionsByCategory(categoryId: string): Question[] {
  return QUESTIONS.filter(q => q.question_category === categoryId);
}

