export type ThemeVal = { dark: string; light: string };

export type ThemeVals = {
  'primary': ThemeVal;
  'secondary': ThemeVal;
  'accent': ThemeVal;
  'error': ThemeVal;
  'warning': ThemeVal;
  'success': ThemeVal;
  'info': ThemeVal;
  'text': ThemeVal;
  'textMuted': ThemeVal;
  'background': ThemeVal;
  'backgroundPanel': ThemeVal;
  'backgroundElement': ThemeVal;
  'border': ThemeVal;
  'borderActive': ThemeVal;
  'borderSubtle': ThemeVal;
  'diffAdded': ThemeVal;
  'diffRemoved': ThemeVal;
  'diffContext': ThemeVal;
  'diffHunkHeader': ThemeVal;
  'diffHighlightAdded': ThemeVal;
  'diffHighlightRemoved': ThemeVal;
  'diffAddedBg': ThemeVal;
  'diffRemovedBg': ThemeVal;
  'diffContextBg': ThemeVal;
  'diffLineNumber': ThemeVal;
  'diffAddedLineNumberBg': ThemeVal;
  'diffRemovedLineNumberBg': ThemeVal;
  'markdownText': ThemeVal;
  'markdownHeading': ThemeVal;
  'markdownLink': ThemeVal;
  'markdownLinkText': ThemeVal;
  'markdownCode': ThemeVal;
  'markdownBlockQuote': ThemeVal;
  'markdownEmph': ThemeVal;
  'markdownStrong': ThemeVal;
  'markdownHorizontalRule': ThemeVal;
  'markdownListItem': ThemeVal;
  'markdownListEnumeration': ThemeVal;
  'markdownImage': ThemeVal;
  'markdownImageText': ThemeVal;
  'markdownCodeBlock': ThemeVal;
  'syntaxComment': ThemeVal;
  'syntaxKeyword': ThemeVal;
  'syntaxFunction': ThemeVal;
  'syntaxVariable': ThemeVal;
  'syntaxString': ThemeVal;
  'syntaxNumber': ThemeVal;
  'syntaxType': ThemeVal;
  'syntaxOperator': ThemeVal;
  'syntaxPunctuation': ThemeVal;
};

export type Theme = {
  '$schema': string;
  'theme': ThemeVals;
  'defs': { [key: string]: string };
};

export const getThemeColor =
  (theme: Theme) =>
  (key: keyof Theme['theme']): string => {
    const def = theme.theme[key].dark;

    const isColor = def.startsWith('#');
    return isColor ? def : (theme.defs[def as keyof Theme['defs']] as string);
  };
