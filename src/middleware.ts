import { defineMiddleware } from 'astro:middleware';
import { THEME_CONFIG } from '~/theme.config.ts';
import { LANGUAGES } from '~/i18n.ts';

export const onRequest = defineMiddleware(async (context, next) => {
    // Adding properties in env.d.ts
    context.locals.config = THEME_CONFIG;

    let locale = context.locals.config.locale;

    const localeTranslate = LANGUAGES[locale];

    function validateKey(key: string): key is keyof typeof localeTranslate {
        return key in localeTranslate;
    }

    context.locals.translate = (key, ...params) => {
        if (!validateKey(key)) return key;
        let result = localeTranslate[key];
        params.forEach((param, index) => {
            if (param !== undefined) {
                result = result.replace(`%${index + 1}`, param.toString());
            }
        });
        return result;
    };
    return next();
});
