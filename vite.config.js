import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/sass/main.scss',
                'resources/sass/frieza-customs/themes/xeco.scss',
                'resources/sass/frieza-customs/themes/xinspire.scss',
                'resources/sass/frieza-customs/themes/xmodern.scss',
                'resources/sass/frieza-customs/themes/xsmooth.scss',
                'resources/sass/frieza-customs/themes/xwork.scss',
                'resources/sass/frieza-customs/themes/xdream.scss',
                'resources/sass/frieza-customs/themes/xpro.scss',
                'resources/sass/frieza-customs/themes/xplay.scss',
                'resources/js/frieza-modules/app.js',
                'resources/js/app.js',
                'resources/js/pages/datatables.js',
                'resources/js/pages/slick.js',
            ],
            refresh: true,
        }),
    ],
});
