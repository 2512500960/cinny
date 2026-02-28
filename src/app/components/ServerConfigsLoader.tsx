import { ReactNode, useCallback, useMemo } from 'react';
import { Capabilities, validateAuthMetadata, ValidatedAuthMetadata } from 'matrix-js-sdk';
import { AsyncStatus, useAsyncCallbackValue } from '../hooks/useAsyncCallback';
import { useMatrixClient } from '../hooks/useMatrixClient';
import { MediaConfig } from '../hooks/useMediaConfig';

export type ServerConfigs = {
  capabilities?: Capabilities;
  mediaConfig?: MediaConfig;
  authMetadata?: ValidatedAuthMetadata;
};

type ServerConfigsLoaderProps = {
  children: (configs: ServerConfigs) => ReactNode;
};
export function ServerConfigsLoader({ children }: ServerConfigsLoaderProps) {
  const mx = useMatrixClient();
  const fallbackConfigs = useMemo(() => ({}), []);

  const [configsState] = useAsyncCallbackValue<ServerConfigs, unknown>(
    useCallback(async () => {
      const capabilities: Capabilities | undefined = await mx
        .getCapabilities()
        .catch(() => undefined);
      const mediaConfig: MediaConfig | undefined = await mx.getMediaConfig().catch(() => undefined);
      const authMetadata = await mx.getAuthMetadata().catch(() => undefined);

      let validatedAuthMetadata: ValidatedAuthMetadata | undefined;

      try {
        if (authMetadata) {
          validatedAuthMetadata = validateAuthMetadata(authMetadata);
        }
      } catch {
        validatedAuthMetadata = undefined;
      }

      return {
        capabilities,
        mediaConfig,
        authMetadata: validatedAuthMetadata,
      };
    }, [mx])
  );

  const configs: ServerConfigs =
    configsState.status === AsyncStatus.Success ? configsState.data : fallbackConfigs;

  return children(configs);
}
