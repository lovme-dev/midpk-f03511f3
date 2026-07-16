import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from './locales/en.json';
import urTranslations from './locales/ur.json';
import arTranslations from './locales/ar.json';
import zhTranslations from './locales/zh.json';
import jaTranslations from './locales/ja.json';
import koTranslations from './locales/ko.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import ruTranslations from './locales/ru.json';
import hiTranslations from './locales/hi.json';
import trTranslations from './locales/tr.json';
import idTranslations from './locales/id.json';
import thTranslations from './locales/th.json';
import viTranslations from './locales/vi.json';
import ptTranslations from './locales/pt.json';
import itTranslations from './locales/it.json';
import nlTranslations from './locales/nl.json';
import plTranslations from './locales/pl.json';
import msTranslations from './locales/ms.json';
import bnTranslations from './locales/bn.json';
import tlTranslations from './locales/tl.json';
import neTranslations from './locales/ne.json';
import siTranslations from './locales/si.json';
import faTranslations from './locales/fa.json';
import heTranslations from './locales/he.json';
import svTranslations from './locales/sv.json';
import noTranslations from './locales/no.json';
import daTranslations from './locales/da.json';
import fiTranslations from './locales/fi.json';
import elTranslations from './locales/el.json';
import csTranslations from './locales/cs.json';
import skTranslations from './locales/sk.json';
import hrTranslations from './locales/hr.json';
import slTranslations from './locales/sl.json';
import srTranslations from './locales/sr.json';
import bsTranslations from './locales/bs.json';
import sqTranslations from './locales/sq.json';
import isTranslations from './locales/is.json';
import kkTranslations from './locales/kk.json';
import uzTranslations from './locales/uz.json';
import kyTranslations from './locales/ky.json';
import tgTranslations from './locales/tg.json';
import azTranslations from './locales/az.json';
import kaTranslations from './locales/ka.json';
import swTranslations from './locales/sw.json';
import amTranslations from './locales/am.json';
// Additional languages
import bgTranslations from './locales/bg.json';
import huTranslations from './locales/hu.json';
import roTranslations from './locales/ro.json';
import etTranslations from './locales/et.json';
import ltTranslations from './locales/lt.json';
import lvTranslations from './locales/lv.json';
import mkTranslations from './locales/mk.json';
import psTranslations from './locales/ps.json';
import sdTranslations from './locales/sd.json';
import hyTranslations from './locales/hy.json';
import kmTranslations from './locales/km.json';
import loTranslations from './locales/lo.json';
import myTranslations from './locales/my.json';
import tkTranslations from './locales/tk.json';
import beTranslations from './locales/be.json';

const resources = {
  en: { translation: enTranslations },
  ur: { translation: urTranslations },
  ar: { translation: arTranslations },
  zh: { translation: zhTranslations },
  ja: { translation: jaTranslations },
  ko: { translation: koTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  ru: { translation: ruTranslations },
  hi: { translation: hiTranslations },
  tr: { translation: trTranslations },
  id: { translation: idTranslations },
  th: { translation: thTranslations },
  vi: { translation: viTranslations },
  pt: { translation: ptTranslations },
  it: { translation: itTranslations },
  nl: { translation: nlTranslations },
  pl: { translation: plTranslations },
  ms: { translation: msTranslations },
  bn: { translation: bnTranslations },
  tl: { translation: tlTranslations },
  ne: { translation: neTranslations },
  si: { translation: siTranslations },
  fa: { translation: faTranslations },
  he: { translation: heTranslations },
  sv: { translation: svTranslations },
  no: { translation: noTranslations },
  da: { translation: daTranslations },
  fi: { translation: fiTranslations },
  el: { translation: elTranslations },
  cs: { translation: csTranslations },
  sk: { translation: skTranslations },
  hr: { translation: hrTranslations },
  sl: { translation: slTranslations },
  sr: { translation: srTranslations },
  bs: { translation: bsTranslations },
  sq: { translation: sqTranslations },
  is: { translation: isTranslations },
  kk: { translation: kkTranslations },
  uz: { translation: uzTranslations },
  ky: { translation: kyTranslations },
  tg: { translation: tgTranslations },
  az: { translation: azTranslations },
  ka: { translation: kaTranslations },
  sw: { translation: swTranslations },
  am: { translation: amTranslations },
  // Additional languages
  bg: { translation: bgTranslations },
  hu: { translation: huTranslations },
  ro: { translation: roTranslations },
  et: { translation: etTranslations },
  lt: { translation: ltTranslations },
  lv: { translation: lvTranslations },
  mk: { translation: mkTranslations },
  ps: { translation: psTranslations },
  sd: { translation: sdTranslations },
  hy: { translation: hyTranslations },
  km: { translation: kmTranslations },
  lo: { translation: loTranslations },
  my: { translation: myTranslations },
  tk: { translation: tkTranslations },
  be: { translation: beTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
