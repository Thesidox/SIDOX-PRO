import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const ar = {
  nav:{ home:'الرئيسية', courses:'الدورات', login:'دخول الطالب', dashboard:'دوراتي', logout:'خروج' },
  hero:{ title:'SIDOX EDU', sub:'منصة تعليمية متخصصة في AutoCAD و Covadis', desc:'دورات عملية منظمة — وصول مدى الحياة', cta:'ابدأ التعلم' },
  courses:{ title:'الدورات المتاحة', enroll:'اشترك الآن', price:'السعر', duration:'المدة', level:'المستوى' },
  login:{ title:'دخول الطالب', label:'رمز الدخول', placeholder:'SIDOX-XXXXXXXX', btn:'دخول', error:'الرمز غير صحيح', noCode:'لا تملك رمزاً؟ تواصل معنا' },
  dashboard:{ welcome:'مرحباً!', playlist:'قائمة الدروس', noVideos:'سيتم إضافة الدروس قريباً' },
  contact:{ title:'تواصل معنا', name:'الاسم', email:'البريد', phone:'الهاتف', msg:'الرسالة', send:'إرسال', ok:'تم استلام رسالتك!' },
  common:{ loading:'جاري التحميل...', error:'حدث خطأ', back:'رجوع', da:'دج' }
};
const fr = {
  nav:{ home:'Accueil', courses:'Cours', login:'Connexion', dashboard:'Mes Cours', logout:'Déconnexion' },
  hero:{ title:'SIDOX EDU', sub:'Plateforme éducative AutoCAD & Covadis', desc:'Formations pratiques — Accès à vie', cta:'Commencer' },
  courses:{ title:'Cours disponibles', enroll:"S'inscrire", price:'Prix', duration:'Durée', level:'Niveau' },
  login:{ title:'Connexion étudiant', label:"Code d'accès", placeholder:'SIDOX-XXXXXXXX', btn:'Connexion', error:'Code invalide', noCode:'Pas de code? Contactez-nous' },
  dashboard:{ welcome:'Bienvenue!', playlist:'Leçons', noVideos:'Leçons à venir' },
  contact:{ title:'Nous contacter', name:'Nom', email:'Email', phone:'Téléphone', msg:'Message', send:'Envoyer', ok:'Message reçu!' },
  common:{ loading:'Chargement...', error:'Erreur', back:'Retour', da:'DA' }
};
i18n.use(initReactI18next).init({
  resources:{ ar:{translation:ar}, fr:{translation:fr} },
  lng: localStorage.getItem('lang') || 'ar',
  fallbackLng:'ar',
  interpolation:{ escapeValue:false }
});
export default i18n;
