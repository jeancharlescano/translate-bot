export const validateSourceLanguage = (lang) => {
    const validLanguages = ["AR", "BG", "CS", "DA", "DE", "EL", "EN", "ES", "ET", "FI", "FR", "HE", "HU", "ID", "IT", "JA", "KO", "LT", "LV", "NB", "NL", "PL", "PT", "RO", "RU", "SK", "SL", "SV", "TH", "TR", "UK", "VI", "ZH"]
    return validLanguages.includes(lang.toUpperCase())
}

export const validateTargetLanguage = (lang) => {
    const validLanguages = ["AR", "BG", "CS", "DA", "DE", "EL", "EN", "EN-GB", "EN-US", "ES", "ES-419", "ET", "FI", "FR", "HE", "HU", "ID", "IT", "JA", "KO", "LT", "LV", "NB", "NL", "PL", "PT", "PT-BR", "PT-PT", "RO", "RU", "SK", "SL", "SV", "TH", "TR", "UK", "VI", "ZH", "ZH-HANS", "ZH-HANT"]
    return validLanguages.includes(lang.toUpperCase())
}