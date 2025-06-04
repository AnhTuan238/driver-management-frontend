import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationVI from '~/locales/vi/translation.json';
import translationEN from '~/locales/en/translation.json';
import translationJA from '~/locales/ja/translation.json';

// the translations
const resources = {
    vi: {
        translation: translationVI,
    },
    en: {
        translation: translationEN,
    },
    ja: {
        translation: translationJA,
    },
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: localStorage.getItem('lang') || 'en', // Lấy ngôn ngữ từ localStorage, mặc định là 'en'
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

// Lắng nghe sự thay đổi ngôn ngữ và lưu vào localStorage
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('lang', lng);
});

export default i18n;
