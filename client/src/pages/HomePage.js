import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FiArrowRight,FiCheckCircle,FiAward,FiUsers,FiBook,FiStar} from 'react-icons/fi';
import {FaWhatsapp,FaTelegram} from 'react-icons/fa';
import {coursesAPI,contactAPI} from '../services/api';
import './HomePage.css';
export default function HomePage(){
  const {t}=useTranslation();
  const nav=useNavigate();
  const [courses,setCourses]=useState([]);
  const [form,setForm]=useState({name:'',email:'',phone:'',message:'',course_interest:''});
  const [status,setStatus]=useState('');
  useEffect(()=>{ coursesAPI.getAll().then(r=>setCourses(r.data)).catch(()=>{}) },[]);
  const submit=async e=>{
    e.preventDefault();
    try{ await contactAPI.send(form); setStatus('ok'); setForm({name:'',email:'',phone:'',message:'',course_interest:''}); }
    catch{ setStatus('err'); }
  };
  return(
    <div className="home fade-up">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-content">
          <span className="hero-badge">🎓 SIDOX EDU</span>
          <h1>{t('hero.title')}</h1>
          <p className="hero-sub">{t('hero.sub')}</p>
          <p className="hero-desc">{t('hero.desc')}</p>
          <div className="hero-btns">
            <button className="btn btn-primary btn-lg" onClick={()=>nav('/login')}>{t('hero.cta')} <FiArrowRight/></button>
            <a href="#courses" className="btn btn-ghost btn-lg">{t('nav.courses')}</a>
          </div>
          <div className="hero-stats">
            <div><strong>6+</strong><span>سنوات خبرة</span></div>
            <div><strong>1000+</strong><span>طالب</span></div>
            <div><strong>2</strong><span>دورات متخصصة</span></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="section-title"><h2>لماذا SIDOX EDU؟</h2></div>
        <div className="feat-grid">
          {[
            {icon:<FiBook/>, t:'محتوى عملي', d:'مشاريع حقيقية من الصفر'},
            {icon:<FiUsers/>,t:'مدرب خبير',  d:'6 سنوات تدريب ميداني'},
            {icon:<FiAward/>,t:'وصول مدى الحياة',d:'ادفع مرة واحدة واستمتع إلى الأبد'},
            {icon:<FiCheckCircle/>,t:'دعم مباشر',d:'تواصل مع المدرب في أي وقت'},
            {icon:<FiStar/>,t:'محتوى محدّث',d:'دروس جديدة تضاف باستمرار'},
            {icon:<FiCheckCircle/>,t:'شهادة إتمام',d:'احصل على شهادة بعد الإكمال'},
          ].map((f,i)=>(
            <div key={i} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.t}</h3><p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section className="section" id="courses">
        <div className="section-title"><h2>{t('courses.title')}</h2></div>
        <div className="courses-grid">
          {courses.map(c=>(
            <div key={c.id} className="course-card">
              <div className="course-img">{c.name==='AutoCAD'?'📐':'🗺️'}</div>
              <div className="course-body">
                <h3>{c.title_ar}</h3>
                <p className="course-name-en">{c.name}</p>
                <p className="course-desc">{c.description_ar}</p>
                <div className="course-meta">
                  <span>⏱ {c.duration_hours}h</span>
                  <span>📊 {c.level}</span>
                </div>
                <div className="course-price">{c.price_dzd.toLocaleString()} {t('common.da')}</div>
                <div className="course-actions">
                  <a href={`https://wa.me/213552882966?text=أريد الاشتراك في دورة ${c.name}`} target="_blank" rel="noreferrer" className="btn btn-wa btn-sm"><FaWhatsapp/> WhatsApp</a>
                  <a href="https://t.me/Geo_sidox_off" target="_blank" rel="noreferrer" className="btn btn-tg btn-sm"><FaTelegram/> Telegram</a>
                </div>
              </div>
            </div>
          ))}
          {/* Bundle card */}
          <div className="course-card course-bundle">
            <div className="course-img">📚</div>
            <div className="course-body">
              <h3>Bundle الكامل</h3>
              <p className="course-name-en">AutoCAD + Covadis</p>
              <p className="course-desc">احصل على الدورتين بسعر مخفض وتوفير 500 دج</p>
              <div className="course-meta"><span>⏱ 75h</span><span>📊 Tous niveaux</span></div>
              <div className="course-price">8 000 دج <span className="old-price">8 500 دج</span></div>
              <div className="course-actions">
                <a href="https://wa.me/213552882966?text=أريد الاشتراك في Bundle AutoCAD+Covadis" target="_blank" rel="noreferrer" className="btn btn-wa btn-sm"><FaWhatsapp/> WhatsApp</a>
                <a href="https://t.me/Geo_sidox_off" target="_blank" rel="noreferrer" className="btn btn-tg btn-sm"><FaTelegram/> Telegram</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="section-title"><h2>كيف يعمل النظام؟</h2></div>
        <div className="steps">
          {[
            {n:'01',t:'تواصل معنا',d:'عبر WhatsApp أو Telegram'},
            {n:'02',t:'أتمّ الدفع',d:'بطريقة يدوية مباشرة'},
            {n:'03',t:'احصل على رمزك',d:'رمز دخول فريد ومشفّر'},
            {n:'04',t:'ادرس متى تشاء',d:'وصول مدى الحياة بدون قيود'},
          ].map(s=>(
            <div key={s.n} className="step">
              <div className="step-num">{s.n}</div>
              <h4>{s.t}</h4><p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section">
        <div className="about-card card">
          <div className="about-inner">
            <div className="about-logo"><img src="/logo.jpg" alt="Sid Ali DIAF"/></div>
            <div>
              <h2>Sid Ali DIAF</h2>
              <p className="about-role">Cadre technique & Formateur | +6 ans d'expérience</p>
              <p className="about-bio">مدرب متخصص في AutoCAD و Covadis للمبتدئين والمهنيين. أقدم دورات عملية مبنية على تجارب حقيقية من الميدان، تساعدك على إتقان الأدوات والبرامج الأكثر استخداماً في قطاع الهندسة والمسح.</p>
              <div className="about-social">
                <a href="https://wa.me/213552882966" target="_blank" rel="noreferrer" className="btn btn-wa btn-sm"><FaWhatsapp/> 0552 88 29 66</a>
                <a href="https://t.me/Geo_sidox_off" target="_blank" rel="noreferrer" className="btn btn-tg btn-sm"><FaTelegram/> @Geo_sidox_off</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section">
        <div className="section-title"><h2>{t('contact.title')}</h2></div>
        <div className="contact-wrap">
          <form className="contact-form card" onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('contact.name')} *</label>
                <input className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </div>
              <div className="form-group">
                <label>{t('contact.phone')}</label>
                <input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
              </div>
            </div>
            <div className="form-group">
              <label>{t('contact.email')}</label>
              <input type="email" className="form-input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            </div>
            <div className="form-group">
              <label>الدورة المهتم بها</label>
              <select className="form-input" value={form.course_interest} onChange={e=>setForm({...form,course_interest:e.target.value})}>
                <option value="">-- اختر دورة --</option>
                <option>AutoCAD</option><option>Covadis</option><option>Bundle</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('contact.msg')} *</label>
              <textarea className="form-input" rows={4} required value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
            </div>
            {status==='ok'&&<div className="alert alert-ok">{t('contact.ok')}</div>}
            {status==='err'&&<div className="alert alert-err">{t('common.error')}</div>}
            <button type="submit" className="btn btn-primary btn-full">{t('contact.send')}</button>
          </form>
          <div className="contact-info">
            <h3>تواصل مباشرة</h3>
            <a href="https://wa.me/213552882966" target="_blank" rel="noreferrer" className="btn btn-wa"><FaWhatsapp/> WhatsApp : 0552 88 29 66</a>
            <a href="https://t.me/Geo_sidox_off" target="_blank" rel="noreferrer" className="btn btn-tg"><FaTelegram/> Telegram : @Geo_sidox_off</a>
            <a href="mailto:sidox.edu@gmail.com" className="btn btn-ghost">✉️ sidox.edu@gmail.com</a>
          </div>
        </div>
      </section>
    </div>
  );
}
