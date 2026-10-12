import { ArrowRight, BriefcaseBusiness } from 'lucide-react'

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-art">
        <div className="auth-brand"><span className="brand-mark"><BriefcaseBusiness size={19} /></span>daymark</div>
        <div className="art-copy"><span className="eyebrow">A LITTLE MORE CLARITY</span><h1>Your next chapter<br />starts <em>somewhere.</em></h1><p>Keep every opportunity, conversation, and next step in one calm place.</p></div>
        <div className="art-foot"><span>01 / 03</span><span className="art-line" /><span>MAKE ROOM FOR WHAT'S NEXT</span></div>
        <div className="art-stamp"><ArrowRight size={24} /></div>
      </div>
      <main className="auth-main"><div className="auth-form-wrap">{children}</div></main>
    </div>
  )
}