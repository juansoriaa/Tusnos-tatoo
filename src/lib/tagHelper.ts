export function getPossibleUserTags(input: string): string[] {
    if (!input) return [];
    
    // Normalize input to lowercase and remove spaces
    let base = input.trim().toLowerCase().replace(/\s+/g, '');
    
    // Remove starting @ if present to get the raw base
    if (base.startsWith('@')) {
        base = base.substring(1);
    }
    
    // Create variants with underscore and hyphen
    const withUnderscore = base.replace(/-/g, '_');
    const withHyphen = base.replace(/_/g, '-');
    
    // Create a Set to ensure unique values (Firestore IN allows max 10 elements)
    const tags = new Set([
        `@${base}`,
        `@${withUnderscore}`,
        `@${withHyphen}`,
        base,
        withUnderscore,
        withHyphen
    ]);
    
    // Handle specific typos for known users to ensure robust routing
    if (base === 'daniblack' || base === 'dani_black' || base === 'dani-black') {
        tags.add('@danii_black');
        tags.add('danii_black');
    }
    if (base === 'daniiblack' || base === 'danii_black' || base === 'danii-black') {
        tags.add('@dani_black');
        tags.add('dani_black');
    }
    
    // If the original input had uppercase, maybe it was saved exactly like that in the DB before this fix
    const originalTrimmed = input.trim();
    tags.add(originalTrimmed);
    if (!originalTrimmed.startsWith('@')) {
        tags.add(`@${originalTrimmed}`);
    }
    
    return Array.from(tags).slice(0, 10);
}
