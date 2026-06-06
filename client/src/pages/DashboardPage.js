import React,{useState,useEffect,useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {FaWhatsapp,FaTelegram} from 'react-icons/fa';
import {FiPlay,FiCheck,FiClock} from 'react-icons/fi';
import {videosAPI} from '../services/api';
import {useAuth} from '../context/AuthContext';
import './DashboardPage.css';

export default function DashboardPage(){
  const {t}=useTranslation();
  const {user}=useAuth();
  const [videos,setVideos]=useState([]);
  const [current,setCurrent]=useState(null);
  const [loading,setLoading]=useState(true);
  const videoRef=useRef(null);

  const courseId=user?.course==='AutoCAD'?1:user?.course==='Covadis'?2:user?.courseId||1;

  useEffect(()=>{
    videosAPI.getByCourse(courseId)
      .then(r=>{ setVideos(r.data); if(r.data.length) setCurrent(r.data[0]); })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[courseId]);

  const selectVideo=v=>{
    setCurrent(v);
    setTimeout(()=>{ videoRef.current?.scrollIntoView({behavior:'smooth',block:'start'}); },100);
  };

  const onTimeUpdate=e=>{
    const el=e.target;
    if(Math.floor(el.currentTime)%30===0&&el.currentTime>0){
      videosAPI.saveProgress(current.id, Math.floor(el.currentTime), el.ended).catch(()=>{});
    }
  };

  const onEnded=()=>{
    videosAPI.saveProgress(current.id, current.duration_min*60||0, true).catch(()=>{});
    const idx=videos.findIndex(v=>v.id===current.id);
    if(idx<videos.length-1) setCurrent(videos[idx+1]);
  };

  if(loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return(
    <div className="dash fade-up">
      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1>{t('dashboard.welcome')} 👋</h1>
          <div className="dash-meta">
            <span className="badge badge-blue">📚 {user?.course||'Cours'}</span>
            <span className="dash-code">رمزك: <code>{user?.access_code||user?.code}</code></span>
          </div>
        </div>
        <div className="dash-progress-ring">
          <span>{videos.length}</span>
          <small>درس</small>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dash-content">
        {/* PLAYER */}
        <div className="player-area" ref={videoRef}>
          {current?(
            <>
              <div className="player-title">{current.title_ar||current.title_fr||'درس'}</div>
              <div
                className="player-wrap"
                onContextMenu={e=>e.preventDefault()}
              >
                <video
                  key={current.id}
                  className="video-el"
                  controls
                  controlsList="nodownload noremoteplayback nofullscreen"
                  disablePictureInPicture
                  onContextMenu={e=>e.preventDefault()}
                  onTimeUpdate={onTimeUpdate}
                  onEnded={onEnded}
                >
                  <source src={current.video_url} type="video/mp4"/>
                  متصفحك لا يدعم تشغيل الفيديو.
                </video>
              </div>
              {current.title_fr&&<p className="player-sub">{current.title_fr}</p>}
            </>
          ):(
            <div className="player-empty">
              <p>{t('dashboard.noVideos')}</p>
            </div>
          )}
        </div>

        {/* PLAYLIST */}
        <div className="playlist">
          <div className="playlist-head">{t('dashboard.playlist')} ({videos.length})</div>
          {videos.length===0
            ?<p className="playlist-empty">{t('dashboard.noVideos')}</p>
            :<ul>
              {videos.map((v,i)=>(
                <li
                  key={v.id}
                  className={`pli${current?.id===v.id?' pli-active':''}`}
                  onClick={()=>selectVideo(v)}
                >
                  <span className="pli-num">{String(i+1).padStart(2,'0')}</span>
                  <div className="pli-info">
                    <p className="pli-title">{v.title_ar||v.title_fr||`Leçon ${i+1}`}</p>
                    {v.duration_min>0&&<span className="pli-dur"><FiClock/> {v.duration_min} min</span>}
                  </div>
                  {current?.id===v.id
                    ?<FiPlay className="pli-icon pli-play"/>
                    :<FiCheck className="pli-icon pli-done" style={{opacity:.25}}/>
                  }
                </li>
              ))}
            </ul>
          }
        </div>
      </div>

      {/* SUPPORT */}
      <div className="dash-support">
        <p>🛎️ هل تحتاج مساعدة؟</p>
        <a href="https://wa.me/213552882966" target="_blank" rel="noreferrer" className="btn btn-wa btn-sm"><FaWhatsapp/> WhatsApp</a>
        <a href="https://t.me/Geo_sidox_off" target="_blank" rel="noreferrer" className="btn btn-tg btn-sm"><FaTelegram/> Telegram</a>
      </div>
    </div>
  );
}
