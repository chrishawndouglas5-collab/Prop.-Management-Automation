/**
 * Normalizes property names for fuzzy matching
 * Example: "Sunset Blvd." → "sunset"
 */
export function normalizePropertyName(name: string): string {
    if (!name) return ''

    return name
        .toLowerCase()
        .trim()
        // Remove common street abbreviations
        .replace(/\b(street|st|avenue|ave|boulevard|blvd|road|rd|drive|dr|lane|ln|court|ct|place|pl)\b\.?/gi, '')
        // Remove apartment/unit numbers
        .replace(/\b(apt|apartment|unit|#)\s*\w+/gi, '')
        // Remove all special characters and spaces
        .replace(/[^a-z0-9]/g, '')
}

/**
 * Calculates similarity between two strings (0-1, 1 = identical)
 */
export function stringSimilarity(str1: string, str2: string): number {
    const s1 = normalizePropertyName(str1)
    const s2 = normalizePropertyName(str2)

    if (s1 === s2) return 1
    if (s1.length === 0 || s2.length === 0) return 0

    // Simple substring matching for now
    if (s1.includes(s2) || s2.includes(s1)) return 0.8

    // Check if first 5 characters match
    if (s1.substring(0, 5) === s2.substring(0, 5)) return 0.6

    return 0
}

/**
 * Find best matching property from a list
 */
export function findBestMatch(
    csvPropertyName: string,
    existingProperties: Array<{ id: string; property_name: string }>
): { match: any; confidence: number } | null {
    let bestMatch = null
    let highestConfidence = 0

    for (const property of existingProperties) {
        const confidence = stringSimilarity(csvPropertyName, property.property_name)

        if (confidence > highestConfidence) {
            highestConfidence = confidence
            bestMatch = property
        }
    }

    // Only return match if confidence is high enough
    if (highestConfidence >= 0.8) {
        return { match: bestMatch, confidence: highestConfidence }
    }

    return null
}
