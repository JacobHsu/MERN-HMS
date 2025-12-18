import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
// Common translations
import commonZhTW from './locales/zh-TW/common.json';
import commonEn from './locales/en/common.json';

// Navigation translations
import navigationZhTW from './locales/zh-TW/navigation.json';
import navigationEn from './locales/en/navigation.json';

// Home translations
import homeZhTW from './locales/zh-TW/home.json';
import homeEn from './locales/en/home.json';

// Auth translations
import authZhTW from './locales/zh-TW/auth.json';
import authEn from './locales/en/auth.json';

// Doctors translations
import doctorsZhTW from './locales/zh-TW/doctors.json';
import doctorsEn from './locales/en/doctors.json';

// Appointments translations
import appointmentsZhTW from './locales/zh-TW/appointments.json';
import appointmentsEn from './locales/en/appointments.json';

// Profile translations
import profileZhTW from './locales/zh-TW/profile.json';
import profileEn from './locales/en/profile.json';

// Messages translations
import messagesZhTW from './locales/zh-TW/messages.json';
import messagesEn from './locales/en/messages.json';

const resources = {
  'zh-TW': {
    common: commonZhTW,
    navigation: navigationZhTW,
    home: homeZhTW,
    auth: authZhTW,
    doctors: doctorsZhTW,
    appointments: appointmentsZhTW,
    profile: profileZhTW,
    messages: messagesZhTW,
  },
  en: {
    common: commonEn,
    navigation: navigationEn,
    home: homeEn,
    auth: authEn,
    doctors: doctorsEn,
    appointments: appointmentsEn,
    profile: profileEn,
    messages: messagesEn,
  },
};

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,

    // Default language: Traditional Chinese
    fallbackLng: 'zh-TW',
    lng: 'zh-TW', // Force initial language

    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'navigation', 'home', 'auth', 'doctors', 'appointments', 'profile', 'messages'],

    // Language detection configuration
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator'],

      // Keys to look for in localStorage
      lookupLocalStorage: 'i18nextLng',

      // Cache user language in localStorage
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React specific options
    react: {
      useSuspense: false, // Disable suspense for simpler setup
    },
  });

export default i18n;
