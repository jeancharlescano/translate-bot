// Langues supportées par DeepL (codes ISO)
const DEEPL_LANGUAGES = ["AR", "BG", "CS", "DA", "DE", "EL", "EN", "ES", "ET", "FI", "FR", "HE", "HU", "ID", "IT", "JA", "KO", "LT", "LV", "NB", "NL", "PL", "PT", "RO", "RU", "SK", "SL", "SV", "TH", "TR", "UK", "VI", "ZH"];

// Langues supportées par le Custom Service (noms en anglais)
const CUSTOM_SERVICE_LANGUAGES = ["arabic", "bulgarian", "czech", "danish", "german", "greek", "english", "spanish", "estonian", "finnish", "french", "hebrew", "hungarian", "indonesian", "italian", "japanese", "korean", "lithuanian", "latvian", "norwegian", "dutch", "polish", "portuguese", "romanian", "russian", "slovak", "slovenian", "swedish", "thai", "turkish", "ukrainian", "vietnamese", "chinese"];

export const validateSourceLanguage = (lang) => {
    // Vérifier si c'est un code DeepL (majuscules)
    if (DEEPL_LANGUAGES.includes(lang.toUpperCase())) {
        return true;
    }
    // Vérifier si c'est une langue Custom Service (minuscules)
    if (CUSTOM_SERVICE_LANGUAGES.includes(lang.toLowerCase())) {
        return true;
    }
    return false;
}

export const validateTargetLanguage = (lang) => {
    // Langues cibles DeepL (inclut les variantes)
    const deeplTargetLanguages = ["AR", "BG", "CS", "DA", "DE", "EL", "EN", "EN-GB", "EN-US", "ES", "ES-419", "ET", "FI", "FR", "HE", "HU", "ID", "IT", "JA", "KO", "LT", "LV", "NB", "NL", "PL", "PT", "PT-BR", "PT-PT", "RO", "RU", "SK", "SL", "SV", "TH", "TR", "UK", "VI", "ZH", "ZH-HANS", "ZH-HANT"];
    
    // Vérifier si c'est un code DeepL (majuscules)
    if (deeplTargetLanguages.includes(lang.toUpperCase())) {
        return true;
    }
    // Vérifier si c'est une langue Custom Service (minuscules)
    if (CUSTOM_SERVICE_LANGUAGES.includes(lang.toLowerCase())) {
        return true;
    }
    return false;
}

// Fonction pour obtenir la liste des langues supportées pour l'aide
export const getSupportedLanguages = () => {
    return {
        deepl: DEEPL_LANGUAGES,
        customService: CUSTOM_SERVICE_LANGUAGES
    };
}