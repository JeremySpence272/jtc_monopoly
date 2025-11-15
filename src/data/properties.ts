import propertiesData from './properties.json';
import { Property } from '../types';

export const PROPERTIES = propertiesData as Property[];

// Convert property_id (like "mediterranean_avenue") to property_name (like "Mediterranean Avenue")
function propertyIdToName(propertyId: string): string {
  const parts = propertyId.split('_');
  // Handle "St." properties specially: "st_charles_place" -> "St. Charles Place"
  if (parts[0] === 'st' && parts.length >= 3) {
    const rest = parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return `St. ${rest}`;
  }
  // Regular conversion
  return parts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getPropertyById(propertyId: string): Property | undefined {
  // property_id is like "mediterranean_avenue", need to find by property_name
  const propertyName = propertyIdToName(propertyId);
  return PROPERTIES.find(prop => prop.property_name === propertyName);
}

export function getPropertyByName(propertyName: string): Property | undefined {
  return PROPERTIES.find(prop => prop.property_name === propertyName);
}

export function getPropertyByPosition(boardPosition: number): Property | undefined {
  return PROPERTIES.find(prop => prop.board_position === boardPosition);
}

