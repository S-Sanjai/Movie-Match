
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    base: '/Movie-Match/',  // Base path for GitHub Pages
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            'vaul@1.1.2': 'vaul',
            'sonner@2.0.3': 'sonner',
            'recharts@2.15.2': 'recharts',
            'react-resizable-panels@2.1.7': 'react-resizable-panels',
            'react-hook-form@7.55.0': 'react-hook-form',
            'react-day-picker@8.10.1': 'react-day-picker',
            'next-themes@0.4.6': 'next-themes',
            'lucide-react@0.487.0': 'lucide-react',
            'input-otp@1.4.2': 'input-otp',
            'figma:asset/edf23c46d51ca6c39850542c3367b7547ee6a445.png': path.resolve(__dirname, './src/assets/edf23c46d51ca6c39850542c3367b7547ee6a445.png'),
            'figma:asset/5db2cfd5931b8c72176762b725f7168fb4a80ec9.png': path.resolve(__dirname, './src/assets/5db2cfd5931b8c72176762b725f7168fb4a80ec9.png'),
            'figma:asset/574f3d239d45ae10edce889cee34404ccca7b40d.png': path.resolve(__dirname, './src/assets/574f3d239d45ae10edce889cee34404ccca7b40d.png'),
            'figma:asset/3954b3c8d979c175f089e3da540438343104e5ce.png': path.resolve(__dirname, './src/assets/3954b3c8d979c175f089e3da540438343104e5ce.png'),
            'figma:asset/3427ca78fdb9ea04a72891f4dc2bc29b0c44dca8.png': path.resolve(__dirname, './src/assets/3427ca78fdb9ea04a72891f4dc2bc29b0c44dca8.png'),
            'figma:asset/297749e8de4c3954621324f82dc140cad73d4b00.png': path.resolve(__dirname, './src/assets/297749e8de4c3954621324f82dc140cad73d4b00.png'),
            'embla-carousel-react@8.6.0': 'embla-carousel-react',
            'cmdk@1.1.1': 'cmdk',
            'class-variance-authority@0.7.1': 'class-variance-authority',
            '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
            '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
            '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
            '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
            '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
            '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
            '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
            '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
            '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
            '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
            '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
            '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
            '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
            '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
            '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
            '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
            '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
            '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
            '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
            '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
            '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
            '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
            '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            '/search': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            }
        },
    },
});