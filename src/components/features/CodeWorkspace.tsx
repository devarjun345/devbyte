import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState, type ChangeEvent } from 'react'
import { Button } from '../ui'
import { SectionTitle, StatusNotice } from './FeatureUI'

type WorkspaceTab = 'Description' | 'Examples' | 'Submissions'

interface CodeWorkspaceProps {
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  examples: { input: string; output: string; explanation: string }[]
  constraints: string[]
  starterCode: Record<string, string>
  topics: string[]
}

export function CodeWorkspace({
  title,
  difficulty,
  description,
  examples,
  constraints,
  starterCode,
  topics,
}: CodeWorkspaceProps) {
  const [language, setLanguage] = useState('TypeScript')
  const [code, setCode] = useState(starterCode.TypeScript)
  const [tab, setTab] = useState<WorkspaceTab>('Description')
  const [terminalVisible, setTerminalVisible] = useState(true)
  const [terminalHeight, setTerminalHeight] = useState(180)
  const [runPreview, setRunPreview] = useState(false)
  const [submissionPreview, setSubmissionPreview] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const reduceMotion = useReducedMotion()

  function changeLanguage(value: string) {
    setLanguage(value)
    setCode(starterCode[value] ?? '')
    setRunPreview(false)
    setSubmissionPreview(false)
  }

  async function copySampleCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopyMessage('Starter sample copied to the clipboard.')
    } catch {
      setCopyMessage('Clipboard access is unavailable. Select the editor text and copy it manually.')
    }
  }

  function handleTerminalResize(event: React.MouseEvent) {
    event.preventDefault()
    const startY = event.clientY
    const startHeight = terminalHeight

    function onMouseMove(moveEvent: MouseEvent) {
      const delta = startY - moveEvent.clientY
      const newHeight = Math.max(100, Math.min(400, startHeight + delta))
      setTerminalHeight(newHeight)
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="code-workspace">
      <section aria-label="Challenge information" className="code-workspace-problem">
        <div className="code-workspace-problem-header">
          <div>
            <p className="feature-eyebrow">CHALLENGE BRIEF · SAMPLE</p>
            <h2>{title}</h2>
          </div>
          <span className={`arena-difficulty difficulty-${difficulty.toLowerCase()}`}>{difficulty}</span>
        </div>
        <div className="code-workspace-topics">
          {topics.map((topic) => <span key={topic} className="feature-tag">{topic}</span>)}
        </div>
        <div aria-label="Challenge sections" className="arena-tabs" role="tablist" onKeyDown={(event) => {
          const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
          const current = tabs.indexOf(document.activeElement as HTMLButtonElement)
          let next = current
          if (event.key === 'ArrowRight') next = (current + 1) % tabs.length
          else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length
          else if (event.key === 'Home') next = 0
          else if (event.key === 'End') next = tabs.length - 1
          else return
          event.preventDefault()
          tabs[next]?.focus()
          const nextTab = tabs[next]?.textContent as WorkspaceTab | undefined
          if (nextTab) setTab(nextTab)
        }}>
          {(['Description', 'Examples', 'Submissions'] as WorkspaceTab[]).map((item) => (
            <button
              aria-controls={`panel-${item.toLowerCase()}`}
              aria-selected={tab === item}
              className={tab === item ? 'is-active' : ''}
              id={`tab-${item.toLowerCase()}`}
              key={item}
              onClick={() => setTab(item)}
              role="tab"
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            aria-labelledby={`tab-${tab.toLowerCase()}`}
            className="code-workspace-tab-panel"
            id={`panel-${tab.toLowerCase()}`}
            key={tab}
            role="tabpanel"
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: reduceMotion ? 0 : 0.16 }}
          >
            {tab === 'Description' && (
              <>
                <p className="arena-problem-description">{description}</p>
                <SectionTitle eyebrow="INPUT & OUTPUT" title="Examples" />
                <div className="arena-example-list">
                  {examples.slice(0, 1).map((example) => (
                    <div className="arena-example" key={example.input}>
                      <p><strong>Input</strong><code>{example.input}</code></p>
                      <p><strong>Output</strong><code>{example.output}</code></p>
                      <small>{example.explanation}</small>
                    </div>
                  ))}
                </div>
                <SectionTitle eyebrow="LIMITS TO CONSIDER" title="Constraints" />
                <ul className="feature-bullet-list">
                  {constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}
                </ul>
              </>
            )}
            {tab === 'Examples' && (
              <div className="arena-example-list">
                {examples.map((example, index) => (
                  <div className="arena-example" key={example.input}>
                    <strong>Sample case {index + 1} · illustrative</strong>
                    <p><span>Input</span><code>{example.input}</code></p>
                    <p><span>Output</span><code>{example.output}</code></p>
                    <small>{example.explanation}</small>
                  </div>
                ))}
              </div>
            )}
            {tab === 'Submissions' && (
              <div className="arena-tab-panel">
                <StatusNotice title="No submissions in preview">
                  This demo workspace has no saved submissions or connected account. Preview actions are not recorded.
                </StatusNotice>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <section aria-label="Code editor workspace" className="code-workspace-editor">
        <div className="code-workspace-editor-header">
          <div className="code-workspace-toolbar">
            <label className="code-workspace-language-select">
              Language
              <select
                aria-label="Programming language"
                onChange={(event) => changeLanguage(event.target.value)}
                value={language}
              >
                <option>TypeScript</option>
                <option>JavaScript</option>
                <option>Python</option>
              </select>
            </label>
            <Button onClick={() => void copySampleCode()} variant="ghost">Copy starter</Button>
          </div>
          {copyMessage && <p className="arena-copy-message" role="status">{copyMessage}</p>}
        </div>

        <div className="code-workspace-editor-main">
          <label className="arena-editor-label" htmlFor="arena-code-editor">Code editor · {language}</label>
          <div className="code-workspace-code-frame">
            <span aria-hidden="true" className="arena-line-numbers">
              {code.split('\n').map((_, index) => index + 1).join('\n')}
            </span>
            <textarea
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="arena-code-editor"
              id="arena-code-editor"
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                setCode(event.target.value)
                setRunPreview(false)
                setSubmissionPreview(false)
              }}
              spellCheck={false}
              value={code}
            />
          </div>

          <div className="code-workspace-terminal-resizer" onMouseDown={handleTerminalResize} role="separator" aria-label="Resize terminal" tabIndex={0} onKeyDown={(e) => {
            if (e.key === 'ArrowUp') setTerminalHeight((h) => Math.min(400, h + 10))
            else if (e.key === 'ArrowDown') setTerminalHeight((h) => Math.max(100, h - 10))
          }}>
            <span className="code-workspace-resizer-handle" aria-hidden="true" />
          </div>

          <div className="code-workspace-terminal" style={{ height: terminalHeight }} role="region" aria-label="Terminal output">
            <div className="code-workspace-terminal-header">
              <span>TERMINAL</span>
              <button
                className="code-workspace-terminal-toggle"
                onClick={() => setTerminalVisible((v) => !v)}
                aria-label={terminalVisible ? 'Collapse terminal' : 'Expand terminal'}
                type="button"
              >
                {terminalVisible ? '⌄' : '⌃'}
              </button>
            </div>
            {terminalVisible && (
              <div className="code-workspace-terminal-content">
                {runPreview && (
                  <StatusNotice title="Illustrative test preview">
                    No code was executed. Sample result: 2 example cases listed; output was not evaluated.
                  </StatusNotice>
                )}
                {submissionPreview && (
                  <StatusNotice title="Submission preview only">
                    No code was submitted or saved. There is no execution service or connected account.
                  </StatusNotice>
                )}
                {!runPreview && !submissionPreview && (
                  <div className="code-workspace-terminal-placeholder">
                    <p>Run sample preview or Submit preview to see illustrative output.</p>
                    <p className="code-workspace-terminal-hint">Drag the divider above to resize. Use ↑/↓ keys when focused.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="arena-editor-note">This lightweight editor is for drafting only; syntax highlighting and code execution are not connected.</p>
        <div className="arena-run-actions">
          <Button onClick={() => { setRunPreview(true); setSubmissionPreview(false) }} variant="outline">Run sample preview</Button>
          <Button onClick={() => { setSubmissionPreview(true); setRunPreview(false) }}>Submit preview</Button>
        </div>
      </section>
    </div>
  )
}