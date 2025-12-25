/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [],
        },
    },
    resolve: {
        alias: [
            { find: '@', replacement: resolve(__dirname, './src') },
            { find: /^.+\.s?css$/, replacement: resolve(__dirname, './src/tests/__mocks__/styleMock.js') },
        ],
    },
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: './src/tests/setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/tests/**', 'src/**/*.d.ts', 'tests/**'],

        },
    },
})
