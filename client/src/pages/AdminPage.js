import React,{useState,useEffect,useCallback} from 'react';
import {adminAPI} from '../services/api';
import './AdminPage.css';

export default function AdminPage(){
  const [pass,setPass]=useState('');
  const [auth,setAuth]=useState(false);
  const [tab,setTab]=useState('stats');
  const [stats,setStats]=useState(null);
  const [students,setStudents]=useState([]);
  const [msgs,setMsgs]=useState([]);
  const [codeForm,setCodeForm]=useState({course_id:'1',course_name:'AutoCAD',count:1,email:'',phone:''});
  const [videoForm,setVideoForm]=useState({course_id:'1',title_ar:'',title_fr:'',video_url:'',thumb_url:'',duration_min:0,sort_order:1});
  const [codes,setCodes]=useState([]);
  const [toast,setToast]=useState('');

  const notify=msg=>{ setToast(msg); setTimeout(()=>setToast(''),3500); };

  const load=useCallback(async()=>{
    try{
      const [s,st]=await Promise.all([adminAPI.students(pass),adminAPI.stats(pass)]);
      setStudents(s.data); setStats(st.data);
    }catch{}
  },[pass]);

  const tryLogin=async e=>{
    e.preventDefault();
    try{ await adminAPI.stats(pass); setAuth(true); load(); }
    catch{ alert('كلمة المرور غير صحيحة'); }
  };

  const generateCodes=async e=>{
    e.preventDefault();
    try{
      const r=await adminAPI.generateCodes(pass,{...codeForm,count:parseInt(codeForm.count)});
      setCodes(r.data.codes); load(); notify(`✅ تم إنشاء ${r.data.count} رمز`);
    }catch{ notify('❌ حدث خطأ'); }
  };

  const addVideo=async e=>{
    e.preventDefault();
    try{
      await adminAPI.addVideo(pass,{...videoForm,course_id:parseInt(videoForm.course_id),duration_min:parseInt(videoForm.duration_min),sort_order:parseInt(videoForm.sort_order)});
      notify('✅ تم إضافة الفيديو');
      setVideoForm({course_id:'1',title_ar:'',title_fr:'',video_url:'',thumb_url:'',duration_min:0,sort_order:1});
    }catch{ notify('❌ حدث خطأ'); }
  };

  const toggleStudent=async(id,status)=>{
    try{
      if(status==='active') await adminAPI.deactivate(pass,id);
      else await adminAPI.activate(pass,id);
      load(); notify('✅ تم التحديث');
    }catch{ notify('❌ حدث خطأ'); }
  };

  const loadMsgs=async()=>{
    try{ const r=await adminAPI.messages(pass); setMsgs(r.data); }catch{}
  };

  if(!auth) return(
    <div className="admin-login">
      <div className="admin-login-box fade-up">
        <img src="/logo.jpg" alt="SIDOX" className="admin-login-logo"/>
        <h2>🔐 لوحة التحكم</h2>
        <form onSubmit={tryLogin}>
          <input type="password" className="form-input" placeholder="كلمة مرور المدير" value={pass} onChange={e=>setPass(e.target.value)} required/>
          <button type="submit" className="btn btn-primary btn-full" style={{marginTop:'1rem'}}>دخول</button>
        </form>
      </div>
    </div>
  );

  return(
    <div className="admin-page fade-up">
      {toast&&<div className="admin-toast">{toast}</div>}
      <div className="admin-header">
        <h1>🛠️ لوحة تحكم SIDOX EDU</h1>
        <button className="btn btn-ghost btn-sm" onClick={load}>🔄 تحديث</button>
      </div>

      {/* TABS */}
      <div className="admin-tabs">
        {['stats','codes','videos','students','messages'].map(t_=>(
          <button key={t_} className={`tab-btn${tab===t_?' active':''}`} onClick={()=>{ setTab(t_); if(t_==='messages') loadMsgs(); }}>
            {t_==='stats'?'📊 إحصائيات':t_==='codes'?'🎟️ أكواد':t_==='videos'?'🎬 فيديوهات':t_==='students'?'👥 الطلاب':'💬 الرسائل'}
          </button>
        ))}
      </div>

      {/* STATS */}
      {tab==='stats'&&stats&&(
        <div className="admin-section">
          <div className="stats-row">
            <div className="stat-box"><h3>{stats.totalStudents}</h3><p>إجمالي الطلاب</p></div>
            <div className="stat-box"><h3>{stats.activeStudents}</h3><p>طلاب نشطون</p></div>
            {stats.courseBreakdown?.map(c=>(<div key={c.name} className="stat-box"><h3>{c.enrolled||0}</h3><p>{c.name}</p></div>))}
          </div>
          {stats.recentLogins?.length>0&&(
            <div className="card" style={{marginTop:'1.5rem'}}>
              <h3 style={{marginBottom:'1rem'}}>آخر دخولات</h3>
              {stats.recentLogins.map((l,i)=>(
                <div key={i} className="recent-row">
                  <code>{l.username}</code>
                  <span>{l.last_login?new Date(l.last_login).toLocaleString('ar'):'لم يدخل بعد'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GENERATE CODES */}
      {tab==='codes'&&(
        <div className="admin-section admin-two-col">
          <form className="card" onSubmit={generateCodes}>
            <h2>🎟️ إنشاء أكواد وصول</h2>
            <div className="form-group">
              <label>الدورة</label>
              <select className="form-input" value={codeForm.course_id}
                onChange={e=>{ const n=e.target.options[e.target.selectedIndex].text; setCodeForm({...codeForm,course_id:e.target.value,course_name:n}); }}>
                <option value="1">AutoCAD</option>
                <option value="2">Covadis</option>
              </select>
            </div>
            <div className="form-group">
              <label>عدد الأكواد (max 100)</label>
              <input type="number" min="1" max="100" className="form-input" value={codeForm.count} onChange={e=>setCodeForm({...codeForm,count:e.target.value})}/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>بريد الطالب (اختياري)</label>
                <input className="form-input" value={codeForm.email} onChange={e=>setCodeForm({...codeForm,email:e.target.value})}/>
              </div>
              <div className="form-group">
                <label>هاتف الطالب (اختياري)</label>
                <input className="form-input" value={codeForm.phone} onChange={e=>setCodeForm({...codeForm,phone:e.target.value})}/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full">إنشاء الأكواد</button>
          </form>

          {codes.length>0&&(
            <div className="card codes-result">
              <h3>الأكواد المُنشأة ({codes.length})</h3>
              <div className="codes-list">
                {codes.map(c=>(
                  <div key={c.access_code} className="code-row">
                    <code>{c.access_code}</code>
                    <span className="badge badge-blue">{c.course_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIDEOS */}
      {tab==='videos'&&(
        <div className="admin-section">
          <form className="card" onSubmit={addVideo}>
            <h2>🎬 إضافة فيديو جديد</h2>
            <div className="form-group">
              <label>الدورة</label>
              <select className="form-input" value={videoForm.course_id} onChange={e=>setVideoForm({...videoForm,course_id:e.target.value})}>
                <option value="1">AutoCAD</option>
                <option value="2">Covadis</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>العنوان (عربي)</label>
                <input className="form-input" required value={videoForm.title_ar} onChange={e=>setVideoForm({...videoForm,title_ar:e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Titre (Français)</label>
                <input className="form-input" value={videoForm.title_fr} onChange={e=>setVideoForm({...videoForm,title_fr:e.target.value})}/>
              </div>
            </div>
            <div className="form-group">
              <label>رابط الفيديو (URL) *</label>
              <input type="url" className="form-input" required placeholder="https://..." value={videoForm.video_url} onChange={e=>setVideoForm({...videoForm,video_url:e.target.value})}/>
            </div>
            <div className="form-group">
              <label>رابط الصورة المصغرة</label>
              <input type="url" className="form-input" placeholder="https://..." value={videoForm.thumb_url} onChange={e=>setVideoForm({...videoForm,thumb_url:e.target.value})}/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>المدة (دقائق)</label>
                <input type="number" className="form-input" value={videoForm.duration_min} onChange={e=>setVideoForm({...videoForm,duration_min:e.target.value})}/>
              </div>
              <div className="form-group">
                <label>الترتيب</label>
                <input type="number" className="form-input" value={videoForm.sort_order} onChange={e=>setVideoForm({...videoForm,sort_order:e.target.value})}/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">➕ إضافة الفيديو</button>
          </form>
        </div>
      )}

      {/* STUDENTS */}
      {tab==='students'&&(
        <div className="admin-section">
          <div className="card">
            <h2>👥 الطلاب المسجلون ({students.length})</h2>
            <div className="table-wrap">
              <table className="students-table">
                <thead>
                  <tr><th>#</th><th>رمز الدخول</th><th>الدورة</th><th>الهاتف</th><th>الحالة</th><th>آخر دخول</th><th>إجراء</th></tr>
                </thead>
                <tbody>
                  {students.map((s,i)=>(
                    <tr key={s.id}>
                      <td>{i+1}</td>
                      <td><code className="code-cell">{s.access_code||'—'}</code></td>
                      <td>{s.course||'—'}</td>
                      <td>{s.phone||'—'}</td>
                      <td><span className={`badge ${s.status==='active'?'badge-ok':'badge-err'}`}>{s.status==='active'?'نشط':'معطل'}</span></td>
                      <td className="last-login">{s.last_login?new Date(s.last_login).toLocaleDateString('ar'):'—'}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${s.status==='active'?'btn-danger':'btn-success'}`}
                          onClick={()=>toggleStudent(s.id,s.status)}
                        >
                          {s.status==='active'?'تعطيل':'تفعيل'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES */}
      {tab==='messages'&&(
        <div className="admin-section">
          <div className="card">
            <h2>💬 رسائل التواصل ({msgs.length})</h2>
            {msgs.map(m=>(
              <div key={m.id} className="msg-card">
                <div className="msg-head">
                  <strong>{m.name}</strong>
                  <span className="badge badge-blue">{m.course_interest||'عام'}</span>
                  <span className="msg-date">{new Date(m.created_at).toLocaleString('ar')}</span>
                </div>
                <p className="msg-text">{m.message}</p>
                {m.phone&&<a href={`https://wa.me/213${m.phone.replace(/^0/,'')}`} target="_blank" rel="noreferrer" className="btn btn-wa btn-sm" style={{marginTop:'.5rem'}}>📞 {m.phone}</a>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
