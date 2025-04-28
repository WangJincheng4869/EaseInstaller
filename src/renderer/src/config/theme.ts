import { useColorMode, type BasicColorMode } from '@vueuse/core';

// 启用主题色切换
const colorMode = useColorMode<BasicColorMode>({
  storageKey: 'ease-installer-color-scheme'
});

export { colorMode };
