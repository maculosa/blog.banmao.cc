import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import { THEME_CONFIG } from './src/theme.config'
import robotsTxt from 'astro-robots-txt'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
// import icon from 'astro-icon'
import vue from '@astrojs/vue'

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: THEME_CONFIG.website,
    prefetch: true,
    markdown: {
        shikiConfig: {
            theme: 'one-dark-pro',
            langs: [],
            wrap: true,
        },
    },
    integrations: [UnoCSS({
        injectReset: true,
    }), robotsTxt(), sitemap(), mdx(), // icon(),
    vue(), react()],
    server: {
        headers: {
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://disqus.com https://giscus.app https://cdn.staticfile.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https://disqus.com https://giscus.app; frame-src https://disqus.com https://giscus.app",
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'accelerometer=(), autoplay=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), gamepad=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(), gamepad-extensions=(), serial=(), window-placement=(), xr=()',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        },
    },
})