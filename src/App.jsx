import { useEffect, useState } from 'react'
import './App.css'
import {
  IconHome, IconLayers, IconActivity, IconBell, IconHelp, IconChevronDown,
  IconUpload, IconCheck, IconX, IconScan, IconTerminal, IconShield,
  IconFileText, IconImage, IconDot, IconSeal,
} from './icons'

function App() {
  const [activeView, setActiveView] = useState('Overview')
  const [isRunning, setIsRunning] = useState(false)
  const [query, setQuery] = useState('Investigate the abnormal vibration trend on CDU-04 and recommend next steps.')
  const [agentResult, setAgentResult] = useState(null)
  const [activityLog, setActivityLog] = useState([])
  const [backendOnline, setBackendOnline] = useState(null)

  const [ocrFile, setOcrFile] = useState(null)
  const [ocrRunning, setOcrRunning] = useState(false)
  const [ocrResult, setOcrResult] = useState(null)

  const [sandboxRunning, setSandboxRunning] = useState(false)
  const [sandboxResult, setSandboxResult] = useState(null)

  useEffect(() => {
    fetch('/api/health').then((response) => setBackendOnline(response.ok)).catch(() => setBackendOnline(false))
  }, [])

  const runAgent = () => {
    setIsRunning(true)
    fetch('/api/route', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: query }) })
      .then((response) => { if (!response.ok) throw new Error('Backend unavailable'); return response.json() })
      .then((result) => { setAgentResult(result); setBackendOnline(true); return fetch('/api/activity') })
      .then((response) => response.ok ? response.json() : [])
      .then((log) => setActivityLog(log))
      .catch(() => { setBackendOnline(false); setAgentResult({ model: 'reasoning-model', reason: 'static demo mode: backend is not running' }) })
      .finally(() => window.setTimeout(() => setIsRunning(false), 700))
  }

  const openRuns = () => {
    setActiveView('Runs')
    fetch('/api/activity').then((response) => response.ok ? response.json() : []).then(setActivityLog).catch(() => {})
  }

  const runOcrDemo = () => {
    if (!ocrFile) return
    setOcrRunning(true)
    setOcrResult(null)
    const body = new FormData()
    body.append('image', ocrFile)
    fetch('/api/ocr/approval-note', { method: 'POST', body })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).detail || 'OCR failed')
        return response.blob()
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        setOcrResult({ ok: true, url })
      })
      .catch((error) => setOcrResult({ ok: false, message: error.message }))
      .finally(() => setOcrRunning(false))
  }

  const runSandboxDemo = () => {
    setSandboxRunning(true)
    setSandboxResult(null)
    fetch('/api/sandbox/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      .then((response) => response.json())
      .then((result) => setSandboxResult(result))
      .catch(() => setSandboxResult({ status: 'unavailable', stdout: '', stderr: 'Backend unreachable' }))
      .finally(() => setSandboxRunning(false))
  }

  const navItems = [
    ['Overview', IconHome],
    ['Evidence', IconLayers],
    ['Runs', IconActivity],
  ]
  const activities = [
    [IconActivity, 'CDU-04 vibration anomaly', 'Completed · 8 min ago', '4 agents'],
    [IconFileText, 'Compressor train B inspection', 'Completed · yesterday', '3 agents'],
    [IconShield, 'Permit-to-work risk review', 'Completed · 2 days ago', '5 agents'],
  ]
  const evidence = [
    ['CDU-04 vibration trend report.pdf', 'Sample source, not indexed', IconFileText],
    ['M-204 maintenance history.csv', 'Sample source, not indexed', IconFileText],
    ['Process Safety Management Manual', 'Sample source, not indexed', IconFileText],
    ['Inspection image · CDU-04 bearing', 'Visual evidence · 4.2 MB', IconImage],
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><IconSeal width={17} height={17} /></span>
          <span className="brand-text"><b>FORGEE</b><small>Sovereign AI Workbench</small></span>
        </div>
        <div className="workspace-label">Private workspace</div>
        <div className="site-select"><IconDot className="status-dot" /> Mangalore Refinery <IconChevronDown className="chevron" width={14} height={14} /></div>
        <nav>
          {navItems.map(([label, Icon]) => (
            <button key={label} className={activeView === label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView(label)}>
              <Icon width={17} height={17} /><span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="workspace-label">System status</div>
          <div className="system-status"><IconDot className={backendOnline ? 'dot-live' : 'dot-static'} /> {backendOnline ? 'Backend connected · live mode' : 'Backend offline · static demo'}</div>
          <div className="sovereign-note">
            <IconShield width={16} height={16} />
            <div><b>Sovereign mode</b><small>Air-gapped · data stays local</small></div>
          </div>
          <div className="profile">
            <span className="avatar">AS</span>
            <div><b>Arun S.</b><small>Process Engineering</small></div>
            <span className="more">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><span className="eyebrow">Operations intelligence</span><h1>{activeView === 'Overview' ? 'Good morning, Arun' : activeView}</h1></div>
          <div className="top-actions">
            <span className={backendOnline ? 'secure-pill mode-live' : 'secure-pill mode-static'}>
              <IconDot /> {backendOnline ? 'LIVE BACKEND' : 'STATIC DEMO'}
            </span>
            <button className="icon-button" aria-label="Notifications"><IconBell width={16} height={16} /><em>2</em></button>
            <button className="help-button" aria-label="Help"><IconHelp width={16} height={16} /></button>
          </div>
        </header>

        {activeView === 'Overview' && <>
          <section className="hero-row">
            <h2>What would you like to<br /><span>investigate?</span></h2>
            <p>Ask the workbench. Your agents reason over approved site data and show their evidence — nothing leaves this machine.</p>
            <div className="flow-strip">
              <div className="flow-node"><span className="flow-dot"><IconTerminal width={16} height={16} /></span><span className="flow-label">Your task</span></div>
              <div className="flow-line" />
              <div className="flow-node"><span className="flow-dot"><IconActivity width={16} height={16} /></span><span className="flow-label">Router picks a local model</span></div>
              <div className="flow-line" />
              <div className="flow-node"><span className="flow-dot"><IconLayers width={16} height={16} /></span><span className="flow-label">Agent works</span></div>
              <div className="flow-line" />
              <div className="flow-node flow-end"><span className="flow-dot"><IconSeal width={17} height={17} /></span><span className="flow-label">Verified output</span></div>
            </div>
          </section>

          <section className="command-box">
            <div className="command-top">
              <span className="command-label">Ask the workbench</span>
              <span className="privacy-tag">Private by default</span>
            </div>
            <textarea value={query} onChange={(event) => setQuery(event.target.value)} />
            <div className="command-footer">
              <div className="context-chips"><span>Sample workspace</span><span>Process safety</span></div>
              <button className="run-button" onClick={runAgent} disabled={isRunning}>
                {isRunning ? 'Agents working…' : 'Run investigation'}
              </button>
            </div>
            {agentResult && (
              <div className="agent-result">
                <IconSeal className="result-seal" width={17} height={17} />
                <div><b>Routed to {agentResult.model}</b><small>{agentResult.reason}</small></div>
              </div>
            )}
          </section>

          <section className="lower-grid">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="panel-title-icon"><IconScan width={16} height={16} /></span>
                  <div><span className="tier-badge">Tier 1 · real</span><h3>OCR → Approval note</h3></div>
                </div>
              </div>
              <p className="panel-desc">Upload a scanned inspection image. Runs on-device OCR and generates a real .docx locally.</p>
              <div className="file-input-row">
                <IconUpload width={16} height={16} style={{ color: 'var(--ink-faint)' }} />
                <input type="file" accept="image/png,image/jpeg" onChange={(event) => setOcrFile(event.target.files?.[0] || null)} />
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="run-button" onClick={runOcrDemo} disabled={!ocrFile || ocrRunning}>{ocrRunning ? 'Processing…' : 'Run OCR demo'}</button>
              </div>
              {ocrResult && ocrResult.ok && (
                <div className="agent-result">
                  <IconSeal className="result-seal" width={17} height={17} />
                  <div><b>Approval note generated locally</b><small><a href={ocrResult.url} download="approval-note.docx">Download the .docx</a></small></div>
                </div>
              )}
              {ocrResult && !ocrResult.ok && (
                <div className="agent-result is-error">
                  <IconX className="result-seal" width={17} height={17} />
                  <div><b>OCR failed</b><small>{ocrResult.message}</small></div>
                </div>
              )}
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="panel-title-icon"><IconTerminal width={16} height={16} /></span>
                  <div><span className="tier-badge">Tier 1 · real</span><h3>Sandboxed execution</h3></div>
                </div>
              </div>
              <p className="panel-desc">Runs the demo threshold-check script inside a locked-down, network-isolated container.</p>
              <button className="run-button" onClick={runSandboxDemo} disabled={sandboxRunning}>{sandboxRunning ? 'Running in sandbox…' : 'Run sandbox demo'}</button>
              {sandboxResult && (
                <div className={sandboxResult.status === 'completed' ? 'agent-result' : 'agent-result is-error'}>
                  {sandboxResult.status === 'completed' ? <IconSeal className="result-seal" width={17} height={17} /> : <IconX className="result-seal" width={17} height={17} />}
                  <div><b>{sandboxResult.status}</b><small><pre>{sandboxResult.stdout || sandboxResult.stderr}</pre></small></div>
                </div>
              )}
            </div>
          </section>

          <section className="stats-row">
            <div className="stat"><span className="stat-icon"><IconLayers width={15} height={15} /></span><div><small>LOCAL KNOWLEDGE (SAMPLE)</small><b>2,481 <span>documents indexed</span></b></div></div>
            <div className="stat"><span className="stat-icon"><IconActivity width={15} height={15} /></span><div><small>AGENT RUNS (SAMPLE)</small><b>38 <span>this month</span></b></div></div>
            <div className="stat"><span className="stat-icon"><IconShield width={15} height={15} /></span><div><small>AVG. TIME SAVED (SAMPLE)</small><b>3.2h <span>per investigation</span></b></div></div>
          </section>

          <section className="lower-grid">
            <div className="panel activity-panel">
              <div className="panel-header"><div><span className="eyebrow">Recent activity</span><h3>Investigation runs</h3></div><button className="text-button" onClick={openRuns}>View all →</button></div>
              {(activityLog.length ? activityLog.slice(-3).map((item) => [IconActivity, item.model, item.reason, 'local']) : activities).map(([Icon, title, sub, count]) => (
                <div className="activity-item" key={title + sub}>
                  <span className="activity-symbol"><Icon width={15} height={15} /></span>
                  <div><b>{title}</b><small>{sub}</small></div>
                  <span className="agent-count">{count}</span>
                </div>
              ))}
            </div>
            <div className="panel posture-panel">
              <div className="panel-header"><div><span className="eyebrow">Site posture (sample)</span><h3>Operational confidence</h3></div><span className="sample-tag"><IconDot width={6} height={6} /> Sample</span></div>
              <div className="confidence"><div className="confidence-number">94<span>%</span></div><div><b>Illustrative only</b><p>Not computed from live data yet</p></div></div>
              <div className="bar"><i /></div>
              <div className="posture-foot"><span>Roadmap: real posture scoring</span><button className="text-button" onClick={openRuns}>View signals →</button></div>
            </div>
          </section>
        </>}

        {activeView === 'Evidence' && (
          <section className="view-panel">
            <div className="panel-header"><div><span className="eyebrow">Local knowledge (sample data)</span><h2>Evidence library</h2></div><button className="run-button">+ Add source</button></div>
            {evidence.map(([name, sub, Icon]) => (
              <div className="evidence-row" key={name}>
                <span className="file-icon"><Icon width={17} height={17} /></span>
                <div><b>{name}</b><small>{sub}</small></div>
                <span className="sample-tag">Sample</span>
              </div>
            ))}
          </section>
        )}

        {activeView === 'Runs' && (
          <section className="view-panel">
            <div className="panel-header"><div><span className="eyebrow">Audit trail</span><h2>Investigation runs</h2></div><span className="secure-pill"><IconDot /> {activityLog.length} LIVE RUNS THIS SESSION</span></div>
            {activityLog.slice().reverse().map((item, index) => (
              <div className="run-detail" key={item.timestamp || index}>
                <div className="run-detail-icon"><IconActivity width={16} height={16} /></div>
                <div><h3>{item.reason}</h3><p>{item.model} · {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}</p></div>
                <span className="completed"><IconCheck width={11} height={11} /> Completed</span>
              </div>
            ))}
            {!activityLog.length && <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>No live runs yet this session — use "Run investigation" on Overview to generate one.</p>}
            <div className="result-box">
              <span className="eyebrow">Synthesis</span>
              <p>Trend deviation is most consistent with early bearing wear. Recommend a controlled inspection during the next planned window.</p>
            </div>
          </section>
        )}

        <footer>
          <span className="footer-status"><IconDot style={{ color: 'var(--teal)' }} /> Running on <b>MRPL On-Prem Cluster</b></span>
          <span>v0.9.0 · No external calls</span>
        </footer>
      </main>
    </div>
  )
}

export default App
