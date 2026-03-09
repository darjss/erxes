import { useMutation } from '@apollo/client';
import {
  UPDATE_DISCORD_SETTINGS,
  ADD_DISCORD_GUILD,
} from '../graphql/mutations';

export const useDiscordSettings = () => {
  const [updateDiscord, { loading: updatingDiscord }] = useMutation(
    UPDATE_DISCORD_SETTINGS,
  );
  const [addGuild, { loading: addingGuild }] = useMutation(ADD_DISCORD_GUILD);

  const updateDiscordSettings = async (
    botToken: string,
    dmPolicy?: 'pairing' | 'open',
    callbacks?: {
      onCompleted?: () => void;
      onError?: (error: Error) => void;
    },
  ) => {
    await updateDiscord({
      variables: { input: { botToken, dmPolicy } },
      onCompleted: callbacks?.onCompleted,
      onError: callbacks?.onError,
    });
  };

  const addDiscordGuild = async (
    guildId: string,
    callbacks?: {
      onCompleted?: () => void;
      onError?: (error: Error) => void;
    },
  ) => {
    await addGuild({
      variables: { input: { guildId } },
      onCompleted: callbacks?.onCompleted,
      onError: callbacks?.onError,
    });
  };

  return {
    updateDiscordSettings,
    updatingDiscord,
    addDiscordGuild,
    addingGuild,
  };
};
