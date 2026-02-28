import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageEvent, StateEvent } from '../../../../types/matrix/room';
import { PermissionGroup } from '../../common-settings/permissions';

export const usePermissionGroups = (): PermissionGroup[] => {
  const { t } = useTranslation();

  const groups: PermissionGroup[] = useMemo(() => {
    const messagesGroup: PermissionGroup = {
      name: t('Pages.RoomSettings.Permissions.Groups.messages'),
      items: [
        {
          location: {
            key: MessageEvent.RoomMessage,
          },
          name: t('Pages.RoomSettings.Permissions.Items.send_messages'),
        },
        {
          location: {
            key: MessageEvent.Sticker,
          },
          name: t('Pages.RoomSettings.Permissions.Items.send_stickers'),
        },
        {
          location: {
            key: MessageEvent.Reaction,
          },
          name: t('Pages.RoomSettings.Permissions.Items.send_reactions'),
        },
        {
          location: {
            notification: true,
            key: 'room',
          },
          name: t('Pages.RoomSettings.Permissions.Items.ping_room'),
        },
        {
          location: {
            state: true,
            key: StateEvent.RoomPinnedEvents,
          },
          name: t('Pages.RoomSettings.Permissions.Items.pin_messages'),
        },
        {
          location: {},
          name: t('Pages.RoomSettings.Permissions.Items.other_message_events'),
        },
      ],
    };

    const moderationGroup: PermissionGroup = {
      name: t('Pages.RoomSettings.Permissions.Groups.moderation'),
      items: [
        {
          location: {
            action: true,
            key: 'invite',
          },
          name: t('Pages.RoomSettings.Permissions.Items.invite'),
        },
        {
          location: {
            action: true,
            key: 'kick',
          },
          name: t('Pages.RoomSettings.Permissions.Items.kick'),
        },
        {
          location: {
            action: true,
            key: 'ban',
          },
          name: t('Pages.RoomSettings.Permissions.Items.ban'),
        },
        {
          location: {
            action: true,
            key: 'redact',
          },
          name: t('Pages.RoomSettings.Permissions.Items.delete_others_messages'),
        },
        {
          location: {
            key: MessageEvent.RoomRedaction,
          },
          name: t('Pages.RoomSettings.Permissions.Items.delete_self_messages'),
        },
      ],
    };

    const roomOverviewGroup: PermissionGroup = {
      name: t('Pages.RoomSettings.Permissions.Groups.room_overview'),
      items: [
        {
          location: {
            state: true,
            key: StateEvent.RoomAvatar,
          },
          name: t('Pages.RoomSettings.Permissions.Items.room_avatar'),
        },
        {
          location: {
            state: true,
            key: StateEvent.RoomName,
          },
          name: t('Pages.RoomSettings.Permissions.Items.room_name'),
        },
        {
          location: {
            state: true,
            key: StateEvent.RoomTopic,
          },
          name: t('Pages.RoomSettings.Permissions.Items.room_topic'),
        },
      ],
    };

    const roomSettingsGroup: PermissionGroup = {
      name: t('Pages.RoomSettings.Permissions.Groups.settings'),
      items: [
        {
          location: {
            state: true,
            key: StateEvent.RoomJoinRules,
          },
          name: t('Pages.RoomSettings.Permissions.Items.change_room_access'),
        },
        {
          location: {
            state: true,
            key: StateEvent.RoomCanonicalAlias,
          },
          name: t('Pages.RoomSettings.Permissions.Items.publish_address'),
        },
        {
          location: {
            state: true,
            key: StateEvent.RoomPowerLevels,
          },
          name: t('Pages.RoomSettings.Permissions.Items.change_all_permission'),
        },
        {
          location: {
            state: true,
            key: StateEvent.PowerLevelTags,
          },
          name: t('Pages.RoomSettings.Permissions.Items.edit_power_levels'),
        },
        {
          location: {
            state: true,
            key: StateEvent.RoomEncryption,
          },
          name: t('Pages.RoomSettings.Permissions.Items.enable_encryption'),
        },
        {
          location: {
            state: true,
            key: StateEvent.RoomHistoryVisibility,
          },
          name: t('Pages.RoomSettings.Permissions.Items.history_visibility'),
        },
        {
          location: {
            state: true,
            key: StateEvent.RoomTombstone,
          },
          name: t('Pages.RoomSettings.Permissions.Items.upgrade_room'),
        },
        {
          location: {
            state: true,
          },
          name: t('Pages.RoomSettings.Permissions.Items.other_settings'),
        },
      ],
    };

    const otherSettingsGroup: PermissionGroup = {
      name: t('Pages.RoomSettings.Permissions.Groups.other'),
      items: [
        {
          location: {
            state: true,
            key: StateEvent.PoniesRoomEmotes,
          },
          name: t('Pages.RoomSettings.Permissions.Items.manage_emojis_stickers'),
        },
        {
          location: {
            state: true,
            key: StateEvent.RoomServerAcl,
          },
          name: t('Pages.RoomSettings.Permissions.Items.change_server_acls'),
        },
        {
          location: {
            state: true,
            key: 'im.vector.modular.widgets',
          },
          name: t('Pages.RoomSettings.Permissions.Items.modify_widgets'),
        },
      ],
    };

    return [
      messagesGroup,
      moderationGroup,
      roomOverviewGroup,
      roomSettingsGroup,
      otherSettingsGroup,
    ];
  }, [t]);

  return groups;
};
