import { useState, useRef, useEffect } from "react";

// ── CONSTANTS ──
const ROLE_LEVELS = { admin:0, president:1, gs:2, host_school:3, school:4, chair:5, cochair:6, delegate:7 };
const ROLES = [
  { id:"admin",             label:"Platform Admin",          color:"#991b1b", bg:"#fef2f2" },
  { id:"president",         label:"President",               color:"#92400e", bg:"#fffbeb" },
  { id:"gs",                label:"General Secretary",       color:"#4c1d95", bg:"#f5f3ff" },
  { id:"host_school",       label:"Host Institution School", color:"#1e40af", bg:"#eff6ff" },
  { id:"school",            label:"Participating School",    color:"#065f46", bg:"#ecfdf5" },
  { id:"chair",             label:"Chair",                   color:"#1e3a8a", bg:"#eff6ff" },
  { id:"cochair",           label:"Co-Chair",                color:"#3730a3", bg:"#eef2ff" },
  { id:"delegate",          label:"Delegate",                color:"#1f2937", bg:"#f9fafb" },
];
const generateMunCode = (existingCodes=[]) => {
  let code;
  do { code = String(Math.floor(10000 + Math.random()*90000)); } while (existingCodes.includes(code));
  return code;
};
const DEMO_ACCOUNTS = [
  { email:"admin@accord.in",          password:"admin123",     role:"admin",       name:"Platform Administrator",  conference:"CHMUN 2025", committee:null,    country:null },
  { email:"president@accord.in",      password:"president123", role:"president",   name:"Dr. Aryan Mehta",         conference:"CHMUN 2025", committee:null,    country:null },
  { email:"gs@accord.in",             password:"gs123",        role:"gs",          name:"Priya Sharma",            conference:"CHMUN 2025", committee:null,    country:null },
  { email:"host@accord.in",           password:"host123",      role:"host_school", name:"Bilaspur Public School",  conference:"CHMUN 2025", committee:null,    country:null },
  { email:"school@accord.in",         password:"school123",    role:"school",      name:"DPS Raipur",              conference:"CHMUN 2025", committee:null,    country:null },
  { email:"chair.unsc@accord.in",     password:"chair123",     role:"chair",       name:"Rahul Verma",             conference:"CHMUN 2025", committee:"UNSC",  country:null },
  { email:"cochair.unsc@accord.in",   password:"cochair123",   role:"cochair",     name:"Sneha Patel",             conference:"CHMUN 2025", committee:"UNSC",  country:null },
  { email:"d.unsc.france@accord.in",  password:"del123",       role:"delegate",    name:"Aarav Singh",             conference:"CHMUN 2025", committee:"UNSC",  country:"France" },
  { email:"d.unsc.usa@accord.in",     password:"del123",       role:"delegate",    name:"Riya Joshi",              conference:"CHMUN 2025", committee:"UNSC",  country:"USA" },
  { email:"d.unsc.uk@accord.in",      password:"del123",       role:"delegate",    name:"Vikram Nair",             conference:"CHMUN 2025", committee:"UNSC",  country:"United Kingdom" },
  { email:"d.unsc.russia@accord.in",  password:"del123",       role:"delegate",    name:"Ananya Iyer",             conference:"CHMUN 2025", committee:"UNSC",  country:"Russia" },
  { email:"d.unsc.china@accord.in",   password:"del123",       role:"delegate",    name:"Rohan Das",               conference:"CHMUN 2025", committee:"UNSC",  country:"China" },
  { email:"d.unsc.india@accord.in",   password:"del123",       role:"delegate",    name:"Meera Pillai",            conference:"CHMUN 2025", committee:"UNSC",  country:"India" },
  { email:"chair.unhrc@accord.in",    password:"chair123",     role:"chair",       name:"Divya Menon",             conference:"CHMUN 2025", committee:"UNHRC", country:null },
  { email:"cochair.unhrc@accord.in",  password:"cochair123",   role:"cochair",     name:"Arjun Reddy",             conference:"CHMUN 2025", committee:"UNHRC", country:null },
  { email:"d.unhrc.ger@accord.in",    password:"del123",       role:"delegate",    name:"Ishaan Kapoor",           conference:"CHMUN 2025", committee:"UNHRC", country:"Germany" },
  { email:"d.unhrc.can@accord.in",    password:"del123",       role:"delegate",    name:"Pooja Rao",               conference:"CHMUN 2025", committee:"UNHRC", country:"Canada" },
  { email:"d.unhrc.aus@accord.in",    password:"del123",       role:"delegate",    name:"Karan Malhotra",          conference:"CHMUN 2025", committee:"UNHRC", country:"Australia" },
  { email:"chair.disec@accord.in",    password:"chair123",     role:"chair",       name:"Siddharth Roy",           conference:"CHMUN 2025", committee:"DISEC", country:null },
  { email:"cochair.disec@accord.in",  password:"cochair123",   role:"cochair",     name:"Tanvi Shah",              conference:"CHMUN 2025", committee:"DISEC", country:null },
  { email:"d.disec.india@accord.in",  password:"del123",       role:"delegate",    name:"Aditya Kumar",            conference:"CHMUN 2025", committee:"DISEC", country:"India" },
  { email:"d.disec.jpn@accord.in",    password:"del123",       role:"delegate",    name:"Shreya Nambiar",          conference:"CHMUN 2025", committee:"DISEC", country:"Japan" },
  { email:"d.disec.brz@accord.in",    password:"del123",       role:"delegate",    name:"Akash Tiwari",            conference:"CHMUN 2025", committee:"DISEC", country:"Brazil" },
  { email:"chair.ecosoc@accord.in",   password:"chair123",     role:"chair",       name:"Nandini Krishnan",        conference:"CHMUN 2025", committee:"ECOSOC",country:null },
  { email:"cochair.ecosoc@accord.in", password:"cochair123",   role:"cochair",     name:"Rahul Saxena",            conference:"CHMUN 2025", committee:"ECOSOC",country:null },
  { email:"d.eco.brz@accord.in",      password:"del123",       role:"delegate",    name:"Swati Bhatt",             conference:"CHMUN 2025", committee:"ECOSOC",country:"Brazil" },
  { email:"d.eco.mex@accord.in",      password:"del123",       role:"delegate",    name:"Dev Sharma",              conference:"CHMUN 2025", committee:"ECOSOC",country:"Mexico" },
];
// Intellectual Performance (IP) points are genuine: role points reflect the
// verified position someone actually holds this conference; performance
// points come only from an approved scorecard actually recorded in the app
// (delegateScores / scorecardStatuses), never from invented history.
const ROLE_BASE_POINTS = { president:60, gs:60, chair:45, cochair:40, host_school:25, school:25, delegate:20, admin:0 };
const AWARD_TIERS = [
  { min:90, label:"Best Delegate",        bg:"#fef3c7", c:"#92400e" },
  { min:75, label:"Outstanding Delegate", bg:"#e0e7ff", c:"#3730a3" },
  { min:60, label:"Honorable Mention",    bg:"#ecfdf5", c:"#047857" },
  { min:40, label:"Verbal Mention",       bg:"#eff6ff", c:"#1d4ed8" },
];
const awardForPct = (pct) => AWARD_TIERS.find(t=>pct>=t.min) || null;
const performancePoints = (pct) => Math.round(pct*0.8);
// Computes a delegate's genuine, approved-scorecard-based performance for a
// given conference's shared scorecard bundle (maxScores/delegateScores/scorecardStatuses).
function delegatePerformance(email, scorecardBundle) {
  const status = scorecardBundle?.scorecardStatuses?.[email];
  if (status !== "approved") return { evaluated:false, pct:0, points:0, award:null };
  const scores = scorecardBundle.delegateScores?.[email] || {};
  const max = scorecardBundle.maxScores || {};
  const total = OSM_CRITERIA.reduce((a,_,i)=>a+(parseFloat(scores[i])||0),0);
  const maxTotal = OSM_CRITERIA.reduce((a,_,i)=>a+(parseFloat(max[i])||10),0);
  const pct = maxTotal>0 ? Math.round((total/maxTotal)*100) : 0;
  return { evaluated:true, pct, points:performancePoints(pct), award:awardForPct(pct) };
}
const COMMITTEES = [
  { id:"unsc",  name:"UNSC",  fullName:"UN Security Council",              topic:"Nuclear Non-Proliferation",               country:"France",     conference:"CHMUN 2025" },
  { id:"unhrc", name:"UNHRC", fullName:"UN Human Rights Council",          topic:"Refugee Crisis & Stateless Persons",      country:"Germany",    conference:"CHMUN 2025" },
  { id:"disec", name:"DISEC", fullName:"Disarmament & International Sec.", topic:"Regulation of Autonomous Weapons",        country:"India",      conference:"CHMUN 2025" },
  { id:"ecosoc",name:"ECOSOC",fullName:"Economic & Social Council",        topic:"Sustainable Dev. in Post-Conflict Zones", country:"Brazil",     conference:"CHMUN 2025" },
  { id:"who",   name:"WHO",   fullName:"World Health Organisation",        topic:"Pandemic Preparedness",                   country:"Japan",      conference:"CHMUN 2025" },
  { id:"unodc", name:"UNODC", fullName:"UN Office on Drugs & Crime",       topic:"Combating Transnational Organised Crime", country:"Mexico",     conference:"CHMUN 2025" },
  { id:"unep",  name:"UNEP",  fullName:"UN Environment Programme",         topic:"Climate Finance & Loss and Damage",       country:"Kenya",      conference:"CHMUN 2025" },
  { id:"unhcr", name:"UNHCR", fullName:"UN High Commissioner for Refugees",topic:"Rohingya Crisis & Right of Return",       country:"Bangladesh", conference:"CHMUN 2025" },
  { id:"icj",   name:"ICJ",   fullName:"International Court of Justice",   topic:"Sovereignty vs. Humanitarian Intervention",country:"Netherlands",conference:"CHMUN 2025" },
  { id:"aippm", name:"AIPPM", fullName:"All India Political Parties Meet", topic:"Uniform Civil Code & Federal Structure",  country:"India",      conference:"CHMUN 2025" },
  { id:"ip",    name:"IP",    fullName:"International Press Corps",        topic:"Media Coverage & Freedom of the Press",   country:"USA",        conference:"CHMUN 2025" },
];
const CHANNEL_ACCESS = {
  "# general":        "view_general_ch",
  "# announcements":  "view_announcements_ch",
  "# working-papers": "view_working_papers_ch",
  "# position-papers":"view_working_papers_ch",
  "# off-topic":      "view_general_ch",
};
const PERMS = {
  view_conference_stats:  ["admin","president","gs"],
  manage_schools:         ["admin","president","gs","host_school"],
  send_message:           ["admin","president","gs","host_school","school","chair","cochair","delegate"],
  send_announcement:      ["admin","president","gs","chair"],
  delete_any_message:     ["admin","president","gs","chair"],
  view_working_papers_ch: ["admin","president","gs","chair","cochair","delegate"],
  view_announcements_ch:  ["admin","president","gs","host_school","school","chair","cochair","delegate"],
  view_general_ch:        ["admin","president","gs","host_school","school","chair","cochair","delegate"],
  control_speakers_list:  ["admin","president","gs","chair","cochair"],
  add_to_speakers_list:   ["admin","president","gs","chair","cochair"],
  view_speakers_list:     ["admin","president","gs","host_school","school","chair","cochair","delegate"],
  cast_vote:              ["chair","cochair"],
  view_live_votes:        ["admin","president","gs","chair","cochair"],
  initiate_voting:        ["admin","president","gs","chair"],
  access_voting:          ["admin","president","gs","chair","cochair"],
  fill_scorecard:         ["cochair"],
  submit_scorecard:       ["cochair"],
  approve_scorecard:      ["chair"],
  view_own_scorecard:     [],
  view_all_scorecards:    ["admin","president","gs","chair","cochair"],
  access_admin_panel:     ["admin"],
};
const can = (role, perm) => PERMS[perm]?.includes(role) ?? false;
const OSM_CRITERIA = ["Knowledge of portfolio","Diplomacy & negotiation","Speech quality","Resolution contribution","Points & motions","Overall conduct"];
const VOTING_OBJECTIVES = [
  {id:"rollcall",   label:"Roll Call",        icon:"🖐️", needsTitle:false, desc:"Establish quorum by recording each delegation's presence."},
  {id:"agenda",     label:"Agenda",           icon:"📋", needsTitle:true,  desc:"Vote to set the committee's agenda for debate."},
  {id:"resolution", label:"Resolution Draft", icon:"📜", needsTitle:true,  desc:"Formal vote on a submitted draft resolution."},
];
const VOTE_OPTIONS = {
  rollcall:   [{k:"present",l:"Present"},{k:"present_voting",l:"Present & Voting"},{k:"absent",l:"Absent"}],
  agenda:     [{k:"favor",l:"In Favour"},{k:"against",l:"Against"},{k:"abstain",l:"Abstain"}],
  resolution: [{k:"favor",l:"In Favour"},{k:"against",l:"Against"},{k:"abstain",l:"Abstain"}],
};
const ALFRED_SYSTEM = `You are Alfred Assistant, the official AI attaché of Accord — a professional Model United Nations platform. Speak with the formality of a senior UN diplomat. Never use casual language or contractions. Be calm, authoritative, and helpful. Expert in MUN rules of procedure, resolution drafting, points and motions, diplomatic protocol, country policy research. Default to SHORT sharp answers. Only provide detail when user says "explain", "elaborate", "in detail". Use bullet points for multi-part answers, numbered steps for procedures. Bold labels where meaningful. One idea per bullet.

ROLE-AWARE BEHAVIOUR — read the user's role carefully and adapt every response:
- Platform Admin: Address as "Administrator".
- President: Address as "Honourable President".
- General Secretary: Address as "Honourable General Secretary".
- Host Institution School / Participating School: Address as "Distinguished Representative".
- Chair: Address as "Honourable Chair". The Chair presides over committee sessions — assist with rules of procedure, managing debate, speakers list, motions, directives. Never treat the Chair as a delegate.
- Co-Chair: Address as "Distinguished Co-Chair". Assist with supporting the Chair, scorecard evaluation, speakers list management.
- Delegate: Address as "Honourable Delegate". Assist with position papers, resolution drafting, diplomatic language, points and motions, representing their country.`;

// ── THEME ──
const C = {
  bg:"#ffffff", bgSoft:"#f8f9fb", bgMuted:"#f1f3f7",
  border:"#e2e6ed", navy:"#0f2044", navyMid:"#1a3560", navyLight:"#e8edf5",
  gold:"#b8860b", text:"#0f2044", textSec:"#4b5e7a", textMuted:"#8496b0",
  green:"#065f46", greenBg:"#ecfdf5", greenTxt:"#047857",
  red:"#991b1b", redBg:"#fef2f2", redTxt:"#b91c1c",
  amber:"#92400e", amberBg:"#fffbeb", amberTxt:"#b45309",
  infoBg:"#eff6ff", infoTxt:"#1d4ed8",
};
const pill = (type) => {
  const m = { active:{bg:C.greenBg,c:C.greenTxt}, speaking:{bg:C.infoBg,c:C.infoTxt}, next:{bg:"#f5f3ff",c:"#6d28d9"}, queue:{bg:C.bgMuted,c:C.textMuted}, favor:{bg:C.greenBg,c:C.greenTxt}, against:{bg:C.redBg,c:C.redTxt}, abstain:{bg:C.amberBg,c:C.amberTxt}, present:{bg:C.greenBg,c:C.greenTxt}, present_voting:{bg:C.infoBg,c:C.infoTxt}, absent:{bg:C.redBg,c:C.redTxt}, pending:{bg:C.amberBg,c:C.amberTxt}, approved:{bg:C.greenBg,c:C.greenTxt}, locked:{bg:C.bgMuted,c:C.textMuted}, upcoming:{bg:C.amberBg,c:C.amberTxt} };
  const s = m[type]||{bg:C.bgMuted,c:C.textMuted};
  return { background:s.bg, color:s.c, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, display:"inline-block" };
};
const mkBtn = (type="default") => ({ padding:"8px 18px", borderRadius:6, fontSize:13, fontWeight:500, cursor:"pointer", border:"none", fontFamily:"system-ui",
  ...(type==="primary"?{background:C.navy,color:"#fff"}:type==="danger"?{background:C.red,color:"#fff"}:type==="success"?{background:C.green,color:"#fff"}:{background:C.bgMuted,color:C.text,border:`1px solid ${C.border}`})
});
const card = { background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:20, marginBottom:16 };
const cardTitle = { fontSize:11, fontWeight:700, color:C.textMuted, marginBottom:14, textTransform:"uppercase", letterSpacing:1.2 };
const inputSt = { background:C.bgSoft, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, padding:"10px 14px", fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"system-ui" };
const Lock = ({reason}) => (
  <div style={{background:C.bgSoft,border:`1px dashed ${C.border}`,borderRadius:10,padding:"50px 20px",textAlign:"center",color:C.textMuted}}>
    <div style={{fontSize:30,marginBottom:10}}>🔒</div>
    <div style={{fontWeight:600,fontSize:14,color:C.textSec,marginBottom:6}}>Access Restricted</div>
    <div style={{fontSize:13}}>{reason}</div>
  </div>
);

function TruncatedText({ text, maxLength=220, style, seeMoreStyle }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > maxLength;
  const display = (expanded || !isLong) ? text : text.slice(0,maxLength).trimEnd()+"…";
  return (
    <span style={style}>
      <span style={{whiteSpace:"pre-wrap"}}>{display}</span>
      {isLong && (
        <button onClick={()=>setExpanded(e=>!e)} style={{background:"none",border:"none",color:"#1d4ed8",fontWeight:600,fontSize:12,cursor:"pointer",padding:0,marginLeft:6,textDecoration:"underline",display:"inline",...seeMoreStyle}}>
          {expanded?"See less":"See more"}
        </button>
      )}
    </span>
  );
}

function AlfredMessage({ text }) {
  return (
    <div>
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} style={{height:4}}/>;
        const numBold  = t.match(/^(\d+)\.\s+\*\*(.+?)\*\*[:-]?\s*(.*)/);
        const numPlain = t.match(/^(\d+)\.\s+(.*)/);
        const bulBold  = t.match(/^[-*]\s+\*\*(.+?)\*\*[:-]?\s*(.*)/);
        const bulPlain = t.match(/^[-*]\s+(.*)/);
        const boldOnly = t.match(/^\*\*(.+?)\*\*:?\s*$/);
        if (numBold)  return <div key={i} style={{marginBottom:12}}><div style={{fontWeight:700,fontSize:13,color:C.navy}}>{numBold[1]}. {numBold[2]}</div>{numBold[3]&&<div style={{fontSize:13,color:C.text,lineHeight:1.7,paddingLeft:6,marginTop:2}}>{numBold[3]}</div>}</div>;
        if (numPlain) return <div key={i} style={{marginBottom:12}}><div style={{fontWeight:700,fontSize:13,color:C.navy}}>{numPlain[1]}. {numPlain[2]}</div></div>;
        if (bulBold)  return <div key={i} style={{marginBottom:12}}><div style={{fontWeight:700,fontSize:13,color:C.navy}}>• {bulBold[1]}</div>{bulBold[2]&&<div style={{fontSize:13,color:C.text,lineHeight:1.7,paddingLeft:12,marginTop:2}}>{bulBold[2]}</div>}</div>;
        if (bulPlain) return <div key={i} style={{marginBottom:12}}><div style={{fontWeight:700,fontSize:13,color:C.navy}}>• {bulPlain[1]}</div></div>;
        if (boldOnly) return <div key={i} style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:12}}>{boldOnly[1]}</div>;
        const parts = t.split(/\*\*(.+?)\*\*/g);
        return <div key={i} style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:6}}>{parts.map((p,j)=>j%2===1?<strong key={j} style={{color:C.navy}}>{p}</strong>:p)}</div>;
      })}
    </div>
  );
}

function SpeakerTimer({ canControl, speakers, setSpeakers, speakerTime, setSpeakerTime, timerRunning, setTimerRunning }) {
  const [customMin, setCustomMin] = useState(1);
  const [customSec, setCustomSec] = useState(30);
  const [totalDuration, setTotalDuration] = useState(90);
  const [showSettings, setShowSettings] = useState(false);
  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const pct = Math.max(0, Math.min(100, (speakerTime/totalDuration)*100));
  const timerColor = speakerTime>totalDuration*0.33?C.green:speakerTime>totalDuration*0.11?C.gold:C.red;
  const PRESETS = [{label:"30 sec",s:30},{label:"1 min",s:60},{label:"90 sec",s:90},{label:"2 min",s:120},{label:"3 min",s:180},{label:"5 min",s:300}];
  const applyCustom = () => { const s=(parseInt(customMin)||0)*60+(parseInt(customSec)||0); const total=s>0?s:30; setTotalDuration(total); setSpeakerTime(total); setTimerRunning(false); };
  const handlePreset = (s) => { setTotalDuration(s); setSpeakerTime(s); setCustomMin(Math.floor(s/60)); setCustomSec(s%60); setTimerRunning(false); };
  const handleReset = () => { setTimerRunning(false); setSpeakerTime(totalDuration); };
  const handleNext = () => { setSpeakers(s=>s.length>1?s.slice(1):[]); setSpeakerTime(totalDuration); setTimerRunning(false); };

  return (
    <div style={{textAlign:"center",padding:"8px 0"}}>
      <div style={{fontSize:13,color:C.textMuted,marginBottom:4}}>Now speaking</div>
      <div style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:16}}>{speakers.length>0?`Delegate – ${speakers[0].country}`:"No speaker"}</div>
      <div style={{position:"relative",width:160,height:160,margin:"0 auto 20px"}}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke={C.bgMuted} strokeWidth="8"/>
          <circle cx="80" cy="80" r="70" fill="none" stroke={timerColor} strokeWidth="8" strokeDasharray={`${2*Math.PI*70}`} strokeDashoffset={`${2*Math.PI*70*(1-pct/100)}`} strokeLinecap="round" transform="rotate(-90 80 80)" style={{transition:"stroke-dashoffset 0.5s linear,stroke 0.5s"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontSize:36,fontWeight:700,color:timerColor,fontVariantNumeric:"tabular-nums",letterSpacing:2}}>{fmtTime(speakerTime)}</div>
          {speakerTime===0&&<div style={{fontSize:11,color:C.red,fontWeight:600,marginTop:2}}>Time's up!</div>}
        </div>
      </div>
      {canControl?(
        <div>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:14}}>
            <button style={mkBtn(timerRunning?"danger":"success")} onClick={()=>setTimerRunning(!timerRunning)}>{timerRunning?"⏸ Pause":"▶ Start"}</button>
            <button style={mkBtn()} onClick={handleReset}>↺ Reset</button>
            <button style={mkBtn("primary")} onClick={handleNext}>⏭ Next</button>
            <button onClick={()=>setShowSettings(!showSettings)} style={{...mkBtn(),padding:"8px 12px",background:showSettings?C.navyLight:"",color:showSettings?C.navy:"",border:`1px solid ${showSettings?C.navy:C.border}`}}>⚙</button>
          </div>
          {showSettings&&(
            <div style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:10,padding:16,textAlign:"left"}}>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:1,marginBottom:8}}>QUICK PRESETS</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {PRESETS.map(p=>(<button key={p.s} onClick={()=>handlePreset(p.s)} style={{...mkBtn(totalDuration===p.s?"primary":"default"),padding:"5px 12px",fontSize:12}}>{p.label}</button>))}
                </div>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:1,marginBottom:8}}>CUSTOM DURATION</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{flex:1}}><div style={{fontSize:10,color:C.textMuted,marginBottom:4,textAlign:"center"}}>Minutes</div><input type="number" min={0} max={59} value={customMin} onChange={e=>setCustomMin(Math.max(0,parseInt(e.target.value)||0))} style={{...inputSt,textAlign:"center",fontSize:18,fontWeight:700,padding:"8px 4px"}}/></div>
                  <div style={{fontSize:22,color:C.textMuted,paddingTop:16}}>:</div>
                  <div style={{flex:1}}><div style={{fontSize:10,color:C.textMuted,marginBottom:4,textAlign:"center"}}>Seconds</div><input type="number" min={0} max={59} value={customSec} onChange={e=>setCustomSec(Math.max(0,Math.min(59,parseInt(e.target.value)||0)))} style={{...inputSt,textAlign:"center",fontSize:18,fontWeight:700,padding:"8px 4px"}}/></div>
                  <button onClick={applyCustom} style={{...mkBtn("primary"),marginTop:18,padding:"9px 16px",fontSize:12,flexShrink:0}}>Set</button>
                </div>
              </div>
              <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
                <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:1,marginBottom:8}}>EXTEND / REDUCE TIME</div>
                <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                  {[-30,-15,15,30].map(d=>(<button key={d} onClick={()=>setSpeakerTime(t=>Math.max(0,t+d))} style={{...mkBtn(d>0?"success":"danger"),padding:"5px 12px",fontSize:12}}>{d>0?`+${d}s`:`${d}s`}</button>))}
                </div>
              </div>
            </div>
          )}
        </div>
      ):(
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 18px"}}>
          <span style={{fontSize:16}}>🔒</span><span style={{fontSize:13,color:C.textSec,fontWeight:500}}>Timer controlled by Chair / Co-Chair</span>
        </div>
      )}
    </div>
  );
}

function AdminPanel({ knowledgeNotes, setKnowledgeNotes, conferences, setConferences, adminSchools, setAdminSchools }) {
  const [adminTab, setAdminTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(typeof window!=="undefined" ? window.innerWidth<=760 : false);
  useEffect(()=>{
    if(typeof window==="undefined")return;
    const onResize=()=>setIsMobile(window.innerWidth<=760);
    window.addEventListener("resize",onResize);
    return ()=>window.removeEventListener("resize",onResize);
  },[]);
  const [showNewConf, setShowNewConf] = useState(false);
  const [newConf, setNewConf] = useState({name:"",venue:""});
  const [managedConf, setManagedConf] = useState(null);
  const [viewingConf, setViewingConf] = useState(null);
  const [participantSearch, setParticipantSearch] = useState("");
  const [adminUsers, setAdminUsers] = useState(DEMO_ACCOUNTS.map((a,i)=>({...a,id:i+1,status:"active"})));
  const [userSearch, setUserSearch] = useState("");
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({name:"",email:"",role:"delegate",committee:"",country:"",conference:""});
  const [showNewSchool, setShowNewSchool] = useState(false);
  const [newSchool, setNewSchool] = useState({name:"",city:"",delegates:"",conference:""});
  const visibleConferences = conferences;
  const visibleUsers = adminUsers;
  const visibleSchools = adminSchools;
  const committeesCountFor = (confName) => new Set(adminUsers.filter(u=>u.conference===confName && u.committee).map(u=>u.committee)).size;
  const delegatesCountFor  = (confName) => adminUsers.filter(u=>u.conference===confName && u.role==="delegate").length;
  const schoolsCountFor    = (confName) => adminSchools.filter(s=>s.conference===confName).length;
  const [activityLog, setActivityLog] = useState([
    {id:1,text:"New school registered: St. Mary's Convent",time:"2m ago", type:"school"},
    {id:2,text:"DR-1.2 passed in UNSC – HMUN",            time:"15m ago",type:"vote"},
  ]);
  const logAction = (text, type) => setActivityLog(l=>[{id:Date.now(),text,time:"just now",type},...l]);
  const [showNewKnowledgeNote, setShowNewKnowledgeNote] = useState(false);
  const [knowledgeNoteInput, setKnowledgeNoteInput] = useState({title:"",text:""});
  const [editingKnowledgeId, setEditingKnowledgeId] = useState(null);
  const [knowledgeDeleteConfirm, setKnowledgeDeleteConfirm] = useState(null);
  const openNewKnowledgeNote = () => { setKnowledgeNoteInput({title:"",text:""}); setEditingKnowledgeId(null); setShowNewKnowledgeNote(true); };
  const editKnowledgeNote = (n) => { setKnowledgeNoteInput({title:n.title,text:n.text}); setEditingKnowledgeId(n.id); setShowNewKnowledgeNote(true); };
  const saveKnowledgeNote = () => {
    if (!knowledgeNoteInput.title.trim()) return;
    if (editingKnowledgeId) {
      setKnowledgeNotes(ns=>ns.map(n=>n.id===editingKnowledgeId?{...n,title:knowledgeNoteInput.title.trim(),text:knowledgeNoteInput.text,updatedAt:"Provided by Admin"}:n));
      logAction(`Professional note updated: ${knowledgeNoteInput.title.trim()}`,"score");
    } else {
      setKnowledgeNotes(ns=>[{id:Date.now(),title:knowledgeNoteInput.title.trim(),text:knowledgeNoteInput.text,updatedAt:"Provided by Admin"},...ns]);
      logAction(`New professional note published: ${knowledgeNoteInput.title.trim()}`,"score");
    }
    setShowNewKnowledgeNote(false); setKnowledgeNoteInput({title:"",text:""}); setEditingKnowledgeId(null);
  };
  const deleteKnowledgeNote = (id) => { const n=knowledgeNotes.find(x=>x.id===id); setKnowledgeNotes(ns=>ns.filter(x=>x.id!==id)); setKnowledgeDeleteConfirm(null); if(n)logAction(`Professional note removed: ${n.title}`,"score"); };
  const adminTabs = [{k:"overview",l:"Overview"},{k:"conferences",l:"Conferences"},{k:"users",l:"Users"},{k:"schools",l:"Schools"},{k:"knowledge",l:"Professional Notes"},{k:"activity",l:"Activity Log"}];

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:20,borderBottom:`1px solid ${C.border}`,paddingBottom:12}}>
        {adminTabs.map(t=>(<button key={t.k} onClick={()=>setAdminTab(t.k)} style={{padding:"7px 18px",borderRadius:7,border:`1px solid ${adminTab===t.k?C.navy:C.border}`,background:adminTab===t.k?C.navy:C.bg,color:adminTab===t.k?"#fff":C.textSec,fontFamily:"system-ui",fontSize:13,fontWeight:adminTab===t.k?600:400,cursor:"pointer"}}>{t.l}</button>))}
      </div>
      {adminTab==="overview"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[{l:"Active Conferences",v:visibleConferences.filter(c=>c.status==="active").length,color:C.navy},{l:"Total Delegates",v:visibleConferences.reduce((a,c)=>a+delegatesCountFor(c.name),0),color:C.green},{l:"Schools",v:visibleSchools.length,color:C.gold},{l:"Registered Users",v:visibleUsers.length,color:"#6d28d9"}].map(s=>(
              <div key={s.l} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"18px 20px"}}><div style={{fontSize:28,fontWeight:700,color:s.color}}>{s.v}</div><div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{s.l}</div></div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
            <div style={card}><div style={cardTitle}>Conferences</div>{visibleConferences.map(c=>(<div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${C.border}`}}><div><div style={{fontWeight:600,fontSize:13,color:C.navy}}>{c.name} — {c.venue}</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{committeesCountFor(c.name)} committees · {delegatesCountFor(c.name)} delegates · Code: <span style={{fontFamily:"monospace",fontWeight:700,color:C.navy}}>{c.code||"—"}</span></div></div><span style={pill(c.status)}>{c.status==="active"?"Active":"Upcoming"}</span></div>))}</div>
            <div style={card}><div style={cardTitle}>Recent Activity</div>{activityLog.slice(0,5).map(a=>(<div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:13,color:C.text}}>{a.text}</span><span style={{fontSize:11,color:C.textMuted,whiteSpace:"nowrap",marginLeft:12}}>{a.time}</span></div>))}</div>
          </div>
        </div>
      )}
      {adminTab==="conferences"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}><div style={{fontWeight:700,fontSize:16,color:C.navy}}>All Conferences</div><button onClick={()=>setShowNewConf(true)} style={mkBtn("primary")}>+ New Conference</button></div>
          {visibleConferences.map(c=>(
            <div key={c.id} style={{...card,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:isMobile?"flex-start":"center",flexWrap:"wrap",gap:12}}>
                <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:15,color:C.navy}}>{c.name} <span style={{fontWeight:400,fontSize:13,color:C.textMuted}}>— {c.venue}</span></div><div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:6,background:C.navyLight,borderRadius:6,padding:"3px 10px"}}><span style={{fontSize:10,fontWeight:700,color:C.navy,letterSpacing:0.6}}>MUN CODE</span><span style={{fontSize:13,fontWeight:700,color:C.navy,letterSpacing:1,fontFamily:"monospace"}}>{c.code||"—"}</span></div><div style={{display:"flex",gap:20,marginTop:10,flexWrap:"wrap"}}>{[{l:"Committees",v:committeesCountFor(c.name)},{l:"Delegates",v:delegatesCountFor(c.name)},{l:"Schools",v:schoolsCountFor(c.name)}].map(s=>(<div key={s.l}><div style={{fontSize:20,fontWeight:700,color:C.navy}}>{s.v}</div><div style={{fontSize:11,color:C.textMuted}}>{s.l}</div></div>))}</div></div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",width:isMobile?"100%":"auto"}}>
                  <span style={pill(c.status)}>{c.status==="active"?"Active":"Upcoming"}</span>
                  <button onClick={()=>{setViewingConf(c);setParticipantSearch("");}} style={{...mkBtn(),padding:"6px 14px",fontSize:12}}>Participants</button>
                  <button onClick={()=>setManagedConf({...c})} style={{...mkBtn(),padding:"6px 14px",fontSize:12}}>Edit</button>
                  <button onClick={()=>{setConferences(cs=>cs.map(x=>x.id===c.id?{...x,status:x.status==="active"?"upcoming":"active"}:x));logAction(`Conference ${c.status==="active"?"suspended":"activated"}: ${c.name}`,"conf");}} style={{...mkBtn(c.status==="active"?"danger":"success"),padding:"6px 14px",fontSize:12}}>{c.status==="active"?"Suspend":"Activate"}</button>
                  <button onClick={()=>{setConferences(cs=>cs.filter(x=>x.id!==c.id));logAction(`Conference deleted: ${c.name}`,"conf");}} style={{...mkBtn("danger"),padding:"6px 10px",fontSize:12}}>✕</button>
                </div>
              </div>
            </div>
          ))}
          {showNewConf&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:"#fff",borderRadius:12,padding:"28px 32px",width:420,maxWidth:"92vw",boxShadow:"0 16px 48px rgba(0,0,0,0.2)",fontFamily:"system-ui"}}>
                <div style={{fontWeight:700,fontSize:17,color:C.navy,marginBottom:20}}>Create New Conference</div>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:16,lineHeight:1.6}}>Committees, delegates, and schools counts are calculated automatically from the users and schools you register under this conference — no need to enter them here.</div>
                {[{l:"Conference Name",k:"name",ph:"e.g. BMUN 2025"},{l:"Venue / City",k:"venue",ph:"e.g. Bangalore"}].map(f=>(
                  <div key={f.k} style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:6,letterSpacing:0.5}}>{f.l.toUpperCase()}</label><input value={newConf[f.k]} onChange={e=>setNewConf(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inputSt}/></div>
                ))}
                <div style={{display:"flex",gap:10,marginTop:8}}>
                  <button onClick={()=>setShowNewConf(false)} style={{...mkBtn(),flex:1}}>Cancel</button>
                  <button onClick={()=>{if(!newConf.name||!newConf.venue)return;const code=generateMunCode(conferences.map(c=>c.code));setConferences(cs=>[...cs,{id:Date.now(),name:newConf.name,venue:newConf.venue,status:"upcoming",code}]);logAction(`New conference created: ${newConf.name} – ${newConf.venue} (MUN Code: ${code})`,"conf");setNewConf({name:"",venue:""});setShowNewConf(false);}} style={{...mkBtn("primary"),flex:1}}>Create</button>
                </div>
              </div>
            </div>
          )}
          {managedConf&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:"#fff",borderRadius:12,padding:"28px 32px",width:420,maxWidth:"92vw",boxShadow:"0 16px 48px rgba(0,0,0,0.2)",fontFamily:"system-ui"}}>
                <div style={{fontWeight:700,fontSize:17,color:C.navy,marginBottom:20}}>Edit Conference</div>
                {[{l:"Name",k:"name"},{l:"Venue",k:"venue"}].map(f=>(
                  <div key={f.k} style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:5,letterSpacing:0.5}}>{f.l.toUpperCase()}</label><input value={managedConf[f.k]} onChange={e=>setManagedConf(p=>({...p,[f.k]:e.target.value}))} style={inputSt}/></div>
                ))}
                <div style={{display:"flex",gap:16,margin:"12px 0 4px",padding:"10px 12px",background:C.bgSoft,borderRadius:8}}>
                  {[{l:"Committees",v:committeesCountFor(managedConf.name)},{l:"Delegates",v:delegatesCountFor(managedConf.name)},{l:"Schools",v:schoolsCountFor(managedConf.name)}].map(s=>(<div key={s.l}><div style={{fontSize:16,fontWeight:700,color:C.navy}}>{s.v}</div><div style={{fontSize:10,color:C.textMuted}}>{s.l}</div></div>))}
                </div>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:14}}>These counts update automatically as users and schools are registered — rename above won't affect existing participants until their records are updated too.</div>
                <div style={{display:"flex",gap:10,marginTop:16}}>
                  <button onClick={()=>setManagedConf(null)} style={{...mkBtn(),flex:1}}>Cancel</button>
                  <button onClick={()=>{setConferences(cs=>cs.map(c=>c.id===managedConf.id?{...managedConf}:c));logAction(`Conference updated: ${managedConf.name}`,"conf");setManagedConf(null);}} style={{...mkBtn("primary"),flex:1}}>Save Changes</button>
                </div>
              </div>
            </div>
          )}
          {viewingConf&&(()=>{
            const participants = adminUsers.filter(u=>u.conference===viewingConf.name).filter(u=>!participantSearch||u.name.toLowerCase().includes(participantSearch.toLowerCase())||u.email.toLowerCase().includes(participantSearch.toLowerCase())||u.role.toLowerCase().includes(participantSearch.toLowerCase())||(u.committee||"").toLowerCase().includes(participantSearch.toLowerCase()));
            const grouped = {};
            participants.forEach(p=>{ const key=p.committee||"General / Secretariat"; (grouped[key]=grouped[key]||[]).push(p); });
            const groupNames = Object.keys(grouped).sort((a,b)=>a==="General / Secretariat"?-1:b==="General / Secretariat"?1:a.localeCompare(b));
            return (
              <div onClick={()=>setViewingConf(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,padding:"26px 30px",width:560,maxWidth:"92vw",maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 16px 48px rgba(0,0,0,0.25)",fontFamily:"system-ui"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div><div style={{fontWeight:700,fontSize:17,color:C.navy}}>{viewingConf.name}</div><div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{viewingConf.venue} · Code: <span style={{fontFamily:"monospace",fontWeight:700,color:C.navy}}>{viewingConf.code||"—"}</span></div></div>
                    <button onClick={()=>setViewingConf(null)} style={{background:"none",border:"none",color:C.textMuted,fontSize:20,cursor:"pointer",lineHeight:1,padding:0}}>×</button>
                  </div>
                  <div style={{fontSize:12,color:C.textMuted,margin:"10px 0 12px"}}>{participants.length} participant{participants.length===1?"":"s"} across {groupNames.length} committee{groupNames.length===1?"":"s"}</div>
                  <input value={participantSearch} onChange={e=>setParticipantSearch(e.target.value)} placeholder="Search by name, email, role or committee..." style={{...inputSt,marginBottom:14}}/>
                  <div style={{overflowY:"auto",flex:1,paddingRight:4}}>
                    {groupNames.length===0&&<div style={{textAlign:"center",padding:30,color:C.textMuted,fontSize:13}}>No participants match.</div>}
                    {groupNames.map(g=>(
                      <div key={g} style={{marginBottom:18}}>
                        <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.8,textTransform:"uppercase",marginBottom:8,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>{g} <span style={{fontWeight:400}}>({grouped[g].length})</span></div>
                        {grouped[g].map(p=>{
                          const r=ROLES.find(x=>x.id===p.role);
                          return (
                            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                              <div><div style={{fontWeight:600,fontSize:13,color:C.navy}}>{p.name}{p.country?<span style={{fontWeight:400,color:C.textMuted}}> — {p.country}</span>:null}</div><div style={{fontSize:11,color:C.textMuted,marginTop:1}}>{p.email}</div></div>
                              <span style={{...pill(""),background:r?.bg,color:r?.color,fontSize:10,flexShrink:0,marginLeft:10}}>{r?.label||p.role}</span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      {adminTab==="users"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
            <input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search by name, email or role..." style={{...inputSt,maxWidth:320,flex:"1 1 220px"}}/>
            <button onClick={()=>setShowNewUser(true)} style={mkBtn("primary")}>+ Add User</button>
          </div>
          <div style={{...card,padding:0,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:C.bgSoft,borderBottom:`2px solid ${C.border}`}}>{["Name","Email","Role","Committee","Conference","Status","Actions"].map(h=>(<th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.8,whiteSpace:"nowrap"}}>{h}</th>))}</tr></thead>
              <tbody>
                {visibleUsers.filter(u=>!userSearch||u.name.toLowerCase().includes(userSearch.toLowerCase())||u.email.toLowerCase().includes(userSearch.toLowerCase())||u.role.includes(userSearch.toLowerCase())).map(u=>{
                  const r=ROLES.find(x=>x.id===u.role);
                  return (
                    <tr key={u.id} style={{borderBottom:`1px solid ${C.border}`}}>
                      <td style={{padding:"10px 14px",fontWeight:600,color:C.navy}}>{u.name}</td>
                      <td style={{padding:"10px 14px",color:C.textSec,fontSize:12}}>{u.email}</td>
                      <td style={{padding:"10px 14px"}}><span style={{...pill(""),background:r?.bg,color:r?.color,fontSize:10}}>{u.role}</span></td>
                      <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12}}>{u.committee||"—"}</td>
                      <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12}}>{u.conference||"—"}</td>
                      <td style={{padding:"10px 14px"}}><span style={pill(u.status==="active"?"active":"locked")}>{u.status}</span></td>
                      <td style={{padding:"10px 14px"}}><div style={{display:"flex",gap:6}}><button onClick={()=>{setAdminUsers(us=>us.map(x=>x.id===u.id?{...x,status:x.status==="active"?"suspended":"active"}:x));logAction(`User ${u.status==="active"?"suspended":"restored"}: ${u.name}`,"user");}} style={{...mkBtn(u.status==="active"?"danger":"success"),padding:"3px 10px",fontSize:11}}>{u.status==="active"?"Suspend":"Restore"}</button><button onClick={()=>{setAdminUsers(us=>us.filter(x=>x.id!==u.id));logAction(`User removed: ${u.name}`,"user");}} style={{...mkBtn("danger"),padding:"3px 8px",fontSize:11}}>✕</button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
          {showNewUser&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:"#fff",borderRadius:12,padding:"28px 32px",width:420,maxWidth:"92vw",boxShadow:"0 16px 48px rgba(0,0,0,0.2)",fontFamily:"system-ui"}}>
                <div style={{fontWeight:700,fontSize:17,color:C.navy,marginBottom:20}}>Add New User</div>
                {[{l:"Full Name",k:"name",ph:"e.g. Rahul Sharma"},{l:"Email",k:"email",ph:"e.g. rahul@accord.in"},{l:"Committee",k:"committee",ph:"e.g. UNSC"},{l:"Country / Portfolio",k:"country",ph:"e.g. France"}].map(f=>(
                  <div key={f.k} style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:5,letterSpacing:0.5}}>{f.l.toUpperCase()}</label><input value={newUser[f.k]} onChange={e=>setNewUser(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inputSt}/></div>
                ))}
                <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:5,letterSpacing:0.5}}>ROLE</label><select value={newUser.role} onChange={e=>setNewUser(p=>({...p,role:e.target.value}))} style={{...inputSt,background:"#fff"}}>{ROLES.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}</select></div>
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:5,letterSpacing:0.5}}>CONFERENCE</label>
                  <select value={newUser.conference} onChange={e=>setNewUser(p=>({...p,conference:e.target.value}))} style={{...inputSt,background:"#fff"}}>
                    <option value="">Select conference...</option>
                    {conferences.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setShowNewUser(false)} style={{...mkBtn(),flex:1}}>Cancel</button>
                  <button onClick={()=>{if(!newUser.name||!newUser.email||!newUser.conference)return;setAdminUsers(us=>[...us,{...newUser,id:Date.now(),password:"accord123",status:"active"}]);logAction(`New user added: ${newUser.name} (${newUser.role})`,"user");setNewUser({name:"",email:"",role:"delegate",committee:"",country:"",conference:""});setShowNewUser(false);}} style={{...mkBtn("primary"),flex:1}}>Add User</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {adminTab==="schools"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div style={{fontWeight:700,fontSize:16,color:C.navy}}>Registered Schools</div>
            <button onClick={()=>setShowNewSchool(true)} style={mkBtn("primary")}>+ Add School</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
            {visibleSchools.map(s=>(
              <div key={s.id} style={{...card,marginBottom:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div style={{fontWeight:600,fontSize:14,color:C.navy,flex:1,marginRight:8}}>{s.name}</div><span style={pill(s.status==="verified"?"active":"pending")}>{s.status}</span></div>
                <div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>{s.city} · {s.delegates} delegates</div>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>{s.conference}</div>
                <div style={{display:"flex",gap:6}}>
                  {s.status==="pending"?<button onClick={()=>{setAdminSchools(sc=>sc.map(x=>x.id===s.id?{...x,status:"verified"}:x));logAction(`School verified: ${s.name}`,"school");}} style={{...mkBtn("success"),padding:"5px 12px",fontSize:11,flex:1}}>Verify</button>:<button onClick={()=>{setAdminSchools(sc=>sc.map(x=>x.id===s.id?{...x,status:"pending"}:x));logAction(`School verification revoked: ${s.name}`,"school");}} style={{...mkBtn("danger"),padding:"5px 12px",fontSize:11,flex:1}}>Revoke</button>}
                  <button onClick={()=>{setAdminSchools(sc=>sc.filter(x=>x.id!==s.id));logAction(`School removed: ${s.name}`,"school");}} style={{...mkBtn("danger"),padding:"5px 10px",fontSize:11}}>✕</button>
                </div>
              </div>
            ))}
          </div>
          {showNewSchool&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:"#fff",borderRadius:12,padding:"28px 32px",width:420,maxWidth:"92vw",boxShadow:"0 16px 48px rgba(0,0,0,0.2)",fontFamily:"system-ui"}}>
                <div style={{fontWeight:700,fontSize:17,color:C.navy,marginBottom:20}}>Add New School</div>
                {[{l:"School Name",k:"name",ph:"e.g. St. Xavier's School"},{l:"City",k:"city",ph:"e.g. Mumbai"},{l:"Expected Delegates",k:"delegates",ph:"e.g. 10"}].map(f=>(
                  <div key={f.k} style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:6,letterSpacing:0.5}}>{f.l.toUpperCase()}</label><input value={newSchool[f.k]} onChange={e=>setNewSchool(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={inputSt}/></div>
                ))}
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:6,letterSpacing:0.5}}>CONFERENCE</label>
                  <select value={newSchool.conference} onChange={e=>setNewSchool(p=>({...p,conference:e.target.value}))} style={{...inputSt,background:"#fff"}}>
                    <option value="">Select conference...</option>
                    {conferences.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",gap:10,marginTop:8}}>
                  <button onClick={()=>{setShowNewSchool(false);setNewSchool({name:"",city:"",delegates:"",conference:""});}} style={{...mkBtn(),flex:1}}>Cancel</button>
                  <button onClick={()=>{if(!newSchool.name.trim()||!newSchool.city.trim()||!newSchool.conference)return;setAdminSchools(sc=>[...sc,{id:Date.now(),name:newSchool.name.trim(),city:newSchool.city.trim(),delegates:parseInt(newSchool.delegates)||0,status:"pending",conference:newSchool.conference}]);logAction(`New school registered: ${newSchool.name.trim()}`,"school");setNewSchool({name:"",city:"",delegates:"",conference:""});setShowNewSchool(false);}} style={{...mkBtn("primary"),flex:1}}>Add School</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {adminTab==="knowledge"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div><div style={{fontWeight:700,fontSize:16,color:C.navy}}>Professional Notes</div><div style={{fontSize:12,color:C.textMuted,marginTop:2}}>Key MUN knowledge published to every user's Professional's Notes page.</div></div>
            <button onClick={openNewKnowledgeNote} style={mkBtn("primary")}>+ Add Note</button>
          </div>
          {knowledgeNotes.length===0&&<div style={{...card,textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>No professional notes published yet.</div>}
          {knowledgeNotes.map(n=>(
            <div key={n.id} style={{...card,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:15,color:C.navy}}>{n.title}</div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button onClick={()=>editKnowledgeNote(n)} style={{...mkBtn(),padding:"4px 10px",fontSize:11}}>Edit</button>
                  <button onClick={()=>setKnowledgeDeleteConfirm(n.id)} style={{...mkBtn("danger"),padding:"4px 10px",fontSize:11}}>Delete</button>
                </div>
              </div>
              <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>{n.text?<TruncatedText text={n.text} maxLength={260}/>:<span style={{color:C.textMuted,fontStyle:"italic"}}>No content</span>}</div>
            </div>
          ))}
          {showNewKnowledgeNote&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:"#fff",borderRadius:12,padding:"28px 32px",width:460,maxWidth:"92vw",boxShadow:"0 16px 48px rgba(0,0,0,0.2)",fontFamily:"system-ui"}}>
                <div style={{fontWeight:700,fontSize:17,color:C.navy,marginBottom:20}}>{editingKnowledgeId?"Edit Professional Note":"New Professional Note"}</div>
                <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:6,letterSpacing:0.5}}>TITLE</label><input value={knowledgeNoteInput.title} onChange={e=>setKnowledgeNoteInput(p=>({...p,title:e.target.value}))} placeholder="e.g. Rules of Procedure — Overview" style={inputSt}/></div>
                <div style={{marginBottom:18}}><label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:6,letterSpacing:0.5}}>CONTENT</label><textarea value={knowledgeNoteInput.text} onChange={e=>setKnowledgeNoteInput(p=>({...p,text:e.target.value}))} placeholder="Key knowledge every delegate/chair should have..." style={{...inputSt,height:160,resize:"vertical",lineHeight:1.6,fontFamily:"system-ui"}}/></div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>{setShowNewKnowledgeNote(false);setEditingKnowledgeId(null);}} style={{...mkBtn(),flex:1}}>Cancel</button>
                  <button onClick={saveKnowledgeNote} style={{...mkBtn("primary"),flex:1}}>{editingKnowledgeId?"Save Changes":"Publish Note"}</button>
                </div>
              </div>
            </div>
          )}
          {knowledgeDeleteConfirm&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:"#fff",borderRadius:12,padding:"28px 32px",width:340,maxWidth:"92vw",boxShadow:"0 16px 48px rgba(0,0,0,0.2)",fontFamily:"system-ui",textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:12}}>🗑️</div>
                <div style={{fontWeight:700,fontSize:16,color:C.navy,marginBottom:8}}>Delete this professional note?</div>
                <div style={{fontSize:13,color:C.textMuted,marginBottom:24,lineHeight:1.6}}>It will be removed from every user's Professional's Notes page.</div>
                <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                  <button onClick={()=>setKnowledgeDeleteConfirm(null)} style={{...mkBtn(),padding:"9px 22px"}}>Cancel</button>
                  <button onClick={()=>deleteKnowledgeNote(knowledgeDeleteConfirm)} style={{...mkBtn("danger"),padding:"9px 22px"}}>Yes, Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {adminTab==="activity"&&(
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={cardTitle}>Platform Activity Log</div><button onClick={()=>setActivityLog([])} style={{...mkBtn("danger"),padding:"5px 12px",fontSize:12}}>Clear Log</button></div>
          {activityLog.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:C.textMuted,fontSize:13}}>No activity recorded.</div>}
          {activityLog.map(a=>{
            const icons={school:"🏫",vote:"🗳️",ai:"🤖",score:"📊",user:"👤",conf:"🏛️"};
            return (<div key={a.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}><div style={{width:34,height:34,borderRadius:"50%",background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icons[a.type]||"📌"}</div><div style={{flex:1,fontSize:13,color:C.text}}>{a.text}</div><div style={{fontSize:11,color:C.textMuted,whiteSpace:"nowrap"}}>{a.time}</div></div>);
          })}
        </div>
      )}
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [ssoModal, setSsoModal] = useState("");
  const [ssoLoading, setSsoLoading] = useState("");

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    setTimeout(() => {
      const acc = DEMO_ACCOUNTS.find(a => a.email.trim().toLowerCase() === email.trim().toLowerCase() && a.password === password);
      if (acc) onLogin(acc);
      else { setError("Invalid email or password."); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f2044 0%,#1a3560 50%,#0f2044 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{width:54,height:54,background:"rgba(255,255,255,0.1)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",border:"1px solid rgba(255,255,255,0.15)"}}><span style={{color:"#fff",fontSize:26,fontFamily:"Georgia,serif",fontWeight:700}}>A</span></div>
        <div style={{fontSize:28,fontWeight:700,color:"#fff",fontFamily:"Georgia,serif"}}>Accord</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:4}}>Model United Nations Platform</div>
      </div>
      <div style={{background:"#fff",borderRadius:14,padding:"32px 36px",width:"100%",maxWidth:420,boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
        <div>
        <div style={{fontWeight:700,fontSize:20,color:C.navy,marginBottom:4,fontFamily:"Georgia,serif"}}>Sign in to your account</div>
        <div style={{fontSize:13,color:C.textMuted,marginBottom:24}}>Enter credentials provided by your MUN secretariat.</div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {["google","microsoft"].map(provider=>(
            <button key={provider} onClick={()=>setSsoModal(provider)} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,width:"100%",padding:"10px",borderRadius:7,border:`1px solid ${C.border}`,background:"#fff",cursor:"pointer",fontSize:13,fontWeight:500,color:C.text}}>
              {provider==="google"?<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.08-6.08C34.42 3.09 29.5 1 24 1 14.82 1 7.07 6.48 3.64 14.27l7.08 5.5C12.4 13.59 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.43c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.58C43.16 37.26 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.72 28.23A14.5 14.5 0 0 1 9.5 24c0-1.47.25-2.9.72-4.23l-7.08-5.5A23.94 23.94 0 0 0 0 24c0 3.86.92 7.5 2.55 10.72l8.17-6.49z"/><path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.48-4.94l-7.19-5.58c-1.82 1.22-4.14 1.95-6.29 1.95-6.3 0-11.6-4.09-13.28-9.77l-8.17 6.49C7.07 41.52 14.82 47 24 47z"/></svg>:<svg width="18" height="18" viewBox="0 0 21 21"><rect x="0" y="0" width="10" height="10" fill="#F25022"/><rect x="11" y="0" width="10" height="10" fill="#7FBA00"/><rect x="0" y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>}
              Continue with {provider==="google"?"Google":"Microsoft"}
            </button>
          ))}
        </div>
        {ssoModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{background:"#fff",borderRadius:14,padding:"28px 32px",width:400,maxWidth:"92vw",maxHeight:"80vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(0,0,0,0.25)"}}>
              <div style={{textAlign:"center",marginBottom:20}}><div style={{fontWeight:700,fontSize:17,color:"#111"}}>Sign in with {ssoModal==="google"?"Google":"Microsoft"}</div><div style={{fontSize:12,color:"#6b7280",marginTop:4}}>Choose a demo account to continue</div></div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {DEMO_ACCOUNTS.slice(0,10).map((a,idx)=>{
                  const r=ROLES.find(x=>x.id===a.role);
                  const initials=a.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
                  const pal=["#EA4335","#4285F4","#34A853","#FBBC05","#1e40af","#6d28d9","#065f46","#92400e","#991b1b","#0369a1"];
                  return (
                    <button key={a.email} onClick={()=>{setSsoLoading(a.email);setTimeout(()=>{onLogin(a);setSsoModal("");setSsoLoading("");},800);}} disabled={!!ssoLoading} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",border:`1px solid ${ssoLoading===a.email?"#4285F4":C.border}`,borderRadius:10,background:ssoLoading===a.email?"#eff6ff":"#fff",cursor:"pointer",textAlign:"left"}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:pal[idx%pal.length],color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{initials}</div>
                      <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:"#111"}}>{a.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{a.email}</div></div>
                      <span style={{...pill(""),background:r?.bg,color:r?.color,fontSize:10}}>{r?.label}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={()=>{setSsoModal("");setSsoLoading("");}} style={{marginTop:14,width:"100%",padding:"9px",borderRadius:7,border:`1px solid ${C.border}`,background:C.bgSoft,color:C.text,fontSize:13,cursor:"pointer"}}>Cancel</button>
            </div>
          </div>
        )}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:12,color:C.textMuted}}>or sign in with email</span><div style={{flex:1,height:1,background:C.border}}/></div>
        <div onSubmit={handleLogin}>
          <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:600,color:C.textSec,display:"block",marginBottom:6,letterSpacing:0.5}}>EMAIL ADDRESS</label><input type="text" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&document.getElementById("accord-pass")?.focus()} placeholder="yourname@accord.in" style={{...inputSt,background:"#fff",border:`1px solid ${error?C.red:C.border}`}} autoFocus autoComplete="username"/></div>
          <div style={{marginBottom:10}}>
            <label style={{fontSize:12,fontWeight:600,color:C.textSec,display:"block",marginBottom:6,letterSpacing:0.5}}>PASSWORD</label>
            <div style={{position:"relative"}}>
              <input id="accord-pass" type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Enter your password" style={{...inputSt,background:"#fff",border:`1px solid ${error?C.red:C.border}`,paddingRight:44}} autoComplete="current-password"/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.textMuted}}>{showPass?"🙈":"👁"}</button>
            </div>
          </div>
          {error&&<div style={{background:C.redBg,color:C.redTxt,borderRadius:7,padding:"10px 14px",fontSize:13,marginBottom:14,border:"1px solid #fecaca"}}>{error}</div>}
          <button type="button" onClick={handleLogin} disabled={loading} style={{...mkBtn("primary"),width:"100%",padding:"11px",fontSize:14,marginTop:6,opacity:loading?0.7:1}}>{loading?"Signing in...":"Sign In"}</button>
        </div>
        <div style={{marginTop:18,paddingTop:18,borderTop:`1px solid ${C.border}`}}>
          <button onClick={()=>setShowHint(!showHint)} style={{background:"none",border:"none",color:C.textMuted,fontSize:12,cursor:"pointer",textDecoration:"underline"}}>{showHint?"Hide demo credentials":"View demo credentials"}</button>
          {showHint&&(
            <div style={{marginTop:10,background:C.bgSoft,borderRadius:8,padding:12,fontSize:11,lineHeight:2,maxHeight:180,overflowY:"auto"}}>
              {[
                {r:"admin",e:"admin@accord.in",p:"admin123"},
                {r:"president",e:"president@accord.in",p:"president123"},
                {r:"gs",e:"gs@accord.in",p:"gs123"},
                {r:"chair",e:"chair.unsc@accord.in",p:"chair123"},
                {r:"cochair",e:"cochair.unsc@accord.in",p:"cochair123"},
                {r:"delegate",e:"d.unsc.france@accord.in",p:"del123"},
              ].map(a=>(
                <div key={a.r} style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{background:ROLES.find(r=>r.id===a.r)?.bg,color:ROLES.find(r=>r.id===a.r)?.color,borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:600,minWidth:70}}>{a.r}</span>
                  <span style={{color:C.textSec}}>{a.e}</span><span style={{color:C.textMuted}}>/ {a.p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
      <div style={{marginTop:20,fontSize:12,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>© 2025 Accord · Model United Nations Platform</div>
    </div>
  );
}

// Shared, cross-user state backed by the artifact's persistent storage API.
// Loads once on mount / whenever `key` changes, saves local changes back to
// storage, and polls periodically so changes made by other people viewing
// the same published app are picked up here too.
function useSharedState(key, initialValue, pollMs=4000) {
  const [value, setValue] = useState(initialValue);
  const [synced, setSynced] = useState(false);
  const skipNextSave = useRef(false);
  const lastSaved = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setSynced(false);
    (async () => {
      if (!key || typeof window === "undefined" || !window.storage) { if(!cancelled) setSynced(true); return; }
      try {
        const r = await window.storage.get(key, true);
        if (!cancelled && r) {
          const remote = JSON.parse(r.value);
          skipNextSave.current = true;
          lastSaved.current = r.value;
          setValue(remote);
        }
      } catch { /* key doesn't exist yet, or storage unavailable — start fresh */ }
      if (!cancelled) setSynced(true);
    })();
    return () => { cancelled = true; };
  }, [key]);

  useEffect(() => {
    if (!synced || !key || typeof window === "undefined" || !window.storage) return;
    if (skipNextSave.current) { skipNextSave.current = false; return; }
    const serialized = JSON.stringify(value);
    if (serialized === lastSaved.current) return;
    lastSaved.current = serialized;
    (async () => { try { await window.storage.set(key, serialized, true); } catch { /* best-effort */ } })();
  }, [value, synced, key]);

  useEffect(() => {
    if (!key || typeof window === "undefined" || !window.storage) return;
    const id = setInterval(async () => {
      try {
        const r = await window.storage.get(key, true);
        if (r && r.value !== lastSaved.current) {
          const remote = JSON.parse(r.value);
          lastSaved.current = r.value;
          skipNextSave.current = true;
          setValue(remote);
        }
      } catch { /* nothing published yet */ }
    }, pollMs);
    return () => clearInterval(id);
  }, [key, pollMs]);

  return [value, setValue];
}

export default function App() {
  const [user, setUser] = useState(null);
  const [hasEnteredMUN, setHasEnteredMUN] = useState(false);
  const [profileView, setProfileView] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeCommittee, setActiveCommittee] = useState("unsc");
  const [viewConference, setViewConference] = useState("");
  const role = user?.role || "delegate";
  const lvl = ROLE_LEVELS[role];
  const currentRole = ROLES.find(r => r.id === role);
  const committee = COMMITTEES.find(c => c.id === activeCommittee) || COMMITTEES[0];
  const userCommitteeName = user?.committee || "";
  const isPlatformAdmin = role === "admin";
  const canSwitchScope = lvl <= 4;
  const effectiveConference = isPlatformAdmin ? (viewConference || user?.conference || "") : (user?.conference || "");
  const conferenceCommittees = COMMITTEES.filter(c => c.conference === effectiveConference);
  const [activeChannel, setActiveChannel] = useState("# general");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useSharedState(effectiveConference?`accord:chat:${effectiveConference}`:"", [
    {id:1,role:"chair",label:"Chair",text:"All delegates please submit your position papers by 5 PM.",time:"09:12",channel:"# announcements"},
    {id:2,role:"delegate",label:"Delegate – France",text:"France fully supports the resolution on non-proliferation.",time:"09:15",channel:"# general"},
  ]);
  const [speakers, setSpeakers] = useState([{country:"France",status:"speaking"},{country:"Germany",status:"next"},{country:"India",status:"queue"}]);
  const [speakerTime, setSpeakerTime] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const votingKey = effectiveConference && committee ? `accord:voting:${effectiveConference}:${committee.name}` : "";
  const [votingBundle, setVotingBundle] = useSharedState(votingKey, {votingBooth:null, votingHistory:[], votes:[]});
  const votingBooth = votingBundle.votingBooth;
  const votingHistory = votingBundle.votingHistory;
  const votes = votingBundle.votes;
  const setVotingBooth = (u) => setVotingBundle(b => ({...b, votingBooth: typeof u==="function" ? u(b.votingBooth) : u}));
  const setVotingHistory = (u) => setVotingBundle(b => ({...b, votingHistory: typeof u==="function" ? u(b.votingHistory) : u}));
  const setVotes = (u) => setVotingBundle(b => ({...b, votes: typeof u==="function" ? u(b.votes) : u}));
  const [showNewBooth, setShowNewBooth] = useState(false);
  const [newBoothInput, setNewBoothInput] = useState({objective:"rollcall",title:""});
  const scorecardKey = effectiveConference ? `accord:scorecards:${effectiveConference}` : "";
  const [scorecardBundle, setScorecardBundle] = useSharedState(scorecardKey, {
    maxScores: Object.fromEntries(OSM_CRITERIA.map((_,i)=>[i,10])),
    delegateScores: {}, delegateRemarks: {}, scorecardStatuses: {},
  });
  const maxScores = scorecardBundle.maxScores;
  const delegateScores = scorecardBundle.delegateScores;
  const delegateRemarks = scorecardBundle.delegateRemarks;
  const scorecardStatuses = scorecardBundle.scorecardStatuses;
  const setMaxScores = (u) => setScorecardBundle(b => ({...b, maxScores: typeof u==="function" ? u(b.maxScores) : u}));
  const setDelegateScores = (u) => setScorecardBundle(b => ({...b, delegateScores: typeof u==="function" ? u(b.delegateScores) : u}));
  const setDelegateRemarks = (u) => setScorecardBundle(b => ({...b, delegateRemarks: typeof u==="function" ? u(b.delegateRemarks) : u}));
  const setScorecardStatuses = (u) => setScorecardBundle(b => ({...b, scorecardStatuses: typeof u==="function" ? u(b.scorecardStatuses) : u}));
  const [selectedDelegate, setSelectedDelegate] = useState(null);
  const [showDelegateDialog, setShowDelegateDialog] = useState(false);
  const [allAlfredMsgs, setAllAlfredMsgs] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [alfredInput, setAlfredInput] = useState("");
  const [alfredLoading, setAlfredLoading] = useState(false);
  const [alfredPendingFiles, setAlfredPendingFiles] = useState([]);
  const [clockTab, setClockTab] = useState("clock");
  const [now, setNow] = useState(new Date());
  const [timerInput, setTimerInput] = useState({h:"0",m:"5",s:"0"});
  const [timerLabel, setTimerLabel] = useState("");
  const [timerSec, setTimerSec] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [alarmInput, setAlarmInput] = useState({time:"",label:"",repeat:false});
  const [alarmFired, setAlarmFired] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window!=="undefined" ? window.innerWidth<=760 : false);
  const [committeeSidebarOpen, setCommitteeSidebarOpen] = useState(false);
  const [allNotes, setAllNotes] = useState({});
  const [noteInput, setNoteInput] = useState({title:"",text:""});
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteDeleteConfirm, setNoteDeleteConfirm] = useState(null);
  const [knowledgeNotes, setKnowledgeNotes] = useSharedState("accord:knowledge-notes", [
    {id:1,title:"Points & Motions — Quick Reference",text:"Point of Order: raise a procedural error.\nPoint of Personal Privilege: comfort/audibility issue.\nPoint of Parliamentary Inquiry: ask the Chair about procedure.\nMotion to move into Moderated/Unmoderated Caucus: requires topic, total time, speaking time.\nMotion to introduce a Draft Resolution/Amendment: requires signatories.",updatedAt:"Provided by Admin"},
    {id:2,title:"Structuring a Position Paper",text:"1. Committee background and the issue at hand.\n2. Your country's stance, policies, and past actions.\n3. Proposed solutions consistent with your country's foreign policy.\nKeep it concise — one page per topic is standard.",updatedAt:"Provided by Admin"},
    {id:3,title:"MUN Rules of Procedure",text:"PROCEDURE FOR CONFERENCE SESSIONS\n\nReporting Time\n- Delegates must arrive by the designated reporting time for registration and preparation.\n\nOpening Remarks\n- Principal's Opening Speech: The principal welcomes the delegates and gives an introductory speech.\n- Chairs' Opening Speech: The chairs briefly introduce themselves and explain the purpose of the session.\n\nSession Commencement\n- Distribution of the Rule Sheet: Ensure all delegates receive the rule sheet containing essential guidelines for the session.\n- Explanation of Rules by the Chair: The chair provides a brief overview of the key rules for the session, such as speaking time, motions, and decorum.\n\nRoll Call\n- The chair conducts a roll call to confirm the presence of delegates.\n- Delegates who are present should respond when their country is called.\n\nAgenda Setting\n- The chair presents 2-3 suggested agendas for the session.\n- Delegates are then invited to propose their own agenda items.\n- The proposed agendas are arranged by priority through voting. The agenda with the highest priority will be debated first.\n\nSetting Speakers List\n- The speakers list is set before opening speeches begin.\n\nPosition Papers Submission & Opening Speeches\n- Delegates are asked to submit their position papers for review.\n- The chair will call delegates alphabetically to deliver their opening speeches.\n\nCaucus Requests\n- Ask for motions.\n- If delegates request an Unmoderated Caucus, the chair may decline if it is too early in the session. The decision will be made with the goal of ensuring smooth progress in the debates.\n- If delegates request a Moderated Caucus, the chair will decide whether it is appropriate based on the context and the flow of the session.\n\nOpening Speakers' List\n- If there are no motions, start the debate according to the speakers' list.\n- The chair opens the speakers' list, where delegates can request to speak by raising their placard.\n- Delegates are added to the list in the order in which they raise their placard.\n\nMotions\n- The chair regularly asks, \"Are there any motions on the floor?\"\n- If a delegate raises their placard to make a motion, the chair will address the motion according to the session's guidelines.\n- If the motion requires a vote, it will be conducted as per the rules.\n\nDebate\n- Commence Debate: If no motions are on the floor, the chair begins the debate on the highest-priority agenda item.\n- Speakers' List: Delegates are called to speak in the order they appear on the speakers' list.\n- Time Management: The chair allocates a specific amount of time for debate and sets individual speaking times for each delegate. A timer is used to ensure adherence to time limits.\n- The chair will monitor the debate and ensure smooth flow by managing speaking time and facilitating discussion.\n\nOngoing Motion Check\n- Throughout the session, the chair will periodically ask if there are any motions on the floor.\n- Motions will be handled efficiently while keeping the session's focus and smoothness in mind.\n- The chair will intervene when necessary to maintain order and smooth debate flow.",updatedAt:"Provided by Admin"},
    {id:4,title:"Introduction",text:"Good morning, respected dignitaries, distinguished speakers, dedicated organizers, and valued participants.\n\n\"As the Chairperson of the [COMMITTEE NAME], I, [NAME], lead the council alongside our capable Vice-Chairs, [NAME] and [NAME].\"\n\nWe extend our best wishes for a productive and insightful Model UN session filled with high-level debate and fruitful collaboration.\n\nCHAIR'S SPEECH\n\nEsteemed members of the Security Council, distinguished representatives —\n\nWe convene today to deliberate on the most solemn and urgent duty of this Council: the maintenance of international peace and security, concerning the various ongoing conflicts all over the world. The world watches, waiting for us to turn our shared responsibility into meaningful action.\n\nOur objective is not merely a pause in the fighting, but the establishment of peace. I urge all members to engage constructively, with a firm commitment to finding a path forward that reflects our guiding themes of one world, one peace, equality, and sustainability. The stakes are too high for anything less.\n\nTherefore, I call this meeting to order.\n\nThe Agendas are: [agenda of your respective committee]",updatedAt:"Provided by Admin"},
    {id:5,title:"Key Phrases",text:"POINT OF ORDER\n\nRaised when a delegate believes the rules of procedure are being violated. The Chair rules on it immediately.\n\nThe Chair will reject or overrule the point if:\n- The point is incorrect: no actual breach of the rules occurred.\n- The point is trivial or dilatory: a minor issue, or being used to delay proceedings.\n- The point is raised improperly: it addresses substance/debate rather than procedure (that would instead be a Point of Parliamentary Inquiry or Point of Information).\n\nPhrases to reject a Point of Order — Direct:\n- \"The Chair rules the point of order not well taken.\"\n- \"Your point is overruled.\"\n- \"The Chair finds the point is not well founded.\"\n- \"The Chair rules that the procedure is correct.\"\n- \"That is not a violation of the rules of procedure.\"\n\nPhrases to reject a Point of Order — Explanatory:\n- \"The delegate is not speaking to a matter of procedure; the point is therefore out of order.\"\n- \"The current action is in compliance with the rules; the point is therefore not sustained.\"\n- \"That is an issue for a Point of Parliamentary Inquiry, not a Point of Order. Your point is not sustained.\"\n- \"The Chair is not prepared to rule on this matter as a violation of the rules. The point is overruled.\"\n(\"Not well taken\" is the classic parliamentary term for rejecting a Point of Order.)\n\nMOTIONS\n\nReasons a Chair might reject or discourage a motion:\n- Time management: the committee is behind schedule.\n- Repetitiveness: the sub-topic's main viewpoints are exhausted.\n- Need for informal discussion: the committee needs to shift to an Unmoderated Caucus to draft resolutions.\n- Improper procedure: incorrectly phrased, exceeds allowed limits, or raised at the wrong time.\n\nRejecting as out of order:\n- \"The motion for an extension is out of order at this time, as the floor is still open for other motions.\"\n- \"That motion is not in compliance with the total time limits established in our Rules of Procedure.\"\n- \"This moderated caucus has already been extended once; therefore, the motion for an additional extension is out of order.\"\n\nEncouraging the committee to move on:\n- \"The Chair appreciates the motion, but notes that discussion on this sub-topic has become largely repetitive. The floor is open for a motion for a different kind of caucus.\"\n- \"The Chair encourages delegates to consider whether an Unmoderated Caucus might be more productive at this stage to translate discussed ideas into a working paper.\"\n- \"The Chair observes that time is of the essence. Are there any motions to move directly to a new sub-topic or an Unmoderated Caucus?\"\n\nPutting it to a vote while signalling a preference:\n- \"All those in favor of extending this caucus, please raise your placards... All those against, please raise your placards... The motion fails. We will return to the Speakers List.\"\n\nTIME\n\nReasons a Chair might refuse or reduce requested time:\n- Too early in debate — delegates need more formal discussion first.\n- Excessive time requested relative to the session.\n- Need for structure — a Moderated Caucus may be needed before working groups.\n- Exceeds the Rules of Procedure's maximum time limit.\n- Deemed dilatory or repetitive.\n\nProposing a reduction:\n- \"The Chair recognizes the need for an Unmoderated Caucus, but suggests a total time of 10 minutes would be more appropriate. Does the delegate accept the amendment to their motion?\"\n- \"In the interest of time management, the Chair proposes an amendment to 15 minutes. Does the committee accept this friendly amendment?\"\n- \"The Chair rules the motion for 30 minutes out of order as it exceeds the established maximum. The motion is in order for a duration of 20 minutes.\"\n\nRuling the motion out of order:\n- \"The Chair thanks the delegate for the motion, but rules it out of order at this time. The committee has not yet heard sufficient discussion on the topic.\"\n- \"That motion is not in order as the committee has just concluded an Unmoderated Caucus. We will return to the Speakers List.\"\n- \"The Chair would prefer to entertain a motion for a Moderated Caucus at this juncture to discuss the newly introduced working paper.\"\nNote: if a motion is in order and seconded, the Chair is generally obligated to put it to a vote — the Chair's framing simply tends to influence how the committee votes.\n\nKEY PHRASES — VICE CHAIR / CO-CHAIR\n\nOpening and Roll Call:\n- \"Thank you, Honourable Chair. The Co-Chair notes that a quorum is established.\"\n- \"The Co-Chair will now conduct Roll Call. Please respond with 'Present' or 'Present and Voting' when your country is called.\"\n- \"The floor is now open for a motion to open the Speakers List.\"\n\nManaging the Speakers List (GSL):\n- \"The Co-Chair recognizes the delegate from [Country] for a time of one minute and thirty seconds.\"\n- \"The delegate from [Country] is reminded to confine their remarks to the topic currently under discussion.\"\n- \"The delegate has yielded their time to the Chair. Thank you, delegate.\"\n- \"The Co-Chair will now ask for any delegates wishing to be added to the General Speakers List to raise their placards.\"\n\nEntertaining and responding to motions:\n- \"The floor is now open to points and motions. Are there any such points or motions?\"\n- \"The delegate from [Country], you are recognized. Please state your motion and its parameters.\"\n- \"Thank you, delegate. The motion for [Motion] is in order / out of order.\"\n- \"There has been a motion for [Motion]. Are there any seconds to the motion?\"\n- \"The Chair rules this motion out of order as it is dilatory / violates the established Rules of Procedure / is redundant at this time.\"\n\nDirecting debate and voting:\n- \"Seeing both seconds and objections, the committee will now move into a procedural vote on the motion for [Motion].\"\n- \"Delegates are reminded that abstentions are not in order on procedural votes.\"\n- \"All those in favor of the motion, please raise your placards now.\"\n- \"The motion passes with [Number] votes in favor and [Number] votes against. We will now proceed into a [Caucus/Vote].\"\n\nMaintaining decorum and order:\n- \"Decorum! Delegates are requested to maintain professional conduct.\"\n- \"The Co-Chair reminds delegates that note-passing should be kept to committee business.\"\n- \"The delegate from [Country] is reminded to stay germane to the motion/topic at hand.\"\n- \"The Co-Chair will now address the Point of Parliamentary Inquiry. The delegate is correct/incorrect; the rules state...\"\n\nManaging the Dais / Head Chair transition:\n- \"Honourable Chair, does the dais have a position on the proposed time limit?\"\n- \"Honourable Chair, the current Speakers List has five speakers remaining.\"\n- \"Thank you, delegates. The Dais has determined that we will entertain one more moderated caucus before moving to a Working Paper presentation.\"\n\nMOST COMMON CHAIR PHRASES\n\nOpening and Roll Call:\n- \"I now call this session of the [Committee Name] to order.\"\n- \"Will all delegates please respond to Roll Call with 'Present' or 'Present and Voting.'\"\n- \"With quorum established, we may now proceed to the first order of business.\"\n- \"The floor is open for a motion to set the agenda.\"\n\nManaging debate flow:\n- \"The Chair would look favorably upon a motion to open the General Speakers List.\"\n- \"The Chair recognizes the delegate from [Country].\"\n- \"The speaking time for the General Speakers List is set at one minute and thirty seconds.\"\n- \"The delegate has yielded their time to the Chair.\"\n- \"The delegate has yielded their time to points of information; are there any such points on the floor?\"\n\nHandling motions and caucuses:\n- \"The motion for a [Moderated/Unmoderated Caucus] on [Subtopic] is in order.\"\n- \"Are there any seconds to the motion? Are there any objections?\"\n- \"The motion passes with majority/two-thirds support.\"\n- \"The motion fails. We will now return to the General Speakers List.\"\n- \"Delegates, the time for the caucus has elapsed. Please return to your seats.\"\n\nProcedure and decorum:\n- \"The Chair recognizes the delegate on a Point of Order.\"\n- \"The Point of Order is well-taken / not well-taken.\"\n- \"Decorum! Delegates, the Chair calls for silence for the speaker.\"\n- \"The delegate is reminded to confine their remarks to the topic at hand.\"\n- \"The Chair rules that motion out of order.\"\n\nVoting procedure and adjournment:\n- \"We will now enter Voting Procedure on Draft Resolution [Number]. All points and motions are out of order.\"\n- \"All those in favor of the resolution, please raise your placards now.\"\n- \"The resolution passes / fails.\"\n- \"The Chair would look favorably upon a motion to adjourn the committee.\"\n- \"The session of the [Committee Name] is now adjourned.\" ",updatedAt:"Provided by Admin"},
  ]);
  const [conferences, setConferences] = useSharedState("accord:conferences", [
    {id:1,name:"HMUN 2025",  venue:"Mumbai",  status:"active",  code:"48213"},
    {id:2,name:"DULMUN 2025",venue:"Delhi",   status:"active",  code:"77591"},
    {id:3,name:"CHMUN 2025", venue:"Bilaspur",status:"active",  code:"30924"},
  ]);
  const [adminSchools, setAdminSchools] = useSharedState("accord:admin-schools", [
    {id:1,name:"St. Xavier's School",   city:"Mumbai",  delegates:10,status:"verified",conference:"CHMUN 2025"},
    {id:2,name:"DPS Raipur",            city:"Raipur",  delegates:8, status:"verified",conference:"CHMUN 2025"},
    {id:3,name:"Bilaspur Public School",city:"Bilaspur",delegates:6, status:"pending", conference:"CHMUN 2025"},
  ]);

  const speakerRef = useRef(null);
  const customTimerRef = useRef(null);
  const alfredEnd = useRef(null);


  const makeWelcome = (name) => ({role:"assistant",text:`Good day, ${name}. I am Alfred, your Accord AI Assistant. How may I assist you today?`});
  const alfredMsgs = user ? (allAlfredMsgs[user.email]||[makeWelcome(user.name)]) : [];
  const setAlfredMsgs = (updater) => {
    if (!user) return;
    setAllAlfredMsgs(prev => { const cur=prev[user.email]||[makeWelcome(user.name)]; const updated=typeof updater==="function"?updater(cur):updater; return {...prev,[user.email]:updated}; });
  };
  const clearAlfredChat = () => { setAlfredMsgs([makeWelcome(user.name)]); setShowClearConfirm(false); };

  const myNotes = user ? (allNotes[user.email] || []) : [];
  const setMyNotes = (updater) => {
    if (!user) return;
    setAllNotes(prev => { const cur=prev[user.email]||[]; const updated=typeof updater==="function"?updater(cur):updater; return {...prev,[user.email]:updated}; });
  };
  const saveNote = () => {
    if (!noteInput.title.trim() && !noteInput.text.trim()) return;
    if (editingNoteId) {
      setMyNotes(ns => ns.map(n => n.id===editingNoteId ? {...n,title:noteInput.title.trim()||"Untitled note",text:noteInput.text,updatedAt:new Date().toLocaleString([],{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"short"})} : n));
    } else {
      setMyNotes(ns => [{id:Date.now(),title:noteInput.title.trim()||"Untitled note",text:noteInput.text,updatedAt:new Date().toLocaleString([],{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"short"})}, ...ns]);
    }
    setNoteInput({title:"",text:""});
    setEditingNoteId(null);
  };
  const editNote = (n) => { setNoteInput({title:n.title,text:n.text}); setEditingNoteId(n.id); };
  const cancelNoteEdit = () => { setNoteInput({title:"",text:""}); setEditingNoteId(null); };
  const deleteNote = (id) => { setMyNotes(ns => ns.filter(n=>n.id!==id)); setNoteDeleteConfirm(null); if(editingNoteId===id) cancelNoteEdit(); };

  useEffect(() => {
    const t = setInterval(() => {
      const n=new Date(); setNow(n);
      const hhmm=`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
      if (n.getSeconds()===0) setAlarms(prev=>prev.map(a=>{if(!a.enabled||a.time!==hhmm)return a;setAlarmFired(a);return{...a,enabled:a.repeat};}));
    },1000);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(timerRunning){speakerRef.current=setInterval(()=>setSpeakerTime(t=>{if(t<=1){clearInterval(speakerRef.current);setTimerRunning(false);return 0;}return t-1;}),1000);}
    else clearInterval(speakerRef.current);
    return()=>clearInterval(speakerRef.current);
  },[timerRunning]);

  useEffect(()=>{
    if(timerActive){customTimerRef.current=setInterval(()=>setTimerSec(s=>{if(s<=1){clearInterval(customTimerRef.current);setTimerActive(false);setTimerFinished(true);return 0;}return s-1;}),1000);}
    else clearInterval(customTimerRef.current);
    return()=>clearInterval(customTimerRef.current);
  },[timerActive]);

  useEffect(()=>{alfredEnd.current?.scrollIntoView({behavior:"smooth"});},[alfredMsgs]);

  const accessibleChannels=Object.entries(CHANNEL_ACCESS).filter(([,p])=>can(role,p)).map(([ch])=>ch);
  useEffect(()=>{if(user&&!accessibleChannels.includes(activeChannel))setActiveChannel(accessibleChannels[0]||"");},[role]);

  useEffect(()=>{
    if(typeof window==="undefined")return;
    const onResize=()=>setIsMobile(window.innerWidth<=760);
    window.addEventListener("resize",onResize);
    return ()=>window.removeEventListener("resize",onResize);
  },[]);
  useEffect(()=>{ if(user) setViewConference(user.conference); },[user?.email]);
  useEffect(()=>{
    if(!user||canSwitchScope)return;
    const own=COMMITTEES.find(c=>c.name===user.committee);
    if(own)setActiveCommittee(own.id);
  },[user?.email]);
  useEffect(()=>{
    if(!user||!canSwitchScope)return;
    const opts=COMMITTEES.filter(c=>c.conference===effectiveConference);
    if(opts.length&&!opts.find(c=>c.id===activeCommittee))setActiveCommittee(opts[0].id);
  },[effectiveConference]);

  const applyTimerInput=()=>{const s=(parseInt(timerInput.h)||0)*3600+(parseInt(timerInput.m)||0)*60+(parseInt(timerInput.s)||0);setTimerSec(s>0?s:60);setTimerFinished(false);setTimerActive(false);};
  const fmtTimer=s=>`${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const timerTotal=()=>(parseInt(timerInput.h)||0)*3600+(parseInt(timerInput.m)||0)*60+(parseInt(timerInput.s)||0)||300;
  const timerPct=()=>Math.max(0,Math.min(100,(timerSec/timerTotal())*100));
  const timerColor2=timerSec>60?C.green:timerSec>15?C.gold:C.red;
  const addAlarm=()=>{if(!alarmInput.time)return;setAlarms(a=>[...a,{id:Date.now(),time:alarmInput.time,label:alarmInput.label||"Alarm",repeat:alarmInput.repeat,enabled:true}]);setAlarmInput({time:"",label:"",repeat:false});};

  const votingObjective = votingBooth ? VOTING_OBJECTIVES.find(o=>o.id===votingBooth.objective) : null;
  const openNewBoothModal = () => { setNewBoothInput({objective:"rollcall",title:""}); setShowNewBooth(true); };
  const startVotingBooth = () => {
    const obj = VOTING_OBJECTIVES.find(o=>o.id===newBoothInput.objective);
    if (obj.needsTitle && !newBoothInput.title.trim()) return;
    if (votingBooth && !votingBooth.open) setVotingHistory(h=>[{...votingBooth, finalVotes:votes}, ...h]);
    const committeeDelegates = DEMO_ACCOUNTS.filter(a=>a.role==="delegate" && a.committee===committee.name);
    setVotes(committeeDelegates.map(d=>({country:d.country,vote:null})));
    setVotingBooth({id:Date.now(), objective:obj.id, title:obj.needsTitle?newBoothInput.title.trim():null, open:true, createdAt:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});
    setShowNewBooth(false);
    setNewBoothInput({objective:"rollcall",title:""});
  };
  const closeVotingBooth = () => { if (votingBooth) setVotingBooth(b=>({...b,open:false,closedAt:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})); };

  const sendMsg=()=>{
    if(!chatInput.trim())return;
    if(activeChannel==="# announcements"&&!can(role,"send_announcement"))return;
    if(!can(role,"send_message"))return;
    setMessages(m=>[...m,{id:Date.now(),role,label:currentRole.label,text:chatInput.trim(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),channel:activeChannel}]);
    setChatInput("");
  };

  const attachmentKind = (file) => file.type.startsWith("image/") ? "image" : file.type==="application/pdf" ? "pdf" : "other";
  const readFileAsAttachment = (file) => new Promise(resolve=>{
    const kind = attachmentKind(file);
    if (kind==="other") { resolve({id:Date.now()+Math.random(), name:file.name, size:file.size, type:file.type, kind, base64:null, url:null}); return; }
    const reader = new FileReader();
    reader.onload = ev => { const dataUrl=ev.target.result; resolve({id:Date.now()+Math.random(), name:file.name, size:file.size, type:file.type, kind, base64:dataUrl.split(",")[1], url:kind==="image"?dataUrl:null}); };
    reader.readAsDataURL(file);
  });
  const addAlfredAttachments = async (fileList) => {
    const files = Array.from(fileList||[]);
    if (!files.length) return;
    const attachments = await Promise.all(files.map(readFileAsAttachment));
    setAlfredPendingFiles(p=>[...p,...attachments]);
  };
  const removeAlfredPending = (id) => setAlfredPendingFiles(p=>p.filter(f=>f.id!==id));

  const sendAlfred=async()=>{
    if((!alfredInput.trim()&&alfredPendingFiles.length===0)||alfredLoading)return;
    const userText=alfredInput.trim();
    const filesToSend=alfredPendingFiles;
    setAlfredInput("");setAlfredPendingFiles([]);
    setAlfredMsgs(m=>[...m,{role:"user",text:userText,files:filesToSend.length?filesToSend:undefined}]);setAlfredLoading(true);
    try{
      const history=alfredMsgs.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text||"(sent an attachment)"}));
      const sysWithContext = `${ALFRED_SYSTEM}\n\nCURRENT USER CONTEXT:\n- Name: ${user.name}\n- Role: ${currentRole.label}\n- Committee: ${user.committee||"N/A"}\n- Country/Portfolio: ${user.country||"N/A"}\n- Conference: ${user.conference}`;
      const contentBlocks=[];
      filesToSend.forEach(f=>{
        if(f.kind==="image")contentBlocks.push({type:"image",source:{type:"base64",media_type:f.type,data:f.base64}});
        else if(f.kind==="pdf")contentBlocks.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:f.base64}});
      });
      const otherNames=filesToSend.filter(f=>f.kind==="other").map(f=>f.name);
      let finalText=userText;
      if(otherNames.length)finalText=(finalText?finalText+"\n\n":"")+`Attached file(s) I could not render for you directly: ${otherNames.join(", ")}. Please advise based on the filename(s) and our conversation context.`;
      if(!finalText&&contentBlocks.length===0)finalText="(no message)";
      if(finalText)contentBlocks.push({type:"text",text:finalText});
      const userContent = (contentBlocks.length===1&&contentBlocks[0].type==="text") ? contentBlocks[0].text : contentBlocks;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,system:sysWithContext,messages:[...history,{role:"user",content:userContent}]})});
      const data=await res.json();
      const reply=data.content?.map(b=>b.text||"").join("")||"I am unable to process that request.";
      setAlfredMsgs(m=>[...m,{role:"assistant",text:reply}]);
    }catch{setAlfredMsgs(m=>[...m,{role:"assistant",text:"I am experiencing a connection issue. Please try again shortly."}]);}
    setAlfredLoading(false);
  };

  if (!user) return <LoginPage conferences={conferences} onLogin={u=>{setUser(u);setActiveTab("dashboard");setHasEnteredMUN(u.role==="admin");}}/>;

  if (!hasEnteredMUN) {
    if (profileView) {
      const myPerf = role==="delegate" ? delegatePerformance(user.email, scorecardBundle) : null;
      const myRolePoints = ROLE_BASE_POINTS[role] ?? 10;
      const myIP = myRolePoints + (myPerf?.points || 0);
      const conferenceAccounts = DEMO_ACCOUNTS.filter(a=>a.conference===user.conference && a.role!=="admin");
      const leaderboard = conferenceAccounts.map(a=>{
        const perf = a.role==="delegate" ? delegatePerformance(a.email, scorecardBundle) : null;
        const ip = (ROLE_BASE_POINTS[a.role]??10) + (perf?.points||0);
        return {email:a.email, name:a.name, role:a.role, committee:a.committee, ip};
      }).sort((a,b)=>b.ip-a.ip);
      const rankIdx = leaderboard.findIndex(l=>l.email===user.email);
      const myRank = rankIdx+1;
      const topBoard = leaderboard.slice(0,10);
      const showRankSeparately = myRank>10;
      return (
        <div style={{minHeight:"100vh",background:C.bg,fontFamily:"system-ui"}}>
          <div style={{background:C.navy,padding:"20px 32px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <button onClick={()=>setProfileView(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",fontSize:12,cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:4}}>← Back</button>
            <div style={{width:1,height:24,background:"rgba(255,255,255,0.15)"}}/>
            <div style={{background:currentRole.bg,color:currentRole.color,borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,flexShrink:0}}>{user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
            <div><div style={{fontWeight:700,fontSize:17,color:"#fff",fontFamily:"Georgia,serif"}}>{user.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2}}>{currentRole.label} · {user.conference}</div></div>
            <button onClick={()=>setHasEnteredMUN(true)} style={{...mkBtn("primary"),marginLeft:"auto",padding:"9px 18px",fontSize:13}}>Enter the MUN →</button>
          </div>
          <div style={{maxWidth:900,margin:"0 auto",padding:"28px 24px 60px"}}>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[
                {l:"MUNs Participated",v:1},
                {l:"Total IP Points",v:myIP},
                {l:"Conference Rank",v:rankIdx>=0?`#${myRank} / ${leaderboard.length}`:"—"},
                {l:"Awards Won",v:myPerf?.award?1:0},
              ].map(s=>(<div key={s.l} style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}}><div style={{fontSize:24,fontWeight:700,color:C.navy}}>{s.v}</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{s.l}</div></div>))}
            </div>

            <div style={card}>
              <div style={cardTitle}>Your Performance — {user.conference}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:C.navy}}>{currentRole.label}{user.committee?` — ${user.committee}`:""}{user.country?` · ${user.country}`:""}</div>
                  <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>Role points for holding this position</div>
                </div>
                <div style={{fontWeight:700,fontSize:14,color:C.navy}}>+{myRolePoints} IP</div>
              </div>
              {role==="delegate"&&(
                <div style={{padding:"14px 0"}}>
                  {myPerf.evaluated?(
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:14,color:C.navy}}>Scorecard performance — {myPerf.pct}%</div>
                        <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>Approved by your Chair</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        {myPerf.award&&<span style={{...pill(""),background:myPerf.award.bg,color:myPerf.award.c,fontSize:11}}>{myPerf.award.label}</span>}
                        <span style={{fontWeight:700,fontSize:14,color:C.navy,minWidth:56,textAlign:"right"}}>+{myPerf.points} IP</span>
                      </div>
                    </div>
                  ):(
                    <div style={{fontSize:13,color:C.textMuted}}>Not yet evaluated — performance points will appear here once your Chair approves your scorecard.</div>
                  )}
                </div>
              )}
              {role!=="delegate"&&(
                <div style={{padding:"14px 0",fontSize:13,color:C.textMuted}}>There is no delegate-style performance evaluation for this role — IP reflects the responsibility of the position you currently hold.</div>
              )}
              <div style={{fontSize:11,color:C.textMuted,marginTop:6,paddingTop:14,borderTop:`1px solid ${C.border}`,lineHeight:1.6}}>Intellectual Performance (IP) is calculated from real, recorded activity on this platform: role points for the position you hold, plus performance points only once a Chair has actually approved your scorecard — never from invented history.</div>
            </div>

            <div style={card}>
              <div style={cardTitle}>Leaderboard — {user.conference}</div>
              {topBoard.map((l,i)=>{
                const r=ROLES.find(x=>x.id===l.role);
                const isMe=l.email===user.email;
                return (
                  <div key={l.email} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.border}`,background:isMe?C.navyLight:"transparent",borderRadius:isMe?8:0,paddingLeft:isMe?10:0,paddingRight:isMe?10:0}}>
                    <div style={{width:24,fontWeight:700,fontSize:13,color:i<3?C.gold:C.textMuted,flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1,minWidth:0}}><div style={{fontWeight:isMe?700:600,fontSize:13,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.name}{isMe?" (You)":""}</div><div style={{fontSize:11,color:C.textMuted,marginTop:1}}>{r?.label}{l.committee?` · ${l.committee}`:""}</div></div>
                    <div style={{fontWeight:700,fontSize:14,color:C.navy,flexShrink:0}}>{l.ip} IP</div>
                  </div>
                );
              })}
              {showRankSeparately&&(
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 10px",marginTop:8,background:C.navyLight,borderRadius:8}}>
                  <div style={{width:24,fontWeight:700,fontSize:13,color:C.textMuted,flexShrink:0}}>{myRank}</div>
                  <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:13,color:C.navy}}>{user.name} (You)</div><div style={{fontSize:11,color:C.textMuted,marginTop:1}}>{currentRole.label}{user.committee?` · ${user.committee}`:""}</div></div>
                  <div style={{fontWeight:700,fontSize:14,color:C.navy,flexShrink:0}}>{myIP} IP</div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f2044 0%,#1a3560 50%,#0f2044 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{background:currentRole.bg,color:currentRole.color,borderRadius:12,width:60,height:60,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:20,margin:"0 auto 14px"}}>{user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
          <div style={{fontSize:22,fontWeight:700,color:"#fff",fontFamily:"Georgia,serif"}}>Welcome, {user.name.split(" ")[0]}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",marginTop:6}}>{currentRole.label} · {user.conference}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:360}}>
          <button onClick={()=>setProfileView(true)} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"18px 20px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",color:"#fff",cursor:"pointer",textAlign:"left"}}>
            <div style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
            <div><div style={{fontWeight:600,fontSize:14}}>View Profile</div><div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>Check your role, committee & details</div></div>
          </button>
          <button onClick={()=>setHasEnteredMUN(true)} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"18px 20px",borderRadius:12,border:"none",background:"#fff",color:C.navy,cursor:"pointer",textAlign:"left"}}>
            <div style={{width:38,height:38,borderRadius:10,background:C.navyLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></div>
            <div><div style={{fontWeight:700,fontSize:14}}>Enter the MUN</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>Go to your dashboard</div></div>
          </button>
        </div>
      </div>
    );
  }

  const visibleCommittees = lvl <= 4 ? conferenceCommittees : COMMITTEES.filter(c => c.name === user.committee);

  const TAB_ICONS = {
    dashboard:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>),
    community:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
    speakers:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>),
    voting:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>),
    scorecard:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
    alfred:(<svg width="18" height="18" viewBox="0 0 100 100" fill="currentColor"><path d="M50 5a45 45 0 1 0 0 90A45 45 0 0 0 50 5zm0 6a39 39 0 1 1 0 78A39 39 0 0 1 50 11z"/><path d="M50 18c-6 0-13 2-17 6-2 2-3 4-2 6l2 4c-4 1-7 3-8 6-1 2 0 4 1 5 2 2 5 3 8 4v8c0 1 1 2 2 2h28c1 0 2-1 2-2v-8c3-1 6-2 8-4 1-1 2-3 1-5-1-3-4-5-8-6l2-4c1-2 0-4-2-6-4-4-11-6-17-6z"/><path d="M31 24c0-2 2-4 5-5 3-2 8-3 14-3s11 1 14 3c3 1 5 3 5 5 0 1-1 3-3 4H34c-2-1-3-3-3-4z"/><rect x="44" y="48" width="12" height="18" rx="2"/><path d="M38 58l6-10h12l6 10z"/></svg>),
    clock:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
    admin:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg>),
    notes:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>),
    jurisdiction:(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  };

  const tabs=[
    {id:"dashboard",label:"Dashboard"},
    {id:"community",label:"Committees"},
    {id:"speakers",label:"Speakers List"},
    ...(can(role,"access_voting")?[{id:"voting",label:"Voting"}]:[]),
    ...(role!=="delegate"?[{id:"scorecard",label:"Scorecard"}]:[]),
    {id:"jurisdiction",label:lvl<=4?"All Committees":"My Committee"},
    {id:"alfred",label:"Alfred Assistant"},
    {id:"notes",label:"Professional's Notes"},
    ...(role!=="delegate"?[{id:"clock",label:"Clock & Timers"}]:[]),
    ...(can(role,"access_admin_panel")?[{id:"admin",label:"Admin Panel"}]:[]),
  ];

  const renderScopeSwitcher = () => {
    if (!canSwitchScope) return null;
    return (
      <div style={{display:"flex",gap:16,alignItems:isMobile?"stretch":"center",flexWrap:"wrap",marginBottom:16,padding:"12px 16px",background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:10}}>
        {isPlatformAdmin?(
          <div style={{display:"flex",flexDirection:isMobile?"column":"row",alignItems:isMobile?"stretch":"center",gap:isMobile?4:8,width:isMobile?"100%":"auto",minWidth:0}}>
            <label style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.5}}>CONFERENCE</label>
            <select value={effectiveConference} onChange={e=>setViewConference(e.target.value)} style={{...inputSt,width:isMobile?"100%":"auto",maxWidth:"100%",background:"#fff",fontSize:13,padding:"6px 10px",boxSizing:"border-box"}}>
              {conferences.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        ):(
          <div style={{fontSize:12,color:C.textMuted}}>Conference: <span style={{fontWeight:600,color:C.navy}}>{effectiveConference}</span></div>
        )}
        <div style={{display:"flex",flexDirection:isMobile?"column":"row",alignItems:isMobile?"stretch":"center",gap:isMobile?4:8,width:isMobile?"100%":"auto",minWidth:0}}>
          <label style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.5}}>COMMITTEE</label>
          {conferenceCommittees.length===0?(
            <span style={{fontSize:12,color:C.textMuted,fontStyle:"italic"}}>No committees registered for this conference yet</span>
          ):(
            <select value={activeCommittee} onChange={e=>setActiveCommittee(e.target.value)} style={{...inputSt,width:isMobile?"100%":"auto",maxWidth:"100%",background:"#fff",fontSize:13,padding:"6px 10px",boxSizing:"border-box"}}>
              {conferenceCommittees.map(c=><option key={c.id} value={c.id}>{c.name} — {c.fullName}</option>)}
            </select>
          )}
        </div>
      </div>
    );
  };

  const renderDashboard=()=>{
    const dashConference = isPlatformAdmin ? effectiveConference : user.conference;
    const dashCommittees = COMMITTEES.filter(c=>c.conference===dashConference);
    const dashDelegates = DEMO_ACCOUNTS.filter(a=>a.role==="delegate"&&a.conference===dashConference);
    const dashSchools = adminSchools.filter(s=>s.conference===dashConference);
    const committeeDelegates = DEMO_ACCOUNTS.filter(a=>a.role==="delegate"&&a.committee===userCommitteeName&&a.conference===user.conference);
    const committeeDais = DEMO_ACCOUNTS.filter(a=>(a.role==="chair"||a.role==="cochair")&&a.committee===userCommitteeName&&a.conference===user.conference);
    return(
    <div>
      <div style={{background:C.navy,borderRadius:12,padding:isMobile?"18px 18px":"22px 26px",marginBottom:20,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{background:currentRole.bg,color:currentRole.color,borderRadius:10,width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,flexShrink:0}}>{user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
        <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:17,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div><div style={{fontSize:13,color:"rgba(255,255,255,0.55)",marginTop:2}}>{currentRole.label}{user.committee?` · ${user.committee}`:""}{user.country?` · ${user.country}`:""}</div></div>
        <div style={{marginLeft:isMobile?0:"auto",background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 18px",textAlign:"center"}}><div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Conference</div><div style={{fontSize:13,fontWeight:600,color:"#fff",marginTop:2}}>{user.conference}</div></div>
      </div>
      {can(role,"view_conference_stats")&&(
        <div>
          {isPlatformAdmin&&(
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <label style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.5}}>VIEWING</label>
              <select value={effectiveConference} onChange={e=>setViewConference(e.target.value)} style={{...inputSt,width:isMobile?"100%":"auto",maxWidth:"100%",background:"#fff",fontSize:13,padding:"6px 10px",boxSizing:"border-box"}}>
                {conferences.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:12,marginBottom:20}}>
            {[{l:"Committees",v:dashCommittees.length},{l:"Delegates",v:dashDelegates.length},{l:"Schools",v:dashSchools.length}].map(s=>(<div key={s.l} style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 20px"}}><div style={{fontSize:26,fontWeight:700,color:C.navy}}>{s.v}</div><div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{s.l}</div></div>))}
          </div>
        </div>
      )}
      {role==="delegate"&&(
        <div style={{...card,borderLeft:`4px solid ${C.navy}`,marginBottom:16}}>
          <div style={cardTitle}>Your Assignment</div>
          <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
            <div><div style={{fontSize:11,color:C.textMuted}}>Committee</div><div style={{fontWeight:700,fontSize:16,color:C.navy}}>{user.committee}</div></div>
            <div><div style={{fontSize:11,color:C.textMuted}}>Portfolio</div><div style={{fontWeight:700,fontSize:16,color:C.navy}}>{user.country}</div></div>
            <div><div style={{fontSize:11,color:C.textMuted}}>Fellow Delegates</div><div style={{fontWeight:700,fontSize:16,color:C.navy}}>{committeeDelegates.length}</div></div>
            <div style={{flex:1,minWidth:180}}><div style={{fontSize:11,color:C.textMuted}}>Agenda</div><div style={{fontWeight:600,fontSize:14,color:C.textSec}}>{committee.topic}</div></div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
            <button onClick={()=>setActiveTab("speakers")} style={{...mkBtn(),padding:"7px 14px",fontSize:12}}>Speakers List</button>
            <button onClick={()=>setActiveTab("jurisdiction")} style={{...mkBtn(),padding:"7px 14px",fontSize:12}}>My Committee Roster</button>
          </div>
        </div>
      )}
      {(role==="chair"||role==="cochair")&&(
        <div style={{...card,borderLeft:`4px solid ${C.navy}`,marginBottom:16}}>
          <div style={cardTitle}>Your Committee</div>
          <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
            <div><div style={{fontSize:11,color:C.textMuted}}>Committee</div><div style={{fontWeight:700,fontSize:16,color:C.navy}}>{committee.name}</div></div>
            <div><div style={{fontSize:11,color:C.textMuted}}>Delegates</div><div style={{fontWeight:700,fontSize:16,color:C.navy}}>{committeeDelegates.length}</div></div>
            <div><div style={{fontSize:11,color:C.textMuted}}>Dais</div><div style={{fontWeight:700,fontSize:16,color:C.navy}}>{committeeDais.length}</div></div>
            <div style={{flex:1,minWidth:180}}><div style={{fontSize:11,color:C.textMuted}}>Agenda</div><div style={{fontWeight:600,fontSize:14,color:C.textSec}}>{committee.topic}</div></div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`,flexWrap:"wrap"}}>
            <button onClick={()=>setActiveTab("speakers")} style={{...mkBtn(),padding:"7px 14px",fontSize:12}}>Speakers List</button>
            {can(role,"access_voting")&&<button onClick={()=>setActiveTab("voting")} style={{...mkBtn(),padding:"7px 14px",fontSize:12}}>Voting</button>}
            <button onClick={()=>setActiveTab("scorecard")} style={{...mkBtn(),padding:"7px 14px",fontSize:12}}>Scorecard</button>
            <button onClick={()=>setActiveTab("jurisdiction")} style={{...mkBtn(),padding:"7px 14px",fontSize:12}}>Full Committee Roster</button>
          </div>
        </div>
      )}
      <div style={card}>
        <div style={cardTitle}>Announcements</div>
        {[{text:"Position papers due by 5 PM today",from:"Chair – UNSC",time:"09:00"},{text:"Opening ceremony at 10 AM in Hall A",from:"General Secretary",time:"08:30"}].map((a,i)=>(<div key={i} style={{padding:"11px 0",borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:13,color:C.text}}>{a.text}</div><div style={{fontSize:11,color:C.textMuted,marginTop:4}}>{a.from} · {a.time}</div></div>))}
      </div>
      {lvl<=5&&(
        <div style={card}>
          <div style={cardTitle}>Committee Overview</div>
          {visibleCommittees.length===0&&<div style={{fontSize:13,color:C.textMuted,padding:"8px 0"}}>No committees registered for this conference yet.</div>}
          {visibleCommittees.map(c=>(<div key={c.id} onClick={()=>{setActiveCommittee(c.id);setActiveTab("community");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}><div><div style={{fontWeight:600,fontSize:14,color:C.navy}}>{c.name} <span style={{fontWeight:400,fontSize:12,color:C.textMuted}}>— {c.fullName}</span></div><div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{c.topic}</div></div><span style={pill("active")}>Active</span></div>))}
          {lvl<=4&&<button onClick={()=>setActiveTab("jurisdiction")} style={{...mkBtn(),marginTop:12,padding:"7px 14px",fontSize:12}}>View Full Roster (Dais & Delegates)</button>}
        </div>
      )}
      {can(role,"manage_schools")&&(
        <div style={card}>
          <div style={cardTitle}>School Management</div>
          {dashSchools.length===0&&<div style={{fontSize:13,color:C.textMuted,padding:"8px 0"}}>No schools registered for this conference yet.</div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
            {dashSchools.map(s=>(<div key={s.id} style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:8,padding:14,minWidth:0}}><div style={{fontWeight:600,fontSize:12,color:C.navy,wordBreak:"break-word",lineHeight:1.4,marginBottom:4}}>{s.name}</div><div style={{fontSize:11,color:C.textMuted,marginBottom:8}}>{s.delegates} delegates</div><span style={pill(s.status==="verified"?"active":"pending")}>{s.status==="verified"?"Verified":"Pending"}</span></div>))}
          </div>
        </div>
      )}
    </div>
    );
  };

  const renderCommunity=()=>(
    <div style={{display:"flex",flexDirection:isMobile?"column":"row",height:isMobile?"auto":"calc(100vh - 145px)",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
      <div style={isMobile
        ? {width:"100%",background:C.navy,display:"flex",flexDirection:"column",padding:"6px 0",maxHeight:committeeSidebarOpen?340:44,overflowY:"auto",transition:"max-height 0.2s ease",flexShrink:0}
        : {width:210,background:C.navy,display:"flex",flexDirection:"column",padding:"16px 0",overflowY:"auto"}}>
        {isMobile&&(
          <button onClick={()=>setCommitteeSidebarOpen(o=>!o)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"10px 16px",background:"none",border:"none",color:"#e2e8f0",fontSize:12,fontWeight:600,cursor:"pointer"}}>
            <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{committee.name} · {activeChannel}</span><span style={{flexShrink:0,marginLeft:8}}>{committeeSidebarOpen?"▲":"▼"}</span>
          </button>
        )}
        {isPlatformAdmin&&(
          <div style={{padding:"0 16px 12px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#475569",letterSpacing:1.5,marginBottom:6}}>CONFERENCE</div>
            <select value={effectiveConference} onChange={e=>setViewConference(e.target.value)} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",color:"#e2e8f0",fontSize:12}}>
              {conferences.map(c=><option key={c.id} value={c.name} style={{color:"#0f2044"}}>{c.name}</option>)}
            </select>
          </div>
        )}
        <div style={{padding:"0 16px 8px",fontSize:10,fontWeight:700,color:"#475569",letterSpacing:1.5}}>{lvl<=4?"ALL COMMITTEES":"MY COMMITTEE"}</div>
        {visibleCommittees.length===0&&<div style={{padding:"0 16px",fontSize:11,color:"#64748b",fontStyle:"italic"}}>No committees for this conference yet.</div>}
        {visibleCommittees.map(c=>(<button key={c.id} onClick={()=>{setActiveCommittee(c.id);setCommitteeSidebarOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 16px",background:activeCommittee===c.id?"rgba(255,255,255,0.1)":"transparent",color:activeCommittee===c.id?"#fff":"#94a3b8",border:"none",cursor:"pointer",fontSize:12,fontWeight:activeCommittee===c.id?600:400}}>{c.name} <span style={{fontSize:10,opacity:0.6}}>— {c.fullName}</span></button>))}
        <div style={{padding:"16px 16px 8px",fontSize:10,fontWeight:700,color:"#475569",letterSpacing:1.5}}>CHANNELS</div>
        {Object.keys(CHANNEL_ACCESS).map(ch=>{const ok=can(role,CHANNEL_ACCESS[ch]);return(<button key={ch} onClick={()=>{if(ok){setActiveChannel(ch);setCommitteeSidebarOpen(false);}}} style={{display:"flex",alignItems:"center",gap:6,width:"100%",textAlign:"left",padding:"7px 16px",background:activeChannel===ch&&ok?"rgba(255,255,255,0.08)":"transparent",color:ok?(activeChannel===ch?"#e2e8f0":"#94a3b8"):"#374151",border:"none",cursor:ok?"pointer":"not-allowed",fontSize:13}}>{ch}{!ok&&" 🔒"}</button>);})}
        <div style={{marginTop:"auto",padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}><div style={{fontSize:10,color:"#475569"}}>Signed in as</div><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",marginTop:2}}>{user.name}</div><div style={{fontSize:11,color:"#94a3b8"}}>{currentRole.label}</div></div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",background:C.bg,minHeight:isMobile?"calc(100vh - 260px)":"auto"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}><div><span style={{fontWeight:700,fontSize:14,color:C.navy}}>{activeChannel}</span><span style={{fontSize:12,color:C.textMuted,marginLeft:12}}>{committee.name} · {committee.topic}</span></div><span style={{fontSize:12,color:C.textMuted}}>42 members</span></div>
        <div style={{flex:1,overflow:"auto",padding:20,display:"flex",flexDirection:"column"}}>
          {messages.filter(m=>m.channel===activeChannel).length===0&&<div style={{color:C.textMuted,fontSize:13,textAlign:"center",marginTop:40}}>No messages in this channel yet.</div>}
          {messages.filter(m=>m.channel===activeChannel).map(m=>(
            <div key={m.id} style={{marginBottom:16,display:"flex",gap:10}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:C.navyLight,color:C.navy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{m.label.slice(0,2).toUpperCase()}</div>
              <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontWeight:600,fontSize:13,color:C.navy}}>{m.label}</span><span style={{fontSize:11,color:C.textMuted}}>{m.time}</span>{can(role,"delete_any_message")&&<button onClick={()=>setMessages(ms=>ms.filter(x=>x.id!==m.id))} style={{...mkBtn("danger"),padding:"1px 8px",fontSize:10}}>Delete</button>}</div>              {m.file ? (
                m.file.url ? (
                  /* Image preview */
                  <div style={{background:C.bgSoft,borderRadius:8,padding:8,display:"inline-block",maxWidth:"85%",border:`1px solid ${C.border}`}}>
                    <img src={m.file.url} alt={m.file.name} style={{maxWidth:"100%",maxHeight:200,borderRadius:6,display:"block",marginBottom:6}}/>
                    <div style={{fontSize:11,color:C.textMuted}}>{m.file.name} · {(m.file.size/1024).toFixed(1)} KB</div>
                  </div>
                ) : (
                  /* File attachment card */
                  <div style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",display:"inline-flex",alignItems:"center",gap:10,maxWidth:"85%"}}>
                    <div style={{width:36,height:36,borderRadius:8,background:C.navyLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{m.file.name}</div>
                      <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{(m.file.size/1024).toFixed(1)} KB · {m.file.type||"File"}</div>
                    </div>
                  </div>
                )
              ) : (
                <div style={{fontSize:13,color:C.text,lineHeight:1.6,background:C.bgSoft,borderRadius:8,padding:"8px 12px",display:"inline-block",maxWidth:"85%"}}><TruncatedText text={m.text} maxLength={280}/></div>
              )}</div>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 20px",borderTop:`1px solid ${C.border}`}}>
          {!can(role,"send_message")?<div style={{fontSize:13,color:C.textMuted,textAlign:"center",padding:"8px 0"}}>🔒 You cannot send messages.</div>
           :activeChannel==="# announcements"&&!can(role,"send_announcement")?<div style={{fontSize:13,color:C.textMuted,textAlign:"center",padding:"8px 0"}}>🔒 Only Chair, GS, and above may post announcements.</div>
           :<div style={{display:"flex",gap:8,alignItems:"center"}}>
              {/* Hidden file input */}
              <input
                type="file"
                id="chat-file-input"
                multiple
                accept="*/*"
                style={{display:"none"}}
                onChange={e=>{
                  const files=Array.from(e.target.files||[]);
                  if(!files.length)return;
                  files.forEach(file=>{
                    const isImage=file.type.startsWith("image/");
                    const reader=new FileReader();
                    reader.onload=ev=>{
                      setMessages(m=>[...m,{
                        id:Date.now()+Math.random(),
                        role,label:currentRole.label,
                        text:`📎 Attached: ${file.name}`,
                        file:{name:file.name,size:file.size,type:file.type,url:isImage?ev.target.result:null},
                        time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
                        channel:activeChannel
                      }]);
                    };
                    if(isImage)reader.readAsDataURL(file);
                    else reader.readAsArrayBuffer(file);
                  });
                  e.target.value="";
                }}
              />
              {/* Clip button */}
              <button
                onClick={()=>document.getElementById("chat-file-input").click()}
                title="Attach file"
                style={{background:"none",border:`1px solid ${C.border}`,borderRadius:7,padding:"9px 10px",cursor:"pointer",color:C.textSec,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}
                onMouseEnter={e=>{e.currentTarget.style.background=C.navyLight;e.currentTarget.style.color=C.navy;}}
                onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=C.textSec;}}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder={`Message ${activeChannel}...`} style={{...inputSt,flex:1}}/>
              <button onClick={sendMsg} style={mkBtn("primary")}>Send</button>
            </div>}
        </div>
      </div>
    </div>
  );

  const renderSpeakers=()=>{
    if(!can(role,"view_speakers_list"))return <Lock reason="You do not have access to the speakers list."/>;
    const canControl=can(role,"control_speakers_list");
    const canAdd=can(role,"add_to_speakers_list");
    const committeeName = lvl <= 4 ? committee.name : userCommitteeName;
    const committeeConference = lvl <= 4 ? effectiveConference : user.conference;
    const DELEGATE_LIST = DEMO_ACCOUNTS.filter(a=>a.role==="delegate" && a.committee===committeeName && a.conference===committeeConference).map(a=>a.country);
    return(
      <div>
      {renderScopeSwitcher()}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
        <div style={card}>
          <div style={cardTitle}>Current Speaker</div>
          <SpeakerTimer canControl={canControl} speakers={speakers} setSpeakers={setSpeakers} speakerTime={speakerTime} setSpeakerTime={setSpeakerTime} timerRunning={timerRunning} setTimerRunning={setTimerRunning}/>
        </div>
        <div style={card}>
          <div style={cardTitle}>Speakers Queue</div>
          {speakers.length===0&&<div style={{textAlign:"center",padding:"24px 0",color:C.textMuted,fontSize:13}}>No delegates in the queue.</div>}
          {speakers.map((s,i)=>(
            <div key={s.country} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:C.bgMuted,color:C.textSec,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>{i+1}</div>
              <div style={{flex:1,fontWeight:500,fontSize:14,color:C.navy}}>Delegate – {s.country}</div>
              <span style={pill(s.status)}>{s.status==="speaking"?"Speaking":s.status==="next"?"Next":"Queue"}</span>
              {canControl&&<button onClick={()=>setSpeakers(sp=>sp.filter(x=>x.country!==s.country))} style={{...mkBtn("danger"),padding:"4px 10px",fontSize:11}}>Remove</button>}
            </div>
          ))}
          {canAdd&&(
            <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:1,marginBottom:10}}>ADD DELEGATE TO LIST</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {DELEGATE_LIST.filter(c=>!speakers.find(s=>s.country===c)).map(c=>(<button key={c} onClick={()=>setSpeakers(s=>[...s,{country:c,status:"queue"}])} style={{...mkBtn(),padding:"5px 12px",fontSize:12}}>+ {c}</button>))}
                {DELEGATE_LIST.filter(c=>!speakers.find(s=>s.country===c)).length===0&&<span style={{fontSize:12,color:C.textMuted}}>{DELEGATE_LIST.length===0?`No delegates are registered in ${committeeName||"this committee"} yet.`:"All delegates are in the queue."}</span>}
              </div>
            </div>
          )}
          {role==="delegate"&&(
            <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8,background:C.bgSoft,borderRadius:8,padding:"10px 14px"}}>
              <span style={{fontSize:14}}>🔒</span><span style={{fontSize:12,color:C.textSec}}>The Chair or Co-Chair manages the speakers list.</span>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  };

  const renderVoting=()=>{
    const canInitiate = can(role,"initiate_voting");
    const canRecord = can(role,"cast_vote");
    const canViewAll = can(role,"view_live_votes");
    const opts = votingBooth ? VOTE_OPTIONS[votingBooth.objective] : [];
    const tally = opts.reduce((acc,o)=>{acc[o.k]=votes.filter(v=>v.vote===o.k).length;return acc;},{});
    const cast = Object.values(tally).reduce((a,b)=>a+b,0);
    const favor = tally.favor||0, against = tally.against||0;

    return(
      <div>
      {renderScopeSwitcher()}
        {!votingBooth&&(
          <div style={card}>
            <div style={cardTitle}>Formal Voting</div>
            {canInitiate?(
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:32,marginBottom:12}}>🗳️</div>
                <div style={{fontWeight:600,fontSize:15,color:C.textSec,marginBottom:16}}>No voting booth is currently open.</div>
                <button onClick={openNewBoothModal} style={mkBtn("primary")}>+ Start New Voting Booth</button>
              </div>
            ):(
              <div style={{textAlign:"center",padding:30,color:C.textMuted,fontSize:13}}>Voting has not been opened yet.</div>
            )}
          </div>
        )}

        {votingBooth&&(
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:1,textTransform:"uppercase"}}>{votingObjective.icon} {votingObjective.label}</div>
                <div style={{fontWeight:700,fontSize:16,color:C.navy,marginTop:2}}>{votingBooth.title||votingObjective.label}</div>
                <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{votingBooth.open?`Opened ${votingBooth.createdAt}`:`Closed ${votingBooth.closedAt}`}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {canInitiate&&votingBooth.open&&<button onClick={closeVotingBooth} style={mkBtn("danger")}>Close Voting</button>}
                {canInitiate&&!votingBooth.open&&<button onClick={openNewBoothModal} style={mkBtn("primary")}>+ Start New Voting Booth</button>}
              </div>
            </div>

            {canRecord&&votingBooth.open&&(
              <div style={{marginBottom:16,padding:"10px 14px",background:C.infoBg,borderRadius:8,fontSize:12,color:C.infoTxt,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:15}}>{votingObjective.icon}</span>{votingBooth.objective==="rollcall"?"Roll call in progress — mark each delegation present as it responds.":"Voting in progress — mark each delegate's response as their placard is raised."}
              </div>
            )}

            {(canViewAll||!votingBooth.open)&&(
              <div style={{display:"grid",gridTemplateColumns:isMobile?`repeat(${Math.min(opts.length,2)},1fr)`:`repeat(${opts.length},1fr)`,gap:10,marginBottom:20}}>
                {opts.map(o=>(
                  <div key={o.k} style={{background:pill(o.k).background,borderRadius:8,padding:14,textAlign:"center"}}>
                    <div style={{fontSize:32,fontWeight:700,color:pill(o.k).color}}>{tally[o.k]||0}</div>
                    <div style={{fontSize:12,fontWeight:500,color:pill(o.k).color}}>{o.l}</div>
                  </div>
                ))}
              </div>
            )}

            {votes.map(v=>(
              <div key={v.country} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:13}}>Delegate – {v.country}</span>
                {canRecord&&votingBooth.open?(
                  <div style={{display:"flex",gap:6}}>
                    {opts.map(o=><button key={o.k} onClick={()=>setVotes(vs=>vs.map(x=>x.country===v.country?{...x,vote:o.k}:x))} style={{...mkBtn(v.vote===o.k?(o.k==="favor"||o.k==="present"?"success":o.k==="against"||o.k==="absent"?"danger":""):""),padding:"4px 12px",fontSize:12}}>{o.l}</button>)}
                  </div>
                ):(canViewAll||canRecord||(v.country===user.country))?(
                  v.vote?<span style={pill(v.vote)}>{opts.find(o=>o.k===v.vote)?.l||v.vote}</span>:<span style={{fontSize:12,color:C.textMuted}}>Not yet recorded</span>
                ):<span style={{fontSize:12,color:C.textMuted}}>—</span>}
              </div>
            ))}

            {votes.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:C.textMuted,fontSize:13}}>No delegates found in this committee.</div>}

            {cast>0&&!votingBooth.open&&votingBooth.objective!=="rollcall"&&(
              <div style={{marginTop:16,padding:"12px 16px",background:favor>against?C.greenBg:C.redBg,borderRadius:8,fontWeight:600,color:favor>against?C.greenTxt:C.redTxt,fontSize:14}}>
                {favor>against?"✓ PASSED":"✕ FAILED"} — {favor} in favour, {against} against, {tally.abstain||0} abstaining
              </div>
            )}
            {cast>0&&!votingBooth.open&&votingBooth.objective==="rollcall"&&(
              <div style={{marginTop:16,padding:"12px 16px",background:C.bgSoft,borderRadius:8,fontWeight:600,color:C.navy,fontSize:14}}>
                Quorum check complete — {(tally.present||0)+(tally.present_voting||0)} present, {tally.absent||0} absent.
              </div>
            )}
          </div>
        )}

        {votingHistory.length>0&&(
          <div style={{...card,marginTop:16}}>
            <div style={cardTitle}>Voting History</div>
            {votingHistory.map(h=>{
              const o=VOTING_OBJECTIVES.find(x=>x.id===h.objective);
              return (
                <div key={h.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div><div style={{fontWeight:600,fontSize:13,color:C.navy}}>{o.icon} {h.title||o.label}</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{o.label} · Closed {h.closedAt}</div></div>
                </div>
              );
            })}
          </div>
        )}

        {showNewBooth&&(
          <div onClick={()=>setShowNewBooth(false)} style={{position:"fixed",inset:0,background:"rgba(15,32,68,0.55)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,padding:"26px 28px",width:420,maxWidth:"92vw",boxShadow:"0 24px 60px rgba(0,0,0,0.3)",fontFamily:"system-ui"}}>
              <div style={{fontWeight:700,fontSize:17,color:C.navy,marginBottom:4,fontFamily:"Georgia,serif"}}>New Voting Booth</div>
              <div style={{fontSize:12,color:C.textMuted,marginBottom:18}}>Choose what this vote is for.</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                {VOTING_OBJECTIVES.map(o=>(
                  <button key={o.id} onClick={()=>setNewBoothInput(p=>({objective:o.id,title:o.needsTitle?p.title:""}))} style={{display:"flex",alignItems:"center",gap:12,textAlign:"left",padding:"12px 14px",borderRadius:10,border:`1.5px solid ${newBoothInput.objective===o.id?C.navy:C.border}`,background:newBoothInput.objective===o.id?C.navyLight:"#fff",cursor:"pointer"}}>
                    <span style={{fontSize:20}}>{o.icon}</span>
                    <div>
                      <div style={{fontWeight:600,fontSize:13,color:C.navy}}>{o.label}</div>
                      <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{o.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              {VOTING_OBJECTIVES.find(o=>o.id===newBoothInput.objective)?.needsTitle&&(
                <div style={{marginBottom:18}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.textSec,display:"block",marginBottom:6,letterSpacing:0.5}}>{newBoothInput.objective==="agenda"?"AGENDA TITLE":"RESOLUTION DRAFT TITLE"}</label>
                  <input value={newBoothInput.title} onChange={e=>setNewBoothInput(p=>({...p,title:e.target.value}))} placeholder={newBoothInput.objective==="agenda"?"e.g. Nuclear Non-Proliferation":"e.g. DR-1.2: Nuclear Non-Proliferation Framework"} style={inputSt} autoFocus/>
                </div>
              )}
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setShowNewBooth(false)} style={{...mkBtn(),flex:1}}>Cancel</button>
                <button onClick={startVotingBooth} disabled={VOTING_OBJECTIVES.find(o=>o.id===newBoothInput.objective)?.needsTitle&&!newBoothInput.title.trim()} style={{...mkBtn("primary"),flex:1,opacity:(VOTING_OBJECTIVES.find(o=>o.id===newBoothInput.objective)?.needsTitle&&!newBoothInput.title.trim())?0.5:1}}>Start Voting</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


  const renderScorecard=()=>{
    if(!can(role,"fill_scorecard")&&!can(role,"approve_scorecard")&&!can(role,"view_all_scorecards")&&!can(role,"view_own_scorecard"))
      return <Lock reason="Scorecards are not accessible for your role."/>;

    const canEditMax = can(role,"approve_scorecard") || can(role,"fill_scorecard");
    const canSwitch  = can(role,"fill_scorecard") || can(role,"approve_scorecard") || can(role,"view_all_scorecards");

    const allDelegates = DEMO_ACCOUNTS.filter(a => {
      if (a.role !== "delegate") return false;
      if (lvl <= 4) return a.committee === committee.name;
      return a.committee === userCommitteeName;
    });

    const activeDelegate = (selectedDelegate && allDelegates.find(d=>d.email===selectedDelegate.email)) || allDelegates[0] || null;
    const delegateKey = activeDelegate?.email || "default";

    const scores = delegateScores[delegateKey] || {};
    const rmks = delegateRemarks[delegateKey] || {};
    const delegStatus = scorecardStatuses[delegateKey] || "draft";
    const setScores = (u) => setDelegateScores(p=>({...p,[delegateKey]:typeof u==="function"?u(p[delegateKey]||{}):u}));
    const setRmks = (u) => setDelegateRemarks(p=>({...p,[delegateKey]:typeof u==="function"?u(p[delegateKey]||{}):u}));
    const setDelegStatus = (v) => setScorecardStatuses(p=>({...p,[delegateKey]:v}));

    const canInput = can(role,"fill_scorecard") && delegStatus==="draft";

    const total = OSM_CRITERIA.reduce((a,_,i)=>a+(parseFloat(scores[i])||0),0);
    const maxTotal = OSM_CRITERIA.reduce((a,_,i)=>a+(parseFloat(maxScores[i])||10),0);
    const pctTotal = maxTotal>0?Math.round((total/maxTotal)*100):0;

    const statusColor = delegStatus==="approved"?{bg:C.greenBg,txt:C.greenTxt,label:"Approved ✓"}
      :delegStatus==="submitted"?{bg:C.amberBg,txt:C.amberTxt,label:"Awaiting Chair Approval"}
      :{bg:C.bgMuted,txt:C.textMuted,label:"Draft"};

    const ScoreSlider=({i})=>{
      const max=parseFloat(maxScores[i])||10;
      const val=parseFloat(scores[i])||0;
      const pct=max>0?(val/max)*100:0;
      return(
        <div style={{position:"relative"}}>
          <div style={{position:"relative",height:8,borderRadius:4,background:C.bgMuted,cursor:canInput?"pointer":"default"}}
            onClick={e=>{if(!canInput)return;const rect=e.currentTarget.getBoundingClientRect();const p=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));setScores(s=>({...s,[i]:parseFloat((p*max).toFixed(1))}));}}>
            <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,borderRadius:4,background:pct>=80?C.green:pct>=50?C.gold:C.navy,transition:"width 0.1s"}}/>
            {canInput&&<div style={{position:"absolute",top:"50%",left:`${pct}%`,transform:"translate(-50%,-50%)",width:16,height:16,borderRadius:"50%",background:"#fff",border:`2px solid ${pct>=80?C.green:pct>=50?C.gold:C.navy}`,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}/>}
          </div>
          <input type="range" min={0} max={max} step={0.1} value={val} disabled={!canInput} onChange={e=>setScores(s=>({...s,[i]:parseFloat(e.target.value)}))} style={{position:"absolute",top:0,left:0,width:"100%",height:8,opacity:0,cursor:canInput?"pointer":"default",margin:0}}/>
        </div>
      );
    };

    if (!activeDelegate) {
      return (
        <div>
          {renderScopeSwitcher()}
          <div style={{...card,textAlign:"center",padding:48,color:C.textMuted}}>
            <div style={{fontSize:32,marginBottom:10}}>📋</div>
            <div style={{fontWeight:600,fontSize:15,color:C.textSec}}>{lvl<=4?`No delegates found in committee: ${committee.name}`:(userCommitteeName?`No delegates found in committee: ${userCommitteeName}`:"No committee assigned to your account.")}</div>
          </div>
        </div>
      );
    }

    return(
      <div>
      {renderScopeSwitcher()}
        <div style={{...card,marginBottom:16,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:C.navy,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0}}>{activeDelegate.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
            <div>
              <div style={{fontSize:11,color:C.textMuted}}>Viewing scorecard for</div>
              <div style={{fontWeight:700,fontSize:15,color:C.navy}}>Delegate – {activeDelegate.country} <span style={{fontWeight:400,fontSize:12,color:C.textMuted}}>({activeDelegate.name})</span></div>
            </div>
          </div>
          {canSwitch&&allDelegates.length>0&&(
            <button onClick={()=>setShowDelegateDialog(true)} style={{...mkBtn("primary"),display:"flex",alignItems:"center",gap:8,padding:"9px 16px"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7"/></svg>
              Switch Delegate
            </button>
          )}
        </div>

        {showDelegateDialog&&(
          <div onClick={()=>setShowDelegateDialog(false)} style={{position:"fixed",inset:0,background:"rgba(15,32,68,0.55)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:480,maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 60px rgba(0,0,0,0.3)",fontFamily:"system-ui"}}>
              <div style={{padding:"18px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:16,color:C.navy,fontFamily:"Georgia,serif"}}>Switch Delegate</div>
                  <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{allDelegates.length} delegate{allDelegates.length!==1?"s":""} in {userCommitteeName||"committee"}</div>
                </div>
                <button onClick={()=>setShowDelegateDialog(false)} style={{background:C.bgMuted,border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:14,color:C.textSec}}>✕</button>
              </div>
              <div style={{overflowY:"auto",padding:"10px 14px",flex:1}}>
                {allDelegates.map((d,i)=>{
                  const isActive=d.email===activeDelegate.email;
                  const dStatus=scorecardStatuses[d.email]||"draft";
                  const dScores=delegateScores[d.email]||{};
                  const dTotal=OSM_CRITERIA.reduce((a,_,j)=>a+(parseFloat(dScores[j])||0),0);
                  const hasScore=Object.keys(dScores).length>0;
                  const statusType=dStatus==="approved"?"approved":dStatus==="submitted"?"pending":"queue";
                  return(
                    <button key={d.email} onClick={()=>{setSelectedDelegate(d);setShowDelegateDialog(false);}} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${isActive?C.navy:C.border}`,background:isActive?C.navyLight:"#fff",cursor:"pointer",marginBottom:8,textAlign:"left"}}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:isActive?C.navy:C.bgMuted,color:isActive?"#fff":C.textSec,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14,color:isActive?C.navy:C.text}}>Delegate – {d.country}</div><div style={{fontSize:11,color:C.textMuted}}>{d.name}</div></div>
                      {hasScore&&<span style={{fontSize:12,fontWeight:700,color:C.gold,flexShrink:0}}>{dTotal.toFixed(1)}</span>}
                      <span style={pill(statusType)}>{dStatus==="approved"?"Approved":dStatus==="submitted"?"Pending":hasScore?"In Progress":"Not Started"}</span>
                      {isActive&&<span style={{fontSize:14,color:C.navy}}>✓</span>}
                    </button>
                  );
                })}
                {allDelegates.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:C.textMuted,fontSize:13}}>No delegates found.</div>}
              </div>
              <div style={{padding:"12px 22px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,flexWrap:"wrap"}}>
                {[{t:"approved",l:"Approved"},{t:"pending",l:"Pending"},{t:"queue",l:"Not Started / In Progress"}].map(x=>(<span key={x.l} style={pill(x.t)}>{x.l}</span>))}
              </div>
            </div>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
          <div style={card}>
            <div style={cardTitle}>Delegate Scorecard</div>
            <div style={{textAlign:"center",padding:"8px 0 16px"}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:C.navy,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18,margin:"0 auto 10px"}}>{activeDelegate.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
              <div style={{fontSize:13,color:C.textMuted,marginBottom:2}}>Now scoring</div>
              <div style={{fontSize:18,fontWeight:700,color:C.navy}}>Delegate – {activeDelegate.country}</div>
              <div style={{fontSize:12,color:C.textSec,marginTop:2}}>{activeDelegate.name} · {activeDelegate.committee}</div>
              <div style={{marginTop:10}}><span style={{background:statusColor.bg,color:statusColor.txt,padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:600}}>{statusColor.label}</span></div>
            </div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
              <div style={{position:"relative",width:120,height:120}}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke={C.bgMuted} strokeWidth="9"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke={pctTotal>=80?C.green:pctTotal>=50?C.gold:C.navy} strokeWidth="9" strokeDasharray={`${2*Math.PI*50}`} strokeDashoffset={`${2*Math.PI*50*(1-pctTotal/100)}`} strokeLinecap="round" transform="rotate(-90 60 60)" style={{transition:"all 0.4s"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.navy}}>{total.toFixed(1)}</div><div style={{fontSize:11,color:C.textMuted}}>/ {maxTotal.toFixed(0)} · {pctTotal}%</div></div>
              </div>
            </div>
            {OSM_CRITERIA.map((c,i)=>{
              const max=parseFloat(maxScores[i])||10;
              const val=parseFloat(scores[i])||0;
              return(
                <div key={c} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:13,fontWeight:600,color:C.navy}}>{c}</span>
                    {canInput?(
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <input type="number" min={0} max={max} step={0.1} value={val||""} placeholder="0.0" onChange={e=>{const v=Math.min(max,Math.max(0,parseFloat(e.target.value)||0));setScores(s=>({...s,[i]:parseFloat(v.toFixed(1))}));}} style={{...inputSt,width:54,textAlign:"center",fontWeight:700,fontSize:13,color:C.gold,padding:"3px 5px",background:"#fff"}}/>
                        <span style={{fontSize:12,color:C.textMuted}}>/</span>
                        {canEditMax?<input type="number" min={1} max={100} step={0.5} value={maxScores[i]} onChange={e=>{const nm=Math.max(1,parseFloat(e.target.value)||10);setMaxScores(m=>({...m,[i]:nm}));if(val>nm)setScores(s=>({...s,[i]:nm}));}} style={{...inputSt,width:46,textAlign:"center",fontWeight:700,fontSize:13,color:C.textSec,padding:"3px 5px",background:"#fff",border:`1px dashed ${C.gold}`}}/>:<span style={{fontSize:12,fontWeight:700,color:C.textSec}}>{max}</span>}
                      </div>
                    ):(<span style={{fontSize:13,fontWeight:700,color:C.gold}}>{val.toFixed(1)} / {max}</span>)}
                  </div>
                  <ScoreSlider i={i}/>
                  {canInput&&<textarea placeholder="Remarks..." value={rmks[i]||""} onChange={e=>setRmks(r=>({...r,[i]:e.target.value}))} style={{...inputSt,marginTop:8,height:36,resize:"none",fontSize:12}}/>}
                  {!canInput&&rmks[i]&&<div style={{marginTop:6,fontSize:12,color:C.textSec,fontStyle:"italic"}}>"{rmks[i]}"</div>}
                </div>
              );
            })}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",paddingTop:4}}>
              {can(role,"fill_scorecard")&&delegStatus==="draft"&&<button onClick={()=>setDelegStatus("submitted")} style={{...mkBtn("primary"),flex:1}}>Submit to Chair</button>}
              {can(role,"fill_scorecard")&&delegStatus==="submitted"&&<button onClick={()=>setDelegStatus("draft")} style={{...mkBtn("danger"),flex:1}}>Reopen for Editing</button>}
              {can(role,"approve_scorecard")&&delegStatus==="submitted"&&<button onClick={()=>setDelegStatus("approved")} style={{...mkBtn("success"),flex:1}}>Approve & Release</button>}
              {can(role,"approve_scorecard")&&delegStatus==="draft"&&<span style={{fontSize:12,color:C.textMuted,fontStyle:"italic"}}>Awaiting Co-Chair submission.</span>}
              {delegStatus==="approved"&&<span style={{color:C.greenTxt,fontSize:13,fontWeight:600}}>✓ Approved and released</span>}
            </div>
          </div>

          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={cardTitle}>Delegate Queue</div>
              <span style={{fontSize:12,color:C.textMuted}}>{allDelegates.length} in {userCommitteeName||"committee"}</span>
            </div>
            {allDelegates.map((d,i)=>{
              const isActive=d.email===activeDelegate.email;
              const dStatus=scorecardStatuses[d.email]||"draft";
              const dScores=delegateScores[d.email]||{};
              const dTotal=OSM_CRITERIA.reduce((a,_,j)=>a+(parseFloat(dScores[j])||0),0);
              const hasScore=Object.keys(dScores).length>0;
              const statusType=dStatus==="approved"?"approved":dStatus==="submitted"?"pending":"queue";
              return(
                <div key={d.email} onClick={()=>setSelectedDelegate(d)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 10px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:isActive?C.navyLight:"transparent",borderRadius:isActive?8:0}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:isActive?C.navy:C.bgMuted,color:isActive?"#fff":C.textSec,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14,color:isActive?C.navy:C.text}}>Delegate – {d.country}</div><div style={{fontSize:11,color:C.textMuted}}>{d.name}</div></div>
                  {hasScore&&<span style={{fontSize:12,fontWeight:700,color:C.gold,flexShrink:0}}>{dTotal.toFixed(1)}</span>}
                  <span style={pill(statusType)}>{dStatus==="approved"?"Approved":dStatus==="submitted"?"Pending":hasScore?"In Progress":"Not Started"}</span>
                </div>
              );
            })}
            {allDelegates.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:C.textMuted,fontSize:13}}>No delegates found in this committee.</div>}
          </div>
        </div>
      </div>
    );
  };

  const renderJurisdiction=()=>{
    if (lvl <= 4) {
      const scopeConference = isPlatformAdmin ? effectiveConference : user.conference;
      const committeesInScope = COMMITTEES.filter(c=>c.conference===scopeConference);
      return (
        <div>
          {isPlatformAdmin&&(
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,padding:"12px 16px",background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:10,flexWrap:"wrap"}}>
              <label style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.5}}>CONFERENCE</label>
              <select value={effectiveConference} onChange={e=>setViewConference(e.target.value)} style={{...inputSt,width:isMobile?"100%":"auto",maxWidth:"100%",background:"#fff",fontSize:13,padding:"6px 10px",boxSizing:"border-box"}}>
                {conferences.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          )}
          {committeesInScope.length===0&&<div style={{...card,textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>No committees registered for {scopeConference} yet.</div>}
          {committeesInScope.map(c=>{
            const members = DEMO_ACCOUNTS.filter(a=>a.committee===c.name && a.conference===scopeConference);
            const dais = members.filter(a=>a.role==="chair"||a.role==="cochair");
            const delegates = members.filter(a=>a.role==="delegate");
            return (
              <div key={c.id} style={{...card,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div><div style={{fontWeight:700,fontSize:15,color:C.navy}}>{c.name} <span style={{fontWeight:400,fontSize:12,color:C.textMuted}}>— {c.fullName}</span></div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{c.topic}</div></div>
                  <span style={{fontSize:11,color:C.textMuted}}>{delegates.length} delegate{delegates.length===1?"":"s"}</span>
                </div>
                <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.6,marginBottom:6}}>DAIS</div>
                {dais.length===0&&<div style={{fontSize:12,color:C.textMuted,marginBottom:10}}>No Chair or Co-Chair assigned yet.</div>}
                {dais.map(p=>{const r=ROLES.find(x=>x.id===p.role);return(
                  <div key={p.email} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>{p.name}</div><div style={{fontSize:11,color:C.textMuted}}>{p.email}</div></div>
                    <span style={{...pill(""),background:r?.bg,color:r?.color,fontSize:10}}>{r?.label}</span>
                  </div>
                );})}
                <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.6,margin:"14px 0 8px"}}>DELEGATES</div>
                {delegates.length===0&&<div style={{fontSize:12,color:C.textMuted}}>No delegates registered yet.</div>}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:8}}>
                  {delegates.map(d=>(<div key={d.email} style={{fontSize:12,padding:"7px 10px",background:C.bgSoft,borderRadius:6}}><span style={{fontWeight:600,color:C.navy}}>{d.country}</span><span style={{color:C.textMuted}}> — {d.name}</span></div>))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    const members = DEMO_ACCOUNTS.filter(a=>a.committee===userCommitteeName && a.conference===user.conference);
    const dais = members.filter(a=>a.role==="chair"||a.role==="cochair");
    const delegates = members.filter(a=>a.role==="delegate");
    return (
      <div style={card}>
        <div style={cardTitle}>{userCommitteeName||"Your Committee"} — Roster</div>
        {!userCommitteeName&&<div style={{fontSize:13,color:C.textMuted}}>No committee is assigned to your account.</div>}
        {userCommitteeName&&(
          <>
            <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.6,marginBottom:8}}>DAIS</div>
            {dais.map(p=>{const r=ROLES.find(x=>x.id===p.role);return(
              <div key={p.email} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                <div><div style={{fontSize:13,fontWeight:p.email===user.email?700:600,color:C.navy}}>{p.name}{p.email===user.email?" (You)":""}</div><div style={{fontSize:11,color:C.textMuted}}>{p.email}</div></div>
                <span style={{...pill(""),background:r?.bg,color:r?.color,fontSize:10}}>{r?.label}</span>
              </div>
            );})}
            <div style={{fontSize:11,fontWeight:700,color:C.textMuted,letterSpacing:0.6,margin:"16px 0 8px"}}>DELEGATES ({delegates.length})</div>
            {delegates.length===0&&<div style={{fontSize:12,color:C.textMuted}}>No delegates registered yet.</div>}
            {delegates.map(d=>(
              <div key={d.email} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{fontSize:13,fontWeight:d.email===user.email?700:400,color:C.text}}>Delegate – {d.country}{d.email===user.email?" (You)":""}</div>
                <span style={{fontSize:12,color:C.textMuted}}>{d.name}</span>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  const renderAlfred=()=>(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 145px)"}}>
      <div style={{background:C.navy,borderRadius:10,padding:"18px 22px",marginBottom:14,display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:46,height:46,borderRadius:10,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="28" height="28" viewBox="0 0 100 100" fill="white"><path d="M50 5a45 45 0 1 0 0 90A45 45 0 0 0 50 5zm0 6a39 39 0 1 1 0 78A39 39 0 0 1 50 11z"/><path d="M50 18c-6 0-13 2-17 6-2 2-3 4-2 6l2 4c-4 1-7 3-8 6-1 2 0 4 1 5 2 2 5 3 8 4v8c0 1 1 2 2 2h28c1 0 2-1 2-2v-8c3-1 6-2 8-4 1-1 2-3 1-5-1-3-4-5-8-6l2-4c1-2 0-4-2-6-4-4-11-6-17-6z"/><path d="M31 24c0-2 2-4 5-5 3-2 8-3 14-3s11 1 14 3c3 1 5 3 5 5 0 1-1 3-3 4H34c-2-1-3-3-3-4z"/><rect x="44" y="48" width="12" height="18" rx="2"/><path d="M38 58l6-10h12l6 10z"/></svg>
        </div>
        <div><div style={{fontWeight:700,fontSize:16,color:"#fff",fontFamily:"Georgia,serif"}}>Alfred Assistant</div><div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2}}>Personal MUN AI · Private per account</div></div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"6px 14px",textAlign:"right"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>Signed in as</div><div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)",marginTop:1}}>{user.name}</div></div>
          <button onClick={()=>setShowClearConfirm(true)} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,color:"rgba(255,255,255,0.6)",padding:"8px 14px",fontSize:12,cursor:"pointer",fontFamily:"system-ui"}}>🗑 Clear Chat</button>
        </div>
      </div>
      {showClearConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:12,padding:"28px 32px",width:360,maxWidth:"92vw",boxShadow:"0 16px 48px rgba(0,0,0,0.2)",fontFamily:"system-ui",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:12}}>🗑️</div><div style={{fontWeight:700,fontSize:16,color:C.navy,marginBottom:8}}>Clear Chat History?</div><div style={{fontSize:13,color:C.textMuted,marginBottom:24,lineHeight:1.6}}>This will permanently delete your conversation with Alfred.</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}><button onClick={()=>setShowClearConfirm(false)} style={{...mkBtn(),padding:"9px 22px"}}>Cancel</button><button onClick={clearAlfredChat} style={{...mkBtn("danger"),padding:"9px 22px"}}>Yes, Clear Chat</button></div>
          </div>
        </div>
      )}
      <div style={{flex:1,overflow:"auto",background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:10,padding:20,display:"flex",flexDirection:"column",marginBottom:12}}>
        {alfredMsgs.map((m,i)=>(
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start",marginBottom:18}}>
            <div style={{fontSize:11,color:C.textMuted,marginBottom:5}}>{m.role==="user"?user.name:"Alfred Assistant"}</div>
            {m.files&&m.files.length>0&&(
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:m.text?6:0,maxWidth:"78%"}}>
                {m.files.map(f=>f.kind==="image"?(
                  <div key={f.id} style={{background:C.bgSoft,borderRadius:8,padding:8,border:`1px solid ${C.border}`}}>
                    <img src={f.url} alt={f.name} style={{maxWidth:"100%",maxHeight:200,borderRadius:6,display:"block",marginBottom:6}}/>
                    <div style={{fontSize:11,color:C.textMuted}}>{f.name} · {(f.size/1024).toFixed(1)} KB</div>
                  </div>
                ):(
                  <div key={f.id} style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",display:"inline-flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:8,background:C.navyLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>{f.name}</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{(f.size/1024).toFixed(1)} KB · {f.type||"File"}</div></div>
                  </div>
                ))}
              </div>
            )}
            {m.text&&<div style={{background:m.role==="user"?C.navy:C.bg,color:m.role==="user"?"#fff":C.text,border:m.role==="user"?"none":`1px solid ${C.border}`,borderRadius:10,padding:"11px 15px",maxWidth:"78%",fontSize:13,lineHeight:1.7}}>{m.role==="assistant"?<AlfredMessage text={m.text}/>:m.text}</div>}
          </div>
        ))}
        {alfredLoading&&<div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",marginBottom:16}}><div style={{fontSize:11,color:C.textMuted,marginBottom:5}}>Alfred Assistant</div><div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 15px",fontSize:13,color:C.textMuted}}>Composing a response...</div></div>}
        <div ref={alfredEnd}/>
      </div>
      {alfredPendingFiles.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
          {alfredPendingFiles.map(f=>(
            <div key={f.id} style={{display:"flex",alignItems:"center",gap:8,background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 10px",fontSize:12,color:C.textSec}}>
              {f.kind==="image"?<img src={f.url} alt={f.name} style={{width:22,height:22,borderRadius:4,objectFit:"cover"}}/>:<span>📎</span>}
              <span style={{maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
              <button onClick={()=>removeAlfredPending(f.id)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:14,lineHeight:1,padding:0}}>×</button>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <input type="file" id="alfred-file-input" multiple accept="*/*" style={{display:"none"}} onChange={e=>{addAlfredAttachments(e.target.files);e.target.value="";}}/>
        <button onClick={()=>document.getElementById("alfred-file-input").click()} title="Attach file or media" style={{background:"none",border:`1px solid ${C.border}`,borderRadius:7,padding:"9px 10px",cursor:"pointer",color:C.textSec,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <input value={alfredInput} onChange={e=>setAlfredInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAlfred()} placeholder="Ask Alfred about MUN procedures, rules of debate..." style={{...inputSt,flex:1}}/>
        <button onClick={sendAlfred} disabled={alfredLoading} style={mkBtn("primary")}>Ask Alfred</button>
      </div>
    </div>
  );

  const renderClock=()=>{
    const h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
    const hDeg=(h%12)*30+m*0.5,mDeg=m*6+s*0.1,sDeg=s*6;
    const hx=80+60*Math.sin(hDeg*Math.PI/180),hy=80-60*Math.cos(hDeg*Math.PI/180);
    const mx=80+68*Math.sin(mDeg*Math.PI/180),my=80-68*Math.cos(mDeg*Math.PI/180);
    const sx=80+72*Math.sin(sDeg*Math.PI/180),sy=80-72*Math.cos(sDeg*Math.PI/180);
    const pct=timerPct();
    return(
      <div>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {[{k:"clock",l:"🕐 Clock"},{k:"timer",l:"⏱ Timer"},{k:"alarms",l:"🔔 Alarms"}].map(t=>(<button key={t.k} onClick={()=>setClockTab(t.k)} style={{padding:"8px 22px",borderRadius:7,border:`1px solid ${clockTab===t.k?C.navy:C.border}`,background:clockTab===t.k?C.navy:C.bg,color:clockTab===t.k?"#fff":C.textSec,fontFamily:"system-ui",fontSize:13,fontWeight:clockTab===t.k?600:400,cursor:"pointer"}}>{t.l}</button>))}
        </div>
        {clockTab==="clock"&&(
          <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
            <div style={{...card,flex:1,textAlign:"center",marginBottom:0}}>
              <div style={cardTitle}>Current Time</div>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{display:"block",margin:"0 auto 16px"}}>
                <circle cx="80" cy="80" r="78" fill={C.bgSoft} stroke={C.border} strokeWidth="2"/>
                {[...Array(12)].map((_,i)=>{const a=(i*30-90)*Math.PI/180;return <line key={i} x1={80+62*Math.cos(a)} y1={80+62*Math.sin(a)} x2={80+70*Math.cos(a)} y2={80+70*Math.sin(a)} stroke={C.navy} strokeWidth="2"/>;})}
                <line x1="80" y1="80" x2={hx} y2={hy} stroke={C.navy} strokeWidth="4" strokeLinecap="round"/>
                <line x1="80" y1="80" x2={mx} y2={my} stroke={C.navyMid} strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="80" y1="80" x2={sx} y2={sy} stroke={C.red} strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="80" cy="80" r="4" fill={C.navy}/><circle cx="80" cy="80" r="2" fill="#fff"/>
              </svg>
              <div style={{fontSize:36,fontWeight:700,color:C.navy,fontVariantNumeric:"tabular-nums",letterSpacing:2}}>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</div>
              <div style={{fontSize:13,color:C.textMuted,marginTop:6}}>{now.toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
            </div>
            <div style={{...card,width:220,marginBottom:0}}>
              <div style={cardTitle}>World Clocks</div>
              {[{city:"New York",tz:"America/New_York"},{city:"London",tz:"Europe/London"},{city:"New Delhi",tz:"Asia/Kolkata"},{city:"Tokyo",tz:"Asia/Tokyo"}].map(({city,tz})=>(<div key={city} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}><span style={{fontSize:13,color:C.text}}>{city}</span><span style={{fontSize:13,fontWeight:600,color:C.navy,fontVariantNumeric:"tabular-nums"}}>{new Date().toLocaleTimeString("en-US",{timeZone:tz,hour:"2-digit",minute:"2-digit",hour12:true})}</span></div>))}
            </div>
          </div>
        )}
        {clockTab==="timer"&&(
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
            <div style={{...card,marginBottom:0,textAlign:"center"}}>
              <div style={cardTitle}>Custom Timer{timerLabel?` — ${timerLabel}`:""}</div>
              <div style={{position:"relative",width:180,height:180,margin:"0 auto 20px"}}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="80" fill="none" stroke={C.bgMuted} strokeWidth="10"/>
                  <circle cx="90" cy="90" r="80" fill="none" stroke={timerColor2} strokeWidth="10" strokeDasharray={`${2*Math.PI*80}`} strokeDashoffset={`${2*Math.PI*80*(1-pct/100)}`} strokeLinecap="round" transform="rotate(-90 90 90)" style={{transition:"stroke-dashoffset 1s linear,stroke 0.5s"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:32,fontWeight:700,color:timerFinished?C.red:timerColor2,fontVariantNumeric:"tabular-nums",letterSpacing:1}}>{fmtTimer(timerSec)}</div>{timerFinished&&<div style={{fontSize:12,color:C.red,fontWeight:600,marginTop:4}}>Time's up!</div>}</div>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"center"}}><button onClick={()=>{setTimerActive(!timerActive);setTimerFinished(false);}} style={mkBtn(timerActive?"danger":"success")}>{timerActive?"Pause":"Start"}</button><button onClick={()=>{setTimerActive(false);applyTimerInput();}} style={mkBtn()}>Reset</button></div>
            </div>
            <div style={{...card,marginBottom:0}}>
              <div style={cardTitle}>Set Timer</div>
              <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:C.textMuted,letterSpacing:1,display:"block",marginBottom:6}}>LABEL</label><input value={timerLabel} onChange={e=>setTimerLabel(e.target.value)} placeholder="e.g. Speech Time" style={inputSt}/></div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:C.textMuted,letterSpacing:1,display:"block",marginBottom:8}}>DURATION</label>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:8}}>
                  {[{k:"h",l:"Hours"},{k:"m",l:"Minutes"},{k:"s",l:"Seconds"}].map(({k,l})=>(<div key={k}><div style={{fontSize:11,color:C.textMuted,marginBottom:4,textAlign:"center"}}>{l}</div><input type="number" min="0" max={k==="h"?23:59} value={timerInput[k]} onChange={e=>setTimerInput(p=>({...p,[k]:e.target.value}))} style={{...inputSt,textAlign:"center",fontSize:18,fontWeight:700,padding:"10px 6px"}}/></div>))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:C.textMuted,letterSpacing:1,display:"block",marginBottom:8}}>QUICK PRESETS</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{[{l:"1 min",h:0,m:1,s:0},{l:"5 min",h:0,m:5,s:0},{l:"10 min",h:0,m:10,s:0}].map(p=>(<button key={p.l} onClick={()=>{setTimerInput({h:String(p.h),m:String(p.m),s:String(p.s)});setTimerSec(p.h*3600+p.m*60+p.s);setTimerActive(false);setTimerFinished(false);}} style={{...mkBtn(),padding:"5px 12px",fontSize:12}}>{p.l}</button>))}</div>
              </div>
              <button onClick={applyTimerInput} style={{...mkBtn("primary"),width:"100%"}}>Set Timer</button>
            </div>
          </div>
        )}
        {clockTab==="alarms"&&(
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
            <div style={{...card,marginBottom:0}}>
              <div style={cardTitle}>Add New Alarm</div>
              <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:C.textMuted,letterSpacing:1,display:"block",marginBottom:6}}>ALARM TIME</label><input type="time" value={alarmInput.time} onChange={e=>setAlarmInput(p=>({...p,time:e.target.value}))} style={{...inputSt,fontSize:18,fontWeight:700}}/></div>
              <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:C.textMuted,letterSpacing:1,display:"block",marginBottom:6}}>LABEL</label><input value={alarmInput.label} onChange={e=>setAlarmInput(p=>({...p,label:e.target.value}))} placeholder="e.g. Lunch Break" style={inputSt}/></div>
              <div style={{marginBottom:20,display:"flex",alignItems:"center",gap:10}}><input type="checkbox" id="repeat" checked={alarmInput.repeat} onChange={e=>setAlarmInput(p=>({...p,repeat:e.target.checked}))} style={{width:16,height:16,accentColor:C.navy}}/><label htmlFor="repeat" style={{fontSize:13,color:C.text,cursor:"pointer"}}>Repeat daily</label></div>
              <button onClick={addAlarm} style={{...mkBtn("primary"),width:"100%"}}>+ Add Alarm</button>
            </div>
            <div style={{...card,marginBottom:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={cardTitle}>Active Alarms</div>{alarms.length>0&&<button onClick={()=>setAlarms([])} style={{...mkBtn("danger"),padding:"4px 10px",fontSize:11}}>Clear All</button>}</div>
              {alarms.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:C.textMuted,fontSize:13}}>No alarms set yet.</div>}
              {alarms.map(a=>(<div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}><div style={{flex:1}}><div style={{fontWeight:700,fontSize:18,color:a.enabled?C.navy:C.textMuted,fontVariantNumeric:"tabular-nums"}}>{a.time}</div><div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{a.label}{a.repeat?" · Repeats daily":""}</div></div><div onClick={()=>setAlarms(al=>al.map(x=>x.id===a.id?{...x,enabled:!x.enabled}:x))} style={{width:40,height:22,borderRadius:11,background:a.enabled?C.navy:C.border,cursor:"pointer",position:"relative",flexShrink:0}}><div style={{position:"absolute",top:3,left:a.enabled?20:3,width:16,height:16,borderRadius:"50%",background:"#fff"}}/></div><button onClick={()=>setAlarms(al=>al.filter(x=>x.id!==a.id))} style={{...mkBtn("danger"),padding:"4px 8px",fontSize:11}}>✕</button></div>))}
            </div>
          </div>
        )}
        {alarmFired&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{background:"#fff",borderRadius:14,padding:"32px 36px",width:340,textAlign:"center",boxShadow:"0 24px 60px rgba(0,0,0,0.25)",fontFamily:"system-ui"}}>
              <div style={{fontSize:40,marginBottom:12}}>🔔</div><div style={{fontWeight:700,fontSize:20,color:C.navy,marginBottom:6}}>{alarmFired.label}</div><div style={{fontSize:28,fontWeight:700,color:C.gold,marginBottom:16,fontVariantNumeric:"tabular-nums"}}>{alarmFired.time}</div>
              <button onClick={()=>setAlarmFired(null)} style={{...mkBtn("primary"),width:"100%",padding:"11px"}}>Dismiss</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNotes=()=>(
    <div>
      <div style={{...card,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:knowledgeNotes.length?14:0}}>
          <div style={cardTitle}>📚 Professional Notes</div>
          <span style={{fontSize:11,color:C.textMuted}}>Curated by Conference Admin</span>
        </div>
        {knowledgeNotes.length===0&&<div style={{fontSize:13,color:C.textMuted,padding:"6px 0"}}>The admin hasn't published any professional notes yet.</div>}
        {knowledgeNotes.length>0&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
            {knowledgeNotes.map(n=>(
              <div key={n.id} style={{background:C.bgSoft,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontWeight:700,fontSize:14,color:C.navy,marginBottom:6}}>{n.title}</div>
                <div style={{fontSize:12.5,color:C.textSec,lineHeight:1.7}}><TruncatedText text={n.text} maxLength={200}/></div>
              </div>
            ))}
          </div>
        )}
      </div>
    <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"340px 1fr",gap:16,alignItems:"flex-start"}}>
      <div style={{...card,position:"sticky",top:0}}>
        <div style={cardTitle}>{editingNoteId?"Edit Note":"New Note"}</div>
        <div style={{marginBottom:12}}>
          <input value={noteInput.title} onChange={e=>setNoteInput(p=>({...p,title:e.target.value}))} placeholder="Note title" style={{...inputSt,fontWeight:600}}/>
        </div>
        <div style={{marginBottom:14}}>
          <textarea value={noteInput.text} onChange={e=>setNoteInput(p=>({...p,text:e.target.value}))} placeholder="Write your notes here — country policy, key clauses, allies, negotiation points..." style={{...inputSt,height:220,resize:"vertical",lineHeight:1.6,fontFamily:"system-ui"}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={saveNote} style={{...mkBtn("primary"),flex:1}}>{editingNoteId?"Save Changes":"+ Add Note"}</button>
          {editingNoteId&&<button onClick={cancelNoteEdit} style={mkBtn()}>Cancel</button>}
        </div>
        <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`,fontSize:11,color:C.textMuted,lineHeight:1.6}}>
          Notes are private to your account and visible only to you for this session — {currentRole.label} · {user.conference}.
        </div>
      </div>
      <div>
        {myNotes.length===0&&(
          <div style={{...card,textAlign:"center",padding:48,color:C.textMuted}}>
            <div style={{fontSize:32,marginBottom:10}}>🗒️</div>
            <div style={{fontWeight:600,fontSize:15,color:C.textSec}}>No notes yet</div>
            <div style={{fontSize:13,marginTop:4}}>Use the panel on the left to jot down your first note.</div>
          </div>
        )}
        {myNotes.map(n=>(
          <div key={n.id} style={{...card,borderLeft:`4px solid ${editingNoteId===n.id?C.gold:C.navy}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:8}}>
              <div style={{fontWeight:700,fontSize:15,color:C.navy}}>{n.title}</div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={()=>editNote(n)} style={{...mkBtn(),padding:"4px 10px",fontSize:11}}>Edit</button>
                <button onClick={()=>setNoteDeleteConfirm(n.id)} style={{...mkBtn("danger"),padding:"4px 10px",fontSize:11}}>Delete</button>
              </div>
            </div>
            <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>{n.text?<TruncatedText text={n.text} maxLength={260}/>:<span style={{color:C.textMuted,fontStyle:"italic"}}>No content</span>}</div>
            <div style={{fontSize:11,color:C.textMuted,marginTop:10}}>Last edited {n.updatedAt}</div>
          </div>
        ))}
      </div>
      {noteDeleteConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:12,padding:"28px 32px",width:340,maxWidth:"92vw",boxShadow:"0 16px 48px rgba(0,0,0,0.2)",fontFamily:"system-ui",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:12}}>🗑️</div>
            <div style={{fontWeight:700,fontSize:16,color:C.navy,marginBottom:8}}>Delete this note?</div>
            <div style={{fontSize:13,color:C.textMuted,marginBottom:24,lineHeight:1.6}}>This action cannot be undone.</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>setNoteDeleteConfirm(null)} style={{...mkBtn(),padding:"9px 22px"}}>Cancel</button>
              <button onClick={()=>deleteNote(noteDeleteConfirm)} style={{...mkBtn("danger"),padding:"9px 22px"}}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );

  const TAB_ICONS_LIST = TAB_ICONS;

  return (
    <div style={{fontFamily:"'Georgia','Times New Roman',serif",minHeight:"100vh",background:C.bgSoft,color:C.text,display:"flex",flexDirection:"column"}}>
      <div style={{background:C.bg,borderBottom:`1px solid ${C.border}`,padding:isMobile?"0 10px":"0 16px",display:"flex",alignItems:"center",height:52,gap:isMobile?6:10,position:"sticky",top:0,zIndex:50}}>
        <button onClick={()=>setNavOpen(o=>!o)} style={{display:"flex",flexDirection:"column",gap:4,padding:"6px",background:"none",border:"none",cursor:"pointer",flexShrink:0}}>
          <div style={{width:20,height:2,background:navOpen?C.navy:C.textSec,borderRadius:2,transition:"all 0.2s",transform:navOpen?"rotate(45deg) translateY(6px)":"none"}}/>
          <div style={{width:20,height:2,background:navOpen?C.navy:C.textSec,borderRadius:2,transition:"all 0.2s",opacity:navOpen?0:1}}/>
          <div style={{width:20,height:2,background:navOpen?C.navy:C.textSec,borderRadius:2,transition:"all 0.2s",transform:navOpen?"rotate(-45deg) translateY(-6px)":"none"}}/>
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0,overflow:"hidden"}}>
          <div style={{width:24,height:24,background:C.navy,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontSize:12,fontWeight:700,fontFamily:"Georgia,serif"}}>A</span></div>
          {!isMobile&&<span style={{fontWeight:700,fontSize:16,color:C.navy,fontFamily:"Georgia,serif"}}>Accord</span>}
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:isMobile?6:8,fontFamily:"system-ui",flexShrink:0}}>
          {!isMobile&&<div style={{textAlign:"right"}}><div style={{fontSize:11,fontWeight:600,color:C.navy,lineHeight:1.2}}>{user.name}</div><div style={{fontSize:10,color:C.textMuted}}>{currentRole.label}</div></div>}
          <div style={{width:30,height:30,borderRadius:"50%",background:currentRole.bg,color:currentRole.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
          <button onClick={()=>{setUser(null);setHasEnteredMUN(false);setProfileView(false);}} style={{...mkBtn(),padding:isMobile?"4px 8px":"4px 10px",fontSize:11}}>{isMobile?"Out":"Sign out"}</button>
        </div>
      </div>
      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>
        {navOpen&&<div onClick={()=>setNavOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:39}}/>}
        <div style={{width:220,background:C.bg,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"12px 0",position:"fixed",top:52,bottom:0,left:0,zIndex:40,transform:navOpen?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s ease",boxShadow:navOpen?"4px 0 24px rgba(0,0,0,0.1)":"none",overflowY:"auto"}}>
          <div style={{padding:"0 14px 8px",fontSize:10,fontWeight:700,color:C.textMuted,letterSpacing:1.2,fontFamily:"system-ui"}}>NAVIGATION</div>
          {tabs.map(t=>(<button key={t.id} onClick={()=>{setActiveTab(t.id);setNavOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:activeTab===t.id?C.navyLight:"transparent",color:activeTab===t.id?C.navy:C.textSec,border:"none",width:"100%",textAlign:"left",cursor:"pointer",fontSize:13,fontWeight:activeTab===t.id?600:400,borderLeft:`3px solid ${activeTab===t.id?C.navy:"transparent"}`,fontFamily:"system-ui"}}><span style={{width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:activeTab===t.id?1:0.6}}>{TAB_ICONS_LIST[t.id]||"•"}</span>{t.label}</button>))}
          <div style={{marginTop:"auto",padding:"14px",borderTop:`1px solid ${C.border}`,fontFamily:"system-ui"}}><div style={{fontSize:10,color:C.textMuted}}>Active conference</div><div style={{fontSize:12,fontWeight:600,color:C.navy,marginTop:2}}>{user.conference}</div><div style={{marginTop:8,padding:"3px 9px",borderRadius:6,background:currentRole.bg,color:currentRole.color,fontSize:10,fontWeight:600,display:"inline-block"}}>{currentRole.label}</div></div>
        </div>
        <div style={{flex:1,overflow:"auto",padding:16,fontFamily:"system-ui"}}>
          {activeTab==="dashboard" && renderDashboard()}
          {activeTab==="community" && renderCommunity()}
          {activeTab==="speakers"  && renderSpeakers()}
          {activeTab==="voting"    && (can(role,"access_voting") ? renderVoting() : <Lock reason="Voting records are only available to the Chair and Co-Chair."/>)}
          {activeTab==="scorecard" && renderScorecard()}
          {activeTab==="jurisdiction" && renderJurisdiction()}
          {activeTab==="alfred"    && renderAlfred()}
          {activeTab==="notes"     && renderNotes()}
          {activeTab==="clock"     && renderClock()}
          {activeTab==="admin"     && (can(role,"access_admin_panel") ? <AdminPanel knowledgeNotes={knowledgeNotes} setKnowledgeNotes={setKnowledgeNotes} conferences={conferences} setConferences={setConferences} adminSchools={adminSchools} setAdminSchools={setAdminSchools}/> : <Lock reason="Platform Admin access only."/>)}
        </div>
      </div>
    </div>
  );
}
