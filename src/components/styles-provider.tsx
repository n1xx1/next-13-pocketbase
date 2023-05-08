"use client";

import { CacheProvider } from "@emotion/react";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useServerInsertedHTML } from "next/navigation";
import { ReactNode, useState } from "react";

export type StylesProviderProps = {
  children: ReactNode;
};

export const StylesProvider = ({ children }: StylesProviderProps) => {
  const [cache] = useState(() => {
    const cache = createEmotionCache({ key: "css" });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(" "),
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={cache}
        theme={{
          globalStyles: (theme) => ({}),
        }}
      >
        <Notifications />
        {children}
      </MantineProvider>
    </CacheProvider>
  );
};
