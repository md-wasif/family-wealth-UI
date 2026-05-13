import React, { useState, useEffect, useCallback, useRef } from "react";

/*
  FAMILY WEALTH COMMAND CENTER v4.0
  ═════════════════════════════════════
  Complete Estate Management Platform
  
  FEATURES:
  - Dashboard with net worth tracking
  - Trust management with full asset registry
  - Demand Note engine with auto-balance alerts
  - Investment portfolio (crypto, stocks, metals, NFTs, RWAs)
  - LLC management
  - Foundation/PMA management with auto donation certificates
  - Insurance & Annuities
  - Banking with commingling checks
  - Form 1041 auto-generator
  - P&L reports
  - AI Strategic Advisor (Claude-powered)
  - Document vault
  - Governance & beneficiary management
  - Succession & emergency protocols
  - Calendar & deadlines
  - Contacts directory
  - Audit log
  - Auto meeting minutes & beneficiary reports
  - Client deployment capability
*/

const CL = {
  bg:"#0a0e1a",c1:"#111827",c2:"#1a2035",bd:"#2a3150",bd2:"#374165",
  go:"#d4a843",goD:"#9b7d30",goG:"rgba(212,168,67,0.12)",
  gr:"#34d399",grB:"rgba(52,211,153,0.1)",
  rd:"#f87171",rdB:"rgba(248,113,113,0.1)",
  am:"#fbbf24",amB:"rgba(251,191,36,0.1)",
  bl:"#60a5fa",blB:"rgba(96,165,250,0.1)",
  pu:"#c084fc",puB:"rgba(192,132,252,0.1)",
  cy:"#22d3ee",cyB:"rgba(34,211,238,0.1)",
  tx:"#e8ecf4",dm:"#94a3b8",mt:"#64748b",wh:"#fff"
};

const SK="family-v4";
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const fmt=n=>`$${(parseFloat(n)||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fK=n=>{const v=parseFloat(n)||0;return v>=1e6?`$${(v/1e6).toFixed(2)}M`:v>=1e3?`$${(v/1e3).toFixed(1)}K`:fmt(v)};
const ds=d=>{if(!d)return 999;return Math.floor((Date.now()-new Date(d).getTime())/864e5)};
const today=()=>new Date().toISOString().slice(0,10);
const ts=()=>new Date().toISOString().replace("T"," ").slice(0,19);

const init=()=>({
  meta:{clientName:"",clientEmail:"",deployId:uid()},
  trust:{name:"",ein:"",situs:"",established:"",renewalDate:"",renewalPeriod:"21",
    assets:[],demandNotes:[],draws:[],expenses:[],income:[],beneficiaries:[],minutes:[]},
  governance:{protector:{name:"",phone:"",email:"",appointed:""},
    trustees:[{role:"First Trustee",name:"",phone:"",email:"",status:"active",appointed:""}],
    successors:[{name:"",phone:"",email:"",order:1}],
    settlor:{name:"",phone:"",email:""},
    triggerStatus:"none",triggerNotes:""},
  portfolio:{crypto:[],stocks:[],metals:[],nfts:[],rwas:[],other:[]},
  pma:{name:"",ein:"",trustee:"",established:"",type:"§508(c)(1)(A)",situs:"",mission:"",purpose:"",articles:"",bylaws:"",annualMeetingDate:"",lastAnnualMeeting:"",donations:[],expenses:[],members:[],income:[],resolutions:[]},
  llc:{entities:[],income:[],expenses:[],msas:[],leases:[]},
  insurance:{policies:[]},
  annuities:{contracts:[]},
  banking:{accounts:[]},
  documents:{files:[]},
  contacts:[],
  calendar:[],
  distributions:[],
  netWorthHistory:[],
  succession:{plan:"",emergencyContacts:[],accessProtocol:""},
  taxData:{year:"2025"},
  settings:{lastRecon:"",lastMinutes:"",lastAnnual:""},
  auditLog:[],
  aiHistory:[],
  personalTax:{
    filingStatus:"single",
    w2s:[],
    income1099:[],
    otherIncome:[],
    adjustments:[],
    itemizedDeductions:[],
    credits:[],
    estimatedPayments:[],
    standardDeduction:true
  },
  clientProfile:{
    clientType:"both",
    dob:"",age:"",maritalStatus:"",dependents:[],
    riskTolerance:"moderate",timeHorizon:"10+",retirementAge:"65",
    annualIncomeGoal:"",currentAnnualIncome:"",healthStatus:"good",
    occupation:"",employer:"",stateOfResidence:"",
    goals:[],priorities:"",investmentExperience:"intermediate",
    notes:""
  },
  taxSavings:{
    deferredCapGains:[],
    deferredTaxes:[],
    donationSavings:[],
    otherSavings:[],
    yearlySnapshots:[]
  },
  debt:{items:[]},
  retirement:{accounts:[]},
  realEstate:{properties:[]},
  cashFlow:{projections:[],monthlyBudget:{income:0,fixedExpenses:0,variableExpenses:0,savings:0}},
  billPay:{bills:[],connections:[]},
  compliance:{items:[]},
  clientCalls:[],
  opsManualGenerated:{trust:false,pma:false,both:false},
  financialProfile:{lastUpdated:"",windfall:"",marketDrop:"",riskChoice:"",involvement:"",fearFactor:"",decisionStyle:"",freedomDef:"",debtTool:"",corePriority:"",identity:""}
});

const deepMerge=(target,source)=>{const result={...source};for(const key of Object.keys(target)){if(!(key in result)){result[key]=target[key];}else if(target[key]&&typeof target[key]==='object'&&!Array.isArray(target[key])&&typeof result[key]==='object'&&!Array.isArray(result[key])){result[key]=deepMerge(target[key],result[key]);}};return result;};
const ld=async()=>{try{const r=await window.storage.get(SK);if(r){const saved=JSON.parse(r.value);return deepMerge(init(),saved);}return init();}catch{return init();}};
const sv=async d=>{try{await window.storage.set(SK,JSON.stringify(d));}catch(e){console.error(e);}};

// ═══ COMPONENTS ═══
const Badge=({t:tp})=>{const c={critical:CL.rd,warning:CL.am,info:CL.bl,success:CL.gr};const b={critical:CL.rdB,warning:CL.amB,info:CL.blB,success:CL.grB};return <span style={{padding:"2px 8px",borderRadius:10,fontSize:9,fontWeight:700,color:c[tp],background:b[tp],textTransform:"uppercase",letterSpacing:1}}>{tp}</span>};

const Stat=({label,value,sub,color,icon})=>(<div style={{background:`linear-gradient(145deg, ${CL.c1}, ${CL.c2})`,border:`1px solid ${CL.bd}`,borderRadius:12,padding:"16px 20px",flex:1,minWidth:160,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
  <div style={{fontSize:10,color:CL.mt,textTransform:"uppercase",letterSpacing:1.5,marginBottom:5,display:"flex",alignItems:"center",gap:5}}>{icon&&<span>{icon}</span>}{label}</div>
  <div style={{fontSize:24,fontWeight:800,color:color||CL.go,fontFamily:"'JetBrains Mono',monospace"}}>{value}</div>
  {sub&&<div style={{fontSize:10,color:CL.dm,marginTop:2}}>{sub}</div>}
</div>);

const Card=({children,style:s,danger})=><div style={{background:`linear-gradient(145deg, ${CL.c1}, ${CL.c2})`,border:`1px solid ${danger?CL.rd:CL.bd}`,borderRadius:12,padding:18,boxShadow:"0 2px 8px rgba(0,0,0,0.15)",...s}}>{children}</div>;

const Inp=({label,value,onChange,placeholder,type,disabled})=>(<div style={{marginBottom:8}}>
  {label&&<label style={{fontSize:9,color:CL.mt,display:"block",marginBottom:2,textTransform:"uppercase",letterSpacing:1}}>{label}</label>}
  <input type={type||"text"} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
    style={{width:"100%",padding:"7px 10px",background:disabled?CL.c2:CL.bg,border:`1px solid ${CL.bd}`,borderRadius:5,color:CL.tx,fontSize:12,boxSizing:"border-box",outline:"none"}} />
</div>);

const Sel=({label,value,onChange,options})=>(<div style={{marginBottom:8}}>
  {label&&<label style={{fontSize:9,color:CL.mt,display:"block",marginBottom:2,textTransform:"uppercase",letterSpacing:1}}>{label}</label>}
  <select value={value||""} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"7px 10px",background:CL.bg,border:`1px solid ${CL.bd}`,borderRadius:5,color:CL.tx,fontSize:12,boxSizing:"border-box"}}>
    <option value="">Select...</option>{options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
  </select>
</div>);

const Btn=({children,onClick,v,sm})=>(<button onClick={onClick} style={{padding:sm?"4px 10px":"8px 16px",borderRadius:5,border:"none",cursor:"pointer",fontWeight:600,fontSize:sm?10:12,
  background:v==="danger"?CL.rd:v==="ghost"?"transparent":v==="blue"?CL.bl:v==="green"?CL.gr:CL.go,color:v==="ghost"?CL.dm:CL.bg,...(v==="ghost"&&{border:`1px solid ${CL.bd}`}),transition:"all 0.15s"}}>{children}</button>);

const TH=({headers,rows,onDel})=>(<div style={{overflowX:"auto",borderRadius:6,border:`1px solid ${CL.bd}`,maxHeight:350,overflowY:"auto"}}>
  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
    <thead style={{position:"sticky",top:0}}><tr>{headers.map((h,i)=><th key={i} style={{padding:"7px 10px",textAlign:"left",background:CL.c2,color:CL.mt,fontWeight:600,fontSize:9,textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${CL.bd}`}}>{h}</th>)}{onDel&&<th style={{padding:"7px",background:CL.c2,borderBottom:`1px solid ${CL.bd}`,width:24}}></th>}</tr></thead>
    <tbody>{rows.map((row,i)=><tr key={i} style={{borderBottom:`1px solid ${CL.bd}`}}>{row.map((cell,j)=><td key={j} style={{padding:"7px 10px",color:CL.tx}}>{cell}</td>)}{onDel&&<td style={{padding:"7px"}}><span onClick={()=>onDel(i)} style={{cursor:"pointer",color:CL.rd,fontSize:13}}>&times;</span></td>}</tr>)}</tbody>
  </table>
</div>);

const Sec=({title,children,tag,actions})=>(<div style={{marginBottom:24}}>
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
    <h2 style={{fontSize:16,fontWeight:700,color:CL.wh,margin:0}}>{title}</h2>
    {tag&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:6,background:CL.goG,color:CL.go,fontWeight:700,letterSpacing:1}}>{tag}</span>}
    {actions&&<div style={{marginLeft:"auto",display:"flex",gap:6}}>{actions}</div>}
  </div>{children}
</div>);

const PBar=({used,total})=>{const p=total?(used/total*100):0;const col=p>90?CL.rd:p>75?CL.am:CL.gr;return <div>
  <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:CL.dm,marginBottom:3}}><span>{fmt(used)} used</span><span>{fmt(total-used)} remaining</span></div>
  <div style={{background:CL.bg,borderRadius:5,height:8,overflow:"hidden"}}><div style={{background:col,height:"100%",width:`${Math.min(100,p)}%`,borderRadius:5,transition:"width 0.3s"}}/></div>
</div>};

const TextArea=({label,value,onChange,rows})=>(<div style={{marginBottom:8}}>
  {label&&<label style={{fontSize:9,color:CL.mt,display:"block",marginBottom:2,textTransform:"uppercase",letterSpacing:1}}>{label}</label>}
  <textarea value={value||""} onChange={e=>onChange(e.target.value)} rows={rows||4}
    style={{width:"100%",padding:"7px 10px",background:CL.bg,border:`1px solid ${CL.bd}`,borderRadius:5,color:CL.tx,fontSize:12,boxSizing:"border-box",outline:"none",resize:"vertical",fontFamily:"inherit"}} />
</div>);

// ═══ DOCUMENT VIEWER MODAL ═══
const DocViewer=({doc,onClose,onSave})=>{
  const[editing,setEditing]=useState(false);
  const[content,setContent]=useState(doc?.content||"");
  const handlePrint=()=>{const w=window.open("","_blank","width=800,height=600");if(w){w.document.write(`<html><head><title>${doc.name}</title><style>body{font-family:'Courier New',monospace;white-space:pre-wrap;padding:40px;font-size:13px;line-height:1.6;max-width:800px;margin:0 auto;}@media print{body{padding:20px;}}</style></head><body>${content.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</body></html>`);w.document.close();w.print();}};
  const handleDownload=()=>{const blob=new Blob([content],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=doc.name;a.click();URL.revokeObjectURL(url);};
  return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{background:CL.c1,borderRadius:12,border:`1px solid ${CL.bd}`,width:"90%",maxWidth:900,maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${CL.bd}`}}>
        <div><div style={{fontSize:14,fontWeight:700,color:CL.wh}}>{doc.name}</div><div style={{fontSize:10,color:CL.dm}}>{doc.category||doc.type} \u2022 {doc.date}</div></div>
        <div style={{display:"flex",gap:6}}>
          <Btn sm v="blue" onClick={handlePrint}>\u2399 Print</Btn>
          <Btn sm v="green" onClick={handleDownload}>\u2913 Download</Btn>
          <Btn sm v={editing?"blue":"ghost"} onClick={()=>{if(editing){onSave(content);setEditing(false);}else setEditing(true);}}>{editing?"Save Changes":"Edit"}</Btn>
          <Btn sm v="ghost" onClick={onClose}>\u2715 Close</Btn>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:16}}>
        {editing?<textarea value={content} onChange={e=>setContent(e.target.value)} style={{width:"100%",height:"100%",minHeight:400,background:CL.bg,border:`1px solid ${CL.bd}`,borderRadius:6,color:CL.tx,fontSize:12,fontFamily:"'Courier New',monospace",padding:16,boxSizing:"border-box",outline:"none",resize:"vertical",lineHeight:1.6,whiteSpace:"pre-wrap"}}/>
        :<pre style={{margin:0,fontSize:12,lineHeight:1.6,color:CL.tx,fontFamily:"'Courier New',monospace",whiteSpace:"pre-wrap",padding:16,background:CL.bg,borderRadius:6,minHeight:400}}>{content}</pre>}
      </div>
    </div>
  </div>;
};

// ═══ DONATION CERTIFICATE GENERATOR ═══
const genDonationCert = (pma, donation) => {
  return `CERTIFICATE OF DONATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pma.name || "[Foundation Name]"}
A §508(c)(1)(A) Tax-Exempt Religious Organization
EIN: ${pma.ein || "[EIN]"}

Certificate Number: ${donation.certNo || "D-" + uid().toUpperCase()}
Date of Donation: ${donation.date || today()}

DONOR: ${donation.donor || "[Donor Name]"}

DONATION DETAILS:
Type: ${donation.type || "Cash"}
Amount: ${fmt(donation.amount)}
Mission Bucket: ${donation.bucket || "General"}

TAX DEDUCTIBILITY STATEMENT:
This organization is a §508(c)(1)(A) tax-exempt religious organization. No goods or services were provided in exchange for this contribution unless noted below. This contribution may be deductible to the extent allowed by law under IRC §170. Donors should consult their own tax advisor.

Goods/Services Provided: ${donation.goodsServices || "None"}

Authorized by: ${pma.trustee || "[Trustee Name]"}
Date: ${donation.date || today()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This receipt should be retained for your tax records.`;
};

// ═══ AUTO MEETING MINUTES ═══
const genMinutes = (data) => {
  const d = today();
  const trustPL = {
    inc: (data.trust.income||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0),
    exp: (data.trust.expenses||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0)
  };
  const notesBal = (data.trust.demandNotes||[]).reduce((s,n)=>s+(parseFloat(n.amount)||0),0) - (data.trust.draws||[]).reduce((s,d)=>s+(parseFloat(d.amount)||0),0);

  return `TRUST MEETING MINUTES
${data.trust.name || "[Trust Name]"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: ${d}
Type: Regular Monthly Meeting
Location: [Location / Virtual]
Called to Order: [Time]

ATTENDANCE:
Present: ${(data.governance.trustees||[]).filter(t=>t.status==="active").map(t=>t.name||"[Name]").join(", ")}

FINANCIAL REPORT:
Trust Income YTD: ${fmt(trustPL.inc)}
Trust Expenses YTD: ${fmt(trustPL.exp)}
Net Trust Income: ${fmt(trustPL.inc - trustPL.exp)}
Demand Note Balance: ${fmt(notesBal)}
Total Assets: ${fmt((data.trust.assets||[]).reduce((s,a)=>s+(parseFloat(a.costBasis)||0),0))}
Insurance Cash Value: ${fmt((data.insurance.policies||[]).reduce((s,p)=>s+(parseFloat(p.cashValue)||0),0))}

OLD BUSINESS:
[Record any continuing items]

NEW BUSINESS:
[Record any new items discussed]

RESOLUTIONS:
[Record any resolutions adopted]

ADJOURNMENT:
Meeting adjourned at [Time].
Next meeting: [Date]

Recorded by: ___________________________
Approved by: ___________________________`;
};

// ═══ BENEFICIARY REPORT ═══
const genBeneficiaryReport = (data, beneficiary) => {
  return `MONTHLY BENEFICIARY REPORT
${data.trust.name || "[Trust Name]"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Date: ${today()}
Beneficiary: ${beneficiary.name}
Units Held: ${beneficiary.units || 0} of 100

TRUST STATUS: Active and in good standing.

YOUR INTEREST:
You hold ${beneficiary.units || 0} Units of Beneficial Interest. These units are administered by the Board of Trustees and represent an administrative proportion for discretionary distributions only. Units do not confer ownership of Trust property.

KEY REMINDERS:
• All distributions are purely discretionary
• Units are non-transferable
• Contact the Trustee with any questions

TRUST ADMINISTRATION:
The Trust continues to be administered in accordance with the Trust Indenture for the benefit of all Beneficiaries.

This report is confidential. Do not share with third parties.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
};

// ═══ FOUNDATION MEETING MINUTES ═══
const genPMAMinutes = (data) => {
  const d = today();
  const totalDonations = (data.pma.donations||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const totalPMAExp = (data.pma.expenses||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const totalPMAInc = (data.pma.income||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  return `ANNUAL MEETING MINUTES
${data.pma.name || "[Foundation Name]"}
A §508(c)(1)(A) Tax-Exempt Religious Organization
EIN: ${data.pma.ein || "[EIN]"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: ${d}
Type: ${ds(data.pma.lastAnnualMeeting)>300?"Annual":"Regular"} Meeting
Location: [Location / Virtual]
Called to Order: [Time]

ATTENDANCE:
Trustee/Director: ${data.pma.trustee || "[Name]"}
Members Present: ${(data.pma.members||[]).filter(m=>m.status==="active").map(m=>m.name||"[Name]").join(", ") || "[List members]"}

OPENING:
Meeting opened with prayer/invocation as required by organizational bylaws.

MISSION STATEMENT:
${data.pma.mission || "[Organization mission statement]"}

FINANCIAL REPORT:
Total Donations Received YTD: ${fmt(totalDonations)}
Total Ministry Income YTD: ${fmt(totalPMAInc)}
Total Expenses YTD: ${fmt(totalPMAExp)}
Net Position: ${fmt(totalDonations + totalPMAInc - totalPMAExp)}
Number of Donation Certificates Issued: ${(data.pma.donations||[]).length}

MINISTRY ACTIVITIES:
[Record ministry activities conducted since last meeting]

MISSION BUCKET ALLOCATION:
${["Religious","Educational","Wellness","Charitable","Family Welfare","Operations"].map(b=>{
  const amt=(data.pma.donations||[]).filter(d=>d.bucket===b).reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
  return `${b}: ${fmt(amt)}`;
}).join("\n")}

OLD BUSINESS:
[Record any continuing items]

NEW BUSINESS:
[Record any new items discussed]

RESOLUTIONS:
[Record any resolutions adopted]

ELECTION OF OFFICERS (if Annual):
[Record any officer elections]

ADJOURNMENT:
Meeting adjourned at [Time] with closing prayer.
Next meeting: [Date]

Recorded by: ___________________________
Approved by: ___________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This document should be retained permanently as part of the
organization's corporate records per §508(c)(1)(A) requirements.`;
};

// ═══ FOUNDATION MEMBER CERTIFICATE ═══
const genMemberCert = (pma, member) => {
  return `CERTIFICATE OF MEMBERSHIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pma.name || "[Foundation Name]"}
A §508(c)(1)(A) Tax-Exempt Religious Organization
EIN: ${pma.ein || "[EIN]"}

This certifies that:

${member.name || "[Member Name]"}

is a duly appointed ${member.role || "Member"} of the above-named organization,
effective ${member.joined || today()}.

Role: ${member.role || "Member"}
Status: ${member.status || "Active"}

This membership is granted in accordance with the organization's
Articles of Association and Bylaws.

Authorized by: ${pma.trustee || "[Trustee Name]"}
Date: ${today()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
};

// ═══ FOUNDATION ANNUAL REPORT ═══
const genPMAAnnualReport = (data) => {
  const totalDonations = (data.pma.donations||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const totalPMAExp = (data.pma.expenses||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const totalPMAInc = (data.pma.income||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  return `ANNUAL REPORT
${data.pma.name || "[Foundation Name]"}
A §508(c)(1)(A) Tax-Exempt Religious Organization
EIN: ${data.pma.ein || "[EIN]"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reporting Period: ${data.taxData.year || "2025"}
Prepared: ${today()}
Prepared by: ${data.pma.trustee || "[Trustee Name]"}

ORGANIZATIONAL OVERVIEW:
Type: ${data.pma.type || "§508(c)(1)(A)"} Tax-Exempt Religious Organization
Situs: ${data.pma.situs || "[State]"}
Established: ${data.pma.established || "[Date]"}
Purpose: ${data.pma.purpose || "[Organization purpose]"}
Mission: ${data.pma.mission || "[Mission statement]"}

LEADERSHIP:
Trustee/Director: ${data.pma.trustee || "[Name]"}
Active Members: ${(data.pma.members||[]).filter(m=>m.status==="active").length}
Total Members: ${(data.pma.members||[]).length}

FINANCIAL SUMMARY:
Donations Received: ${fmt(totalDonations)}
Other Income: ${fmt(totalPMAInc)}
Total Revenue: ${fmt(totalDonations + totalPMAInc)}
Total Expenses: ${fmt(totalPMAExp)}
Net Position: ${fmt(totalDonations + totalPMAInc - totalPMAExp)}

DONATION BREAKDOWN BY MISSION BUCKET:
${["Religious","Educational","Wellness","Charitable","Family Welfare","Operations"].map(b=>{
  const amt=(data.pma.donations||[]).filter(d=>d.bucket===b).reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
  return `  ${b}: ${fmt(amt)}`;
}).join("\n")}

CERTIFICATES ISSUED: ${(data.pma.donations||[]).length}

MINISTRY ACTIVITIES:
[Summarize key activities and programs]

COMPLIANCE NOTES:
• §508(c)(1)(A) status maintained — no Form 990 filing required
• All donation certificates issued per IRS guidelines
• Annual meeting held and minutes recorded
• Member records maintained

LOOKING AHEAD:
[Goals and plans for next year]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This report is an internal document. Retain for organizational records.`;
};

// ═══ BILL OF SALE GENERATOR ═══
const genBillOfSale = (trust, asset) => {
  return `BILL OF SALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: ${asset.dateAcquired || today()}
Document #: BOS-${uid().toUpperCase()}

SELLER:
Name: ${asset.noteHolder || "[Seller Name]"}
Address: ________________________________________

BUYER (Trust):
${trust.name || "[Trust Name]"}
EIN: ${trust.ein || "[EIN]"}
Situs: ${trust.situs || "[State]"}

PROPERTY DESCRIPTION:
${asset.description || "[Asset Description]"}
COA Category: #${asset.coa || "___"}

PURCHASE PRICE / CONSIDERATION:
Amount: ${fmt(asset.costBasis)}
Payment Method: Demand Note

DEMAND NOTE:
A Demand Note in the amount of ${fmt(asset.costBasis)} has been
issued to the Seller in accordance with the Trust Indenture.
The Demand Note is payable on demand and represents the
Seller's right to draw funds from the Trust up to the
stated amount without triggering a taxable event.

REPRESENTATIONS:
The Seller represents that they are the lawful owner of the
above-described property and have the right to transfer it.
The property is transferred free and clear of all liens and
encumbrances unless noted below.

LIENS/ENCUMBRANCES: ___________________________________

SELLER SIGNATURE: ___________________________  Date: __________

BUYER (TRUSTEE) SIGNATURE: ___________________________  Date: __________

NOTARY ACKNOWLEDGMENT:
State of ${trust.situs || "___________"}
County of ___________

On this _____ day of ____________, 20____, before me personally
appeared _________________________ and _________________________,
known to me to be the persons described in and who executed the
foregoing instrument, and acknowledged that they executed the
same as their free act and deed.

Notary Public: ___________________________
Commission Expires: ___________________________
[SEAL]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This document should be notarized, scanned, and uploaded
to the Document Vault under "Bill of Sale" category.`;
};

// ═══ ASSET SALE/DISPOSITION GENERATOR ═══
const genAssetSaleDoc = (trust, asset, saleData) => {
  const costBasis = parseFloat(asset.costBasis) || 0;
  const salePrice = parseFloat(saleData.salePrice) || 0;
  const gainLoss = salePrice - costBasis;
  const isLongTerm = asset.dateAcquired && (Date.now() - new Date(asset.dateAcquired).getTime()) > 365*24*60*60*1000;
  return `ASSET DISPOSITION RECORD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Trust: ${trust.name || "[Trust Name]"}
EIN: ${trust.ein || "[EIN]"}
Date of Sale: ${saleData.saleDate || today()}
Document #: SALE-${uid().toUpperCase()}

ASSET SOLD:
Description: ${asset.description}
COA: #${asset.coa}
Date Acquired: ${asset.dateAcquired}
Original Cost Basis: ${fmt(costBasis)}

SALE DETAILS:
Sale Price: ${fmt(salePrice)}
Closing Costs (#620): ${fmt(saleData.closingCosts || 0)}
Adjusted Sale Price: ${fmt(salePrice - (parseFloat(saleData.closingCosts) || 0))}

CAPITAL GAIN/LOSS:
Cost Basis: ${fmt(costBasis)}
Net Proceeds: ${fmt(salePrice - (parseFloat(saleData.closingCosts) || 0))}
${gainLoss >= 0 ? "GAIN" : "LOSS"}: ${fmt(Math.abs(gainLoss))}
Type: ${isLongTerm ? "LONG-TERM (#425) - Held over 1 year" : "SHORT-TERM (#420) - Held under 1 year"}

POSTING INSTRUCTIONS (Deposit Expense Register):
1. DEPOSIT: Cost Basis ${fmt(costBasis)} → REDUCES Asset Acct #${asset.coa}
2. DEPOSIT: ${gainLoss >= 0 ? "Gain" : "Loss"} ${fmt(Math.abs(gainLoss))} → #${isLongTerm ? "425" : "420"}
3. EXPENSE: Closing Costs ${fmt(saleData.closingCosts || 0)} → #620
${saleData.loanPayoff ? `4. EXPENSE: Loan Payoff ${fmt(saleData.loanPayoff)} → #250` : ""}

DEMAND NOTE IMPACT:
The corresponding Demand Note for this asset should be
adjusted to reflect the disposition. If the full cost basis
was drawn, no further action is needed. If balance remains,
the note capacity is reduced by the cost basis amount.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File this document in the Document Vault under "Bill of Sale" category.`;
};

// ═══ MASTER DOCUMENT TEMPLATE GENERATOR ═══
const TRUST_DOCS=["Trust Indenture Declaration","Bill of Sale - Individual to Trust","Bill of Sale - Business to Trust","Bill of Sale - Motor Vehicle","Primary Residence Transfer Package","Trust Assignment of Note","Trust Assignment of Lease","Partnership/Operating Agreement","Quitclaim Deed","Warranty Deed","Trust COA Reference"];
const PMA_DOCS=["Articles of Association","Foundation Bylaws","Donation Certificate","Member Certificate","Foundation COA Reference"];
const AGREEMENT_DOC="Trust-PMA Agreement";
// ONE-TIME docs: formation documents that can only be generated ONCE per entity
const ONE_TIME_DOCS=["Trust Indenture Declaration","Trust COA Reference","Articles of Association","Foundation Bylaws","Foundation COA Reference","Trust-PMA Agreement"];
// REPEATABLE docs: transactional documents generated per asset/transaction
const REPEATABLE_DOCS=["Bill of Sale - Individual to Trust","Bill of Sale - Business to Trust","Bill of Sale - Motor Vehicle","Primary Residence Transfer Package","Trust Assignment of Note","Trust Assignment of Lease","Partnership/Operating Agreement","Quitclaim Deed","Warranty Deed","Donation Certificate","Member Certificate"];
const isDocGenerated=(docType,files)=>(files||[]).some(f=>(f.name||"").includes(docType.replace(/ /g,"_")));
const isOneTime=(docType)=>ONE_TIME_DOCS.includes(docType);
const genDoc=(type,D)=>{
  const t=D.trust||{};const g=D.governance||{};const p=D.pma||{};const cp=D.clientProfile||{};
  const trustee=(g.trustees||[]).find(x=>x.status==="active")||{};const settlor=g.settlor||{};
  const hdr=`${t.name||"[TRUST NAME]"}\nEIN: ${t.ein||"[EIN]"}\nSitus: ${t.situs||"[STATE]"}\nEstablished: ${t.established||"[DATE]"}`;
  const phdr=`${p.name||"[FOUNDATION NAME]"}\nEIN: ${p.ein||"[EIN]"}\nType: ${p.type||"\u00A7508(c)(1)(A)"}\nSitus: ${p.situs||"[STATE]"}`;
  const sig=`\n\nTRUSTEE SIGNATURE: ___________________________  Date: __________\nPrinted Name: ${trustee.name||"[TRUSTEE NAME]"}\n\nSELLER/TRANSFEROR SIGNATURE: ___________________________  Date: __________\nPrinted Name: ${settlor.name||"[NAME]"}\n\nNOTARY ACKNOWLEDGMENT:\nState of ${t.situs||"_________"}, County of ___________\nOn this _____ day of ____________, 20____, before me personally appeared the above-named individuals, known to me to be the persons who executed the foregoing instrument.\nNotary Public: ___________________________\nCommission Expires: _______________\n[SEAL]\n\n${"━".repeat(50)}\nINSTRUCTIONS: 1) Print this document  2) All parties sign  3) Have notarized  4) Scan signed copy  5) Upload to Document Vault\nThe Command Center will auto-recognize and file this document.`;
  const templates={
"Trust Indenture Declaration":`DECLARATION OF TRUST\n${"━".repeat(50)}\n\n${hdr}\n\nARTICLE I \u2014 NAME AND PURPOSE\nThis Trust shall be known as "${t.name||"[TRUST NAME]"}", an irrevocable, non-grantor, complex, discretionary, spendthrift trust established under the laws of the State of ${t.situs||"[STATE]"} for the benefit of its designated Beneficiaries.\n\nARTICLE II \u2014 SETTLOR\nName: ${settlor.name||"[SETTLOR NAME]"}\nThe Settlor irrevocably transfers assets to the Trust and retains NO control, NO beneficial interest, and NO power to revoke, amend, or alter the Trust.\n\nARTICLE III \u2014 TRUSTEE\nInitial Trustee: ${trustee.name||"[TRUSTEE NAME]"}\nThe Trustee has full discretionary authority to manage Trust assets, make distributions, and administer the Trust in accordance with this Declaration.\n\nARTICLE IV \u2014 TRUST PROTECTOR\nName: ${g.protector?.name||"[PROTECTOR NAME]"}\nThe Trust Protector has oversight authority including the power to remove and replace Trustees, modify administrative provisions, and approve Significant Decisions.\n\nARTICLE V \u2014 BENEFICIARIES\n${(t.beneficiaries||[]).map((b,i)=>`${i+1}. ${b.name||"[NAME]"} \u2014 ${b.units||0} Units of Beneficial Interest (${b.relationship||"Beneficiary"})`).join("\n")||"[List Beneficiaries and Units]"}\nTotal Units: 100. Units are administrative only and do not confer ownership of Trust property.\n\nARTICLE VI \u2014 SPENDTHRIFT PROVISION\nNo Beneficiary shall have the power to assign, anticipate, or encumber their interest. No creditor of any Beneficiary shall have any right to reach the Trust assets or income.\n\nARTICLE VII \u2014 SUCCESSOR TRUSTEES\n${(g.successors||[]).map((s,i)=>`${s.order||i+1}. ${s.name||"[NAME]"}`).join("\n")||"[List Successors]"}\nUpon a Trigger Event (death, resignation, or incapacitation of the Initial Trustee), the Trust transitions to co-trustee structure requiring at least one Family Trustee and one Independent Trustee.\n\nARTICLE VIII \u2014 TRUST TERM\nThis Trust shall continue for a period of ${t.renewalPeriod||"21"} years from the date of establishment, renewable upon resolution of the Board of Trustees.\nRenewal Date: ${t.renewalDate||"[CALCULATED FROM ESTABLISHMENT + PERIOD]"}\n\nARTICLE IX \u2014 GOVERNING LAW\nThis Trust shall be governed by the laws of the State of ${t.situs||"[STATE]"}.\n\nARTICLE X \u2014 DEMAND NOTES\nThe Trust shall issue Demand Notes to the Settlor or Transferor for all assets transferred to the Trust. Demand Notes are payable on demand and represent the right to draw funds without triggering a taxable event until the note balance reaches zero.\n\nEXECUTED on this _____ day of ____________, 20____.\n${sig}`,

"Bill of Sale - Individual to Trust":`BILL OF SALE \u2014 INDIVIDUAL TO TRUST\n${"━".repeat(50)}\n\n${hdr}\n\nDate: ${today()}\nDocument #: BOS-IND-${uid().toUpperCase()}\n\nSELLER: ${settlor.name||"[INDIVIDUAL NAME]"}\nAddress: ________________________________________\n\nBUYER: ${t.name||"[TRUST NAME]"}\nEIN: ${t.ein||"[EIN]"}\nActing through Trustee: ${trustee.name||"[TRUSTEE NAME]"}\n\nPROPERTY DESCRIPTION:\nDescription: ________________________________________\nCOA Category: #_____\nSerial/VIN/ID (if applicable): ________________________________________\n\nPURCHASE PRICE: $______________\nPayment Method: Demand Note\n\nA Demand Note in the amount of $______________ has been issued to the Seller. The Demand Note is payable on demand per the Trust Indenture.\n\nThe Seller warrants they are the lawful owner and the property is free of all liens and encumbrances unless noted: ________________________________________\n${sig}`,

"Bill of Sale - Business to Trust":`BILL OF SALE \u2014 BUSINESS ENTITY TO TRUST\n${"━".repeat(50)}\n\n${hdr}\n\nDate: ${today()}\nDocument #: BOS-BIZ-${uid().toUpperCase()}\n\nSELLER (Business Entity):\nBusiness Name: ________________________________________\nEIN: ____________________\nType: [ ] LLC  [ ] S-Corp  [ ] C-Corp  [ ] Sole Proprietorship\nAuthorized Signer: ________________________________________\n\nBUYER: ${t.name||"[TRUST NAME]"}\n\nPROPERTY TRANSFERRED:\n[ ] Equipment (COA #135)  [ ] Intellectual Property (COA #150)\n[ ] Furniture/Fixtures (COA #130)  [ ] Vehicle (COA #140)\n[ ] Investments (COA #160)  [ ] Other: ____________\n\nDescription: ________________________________________\nFair Market Value: $______________\n\nCONSIDERATION: Demand Note in the amount of $______________\n\nLEASE-BACK AGREEMENT: [ ] Yes  [ ] No\nIf yes, a separate Equipment/IP Lease Agreement (COA #435) must be executed PRIOR to any lease payments. Lease amounts must be based on PRIOR PERIOD net income.\n${sig}`,

"Bill of Sale - Motor Vehicle":`BILL OF SALE \u2014 MOTOR VEHICLE\n${"━".repeat(50)}\n\n${hdr}\n\nDate: ${today()}\nDocument #: BOS-VEH-${uid().toUpperCase()}\n\nSELLER: ${settlor.name||"[NAME]"}\nAddress: ________________________________________\nDriver License #: ____________________  State: ${t.situs||"____"}\n\nBUYER: ${t.name||"[TRUST NAME]"}\nEIN: ${t.ein||"[EIN]"}\n\nVEHICLE INFORMATION:\nYear: ________  Make: ________________  Model: ________________\nVIN: ________________________________________\nColor: ________________  Mileage: ________________\nTitle #: ________________________________________\n\nPURCHASE PRICE: $______________\nPayment: Demand Note\n\nThe Seller warrants:\n1. They are the legal owner of the vehicle\n2. The title is free and clear of all liens (or lien noted: ________________________)\n3. The mileage stated is accurate to the best of their knowledge\n\nNOTE: Vehicle expenses post to COA #605. Do NOT post expenses to COA #140.\nPersonal use requires a Lease Agreement (COA #440) at $300-$500/month.\n${sig}`,

"Primary Residence Transfer Package":`PRIMARY RESIDENCE TRANSFER PACKAGE\n${"━".repeat(50)}\n\n${hdr}\n\nThis package contains the documents needed to transfer a primary residence into the Trust.\n\nPROPERTY:\nAddress: ________________________________________\nParcel/Tax ID: ________________________________________\nLegal Description: ________________________________________\n\nTRANSFEROR: ${settlor.name||"[NAME]"}\nTRANSFEREE: ${t.name||"[TRUST NAME]"}\n\nDOCUMENT 1 \u2014 QUITCLAIM DEED\nThe Transferor hereby quits and claims all right, title, and interest in the above-described real property to ${t.name||"[TRUST NAME]"}, EIN ${t.ein||"[EIN]"}.\nConsideration: Demand Note in the amount of $______________\n\nDOCUMENT 2 \u2014 BILL OF SALE (CONTENTS)\nAll furniture, fixtures, and personal property within the residence.\nCOA: #126 (Building), #130 (Furniture), #125 (Land)\n\nDOCUMENT 3 \u2014 PERSONAL USE LEASE AGREEMENT\nThe Trustee shall lease the residence for personal use at $________/month (typically $300-$500).\nThis lease income posts to COA #440.\n\nDOCUMENT 4 \u2014 ASSIGNMENT OF MORTGAGE (if applicable)\nExisting Mortgage Lender: ________________________________________\nLoan #: ____________________  Balance: $______________\nMonthly Payment: $______________\nSplit: Principal \u2192 #250, Interest \u2192 #500, Taxes \u2192 #505, Insurance \u2192 #650\n\nALL DOCUMENTS REQUIRE NOTARIZATION.\nRecord the Quitclaim Deed with the County Recorder/Probate Office.\n${sig}`,

"Trust Assignment of Note":`ASSIGNMENT OF NOTE\n${"━".repeat(50)}\n\n${hdr}\n\nDate: ${today()}\nDocument #: AON-${uid().toUpperCase()}\n\nASSIGNOR: ${settlor.name||"[NAME]"}\nASSIGNEE: ${t.name||"[TRUST NAME]"}\n\nNOTE DETAILS:\nOriginal Maker: ________________________________________\nOriginal Date: ____________________\nOriginal Principal: $______________\nCurrent Balance: $______________\nInterest Rate: ________%\nMaturity Date: ____________________\nCollateral: ________________________________________\n\nThe Assignor hereby assigns all right, title, and interest in the above-described Note to the Assignee. The Assignor warrants the Note is genuine, enforceable, and not in default.\n\nPost to: COA #110 (Notes Receivable)\nInterest received posts to: COA #405\nPrincipal payments received reduce: COA #110\n\nDemand Note issued to Assignor: $______________\n${sig}`,

"Trust Assignment of Lease":`ASSIGNMENT OF LEASE\n${"━".repeat(50)}\n\n${hdr}\n\nDate: ${today()}\nDocument #: AOL-${uid().toUpperCase()}\n\nASSIGNOR: ${settlor.name||"[NAME]"}\nASSIGNEE: ${t.name||"[TRUST NAME]"}\n\nLEASE DETAILS:\nProperty Address: ________________________________________\nTenant: ________________________________________\nOriginal Lease Date: ____________________\nLease Term: ____________________\nMonthly Rent: $______________\nSecurity Deposit Held: $______________\n\nThe Assignor hereby assigns all right, title, and interest in the above-described Lease to the Assignee, including the right to collect rent and enforce lease terms.\n\nRental income posts to: COA #430\nRental expenses post to their respective COA codes.\n\nThe ${t.name||"Trust"} name and EIN must be added to the lease. Notify tenant of new payment instructions.\n${sig}`,

"Partnership/Operating Agreement":`OPERATING AGREEMENT\n${"━".repeat(50)}\n\nLLC Name: ________________________________________\nEIN: ____________________\nState of Formation: ________________________________________\nDate: ${today()}\n\nMEMBERS/PARTNERS:\n1. ${t.name||"[TRUST NAME]"} (EIN: ${t.ein||"[EIN]"}) \u2014 ____% \u2014 Role: Limited Partner/Member\n2. _______________________________ \u2014 ____% \u2014 Role: Managing Member/GP\n3. _______________________________ \u2014 ____% \u2014 Role: ________________\n\nPURPOSE: ________________________________________\n\nCAPITAL CONTRIBUTIONS:\nMember 1: $______________  Member 2: $______________\n\nDISTRIBUTIONS: Pro-rata based on ownership percentage.\nK-1 income to Trust posts to: COA #455\n\nMANAGEMENT: The Managing Member shall manage daily operations. The Trust as LP shall have no management authority (Active\u2192Passive conversion).\n\nTAX TREATMENT: [ ] Partnership  [ ] Disregarded Entity  [ ] S-Corp\n\nNOTE: The Beneficial Trust CANNOT be a Managing Member, GP, officer, or director. Trust must hold LP/investor interest only.\n${sig}`,

"Quitclaim Deed":`QUITCLAIM DEED\n${"━".repeat(50)}\n\nDate: ${today()}\nDocument #: QCD-${uid().toUpperCase()}\n\nGRANTOR: ${settlor.name||"[NAME]"}\nAddress: ________________________________________\n\nGRANTEE: ${t.name||"[TRUST NAME]"}\nEIN: ${t.ein||"[EIN]"}\nAddress: ________________________________________\n\nFor and in consideration of Demand Note in the amount of $______________,\nthe Grantor hereby remises, releases, and quitclaims to the Grantee all right, title, and interest in:\n\nLEGAL DESCRIPTION:\n________________________________________\n________________________________________\nParcel ID: ____________________\nCommonly known as: ________________________________________\n\nProperty to be posted to COA #125 (Land) and/or #126 (Building).\n\nTHIS DEED MUST BE RECORDED with the County Recorder/Probate Office.\n${sig}`,

"Warranty Deed":`WARRANTY DEED\n${"━".repeat(50)}\n\nDate: ${today()}\nDocument #: WD-${uid().toUpperCase()}\n\nGRANTOR: ${settlor.name||"[NAME]"}\n\nGRANTEE: ${t.name||"[TRUST NAME]"}, EIN: ${t.ein||"[EIN]"}\n\nFor consideration of Demand Note ($______________), Grantor conveys and WARRANTS to Grantee the following described real property:\n\nLEGAL DESCRIPTION:\n________________________________________\n________________________________________\n\nGrantor WARRANTS:\n1. Grantor is lawfully seized of said property\n2. Property is free from all encumbrances except: ________________________\n3. Grantor has good right and lawful authority to sell\n4. Grantor will defend title against all lawful claims\n\nRECORD WITH COUNTY RECORDER.\n${sig}`,

"Trust COA Reference":`CHART OF ACCOUNTS \u2014 BENEFICIAL TRUST\n${"━".repeat(50)}\n\nASSETS: #1 Transfer Between Accts | #110 AR | #120 Savings | #125 Land | #126 Buildings | #130 Furniture | #135 Equipment | #140 Vehicles | #150 Intangibles/IP | #160 Investments\n\nLIABILITIES: #200 AP | #201 AP-Credit Cards | #220 Interest Payable | #225 Taxes Payable | #230 1099 Wages Payable | #250 Notes Payable | #260 Trustee Acct (Demand Note) | #265 Beneficiary Acct\n\nINCOME: #405 Interest | #410 Dividends | #420 ST Capital Gains | #425 LT Capital Gains | #430 Rental Income | #435 Equipment/IP Lease | #440 Personal Use Lease | #445 Royalties | #455 K-1 Income\n\nEXPENSES: #500 Interest | #505 Property Tax | #510 Trustee Comp (1099) | #515 Contributions | #520 Accounting | #530 Legal | #600 Advertising | #605 Vehicle | #610 Bank Fees | #620 Professional Svcs | #630 Consulting | #635 Medical/Dental | #640 Dues/Subs | #645 Fees/Permits | #650 Insurance-Property | #655 Insurance-Medical/Life | #665 Supplies | #670 Postage | #680 Rents/Leases | #685 Repairs | #690 Office | #695 Contract Labor | #705 Taxes-Non Property | #710 Entertainment | #711 Meals-Workers | #715 Telephone | #720 Travel | #725 Utilities | #730 Uniforms | #740 Education\n\nMINORS: #815 Food (under 21/college) | #820 Clothing (under 21/college)`,

"Articles of Association":`ARTICLES OF ASSOCIATION\n${"━".repeat(50)}\n\n${phdr}\n\nARTICLE I \u2014 NAME\nThe name of this organization shall be "${p.name||"[FOUNDATION NAME]"}"\n\nARTICLE II \u2014 PURPOSE\nThis organization is formed exclusively for religious purposes within the meaning of Section 508(c)(1)(A) of the Internal Revenue Code.\nMission: ${p.mission||"[MISSION STATEMENT]"}\nPurpose: ${p.purpose||"[PURPOSE DESCRIPTION]"}\n\nARTICLE III \u2014 TAX-EXEMPT STATUS\nThis organization is a church/religious organization as defined under IRC \u00A7508(c)(1)(A) and is automatically tax-exempt. No application for determination (Form 1023) is required. No Form 990 filing is required.\n\nARTICLE IV \u2014 ORGANIZATIONAL STRUCTURE\nTrustee/Director: ${p.trustee||"[NAME]"}\nMembers:\n${(p.members||[]).map((m,i)=>`${i+1}. ${m.name||"[NAME]"} \u2014 ${m.role||"Member"}`).join("\n")||"[List members]"}\n\nARTICLE V \u2014 MEETINGS\nAnnual meetings shall be held on or about ${p.annualMeetingDate||"[DATE]"} each year.\nSpecial meetings may be called by the Trustee/Director.\nMinutes shall be recorded at all meetings.\n\nARTICLE VI \u2014 DISSOLUTION\nUpon dissolution, remaining assets shall be distributed to one or more organizations with similar religious purposes under \u00A7501(c)(3) or \u00A7508(c)(1)(A).\n\nEXECUTED on ${p.established||today()}.\n\nTRUSTEE/DIRECTOR: ___________________________  Date: __________\nName: ${p.trustee||"[NAME]"}\n\n${"━".repeat(50)}\nPrint, sign, and retain permanently. This is a founding document.`,

"Foundation Bylaws":`BYLAWS\n${"━".repeat(50)}\n\n${phdr}\n\nARTICLE I \u2014 OFFICES\nPrincipal Office: State of ${p.situs||"[STATE]"}\n\nARTICLE II \u2014 PURPOSE\n${p.mission||"[MISSION STATEMENT]"}\n\nARTICLE III \u2014 MEMBERSHIP\nMembership is granted by the Trustee/Director. Members have voice and advisory capacity. The Trustee/Director retains final authority.\n\nARTICLE IV \u2014 OFFICERS\nTrustee/Director: ${p.trustee||"[NAME]"} \u2014 Full authority over operations and finances.\nAdditional officers may be appointed by the Trustee/Director.\n\nARTICLE V \u2014 MEETINGS\nAnnual Meeting: Required. Minutes must be recorded.\nQuorum: Trustee/Director plus at least one member.\nMeetings open and close with prayer/invocation.\n\nARTICLE VI \u2014 FINANCES\nAll funds shall be held in accounts under the organization's name and EIN.\nAll donations over $250 shall receive a written Donation Certificate.\nNo part of net earnings shall benefit any private individual.\n\nARTICLE VII \u2014 MISSION BUCKETS\nFunds received shall be allocated to: Religious, Educational, Wellness, Charitable, Family Welfare, or Operations.\n\nARTICLE VIII \u2014 AMENDMENTS\nThese Bylaws may be amended by resolution of the Trustee/Director with notice to all members.\n\nAdopted: ${p.established||today()}\n\nTRUSTEE/DIRECTOR: ___________________________\nName: ${p.trustee||"[NAME]"}`,

"Trust-PMA Agreement":`AGREEMENT BETWEEN ${t.name||"[TRUST NAME]"} AND ${p.name||"[PMA NAME]"}
${"━".repeat(60)}

This Agreement is made and entered into on this _____ day of ____________, 20____, by and between ${t.name||"[Trust Name]"}, a Private Irrevocable Ecclesiastical Common Law Trust (hereinafter referred to as the "Trust"), and ${p.name||"[PMA Name]"}, a Private Ministerial Association (hereinafter referred to as the "PMA").

RECITALS

WHEREAS, the Trust is established to own, manage, and hold all money, property, and financial responsibility necessary for the operations and benefit of the PMA;

WHEREAS, the PMA is a private association organized to function as the public-facing entity conducting transactions, collecting payments, receiving donations, and handling operational activities on behalf of the Trust;

WHEREAS, the Trust and the PMA desire to enter into this Agreement to clearly define their roles and responsibilities in furtherance of their respective missions;

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, the Trust and the PMA agree as follows:

1. ROLES AND RESPONSIBILITIES

1.1 The Trust:
The Trust, through its appointed Trustee(s), shall:
- Own and manage all assets, funds, and financial obligations associated with the PMA.
- Hold legal title to all property and resources acquired for the PMA's benefit.
- Maintain control over financial accounts, ensuring proper oversight of all funds received through the PMA.
- Retain all authority over the disbursement, allocation, and management of funds, property, and resources.
- Ensure compliance with all applicable laws related to Trust property, assets, and financial operations.

1.2 The PMA:
The PMA, through its designated officers and members, shall:
- Function as the operating entity for transactions, payments, and public-facing activities.
- Act as a DBA (Doing Business As) of the Trust, receiving payments, donations, and other financial contributions on behalf of the Trust.
- Handle day-to-day administration, event coordination, and member services in alignment with the Trust's directives.
- Adhere to financial and operational policies established by the Trust.
- Ensure that all collected funds, payments, and assets are properly transferred to and managed by the Trust.

2. FINANCIAL MANAGEMENT & TRANSACTIONS

2.1 Authority of the PMA:
The PMA is authorized to:
- Collect and receive payments, donations, and revenue on behalf of the Trust.
- Conduct financial transactions, including sales, service fees, and membership dues, under the DBA designation.
- Maintain operational accounts separate from the Trust's financial accounts for clarity and compliance purposes.
- Submit weekly/monthly reports of all incoming funds to the Trust for proper record-keeping and management.

2.2 Authority of the Trust:
The Trust retains sole authority over:
- Holding and managing all financial accounts, property, and resources.
- Controlling the allocation and expenditure of funds collected by the PMA.
- Ensuring that all funds received by the PMA are properly recorded, accounted for, and used in accordance with the Trust's mission.

2.3 Fund Transfers:
- The PMA shall deposit all collected funds into Trust-controlled accounts within 5 business days of receipt.
- The Trust shall ensure proper allocation and record-keeping of all funds transferred from the PMA.

3. OWNERSHIP OF PROPERTY
- All real and personal property, funds, and assets are legally owned by the Trust, even if utilized by the PMA.
- The PMA acknowledges that it has no independent ownership rights to property or financial assets but may utilize them under the Trust's authority.
- Upon dissolution of the PMA, all remaining assets shall remain under the Trust's ownership and control.

4. CONFIDENTIALITY & RECORD-KEEPING
- Both parties agree to maintain strict confidentiality regarding financial records, transactions, and member data.
- The PMA shall not disclose or claim independent control over any financial or legal assets held by the Trust.
- The Trust shall provide quarterly financial reports detailing income, expenditures, and any other relevant transactions.

5. DISPUTE RESOLUTION
- In the event of a dispute arising from this Agreement, both parties agree to seek resolution through mediation first.
- If mediation fails, the matter shall be settled through binding arbitration in accordance with the laws of ${t.situs||"[State]"}.

6. TERM & TERMINATION
- This Agreement shall commence on the date first written above and shall remain in effect unless terminated by mutual written consent of both parties.
- Either party may terminate this Agreement with 60 days' written notice, provided that such termination does not negatively impact the ongoing operations of the Trust.

7. MISCELLANEOUS PROVISIONS
- This Agreement constitutes the entire understanding between the Trust and the PMA and supersedes all prior agreements.
- This Agreement shall be governed by and construed in accordance with the laws of ${t.situs||"[State]"}.
- Any amendments must be made in writing and signed by authorized representatives of both parties.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

Signatory For the Trust:
By: _______________________________________
Print Name: ${trustee.name||"________________________________"}
Title: Trustee
Date: _____/_____/20_____

Signatory For the PMA:
By: _______________________________________
Print Name: ${p.trustee||"________________________________"}
Title: Trustee
Date: _____/_____/20_____

Notary Presentment
I, ___________________________ in the State of ${t.situs||"___________"} and county of __________________
acknowledge the foregoing instrument was presented and signed before me this ________ day of ___________________________ 20________, having satisfactorily proven to be the man whose name is subscribed within.
NOTARY SIGNATURE: ____________________________
Place Seal Here    COMMISSION EXPIRATION: _______/________/20_____

${"━".repeat(60)}
MANDATORY DOCUMENT: This agreement MUST be executed if the client has both a Trust and PMA/Foundation.
ONE-TIME DOCUMENT: Execute once during initial setup. File in BOTH Trust and Foundation document sections.
Print, sign, have notarized, scan, and upload to Document Vault. The Command Center will auto-file copies in both entities.`,

"Donation Certificate":genDonationCert(p,{date:today(),donor:"[DONOR NAME]",amount:"[AMOUNT]",bucket:"[MISSION BUCKET]",certNo:`D-${uid().toUpperCase()}`}),
"Member Certificate":genMemberCert(p,{name:"[MEMBER NAME]",role:"[ROLE]",joined:today(),status:"Active"}),
"Foundation COA Reference":`CHART OF ACCOUNTS \u2014 \u00A7508(c)(1)(A) FOUNDATION\n${"━".repeat(50)}\n\nDONATIONS: F-400 General | F-405 Religious | F-410 Educational | F-415 Wellness | F-420 Charitable | F-425 Family Welfare | F-430 Operations\n\nOTHER INCOME: F-435 Ministry Programs | F-440 Events | F-445 Media Sales | F-450 Interest | F-455 Investment | F-460 Rental | F-465 Royalties | F-470 Grants\n\nASSETS: F-100 Cash | F-105 Petty Cash | F-110 AR | F-120 Savings | F-125 Ministry Property | F-130 Furniture | F-135 Equipment | F-140 Vehicles | F-150 Investments | F-160 IP\n\nLIABILITIES: F-200 AP | F-201 CC | F-210 Notes | F-220 Taxes (UBIT only)\n\nEXPENSES: F-500 Interest | F-505 Ministry Supplies | F-510 Facility | F-515 Utilities | F-520 Ins-Property | F-525 Ins-Liability | F-530 Telephone | F-535 Legal | F-540 Accounting | F-545 Professional | F-550 Consulting | F-555 Charitable | F-560 Benevolence | F-565 Missions | F-570 Education | F-575 Media | F-580 Conferences | F-585 Office | F-590 Postage | F-595 Bank Fees | F-600 Contract Labor | F-605 Vehicle | F-610 Repairs | F-615 Travel | F-620 Meals | F-625 Advertising | F-630 Dues | F-635 Uniforms | F-640 Taxes | F-645 Fees/Permits`,
  };
  return templates[type]||`Document template "${type}" not found.`;
};

// ═══ OPERATIONS MANUALS ═══
const genOpsManual=(type,data)=>{
  const t=data.trust||{};const p=data.pma||{};const g=data.governance||{};
  const trustee=(g.trustees||[]).find(x=>x.status==="active")||{};
  const header=`${"━".repeat(60)}\nFAMILY WEALTH OPERATIONS MANUAL\n${"━".repeat(60)}\n\nGenerated: ${today()}\nVersion: 4.0\nClassification: CONFIDENTIAL — CLIENT USE ONLY\n${"━".repeat(60)}\n\n`;
  
  const trustOps=`
SECTION 1: PRIVATE IRREVOCABLE TRUST OPERATIONS
${"═".repeat(50)}

1.1 TRUST OVERVIEW & STRUCTURE
The Private Irrevocable Non-Grantor Complex Discretionary Spendthrift Trust is a common law (contract) trust, NOT a statutory/legislative trust. This distinction is critical:
- NOT taxed at entity level like statutory trusts
- Assets transferred at ABSOLUTE COST BASIS
- Demand Notes offset taxable events
- Draws against Demand Notes are NOT taxable distributions
- Only after a note is fully depleted do further distributions become taxable K-1 income

Trust Name: ${t.name||"[TO BE ASSIGNED]"}
EIN: ${t.ein||"[TO BE ASSIGNED]"}
Situs: ${t.situs||"[STATE]"}
Renewal Period: ${t.renewalPeriod||"21"} years

1.2 ROLES & AUTHORITY
SETTLOR (Non-Grantor): ${g.settlor?.name||"[NAME]"}
- Irrevocably transfers assets — retains NO control, NO beneficial interest
- Cannot revoke, amend, or alter the Trust
- Receives Demand Notes for asset transfers

TRUSTEE: ${trustee.name||"[NAME]"}
- Full discretionary authority over Trust assets
- Makes all distribution decisions
- Manages day-to-day operations
- Signs all Trust documents

TRUST PROTECTOR: ${g.protector?.name||"[NAME]"}
- Oversight authority
- Can remove/replace Trustees
- Approves significant decisions

BENEFICIARIES: Administrative units ONLY — do not confer ownership
${(t.beneficiaries||[]).map((b,i)=>`  ${i+1}. ${b.name||"[NAME]"} — ${b.units||0} Units`).join("\n")||"  [TO BE ASSIGNED]"}

1.3 ASSET TRANSFER PROTOCOL
Step 1: Identify asset and determine cost basis (original purchase price)
Step 2: Generate Bill of Sale via Document Builder
Step 3: System auto-creates Demand Note for cost basis amount
Step 4: Print, sign, notarize Bill of Sale
Step 5: Upload notarized copy to Document Vault
Step 6: Update title/registration to Trust name and EIN

CRITICAL RULES:
- ALWAYS use cost basis, NEVER fair market value
- EVERY asset transfer requires a Bill of Sale
- EVERY transfer creates a corresponding Demand Note
- Personal use assets require a Lease Agreement ($300-$500/mo)
- Motor vehicles: expenses post to COA #605, NOT #140

1.4 DEMAND NOTE OPERATIONS
The Demand Note is THE ENGINE of the trust structure:
- Issued for every asset transferred into the trust
- Represents the Settlor's right to draw funds tax-free
- Draws are loan repayments, NOT income
- Monitor balance — when depleted, further draws are TAXABLE

Drawing Funds:
Step 1: Navigate to Demand Notes tab
Step 2: Select the note to draw from
Step 3: Enter amount, date, and purpose
Step 4: System auto-tracks remaining balance
Step 5: System alerts at 10% remaining

WARNING: Never draw more than the note balance. The system will flag this as CRITICAL.

1.5 CHART OF ACCOUNTS (TRUST)
ASSETS: #1 Transfer | #110 AR | #120 Savings | #125 Land | #126 Buildings | #130 Furniture | #135 Equipment | #140 Vehicles | #150 Intangibles | #160 Investments
LIABILITIES: #200 AP | #201 CC | #220 Interest Payable | #225 Taxes | #230 Wages | #250 Notes Payable | #260 Trustee Acct (Demand Note) | #265 Beneficiary Acct
INCOME: #405 Interest | #410 Dividends | #420 ST Cap Gains | #425 LT Cap Gains | #430 Rental | #435 Equipment Lease | #440 Personal Use Lease | #445 Royalties | #455 K-1
EXPENSES: #500 Interest | #505 Property Tax | #510 Trustee Comp | #515 Contributions | #520 Accounting | #530 Legal | #600-#740 Operating

1.6 TRUST COMPLIANCE SCHEDULE
MONTHLY:
- Bank reconciliation (Settings > Last Reconciliation)
- Record all income and expenses with COA codes
- Review Demand Note balances
- Process any draws needed

QUARTERLY:
- Board of Trustees meeting (auto-generate minutes)
- Review and update asset valuations
- Check insurance policy status
- Review LLC K-1 distributions

ANNUALLY:
- Form 1041 preparation (auto-generated from recorded data)
- Trust renewal assessment (if within 1 year of renewal date)
- Full asset inventory and reconciliation
- Beneficiary reports (auto-generated)
- Update successor trustee information
- Review and update all insurance policies

1.7 FORM 1041 — TRUST TAX RETURN
The Command Center auto-calculates Form 1041 data from recorded income/expenses:
- Interest Income (COA #405)
- Dividends (COA #410)
- Capital Gains — Short-term (#420) and Long-term (#425)
- Rental Income (#430)
- K-1 Income (#455)
- Deductions: Trustee fees (#510), Legal (#520/#530), Property Tax (#505), Charitable (#515)

NOTE: Because this is a non-grantor trust, the trust files its own return separate from personal returns. The Command Center keeps these completely separated.

1.8 LLC MANAGEMENT (TRUST-OWNED)
The Trust CANNOT be a Managing Member, GP, officer, or director. Trust must hold LP/investor interest only (Active→Passive conversion).

For 100% Trust-owned LLCs: Disregarded entity for tax purposes
For Split-ownership LLCs: K-1 income allocated by ownership percentage

Recording LLC Income:
Step 1: Navigate to LLC tab
Step 2: Select the LLC entity
Step 3: Enter total income amount
Step 4: System auto-calculates Trust's share based on ownership %
Step 5: Trust share auto-posts to COA #455

1.9 BANKING & COMMINGLING PREVENTION
CARDINAL RULE: Never mix personal and trust funds.
- Trust accounts use Trust name and EIN
- Personal accounts are completely separate
- The Command Center maintains separate tracking for each entity
- Banking tab has built-in commingling alerts

1.10 SUCCESSION & TRIGGER EVENTS
A Trigger Event is the death, resignation, or incapacitation of the Trustee.
Upon a Trigger Event:
1. Trust transitions to co-trustee structure
2. Requires at least one Family Trustee + one Independent Trustee
3. Trust Protector oversees the transition
4. Successor Trustees are notified automatically when status is set to ALERT
`;

  const pmaOps=`
SECTION 2: §508(c)(1)(A) FOUNDATION OPERATIONS
${"═".repeat(50)}

2.1 FOUNDATION OVERVIEW
The §508(c)(1)(A) organization is a church/religious organization that is AUTOMATICALLY tax-exempt:
- No Form 1023 application required
- No Form 990 filing required
- Donations are tax-deductible under IRC §170
- Subject to 60% AGI limitation for donors
- Must maintain religious/ministerial purpose

Organization: ${p.name||"[TO BE ASSIGNED]"}
EIN: ${p.ein||"[TO BE ASSIGNED]"}
Type: ${p.type||"§508(c)(1)(A)"}
Mission: ${p.mission||"[TO BE DEFINED]"}

2.2 FORMATION DOCUMENTS (ONE-TIME)
These documents are generated ONCE during setup and locked:
1. Articles of Association — founding document establishing the organization
2. Bylaws — operating rules and procedures
3. Foundation COA Reference — Chart of Accounts

Generate all via Document Builder tab. Print, sign, retain permanently.

2.3 DONATION MANAGEMENT
Recording Donations:
Step 1: Navigate to Foundation tab
Step 2: Click "Record Donation"
Step 3: Enter donor name, amount, type, and mission bucket
Step 4: System auto-generates Donation Certificate
Step 5: Certificate auto-filed in Document Vault

Mission Buckets:
- Religious — worship, prayer, spiritual programs
- Educational — teaching, training, scholarships
- Wellness — health, mental health, counseling
- Charitable — community service, benevolence
- Family Welfare — family support, youth programs
- Operations — administrative costs, facilities

60% AGI LIMIT:
- Donors can deduct up to 60% of their AGI in charitable donations
- Excess carries forward up to 5 years (IRC §170(d)(1))
- The Command Center tracks this limit automatically
- Dashboard shows remaining deductible capacity

2.4 DONATION CERTIFICATES
Every donation over $250 MUST receive a written acknowledgment including:
- Organization name, EIN, and §508(c)(1)(A) status
- Date and amount of donation
- Statement that no goods/services were provided in exchange
- Tax deductibility language
- Certificate number for record-keeping

The Command Center auto-generates certificates with all required elements.

2.5 MEETING REQUIREMENTS
Annual Meeting (REQUIRED):
- Must be held at least once per year
- Open and close with prayer/invocation
- Record minutes (auto-generated by system)
- Quorum: Trustee/Director + at least one member
- Election of officers (if annual)
- Financial report review

Auto-Generate Minutes:
- Dashboard or Foundation tab > "Auto-Generate Meeting Minutes"
- System pulls financial data automatically
- Edit any sections in the Document Viewer
- Print, sign, and file permanently

2.6 MEMBER MANAGEMENT
Adding Members:
Step 1: Navigate to Foundation tab > Members section
Step 2: Enter name, role, contact info
Step 3: System auto-generates Member Certificate
Step 4: Certificate filed in Document Vault

Member Roles: Trustee/Director, Board Member, Minister, Deacon, Member

2.7 CHART OF ACCOUNTS (FOUNDATION)
DONATIONS: F-400 General | F-405 Religious | F-410 Educational | F-415 Wellness | F-420 Charitable | F-425 Family Welfare | F-430 Operations
OTHER INCOME: F-435 Ministry Programs | F-440 Events | F-445 Media Sales | F-450 Interest
ASSETS: F-100 Cash | F-110 AR | F-120 Savings | F-125 Ministry Property | F-130-F-160 Various
EXPENSES: F-500 through F-645 — Operating expenses by category

2.8 FOUNDATION COMPLIANCE
MONTHLY:
- Record all donations with proper certificates
- Record all expenses with COA codes
- Track mission bucket allocations

QUARTERLY:
- Review financial position
- Verify 60% AGI limit tracking
- Update member records

ANNUALLY:
- Annual meeting (MANDATORY)
- Generate annual report (auto-generated)
- Donor acknowledgments (due January 31 for prior year)
- Review and update Articles/Bylaws if needed
- Member certificate renewals

2.9 ANNUAL REPORT
Auto-generated from Command Center data including:
- Organizational overview and mission
- Financial summary (donations, income, expenses)
- Mission bucket breakdown
- Certificates issued
- Compliance notes
- Ministry activities (user-edited section)

2.10 KEY COMPLIANCE REMINDERS
- §508(c)(1)(A) status = NO Form 990 required
- NO Form 1023 application needed
- Must maintain religious/ministerial purpose
- All donation certificates must include proper tax language
- Annual meeting minutes must be recorded and retained
- Member records must be maintained
- Upon dissolution: assets go to similar §501(c)(3) or §508(c)(1)(A) org
`;

  const bothOps=`
SECTION 3: TRUST + FOUNDATION COMBINED OPERATIONS
${"═".repeat(50)}

3.1 THE TRUST-PMA RELATIONSHIP
When a client has BOTH a Trust and Foundation:
- The Trust owns ALL assets, funds, and property
- The Foundation (PMA) is the public-facing operating entity
- The Foundation acts as a DBA of the Trust
- A Trust-PMA Agreement is MANDATORY (one-time document)

3.2 MANDATORY: TRUST-PMA AGREEMENT
This agreement MUST be executed during initial setup. It defines:
- Trust = owner of all assets and financial authority
- PMA = operating entity for transactions and public activities
- Fund transfer protocols (PMA deposits to Trust within 5 business days)
- Property ownership (all owned by Trust, utilized by PMA)
- Dispute resolution procedures
- Confidentiality requirements

Generate via Document Builder > "MANDATORY: Trust-PMA Agreement"
The system auto-files copies in BOTH Trust and Foundation document sections.

3.3 FINANCIAL FLOW
┌──────────────┐     ┌──────────────┐
│   PERSONAL   │────>│    TRUST     │
│   (Settlor)  │ DN  │  (Owns All)  │
└──────────────┘     └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │  FOUNDATION   │
                    │  (Operates)   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴───┐ ┌─────┴─────┐
        │ Donations  │ │  LLC  │ │ Ministry  │
        │ Received   │ │Income │ │ Programs  │
        └───────────┘ └───────┘ └───────────┘

3.4 DUAL-ENTITY COMPLIANCE SCHEDULE
MONTHLY: All Trust + Foundation monthly tasks
QUARTERLY: All Trust + Foundation quarterly tasks
ANNUALLY: All Trust + Foundation annual tasks PLUS:
- Review Trust-PMA Agreement (ensure still current)
- Cross-reference Trust and Foundation financials
- Verify no commingling between entities
- Generate both Trust Minutes and Foundation Minutes

3.5 TAX OPTIMIZATION STRATEGY
1. Personal Income → Maximize pre-tax retirement contributions (reduces AGI)
2. Calculate 60% AGI limit → This is your max charitable deduction
3. Donate to Foundation up to limit → Tax savings auto-tracked
4. Transfer assets to Trust at cost basis → Demand Notes issued
5. Trust-owned LLCs convert Active→Passive income
6. Foundation reinvests in ministry programs
7. Insurance and annuities provide long-term growth within Trust

3.6 DOCUMENT REQUIREMENTS (BOTH ENTITIES)
Trust Documents:
- Trust Indenture Declaration (ONE-TIME)
- Bills of Sale (per asset)
- Demand Notes (auto-generated)
- Quitclaim/Warranty Deeds (for real property)
- Trust COA Reference (ONE-TIME)
- Monthly Meeting Minutes (auto-generated)

Foundation Documents:
- Articles of Association (ONE-TIME)
- Bylaws (ONE-TIME)
- Foundation COA Reference (ONE-TIME)
- Donation Certificates (per donation)
- Member Certificates (per member)
- Annual Meeting Minutes (auto-generated)
- Annual Report (auto-generated)

Combined:
- Trust-PMA Agreement (ONE-TIME, MANDATORY)
`;

  const systemGuide=`
SECTION 4: COMMAND CENTER SYSTEM GUIDE
${"═".repeat(50)}

4.1 NAVIGATION
The sidebar provides access to all modules. Key tabs:
- Dashboard: Overview of all entities, quick actions
- Client Profile: Personal info, type selection, goals
- Document Builder: Generate all legal documents
- Trust: Assets, income, expenses, beneficiaries
- Demand Notes: The engine — track all notes and draws
- Governance: Trustees, protector, succession
- Foundation: Donations, members, expenses
- AI Advisor: Strategic advice powered by Claude
- Compliance: Auto-verified checklist

4.2 QUICK ACTIONS (DASHBOARD)
- Quick Draw: Fast access to Demand Note draws
- Record Expense: Add trust expenses
- Record Donation: Add foundation donations
- Record Income: Add trust income
- Auto-Generate Minutes: One-click meeting minutes

4.3 DOCUMENT VAULT
All documents are auto-filed with metadata:
- Category, entity, date, type
- View, edit, print, and download from within the system
- Formation documents are locked after first generation

4.4 AUDIT LOG
Every action is timestamped and recorded:
- Last 500 entries retained
- Provides legal defense trail
- Cannot be edited or deleted

4.5 DATA MANAGEMENT
Export: Settings > Export (JSON backup)
Import: Settings > Import (restore from backup)
Reset: Settings > Reset (CAUTION: deletes all data)

4.6 AI STRATEGIC ADVISOR
The AI Advisor has access to all your financial data and can provide:
- Trust strategy and optimization advice
- Tax planning recommendations
- Demand Note strategies
- Foundation compliance guidance
- Investment direction based on your risk profile
- Specific COA code guidance
- IRC section references

Simply type your question and the AI analyzes your complete financial picture.
`;

  if(type==="trust")return header+"TYPE: TRUST ONLY\n\n"+trustOps+"\n\n"+systemGuide+`\n\n${"━".repeat(60)}\nEND OF OPERATIONS MANUAL — TRUST ONLY\nPROPRIETARY & CONFIDENTIAL\n${"━".repeat(60)}`;
  if(type==="pma")return header+"TYPE: §508(c)(1)(A) FOUNDATION ONLY\n\n"+pmaOps+"\n\n"+systemGuide+`\n\n${"━".repeat(60)}\nEND OF OPERATIONS MANUAL — §508(c)(1)(A) ONLY\nPROPRIETARY & CONFIDENTIAL\n${"━".repeat(60)}`;
  return header+"TYPE: TRUST + §508(c)(1)(A) FOUNDATION\n\n"+trustOps+"\n\n"+pmaOps+"\n\n"+bothOps+"\n\n"+systemGuide+`\n\n${"━".repeat(60)}\nEND OF OPERATIONS MANUAL — TRUST + FOUNDATION\nPROPRIETARY & CONFIDENTIAL\n${"━".repeat(60)}`;
};

// ═══ PRICING TIERS ═══
const PRICING={
  trust:{name:"Trust Only",setup:7500,monthly:497,annual:4970,features:["Private Irrevocable Trust Formation","Complete Document Suite (11 Templates)","Demand Note Engine with Auto-Tracking","Asset Registry & COA System","Form 1041 Auto-Generator","LLC Management & K-1 Tracking","Banking & Commingling Prevention","AI Strategic Advisor","Audit Trail & Compliance Checklist","Monthly Meeting Minutes Auto-Generation","Beneficiary Reports","Succession Planning Module","Investment Portfolio Tracking","Real Estate & Debt Management","Cash Flow Analysis","Bill Pay Tracker","Data Export & Backup"]},
  pma:{name:"§508(c)(1)(A) Only",setup:5000,monthly:397,annual:3970,features:["§508(c)(1)(A) Foundation Formation","Articles of Association & Bylaws","Donation Certificate Auto-Generator","60% AGI Limit Tracking","Mission Bucket Allocation","Member Management & Certificates","Annual Meeting Minutes Auto-Generation","Annual Report Generator","Foundation COA System","AI Strategic Advisor","Document Vault","Compliance Checklist","Audit Trail"]},
  both:{name:"Trust + Foundation",setup:10000,monthly:697,annual:6970,features:["Everything in Trust Only","Everything in §508(c)(1)(A) Only","MANDATORY Trust-PMA Agreement (auto-generated)","Dual-Entity Financial Flow","Cross-Entity Compliance Monitoring","Combined Tax Optimization Strategy","Active→Passive Income Conversion via LLC","Full Personal Tax Integration (1040)","Tax Savings Dashboard","Investment Direction Engine","Retirement Planning Module","Complete Operations Manual","Client Call Integration","Priority AI Strategic Advisor","White-Glove Onboarding"]}
};

// ═══ ALERTS ═══
const genAlerts=(D)=>{
  const a=[];
  (D.trust.demandNotes||[]).forEach(n=>{const dr=(D.trust.draws||[]).filter(d=>d.noteId===n.id).reduce((s,d)=>s+(parseFloat(d.amount)||0),0);const rem=(parseFloat(n.amount)||0)-dr;
    if(rem<=0)a.push({t:"critical",e:"Trust",m:`Demand Note "${n.holder}" DEPLETED. Further draws are TAXABLE.`});
    else if(rem<(parseFloat(n.amount)||1)*.1)a.push({t:"warning",e:"Trust",m:`Demand Note "${n.holder}" below 10% (${fmt(rem)}).`});
  });
  if(ds(D.settings.lastRecon)>35)a.push({t:"warning",e:"Trust",m:`Monthly reconciliation overdue.`});
  if(ds(D.settings.lastMinutes)>95)a.push({t:"warning",e:"Trust",m:`Trust meeting overdue. Record minutes.`});
  if(ds(D.settings.lastAnnual)>370)a.push({t:"warning",e:"PMA",m:`Annual meeting overdue.`});
  if(!D.pma.mission&&D.pma.name)a.push({t:"info",e:"Foundation",m:`Mission statement not set. Go to Foundation tab to add it.`});
  if(!(D.pma.members||[]).length&&D.pma.name)a.push({t:"info",e:"Foundation",m:`No members added. Add members in Foundation tab.`});
  if(D.trust.renewalDate){const daysToRenewal=Math.floor((new Date(D.trust.renewalDate).getTime()-Date.now())/864e5);
    if(daysToRenewal<=365&&daysToRenewal>0)a.push({t:"warning",e:"Trust",m:`Trust renewal due in ${daysToRenewal} days (${D.trust.renewalDate}). Begin renewal process now.`});
    if(daysToRenewal<=0)a.push({t:"critical",e:"Trust",m:`Trust renewal OVERDUE since ${D.trust.renewalDate}. Renew immediately.`});
  }
  (D.insurance.policies||[]).forEach(p=>{if(p.premiumDue&&ds(p.premiumDue)>0)a.push({t:"critical",e:"Insurance",m:`Premium OVERDUE: ${p.company}.`});});
  (D.annuities.contracts||[]).forEach(an=>{if(an.nextPayment&&ds(an.nextPayment)>0)a.push({t:"warning",e:"Annuity",m:`Annuity payment overdue: ${an.company}.`});});
  (D.llc.msas||[]).forEach(m=>{if(m.renewalDate&&ds(m.renewalDate)<60&&ds(m.renewalDate)>-1)a.push({t:"info",e:"LLC",m:`MSA "${m.name}" renewal due: ${m.renewalDate}.`});});
  (D.llc.leases||[]).forEach(l=>{if(l.endDate&&ds(l.endDate)<60&&ds(l.endDate)>-1)a.push({t:"info",e:"LLC",m:`Lease "${l.name}" expiring: ${l.endDate}.`});});
  if(D.governance.triggerStatus==="alert")a.push({t:"critical",e:"Governance",m:`TRIGGER EVENT ALERT: Successor trustee notification activated. Review succession protocol.`});
  const uncat=(D.trust.expenses||[]).filter(x=>!x.coa);if(uncat.length)a.push({t:"warning",e:"Trust",m:`${uncat.length} uncategorized expense(s).`});
  if(!a.length)a.push({t:"success",e:"System",m:"All systems nominal."});
  if(D.financialProfile?.lastUpdated&&ds(D.financialProfile.lastUpdated)>365)a.push({t:"critical",e:"Profile",m:"Annual Financial Perspective update OVERDUE. Update in Client Profile."});
  if(!D.financialProfile?.lastUpdated)a.push({t:"warning",e:"Profile",m:"Financial Perspective not completed. Go to Client Profile."});
  return a;
};

// ═══ 1041 GENERATOR ═══
const gen1041=(D)=>{
  const inc=D.trust.income||[];const exp=D.trust.expenses||[];
  const byC=(arr,c)=>arr.filter(i=>i.coa===c).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const interest=byC(inc,"405"),dividends=byC(inc,"410"),stcg=byC(inc,"420"),ltcg=byC(inc,"425");
  const rental=byC(inc,"430"),lease=byC(inc,"435"),royalty=byC(inc,"445"),k1=byC(inc,"455");
  const otherInc=inc.filter(i=>!["405","410","420","425","430","435","445","455"].includes(i.coa)).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const trustFees=byC(exp,"510"),legal=byC(exp,"520")+byC(exp,"530"),propTax=byC(exp,"505"),charitable=byC(exp,"515");
  const otherExp=exp.filter(i=>!["510","520","530","505","515"].includes(i.coa)).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const totalInc=interest+dividends+rental+lease+royalty+k1+otherInc;
  const totalDed=trustFees+legal+propTax+charitable+otherExp;
  return{interest,dividends,stcg,ltcg,rental,lease,royalty,k1,otherInc,totalInc,trustFees,legal,propTax,charitable,otherExp,totalDed,capGains:stcg+ltcg,taxable:totalInc-totalDed};
};

// ═══ MAIN APP ═══
export default function App(){
  const[D,setD]=useState(init());
  const[ok,setOk]=useState(false);
  const[tab,setTab]=useState("dash");
  const[sub,setSub]=useState("");
  const[alerts,setAlerts]=useState([]);
  const[f,setF]=useState({});
  const[aiMsg,setAiMsg]=useState("");
  const[aiLoad,setAiLoad]=useState(false);
  const[search,setSearch]=useState("");
  const[toast,setToast]=useState(null);
  const[viewDoc,setViewDoc]=useState(null);
  const[loggedIn,setLoggedIn]=useState(false);
  const[pinInput,setPinInput]=useState("");
  const[pinConfirm,setPinConfirm]=useState("");
  const[pinMode,setPinMode]=useState("loading");// "loading","check","setup","confirm"
  const[storedPin,setStoredPin]=useState(null);
  const[pinError,setPinError]=useState("");
  const[viewOnly,setViewOnly]=useState(false);
  const[activeRole,setActiveRole]=useState("advisor");
  const aiRef=useRef(null);

  // Load PIN on mount — uses unique key per client (deployId) to prevent cross-client access
  useEffect(()=>{(async()=>{try{
    const r=await window.storage.get("family-v4-pin");
    if(r&&r.value){setStoredPin(r.value);setPinMode("check");}
    else{setPinMode("setup");}
  }catch{setPinMode("setup");}})();},[]);

  // Check if a PIN is already used by another client (duplicate prevention)
  const isPinDuplicate=async(pin)=>{
    try{
      const registry=await window.storage.get("family-v4-pin-registry",true);
      const pins=registry?JSON.parse(registry.value):{};
      const myId=D.meta?.deployId||"unknown";
      for(const[id,usedPin] of Object.entries(pins)){
        if(usedPin===pin&&id!==myId)return true;
      }
      return false;
    }catch{return false;}
  };
  const registerPin=async(pin)=>{
    try{
      const registry=await window.storage.get("family-v4-pin-registry",true);
      const pins=registry?JSON.parse(registry.value):{};
      const myId=D.meta?.deployId||"unknown";
      pins[myId]=pin;
      await window.storage.set("family-v4-pin-registry",JSON.stringify(pins),true);
    }catch(e){console.error(e);}
  };
  const unregisterPin=async()=>{
    try{
      const registry=await window.storage.get("family-v4-pin-registry",true);
      const pins=registry?JSON.parse(registry.value):{};
      const myId=D.meta?.deployId||"unknown";
      delete pins[myId];
      await window.storage.set("family-v4-pin-registry",JSON.stringify(pins),true);
    }catch(e){console.error(e);}
  };

  const handlePinSubmit=async()=>{
    if(pinMode==="setup"){if(pinInput.length<4){setPinError("PIN must be at least 4 digits");return;}
      // Check for duplicate PIN before proceeding to confirm
      const dup=await isPinDuplicate(pinInput);
      if(dup){setPinError("This PIN is already in use by another client. Please choose a different PIN.");setPinInput("");return;}
      setPinConfirm("");setPinMode("confirm");setPinError("");return;}
    if(pinMode==="confirm"){if(pinInput!==pinConfirm){setPinError("PINs do not match. Try again.");setPinConfirm("");return;}
      // Double-check duplicate before saving
      const dup2=await isPinDuplicate(pinInput);
      if(dup2){setPinError("This PIN was just taken by another client. Please choose a different PIN.");setPinInput("");setPinConfirm("");setPinMode("setup");return;}
      try{await window.storage.set("family-v4-pin",pinInput);await registerPin(pinInput);}catch(e){console.error(e);}
      setStoredPin(pinInput);setLoggedIn(true);setPinError("");return;}
    if(pinMode==="check"){if(pinInput===storedPin){setLoggedIn(true);setPinError("");}else{setPinError("Incorrect PIN. Try again or click 'Enter Without PIN' below.");setPinInput("");}}
  };

  const handleResetPin=async()=>{try{await unregisterPin();await window.storage.delete("family-v4-pin");await window.storage.delete("family-v4-client-id");}catch(e){}setStoredPin(null);setPinInput("");setPinMode("setup");setPinError("");};

  // ═══ ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURN ═══
  const uf=(k,v)=>setF(p=>({...p,[k]:v}));
  const rf=()=>setF({});
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{ld().then(d=>{setD(d);setOk(true);});},[]);
  useEffect(()=>{if(ok){sv(D);setAlerts(genAlerts(D));};},[D,ok]);

  const upd=useCallback((path,val)=>{
    setD(prev=>{const n=JSON.parse(JSON.stringify(prev));const k=path.split(".");let o=n;for(let i=0;i<k.length-1;i++)o=o[k[i]];o[k[k.length-1]]=val;return n;});
  },[]);

  const log=(action,detail)=>{
    const entry={id:uid(),timestamp:ts(),action,detail};
    setD(prev=>{const n=JSON.parse(JSON.stringify(prev));n.auditLog=[entry,...(n.auditLog||[]).slice(0,499)];return n;});
  };

  const addTo=(path,item)=>{const k=path.split(".");let o=D;for(const x of k)o=o[x];upd(path,[...o,{...item,id:uid()}]);log("ADD",`Added to ${path}`);};
  const rmFrom=(path,i)=>{const k=path.split(".");let o=D;for(const x of k)o=o[x];upd(path,o.filter((_,j)=>j!==i));log("REMOVE",`Removed from ${path}`);};

  // Computed values
  const totalAssets=(D.trust.assets||[]).reduce((s,a)=>s+(parseFloat(a.costBasis)||0),0);
  const totalNotes=(D.trust.demandNotes||[]).reduce((s,n)=>s+(parseFloat(n.amount)||0),0);
  const totalDraws=(D.trust.draws||[]).reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
  const remNotes=totalNotes-totalDraws;
  const totalTrustInc=(D.trust.income||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const totalTrustExp=(D.trust.expenses||[]).reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const totalDon=(D.pma.donations||[]).reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
  const totalFace=(D.insurance.policies||[]).reduce((s,p)=>s+(parseFloat(p.faceValue)||0),0);
  const totalCash=(D.insurance.policies||[]).reduce((s,p)=>s+(parseFloat(p.cashValue)||0),0);
  const portfolioVal=["crypto","stocks","metals","nfts","rwas","other"].reduce((s,c)=>(D.portfolio[c]||[]).reduce((ss,a)=>ss+(parseFloat(a.value)||0),0)+s,0);
  const annuityVal=(D.annuities.contracts||[]).reduce((s,a)=>s+(parseFloat(a.accountValue)||0),0);
  const llcRev=(D.llc.income||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const llcExp=(D.llc.expenses||[]).reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  const netEstate=totalAssets+portfolioVal+totalCash+annuityVal;
  const totalW2=(D.personalTax?.w2s||[]).reduce((s,w)=>s+(parseFloat(w.wages)||0),0);
  const total1099=(D.personalTax?.income1099||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const totalOtherPI=(D.personalTax?.otherIncome||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const grossPersonalIncome=totalW2+total1099+totalOtherPI;
  const totalAdjustments=(D.personalTax?.adjustments||[]).reduce((s,a)=>s+(parseFloat(a.amount)||0),0);
  const agi=grossPersonalIncome-totalAdjustments;
  const donationLimit=agi*0.6;
  const stdDed={single:14600,mfj:29200,mfs:14600,hoh:21900,qw:29200};
  const personalStdDed=stdDed[D.personalTax?.filingStatus]||14600;
  const totalItemized=(D.personalTax?.itemizedDeductions||[]).reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
  const personalDeduction=D.personalTax?.standardDeduction?personalStdDed:totalItemized;
  const taxablePersonalIncome=Math.max(0,agi-personalDeduction);
  const totalDeferredCG=(D.taxSavings?.deferredCapGains||[]).reduce((s,i)=>s+(parseFloat(i.taxSaved)||0),0);
  const totalDeferredTax=(D.taxSavings?.deferredTaxes||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const totalDonationSavings=(D.taxSavings?.donationSavings||[]).reduce((s,i)=>s+(parseFloat(i.taxSaved)||0),0);
  const totalAllSavings=totalDeferredCG+totalDeferredTax+totalDonationSavings+(D.taxSavings?.otherSavings||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0);
  const totalDebt=(D.debt?.items||[]).reduce((s,d)=>s+(parseFloat(d.balance)||0),0);
  const monthlyDebtPayments=(D.debt?.items||[]).reduce((s,d)=>s+(parseFloat(d.monthlyPayment)||0),0);
  const totalRetirement=(D.retirement?.accounts||[]).reduce((s,a)=>s+(parseFloat(a.balance)||0),0);
  const totalREValue=(D.realEstate?.properties||[]).reduce((s,p)=>s+(parseFloat(p.currentValue)||0),0);
  const totalREDebt=(D.realEstate?.properties||[]).reduce((s,p)=>s+(parseFloat(p.mortgageBalance)||0),0);
  const totalREEquity=totalREValue-totalREDebt;
  const totalRERent=(D.realEstate?.properties||[]).reduce((s,p)=>s+(parseFloat(p.monthlyRent)||0)*12,0);
  const fullNetWorth=netEstate+totalRetirement+totalREEquity-totalDebt;
  const crit=alerts.filter(a=>a.t==="critical").length;
  const warns=alerts.filter(a=>a.t==="warning").length;

  // ═══ PIN LOGIN SCREEN (all hooks are above) ═══
  if(!loggedIn&&pinMode!=="loading")return <div style={{background:`linear-gradient(135deg, #0a0e1a 0%, #0f1628 50%, #0d1220 100%)`,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>
    <div style={{background:`linear-gradient(145deg, ${CL.c1}, ${CL.c2})`,border:`1px solid ${CL.bd}`,borderRadius:16,padding:40,width:380,textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
      <div style={{fontSize:24,fontWeight:800,color:CL.go,letterSpacing:4,fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>FAMILY WEALTH</div>
      <div style={{fontSize:10,color:CL.dm,letterSpacing:2,marginBottom:30}}>COMMAND CENTER v4.0</div>
      <div style={{fontSize:14,color:CL.tx,marginBottom:16,fontWeight:600}}>{pinMode==="setup"?"Create Your PIN (Optional)":pinMode==="confirm"?"Confirm Your PIN":"Welcome Back"}</div>
      {pinMode==="setup"&&<div style={{fontSize:10,color:CL.dm,marginBottom:12}}>A PIN adds security to your financial data. You can also skip this step.</div>}
      <input type="password" value={pinMode==="confirm"?pinConfirm:pinInput} onChange={e=>{const v=e.target.value.replace(/\D/g,"");if(pinMode==="confirm")setPinConfirm(v);else setPinInput(v);setPinError("");}} onKeyDown={e=>{if(e.key==="Enter")handlePinSubmit();}}
        placeholder={pinMode==="confirm"?"Re-enter PIN":"Enter PIN"} maxLength={8}
        style={{width:"100%",padding:"12px 16px",background:CL.bg,border:`2px solid ${pinError?CL.rd:CL.bd}`,borderRadius:8,color:CL.tx,fontSize:24,textAlign:"center",letterSpacing:12,fontFamily:"'JetBrains Mono',monospace",boxSizing:"border-box",outline:"none"}} />
      {pinError&&<div style={{color:CL.rd,fontSize:11,marginTop:8}}>{pinError}</div>}
      <button onClick={handlePinSubmit} style={{width:"100%",padding:"12px",marginTop:16,background:CL.go,border:"none",borderRadius:8,color:CL.bg,fontSize:14,fontWeight:700,cursor:"pointer"}}>{pinMode==="setup"?"Set PIN":pinMode==="confirm"?"Confirm & Enter":"Unlock"}</button>
      <button onClick={()=>setLoggedIn(true)} style={{width:"100%",padding:"10px",marginTop:8,background:"transparent",border:`1px solid ${CL.bd}`,borderRadius:8,color:CL.dm,fontSize:12,cursor:"pointer"}}>{pinMode==="check"?"Enter Without PIN":"Skip \u2014 Set Up Later in Settings"}</button>
      {pinMode==="check"&&<button onClick={handleResetPin} style={{background:"transparent",border:"none",color:CL.mt,fontSize:9,marginTop:12,cursor:"pointer",textDecoration:"underline"}}>Reset PIN</button>}
    </div>
  </div>;
  if(pinMode==="loading"&&!loggedIn)return <div style={{background:`linear-gradient(135deg, #0a0e1a 0%, #0f1628 50%, #0d1220 100%)`,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:CL.go,fontFamily:"'JetBrains Mono',monospace"}}>Loading...</div>;

  // ═══ NOT-OK LOADING SCREEN ═══
  if(!ok)return <div style={{background:`linear-gradient(135deg, #0a0e1a 0%, #0f1628 50%, #0d1220 100%)`,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:CL.go,fontFamily:"'JetBrains Mono',monospace"}}><div style={{fontSize:28,fontWeight:800,letterSpacing:6,marginBottom:8}}>FAMILY WEALTH</div><div style={{fontSize:12,color:CL.dm,letterSpacing:3}}>INITIALIZING v3.0...</div><div style={{width:200,height:3,background:CL.bd,borderRadius:3,marginTop:20,overflow:"hidden"}}><div style={{width:"60%",height:"100%",background:`linear-gradient(90deg, ${CL.go}, ${CL.am})`,borderRadius:3,animation:"pulse 1.5s infinite"}}/></div></div>;

  // AI Advisor
  const askAI=async()=>{
    if(!aiMsg.trim())return;const msg=aiMsg;setAiMsg("");setAiLoad(true);
    const hist=[...(D.aiHistory||[]),{role:"user",content:msg}];upd("aiHistory",hist);
    try{
      const clientType=D.clientProfile?.clientType||"both";
      const opsKnowledge=clientType==="trust"?"You have deep expertise in Private Irrevocable Trust operations including cost basis transfers, Demand Notes, Form 1041, LLC management, and banking commingling prevention.":clientType==="pma"?"You have deep expertise in §508(c)(1)(A) Foundation operations including donation certificates, 60% AGI limits, mission buckets, member management, and annual compliance.":"You have deep expertise in BOTH Trust and §508(c)(1)(A) Foundation operations including the Trust-PMA relationship, combined financial flow, dual-entity compliance, and tax optimization strategies.";
      const callContext=(D.clientCalls||[]).length>0?`\nCLIENT CALL NOTES (${(D.clientCalls||[]).length} recorded):\n${(D.clientCalls||[]).slice(-5).map(c=>`[${c.date}] ${c.subject}: ${c.notes.substring(0,200)}`).join("\n")}`:"";
      const sys=`You are the Family Wealth Strategic Advisor. Expert in private irrevocable non-grantor complex discretionary spendthrift trusts, §508(c)(1)(A) ecclesiastical trusts/PMA foundations, trust-owned LLCs, Demand Notes, tax optimization, personal income tax (1040), retirement planning, real estate, and debt management. 
CORE INVESTMENT PHILOSOPHY: The foundation of ALL wealth building is whole life insurance. EVERY client should FIRST fund a properly structured whole life policy inside the trust. Once cash value accumulates, the client borrows AGAINST the policy to fund investments — real estate, business, crypto, or any other vehicle. The policy continues to earn dividends and grow even while borrowed against. This is the Infinite Banking strategy. NEVER recommend investments without first confirming the client has a whole life foundation. If they do not, the FIRST recommendation is ALWAYS to establish one.
CLIENT FINANCIAL PERSONALITY:
- Windfall instinct: ${D.financialProfile?.windfall||"Not answered"}
- Market drop reaction: ${D.financialProfile?.marketDrop||"Not answered"}
- Risk preference: ${D.financialProfile?.riskChoice||"Not answered"}
- Investment involvement: ${D.financialProfile?.involvement||"Not answered"}
- Primary financial fear: ${D.financialProfile?.fearFactor||"Not answered"}
- Decision-making style: ${D.financialProfile?.decisionStyle||"Not answered"}
- Freedom definition: ${D.financialProfile?.freedomDef||"Not answered"}
- Debt as tool: ${D.financialProfile?.debtTool||"Not answered"}
- Core priority: ${D.financialProfile?.corePriority||"Not answered"}
- Financial identity: ${D.financialProfile?.identity||"Not answered"}
Use these personality answers to tailor ALL advice. Match their communication style, risk comfort, and values.
${opsKnowledge}${callContext}
CLIENT TYPE: ${clientType==="trust"?"Trust Only":clientType==="pma"?"§508(c)(1)(A) Only":"Trust + Foundation"}
CLIENT PROFILE: ${D.clientProfile.occupation||"Not set"}, ${D.clientProfile.maritalStatus||"N/A"}, Risk: ${D.clientProfile.riskTolerance}, Horizon: ${D.clientProfile.timeHorizon}, Retirement Age: ${D.clientProfile.retirementAge}, ${(D.clientProfile.goals||[]).length} goals set.
TRUST: "${D.trust.name}", ${(D.trust.assets||[]).length} assets ($${totalAssets.toLocaleString()}), Demand Notes $${remNotes.toLocaleString()} remaining.
FOUNDATION: "${D.pma.name||"Not Set"}" (${D.pma.type||"§508(c)(1)(A)"}), donations $${totalDon.toLocaleString()}, ${(D.pma.members||[]).length} members.
PERSONAL TAX: AGI $${agi.toLocaleString()}, W-2 income $${totalW2.toLocaleString()}, 60% AGI limit $${donationLimit.toLocaleString()}, remaining donation capacity $${Math.max(0,donationLimit-totalDon).toLocaleString()}.
TAX SAVINGS: Deferred cap gains savings $${totalDeferredCG.toLocaleString()}, donation savings $${totalDonationSavings.toLocaleString()}, total savings $${totalAllSavings.toLocaleString()}.
ASSETS: ${(D.llc.entities||[]).length} LLCs, ${(D.insurance.policies||[]).length} policies ($${totalFace.toLocaleString()} face), Portfolio $${portfolioVal.toLocaleString()}, Retirement $${totalRetirement.toLocaleString()}, RE equity $${totalREEquity.toLocaleString()}, Debt $${totalDebt.toLocaleString()}.
FULL NET WORTH: $${fullNetWorth.toLocaleString()}.
${crit} critical alerts. Give strategic, actionable advice. When suggesting investments, consider client risk tolerance, time horizon, and current tax position. Reference Trust Indenture sections, COA numbers, §508(c)(1)(A) compliance, and IRC sections. Be direct and specific. Only reference operations relevant to the client's type (${clientType}).`;
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:hist.slice(-10).map(m=>({role:m.role,content:m.content}))})});
      const data=await r.json();const reply=data.content?.map(c=>c.text||"").join("\n")||"Please try again.";
      upd("aiHistory",[...hist,{role:"assistant",content:reply}]);
    }catch{upd("aiHistory",[...hist,{role:"assistant",content:"Connection error. Try again."}]);}
    setAiLoad(false);setTimeout(()=>{if(aiRef.current)aiRef.current.scrollTop=aiRef.current.scrollHeight;},100);
  };

  const tabs=[
    {id:"dash",l:"Dashboard",i:"\u25C8"},
    {id:"profile",l:"Client Profile",i:"\u2660"},
    {id:"docbuilder",l:"Doc Builder",i:"\u270E"},
    {id:"trust",l:"Trust",i:"\u26B1"},
    {id:"demand",l:"Demand Notes",i:"\u2709"},
    {id:"gov",l:"Governance",i:"\u2694"},
    {id:"portfolio",l:"Portfolio",i:"\u2197"},
    {id:"llc",l:"LLC",i:"\u2692"},
    {id:"pma",l:"Foundation",i:"\u2740"},
    {id:"insurance",l:"Insurance",i:"\u2606"},
    {id:"annuity",l:"Annuities",i:"\u29BE"},
    {id:"realestate",l:"Real Estate",i:"\u2302"},
    {id:"retirement",l:"Retirement",i:"\u2600"},
    {id:"banking",l:"Banking",i:"\u2616"},
    {id:"debtmgr",l:"Debt",i:"\u229F"},
    {id:"personaltax",l:"1040 Personal",i:"\u2756"},
    {id:"tax",l:"1041 Trust",i:"\u2263"},
    {id:"taxsavings",l:"Tax Savings",i:"\u2714"},
    {id:"cashflow",l:"Cash Flow",i:"\u2194"},
    {id:"billpay",l:"Bill Pay",i:"\u2637"},
    {id:"compliance",l:"Compliance",i:"\u2611"},
    {id:"pl",l:"P&L",i:"\u2261"},
    {id:"docs",l:"Documents",i:"\u2397"},
    {id:"calendar",l:"Calendar",i:"\u2315"},
    {id:"contacts",l:"Contacts",i:"\u260E"},
    {id:"succession",l:"Succession",i:"\u21BB"},
    {id:"ai",l:"AI Advisor",i:"\u2605"},
    {id:"clientcalls",l:"Client Calls",i:"\u260E"},
    {id:"opsmanual",l:"Ops Manual",i:"\u2637"},
    {id:"pricing",l:"Plan Overview",i:"\u2726"},
    {id:"log",l:"Audit Log",i:"\u2630"},
    {id:"alerts",l:`Alerts${crit+warns?` (${crit+warns})`:""}`,i:"\u26A0"},
    {id:"settings",l:"Settings",i:"\u2699"},
  ];

  return(<div style={{background:`linear-gradient(135deg, ${CL.bg} 0%, #0f1628 50%, #0d1220 100%)`,minHeight:"100vh",fontFamily:"'Segoe UI',-apple-system,sans-serif",color:CL.tx}}>
    {/* Toast */}
    {toast&&<div style={{position:"fixed",top:16,right:16,zIndex:999,background:toast.type==="success"?CL.gr:CL.rd,color:CL.bg,padding:"10px 20px",borderRadius:8,fontWeight:600,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>{toast.msg}</div>}
    {/* Document Viewer Modal */}
    {viewDoc&&<DocViewer doc={viewDoc} onClose={()=>setViewDoc(null)} onSave={(newContent)=>{const files=(D.documents.files||[]).map(f=>f.id===viewDoc.id?{...f,content:newContent}:f);upd("documents.files",files);setViewDoc({...viewDoc,content:newContent});showToast("Document updated");}}/>}

    {/* Header */}
    <div style={{background:`linear-gradient(90deg, ${CL.c1}, ${CL.c2})`,borderBottom:`2px solid ${CL.go}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div><h1 style={{margin:0,fontSize:16,fontWeight:800,color:CL.go,letterSpacing:3,fontFamily:"'JetBrains Mono',monospace"}}>FAMILY WEALTH</h1><div style={{fontSize:9,color:CL.mt,letterSpacing:2}}>COMMAND CENTER v4.0</div></div>
        {D.trust.name&&<span style={{fontSize:11,color:CL.dm,borderLeft:`1px solid ${CL.bd}`,paddingLeft:12}}>{D.trust.name}</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="\u2315 Search..." style={{padding:"5px 10px",background:CL.bg,border:`1px solid ${CL.bd}`,borderRadius:5,color:CL.tx,fontSize:11,width:160,outline:"none"}} />
        <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800,color:CL.gr,fontFamily:"'JetBrains Mono',monospace"}}>{fK(fullNetWorth)}</div><div style={{fontSize:8,color:CL.mt,letterSpacing:1}}>FULL NET WORTH</div></div>
        {crit>0&&<span style={{background:CL.rdB,color:CL.rd,padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:700}}>{crit}</span>}
        {warns>0&&<span style={{background:CL.amB,color:CL.am,padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:700}}>{warns}</span>}
        {crit===0&&warns===0&&<span style={{background:CL.grB,color:CL.gr,padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:700}}>\u2713</span>}
      </div>
    </div>

    <div style={{display:"flex",minHeight:"calc(100vh - 48px)"}}>
      {/* Sidebar */}
      <nav style={{width:185,background:`linear-gradient(180deg, ${CL.c1}, #0e1525)`,borderRight:`1px solid ${CL.bd}`,padding:"8px 0",flexShrink:0,overflowY:"auto",maxHeight:"calc(100vh - 52px)"}}>
        {tabs.map(t=>(<div key={t.id} onClick={()=>{setTab(t.id);setSub("");rf();}} style={{padding:"8px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:12,
          color:tab===t.id?CL.go:CL.dm,fontWeight:tab===t.id?700:400,background:tab===t.id?CL.goG:"transparent",borderLeft:tab===t.id?`2px solid ${CL.go}`:"2px solid transparent",transition:"all 0.1s"}}>
          <span style={{fontSize:14,width:18,textAlign:"center"}}>{t.i}</span><span>{t.l}</span>
        </div>))}
      </nav>

      {/* Main */}
      <main style={{flex:1,padding:24,overflowY:"auto",maxHeight:"calc(100vh - 48px)"}}>

        {/* DASHBOARD */}
        {tab==="dash"&&<>
          {/* Quick Actions */}
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            <Btn sm onClick={()=>{setTab("demand");setSub("quickDraw");}}>Quick Draw</Btn>
            <Btn sm onClick={()=>{setTab("trust");setSub("addExp");}}>Record Expense</Btn>
            <Btn sm onClick={()=>{setTab("pma");setSub("addDon");}}>Record Donation</Btn>
            <Btn sm onClick={()=>{setTab("trust");setSub("addInc");}}>Record Income</Btn>
            <Btn sm v="blue" onClick={()=>{const mins=genMinutes(D);const entry={id:uid(),name:`Minutes_${today()}.txt`,type:"minutes",date:today(),content:mins};upd("documents.files",[...(D.documents.files||[]),entry]);upd("settings.lastMinutes",today());log("MINUTES","Auto-generated monthly meeting minutes");showToast("Meeting minutes generated and filed!");}}>Auto-Generate Trust Minutes</Btn>
            <Btn sm v="blue" onClick={()=>{const mins=genPMAMinutes(D);const entry={id:uid(),name:`PMA_Minutes_${today()}.txt`,type:"minutes",date:today(),content:mins};upd("documents.files",[...(D.documents.files||[]),entry]);upd("pma.lastAnnualMeeting",today());upd("settings.lastAnnual",today());log("PMA MINUTES","Auto-generated Foundation meeting minutes");showToast("Foundation minutes generated and filed!");}}>Auto-Generate Foundation Minutes</Btn>
          </div>
          <Sec title="Estate Overview">
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
              <Stat label="Trust Assets" value={fK(totalAssets)} sub={`${(D.trust.assets||[]).length} assets`} icon="\u26B1" />
              <Stat label="Demand Note Balance" value={fK(remNotes)} color={remNotes<totalNotes*.1?CL.rd:CL.gr} icon="\u2709" />
              <Stat label="Portfolio" value={fK(portfolioVal)} color={CL.pu} icon="\u2197" />
              <Stat label="Insurance" value={fK(totalFace)} sub={`Cash: ${fK(totalCash)}`} icon="\u2606" />
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
              <Stat label="Trust Income YTD" value={fK(totalTrustInc)} color={CL.gr} />
              <Stat label="LLC Net" value={fK(llcRev-llcExp)} color={CL.cy} />
              <Stat label="Foundation" value={fK(totalDon)} color={CL.bl} />
              <Stat label="Annuities" value={fK(annuityVal)} color={CL.am} />
            </div>
          </Sec>
          <Sec title="Personal & Tax">
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
              <Stat label="Personal AGI" value={fK(agi)} sub={`W-2: ${fK(totalW2)}`} color={CL.cy} icon="\u2756"/>
              <Stat label="60% AGI Limit" value={fK(donationLimit)} sub={`Donated: ${fK(totalDon)}`} color={totalDon>donationLimit?CL.rd:CL.gr} icon="\u2714"/>
              <Stat label="Tax Savings" value={fK(totalAllSavings)} sub="Cumulative" color={CL.gr} icon="\u2605"/>
              <Stat label="Retirement" value={fK(totalRetirement)} color={CL.bl} icon="\u2600"/>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
              <Stat label="Real Estate Equity" value={fK(totalREEquity)} sub={`Value: ${fK(totalREValue)}`} color={CL.am} icon="\u2302"/>
              <Stat label="Total Debt" value={fK(totalDebt)} sub={`${fK(monthlyDebtPayments)}/mo`} color={CL.rd} icon="\u229F"/>
              <Stat label="Full Net Worth" value={fK(fullNetWorth)} color={CL.go} icon="\u25C8"/>
              <Stat label="Rental Income" value={fK(totalRERent)} sub="Annual" color={CL.gr}/>
            </div>
          </Sec>
          {totalNotes>0&&<Sec title="Demand Note Capacity"><Card><PBar used={totalDraws} total={totalNotes}/></Card></Sec>}
          {alerts.length>0&&<Sec title="Active Alerts">{alerts.slice(0,5).map((a,i)=>(<div key={i} style={{background:a.t==="critical"?CL.rdB:a.t==="warning"?CL.amB:a.t==="success"?CL.grB:CL.blB,border:`1px solid ${CL.bd}`,borderRadius:6,padding:"8px 12px",marginBottom:4,display:"flex",alignItems:"center",gap:8,fontSize:12}}><Badge t={a.t}/><span style={{flex:1}}>{a.m}</span><span style={{fontSize:9,color:CL.mt}}>{a.e}</span></div>))}</Sec>}
        </>}

        {/* GOVERNANCE */}
        {tab==="gov"&&<>
          <Sec title="Trust Governance" tag="ROLES & AUTHORITY">
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:12}}>SETTLOR (Non-Grantor \u2014 No Control)</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <Inp label="Name" value={D.governance.settlor.name} onChange={v=>upd("governance.settlor.name",v)} />
                <Inp label="Phone" value={D.governance.settlor.phone} onChange={v=>upd("governance.settlor.phone",v)} />
                <Inp label="Email" value={D.governance.settlor.email} onChange={v=>upd("governance.settlor.email",v)} />
              </div>
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:CL.go}}>TRUSTEES</div>
                <Btn sm onClick={()=>{const t=[...(D.governance.trustees||[]),{role:"Co-Trustee",name:"",phone:"",email:"",status:"active",appointed:today(),id:uid()}];upd("governance.trustees",t);}}>+ Add Trustee</Btn>
              </div>
              {(D.governance.trustees||[]).map((tr,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr 1fr auto",gap:8,marginBottom:8,alignItems:"end"}}>
                <Inp label="Role" value={tr.role} onChange={v=>{const t=[...D.governance.trustees];t[i]={...t[i],role:v};upd("governance.trustees",t);}} />
                <Inp label="Name" value={tr.name} onChange={v=>{const t=[...D.governance.trustees];t[i]={...t[i],name:v};upd("governance.trustees",t);}} />
                <Inp label="Phone" value={tr.phone} onChange={v=>{const t=[...D.governance.trustees];t[i]={...t[i],phone:v};upd("governance.trustees",t);}} />
                <Inp label="Email" value={tr.email} onChange={v=>{const t=[...D.governance.trustees];t[i]={...t[i],email:v};upd("governance.trustees",t);}} />
                <Sel label="Status" value={tr.status} onChange={v=>{const t=[...D.governance.trustees];t[i]={...t[i],status:v};upd("governance.trustees",t);}} options={["active","resigned","deceased","incapacitated"]} />
                {i>0&&<Btn sm v="danger" onClick={()=>{const t=D.governance.trustees.filter((_,j)=>j!==i);upd("governance.trustees",t);}}>&times;</Btn>}
              </div>))}
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:12}}>TRUST PROTECTOR</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
                <Inp label="Name" value={D.governance.protector.name} onChange={v=>upd("governance.protector.name",v)} />
                <Inp label="Phone" value={D.governance.protector.phone} onChange={v=>upd("governance.protector.phone",v)} />
                <Inp label="Email" value={D.governance.protector.email} onChange={v=>upd("governance.protector.email",v)} />
                <Inp label="Appointed" value={D.governance.protector.appointed} onChange={v=>upd("governance.protector.appointed",v)} type="date" />
              </div>
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:CL.go}}>SUCCESSOR TRUSTEES</div>
                <Btn sm onClick={()=>{const s=[...(D.governance.successors||[]),{name:"",phone:"",email:"",order:(D.governance.successors||[]).length+1,id:uid()}];upd("governance.successors",s);}}>+ Add Successor</Btn>
              </div>
              {(D.governance.successors||[]).map((sc,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"auto 2fr 1fr 1fr auto",gap:8,marginBottom:8,alignItems:"end"}}>
                <Inp label="Order" value={sc.order} onChange={v=>{const s=[...D.governance.successors];s[i]={...s[i],order:v};upd("governance.successors",s);}} />
                <Inp label="Name" value={sc.name} onChange={v=>{const s=[...D.governance.successors];s[i]={...s[i],name:v};upd("governance.successors",s);}} />
                <Inp label="Phone" value={sc.phone} onChange={v=>{const s=[...D.governance.successors];s[i]={...s[i],phone:v};upd("governance.successors",s);}} />
                <Inp label="Email" value={sc.email} onChange={v=>{const s=[...D.governance.successors];s[i]={...s[i],email:v};upd("governance.successors",s);}} />
                <Btn sm v="danger" onClick={()=>{const s=D.governance.successors.filter((_,j)=>j!==i);upd("governance.successors",s);}}>&times;</Btn>
              </div>))}
            </Card>
            <Card style={{borderColor:D.governance.triggerStatus==="alert"?CL.rd:CL.bd}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.rd,marginBottom:12}}>\u26A0 TRIGGER EVENT STATUS</div>
              <Sel label="Current Status" value={D.governance.triggerStatus} onChange={v=>{upd("governance.triggerStatus",v);if(v==="alert")log("TRIGGER","Trigger Event alert activated");}} options={[{value:"none",label:"None \u2014 Normal Operations"},{value:"monitoring",label:"Monitoring \u2014 Trustee health concern"},{value:"alert",label:"ALERT \u2014 Trigger Event imminent/active"}]} />
              <TextArea label="Notes" value={D.governance.triggerNotes} onChange={v=>upd("governance.triggerNotes",v)} rows={3} />
              {D.governance.triggerStatus==="alert"&&<div style={{background:CL.rdB,borderRadius:6,padding:10,marginTop:10,fontSize:12,color:CL.rd}}>
                SUCCESSOR TRUSTEES NOTIFIED. Review succession protocol in the Succession tab. Independent Trustee must be appointed immediately upon a confirmed Trigger Event.
              </div>}
            </Card>
          </Sec>
          <Sec title="Beneficiaries" tag="UNITS OF BENEFICIAL INTEREST" actions={<Btn sm onClick={()=>setSub(sub==="addBen"?"":"addBen")}>+ Add Beneficiary</Btn>}>
            {sub==="addBen"&&<Card style={{marginBottom:12}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8}}>
                <Inp label="Name" value={f.bName||""} onChange={v=>uf("bName",v)} />
                <Inp label="Units" value={f.bUnits||""} onChange={v=>uf("bUnits",v)} type="number" placeholder="25" />
                <Inp label="Relationship" value={f.bRel||""} onChange={v=>uf("bRel",v)} placeholder="Son" />
                <Inp label="DOB" value={f.bDob||""} onChange={v=>uf("bDob",v)} type="date" />
                <Inp label="Email" value={f.bEmail||""} onChange={v=>uf("bEmail",v)} />
              </div>
              <Btn onClick={()=>{if(f.bName){addTo("trust.beneficiaries",{name:f.bName,units:f.bUnits,relationship:f.bRel,dob:f.bDob,email:f.bEmail,status:"active",added:today()});rf();setSub("");showToast(`Beneficiary ${f.bName} added`);}}} >Add Beneficiary (Record in Minutes)</Btn>
            </Card>}
            {(D.trust.beneficiaries||[]).length>0&&<TH headers={["Name","Units","Relationship","DOB","Email","Status","Added"]}
              rows={(D.trust.beneficiaries||[]).map(b=>[b.name,b.units,b.relationship,b.dob,b.email,<span style={{color:b.status==="active"?CL.gr:CL.rd}}>{b.status}</span>,b.added])}
              onDel={i=>{const b=D.trust.beneficiaries[i];log("BENEFICIARY REMOVED",`${b.name} removed`);rmFrom("trust.beneficiaries",i);}} />}
            <div style={{marginTop:12}}>
              <Btn sm v="blue" onClick={()=>{(D.trust.beneficiaries||[]).forEach(b=>{const report=genBeneficiaryReport(D,b);const entry={id:uid(),name:`Beneficiary_Report_${b.name}_${today()}.txt`,type:"beneficiary-report",date:today(),content:report};upd("documents.files",[...(D.documents.files||[]),entry]);});showToast("Beneficiary reports generated and filed!");}}>Generate Monthly Beneficiary Reports</Btn>
            </div>
          </Sec>
        </>}

        {/* TRUST - reuse patterns from v2 */}
        {tab==="trust"&&<>
          <Sec title="Trust Information" tag="FAMILY TRUST">
            <Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
              <Inp label="Trust Name" value={D.trust.name} onChange={v=>upd("trust.name",v)} placeholder="Legacy Fortress Holdings" />
              <Inp label="EIN" value={D.trust.ein} onChange={v=>upd("trust.ein",v)} />
              <Inp label="Situs" value={D.trust.situs} onChange={v=>upd("trust.situs",v)} placeholder="Alabama" />
              <Inp label="Established" value={D.trust.established} onChange={v=>upd("trust.established",v)} type="date" />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <Inp label="Renewal Date" value={D.trust.renewalDate} onChange={v=>{upd("trust.renewalDate",v);if(v){const rd=new Date(v);const alertDate=new Date(rd);alertDate.setFullYear(alertDate.getFullYear()-1);const calEntry={date:alertDate.toISOString().slice(0,10),description:`TRUST RENEWAL: Begin renewal process (due ${v})`,entity:"Trust",recurring:true,id:uid()};const exists=(D.calendar||[]).some(c=>c.description&&c.description.includes("TRUST RENEWAL"));if(!exists)addTo("calendar",calEntry);}}} type="date" />
              <Sel label="Renewal Period" value={D.trust.renewalPeriod} onChange={v=>upd("trust.renewalPeriod",v)} options={[{value:"21",label:"21 Years"},{value:"perpetual",label:"Perpetual"},{value:"custom",label:"Custom"}]} />
            </div>
            {D.trust.renewalDate&&<Card style={{marginTop:10,borderColor:CL.am}}>
              <div style={{fontSize:11,color:CL.am}}>
                <div style={{fontWeight:700,marginBottom:4}}>TRUST RENEWAL INSTRUCTIONS:</div>
                <div>1. Review the Trust Indenture for renewal provisions (typically Section 2 or 3)</div>
                <div>2. Draft a Resolution to Renew signed by all active Trustees</div>
                <div>3. File the Resolution with the Trust Protector</div>
                <div>4. Update the Trust Renewal Date in this section</div>
                <div>5. Record the renewal in Meeting Minutes</div>
                <div>6. A calendar reminder is auto-set 1 year before the renewal date</div>
              </div>
            </Card>}
            </Card>
          </Sec>
          <Sec title="Assets" actions={<><Btn sm onClick={()=>setSub(sub==="addAsset"?"":"addAsset")}>+ Asset</Btn><Btn sm v="blue" onClick={()=>setSub(sub==="sellAsset"?"":"sellAsset")}>Sell/Dispose Asset</Btn></>}>
            <Card style={{marginBottom:10,borderColor:CL.go}}>
              <div style={{fontSize:10,color:CL.go,fontWeight:700}}>COMMON LAW TRUST \u2014 COST BASIS RULE: This is a private irrevocable ecclesiastical common law (contract) trust. It is NOT taxed at the trust level like a statutory/legislative trust. All assets are transferred at ABSOLUTE COST BASIS (what the seller originally paid). The Demand Note issued for that amount offsets any taxable event. When the Trust sells an asset, the Demand Note is reduced by the cost basis amount. Capital gains savings (what WOULD have been paid personally) are auto-recorded in Tax Savings. Draws against the Demand Note are NOT taxable distributions \u2014 they are loan repayments. Only after a note is fully depleted do further distributions become taxable K-1 income.</div>
            </Card>
            {sub==="addAsset"&&<Card style={{marginBottom:12}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Description" value={f.aDesc||""} onChange={v=>uf("aDesc",v)} /><Inp label="COA" value={f.aCoa||""} onChange={v=>uf("aCoa",v)} /><Inp label="Cost Basis" value={f.aBasis||""} onChange={v=>uf("aBasis",v)} type="number" /><Inp label="Date" value={f.aDate||""} onChange={v=>uf("aDate",v)} type="date" /><Inp label="Note Holder" value={f.aHolder||""} onChange={v=>uf("aHolder",v)} />
            </div><div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>{if(f.aDesc){const asset={description:f.aDesc,coa:f.aCoa,costBasis:f.aBasis,dateAcquired:f.aDate,noteHolder:f.aHolder};addTo("trust.assets",asset);if(f.aBasis&&f.aHolder)addTo("trust.demandNotes",{holder:f.aHolder,amount:f.aBasis,date:f.aDate,relatedAsset:f.aDesc});
                const bos=genBillOfSale(D.trust,asset);const entry={id:uid(),name:`Bill_of_Sale_${f.aDesc}_${today()}.txt`,type:"bill-of-sale",category:"Bill of Sale",date:today(),content:bos};upd("documents.files",[...(D.documents.files||[]),entry]);
                rf();setSub("");showToast("Asset added + Demand Note + Bill of Sale generated!");}}} >Add + Auto Demand Note + Bill of Sale</Btn>
            </div></Card>}
            {sub==="sellAsset"&&<Card style={{marginBottom:12,borderColor:CL.am}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.am,marginBottom:10}}>ASSET SALE / DISPOSITION</div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
                <Sel label="Asset to Sell" value={f.sellAsset||""} onChange={v=>uf("sellAsset",v)} options={(D.trust.assets||[]).map((a,i)=>({value:i.toString(),label:a.description}))} />
                <Inp label="Sale Price" value={f.sellPrice||""} onChange={v=>uf("sellPrice",v)} type="number" />
                <Inp label="Closing Costs" value={f.sellClosing||""} onChange={v=>uf("sellClosing",v)} type="number" />
                <Inp label="Sale Date" value={f.sellDate||""} onChange={v=>uf("sellDate",v)} type="date" />
              </div>
              <Inp label="Loan Payoff (if any)" value={f.sellLoan||""} onChange={v=>uf("sellLoan",v)} type="number" />
              <Btn v="danger" onClick={()=>{if(f.sellAsset!==undefined&&f.sellAsset!==""){const idx=parseInt(f.sellAsset);const asset=D.trust.assets[idx];if(asset){const saleData={salePrice:f.sellPrice,closingCosts:f.sellClosing,saleDate:f.sellDate||today(),loanPayoff:f.sellLoan};
                const saleDoc=genAssetSaleDoc(D.trust,asset,saleData);const entry={id:uid(),name:`Asset_Sale_${asset.description}_${today()}.txt`,type:"bill-of-sale",category:"Bill of Sale",date:today(),content:saleDoc};upd("documents.files",[...(D.documents.files||[]),entry]);
                const costBasis=parseFloat(asset.costBasis)||0;const sp=parseFloat(f.sellPrice)||0;const gl=sp-costBasis;const isLT=asset.dateAcquired&&(Date.now()-new Date(asset.dateAcquired).getTime())>365*24*60*60*1000;
                if(gl!==0)addTo("trust.income",{date:f.sellDate||today(),description:`${gl>=0?"Gain":"Loss"} on sale of ${asset.description}`,coa:isLT?"425":"420",amount:Math.abs(gl).toString()});
                if(f.sellClosing)addTo("trust.expenses",{date:f.sellDate||today(),description:`Closing costs - ${asset.description}`,coa:"620",amount:f.sellClosing});
                // DEMAND NOTE ADJUSTMENT: Reduce note by cost basis (asset no longer secures the note)
                const matchingNote=(D.trust.demandNotes||[]).find(n=>n.relatedAsset===asset.description||n.holder===asset.noteHolder);
                if(matchingNote){addTo("trust.draws",{noteId:matchingNote.id,date:f.sellDate||today(),amount:costBasis.toString(),purpose:`Asset sold from trust: ${asset.description} (cost basis reduction)`,autoGenerated:true});
                  log("DEMAND NOTE","Note reduced by "+fmt(costBasis)+" due to sale of "+asset.description);}
                // AUTO-POPULATE TAX SAVINGS: Capital gains that WOULD have been paid personally outside the trust
                if(gl>0){const cgRate=isLT?23.8:parseFloat(D.clientProfile?.riskTolerance==="Conservative"?"22":"24")||24;const taxSaved=(gl*cgRate/100);
                  addTo("taxSavings.deferredCapGains",{description:`Cap gains saved: ${asset.description} (absolute cost basis ${fmt(costBasis)}, sold from trust at ${fmt(sp)})`,gainAmount:gl.toString(),taxRate:cgRate.toString(),taxSaved:taxSaved.toFixed(2),date:f.sellDate||today(),year:D.taxData?.year||"2025",autoGenerated:true});}
                rmFrom("trust.assets",idx);log("ASSET SOLD",`${asset.description} sold for ${fmt(sp)}, ${gl>=0?"gain":"loss"} of ${fmt(Math.abs(gl))}, demand note reduced by ${fmt(costBasis)}`);
                rf();setSub("");showToast(`Asset sold. Demand note reduced by ${fmt(costBasis)}.${gl>0?` Cap gains savings of ${fmt(gl*(isLT?23.8:24)/100)} auto-recorded.`:""}`);
              }}}} >Process Sale + Generate Documentation</Btn>
            </Card>}
            {(D.trust.assets||[]).length>0&&<TH headers={["Description","COA","Basis","Date","Holder"]} rows={(D.trust.assets||[]).map(a=>[a.description,`#${a.coa}`,fmt(a.costBasis),a.dateAcquired,a.noteHolder])} onDel={i=>rmFrom("trust.assets",i)}/>}
          </Sec>
          <Sec title="Income" actions={<Btn sm onClick={()=>setSub(sub==="addInc"?"":"addInc")}>+ Income</Btn>}>
            {sub==="addInc"&&<Card style={{marginBottom:12}}><div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr",gap:8}}>
              <Inp label="Date" value={f.iDate||""} onChange={v=>uf("iDate",v)} type="date" /><Inp label="Description" value={f.iDesc||""} onChange={v=>uf("iDesc",v)} /><Inp label="COA" value={f.iCoa||""} onChange={v=>uf("iCoa",v)} /><Inp label="Amount" value={f.iAmt||""} onChange={v=>uf("iAmt",v)} type="number" />
            </div><Btn onClick={()=>{if(f.iDesc){addTo("trust.income",{date:f.iDate,description:f.iDesc,coa:f.iCoa,amount:f.iAmt});rf();setSub("");showToast("Income recorded");}}} >Record</Btn></Card>}
            {(D.trust.income||[]).length>0&&<TH headers={["Date","Description","COA","Amount"]} rows={(D.trust.income||[]).map(i=>[i.date,i.description,`#${i.coa}`,fmt(i.amount)])} onDel={i=>rmFrom("trust.income",i)}/>}
          </Sec>
          <Sec title="Expenses" actions={<Btn sm onClick={()=>setSub(sub==="addExp"?"":"addExp")}>+ Expense</Btn>}>
            {sub==="addExp"&&<Card style={{marginBottom:12}}><div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr",gap:8}}>
              <Inp label="Date" value={f.eDate||""} onChange={v=>uf("eDate",v)} type="date" /><Inp label="Description" value={f.eDesc||""} onChange={v=>uf("eDesc",v)} /><Inp label="COA" value={f.eCoa||""} onChange={v=>uf("eCoa",v)} /><Inp label="Amount" value={f.eAmt||""} onChange={v=>uf("eAmt",v)} type="number" />
            </div><Btn onClick={()=>{if(f.eDesc){addTo("trust.expenses",{date:f.eDate,description:f.eDesc,coa:f.eCoa,amount:f.eAmt});rf();setSub("");showToast("Expense recorded");}}} >Record</Btn></Card>}
            {(D.trust.expenses||[]).length>0&&<TH headers={["Date","Description","COA","Amount"]} rows={(D.trust.expenses||[]).map(e=>[e.date,e.description,`#${e.coa}`,fmt(e.amount)])} onDel={i=>rmFrom("trust.expenses",i)}/>}
          </Sec>
        </>}

        {/* DEMAND NOTES */}
        {tab==="demand"&&<Sec title="Demand Notes" tag="THE ENGINE">{(D.trust.demandNotes||[]).map(note=>{
          const draws=(D.trust.draws||[]).filter(d=>d.noteId===note.id);const td=draws.reduce((s,d)=>s+(parseFloat(d.amount)||0),0);const rem=(parseFloat(note.amount)||0)-td;
          return <Card key={note.id} style={{marginBottom:14}} danger={rem<=0}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div><div style={{fontSize:15,fontWeight:700,color:CL.wh}}>{note.holder}</div><div style={{fontSize:10,color:CL.dm}}>{fmt(note.amount)} \u2022 {note.date} \u2022 {note.relatedAsset}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:rem<=0?CL.rd:rem<(parseFloat(note.amount)||1)*.1?CL.am:CL.gr}}>{fmt(rem)}</div></div>
            </div>
            <PBar used={td} total={parseFloat(note.amount)||0}/>
            {rem<=0&&<div style={{background:CL.rdB,borderRadius:5,padding:8,marginTop:8,fontSize:11,color:CL.rd,fontWeight:700}}>\u26A0 DEPLETED. Further draws = TAXABLE.</div>}
            {draws.length>0&&<div style={{marginTop:10}}><TH headers={["Date","Amount","Purpose","Balance"]} rows={draws.map((d,di)=>[d.date,fmt(d.amount),d.purpose,fmt((parseFloat(note.amount)||0)-draws.slice(0,di+1).reduce((s,dd)=>s+(parseFloat(dd.amount)||0),0))])}/></div>}
            <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr 2fr auto",gap:6,alignItems:"end"}}>
              <Inp label="Date" value={f[`d${note.id}d`]||""} onChange={v=>uf(`d${note.id}d`,v)} type="date"/>
              <Inp label="Amount" value={f[`d${note.id}a`]||""} onChange={v=>uf(`d${note.id}a`,v)} type="number"/>
              <Inp label="Purpose" value={f[`d${note.id}p`]||""} onChange={v=>uf(`d${note.id}p`,v)} placeholder="Personal groceries"/>
              <Btn sm onClick={()=>{if(f[`d${note.id}a`]){addTo("trust.draws",{noteId:note.id,date:f[`d${note.id}d`],amount:f[`d${note.id}a`],purpose:f[`d${note.id}p`]});uf(`d${note.id}d`,"");uf(`d${note.id}a`,"");uf(`d${note.id}p`,"");showToast("Draw recorded");}}} >Draw</Btn>
            </div>
          </Card>})}{!(D.trust.demandNotes||[]).length&&<Card style={{textAlign:"center",color:CL.dm,padding:30}}>No Demand Notes. Add assets in Trust tab.</Card>}</Sec>}

        {/* PORTFOLIO */}
        {tab==="portfolio"&&<>
          <Card style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go}}>WALLET & EXCHANGE CONNECTIONS</div>
              <Btn sm v="blue" onClick={()=>setSub(sub==="connectWallet"?"":"connectWallet")}>+ Connect Wallet</Btn>
            </div>
            {sub==="connectWallet"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
              <Sel label="Type" value={f.walType||""} onChange={v=>uf("walType",v)} options={["Wallet","Exchange"]}/>
              <Sel label="Provider" value={f.walProv||""} onChange={v=>uf("walProv",v)} options={f.walType==="Exchange"?["Coinbase","Kraken","Binance US","Gemini","Robinhood","Other"]:["MetaMask","Trust Wallet","Ledger","Trezor","Phantom","Other"]}/>
              <Inp label="Wallet Address / API Key" value={f.walAddr||""} onChange={v=>uf("walAddr",v)} placeholder="0x... or API key"/>
              <Sel label="Mode" value={f.walMode||""} onChange={v=>uf("walMode",v)} options={[{value:"manual",label:"Manual Updates"},{value:"live",label:"Live Connection"}]}/>
            </div>}
            {sub==="connectWallet"&&<div>
              {f.walMode==="live"&&<div style={{background:CL.amB,borderRadius:6,padding:8,marginBottom:8,fontSize:11,color:CL.am}}>
                LIVE MODE: When connected, your wallet/exchange balances will auto-sync to the Command Center. You will need to provide a read-only API key from your exchange (Settings &gt; API &gt; Create Key &gt; Read Only). Never share your private keys or withdrawal-enabled API keys.
              </div>}
              <Btn sm onClick={()=>{if(f.walProv){addTo("portfolio.crypto",{name:`${f.walProv} ${f.walType||"Wallet"}`,quantity:"Connected",costBasis:"0",value:"0",dateAcquired:today(),walletAddress:f.walAddr,connectionMode:f.walMode||"manual",provider:f.walProv});rf();setSub("");showToast(`${f.walProv} ${f.walMode==="live"?"live connection":"manual tracking"} added!`);}}} >Connect</Btn>
            </div>}
            <div style={{fontSize:10,color:CL.dm}}>Connect your crypto wallets and exchanges for centralized tracking. Live mode auto-updates balances. Manual mode requires periodic updates.</div>
          </Card>
          {["crypto","stocks","metals","nfts","rwas","other"].map(cat=>{
          const labels={crypto:"Cryptocurrency",stocks:"Stocks & Equities",metals:"Precious Metals",nfts:"NFTs & Digital Assets",rwas:"Real World Assets",other:"Other"};
          const icons={crypto:"\u20BF",stocks:"\u2197",metals:"\u2B50",nfts:"\u2B21",rwas:"\u2302",other:"\u2726"};
          return <Sec key={cat} title={labels[cat]} tag={icons[cat]} actions={<Btn sm onClick={()=>setSub(sub===cat?"":cat)}>+ Add</Btn>}>
            {sub===cat&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Name" value={f[`${cat}N`]||""} onChange={v=>uf(`${cat}N`,v)}/><Inp label="Qty" value={f[`${cat}Q`]||""} onChange={v=>uf(`${cat}Q`,v)} type="number"/><Inp label="Cost Basis" value={f[`${cat}C`]||""} onChange={v=>uf(`${cat}C`,v)} type="number"/><Inp label="Value" value={f[`${cat}V`]||""} onChange={v=>uf(`${cat}V`,v)} type="number"/><Inp label="Date" value={f[`${cat}D`]||""} onChange={v=>uf(`${cat}D`,v)} type="date"/>
            </div><Btn onClick={()=>{if(f[`${cat}N`]){addTo(`portfolio.${cat}`,{name:f[`${cat}N`],quantity:f[`${cat}Q`],costBasis:f[`${cat}C`],value:f[`${cat}V`],dateAcquired:f[`${cat}D`]});["N","Q","C","V","D"].forEach(k=>uf(`${cat}${k}`,""));setSub("");}}} >Add</Btn></Card>}
            {(D.portfolio[cat]||[]).length>0&&<TH headers={["Name","Qty","Basis","Value","G/L","Date"]} rows={(D.portfolio[cat]||[]).map(a=>{const gl=(parseFloat(a.value)||0)-(parseFloat(a.costBasis)||0);return[a.name,a.quantity,fmt(a.costBasis),fmt(a.value),<span style={{color:gl>=0?CL.gr:CL.rd}}>{fmt(gl)}</span>,a.dateAcquired];})} onDel={i=>rmFrom(`portfolio.${cat}`,i)}/>}
          </Sec>})}</>}

        {/* LLC */}
        {tab==="llc"&&<>
          <Sec title="Trust-Owned LLCs" tag="ACTIVE\u2192PASSIVE" actions={<Btn sm onClick={()=>setSub(sub==="addLLC"?"":"addLLC")}>+ LLC</Btn>}>
            {sub==="addLLC"&&<Card style={{marginBottom:10}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
                <Inp label="LLC Name" value={f.ln||""} onChange={v=>uf("ln",v)}/><Inp label="EIN" value={f.le||""} onChange={v=>uf("le",v)}/><Sel label="Ownership Type" value={f.ltype||""} onChange={v=>uf("ltype",v)} options={[{value:"sole",label:"100% Trust-Owned"},{value:"split",label:"Split Ownership"}]}/><Inp label="State" value={f.ls||""} onChange={v=>uf("ls",v)}/>
              </div>
              {f.ltype==="sole"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:8}}>
                <Inp label="Trust Ownership %" value="100" onChange={()=>{}} disabled/><Sel label="Trust Role" value={f.lrole||""} onChange={v=>uf("lrole",v)} options={["Limited Partner (LP)","Member","Investor"]}/><Sel label="Tax Treatment" value={f.ltax||""} onChange={v=>uf("ltax",v)} options={["Disregarded Entity","Partnership","S-Corp K-1","C-Corp"]}/>
              </div>}
              {f.ltype==="split"&&<>
                <div style={{fontSize:11,color:CL.am,margin:"8px 0 4px",fontWeight:700}}>SPLIT OWNERSHIP \u2014 All owners must total 100%</div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
                  <Inp label="Trust Ownership %" value={f.lp||""} onChange={v=>uf("lp",v)} type="number" placeholder="49"/><Sel label="Trust Role" value={f.lrole||""} onChange={v=>uf("lrole",v)} options={["Limited Partner (LP)","Member","Managing Member","Investor"]}/><Sel label="Tax Treatment" value={f.ltax||""} onChange={v=>uf("ltax",v)} options={["Partnership K-1","S-Corp K-1","C-Corp Dividends"]}/><Inp label="Registered Agent" value={f.lra||""} onChange={v=>uf("lra",v)}/>
                </div>
                <div style={{fontSize:10,color:CL.go,margin:"8px 0 4px",fontWeight:700}}>OTHER OWNERS:</div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8}}>
                  <Inp label="Owner 2 Name" value={f.lo2n||""} onChange={v=>uf("lo2n",v)}/><Inp label="Owner 2 %" value={f.lo2p||""} onChange={v=>uf("lo2p",v)} type="number"/><Sel label="Owner 2 Role" value={f.lo2r||""} onChange={v=>uf("lo2r",v)} options={["General Partner (GP)","Managing Member","Member","LP","Investor"]}/>
                </div>
                {f.lo3n||f.lo3p?null:<div style={{marginTop:4}}><Btn sm v="ghost" onClick={()=>uf("lo3n"," ")}>+ Owner 3</Btn></div>}
                {(f.lo3n||f.lo3p)&&<div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,marginTop:4}}>
                  <Inp label="Owner 3 Name" value={f.lo3n||""} onChange={v=>uf("lo3n",v)}/><Inp label="Owner 3 %" value={f.lo3p||""} onChange={v=>uf("lo3p",v)} type="number"/><Sel label="Owner 3 Role" value={f.lo3r||""} onChange={v=>uf("lo3r",v)} options={["General Partner (GP)","Managing Member","Member","LP","Investor"]}/>
                </div>}
                {(()=>{const trustPct=parseFloat(f.lp)||0;const o2=parseFloat(f.lo2p)||0;const o3=parseFloat(f.lo3p)||0;const total=trustPct+o2+o3;
                  return total!==100&&total>0?<div style={{background:CL.rdB,borderRadius:5,padding:6,marginTop:6,fontSize:11,color:CL.rd}}>Ownership totals {total}% \u2014 must equal 100%</div>
                  :total===100?<div style={{background:CL.grB,borderRadius:5,padding:6,marginTop:6,fontSize:11,color:CL.gr}}>Ownership totals 100% \u2714</div>:null;
                })()}
              </>}
              <div style={{marginTop:8}}><Btn onClick={()=>{if(f.ln){const owners=[{name:"Trust",pct:f.ltype==="sole"?"100":f.lp,role:f.lrole||"LP"}];
                if(f.ltype==="split"){if(f.lo2n)owners.push({name:f.lo2n,pct:f.lo2p,role:f.lo2r});if(f.lo3n&&f.lo3n.trim())owners.push({name:f.lo3n,pct:f.lo3p,role:f.lo3r});}
                addTo("llc.entities",{name:f.ln,ein:f.le,pct:f.ltype==="sole"?"100":f.lp,state:f.ls,ownershipType:f.ltype||"sole",taxTreatment:f.ltax,registeredAgent:f.lra,owners});
                rf();setSub("");showToast(`${f.ln} added (${f.ltype==="split"?"split":"100% trust"} ownership)`);}}} >Add LLC</Btn></div>
            </Card>}
            {(D.llc.entities||[]).length>0&&(D.llc.entities||[]).map((llc,li)=> <Card key={llc.id||li} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div><div style={{fontSize:14,fontWeight:700,color:CL.wh}}>{llc.name}</div><div style={{fontSize:10,color:CL.dm}}>EIN: {llc.ein} \u2022 {llc.state} \u2022 {llc.taxTreatment||"Partnership"} \u2022 Trust: {llc.pct}%</div></div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{padding:"2px 8px",borderRadius:10,fontSize:9,fontWeight:700,color:llc.ownershipType==="split"?CL.am:CL.gr,background:llc.ownershipType==="split"?CL.amB:CL.grB,textTransform:"uppercase"}}>{llc.ownershipType==="split"?"SPLIT":"100% TRUST"}</span>
                  <span onClick={()=>rmFrom("llc.entities",li)} style={{cursor:"pointer",color:CL.rd,fontSize:14}}>&times;</span>
                </div>
              </div>
              {(llc.owners||[]).length>1&&<div style={{marginBottom:8}}>
                <div style={{fontSize:10,color:CL.mt,marginBottom:4,fontWeight:700}}>OWNERSHIP BREAKDOWN:</div>
                {(llc.owners||[]).map((o,oi)=><div key={oi} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"3px 0",borderBottom:`1px solid ${CL.bd}`}}>
                  <span style={{color:o.name==="Trust"?CL.go:CL.tx}}>{o.name}</span>
                  <span><span style={{color:CL.dm}}>{o.role}</span> <span style={{fontWeight:700,color:CL.go,marginLeft:8}}>{o.pct}%</span></span>
                </div>)}
                <div style={{fontSize:10,color:CL.am,marginTop:6}}>K-1 allocations will be based on ownership percentages. Trust receives {llc.pct}% of all income/loss. Income posted to Trust COA #455.</div>
              </div>}
            </Card>)}
          </Sec>
          <Sec title="LLC Income & K-1 Distributions" actions={<Btn sm onClick={()=>setSub(sub==="addLLCInc"?"":"addLLCInc")}>+ Income</Btn>}>
            {sub==="addLLCInc"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Date" value={f.liDate||""} onChange={v=>uf("liDate",v)} type="date"/>
              <Inp label="Description" value={f.liDesc||""} onChange={v=>uf("liDesc",v)}/>
              <Sel label="LLC" value={f.liLLC||""} onChange={v=>uf("liLLC",v)} options={(D.llc.entities||[]).map(l=>({value:l.name,label:l.name}))}/>
              <Inp label="Total Amount" value={f.liAmt||""} onChange={v=>uf("liAmt",v)} type="number"/>
              <Inp label="Trust Share" value={(()=>{const llc=(D.llc.entities||[]).find(l=>l.name===f.liLLC);const pct=parseFloat(llc?.pct)||100;return ((parseFloat(f.liAmt)||0)*pct/100).toFixed(2);})()}onChange={()=>{}} disabled/>
            </div><Btn onClick={()=>{if(f.liDesc&&f.liAmt){const llc=(D.llc.entities||[]).find(l=>l.name===f.liLLC);const pct=parseFloat(llc?.pct)||100;const trustShare=((parseFloat(f.liAmt)||0)*pct/100);
              addTo("llc.income",{date:f.liDate||today(),description:f.liDesc,llcName:f.liLLC,totalAmount:f.liAmt,trustPct:pct,trustShare:trustShare.toFixed(2),amount:trustShare.toFixed(2)});
              rf();setSub("");showToast(`LLC income recorded. Trust share (${pct}%): ${fmt(trustShare)}`);}}} >Record (Auto-Calculates Trust Share)</Btn></Card>}
            {(D.llc.income||[]).length>0&&<TH headers={["Date","Description","LLC","Total","Trust %","Trust Share"]} rows={(D.llc.income||[]).map(i=>[i.date,i.description,i.llcName||"",fmt(i.totalAmount||i.amount),`${i.trustPct||100}%`,fmt(i.trustShare||i.amount)])} onDel={i=>rmFrom("llc.income",i)}/>}
          </Sec>
          <Sec title="LLC Expenses" actions={<Btn sm onClick={()=>setSub(sub==="addLLCExp"?"":"addLLCExp")}>+ Expense</Btn>}>
            {sub==="addLLCExp"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr",gap:8}}>
              <Inp label="Date" value={f.leDate||""} onChange={v=>uf("leDate",v)} type="date"/><Inp label="Description" value={f.leDesc||""} onChange={v=>uf("leDesc",v)}/><Sel label="LLC" value={f.leLLC||""} onChange={v=>uf("leLLC",v)} options={(D.llc.entities||[]).map(l=>({value:l.name,label:l.name}))}/><Inp label="Amount" value={f.leAmt||""} onChange={v=>uf("leAmt",v)} type="number"/>
            </div><Btn onClick={()=>{if(f.leDesc){addTo("llc.expenses",{date:f.leDate||today(),description:f.leDesc,llcName:f.leLLC,amount:f.leAmt});rf();setSub("");}}} >Record</Btn></Card>}
            {(D.llc.expenses||[]).length>0&&<TH headers={["Date","Description","LLC","Amount"]} rows={(D.llc.expenses||[]).map(e=>[e.date,e.description,e.llcName||"",fmt(e.amount)])} onDel={i=>rmFrom("llc.expenses",i)}/>}
          </Sec>
          <Sec title="MSA/Lease Agreements" actions={<Btn sm onClick={()=>setSub(sub==="addMSA"?"":"addMSA")}>+ Agreement</Btn>}>
            {sub==="addMSA"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Name/Type" value={f.msaN||""} onChange={v=>uf("msaN",v)} placeholder="MSA - Carter LLC"/><Inp label="Amount" value={f.msaA||""} onChange={v=>uf("msaA",v)} type="number"/><Sel label="Frequency" value={f.msaF||""} onChange={v=>uf("msaF",v)} options={["Monthly","Quarterly","Annually"]}/><Inp label="Start" value={f.msaS||""} onChange={v=>uf("msaS",v)} type="date"/><Inp label="Renewal" value={f.msaR||""} onChange={v=>uf("msaR",v)} type="date"/>
            </div><Btn onClick={()=>{if(f.msaN){addTo("llc.msas",{name:f.msaN,amount:f.msaA,frequency:f.msaF,startDate:f.msaS,renewalDate:f.msaR});rf();setSub("");}}} >Add</Btn></Card>}
            {(D.llc.msas||[]).length>0&&<TH headers={["Agreement","Amount","Frequency","Start","Renewal"]} rows={(D.llc.msas||[]).map(m=>[m.name,fmt(m.amount),m.frequency,m.startDate,m.renewalDate])} onDel={i=>rmFrom("llc.msas",i)}/>}
          </Sec>
        </>}

        {/* FOUNDATION */}
        {tab==="pma"&&<>
          {/* Quick Actions */}
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            <Btn sm onClick={()=>setSub(sub==="addDon"?"":"addDon")}>Record Donation</Btn>
            <Btn sm onClick={()=>setSub(sub==="addPMAExp"?"":"addPMAExp")}>Record Expense</Btn>
            <Btn sm onClick={()=>setSub(sub==="addPMAInc"?"":"addPMAInc")}>Record Income</Btn>
            <Btn sm v="blue" onClick={()=>{const mins=genPMAMinutes(D);const entry={id:uid(),name:`PMA_Minutes_${today()}.txt`,type:"minutes",date:today(),content:mins};upd("documents.files",[...(D.documents.files||[]),entry]);upd("pma.lastAnnualMeeting",today());upd("settings.lastAnnual",today());log("PMA MINUTES","Auto-generated Foundation meeting minutes");showToast("Foundation meeting minutes generated and filed!");}}>Auto-Generate Meeting Minutes</Btn>
            <Btn sm v="blue" onClick={()=>{const rpt=genPMAAnnualReport(D);const entry={id:uid(),name:`PMA_Annual_Report_${D.taxData.year||"2025"}.txt`,type:"annual-report",date:today(),content:rpt};upd("documents.files",[...(D.documents.files||[]),entry]);log("PMA REPORT","Auto-generated Foundation annual report");showToast("Foundation annual report generated and filed!");}}>Auto-Generate Annual Report</Btn>
          </div>
          <Sec title="Foundation Setup" tag="§508(c)(1)(A)">
            <Card style={{marginBottom:12}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
              <Inp label="Organization Name" value={D.pma.name} onChange={v=>upd("pma.name",v)} placeholder="Kingdom Covenant Ministries"/>
              <Inp label="EIN" value={D.pma.ein} onChange={v=>upd("pma.ein",v)} placeholder="XX-XXXXXXX"/>
              <Inp label="Trustee / Director" value={D.pma.trustee} onChange={v=>upd("pma.trustee",v)}/>
              <Inp label="Established" value={D.pma.established} onChange={v=>upd("pma.established",v)} type="date"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Sel label="Organization Type" value={D.pma.type} onChange={v=>upd("pma.type",v)} options={["§508(c)(1)(A)","§501(c)(3)","PMA","Ecclesiastical Trust","Unincorporated Association"]}/>
              <Inp label="Situs (State)" value={D.pma.situs} onChange={v=>upd("pma.situs",v)} placeholder="Alabama"/>
            </div>
            <TextArea label="Mission Statement" value={D.pma.mission} onChange={v=>upd("pma.mission",v)} rows={3}/>
            <TextArea label="Purpose / Ministry Activities" value={D.pma.purpose} onChange={v=>upd("pma.purpose",v)} rows={3}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <TextArea label="Articles of Association Notes" value={D.pma.articles} onChange={v=>upd("pma.articles",v)} rows={2}/>
              <TextArea label="Bylaws Notes" value={D.pma.bylaws} onChange={v=>upd("pma.bylaws",v)} rows={2}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Annual Meeting Date" value={D.pma.annualMeetingDate} onChange={v=>upd("pma.annualMeetingDate",v)} type="date"/>
              <Inp label="Last Annual Meeting" value={D.pma.lastAnnualMeeting} onChange={v=>upd("pma.lastAnnualMeeting",v)} type="date"/>
            </div></Card>
          </Sec>
          <Sec title="Members" tag="BOARD & MEMBERSHIP" actions={<Btn sm onClick={()=>setSub(sub==="addMember"?"":"addMember")}>+ Member</Btn>}>
            {sub==="addMember"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Name" value={f.mN||""} onChange={v=>uf("mN",v)}/>
              <Sel label="Role" value={f.mR||""} onChange={v=>uf("mR",v)} options={["Trustee","Director","Board Member","Minister","Secretary","Treasurer","Member"]}/>
              <Inp label="Phone" value={f.mP||""} onChange={v=>uf("mP",v)}/>
              <Inp label="Email" value={f.mE||""} onChange={v=>uf("mE",v)}/>
              <Inp label="Date Joined" value={f.mD||""} onChange={v=>uf("mD",v)} type="date"/>
            </div><div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>{if(f.mN){const mem={name:f.mN,role:f.mR,phone:f.mP,email:f.mE,joined:f.mD||today(),status:"active"};addTo("pma.members",mem);
                const cert=genMemberCert(D.pma,mem);const entry={id:uid(),name:`Member_Cert_${f.mN}_${today()}.txt`,type:"member-cert",date:today(),content:cert};upd("documents.files",[...(D.documents.files||[]),entry]);
                rf();setSub("");showToast(`Member added. Certificate generated and filed!`);}}} >Add + Auto-Generate Certificate</Btn>
            </div></Card>}
            {(D.pma.members||[]).length>0&&<TH headers={["Name","Role","Phone","Email","Joined","Status"]} rows={(D.pma.members||[]).map(m=>[m.name,m.role,m.phone,m.email,m.joined,<span style={{color:m.status==="active"?CL.gr:CL.rd}}>{m.status}</span>])} onDel={i=>rmFrom("pma.members",i)}/>}
          </Sec>
          <Sec title="Donations" actions={<Btn sm onClick={()=>setSub(sub==="addDon"?"":"addDon")}>+ Donation</Btn>}>
            <Card style={{marginBottom:10,borderColor:CL.bl}}>
              <div style={{fontSize:10,color:CL.bl,fontWeight:700}}>FAIR MARKET VALUE RULE: All donations into the \u00A7508(c)(1)(A) are valued at FAIR MARKET VALUE (FMV) at the time of donation. Tax savings are automatically calculated based on the donor's tax bracket and recorded in the Tax Savings tab. Deductible up to 60% of AGI for cash donations per IRC \u00A7170.</div>
            </Card>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
              <Stat label="Total Donations" value={fK((D.pma.donations||[]).reduce((s,d)=>s+(parseFloat(d.amount)||0),0))} color={CL.bl}/>
              <Stat label="Certificates Issued" value={(D.pma.donations||[]).length.toString()}/>
            </div>
            {sub==="addDon"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Date" value={f.dd||""} onChange={v=>uf("dd",v)} type="date"/><Inp label="Donor" value={f.dn||""} onChange={v=>uf("dn",v)}/><Inp label="Amount" value={f.da||""} onChange={v=>uf("da",v)} type="number"/><Sel label="Bucket" value={f.db||""} onChange={v=>uf("db",v)} options={["Religious","Educational","Wellness","Charitable","Family Welfare","Operations"]}/><Inp label="Cert #" value={f.dc||""} onChange={v=>uf("dc",v)}/><Inp label="Donor Email" value={f.de||""} onChange={v=>uf("de",v)}/>
            </div><div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>{if(f.dn){const don={date:f.dd||today(),donor:f.dn,amount:f.da,bucket:f.db,certNo:f.dc||`D-${uid().toUpperCase()}`,donorEmail:f.de,type:"Cash",valuationType:"Fair Market Value"};addTo("pma.donations",don);
                const cert=genDonationCert(D.pma,don);const entry={id:uid(),name:`Donation_Cert_${don.certNo}_${don.donor}.txt`,type:"donation-cert",date:today(),content:cert};upd("documents.files",[...(D.documents.files||[]),entry]);
                // AUTO-POPULATE TAX SAVINGS: Donation at FMV × donor's tax bracket
                const donAmt=parseFloat(f.da)||0;if(donAmt>0){const bracket=agi>578125?37:agi>231250?35:agi>182100?32:agi>95375?24:agi>44725?22:agi>11000?12:10;const taxSaved=(donAmt*bracket/100);
                  addTo("taxSavings.donationSavings",{description:`Donation to ${D.pma.name||"Foundation"}: ${f.dn} (${don.bucket}) at Fair Market Value`,donationAmount:donAmt.toString(),taxBracket:bracket.toString(),taxSaved:taxSaved.toFixed(2),date:f.dd||today(),year:D.taxData?.year||"2025",autoGenerated:true});}
                rf();setSub("");
                if(don.donorEmail){try{const subject=encodeURIComponent(`Donation Certificate ${don.certNo} - ${D.pma.name||"Foundation"}`);const body=encodeURIComponent(cert);window.open(`mailto:${don.donorEmail}?subject=${subject}&body=${body.slice(0,1800)}`);}catch(e){console.log("Email client not available");}}
                const donAmt2=parseFloat(f.da)||0;const bracket2=agi>578125?37:agi>231250?35:agi>182100?32:agi>95375?24:agi>44725?22:agi>11000?12:10;
                showToast(`Donation recorded at FMV. Tax savings of ${fmt(donAmt2*bracket2/100)} (${bracket2}% bracket) auto-recorded!`);}}} >Record + Auto-Generate Certificate + Email</Btn>
            </div></Card>}
            {(D.pma.donations||[]).length>0&&<TH headers={["Date","Donor","Amount","Bucket","Cert #","Email"]} rows={(D.pma.donations||[]).map(d=>[d.date,d.donor,fmt(d.amount),d.bucket,d.certNo,d.donorEmail])} onDel={i=>rmFrom("pma.donations",i)}/>}
          </Sec>
          <Sec title="Foundation Income" actions={<Btn sm onClick={()=>setSub(sub==="addPMAInc"?"":"addPMAInc")}>+ Income</Btn>}>
            {sub==="addPMAInc"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr",gap:8}}>
              <Inp label="Date" value={f.piDate||""} onChange={v=>uf("piDate",v)} type="date"/><Inp label="Description" value={f.piDesc||""} onChange={v=>uf("piDesc",v)} placeholder="Ministry service income"/><Sel label="Category" value={f.piCat||""} onChange={v=>uf("piCat",v)} options={["Ministry Income","Event Revenue","Bookstore/Media","Program Fees","Interest/Investment","Other"]}/><Inp label="Amount" value={f.piAmt||""} onChange={v=>uf("piAmt",v)} type="number"/>
            </div><Btn onClick={()=>{if(f.piDesc){addTo("pma.income",{date:f.piDate||today(),description:f.piDesc,category:f.piCat,amount:f.piAmt});rf();setSub("");showToast("Foundation income recorded");}}} >Record</Btn></Card>}
            {(D.pma.income||[]).length>0&&<TH headers={["Date","Description","Category","Amount"]} rows={(D.pma.income||[]).map(i=>[i.date,i.description,i.category,fmt(i.amount)])} onDel={i=>rmFrom("pma.income",i)}/>}
          </Sec>
          <Sec title="Foundation Expenses" actions={<Btn sm onClick={()=>setSub(sub==="addPMAExp"?"":"addPMAExp")}>+ Expense</Btn>}>
            {sub==="addPMAExp"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr",gap:8}}>
              <Inp label="Date" value={f.peDate||""} onChange={v=>uf("peDate",v)} type="date"/><Inp label="Description" value={f.peDesc||""} onChange={v=>uf("peDesc",v)} placeholder="Ministry supplies"/><Sel label="Category" value={f.peCat||""} onChange={v=>uf("peCat",v)} options={["Ministry Supplies","Facility/Rent","Utilities","Travel/Mission","Education/Training","Insurance","Professional Fees","Office/Admin","Charitable Disbursement","Other"]}/><Inp label="Amount" value={f.peAmt||""} onChange={v=>uf("peAmt",v)} type="number"/>
            </div><Btn onClick={()=>{if(f.peDesc){addTo("pma.expenses",{date:f.peDate||today(),description:f.peDesc,category:f.peCat,amount:f.peAmt});rf();setSub("");showToast("Foundation expense recorded");}}} >Record</Btn></Card>}
            {(D.pma.expenses||[]).length>0&&<TH headers={["Date","Description","Category","Amount"]} rows={(D.pma.expenses||[]).map(e=>[e.date,e.description,e.category,fmt(e.amount)])} onDel={i=>rmFrom("pma.expenses",i)}/>}
          </Sec>
        </>}

        {/* INSURANCE */}
        {tab==="insurance"&&<Sec title="Insurance" tag="FAMILY BANK" actions={<Btn sm onClick={()=>setSub(sub==="addPol"?"":"addPol")}>+ Policy</Btn>}>
          {sub==="addPol"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr 1fr",gap:6}}>
            <Inp label="Company" value={f.pc||""} onChange={v=>uf("pc",v)}/><Inp label="Policy#" value={f.pn||""} onChange={v=>uf("pn",v)}/><Sel label="Type" value={f.pt||""} onChange={v=>uf("pt",v)} options={["Whole Life","Term","Universal","Variable","Property","Liability"]}/><Inp label="Insured" value={f.pi||""} onChange={v=>uf("pi",v)}/><Inp label="Face" value={f.pf||""} onChange={v=>uf("pf",v)} type="number"/><Inp label="Cash" value={f.pv||""} onChange={v=>uf("pv",v)} type="number"/><Inp label="Beneficiary" value={f.pb||""} onChange={v=>uf("pb",v)}/><Inp label="Premium Due" value={f.pd||""} onChange={v=>uf("pd",v)} type="date"/>
          </div><Btn onClick={()=>{if(f.pc){addTo("insurance.policies",{company:f.pc,policyNum:f.pn,type:f.pt,insured:f.pi,beneficiary:f.pb,faceValue:f.pf,cashValue:f.pv,premiumDue:f.pd});rf();setSub("");}}} >Add</Btn></Card>}
          {(D.insurance.policies||[]).length>0&&<TH headers={["Company","#","Type","Insured","Face","Cash","Due"]} rows={(D.insurance.policies||[]).map(p=>[p.company,p.policyNum,p.type,p.insured,fmt(p.faceValue),fmt(p.cashValue),p.premiumDue])} onDel={i=>rmFrom("insurance.policies",i)}/>}
        </Sec>}

        {/* ANNUITIES */}
        {tab==="annuity"&&<Sec title="Annuities" tag="PRIVATE PENSION" actions={<Btn sm onClick={()=>setSub(sub==="addAnn"?"":"addAnn")}>+ Annuity</Btn>}>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
            <Stat label="Total Annuity Value" value={fK(annuityVal)} color={CL.am}/>
            <Stat label="Contracts" value={(D.annuities.contracts||[]).length.toString()}/>
          </div>
          {sub==="addAnn"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr 1fr",gap:6}}>
            <Inp label="Company" value={f.ac||""} onChange={v=>uf("ac",v)}/><Inp label="Contract#" value={f.an||""} onChange={v=>uf("an",v)}/><Sel label="Type" value={f.at||""} onChange={v=>uf("at",v)} options={["Fixed","Variable","Indexed","Immediate","Deferred"]}/><Inp label="Account Value" value={f.av||""} onChange={v=>uf("av",v)} type="number"/><Inp label="Guaranteed Rate" value={f.ar||""} onChange={v=>uf("ar",v)} placeholder="4.5%"/><Inp label="Surrender Date" value={f.as||""} onChange={v=>uf("as",v)} type="date"/><Inp label="Annuitant" value={f.ao||""} onChange={v=>uf("ao",v)}/><Inp label="Beneficiary" value={f.ab||""} onChange={v=>uf("ab",v)}/><Inp label="Next Payment" value={f.ap||""} onChange={v=>uf("ap",v)} type="date"/>
          </div><Btn onClick={()=>{if(f.ac){addTo("annuities.contracts",{company:f.ac,contractNum:f.an,type:f.at,annuitant:f.ao,beneficiary:f.ab,accountValue:f.av,rate:f.ar,surrenderDate:f.as,nextPayment:f.ap});rf();setSub("");}}} >Add</Btn></Card>}
          {(D.annuities.contracts||[]).length>0&&<TH headers={["Company","#","Type","Value","Rate","Surrender","Next Pmt"]} rows={(D.annuities.contracts||[]).map(a=>[a.company,a.contractNum,a.type,fmt(a.accountValue),a.rate,a.surrenderDate,a.nextPayment])} onDel={i=>rmFrom("annuities.contracts",i)}/>}
        </Sec>}

        {/* BANKING */}
        {tab==="banking"&&<Sec title="Banking" tag="ALL ENTITIES" actions={<Btn sm onClick={()=>setSub(sub==="addAcct"?"":"addAcct")}>+ Account</Btn>}>
          {sub==="addAcct"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
            <Inp label="Bank" value={f.bb||""} onChange={v=>uf("bb",v)}/><Sel label="Type" value={f.bt||""} onChange={v=>uf("bt",v)} options={["Checking","Savings","Money Market","Brokerage"]}/><Sel label="Entity" value={f.be||""} onChange={v=>uf("be",v)} options={["Personal","Family Trust","Foundation","LLC"]}/><Inp label="Last 4" value={f.b4||""} onChange={v=>uf("b4",v)}/>
          </div><Btn onClick={()=>{if(f.bb){addTo("banking.accounts",{bank:f.bb,type:f.bt,entity:f.be,last4:f.b4});rf();setSub("");}}} >Add</Btn></Card>}
          {(D.banking.accounts||[]).length>0&&<TH headers={["Bank","Type","Entity","Last 4"]} rows={(D.banking.accounts||[]).map(a=>[a.bank,a.type,a.entity,`****${a.last4}`])} onDel={i=>rmFrom("banking.accounts",i)}/>}
        </Sec>}

        {/* DOCUMENTS */}
        {tab==="docs"&&<Sec title="Document Vault" tag="VIEW \u2022 EDIT \u2022 PRINT" actions={<><Btn sm onClick={()=>setSub(sub==="addDoc"?"":"addDoc")}>+ Document</Btn><Btn sm v="blue" onClick={()=>{
          const coaContent=`CHART OF ACCOUNTS \u2014 \u00A7508(c)(1)(A) FOUNDATION\n${"━".repeat(50)}\n\nDONATIONS & TITHES:\nF-400  General Tithes & Offerings\nF-405  Designated \u2014 Religious\nF-410  Designated \u2014 Educational\nF-415  Designated \u2014 Wellness\nF-420  Designated \u2014 Charitable\nF-425  Designated \u2014 Family Welfare\nF-430  Designated \u2014 Operations\n\nOTHER INCOME:\nF-435  Ministry Program Income\nF-440  Event Revenue\nF-445  Bookstore & Media Sales\nF-450  Interest Income\nF-455  Investment Income\nF-460  Rental Income\nF-465  Royalty Income\nF-470  Grant Income\n\nASSETS:\nF-100  Cash & Bank Accounts\nF-105  Petty Cash\nF-110  Accounts Receivable\nF-120  Savings Accounts\nF-125  Ministry Property\nF-130  Furniture & Fixtures\nF-135  Equipment\nF-140  Vehicles\nF-150  Investments\nF-160  Intellectual Property\n\nLIABILITIES:\nF-200  Accounts Payable\nF-201  Credit Card Payable\nF-210  Notes Payable\nF-220  Taxes Payable (UBIT only)\n\nEXPENSES \u2014 MINISTRY OPERATIONS:\nF-500  Interest Expense\nF-505  Ministry Supplies\nF-510  Facility Expenses\nF-515  Utilities\nF-520  Insurance \u2014 Property\nF-525  Insurance \u2014 Liability\nF-530  Telephone & Communications\n\nEXPENSES \u2014 PROFESSIONAL:\nF-535  Legal Services\nF-540  Accounting & Tax Prep\nF-545  Professional Services\nF-550  Consulting Fees\n\nEXPENSES \u2014 MINISTRY PROGRAMS:\nF-555  Charitable Disbursements\nF-560  Benevolence & Aid\nF-565  Mission Work\nF-570  Education & Training\nF-575  Media & Publications\nF-580  Conference & Events\n\nEXPENSES \u2014 ADMINISTRATIVE:\nF-585  Office Expenses\nF-590  Postage & Shipping\nF-595  Bank Fees\nF-600  Contract Labor\nF-605  Vehicle Expenses\nF-610  Repairs & Maintenance\nF-615  Travel \u2014 Ministry\nF-620  Meals \u2014 Ministry Workers\nF-625  Advertising\nF-630  Dues & Subscriptions\nF-635  Uniforms (Ministry Logo)\nF-640  Taxes \u2014 Non-Property\nF-645  Fees, Permits & Licenses\n\nTRUST COA CROSS-REFERENCE:\n#405 Interest = F-450 | #410 Dividends = F-455\n#430 Rental = F-460 | #500 Interest Exp = F-500\n#515 Contributions = F-555 | #520 Accounting = F-540\n#530 Legal = F-535 | #605 Vehicle = F-605\n#650 Insurance = F-520 | #685 Repairs = F-610`;
          const exists=(D.documents.files||[]).some(ff=>ff.name==="Foundation_COA_Reference.txt");
          if(!exists){addTo("documents.files",{name:"Foundation_COA_Reference.txt",category:"PMA Document",date:today(),content:coaContent,uploaded:ts()});showToast("Foundation COA added!");}else showToast("Already in vault.");
        }}>Add Foundation COA</Btn></>}>
          {sub==="addDoc"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8}}>
            <Inp label="Document Name" value={f.docN||""} onChange={v=>uf("docN",v)} placeholder="Bill of Sale - Tesla"/><Sel label="Category" value={f.docC||""} onChange={v=>uf("docC",v)} options={["Trust Indenture","Bill of Sale","Demand Note","Minutes","Resolution","Insurance","Tax Return","Lease/MSA","Beneficiary","Donation Cert","Member Cert","Annual Report","PMA Document","Articles/Bylaws","Correspondence","Other"]}/><Inp label="Date" value={f.docD||""} onChange={v=>uf("docD",v)} type="date"/>
          </div><TextArea label="Notes / Content" value={f.docContent||""} onChange={v=>uf("docContent",v)} rows={3}/>
          <Btn onClick={()=>{if(f.docN){addTo("documents.files",{name:f.docN,category:f.docC,date:f.docD||today(),content:f.docContent,uploaded:ts()});rf();setSub("");showToast("Document filed");}}} >File Document</Btn></Card>}
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {["All","Minutes","Donation Cert","Member Cert","Annual Report","Bill of Sale","Demand Note","Beneficiary","Resolution","PMA Document","Other"].map(cat=>(
              <Btn key={cat} sm v={f.docFilter===cat?"blue":"ghost"} onClick={()=>uf("docFilter",cat===f.docFilter?"":cat)}>{cat}</Btn>
            ))}
          </div>
          <div style={{fontSize:10,color:CL.dm,marginBottom:8}}>Click any document name to View, Edit, Print, or Download.</div>
          {(()=>{const filtered=(D.documents.files||[]).filter(d=>!f.docFilter||f.docFilter==="All"||d.category===f.docFilter||(d.type||"")===((f.docFilter||"").toLowerCase().replace(/ /g,"-")));
            return filtered.length>0&&<div style={{overflowX:"auto",borderRadius:6,border:`1px solid ${CL.bd}`,maxHeight:400,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead style={{position:"sticky",top:0}}><tr>{["Document","Category","Date","Actions"].map((h,hi)=><th key={hi} style={{padding:"7px 10px",textAlign:"left",background:CL.c2,color:CL.mt,fontWeight:600,fontSize:9,textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${CL.bd}`}}>{h}</th>)}</tr></thead>
              <tbody>{filtered.map((d,i)=><tr key={d.id||i} style={{borderBottom:`1px solid ${CL.bd}`}}>
                <td style={{padding:"7px 10px",color:CL.go,cursor:"pointer",fontWeight:600}} onClick={()=>setViewDoc(d)}>{d.name}</td>
                <td style={{padding:"7px 10px",color:CL.tx}}>{d.category||d.type}</td>
                <td style={{padding:"7px 10px",color:CL.tx}}>{d.date}</td>
                <td style={{padding:"7px 10px"}}><div style={{display:"flex",gap:6}}>
                  <span onClick={()=>setViewDoc(d)} style={{cursor:"pointer",color:CL.bl,fontSize:10,fontWeight:600}}>View</span>
                  <span onClick={()=>{const idx=(D.documents.files||[]).findIndex(ff=>ff.id===d.id);if(idx>=0&&confirm(`Delete "${d.name}"?`))rmFrom("documents.files",idx);}} style={{cursor:"pointer",color:CL.rd,fontSize:10,fontWeight:600}}>Del</span>
                </div></td>
              </tr>)}</tbody>
            </table></div>;
          })()}
        </Sec>}

        {/* 1041 */}
        {tab==="tax"&&<Sec title="Form 1041 \u2014 Common Law Trust" tag={D.taxData.year}>{(()=>{const t=gen1041(D);
          const totalDraws2=(D.trust.draws||[]).filter(d=>!d.autoGenerated).reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
          const depletedNotes=(D.trust.demandNotes||[]).filter(n=>{const dr=(D.trust.draws||[]).filter(d=>d.noteId===n.id).reduce((s,d)=>s+(parseFloat(d.amount)||0),0);return dr>=(parseFloat(n.amount)||0);});
          const excessDraws=depletedNotes.length>0?(D.trust.draws||[]).filter(d=>{const note=(D.trust.demandNotes||[]).find(n=>n.id===d.noteId);if(!note)return false;const allDraws=(D.trust.draws||[]).filter(dd=>dd.noteId===d.noteId);const idx=allDraws.indexOf(d);const priorSum=allDraws.slice(0,idx).reduce((s,dd)=>s+(parseFloat(dd.amount)||0),0);return priorSum>=(parseFloat(note.amount)||0);}).reduce((s,d)=>s+(parseFloat(d.amount)||0),0):0;
          const stateRate={"Alabama":5,"Alaska":0,"Arizona":2.5,"Arkansas":4.4,"California":13.3,"Colorado":4.4,"Connecticut":6.99,"Delaware":6.6,"Florida":0,"Georgia":5.49,"Hawaii":11,"Idaho":5.8,"Illinois":4.95,"Indiana":3.05,"Iowa":5.7,"Kansas":5.7,"Kentucky":4,"Louisiana":4.25,"Maine":7.15,"Maryland":5.75,"Massachusetts":5,"Michigan":4.25,"Minnesota":9.85,"Mississippi":5,"Missouri":4.95,"Montana":6.75,"Nebraska":6.64,"Nevada":0,"New Hampshire":0,"New Jersey":10.75,"New Mexico":5.9,"New York":10.9,"North Carolina":4.5,"North Dakota":2.5,"Ohio":3.5,"Oklahoma":4.75,"Oregon":9.9,"Pennsylvania":3.07,"Rhode Island":5.99,"South Carolina":6.5,"South Dakota":0,"Tennessee":0,"Texas":0,"Utah":4.65,"Vermont":8.75,"Virginia":5.75,"Washington":0,"West Virginia":6.5,"Wisconsin":7.65,"Wyoming":0};
          const clientState=D.clientProfile?.stateOfResidence||D.trust?.situs||"";
          const stRate=stateRate[clientState]||0;
          return <>
          <Card style={{marginBottom:12,borderColor:CL.go}}>
            <div style={{fontSize:11,color:CL.go,lineHeight:1.6}}>
              <span style={{fontWeight:700}}>COMMON LAW (CONTRACT) TRUST \u2014 1041 FILING NOTES:</span> This trust operates under common law, not statutory trust law. It is NOT taxed at the compressed statutory trust brackets (37% at $14,450). The Demand Note mechanism offsets distributions \u2014 draws against an active note are loan repayments, NOT taxable distributions. Only draws that exceed the total Demand Note capacity result in taxable K-1 distributions to the Trustee/Beneficiary. Capital gains on assets sold from the trust are allocated to corpus and excluded from Distributable Net Income (DNI) per \u00A7643(a)(3).
            </div>
          </Card>
          <Card style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:10}}>TRUST INCOME</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
              <div>Interest (#405)</div><div style={{textAlign:"right"}}>{fmt(t.interest)}</div>
              <div>Dividends (#410)</div><div style={{textAlign:"right"}}>{fmt(t.dividends)}</div>
              <div>Capital Gains (#420/#425)</div><div style={{textAlign:"right"}}>{fmt(t.capGains)}</div>
              <div>Rents/Leases/Royalties</div><div style={{textAlign:"right"}}>{fmt(t.rental+t.lease+t.royalty)}</div>
              <div>K-1 Income (#455)</div><div style={{textAlign:"right"}}>{fmt(t.k1)}</div>
              <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>TOTAL INCOME</div><div style={{textAlign:"right",fontWeight:700,color:CL.gr,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>{fmt(t.totalInc)}</div>
            </div></Card>
          <Card style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:700,color:CL.am,marginBottom:10}}>DEDUCTIONS</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
              <div>Fiduciary Fees (#510)</div><div style={{textAlign:"right"}}>{fmt(t.trustFees)}</div>
              <div>Legal/Accounting (#520/#530)</div><div style={{textAlign:"right"}}>{fmt(t.legal)}</div>
              <div>Property Taxes (#505)</div><div style={{textAlign:"right"}}>{fmt(t.propTax)}</div>
              <div>Charitable Contributions (#515)</div><div style={{textAlign:"right"}}>{fmt(t.charitable)}</div>
              <div>Other Deductions</div><div style={{textAlign:"right"}}>{fmt(t.otherExp)}</div>
              <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>TOTAL DEDUCTIONS</div><div style={{textAlign:"right",fontWeight:700,color:CL.am,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>{fmt(t.totalDed)}</div>
            </div></Card>
          <Card style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:700,color:CL.cy,marginBottom:10}}>DEMAND NOTE OFFSET \u2014 NON-TAXABLE DISTRIBUTIONS</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
              <div>Total Demand Notes Issued</div><div style={{textAlign:"right"}}>{fmt(totalNotes)}</div>
              <div>Personal Draws (loan repayments)</div><div style={{textAlign:"right",color:CL.gr}}>({fmt(totalDraws2)})</div>
              <div>Asset Sales (basis reductions)</div><div style={{textAlign:"right",color:CL.am}}>({fmt(totalDraws-totalDraws2)})</div>
              <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>REMAINING NOTE CAPACITY</div><div style={{textAlign:"right",fontWeight:700,color:remNotes>0?CL.gr:CL.rd,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>{fmt(remNotes)}</div>
              {excessDraws>0&&<><div style={{color:CL.rd,fontWeight:700}}>EXCESS DRAWS (Taxable K-1)</div><div style={{textAlign:"right",color:CL.rd,fontWeight:700}}>{fmt(excessDraws)}</div></>}
            </div>
            <div style={{fontSize:10,color:CL.dm,marginTop:8}}>Draws within note capacity = loan repayments (NOT taxable). Draws exceeding note capacity = K-1 taxable distributions.</div>
          </Card>
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:16,fontWeight:700,color:CL.go}}>DISTRIBUTABLE NET INCOME (DNI): {fmt(Math.max(0,t.taxable-t.capGains))}</div>
            <div style={{fontSize:11,color:CL.dm,marginTop:4}}>DNI = Taxable Income ({fmt(t.taxable)}) minus Capital Gains ({fmt(t.capGains)}) allocated to corpus per \u00A7643(a)(3)</div>
            {excessDraws>0&&<div style={{fontSize:11,color:CL.rd,marginTop:4,fontWeight:700}}>K-1 TAXABLE DISTRIBUTIONS: {fmt(excessDraws)} \u2014 Draws exceeding Demand Note capacity</div>}
            {excessDraws===0&&<div style={{fontSize:11,color:CL.gr,marginTop:4}}>No taxable K-1 distributions \u2014 all draws within Demand Note capacity</div>}
          </Card>
          {stRate>0&&<Card style={{marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:CL.pu,marginBottom:6}}>STATE TAX ESTIMATE \u2014 {clientState}</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
              <div>State Tax Rate</div><div style={{textAlign:"right"}}>{stRate}%</div>
              <div>Estimated State Tax on DNI</div><div style={{textAlign:"right",color:CL.pu}}>{fmt(Math.max(0,t.taxable-t.capGains)*stRate/100)}</div>
            </div>
            <div style={{fontSize:10,color:CL.am,marginTop:6,fontWeight:600}}>This is an estimate only. Consult with a licensed tax professional for accurate state tax filing.</div>
          </Card>}
          {stRate===0&&clientState&&<Card style={{marginBottom:12}}>
            <div style={{fontSize:12,color:CL.gr}}>{clientState} has no state income tax.</div>
          </Card>}
          <div style={{display:"flex",gap:8}}>
            <Btn v="blue" onClick={()=>{const doc1041={id:uid(),name:`Form_1041_Draft_${D.taxData?.year||"2025"}_${today()}.txt`,category:"Tax Return",type:"trust-doc",entity:"Trust",date:today(),uploaded:ts(),
              content:`FORM 1041 DRAFT \u2014 ${D.trust.name||"[Trust]"}\nTax Year: ${D.taxData?.year||"2025"}\nEIN: ${D.trust.ein||"[EIN]"}\nType: Common Law (Contract) Trust\n${"━".repeat(50)}\n\nINCOME:\nInterest: ${fmt(t.interest)}\nDividends: ${fmt(t.dividends)}\nCapital Gains: ${fmt(t.capGains)}\nRental/Lease/Royalty: ${fmt(t.rental+t.lease+t.royalty)}\nK-1 Income: ${fmt(t.k1)}\nTOTAL INCOME: ${fmt(t.totalInc)}\n\nDEDUCTIONS:\nFiduciary Fees: ${fmt(t.trustFees)}\nLegal/Accounting: ${fmt(t.legal)}\nProperty Taxes: ${fmt(t.propTax)}\nCharitable: ${fmt(t.charitable)}\nOther: ${fmt(t.otherExp)}\nTOTAL DEDUCTIONS: ${fmt(t.totalDed)}\n\nTAXABLE INCOME: ${fmt(t.taxable)}\nCapital Gains to Corpus: ${fmt(t.capGains)} (excluded from DNI per \u00A7643(a)(3))\nDNI: ${fmt(Math.max(0,t.taxable-t.capGains))}\n\nDEMAND NOTE STATUS:\nTotal Notes: ${fmt(totalNotes)}\nTotal Draws: ${fmt(totalDraws)}\nRemaining: ${fmt(remNotes)}\nExcess (Taxable K-1): ${fmt(excessDraws)}\n${clientState&&stRate?`\nSTATE TAX (${clientState}): ${stRate}% = ${fmt(Math.max(0,t.taxable-t.capGains)*stRate/100)}`:""}\n\n${"━".repeat(50)}\nConsult with a licensed tax professional before filing.\nThis document can be printed from the Document Vault.`};
              upd("documents.files",[...(D.documents.files||[]),doc1041]);setViewDoc(doc1041);showToast("1041 draft generated, filed, and ready to print!");}}>Generate Printable 1041 Draft</Btn>
          </div>
        </>;})()}</Sec>}

        {/* P&L */}
        {tab==="pl"&&<Sec title="P&L Reports" tag="AUTO">{["Trust","Foundation","LLC"].map(ent=>{
          const key=ent==="Trust"?"trust":ent==="Foundation"?"pma":"llc";
          const inc=key==="trust"?totalTrustInc:key==="pma"?totalDon+(D.pma.income||[]).reduce((s,i)=>s+(parseFloat(i.amount)||0),0):llcRev;
          const exp=key==="trust"?totalTrustExp:key==="pma"?(D.pma.expenses||[]).reduce((s,e)=>s+(parseFloat(e.amount)||0),0):llcExp;
          const net=inc-exp;
          return <Card key={ent} style={{marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:8}}>{ent} P&L</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
              <div>Income</div><div style={{textAlign:"right",color:CL.gr}}>{fmt(inc)}</div>
              <div>Expenses</div><div style={{textAlign:"right",color:CL.rd}}>({fmt(exp)})</div>
              <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>NET</div><div style={{textAlign:"right",fontWeight:700,color:net>=0?CL.gr:CL.rd,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6,fontSize:16}}>{fmt(net)}</div>
            </div></Card>;
        })}</Sec>}

        {/* CALENDAR */}
        {tab==="calendar"&&<Sec title="Calendar & Deadlines" actions={<Btn sm onClick={()=>setSub(sub==="addCal"?"":"addCal")}>+ Event</Btn>}>
          {sub==="addCal"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr",gap:8}}>
            <Inp label="Date" value={f.calD||""} onChange={v=>uf("calD",v)} type="date"/><Inp label="Description" value={f.calN||""} onChange={v=>uf("calN",v)} placeholder="Quarterly Trust Meeting"/><Sel label="Entity" value={f.calE||""} onChange={v=>uf("calE",v)} options={["Trust","Foundation","LLC","Insurance","Tax","Personal"]}/>
          </div><Btn onClick={()=>{if(f.calN){addTo("calendar",{date:f.calD,description:f.calN,entity:f.calE});rf();setSub("");}}} >Add</Btn></Card>}
          {/* Auto-populated deadlines */}
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:CL.go,marginBottom:8}}>STANDING DEADLINES</div>
            <div style={{fontSize:11,color:CL.tx}}>{["Jan 31 \u2014 Donor acknowledgment letters due","Apr 15 \u2014 Form 1041 due","Monthly \u2014 Bank reconciliation","Quarterly \u2014 Trust Board meeting","Annually \u2014 PMA Annual Meeting + Audit","Annually \u2014 Board salary review"].map(d=><div key={d} style={{padding:"4px 0",borderBottom:`1px solid ${CL.bd}`}}>{d}</div>)}</div>
          </Card>
          {(D.calendar||[]).length>0&&<TH headers={["Date","Description","Entity"]} rows={(D.calendar||[]).sort((a,b)=>new Date(a.date)-new Date(b.date)).map(c=>[c.date,c.description,c.entity])} onDel={i=>rmFrom("calendar",i)}/>}
        </Sec>}

        {/* CONTACTS */}
        {tab==="contacts"&&<Sec title="Professional Contacts" actions={<Btn sm onClick={()=>setSub(sub==="addContact"?"":"addContact")}>+ Contact</Btn>}>
          {sub==="addContact"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8}}>
            <Inp label="Name" value={f.cN||""} onChange={v=>uf("cN",v)}/><Sel label="Role" value={f.cR||""} onChange={v=>uf("cR",v)} options={["Attorney","CPA/Accountant","Insurance Agent","Banker","Financial Advisor","Trust Company","Bookkeeper","Other"]}/><Inp label="Phone" value={f.cP||""} onChange={v=>uf("cP",v)}/><Inp label="Email" value={f.cE||""} onChange={v=>uf("cE",v)}/><Inp label="Company" value={f.cC||""} onChange={v=>uf("cC",v)}/>
          </div><Btn onClick={()=>{if(f.cN){addTo("contacts",{name:f.cN,role:f.cR,phone:f.cP,email:f.cE,company:f.cC});rf();setSub("");}}} >Add</Btn></Card>}
          {(D.contacts||[]).length>0&&<TH headers={["Name","Role","Phone","Email","Company"]} rows={(D.contacts||[]).map(c=>[c.name,c.role,c.phone,c.email,c.company])} onDel={i=>rmFrom("contacts",i)}/>}
        </Sec>}

        {/* SUCCESSION */}
        {tab==="succession"&&<>
          <Sec title="Succession Plan" tag="TRIGGER EVENT PROTOCOL">
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:10}}>WHAT HAPPENS AT A TRIGGER EVENT</div>
              <div style={{fontSize:12,color:CL.tx,lineHeight:1.8}}>
                <div>1. The Initial Trustee dies, resigns, or becomes incapacitated</div>
                <div>2. The Trust transitions to co-trustee structure (Section 7.3)</div>
                <div>3. At least 2 Trustees required: Family Trustee + Independent Trustee (Section 7.4)</div>
                <div>4. All Significant Decisions require unanimous written consent including Independent Trustee</div>
                <div>5. The Trust continues operating seamlessly for Beneficiaries</div>
              </div>
            </Card>
            <TextArea label="Custom Succession Notes / Instructions" value={D.succession.plan} onChange={v=>upd("succession.plan",v)} rows={6} />
            <Card style={{marginTop:16}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.rd,marginBottom:10}}>EMERGENCY ACCESS PROTOCOL</div>
              <TextArea label="Who gets access to what, and in what order, if the Trustee is suddenly incapacitated" value={D.succession.accessProtocol} onChange={v=>upd("succession.accessProtocol",v)} rows={4} />
            </Card>
            <Card style={{marginTop:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:700,color:CL.go}}>EMERGENCY CONTACTS</div>
                <Btn sm onClick={()=>setSub(sub==="addEmerg"?"":"addEmerg")}>+ Contact</Btn>
              </div>
              {sub==="addEmerg"&&<div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,marginBottom:8}}>
                <Inp label="Name" value={f.emN||""} onChange={v=>uf("emN",v)}/><Inp label="Relationship" value={f.emR||""} onChange={v=>uf("emR",v)}/><Inp label="Phone" value={f.emP||""} onChange={v=>uf("emP",v)}/><div style={{display:"flex",alignItems:"end"}}><Btn sm onClick={()=>{if(f.emN){const c=[...(D.succession.emergencyContacts||[]),{name:f.emN,relationship:f.emR,phone:f.emP,id:uid()}];upd("succession.emergencyContacts",c);rf();setSub("");}}} >Add</Btn></div>
              </div>}
              {(D.succession.emergencyContacts||[]).length>0&&<TH headers={["Name","Relationship","Phone"]} rows={(D.succession.emergencyContacts||[]).map(c=>[c.name,c.relationship,c.phone])}/>}
            </Card>
          </Sec>
        </>}

        {/* AI ADVISOR */}
        {tab==="ai"&&<Sec title="AI Strategic Advisor" tag="CLAUDE-POWERED">
          <Card style={{height:460,display:"flex",flexDirection:"column"}}>
            <div ref={aiRef} style={{flex:1,overflowY:"auto",padding:"8px 0",marginBottom:10}}>
              {!(D.aiHistory||[]).length&&<div style={{textAlign:"center",color:CL.dm,padding:30}}>
                <div style={{fontSize:28,marginBottom:8}}>\u2605</div>
                <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Ask anything about your estate</div>
                <div style={{fontSize:11,color:CL.mt}}>Try: "How do I maximize my Demand Note?" or "What's the tax impact of selling my rental property?"</div>
              </div>}
              {(D.aiHistory||[]).map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:8}}>
                <div style={{maxWidth:"80%",padding:"8px 12px",borderRadius:10,fontSize:12,lineHeight:1.6,background:m.role==="user"?CL.go:CL.c2,color:m.role==="user"?CL.bg:CL.tx,whiteSpace:"pre-wrap"}}>{m.content}</div>
              </div>))}
              {aiLoad&&<div style={{padding:"8px 12px",borderRadius:10,background:CL.c2,color:CL.dm,fontSize:12,display:"inline-block"}}>Analyzing...</div>}
            </div>
            <div style={{display:"flex",gap:6}}>
              <input value={aiMsg} onChange={e=>setAiMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();askAI();}}} placeholder="Ask a strategic question..." style={{flex:1,padding:"8px 12px",background:CL.bg,border:`1px solid ${CL.bd}`,borderRadius:6,color:CL.tx,fontSize:12,outline:"none"}}/>
              <Btn v="blue" onClick={askAI}>Send</Btn>
            </div>
          </Card>
        </Sec>}

        {/* AUDIT LOG */}
        {tab==="log"&&<Sec title="Audit Log" tag="COMPLIANCE TRAIL">
          <div style={{fontSize:11,color:CL.dm,marginBottom:12}}>Every action is timestamped. This is your legal defense trail. Last 500 entries retained.</div>
          {(D.auditLog||[]).length>0&&<TH headers={["Timestamp","Action","Detail"]} rows={(D.auditLog||[]).slice(0,100).map(l=>[l.timestamp,l.action,l.detail])}/>}
          {!(D.auditLog||[]).length&&<Card style={{textAlign:"center",color:CL.dm}}>No activity recorded yet.</Card>}
        </Sec>}

        {/* ALERTS */}
        {tab==="alerts"&&<Sec title="All Alerts">{alerts.map((a,i)=>(<div key={i} style={{background:a.t==="critical"?CL.rdB:a.t==="warning"?CL.amB:a.t==="success"?CL.grB:CL.blB,border:`1px solid ${CL.bd}`,borderRadius:6,padding:"10px 14px",marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Badge t={a.t}/><span style={{fontSize:10,color:CL.mt,fontWeight:600}}>{a.e}</span></div>
          <div style={{fontSize:12,marginTop:3}}>{a.m}</div>
        </div>))}</Sec>}

        {/* CLIENT PROFILE */}
        {tab==="profile"&&<>
          <Sec title="Client Profile" tag="FINANCIAL DNA">
            <Card style={{marginBottom:16,borderColor:CL.go}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:8}}>CLIENT TYPE</div>
              <div style={{fontSize:11,color:CL.dm,marginBottom:10}}>Select what this client needs. The Command Center, Doc Builder, and navigation will adapt automatically.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[{v:"trust",l:"Trust Only",d:"Private Irrevocable Trust with no Foundation/PMA",c:CL.go},{v:"pma",l:"\u00A7508(c)(1)(A) Only",d:"Foundation/PMA with no Trust",c:CL.bl},{v:"both",l:"Trust + Foundation",d:"Both entities with mandatory Trust-PMA Agreement",c:CL.gr}].map(opt=>
                  <div key={opt.v} onClick={()=>upd("clientProfile.clientType",opt.v)} style={{background:(D.clientProfile?.clientType||"both")===opt.v?`${opt.c}15`:"transparent",border:`2px solid ${(D.clientProfile?.clientType||"both")===opt.v?opt.c:CL.bd}`,borderRadius:10,padding:14,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                    <div style={{fontSize:13,fontWeight:700,color:(D.clientProfile?.clientType||"both")===opt.v?opt.c:CL.dm}}>{opt.l}</div>
                    <div style={{fontSize:10,color:CL.dm,marginTop:4}}>{opt.d}</div>
                  </div>
                )}
              </div>
              {(D.clientProfile?.clientType||"both")==="both"&&<div style={{background:CL.amB,borderRadius:6,padding:8,marginTop:10,fontSize:11,color:CL.am,fontWeight:600}}>
                \u26A0 MANDATORY: When both Trust and Foundation are active, the Trust-PMA Agreement must be executed during initial setup. Generate it in the Doc Builder tab.
              </div>}
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:12}}>PERSONAL INFORMATION</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
                <Inp label="Date of Birth" value={D.clientProfile.dob} onChange={v=>upd("clientProfile.dob",v)} type="date"/>
                <Sel label="Marital Status" value={D.clientProfile.maritalStatus} onChange={v=>upd("clientProfile.maritalStatus",v)} options={["Single","Married","Divorced","Widowed","Separated"]}/>
                <Inp label="Occupation" value={D.clientProfile.occupation} onChange={v=>upd("clientProfile.occupation",v)}/>
                <Inp label="Employer" value={D.clientProfile.employer} onChange={v=>upd("clientProfile.employer",v)}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
                <Inp label="State of Residence" value={D.clientProfile.stateOfResidence} onChange={v=>upd("clientProfile.stateOfResidence",v)}/>
                <Sel label="Health Status" value={D.clientProfile.healthStatus} onChange={v=>upd("clientProfile.healthStatus",v)} options={["Excellent","Good","Fair","Poor"]}/>
                <Inp label="Current Annual Income" value={D.clientProfile.currentAnnualIncome} onChange={v=>upd("clientProfile.currentAnnualIncome",v)} type="number"/>
                <Inp label="Annual Income Goal" value={D.clientProfile.annualIncomeGoal} onChange={v=>upd("clientProfile.annualIncomeGoal",v)} type="number"/>
              </div>
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:12}}>INVESTMENT PROFILE</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
                <Sel label="Risk Tolerance" value={D.clientProfile.riskTolerance} onChange={v=>upd("clientProfile.riskTolerance",v)} options={["Conservative","Moderate","Aggressive","Very Aggressive"]}/>
                <Sel label="Time Horizon" value={D.clientProfile.timeHorizon} onChange={v=>upd("clientProfile.timeHorizon",v)} options={["1-3 years","3-5 years","5-10 years","10+ years"]}/>
                <Inp label="Target Retirement Age" value={D.clientProfile.retirementAge} onChange={v=>upd("clientProfile.retirementAge",v)} type="number"/>
                <Sel label="Investment Experience" value={D.clientProfile.investmentExperience} onChange={v=>upd("clientProfile.investmentExperience",v)} options={["Beginner","Intermediate","Advanced","Expert"]}/>
              </div>
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:CL.go}}>FINANCIAL PERSPECTIVE (10 QUESTIONS)</div>
                {D.financialProfile?.lastUpdated?<div style={{fontSize:9,color:ds(D.financialProfile.lastUpdated)>365?CL.rd:CL.gr,fontWeight:700}}>{ds(D.financialProfile.lastUpdated)>365?"\u26A0 ANNUAL UPDATE OVERDUE":"Updated: "+D.financialProfile.lastUpdated}</div>:null}
              </div>
              <div style={{fontSize:10,color:CL.dm,marginBottom:12}}>These questions teach the AI your financial personality, patterns, and instincts. Your answers shape every recommendation. Required at setup. Update annually.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Sel label="1. When you receive unexpected money (bonus, refund, gift), your first instinct is to..." value={D.financialProfile?.windfall||""} onChange={v=>upd("financialProfile.windfall",v)} options={["Save it immediately","Pay off debt","Invest it","Spend on something I've wanted","Split between saving and spending","I don't usually get unexpected money"]}/>
                <Sel label="2. When the stock market drops 20%, how do you feel?" value={D.financialProfile?.marketDrop||""} onChange={v=>upd("financialProfile.marketDrop",v)} options={["Panicked \u2014 I want to sell everything","Nervous but I hold","Neutral \u2014 markets recover","Excited \u2014 I want to buy more","I don't follow the market","I prefer guaranteed returns"]}/>
                <Sel label="3. Would you rather have..." value={D.financialProfile?.riskChoice||""} onChange={v=>upd("financialProfile.riskChoice",v)} options={["Guaranteed 4% growth every year, no exceptions","A chance at 12% but could lose 10% some years","50/50 split of both strategies","I want my money protected first, growth second","Maximum growth, I can handle the losses"]}/>
                <Sel label="4. How involved do you want to be in your investments?" value={D.financialProfile?.involvement||""} onChange={v=>upd("financialProfile.involvement",v)} options={["Completely hands-off \u2014 manage it for me","Review quarterly, advisor makes decisions","I want to understand and co-decide","Very hands-on \u2014 I make all decisions","I want a system that runs itself"]}/>
                <Sel label="5. What keeps you up at night financially?" value={D.financialProfile?.fearFactor||""} onChange={v=>upd("financialProfile.fearFactor",v)} options={["Losing what I've built","Not growing wealth fast enough","Tax burden eating my income","Not having enough for retirement","Leaving nothing for my family","Medical or legal emergency wiping me out","Nothing \u2014 I feel secure"]}/>
                <Sel label="6. How do you make large financial decisions?" value={D.financialProfile?.decisionStyle||""} onChange={v=>upd("financialProfile.decisionStyle",v)} options={["Research heavily, then decide alone","Discuss with spouse/partner first","Rely on my advisor completely","Go with my gut instinct","I avoid large financial decisions","I need someone to walk me through it"]}/>
                <Sel label="7. What does financial freedom mean to you?" value={D.financialProfile?.freedomDef||""} onChange={v=>upd("financialProfile.freedomDef",v)} options={["Never worrying about bills again","Passive income replacing my job","Generational wealth for my family","Owning everything debt-free","Having options \u2014 work because I want to, not because I have to","Being able to give generously"]}/>
                <Sel label="8. How do you feel about using debt as a tool?" value={D.financialProfile?.debtTool||""} onChange={v=>upd("financialProfile.debtTool",v)} options={["Debt is dangerous \u2014 avoid at all costs","Only for a home or car","Smart debt (low interest, asset-backed) is a tool","I'd borrow against my own assets to invest","Debt doesn't bother me if it makes money","I've never thought about it strategically"]}/>
                <Sel label="9. If you could only pick ONE, which matters most?" value={D.financialProfile?.corePriority||""} onChange={v=>upd("financialProfile.corePriority",v)} options={["Protect what I have \u2014 no losses ever","Steady guaranteed income for life","Maximum growth regardless of risk","Tax elimination on everything possible","Legacy \u2014 my family inherits everything","Cash flow \u2014 I need money working monthly"]}/>
                <Sel label="10. Which statement sounds most like you?" value={D.financialProfile?.identity||""} onChange={v=>upd("financialProfile.identity",v)} options={["I'm a saver \u2014 I stack and protect","I'm a builder \u2014 I want assets and businesses","I'm a provider \u2014 family security comes first","I'm an opportunist \u2014 I jump on good deals","I'm cautious \u2014 I need to understand before I move","I'm overwhelmed \u2014 I just need a clear plan"]}/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <Btn sm onClick={()=>{upd("financialProfile.lastUpdated",today());showToast("Financial profile saved! AI updated with your patterns.");}}>Save & Update AI</Btn>
                {!D.financialProfile?.lastUpdated&&<div style={{fontSize:10,color:CL.rd,fontWeight:700,display:"flex",alignItems:"center"}}>{"\u26A0"} Complete these to unlock full AI recommendations</div>}
              </div>
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:CL.go}}>DEPENDENTS</div>
                <Btn sm onClick={()=>setSub(sub==="addDep"?"":"addDep")}>+ Dependent</Btn>
              </div>
              {sub==="addDep"&&<div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:8}}>
                <Inp label="Name" value={f.depN||""} onChange={v=>uf("depN",v)}/><Inp label="DOB" value={f.depD||""} onChange={v=>uf("depD",v)} type="date"/><Sel label="Relationship" value={f.depR||""} onChange={v=>uf("depR",v)} options={["Child","Spouse","Parent","Other"]}/><div style={{display:"flex",alignItems:"end"}}><Btn sm onClick={()=>{if(f.depN){const deps=[...(D.clientProfile.dependents||[]),{name:f.depN,dob:f.depD,relationship:f.depR,id:uid()}];upd("clientProfile.dependents",deps);rf();setSub("");}}} >Add</Btn></div>
              </div>}
              {(D.clientProfile.dependents||[]).length>0&&<TH headers={["Name","DOB","Relationship"]} rows={(D.clientProfile.dependents||[]).map(d=>[d.name,d.dob,d.relationship])} onDel={i=>{const deps=(D.clientProfile.dependents||[]).filter((_,j)=>j!==i);upd("clientProfile.dependents",deps);}}/>}
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:CL.go}}>FINANCIAL GOALS</div>
                <Btn sm onClick={()=>setSub(sub==="addGoal"?"":"addGoal")}>+ Goal</Btn>
              </div>
              {sub==="addGoal"&&<div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr auto",gap:8,marginBottom:8}}>
                <Inp label="Goal" value={f.goalN||""} onChange={v=>uf("goalN",v)} placeholder="Pay off mortgage"/><Inp label="Target Amount" value={f.goalA||""} onChange={v=>uf("goalA",v)} type="number"/><Inp label="Target Date" value={f.goalD||""} onChange={v=>uf("goalD",v)} type="date"/><Sel label="Priority" value={f.goalP||""} onChange={v=>uf("goalP",v)} options={["Critical","High","Medium","Low"]}/><div style={{display:"flex",alignItems:"end"}}><Btn sm onClick={()=>{if(f.goalN){const goals=[...(D.clientProfile.goals||[]),{name:f.goalN,targetAmount:f.goalA,targetDate:f.goalD,priority:f.goalP,progress:0,id:uid()}];upd("clientProfile.goals",goals);rf();setSub("");}}} >Add</Btn></div>
              </div>}
              {(D.clientProfile.goals||[]).length>0&&<TH headers={["Goal","Target","Date","Priority"]} rows={(D.clientProfile.goals||[]).map(g=>[g.name,fmt(g.targetAmount),g.targetDate,<span style={{color:g.priority==="Critical"?CL.rd:g.priority==="High"?CL.am:CL.gr}}>{g.priority}</span>])} onDel={i=>{const goals=(D.clientProfile.goals||[]).filter((_,j)=>j!==i);upd("clientProfile.goals",goals);}}/>}
            </Card>
            <TextArea label="Additional Notes / Priorities" value={D.clientProfile.priorities} onChange={v=>upd("clientProfile.priorities",v)} rows={4}/>
            <TextArea label="General Notes" value={D.clientProfile.notes} onChange={v=>upd("clientProfile.notes",v)} rows={3}/>
          </Sec>
        </>}

        {/* AI DOCUMENT BUILDER */}
        {tab==="docbuilder"&&(()=>{
          const cType=D.clientProfile?.clientType||"both";
          const hasTrust=cType==="trust"||cType==="both";
          const hasPMA=cType==="pma"||cType==="both";
          const hasBoth=cType==="both";
          const agreementDone=(D.documents?.files||[]).some(f=>(f.name||"").includes("Trust-PMA_Agreement")||((f.name||"").includes("Trust-Foundation")&&(f.name||"").includes("Agreement")));
          const genAndFile=(docType,entity)=>{const content=genDoc(docType,D);const cat=docType.includes("Bill of Sale")?"Bill of Sale":docType.includes("Deed")?"Bill of Sale":docType.includes("Assignment")?"Lease/MSA":docType.includes("Partnership")?"Lease/MSA":docType.includes("Articles")?"Articles/Bylaws":docType.includes("Bylaws")?"Articles/Bylaws":docType.includes("COA")?"PMA Document":docType.includes("Donation")?"Donation Cert":docType.includes("Member")?"Member Cert":docType.includes("Agreement")?"PMA Document":"Trust Indenture";
            const entry={id:uid(),name:`${docType.replace(/ /g,"_")}_${today()}.txt`,category:cat,type:entity==="Trust"?"trust-doc":"pma-doc",date:today(),content,entity,uploaded:ts()};
            upd("documents.files",[...(D.documents.files||[]),entry]);setViewDoc(entry);log("DOC BUILDER",`Generated: ${docType}`);showToast(`${docType} generated and filed!`);return entry;};
          return <>
          <Sec title="AI Document Builder" tag={cType==="trust"?"TRUST ONLY":cType==="pma"?"FOUNDATION ONLY":"TRUST + FOUNDATION"}>
            <Card style={{marginBottom:16,borderColor:CL.go}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:6}}>HOW IT WORKS</div>
              <div style={{fontSize:11,color:CL.tx,lineHeight:1.8}}>
                1. Fill in your Client Profile{hasTrust?", Trust":""}{hasPMA?", and Foundation":""} tabs first \u2014 the builder pulls from this data.<br/>
                2. Click any document below \u2014 it auto-populates with your information.<br/>
                3. Review in Document Viewer. Use RON (Remote Online Notarization) or in-person notary for execution.<br/>
                4. The Command Center auto-files it under the correct entity.
              </div>
            </Card>
          </Sec>

          {/* MANDATORY AGREEMENT - Only shows for "both" */}
          {hasBoth&&<Sec title="\u26A0 MANDATORY: Trust-PMA Agreement" tag={agreementDone?"COMPLETED":"REQUIRED"}>
            <Card style={{borderColor:agreementDone?CL.gr:CL.rd,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:agreementDone?CL.gr:CL.rd,marginBottom:8}}>{agreementDone?"Agreement on file \u2714":"This agreement MUST be executed before proceeding"}</div>
              <div style={{fontSize:11,color:CL.tx,marginBottom:10}}>This agreement establishes the legal relationship between your Trust and Foundation/PMA. It defines roles, financial management authority, property ownership, and fund transfer protocols. Both entities cannot operate together without this document.</div>
              {!agreementDone&&<Btn v="danger" onClick={()=>{
                const entry=genAndFile(AGREEMENT_DOC,"Foundation");
                const trustCopy={id:uid(),name:`Trust-PMA_Agreement_TRUST_COPY_${today()}.txt`,category:"PMA Document",type:"trust-doc",date:today(),content:entry.content,entity:"Trust",uploaded:ts()};
                upd("documents.files",[...(D.documents.files||[]),trustCopy]);
                log("AGREEMENT","Trust-PMA Agreement generated and filed in both entities");
              }}>Generate Trust-PMA Agreement (Files in Both Entities)</Btn>}
              {agreementDone&&<div style={{fontSize:10,color:CL.gr}}>Filed in both Trust and Foundation document sections. This section will remain visible for reference.</div>}
            </Card>
          </Sec>}

          {/* TRUST DOCUMENTS */}
          {hasTrust&&<Sec title="Trust Documents" tag={`${TRUST_DOCS.length} TEMPLATES`}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {TRUST_DOCS.map(docType=>{const locked=isOneTime(docType)&&isDocGenerated(docType,D.documents?.files);
                return <Card key={docType} style={{cursor:locked?"default":"pointer",padding:12,opacity:locked?0.7:1}} onClick={()=>{
                  if(locked){showToast(`${docType} already generated. Formation documents can only be created once.`);return;}
                  genAndFile(docType,"Trust");
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:12,fontWeight:700,color:locked?CL.dm:CL.go}}>{docType}</div>
                    {locked&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:8,background:CL.grB,color:CL.gr,fontWeight:700}}>\u2713 FILED</span>}
                  </div>
                  <div style={{fontSize:10,color:CL.dm,marginTop:2}}>{locked?"Formation doc \u2014 already on file (one-time only)":isOneTime(docType)?"Formation doc \u2014 one-time generation":"Transactional doc \u2014 can generate multiple"}</div>
                </Card>;})}
            </div>
          </Sec>}

          {/* FOUNDATION DOCUMENTS */}
          {hasPMA&&<Sec title="\u00A7508(c)(1)(A) Foundation Documents" tag={`${PMA_DOCS.length} TEMPLATES`}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {PMA_DOCS.map(docType=>{const locked=isOneTime(docType)&&isDocGenerated(docType,D.documents?.files);
                return <Card key={docType} style={{cursor:locked?"default":"pointer",padding:12,opacity:locked?0.7:1}} onClick={()=>{
                  if(locked){showToast(`${docType} already generated. Formation documents can only be created once.`);return;}
                  genAndFile(docType,"Foundation");
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:12,fontWeight:700,color:locked?CL.dm:CL.bl}}>{docType}</div>
                    {locked&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:8,background:CL.grB,color:CL.gr,fontWeight:700}}>\u2713 FILED</span>}
                  </div>
                  <div style={{fontSize:10,color:CL.dm,marginTop:2}}>{locked?"Formation doc \u2014 already on file (one-time only)":isOneTime(docType)?"Formation doc \u2014 one-time generation":"Transactional doc \u2014 can generate multiple"}</div>
                </Card>;})}
            </div>
          </Sec>}

          {/* BULK GENERATE */}
          <Sec title="Bulk Generate All Formation Documents">
            <Card>
              <div style={{fontSize:11,color:CL.dm,marginBottom:10}}>Generate ALL {cType==="trust"?"Trust":cType==="pma"?"Foundation":"Trust + Foundation"} formation documents at once. One-time formation docs that already exist will be skipped automatically.{hasBoth&&!agreementDone?" The Trust-PMA Agreement will be included.":""}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Btn v="blue" onClick={()=>{
                  const docs=[];if(hasTrust)docs.push(...TRUST_DOCS.map(d=>({type:d,entity:"Trust"})));if(hasPMA)docs.push(...PMA_DOCS.map(d=>({type:d,entity:"Foundation"})));if(hasBoth&&!agreementDone)docs.push({type:AGREEMENT_DOC,entity:"Foundation"});
                  let count=0;let skipped=0;docs.forEach(({type:docType,entity})=>{
                    const exists=isDocGenerated(docType,D.documents?.files);
                    if(exists&&isOneTime(docType)){skipped++;return;}
                    if(exists&&!isOneTime(docType))return;
                    const content=genDoc(docType,D);const cat=docType.includes("Bill of Sale")?"Bill of Sale":docType.includes("Deed")?"Bill of Sale":docType.includes("Articles")?"Articles/Bylaws":docType.includes("Bylaws")?"Articles/Bylaws":docType.includes("COA")?"PMA Document":docType.includes("Agreement")?"PMA Document":"Trust Indenture";
                      addTo("documents.files",{name:`${docType.replace(/ /g,"_")}_${today()}.txt`,category:cat,type:entity==="Trust"?"trust-doc":"pma-doc",date:today(),content,entity,uploaded:ts()});
                      if(docType===AGREEMENT_DOC){addTo("documents.files",{name:`Trust-PMA_Agreement_TRUST_COPY_${today()}.txt`,category:"PMA Document",type:"trust-doc",date:today(),content,entity:"Trust",uploaded:ts()});}
                      count++;
                  });log("BULK GENERATE",`Generated ${count} documents, ${skipped} locked`);showToast(`${count} new documents generated.${skipped?` ${skipped} formation docs already on file (locked).`:""}`);
                }}>Generate All {cType==="trust"?"Trust":cType==="pma"?"Foundation":"Trust + Foundation"} Documents</Btn>
                <Btn onClick={()=>{const email=D.meta?.clientEmail||"";
                  if(email){const subject=encodeURIComponent(`Estate Formation Documents - ${D.trust?.name||D.pma?.name||"Client"}`);
                    const body=encodeURIComponent(`Your formation documents have been generated.\n\n${hasTrust?`Trust: ${D.trust?.name||""}\n`:""}${hasPMA?`Foundation: ${D.pma?.name||""}\n`:""}Documents: ${(D.documents?.files||[]).length}\n\nPlease review, print, sign, and notarize all documents.`);
                    window.open(`mailto:${email}?subject=${subject}&body=${body}`);showToast("Email opened!");}
                  else showToast("Set client email in Settings first.");
                }}>Email Client Notification</Btn>
              </div>
            </Card>
          </Sec>
          <Sec title="Proprietary Protection">
            <Card style={{borderColor:CL.rd}}>
              <div style={{fontSize:11,color:CL.rd,fontWeight:700,marginBottom:6}}>PROPRIETARY & CONFIDENTIAL</div>
              <div style={{fontSize:10,color:CL.dm,lineHeight:1.6}}>
                All document templates, legal frameworks, Chart of Accounts structures, and operational procedures contained within the Family Wealth Command Center are proprietary intellectual property. Formation documents (Trust Indenture, Articles of Association, Bylaws, Trust-PMA Agreement) can only be generated ONCE per entity and are locked after creation to prevent unauthorized duplication. Transactional documents (Bills of Sale, Deeds, Certificates) can be generated as needed for legitimate transactions. Unauthorized reproduction, distribution, or reverse-engineering of these templates is prohibited.
              </div>
            </Card>
          </Sec>
        </>})()}

        {/* PERSONAL TAX 1040 */}
        {tab==="personaltax"&&<>
          <Sec title="Personal Income Tax" tag="1040 \u2014 SEPARATE FROM TRUST">
            <Card style={{marginBottom:12,borderColor:CL.am}}>
              <div style={{fontSize:11,color:CL.am,fontWeight:700}}>COMMINGLING FIREWALL: This section tracks PERSONAL income only. Trust income is reported on Form 1041 (separate tab). Never mix personal and trust funds.</div>
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Sel label="Filing Status" value={D.personalTax.filingStatus} onChange={v=>upd("personalTax.filingStatus",v)} options={[{value:"single",label:"Single"},{value:"mfj",label:"Married Filing Jointly"},{value:"mfs",label:"Married Filing Separately"},{value:"hoh",label:"Head of Household"},{value:"qw",label:"Qualifying Widow(er)"}]}/>
                <Inp label="Tax Year" value={D.taxData.year} onChange={v=>upd("taxData.year",v)}/>
              </div>
            </Card>
          </Sec>
          <Sec title="W-2 Income" actions={<Btn sm onClick={()=>setSub(sub==="addW2"?"":"addW2")}>+ W-2</Btn>}>
            {sub==="addW2"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Employer" value={f.w2emp||""} onChange={v=>uf("w2emp",v)}/><Inp label="Wages (Box 1)" value={f.w2wage||""} onChange={v=>uf("w2wage",v)} type="number"/><Inp label="Federal Tax Withheld" value={f.w2fed||""} onChange={v=>uf("w2fed",v)} type="number"/><Inp label="State Tax Withheld" value={f.w2st||""} onChange={v=>uf("w2st",v)} type="number"/><Inp label="SS Wages" value={f.w2ss||""} onChange={v=>uf("w2ss",v)} type="number"/>
            </div><Btn onClick={()=>{if(f.w2emp){addTo("personalTax.w2s",{employer:f.w2emp,wages:f.w2wage,federalWithheld:f.w2fed,stateWithheld:f.w2st,ssWages:f.w2ss});rf();setSub("");showToast("W-2 added");}}} >Add</Btn></Card>}
            {(D.personalTax.w2s||[]).length>0&&<TH headers={["Employer","Wages","Fed Withheld","State Withheld","SS Wages"]} rows={(D.personalTax.w2s||[]).map(w=>[w.employer,fmt(w.wages),fmt(w.federalWithheld),fmt(w.stateWithheld),fmt(w.ssWages)])} onDel={i=>rmFrom("personalTax.w2s",i)}/>}
          </Sec>
          <Sec title="1099 & Other Income" actions={<Btn sm onClick={()=>setSub(sub==="add1099"?"":"add1099")}>+ 1099</Btn>}>
            {sub==="add1099"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Payer / Source" value={f.i99src||""} onChange={v=>uf("i99src",v)}/><Sel label="Type" value={f.i99typ||""} onChange={v=>uf("i99typ",v)} options={["1099-NEC","1099-MISC","1099-INT","1099-DIV","1099-B","1099-R","1099-G","1099-S","1099-K","Other"]}/><Inp label="Amount" value={f.i99amt||""} onChange={v=>uf("i99amt",v)} type="number"/><Inp label="Tax Withheld" value={f.i99wh||""} onChange={v=>uf("i99wh",v)} type="number"/>
            </div><Btn onClick={()=>{if(f.i99src){addTo("personalTax.income1099",{source:f.i99src,type:f.i99typ,amount:f.i99amt,withheld:f.i99wh});rf();setSub("");showToast("1099 added");}}} >Add</Btn></Card>}
            {(D.personalTax.income1099||[]).length>0&&<TH headers={["Source","Type","Amount","Withheld"]} rows={(D.personalTax.income1099||[]).map(i=>[i.source,i.type,fmt(i.amount),fmt(i.withheld)])} onDel={i=>rmFrom("personalTax.income1099",i)}/>}
          </Sec>
          <Sec title="Adjustments to Income" actions={<Btn sm onClick={()=>setSub(sub==="addAdj"?"":"addAdj")}>+ Adjustment</Btn>}>
            {sub==="addAdj"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}>
              <Sel label="Adjustment" value={f.adjN||""} onChange={v=>uf("adjN",v)} options={["HSA Deduction","Self-Employment Tax (50%)","IRA Deduction","Student Loan Interest","Educator Expenses","Alimony Paid","Moving Expenses (Military)","Other"]}/><Inp label="Amount" value={f.adjA||""} onChange={v=>uf("adjA",v)} type="number"/>
            </div><Btn onClick={()=>{if(f.adjN){addTo("personalTax.adjustments",{name:f.adjN,amount:f.adjA});rf();setSub("");}}} >Add</Btn></Card>}
            {(D.personalTax.adjustments||[]).length>0&&<TH headers={["Adjustment","Amount"]} rows={(D.personalTax.adjustments||[]).map(a=>[a.name,fmt(a.amount)])} onDel={i=>rmFrom("personalTax.adjustments",i)}/>}
          </Sec>
          <Sec title="AGI & Donation Limit Calculator">
            <Card style={{marginBottom:12}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
                <div>W-2 Income</div><div style={{textAlign:"right"}}>{fmt(totalW2)}</div>
                <div>1099 Income</div><div style={{textAlign:"right"}}>{fmt(total1099)}</div>
                <div>Other Income</div><div style={{textAlign:"right"}}>{fmt(totalOtherPI)}</div>
                <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>GROSS INCOME</div><div style={{textAlign:"right",fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>{fmt(grossPersonalIncome)}</div>
                <div>Less: Adjustments</div><div style={{textAlign:"right",color:CL.rd}}>({fmt(totalAdjustments)})</div>
                <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6,color:CL.go}}>ADJUSTED GROSS INCOME (AGI)</div><div style={{textAlign:"right",fontWeight:700,color:CL.go,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6,fontSize:18}}>{fmt(agi)}</div>
              </div>
            </Card>
            <Card style={{marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.bl,marginBottom:10}}>60% AGI CHARITABLE DONATION LIMIT</div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
                <div>60% of AGI</div><div style={{textAlign:"right",color:CL.gr}}>{fmt(donationLimit)}</div>
                <div>Foundation Donations YTD</div><div style={{textAlign:"right"}}>{fmt(totalDon)}</div>
                <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>REMAINING DEDUCTIBLE CAPACITY</div><div style={{textAlign:"right",fontWeight:700,color:donationLimit-totalDon>0?CL.gr:CL.rd,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>{fmt(Math.max(0,donationLimit-totalDon))}</div>
              </div>
              {totalDon>donationLimit&&<div style={{background:CL.amB,borderRadius:6,padding:8,marginTop:10,fontSize:11,color:CL.am}}>Donations exceed 60% AGI limit. Excess of {fmt(totalDon-donationLimit)} may carry forward up to 5 years per IRC §170(d)(1).</div>}
              <PBar used={totalDon} total={donationLimit}/>
            </Card>
            <Card>
              <div style={{fontSize:13,fontWeight:700,color:CL.am,marginBottom:10}}>DEDUCTION SUMMARY</div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
                <div>Standard Deduction ({D.personalTax.filingStatus})</div><div style={{textAlign:"right"}}>{fmt(personalStdDed)}</div>
                <div>Itemized Deductions Total</div><div style={{textAlign:"right"}}>{fmt(totalItemized)}</div>
                <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>USING: {D.personalTax.standardDeduction?"STANDARD":"ITEMIZED"}</div><div style={{textAlign:"right",fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>{fmt(personalDeduction)}</div>
                <div style={{fontWeight:700,color:CL.go,marginTop:6}}>TAXABLE INCOME</div><div style={{textAlign:"right",fontWeight:700,color:CL.go,fontSize:18,marginTop:6}}>{fmt(taxablePersonalIncome)}</div>
              </div>
              <div style={{marginTop:10}}><Btn sm v={D.personalTax.standardDeduction?"ghost":"blue"} onClick={()=>upd("personalTax.standardDeduction",!D.personalTax.standardDeduction)}>{D.personalTax.standardDeduction?"Switch to Itemized":"Switch to Standard"}</Btn></div>
            </Card>
          </Sec>
          <Sec title="Estimated Tax Liability" tag="REAL-TIME">
            <Card>
              <div style={{fontSize:13,fontWeight:700,color:CL.rd,marginBottom:10}}>CURRENT TAX LIABILITY ESTIMATE</div>
              {(()=>{
                const ti=taxablePersonalIncome;const fs2=D.personalTax?.filingStatus||"single";
                const brackets=fs2==="mfj"||fs2==="qw"?[[23200,10],[71050,12],[100525,22],[191950,24],[243725,32],[609350,35],[Infinity,37]]:fs2==="hoh"?[[16550,10],[63100,12],[100500,22],[191950,24],[243700,32],[609350,35],[Infinity,37]]:[[11600,10],[47150,12],[100525,22],[191950,24],[243725,32],[609350,35],[Infinity,37]];
                let tax=0;let prev=0;for(const[limit,rate]of brackets){const taxable=Math.min(ti,limit)-prev;if(taxable>0)tax+=taxable*rate/100;prev=limit;if(ti<=limit)break;}
                const ssTax=Math.min(totalW2,168600)*0.0765;
                const totalWithheld=(D.personalTax?.w2s||[]).reduce((s,w)=>s+(parseFloat(w.federalWithheld)||0),0);
                const estPayments=(D.personalTax?.estimatedPayments||[]).reduce((s,p)=>s+(parseFloat(p.amount)||0),0);
                const totalPaid=totalWithheld+estPayments;
                const owed=tax-totalPaid;
                const effectiveRate=ti>0?(tax/grossPersonalIncome*100).toFixed(1):0;
                return <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
                  <div>Taxable Income</div><div style={{textAlign:"right"}}>{fmt(ti)}</div>
                  <div>Federal Income Tax</div><div style={{textAlign:"right",color:CL.rd}}>{fmt(tax)}</div>
                  <div>FICA (SS + Medicare)</div><div style={{textAlign:"right",color:CL.rd}}>{fmt(ssTax)}</div>
                  <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>TOTAL ESTIMATED TAX</div><div style={{textAlign:"right",fontWeight:700,color:CL.rd,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6}}>{fmt(tax+ssTax)}</div>
                  <div style={{color:CL.gr}}>Less: Federal Withheld</div><div style={{textAlign:"right",color:CL.gr}}>({fmt(totalWithheld)})</div>
                  <div style={{color:CL.gr}}>Less: Estimated Payments</div><div style={{textAlign:"right",color:CL.gr}}>({fmt(estPayments)})</div>
                  <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6,color:owed>0?CL.rd:CL.gr}}>{owed>0?"ESTIMATED AMOUNT OWED":"ESTIMATED REFUND"}</div>
                  <div style={{textAlign:"right",fontWeight:700,fontSize:20,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6,color:owed>0?CL.rd:CL.gr}}>{fmt(Math.abs(owed))}</div>
                  <div style={{color:CL.dm,fontSize:10,marginTop:6}}>Effective Tax Rate</div><div style={{textAlign:"right",color:CL.dm,fontSize:10,marginTop:6}}>{effectiveRate}%</div>
                  <div style={{color:CL.go,fontSize:10}}>Tax Savings from Trust Structure</div><div style={{textAlign:"right",color:CL.go,fontSize:10,fontWeight:700}}>{fmt(totalAllSavings)}</div>
                  <div style={{color:CL.go,fontSize:10}}>WITHOUT Trust Structure (estimated)</div><div style={{textAlign:"right",color:CL.am,fontSize:10}}>{fmt(tax+ssTax+totalAllSavings)}</div>
                </div>;
              })()}
              <div style={{marginTop:10,fontSize:10,color:CL.dm}}>This is an estimate. Consult your CPA for final tax preparation. Tax savings from the Trust structure are shown for comparison.</div>
            </Card>
          </Sec>
        </>}

        {/* TAX SAVINGS DASHBOARD */}
        {tab==="taxsavings"&&<>
          <Sec title="Tax Savings Dashboard" tag="ANNUAL & CUMULATIVE">
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
              <Stat label="Deferred Capital Gains" value={fK(totalDeferredCG)} color={CL.gr} icon="\u2197"/>
              <Stat label="Deferred Taxes" value={fK(totalDeferredTax)} color={CL.bl} icon="\u2263"/>
              <Stat label="Donation Tax Savings" value={fK(totalDonationSavings)} color={CL.pu} icon="\u2740"/>
              <Stat label="TOTAL SAVINGS" value={fK(totalAllSavings)} color={CL.go} icon="\u2605"/>
            </div>
          </Sec>
          <Sec title="Deferred Capital Gains" tag="TRUST STRUCTURE" actions={<Btn sm onClick={()=>setSub(sub==="addDCG"?"":"addDCG")}>+ Entry</Btn>}>
            <div style={{fontSize:11,color:CL.dm,marginBottom:10}}>Track capital gains deferred through trust structure, 1031 exchanges, opportunity zones, or installment sales.</div>
            {sub==="addDCG"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Description" value={f.dcgN||""} onChange={v=>uf("dcgN",v)} placeholder="BTC transferred to trust"/><Inp label="Gain Amount" value={f.dcgG||""} onChange={v=>uf("dcgG",v)} type="number"/><Inp label="Tax Rate %" value={f.dcgR||""} onChange={v=>uf("dcgR",v)} placeholder="23.8" type="number"/><Inp label="Tax Saved" value={f.dcgS||""} onChange={v=>uf("dcgS",v)} type="number"/><Inp label="Date" value={f.dcgD||""} onChange={v=>uf("dcgD",v)} type="date"/>
            </div><Btn onClick={()=>{if(f.dcgN){const saved=f.dcgS||(parseFloat(f.dcgG||0)*parseFloat(f.dcgR||23.8)/100).toFixed(2);addTo("taxSavings.deferredCapGains",{description:f.dcgN,gainAmount:f.dcgG,taxRate:f.dcgR||"23.8",taxSaved:saved,date:f.dcgD||today(),year:D.taxData.year});rf();setSub("");showToast("Deferred gain recorded");}}} >Record</Btn></Card>}
            {(D.taxSavings.deferredCapGains||[]).length>0&&<TH headers={["Description","Gain","Rate","Tax Saved","Date","Year"]} rows={(D.taxSavings.deferredCapGains||[]).map(d=>[d.description,fmt(d.gainAmount),`${d.taxRate}%`,fmt(d.taxSaved),d.date,d.year])} onDel={i=>rmFrom("taxSavings.deferredCapGains",i)}/>}
          </Sec>
          <Sec title="Donation Tax Savings" actions={<Btn sm onClick={()=>setSub(sub==="addDTS"?"":"addDTS")}>+ Entry</Btn>}>
            <div style={{fontSize:11,color:CL.dm,marginBottom:10}}>Track tax savings from charitable donations to your §508(c)(1)(A) foundation (up to 60% AGI).</div>
            {sub==="addDTS"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Description" value={f.dtsN||""} onChange={v=>uf("dtsN",v)} placeholder="Annual foundation donation"/><Inp label="Donation Amount" value={f.dtsA||""} onChange={v=>uf("dtsA",v)} type="number"/><Inp label="Tax Bracket %" value={f.dtsR||""} onChange={v=>uf("dtsR",v)} placeholder="32" type="number"/><Inp label="Date" value={f.dtsD||""} onChange={v=>uf("dtsD",v)} type="date"/>
            </div><Btn onClick={()=>{if(f.dtsN){const saved=(parseFloat(f.dtsA||0)*parseFloat(f.dtsR||32)/100).toFixed(2);addTo("taxSavings.donationSavings",{description:f.dtsN,donationAmount:f.dtsA,taxBracket:f.dtsR||"32",taxSaved:saved,date:f.dtsD||today(),year:D.taxData.year});rf();setSub("");showToast("Donation savings recorded");}}} >Record</Btn></Card>}
            {(D.taxSavings.donationSavings||[]).length>0&&<TH headers={["Description","Donated","Bracket","Tax Saved","Date","Year"]} rows={(D.taxSavings.donationSavings||[]).map(d=>[d.description,fmt(d.donationAmount),`${d.taxBracket}%`,fmt(d.taxSaved),d.date,d.year])} onDel={i=>rmFrom("taxSavings.donationSavings",i)}/>}
          </Sec>
          <Sec title="Other Deferred Taxes" actions={<Btn sm onClick={()=>setSub(sub==="addODT"?"":"addODT")}>+ Entry</Btn>}>
            {sub==="addODT"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Description" value={f.odtN||""} onChange={v=>uf("odtN",v)} placeholder="1031 exchange savings"/><Sel label="Strategy" value={f.odtS||""} onChange={v=>uf("odtS",v)} options={["Trust Structure","1031 Exchange","Opportunity Zone","Installment Sale","Depreciation","Cost Segregation","Conservation Easement","Other"]}/><Inp label="Amount Saved" value={f.odtA||""} onChange={v=>uf("odtA",v)} type="number"/><Inp label="Date" value={f.odtD||""} onChange={v=>uf("odtD",v)} type="date"/>
            </div><Btn onClick={()=>{if(f.odtN){addTo("taxSavings.otherSavings",{description:f.odtN,strategy:f.odtS,amount:f.odtA,date:f.odtD||today(),year:D.taxData.year});rf();setSub("");}}} >Record</Btn></Card>}
            {(D.taxSavings.otherSavings||[]).length>0&&<TH headers={["Description","Strategy","Saved","Date","Year"]} rows={(D.taxSavings.otherSavings||[]).map(d=>[d.description,d.strategy,fmt(d.amount),d.date,d.year])} onDel={i=>rmFrom("taxSavings.otherSavings",i)}/>}
          </Sec>
          <Sec title="Investment Direction" tag="BASED ON PROFILE & SAVINGS">
            <Card>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:12}}>WHERE SHOULD SAVED MONEY GO?</div>
              <div style={{fontSize:12,color:CL.tx,lineHeight:1.8}}>
                {(()=>{
                  const risk=D.clientProfile.riskTolerance||"moderate";
                  const horizon=D.clientProfile.timeHorizon||"10+";
                  const suggestions=[];
                  if(totalAllSavings>0){
                    suggestions.push({name:"Tax Savings Available to Redirect",value:fmt(totalAllSavings),color:CL.go});
                    if(totalDebt>0&&(D.debt?.items||[]).some(d=>parseFloat(d.interestRate)>6))suggestions.push({name:"Pay Down High-Interest Debt (>6%)",value:fmt((D.debt?.items||[]).filter(d=>parseFloat(d.interestRate)>6).reduce((s,d)=>s+(parseFloat(d.balance)||0),0)),color:CL.rd,note:"Guaranteed return equal to interest rate"});
                    if(!totalRetirement||totalRetirement<(parseFloat(D.clientProfile.currentAnnualIncome)||0)*3)suggestions.push({name:"Max Retirement Contributions",value:risk==="Conservative"?"401k/IRA \u2192 Bonds/Target Date":"401k/IRA \u2192 Index Funds",color:CL.bl,note:"Pre-tax: reduces AGI further"});
                    if(risk==="Conservative"||risk==="moderate"){suggestions.push({name:"★ PRIORITY: Whole Life Insurance (Cash Value)",value:"Trust-owned policy",color:CL.go,note:"★ FIRST WAREHOUSE — Fund this BEFORE other investments. Borrow against cash value to invest elsewhere."});suggestions.push({name:"Fixed/Indexed Annuity",value:"Guaranteed income stream",color:CL.am,note:"Private pension, trust-owned"});}
                    if(risk==="Aggressive"||risk==="Very Aggressive"){suggestions.push({name:"Real Estate via Trust-Owned LLC",value:"Rental income + depreciation",color:CL.cy,note:"Active\u2192Passive conversion, additional write-offs"});suggestions.push({name:"Crypto/Digital Assets in Trust",value:"Long-term hold, deferred gains",color:CL.pu,note:"No taxable event on transfer to trust"});}
                    if(horizon==="10+ years"||horizon==="5-10 years"){suggestions.push({name:"Index Fund Portfolio",value:risk==="Conservative"?"60/40 stocks/bonds":"80/20 stocks/bonds",color:CL.gr,note:"Low-cost, tax-efficient growth"});}
                    suggestions.push({name:"Foundation Mission Investment",value:"Reinvest in ministry programs",color:CL.bl,note:"Furthers tax-exempt purpose"});
                    if(totalREEquity>0)suggestions.push({name:"Real Estate Equity Leverage",value:`${fK(totalREEquity)} available`,color:CL.am,note:"HELOC for trust asset acquisition"});
                  } else {suggestions.push({name:"Start by recording tax savings above",value:"Track deferred gains and donation savings",color:CL.dm});}
                  return suggestions.map((s,i)=> <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${CL.bd}`}}>
                    <div style={{width:8,height:8,borderRadius:4,background:s.color,flexShrink:0}}/>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:CL.tx}}>{s.name}</div>{s.note&&<div style={{fontSize:10,color:CL.dm}}>{s.note}</div>}</div>
                    <div style={{fontSize:12,color:s.color,fontWeight:600}}>{s.value}</div>
                  </div>);
                })()}
              </div>
            </Card>
          </Sec>
        </>}

        {/* REAL ESTATE */}
        {tab==="realestate"&&<>
          <Sec title="Real Estate Holdings" tag="PROPERTIES & DEPRECIATION" actions={<Btn sm onClick={()=>setSub(sub==="addProp"?"":"addProp")}>+ Property</Btn>}>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
              <Stat label="Total Value" value={fK(totalREValue)} color={CL.am}/>
              <Stat label="Total Debt" value={fK(totalREDebt)} color={CL.rd}/>
              <Stat label="Total Equity" value={fK(totalREEquity)} color={CL.gr}/>
              <Stat label="Annual Rent" value={fK(totalRERent)} color={CL.cy}/>
            </div>
            {sub==="addProp"&&<Card style={{marginBottom:12}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
                <Inp label="Address / Name" value={f.reAddr||""} onChange={v=>uf("reAddr",v)}/><Sel label="Type" value={f.reType||""} onChange={v=>uf("reType",v)} options={["Primary Residence","Rental - SFR","Rental - Multi","Commercial","Land","Vacation","Trust-Owned","LLC-Owned"]}/><Sel label="Owner" value={f.reOwn||""} onChange={v=>uf("reOwn",v)} options={["Personal","Trust","LLC","Foundation"]}/><Inp label="Purchase Date" value={f.reDate||""} onChange={v=>uf("reDate",v)} type="date"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",gap:8}}>
                <Inp label="Purchase Price" value={f.rePP||""} onChange={v=>uf("rePP",v)} type="number"/><Inp label="Current Value" value={f.reCV||""} onChange={v=>uf("reCV",v)} type="number"/><Inp label="Mortgage Balance" value={f.reMB||""} onChange={v=>uf("reMB",v)} type="number"/><Inp label="Monthly Payment" value={f.reMP||""} onChange={v=>uf("reMP",v)} type="number"/><Inp label="Monthly Rent" value={f.reRent||""} onChange={v=>uf("reRent",v)} type="number"/><Inp label="Annual Depreciation" value={f.reDep||""} onChange={v=>uf("reDep",v)} type="number"/>
              </div>
              <Btn onClick={()=>{if(f.reAddr){addTo("realEstate.properties",{address:f.reAddr,type:f.reType,owner:f.reOwn,purchaseDate:f.reDate,purchasePrice:f.rePP,currentValue:f.reCV,mortgageBalance:f.reMB,monthlyPayment:f.reMP,monthlyRent:f.reRent,annualDepreciation:f.reDep});rf();setSub("");showToast("Property added");}}} >Add Property</Btn>
            </Card>}
            {(D.realEstate.properties||[]).length>0&&<TH headers={["Property","Type","Owner","Value","Mortgage","Equity","Rent/mo","Depreciation"]} rows={(D.realEstate.properties||[]).map(p=>{const eq=(parseFloat(p.currentValue)||0)-(parseFloat(p.mortgageBalance)||0);return [p.address,p.type,p.owner,fmt(p.currentValue),fmt(p.mortgageBalance),<span style={{color:eq>=0?CL.gr:CL.rd}}>{fmt(eq)}</span>,fmt(p.monthlyRent),fmt(p.annualDepreciation)];})} onDel={i=>rmFrom("realEstate.properties",i)}/>}
          </Sec>
        </>}

        {/* RETIREMENT */}
        {tab==="retirement"&&<Sec title="Retirement Accounts" tag="PERSONAL \u2014 NOT TRUST" actions={<Btn sm onClick={()=>setSub(sub==="addRet"?"":"addRet")}>+ Account</Btn>}>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
            <Stat label="Total Retirement" value={fK(totalRetirement)} color={CL.bl}/>
            <Stat label="Accounts" value={(D.retirement.accounts||[]).length.toString()}/>
          </div>
          {sub==="addRet"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",gap:8}}>
            <Inp label="Institution" value={f.retI||""} onChange={v=>uf("retI",v)}/><Sel label="Type" value={f.retT||""} onChange={v=>uf("retT",v)} options={["401(k) — Personal","403(b) — Personal","Traditional IRA — Personal","Roth IRA — Personal","SEP IRA — Personal","SIMPLE IRA — Personal","Pension","Deferred Comp","TSP — Personal","Other"]}/><Inp label="Balance" value={f.retB||""} onChange={v=>uf("retB",v)} type="number"/><Inp label="Annual Contribution" value={f.retC||""} onChange={v=>uf("retC",v)} type="number"/><Inp label="Employer Match" value={f.retM||""} onChange={v=>uf("retM",v)} placeholder="6%"/><Inp label="Beneficiary" value={f.retBen||""} onChange={v=>uf("retBen",v)}/>
          </div><Btn onClick={()=>{if(f.retI){addTo("retirement.accounts",{institution:f.retI,type:f.retT,balance:f.retB,annualContribution:f.retC,employerMatch:f.retM,beneficiary:f.retBen});rf();setSub("");}}} >Add</Btn></Card>}
          {(D.retirement.accounts||[]).length>0&&<TH headers={["Institution","Type","Balance","Annual Contribution","Match","Beneficiary"]} rows={(D.retirement.accounts||[]).map(a=>[a.institution,a.type,fmt(a.balance),fmt(a.annualContribution),a.employerMatch,a.beneficiary])} onDel={i=>rmFrom("retirement.accounts",i)}/>}
          <Card style={{marginTop:16}}>
            <div style={{fontSize:11,color:CL.am,fontWeight:600}}>NOTE: Retirement contributions reduce your AGI, which lowers your taxable income AND increases the absolute dollar amount of your 60% AGI charitable deduction limit. Max out pre-tax contributions before donating.</div>
          </Card>
        </Sec>}

        {/* DEBT MANAGEMENT */}
        {tab==="debtmgr"&&<Sec title="Debt Management" tag="PERSONAL ONLY" actions={<Btn sm onClick={()=>setSub(sub==="addDebt"?"":"addDebt")}>+ Debt</Btn>}>
          <Card style={{marginBottom:12,borderColor:CL.am}}>
            <div style={{fontSize:11,color:CL.am,fontWeight:700}}>PERSONAL DEBT ONLY. Trust obligations and entity-level debt should be recorded under the respective entity tabs.</div>
          </Card>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
            <Stat label="Total Debt" value={fK(totalDebt)} color={CL.rd}/>
            <Stat label="Monthly Payments" value={fK(monthlyDebtPayments)} color={CL.am}/>
            <Stat label="Annual Debt Service" value={fK(monthlyDebtPayments*12)} color={CL.rd}/>
          </div>
          {sub==="addDebt"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",gap:8}}>
            <Inp label="Creditor" value={f.debtN||""} onChange={v=>uf("debtN",v)}/><Sel label="Type" value={f.debtT||""} onChange={v=>uf("debtT",v)} options={["Mortgage","Auto Loan","Student Loan","Credit Card","Personal Loan","Medical","HELOC","Other"]}/><Inp label="Balance" value={f.debtB||""} onChange={v=>uf("debtB",v)} type="number"/><Inp label="Interest Rate %" value={f.debtR||""} onChange={v=>uf("debtR",v)} type="number"/><Inp label="Monthly Payment" value={f.debtM||""} onChange={v=>uf("debtM",v)} type="number"/><Inp label="Payoff Date" value={f.debtD||""} onChange={v=>uf("debtD",v)} type="date"/>
          </div><Btn onClick={()=>{if(f.debtN){addTo("debt.items",{creditor:f.debtN,type:f.debtT,balance:f.debtB,interestRate:f.debtR,monthlyPayment:f.debtM,payoffDate:f.debtD});rf();setSub("");}}} >Add</Btn></Card>}
          {(D.debt.items||[]).length>0&&<TH headers={["Creditor","Type","Balance","Rate","Monthly","Payoff"]} rows={(D.debt.items||[]).map(d=>[d.creditor,d.type,fmt(d.balance),`${d.interestRate}%`,fmt(d.monthlyPayment),d.payoffDate])} onDel={i=>rmFrom("debt.items",i)}/>}
          {(D.debt.items||[]).some(d=>parseFloat(d.interestRate)>6)&&<Card style={{marginTop:12}}>
            <div style={{fontSize:13,fontWeight:700,color:CL.rd,marginBottom:6}}>HIGH-INTEREST DEBT ALERT</div>
            <div style={{fontSize:11,color:CL.tx}}>You have debts above 6% interest. Consider redirecting tax savings here first \u2014 paying off a 20% credit card is equivalent to a guaranteed 20% investment return.</div>
          </Card>}
        </Sec>}

        {/* CASH FLOW */}
        {tab==="cashflow"&&<>
          <Sec title="Cash Flow Overview" tag="ALL ENTITIES COMBINED">
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:12}}>MONTHLY CASH FLOW</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
                <Inp label="Monthly Personal Income" value={D.cashFlow.monthlyBudget.income} onChange={v=>upd("cashFlow.monthlyBudget.income",v)} type="number"/>
                <Inp label="Fixed Expenses" value={D.cashFlow.monthlyBudget.fixedExpenses} onChange={v=>upd("cashFlow.monthlyBudget.fixedExpenses",v)} type="number"/>
                <Inp label="Variable Expenses" value={D.cashFlow.monthlyBudget.variableExpenses} onChange={v=>upd("cashFlow.monthlyBudget.variableExpenses",v)} type="number"/>
                <Inp label="Savings/Investing" value={D.cashFlow.monthlyBudget.savings} onChange={v=>upd("cashFlow.monthlyBudget.savings",v)} type="number"/>
              </div>
              {(()=>{
                const mInc=parseFloat(D.cashFlow.monthlyBudget.income)||0;
                const mFix=parseFloat(D.cashFlow.monthlyBudget.fixedExpenses)||0;
                const mVar=parseFloat(D.cashFlow.monthlyBudget.variableExpenses)||0;
                const mSav=parseFloat(D.cashFlow.monthlyBudget.savings)||0;
                const mNet=mInc-mFix-mVar-mSav;
                const rentInc=totalRERent/12;
                const llcNet=(llcRev-llcExp)/12;
                const totalMonthly=mNet+rentInc+llcNet;
                return <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:3,fontSize:12}}>
                  <div>Personal Net</div><div style={{textAlign:"right",color:mNet>=0?CL.gr:CL.rd}}>{fmt(mNet)}</div>
                  <div>Rental Income (monthly avg)</div><div style={{textAlign:"right",color:CL.gr}}>{fmt(rentInc)}</div>
                  <div>LLC Net (monthly avg)</div><div style={{textAlign:"right",color:llcNet>=0?CL.gr:CL.rd}}>{fmt(llcNet)}</div>
                  <div>Debt Payments</div><div style={{textAlign:"right",color:CL.rd}}>({fmt(monthlyDebtPayments)})</div>
                  <div style={{fontWeight:700,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6,color:CL.go}}>TOTAL MONTHLY NET CASH FLOW</div><div style={{textAlign:"right",fontWeight:700,color:totalMonthly-monthlyDebtPayments>=0?CL.gr:CL.rd,borderTop:`1px solid ${CL.bd}`,paddingTop:6,marginTop:6,fontSize:18}}>{fmt(totalMonthly-monthlyDebtPayments)}</div>
                  <div style={{fontSize:11,color:CL.dm,marginTop:4}}>Annualized</div><div style={{textAlign:"right",fontSize:11,color:CL.dm,marginTop:4}}>{fmt((totalMonthly-monthlyDebtPayments)*12)}</div>
                </div>;
              })()}
            </Card>
          </Sec>
        </>}

        {/* BILL PAY & CONNECTIONS */}
        {tab==="billpay"&&<>
          <Sec title="Bill Pay & Account Connections" tag="CENTRALIZED PAYMENTS">
            <Card style={{marginBottom:16,borderColor:CL.bl}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.bl,marginBottom:8}}>WHY CENTRALIZED BILL PAY MATTERS</div>
              <div style={{fontSize:11,color:CL.tx,lineHeight:1.8}}>
                <div>Paying bills from one place eliminates manual tracking errors, ensures every payment posts to the correct entity (Trust, Foundation, LLC, Personal), and creates an automatic audit trail. This is the difference between a spreadsheet and a financial operating system.</div>
              </div>
            </Card>
            <Card style={{marginBottom:16,borderColor:CL.am}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.am,marginBottom:8}}>BANK CONNECTION STATUS</div>
              <div style={{fontSize:11,color:CL.tx,lineHeight:1.6}}>
                <div>Direct bank connections require a secure third-party service like Plaid (used by Venmo, Cash App, Robinhood). This is a future integration that would allow:</div>
                <div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{background:CL.grB,padding:8,borderRadius:6}}><span style={{color:CL.gr,fontWeight:700}}>Auto-Import</span><br/><span style={{fontSize:10,color:CL.dm}}>Transactions flow in automatically. No manual entry.</span></div>
                  <div style={{background:CL.grB,padding:8,borderRadius:6}}><span style={{color:CL.gr,fontWeight:700}}>Auto-Categorize</span><br/><span style={{fontSize:10,color:CL.dm}}>AI assigns each transaction to the correct COA code and entity.</span></div>
                  <div style={{background:CL.grB,padding:8,borderRadius:6}}><span style={{color:CL.gr,fontWeight:700}}>Auto-Reconcile</span><br/><span style={{fontSize:10,color:CL.dm}}>Bank balances match Command Center balances automatically.</span></div>
                  <div style={{background:CL.grB,padding:8,borderRadius:6}}><span style={{color:CL.gr,fontWeight:700}}>Bill Pay</span><br/><span style={{fontSize:10,color:CL.dm}}>Pay bills directly from the correct entity account.</span></div>
                </div>
                <div style={{marginTop:10,fontSize:10,color:CL.am}}>Until live connections are enabled, use the Recurring Bills tracker below to manage all payments manually with auto-reminders.</div>
              </div>
            </Card>
          </Sec>
          <Sec title="Recurring Bills & Payments" actions={<Btn sm onClick={()=>setSub(sub==="addBill"?"":"addBill")}>+ Bill</Btn>}>
            {sub==="addBill"&&<Card style={{marginBottom:10}}><div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",gap:8}}>
              <Inp label="Payee / Description" value={f.billN||""} onChange={v=>uf("billN",v)} placeholder="Alabama Power"/>
              <Inp label="Amount" value={f.billA||""} onChange={v=>uf("billA",v)} type="number"/>
              <Sel label="Frequency" value={f.billF||""} onChange={v=>uf("billF",v)} options={["Monthly","Quarterly","Semi-Annual","Annual","One-Time"]}/>
              <Sel label="Pay From Entity" value={f.billE||""} onChange={v=>uf("billE",v)} options={["Personal","Trust","Foundation","LLC"]}/>
              <Sel label="COA Code" value={f.billC||""} onChange={v=>uf("billC",v)} options={["725-Utilities","715-Telephone","650-Insurance","685-Repairs","680-Rent","605-Vehicle","690-Office","500-Interest","505-Property Tax","Other"]}/>
              <Inp label="Due Date" value={f.billD||""} onChange={v=>uf("billD",v)} type="date"/>
            </div><div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>{if(f.billN){addTo("billPay.bills",{payee:f.billN,amount:f.billA,frequency:f.billF,entity:f.billE,coa:f.billC,dueDate:f.billD,autoPay:false,lastPaid:""});rf();setSub("");showToast("Bill added");}}} >Add Bill</Btn>
            </div></Card>}
            {(D.billPay?.bills||[]).length>0&&<div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:12}}>
                <Stat label="Monthly Bills" value={fK((D.billPay?.bills||[]).filter(b=>b.frequency==="Monthly").reduce((s,b)=>s+(parseFloat(b.amount)||0),0))} color={CL.am} icon="\u2637"/>
                <Stat label="Annual Total" value={fK((D.billPay?.bills||[]).reduce((s,b)=>{const a=parseFloat(b.amount)||0;const m={Monthly:12,Quarterly:4,"Semi-Annual":2,Annual:1,"One-Time":1};return s+a*(m[b.frequency]||1);},0))} color={CL.rd}/>
                <Stat label="Bills Tracked" value={(D.billPay?.bills||[]).length.toString()}/>
              </div>
              <TH headers={["Payee","Amount","Frequency","Entity","COA","Due","Status"]} rows={(D.billPay?.bills||[]).map(b=>{
                const overdue=b.dueDate&&ds(b.dueDate)>0;
                return [b.payee,fmt(b.amount),b.frequency,<span style={{color:b.entity==="Trust"?CL.go:b.entity==="Foundation"?CL.bl:b.entity==="LLC"?CL.cy:CL.tx}}>{b.entity}</span>,b.coa,b.dueDate,<span style={{color:overdue?CL.rd:CL.gr,fontWeight:700,fontSize:10}}>{overdue?"OVERDUE":"OK"}</span>];
              })} onDel={i=>rmFrom("billPay.bills",i)}/>
            </div>}
          </Sec>
        </>}

        {/* COMPLIANCE CHECKLIST */}
        {tab==="compliance"&&<>
          <Sec title="Annual Compliance Checklist" tag="AUTO-VERIFIED">
            <div style={{fontSize:11,color:CL.dm,marginBottom:16}}>The system auto-checks items based on your data. Green = done. Red = action needed. Yellow = approaching deadline.</div>
            {(()=>{
              const checks=[
                {cat:"TRUST",items:[
                  {name:"Trust Information Complete",done:!!(D.trust.name&&D.trust.ein&&D.trust.situs),detail:"Name, EIN, and Situs must be set"},
                  {name:"At Least 1 Active Trustee",done:(D.governance?.trustees||[]).some(t=>t.status==="active"&&t.name),detail:"Governance tab"},
                  {name:"Successor Trustees Designated",done:(D.governance?.successors||[]).some(s=>s.name),detail:"At least 1 successor named"},
                  {name:"Trust Protector Appointed",done:!!(D.governance?.protector?.name),detail:"Governance tab"},
                  {name:"Monthly Bank Reconciliation",done:ds(D.settings?.lastRecon)<35,detail:D.settings?.lastRecon?`Last: ${D.settings.lastRecon}`:"Never reconciled"},
                  {name:"Quarterly Board Meeting",done:ds(D.settings?.lastMinutes)<95,detail:D.settings?.lastMinutes?`Last: ${D.settings.lastMinutes}`:"No minutes recorded"},
                  {name:"Trust Renewal Date Set",done:!!(D.trust.renewalDate),detail:D.trust.renewalDate||"Not set"},
                  {name:"Beneficiaries Registered",done:(D.trust.beneficiaries||[]).length>0,detail:`${(D.trust.beneficiaries||[]).length} beneficiaries`},
                  {name:"All Expenses Categorized",done:!(D.trust.expenses||[]).some(e=>!e.coa),detail:(D.trust.expenses||[]).filter(e=>!e.coa).length+" uncategorized"},
                  {name:"Form 1041 Data Complete",done:!!(D.trust.income||[]).length||(D.trust.expenses||[]).length,detail:"Income and expenses recorded for tax year"},
                ]},
                {cat:"\u00A7508(c)(1)(A) FOUNDATION",items:[
                  {name:"Foundation Information Complete",done:!!(D.pma?.name&&D.pma?.ein),detail:"Name and EIN required"},
                  {name:"Mission Statement Set",done:!!(D.pma?.mission),detail:"Required for compliance"},
                  {name:"Articles of Association on File",done:(D.documents?.files||[]).some(f=>f.category==="Articles/Bylaws"),detail:"Upload to Document Vault"},
                  {name:"Bylaws on File",done:(D.documents?.files||[]).some(f=>f.category==="Articles/Bylaws"&&(f.name||"").toLowerCase().includes("bylaw")),detail:"Upload to Document Vault"},
                  {name:"Annual Meeting Held",done:ds(D.pma?.lastAnnualMeeting||D.settings?.lastAnnual)<370,detail:D.pma?.lastAnnualMeeting||"Not recorded"},
                  {name:"Meeting Minutes Filed",done:(D.documents?.files||[]).some(f=>(f.name||"").includes("PMA_Minutes")),detail:"Auto-generate from Foundation tab"},
                  {name:"Members Registered",done:(D.pma?.members||[]).length>0,detail:`${(D.pma?.members||[]).length} members`},
                  {name:"Donation Certificates Issued",done:(D.pma?.donations||[]).length===0||(D.documents?.files||[]).some(f=>f.type==="donation-cert"),detail:"Auto-generated with each donation"},
                  {name:"Foundation COA on File",done:(D.documents?.files||[]).some(f=>(f.name||"").includes("COA")),detail:"Add via Documents tab"},
                  {name:"Donor Acknowledgments (Jan 31)",done:new Date().getMonth()>0||(D.documents?.files||[]).some(f=>(f.name||"").toLowerCase().includes("acknowledgment")),detail:"Due January 31 for prior year donations"},
                ]},
                {cat:"PERSONAL TAX",items:[
                  {name:"W-2 Income Entered",done:(D.personalTax?.w2s||[]).length>0,detail:`${(D.personalTax?.w2s||[]).length} W-2s`},
                  {name:"AGI Calculated",done:agi>0,detail:agi>0?fmt(agi):"No income entered"},
                  {name:"Filing Status Set",done:!!(D.personalTax?.filingStatus),detail:D.personalTax?.filingStatus||"Not set"},
                  {name:"60% Donation Limit Tracked",done:true,detail:`Limit: ${fmt(donationLimit)}, Used: ${fmt(totalDon)}`},
                ]},
                {cat:"GENERAL",items:[
                  {name:"Client Profile Complete",done:!!(D.clientProfile?.dob&&D.clientProfile?.riskTolerance&&D.clientProfile?.stateOfResidence),detail:"DOB, risk tolerance, and state required"},
                  {name:"Emergency Contacts Set",done:(D.succession?.emergencyContacts||[]).length>0,detail:"Succession tab"},
                  {name:"Succession Plan Documented",done:!!(D.succession?.plan||D.succession?.accessProtocol),detail:"Succession tab"},
                  {name:"Insurance Policies Current",done:!(D.insurance?.policies||[]).some(p=>p.premiumDue&&ds(p.premiumDue)>0),detail:"No overdue premiums"},
                  {name:"Data Backed Up Recently",done:false,detail:"Export from Settings tab"},
                ]},
              ];
              const totalItems=checks.reduce((s,c)=>s+c.items.length,0);
              const doneItems=checks.reduce((s,c)=>s+c.items.filter(i=>i.done).length,0);
              return <>
                <Card style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:20,fontWeight:800,color:doneItems===totalItems?CL.gr:doneItems>totalItems*0.7?CL.am:CL.rd}}>{doneItems}/{totalItems}</div>
                    <div style={{fontSize:12,color:CL.dm}}>Compliance Score: {Math.round(doneItems/totalItems*100)}%</div>
                  </div>
                  <div style={{background:CL.bg,borderRadius:5,height:10,overflow:"hidden",marginTop:8}}><div style={{background:doneItems===totalItems?CL.gr:doneItems>totalItems*0.7?CL.am:CL.rd,height:"100%",width:`${doneItems/totalItems*100}%`,borderRadius:5,transition:"width 0.3s"}}/></div>
                </Card>
                {checks.map(section=> <Card key={section.cat} style={{marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:10}}>{section.cat}</div>
                  {section.items.map((item,i)=> <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:`1px solid ${CL.bd}`}}>
                    <span style={{fontSize:16,color:item.done?CL.gr:CL.rd}}>{item.done?"\u2611":"\u2610"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:item.done?CL.tx:CL.rd,fontWeight:item.done?400:600}}>{item.name}</div>
                      <div style={{fontSize:10,color:CL.dm}}>{item.detail}</div>
                    </div>
                  </div>)}
                </Card>)}
              </>;
            })()}
          </Sec>
        </>}

        {/* CLIENT CALLS */}
        {tab==="clientcalls"&&<>
          <Sec title="Client Call Notes" tag="AI-INTEGRATED">
            <Card style={{marginBottom:12,borderColor:CL.bl}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.bl,marginBottom:8}}>LIVE CALL NOTES</div>
              <div style={{fontSize:11,color:CL.dm,marginBottom:12}}>Type notes during calls. Click Save when done. AI Advisor learns from every call.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8,marginBottom:8}}>
                <Inp label="Date" value={f.callDate||today()} onChange={v=>uf("callDate",v)} type="date"/>
                <Inp label="Subject" value={f.callSubject||""} onChange={v=>uf("callSubject",v)} placeholder="Topic of this call"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <Inp label="Meeting Link" value={f.callLink||""} onChange={v=>uf("callLink",v)} placeholder="meet.google.com/... or zoom.us/..."/>
                <Sel label="Call Type" value={f.callType||""} onChange={v=>uf("callType",v)} options={["Initial Consultation","Follow-Up","Strategy Session","Document Review","Tax Planning","Compliance Check","Emergency","Other"]}/>
              </div>
              <TextArea label="Call Notes" value={f.callNotes||""} onChange={v=>uf("callNotes",v)} rows={10}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
                <Inp label="Action Items" value={f.callActions||""} onChange={v=>uf("callActions",v)} placeholder="Comma-separated"/>
                <Inp label="Next Follow-Up" value={f.callFollowUp||""} onChange={v=>uf("callFollowUp",v)} type="date"/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <Btn onClick={()=>{if(f.callSubject&&f.callNotes){addTo("clientCalls",{date:f.callDate||today(),subject:f.callSubject,type:f.callType||"Other",link:f.callLink,notes:f.callNotes,actionItems:f.callActions,followUpDate:f.callFollowUp,uploaded:ts()});if(f.callFollowUp){addTo("calendar",{date:f.callFollowUp,description:`Follow-up: ${f.callSubject}`,entity:"Client",recurring:false});}rf();showToast("Call saved!");}else{showToast("Enter subject and notes","warning");}}}>Save & Record</Btn>
                <Btn v="ghost" onClick={()=>rf()}>Clear Form</Btn>
                {f.callLink&&<Btn v="blue" onClick={()=>{window.open(f.callLink.startsWith("http")?f.callLink:"https://"+f.callLink,"_blank");}}>Join Call</Btn>}
              </div>
            </Card>
          </Sec>
          {(D.clientCalls||[]).length>0&&<Sec title={`Call History (${(D.clientCalls||[]).length})`}>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:12}}>
              <Stat label="Total Calls" value={(D.clientCalls||[]).length.toString()} color={CL.bl}/>
              <Stat label="Action Items" value={(D.clientCalls||[]).reduce((s,c)=>{const items=(c.actionItems||"").split(",").filter(x=>x.trim());return s+items.length;},0).toString()} color={CL.am}/>
            </div>
            {(D.clientCalls||[]).map((call,i)=><Card key={call.id||i} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:CL.wh}}>{call.subject}</div>
                  <div style={{fontSize:10,color:CL.dm}}>{call.date} {call.type?"• "+call.type:""}</div>
                </div>
                <span onClick={()=>rmFrom("clientCalls",i)} style={{cursor:"pointer",color:CL.rd,fontSize:14}}>&times;</span>
              </div>
              <div style={{fontSize:11,color:CL.tx,lineHeight:1.6,maxHeight:100,overflowY:"auto",background:CL.bg,padding:8,borderRadius:4,whiteSpace:"pre-wrap"}}>{call.notes}</div>
              {call.actionItems&&<div style={{marginTop:6,fontSize:10,color:CL.am}}>Actions: {call.actionItems}</div>}
              {call.followUpDate&&<div style={{fontSize:10,color:ds(call.followUpDate)>0?CL.rd:CL.gr,marginTop:2}}>Follow-up: {call.followUpDate}{ds(call.followUpDate)>0?" (OVERDUE)":""}</div>}
              {call.link&&<div style={{fontSize:10,color:CL.bl,marginTop:2,cursor:"pointer"}} onClick={()=>window.open(call.link.startsWith("http")?call.link:"https://"+call.link,"_blank")}>Meeting: {call.link}</div>}
            </Card>)}
          </Sec>}
          {!(D.clientCalls||[]).length&&<Card style={{textAlign:"center",color:CL.dm,padding:20}}>
            <div style={{fontSize:11}}>No calls recorded yet. Type notes above and click Save & Record.</div>
          </Card>}
        </>}

        {/* OPERATIONS MANUAL */}
        {tab==="opsmanual"&&<>
          <Sec title="Operations Manuals" tag="DOWNLOADABLE & AI-INTEGRATED">
            <Card style={{marginBottom:16,borderColor:CL.go}}>
              <div style={{fontSize:13,fontWeight:700,color:CL.go,marginBottom:6}}>THREE CUSTOM MANUALS</div>
              <div style={{fontSize:11,color:CL.tx,lineHeight:1.8}}>
                Each manual contains ONLY the operational information relevant to the client's entity selection. The correct manual is automatically loaded into the AI Advisor's knowledge base based on the client type selected in Client Profile. Download the manual for offline reference or print for the client's records.
              </div>
            </Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
              {[
                {key:"trust",title:"Trust Only",desc:"Private Irrevocable Trust operations, Demand Notes, Form 1041, LLC management, banking, compliance",color:CL.go,icon:"⚱"},
                {key:"pma",title:"§508(c)(1)(A) Only",desc:"Foundation formation, donations, certificates, 60% AGI tracking, meetings, member management",color:CL.bl,icon:"❀"},
                {key:"both",title:"Trust + Foundation",desc:"Complete dual-entity operations, Trust-PMA Agreement, combined tax optimization, full compliance",color:CL.gr,icon:"◈"}
              ].map(m=>{
                const isActive=(D.clientProfile?.clientType||"both")===m.key;
                const isGenerated=D.opsManualGenerated?.[m.key];
                return <Card key={m.key} style={{borderColor:isActive?m.color:CL.bd,textAlign:"center",padding:20}}>
                  <div style={{fontSize:28,marginBottom:8}}>{m.icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:m.color,marginBottom:4}}>{m.title}</div>
                  <div style={{fontSize:10,color:CL.dm,marginBottom:12,lineHeight:1.6}}>{m.desc}</div>
                  {isActive&&<div style={{background:`${m.color}20`,borderRadius:6,padding:"4px 8px",marginBottom:10,fontSize:10,fontWeight:700,color:m.color}}>ACTIVE — LOADED IN AI</div>}
                  <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
                    <Btn sm onClick={()=>{
                      const content=genOpsManual(m.key,D);
                      const entry={id:uid(),name:`Operations_Manual_${m.title.replace(/ /g,"_")}_${today()}.txt`,type:"ops-manual",category:"Operations Manual",date:today(),content,entity:m.key==="trust"?"Trust":m.key==="pma"?"Foundation":"Both",uploaded:ts()};
                      upd("documents.files",[...(D.documents.files||[]),entry]);
                      const newGen={...(D.opsManualGenerated||{}), [m.key]:true};
                      upd("opsManualGenerated",newGen);
                      setViewDoc(entry);
                      log("OPS MANUAL",`Generated: ${m.title}`);
                      showToast(`${m.title} Operations Manual generated!`);
                    }}>Generate & Preview</Btn>
                    <Btn sm v="ghost" onClick={()=>{
                      const content=genOpsManual(m.key,D);
                      const blob=new Blob([content],{type:"text/plain"});
                      const url=URL.createObjectURL(blob);
                      const a=document.createElement("a");
                      a.href=url;a.download=`Operations_Manual_${m.title.replace(/ /g,"_")}_${today()}.txt`;a.click();
                      URL.revokeObjectURL(url);
                      showToast(`${m.title} manual downloaded!`);
                    }}>⬇ Download</Btn>
                  </div>
                  {isGenerated&&<div style={{fontSize:9,color:CL.gr,marginTop:6}}>✓ Generated and filed in Document Vault</div>}
                </Card>;
              })}
            </div>
          </Sec>
          <Sec title="Manual Status">
            <Card>
              <div style={{fontSize:12,color:CL.tx,lineHeight:1.8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span>Current Client Type:</span>
                  <span style={{fontWeight:700,color:CL.go}}>{(D.clientProfile?.clientType||"both")==="trust"?"Trust Only":(D.clientProfile?.clientType||"both")==="pma"?"§508(c)(1)(A) Only":"Trust + Foundation"}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span>AI Advisor Knowledge Base:</span>
                  <span style={{fontWeight:700,color:CL.gr}}>Loaded with {(D.clientProfile?.clientType||"both")==="trust"?"Trust":((D.clientProfile?.clientType||"both")==="pma"?"Foundation":"Trust + Foundation")} operations</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span>Client Calls Integrated:</span>
                  <span style={{fontWeight:700,color:(D.clientCalls||[]).length?CL.gr:CL.dm}}>{(D.clientCalls||[]).length} calls</span>
                </div>
              </div>
            </Card>
          </Sec>
        </>}

        {/* PRICING */}
        {tab==="pricing"&&<>
          <Sec title="Service Plan Overview" tag="WHAT'S INCLUDED">
            <Card style={{marginBottom:20,borderColor:CL.go,background:`linear-gradient(145deg, ${CL.c1}, #1a1a2e)`}}>
              <div style={{textAlign:"center",padding:"10px 0"}}>
                <div style={{fontSize:11,color:CL.go,letterSpacing:3,fontWeight:600,marginBottom:4}}>FAMILY WEALTH COMMAND CENTER</div>
                <div style={{fontSize:20,fontWeight:800,color:CL.wh,marginBottom:6}}>Complete Estate Management Platform</div>
                <div style={{fontSize:11,color:CL.dm,maxWidth:600,margin:"0 auto",lineHeight:1.8}}>Private Irrevocable Trust administration, §508(c)(1)(A) Foundation operations, AI-powered strategic advisory, auto-generated legal documents, real-time compliance monitoring, and full financial tracking.</div>
              </div>
            </Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
              {[{key:"trust",title:"Trust Only",color:CL.go,items:["Private Irrevocable Trust Formation","Complete Document Suite","Demand Note Engine","Asset Registry & COA System","Form 1041 Auto-Generator","LLC Management & K-1 Tracking","Banking & Commingling Prevention","AI Strategic Advisor","Compliance & Audit Trail","Meeting Minutes Auto-Generation","Beneficiary Reports & Succession","Portfolio, Real Estate & Debt Mgmt"]},
                {key:"pma",title:"§508(c)(1)(A) Only",color:CL.bl,items:["§508(c)(1)(A) Foundation Formation","Articles of Association & Bylaws","Donation Certificate Generator","60% AGI Limit Tracking","Mission Bucket Allocation","Member Management & Certificates","Annual Meeting Minutes","Annual Report Generator","Foundation COA System","AI Strategic Advisor","Document Vault & Compliance","Audit Trail"]},
                {key:"both",title:"Trust + Foundation",color:CL.gr,items:["Everything in Trust Only","Everything in §508(c)(1)(A) Only","Trust-PMA Agreement (auto-generated)","Dual-Entity Financial Flow","Cross-Entity Compliance","Combined Tax Optimization","Active to Passive Income Conversion","Full Personal Tax Integration","Tax Savings Dashboard","Investment Direction Engine","Complete Operations Manual","Priority AI Strategic Advisor"]}
              ].map(plan=><Card key={plan.key} style={{borderColor:(D.clientProfile?.clientType||"both")===plan.key?plan.color:CL.bd}}>
                <div style={{textAlign:"center",marginBottom:12}}>
                  <div style={{fontSize:15,fontWeight:700,color:plan.color}}>{plan.title}</div>
                  {(D.clientProfile?.clientType||"both")===plan.key&&<div style={{background:`${plan.color}20`,borderRadius:6,padding:"3px 8px",marginTop:6,fontSize:9,fontWeight:700,color:plan.color,display:"inline-block"}}>ACTIVE PLAN</div>}
                </div>
                <div style={{borderTop:`1px solid ${CL.bd}`,paddingTop:10}}>
                  {plan.items.map((item,i)=><div key={i} style={{fontSize:10,color:CL.tx,padding:"3px 0",display:"flex",alignItems:"flex-start",gap:6}}>
                    <span style={{color:CL.gr,fontSize:11,lineHeight:1,flexShrink:0}}>✓</span>
                    <span>{item}</span>
                  </div>)}
                </div>
              </Card>)}
            </div>
          </Sec>
        </>}

        {/* SETTINGS */}
        {tab==="settings"&&<>
          <Sec title="Client"><Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Inp label="Name" value={D.meta.clientName} onChange={v=>upd("meta.clientName",v)}/><Inp label="Email" value={D.meta.clientEmail} onChange={v=>upd("meta.clientEmail",v)}/><Inp label="Deploy ID" value={D.meta.deployId} onChange={()=>{}} disabled/>
          </div></Card></Sec>
          <Sec title="Dates"><Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
            <Inp label="Last Reconciliation" value={D.settings.lastRecon} onChange={v=>upd("settings.lastRecon",v)} type="date"/><Inp label="Last Meeting" value={D.settings.lastMinutes} onChange={v=>upd("settings.lastMinutes",v)} type="date"/><Inp label="Last Annual" value={D.settings.lastAnnual} onChange={v=>upd("settings.lastAnnual",v)} type="date"/><Inp label="Tax Year" value={D.taxData.year} onChange={v=>upd("taxData.year",v)}/>
          </div></Card></Sec>
          <Sec title="Data"><div style={{display:"flex",gap:8}}>
            <Btn v="ghost" onClick={()=>{const j=JSON.stringify(D,null,2);const b=new Blob([j],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`family-v4-${today()}.json`;a.click();}}>Export</Btn>
            <Btn v="ghost" onClick={()=>{const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=e=>{const file=e.target.files[0];if(file){const r=new FileReader();r.onload=ev=>{try{setD(JSON.parse(ev.target.result));}catch{alert("Invalid");}};r.readAsText(file);}};input.click();}}>Import</Btn>
            <Btn v="danger" onClick={()=>{if(confirm("Reset ALL?")){setD(init());}}}>Reset</Btn>
          </div></Sec>
        </>}

      </main>
    </div>
  </div>);
}
