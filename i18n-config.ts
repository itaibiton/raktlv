export const i18n = {
    defaultLocale: "he",
    locales: ["he", "en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];