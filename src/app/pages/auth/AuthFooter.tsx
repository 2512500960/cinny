import React from 'react';
import { Box, Text } from 'folds';
import { useTranslation } from 'react-i18next';
import * as css from './styles.css';

export function AuthFooter() {
  const { t } = useTranslation();

  return (
    <Box className={css.AuthFooter} justifyContent="Center" gap="400" wrap="Wrap">
      <Text as="a" size="T300" href="https://cinny.in" target="_blank" rel="noreferrer">
        {t('Pages.AuthFooter.about')}
      </Text>
      <Text
        as="a"
        size="T300"
        href="https://github.com/ajbura/cinny/releases"
        target="_blank"
        rel="noreferrer"
      >
        {t('Pages.AuthFooter.version')}
      </Text>
      <Text as="a" size="T300" href="https://twitter.com/cinnyapp" target="_blank" rel="noreferrer">
        {t('Pages.AuthFooter.twitter')}
      </Text>
      <Text as="a" size="T300" href="https://matrix.org" target="_blank" rel="noreferrer">
        {t('Pages.AuthFooter.powered_by_matrix')}
      </Text>
    </Box>
  );
}
