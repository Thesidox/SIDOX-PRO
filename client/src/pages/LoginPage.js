import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FaWhatsapp,FaTelegram} from 'react-icons/fa';
import {FiLock} from 'react-icons/fi';
import {authAPI} from '../services/api';
import {useAuth} from '../context/AuthContext';
import './LoginPage.css';
export default function LoginPage(){
  const {t}=useTranslation();
  const {login}=useAuth();
  const nav=useNavigate();
  const [code,setCode]=useState('');
  const [err,setErr]=useState('');
  const [loading,setLoading]=useState(false);
  const submit=async e=>{
    e.preventDefault();
    if(!code.trim()) return setErr(t('login.error'));
    setLoading(true); setErr('');
    try{
      const r=await authAPI.loginWithCode(code.trim().toUpperCase());
      login(r.data.token,r.data.user);
      nav('/dashboard');
    }catch(e){ setErr(e.response?.data?.error||t('login.error')); }
    finally{ setLoading(false); }
  };
  return(
    <div className="login-page">
      <div className="login-box fade-up">
        <div className="login-logo"><img src="/logo.jpg" alt="SIDOX"/></div>
        <div className="login-icon"><FiLock/></div>
        <h2>{t('login.title')}</h2>
        <p className="login-hint">أدخل رمزك الفريد للوصول إلى دوراتك</p>
        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <label>{t('login.label')}</label>
            <input
              className="form-input login-code-input"
              placeholder={t('login.placeholder')}
              value={code}
              onChange={e=>setCode(e.target.value.toUpperCase())}
              disabled={loading}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          {err&&<div className="alert alert-err">{err}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading?<span className="spinner-sm"/>:t('login.btn')}
          </button>
        </form>
        <div className="login-divider"><span>لا تملك رمزاً بعد؟</span></div>
        <div className="login-contact">
          <p className="login-contact-title">تواصل لشراء دورتك:</p>
          <a href="https://wa.me/213552882966" target="_blank" rel="noreferrer" className="btn btn-wa"><FaWhatsapp/> WhatsApp</a>
          <a href="https://t.me/Geo_sidox_off" target="_blank" rel="noreferrer" className="btn btn-tg"><FaTelegram/> Telegram</a>
        </div>
      </div>
    </div>
  );
}
