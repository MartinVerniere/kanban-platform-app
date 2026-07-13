import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		setupFiles: ['./src/utils/config.ts'],
		environment: 'node',
		clearMocks: true,
		fileParallelism: false,
	},
});