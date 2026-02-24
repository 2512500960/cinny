import React from 'react';
import { Box, Text, as } from 'folds';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { MatrixClient, MatrixEvent, Room } from 'matrix-js-sdk';
import * as css from './Reaction.css';
import { getHexcodeForEmoji, getShortcodeFor } from '../../plugins/emoji';
import { getMemberDisplayName } from '../../utils/room';
import { eventWithShortcode, getMxIdLocalPart, mxcUrlToHttp } from '../../utils/matrix';

export const Reaction = as<
  'button',
  {
    mx: MatrixClient;
    count: number;
    reaction: string;
    useAuthentication?: boolean;
  }
>(({ className, mx, count, reaction, useAuthentication, ...props }, ref) => (
  <Box
    as="button"
    className={classNames(css.Reaction, className)}
    alignItems="Center"
    shrink="No"
    gap="200"
    {...props}
    ref={ref}
  >
    <Text className={css.ReactionText} as="span" size="T400">
      {reaction.startsWith('mxc://') ? (
        <img
          className={css.ReactionImg}
          src={mxcUrlToHttp(mx, reaction, useAuthentication) ?? reaction}
          alt={reaction}
        />
      ) : (
        <Text as="span" size="Inherit" truncate>
          {reaction}
        </Text>
      )}
    </Text>
    <Text as="span" size="T300">
      {count}
    </Text>
  </Box>
));

type ReactionTooltipMsgProps = {
  room: Room;
  reaction: string;
  events: MatrixEvent[];
};

export function ReactionTooltipMsg({ room, reaction, events }: ReactionTooltipMsgProps) {
  const { t } = useTranslation();
  const shortCodeEvt = events.find(eventWithShortcode);
  const shortcode =
    shortCodeEvt?.getContent().shortcode ??
    getShortcodeFor(getHexcodeForEmoji(reaction)) ??
    reaction;
  const names = events.map(
    (ev: MatrixEvent) =>
      getMemberDisplayName(room, ev.getSender() ?? 'Unknown') ??
      getMxIdLocalPart(ev.getSender() ?? 'Unknown') ??
      'Unknown'
  );

  return (
    <>
      {names.length === 1 && (
        <>{t('Pages.Reaction.reacted_single', { name: names[0], shortcode })}</>
      )}
      {names.length === 2 && (
        <>{t('Pages.Reaction.reacted_two', { name0: names[0], name1: names[1], shortcode })}</>
      )}
      {names.length === 3 && (
        <>
          {t('Pages.Reaction.reacted_three', {
            name0: names[0],
            name1: names[1],
            name2: names[2],
            shortcode,
          })}
        </>
      )}
      {names.length > 3 && (
        <>
          {t('Pages.Reaction.reacted_many', {
            name0: names[0],
            name1: names[1],
            name2: names[2],
            others: names.length - 3,
            shortcode,
          })}
        </>
      )}
    </>
  );
}
