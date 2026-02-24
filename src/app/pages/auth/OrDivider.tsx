import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Line, Text } from 'folds';

export function OrDivider() {
  const { t } = useTranslation();
  return (
    <Box gap="400" alignItems="Center">
      <Line style={{ flexGrow: 1 }} direction="Horizontal" size="300" variant="Surface" />
      <Text>{t('Common.or')}</Text>
      <Line style={{ flexGrow: 1 }} direction="Horizontal" size="300" variant="Surface" />
    </Box>
  );
}
