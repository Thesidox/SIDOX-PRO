import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FiMenu,FiX,FiLogOut,FiHome,FiBook,FiGrid} from 'react-icons/fi';
import {useAuth} from '../context/AuthContext';
import './Header.css';
export default function Header({lang,setLang}){
  const {t,i18n}=useTranslation();
  const {isAuth,logout}=useAuth();
  const [open,setOpen]=useState(false);
  const nav=useNavigate();
  const switchLang=l=>{i18n.changeLanguage(l);localStorage.setItem('lang',l);setLang(l);setOpen(false)};
  const doLogout=()=>{logout();nav('/');setOpen(false)};
  return(
    <header className="hdr">
      <div className="hdr-inner">
        <Link to="/" className="hdr-logo" onClick={()=>setOpen(false)}>
          <img src="/logo.jpg" alt="SIDOX"/>
          <span>SIDOX EDU</span>
        </Link>
        <nav className={`hdr-nav${open?' open':''}`}>
          <Link to="/"         onClick={()=>setOpen(false)}><FiHome/> {t('nav.home')}</Link>
          <Link to="/#courses" onClick={()=>setOpen(false)}><FiBook/> {t('nav.courses')}</Link>
          {isAuth&&<Link to="/dashboard" onClick={()=>setOpen(false)}><FiGrid/> {t('nav.dashboard')}</Link>}
          {isAuth
            ?<button className="btn btn-ghost btn-sm" onClick={doLogout}><FiLogOut/>{t('nav.logout')}</button>
            :<Link to="/login" className="btn btn-primary btn-sm" onClick={()=>setOpen(false)}>{t('nav.login')}</Link>
          }
          <div className="lang-sw">
            <button className={lang==='ar'?'active':''} onClick={()=>switchLang('ar')}>ع</button>
            <button className={lang==='fr'?'active':''} onClick={()=>switchLang('fr')}>FR</button>
          </div>
        </nav>
        <button className="hdr-burger" onClick={()=>setOpen(!open)}>{open?<FiX/>:<FiMenu/>}</button>
      </div>
    </header>
  );
}
