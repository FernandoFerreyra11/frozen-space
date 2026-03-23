// =============================================
// Frozen Space - i18n (Internationalization)
// =============================================

import esLocale from '../locales/es.json';
import enLocale from '../locales/en.json';

const locales = { es: esLocale, en: enLocale };
let currentLang = localStorage.getItem('fs-lang') || 'es';
let listeners = [];

export function getCurrentLang() {
  return currentLang;
}

export function setLang(lang) {
  if (locales[lang]) {
    currentLang = lang;
    localStorage.setItem('fs-lang', lang);
    applyTranslations();
    listeners.forEach(fn => fn(lang));
  }
}

export function toggleLang() {
  setLang(currentLang === 'es' ? 'en' : 'es');
}

export function t(key) {
  const keys = key.split('.');
  let value = locales[currentLang];
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }
  return value || key;
}

export function onLangChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (typeof translation === 'string') {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const translation = t(key);
    if (typeof translation === 'string') {
      el.innerHTML = translation;
    }
  });
}
