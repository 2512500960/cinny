import React from 'react';
import { useTranslation } from 'react-i18next';
import { TooltipProvider, Tooltip, Box, Text, Badge, toRem } from 'folds';

export function BetaNoticeBadge() {
  const { t } = useTranslation();

  return (
    <TooltipProvider
      position="Right"
      align="Center"
      tooltip={
        <Tooltip style={{ maxWidth: toRem(200) }}>
          <Box direction="Column">
            <Text size="L400">{t('Pages.BetaNotice.notice')}</Text>
            <Text size="T200">{t('Pages.BetaNotice.description')}</Text>
          </Box>
        </Tooltip>
      }
    >
      {(triggerRef) => (
        <Badge size="500" tabIndex={0} ref={triggerRef} variant="Primary" fill="Solid">
          <Text size="L400">{t('Pages.BetaNotice.beta')}</Text>
        </Badge>
      )}
    </TooltipProvider>
  );
}
