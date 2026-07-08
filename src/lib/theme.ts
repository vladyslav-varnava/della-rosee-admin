import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        della: {
          primary: { value: '#d6b7b7' },
          primaryHover: { value: '#c89e9e' },
          text: { value: '#2d2d2d' },
          accent: { value: '#2f4858' },
          background: { value: '#ffffff' },
          backgroundSecondary: { value: '#F7F7F7' },
          sidebar: { value: '#2d2d2d' },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
