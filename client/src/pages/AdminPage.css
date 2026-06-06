import React, { useState, useCallback } from 'react';
import { adminAPI } from '../services/api';
import './AdminPage.css';

export default function AdminPage() {
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

  const notify=msg=>{setToast(msg);setTimeout(()=>setToast(''),3500)};
  const load=useCallback(async()=>{
    try{
      const [s,st]=await Promise.all([adminAPI.students(pass),adminAPI.stats(pass)]);
      setStudents(s.data);setStats(st.data);
    }catch{}
  },[pass]);

  const tryLogin=async e=>{
    e.preventDefault();
    try{await adminAPI.stats(pass);setAuth(true);load();}
    catch{alert('كلمة المرور غير صحيحة');}
  };
  const generateCodes=async e=>{
    e.preventDefault();
    try{
      const r=await adminAPI.generateCodes(pass,{...codeForm,count:parseInt(codeForm.count)});
      setCodes(r.data.codes);load();notify("تم انشاء "+r.data.count+" رمز");
    }catch{notify('حدث خطأ');}
  };
  const addVideo=async e=>{
    e.preventDefault();
    try{
      await adminAPI.addVideo(pass,{...videoForm,course_id:parseInt(videoForm.course_id),duration_min:parseInt(videoForm.duration_min),sort_order:parseInt(videoForm.sort_order)});
      notify('تم اضافة الفيديو');
      setVideoForm({course_id:'1',title_ar:'',title_fr:'',video_url:'',thumb_url:'',duration_min:0,sort_order:1});
    }catch{notify('حدث خطأ');}
  };
  const toggleStudent=async(id,status)=>{
    try{
      if(status==='active')await adminAPI.deactivate(pass,id);
      else await adminAPI.activate(pass,id);
      load();notify('تم التحديث');
    }catch{notify('حدث خطأ');}
  };
  const loadMsgs=async()=>{
    try{const r=await adminAPI.messages(pass);setMsgs(r.data);}catch{}
  };

  if(!auth)return(
    <div className="admin-login">
      <div className="admin-login-box fade-up">
        <img src="/logo.jpg" alt="SIDOX" className="admin-login-logo"/>
        <h2>لوحة التحكم</h2>
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
        <h1>لوحة تحكم SIDOX EDU</h1>
        <button className="btn btn-ghost btn-sm" onClick={load}>تحديث</button>
      </div>
      <div className="admin-tabs">
        {[{key:'stats',label:'احصائيات'},{key:'codes',label:'اكواد'},{key:'videos',label:'فيديوهات'},{key:'students',label:'الطلاب'},{key:'messages',label:'الرسائل'}].map(({key,label})=>(
          <button key={key} className={"tab-btn"+(tab===key?' active':'')} onClick={()=>{setTab(key);if(key==='messages')loadMsgs();}}>{label}</button>
        ))}
      </div>
      {tab==='stats'&&stats&&(
        <div className="admin-section">
          <div className="stats-row">
            <div className="stat-box"><h3>{stats.totalStudents}</h3><p>اجمالي الطلاب</p></div>
            <div className="stat-box"><h3>{stats.activeStudents}</h3><p>طلاب نشطون</p></div>
            {stats.courseBreakdown&&stats.courseBreakdown.map(c=>(<div key={c.name} className="stat-box"><h3>{c.enrolled||0}</h3><p>{c.name}</p></div>))}
          </div>
        </div>
      )}
      {tab==='codes'&&(
        <div className="admin-section admin-two-col">
          <form className="card" onSubmit={generateCodes}>
            <h2>انشاء اكواد وصول</h2>
            <div className="form-group"><label>الدورة</label>
              <select className="form-input" value={codeForm.course_id} onChange={e=>{const n=e.target.options[e.target.selectedIndex].text;setCodeForm({...codeForm,course_id:e.target.value,course_name:n});}}>
                <option value="1">AutoCAD</option><option value="2">Covadis</option>
              </select>
            </div>
            <div className="form-group"><label>عدد الاكواد</label>
              <input type="number" min="1" max="100" className="form-input" value={codeForm.count} onChange={e=>setCodeForm({...codeForm,count:e.target.value})}/>
            </div>
            <button type="submit" className="btn btn-primary btn-full">انشاء الاكواد</button>
          </form>
          {codes.length>0&&(
            <div className="card codes-result">
              <h3>الاكواد ({codes.length})</h3>
              <div className="codes-list">
                {codes.map(c=>(<div key={c.access_code} className="code-row"><code>{c.access_code}</code><span className="badge badge-blue">{c.course_name}</span></div>))}
              </div>
            </div>
          )}
        </div>
      )}
      {tab==='videos'&&(
        <div className="admin-section">
          <form className="card" onSubmit={addVideo}>
            <h2>اضافة فيديو جديد</h2>
            <div className="form-group"><label>الدورة</label>
              <select className="form-input" value={videoForm.course_id} onChange={e=>setVideoForm({...videoForm,course_id:e.target.value})}>
                <option value="1">AutoCAD</option><option value="2">Covadis</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group"><label>العنوان عربي</label><input className="form-input" required value={videoForm.title_ar} onChange={e=>setVideoForm({...videoForm,title_ar:e.target.value})}/></div>
              <div className="form-group"><label>Titre FR</label><input className="form-input" value={videoForm.title_fr} onChange={e=>setVideoForm({...videoForm,title_fr:e.target.value})}/></div>
            </div>
            <div className="form-group"><label>رابط الفيديو</label><input type="url" className="form-input" required placeholder="https://..." value={videoForm.video_url} onChange={e=>setVideoForm({...videoForm,video_url:e.target.value})}/></div>
            <div className="form-row">
              <div className="form-group"><label>المدة دقائق</label><input type="number" className="form-input" value={videoForm.duration_min} onChange={e=>setVideoForm({...videoForm,duration_min:e.target.value})}/></div>
              <div className="form-group"><label>الترتيب</label><input type="number" className="form-input" value={videoForm.sort_order} onChange={e=>setVideoForm({...videoForm,sort_order:e.target.value})}/></div>
            </div>
            <button type="submit" className="btn btn-primary">اضافة الفيديو</button>
          </form>
        </div>
      )}
      {tab==='students'&&(
        <div className="admin-section">
          <div className="card">
            <h2>الطلاب ({students.length})</h2>
            <div className="table-wrap">
              <table className="students-table">
                <thead><tr><th>#</th><th>رمز الدخول</th><th>الدورة</th><th>الحالة</th><th>اجراء</th></tr></thead>
                <tbody>
                  {students.map((s,i)=>(
                    <tr key={s.id}>
                      <td>{i+1}</td>
                      <td><code className="code-cell">{s.access_code||'no code'}</code></td>
                      <td>{s.course||'no course'}</td>
                      <td><span className={"badge "+(s.status==='active'?'badge-ok':'badge-err')}>{s.status==='active'?'نشط':'معطل'}</span></td>
                      <td><button className={"btn btn-sm "+(s.status==='active'?'btn-danger':'btn-success')} onClick={()=>toggleStudent(s.id,s.status)}>{s.status==='active'?'تعطيل':'تفعيل'}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {tab==='messages'&&(
        <div className="admin-section">
          <div className="card">
            <h2>رسائل التواصل ({msgs.length})</h2>
            {msgs.map(m=>(
              <div key={m.id} className="msg-card">
                <div className="msg-head">
                  <strong>{m.name}</strong>
                  <span className="badge badge-blue">{m.course_interest||'عام'}</span>
                </div>
                <p className="msg-text">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
