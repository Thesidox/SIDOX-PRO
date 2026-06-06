import React from 'react';
import {FaWhatsapp,FaTelegram,FaTiktok} from 'react-icons/fa';
import {FiMail,FiPhone} from 'react-icons/fi';
import './Footer.css';
export default function Footer(){
  return(
    <footer className="ftr">
      <div className="ftr-inner">
        <div className="ftr-brand">
          <img src="/logo.jpg" alt="SIDOX"/>
          <div>
            <h3>SIDOX EDU</h3>
            <p>منصة تعليمية — AutoCAD & Covadis</p>
            <p style={{fontSize:'.8rem',marginTop:'.25rem'}}>Sid Ali DIAF · Formateur depuis +6 ans</p>
          </div>
        </div>
        <div className="ftr-links">
          <h4>الدورات | Cours</h4>
          <ul>
            <li>📐 AutoCAD — 3 500 DA</li>
            <li>🗺️ Covadis — 5 000 DA</li>
            <li>📚 Bundle — 8 000 DA</li>
          </ul>
        </div>
        <div className="ftr-contact">
          <h4>تواصل | Contact</h4>
          <a href="mailto:sidox.edu@gmail.com"><FiMail/> sidox.edu@gmail.com</a>
          <a href="https://wa.me/213552882966" target="_blank" rel="noreferrer"><FaWhatsapp/> 0552 88 29 66</a>
          <a href="https://t.me/Geo_sidox_off" target="_blank" rel="noreferrer"><FaTelegram/> @Geo_sidox_off</a>
          <a href="https://www.tiktok.com/@d.sidox" target="_blank" rel="noreferrer"><FaTiktok/> @d.sidox</a>
        </div>
      </div>
      <div className="ftr-bottom">
        <p>© {new Date().getFullYear()} SIDOX EDU — Sid Ali DIAF. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
