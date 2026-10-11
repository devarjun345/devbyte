import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, Card } from '../components/ui'
import { FeaturePage } from '../components/features/FeatureUI'
import { getMentorDemoReply } from './phase6-demo-data'

type ChatMessage = {
  id: number
  role: 'assistant' | 'user'
  text: string
}

const suggestedPrompts = [
  'Help me make a career plan',
  'How should I prepare for DSA?',
  'Can you review my portfolio structure?',
  'Help me practice for an interview',
]

export function AIMentorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const nextId = useRef(1)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const conversationEndRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' })
  }, [messages, typing, reduceMotion])

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || typing) return
    setMessages((current) => [...current, { id: nextId.current++, role: 'user', text }])
    setDraft('')
    setTyping(true)
    timer.current = setTimeout(() => {
      setMessages((current) => [...current, { id: nextId.current++, role: 'assistant', text: getMentorDemoReply(text) }])
      setTyping(false)
      timer.current = null
    }, 420)
  }

  function clearConversation() {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    setTyping(false)
    setMessages([])
    setDraft('')
    composerRef.current?.focus()
  }

  return (
    <FeaturePage description="Use a guided prompt to think through a learning goal, a project question, or your next step. Responses in this interface are fixed examples, not AI-generated advice." eyebrow="GROW · GUIDED PRACTICE" title="AI Mentor">
      <div className="ai-mentor-demo-banner" role="note">
        <span aria-hidden="true">i</span>
        <p><strong>Demo mode — no AI service is connected.</strong> Messages stay in this temporary page state. Any reply is an illustrative canned response; do not rely on it as personalized guidance.</p>
      </div>
      <Card className="ai-chat-card">
        <header className="ai-chat-header">
          <div className="ai-chat-identity"><span aria-hidden="true" className="ai-chat-mark">DB</span><div><strong>DevByte Mentor</strong><small>Illustrative chat preview · not an AI connection</small></div></div>
          <Button disabled={messages.length === 0 && !typing} onClick={clearConversation} variant="ghost">Clear conversation</Button>
        </header>
        <div aria-label="Demo conversation" aria-live="polite" className="ai-chat-history" role="log">
          {messages.length === 0 && <motion.div className="ai-chat-empty" initial={reduceMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}>
            <span aria-hidden="true" className="ai-chat-empty-symbol">?</span>
            <h2>What would you like to work through?</h2>
            <p>Choose a suggested starting point or write your own question. Replies are static examples for demonstrating the chat UI.</p>
            <div className="ai-suggested-prompts" aria-label="Suggested demo prompts">
              {suggestedPrompts.map((prompt) => <button key={prompt} onClick={() => { setDraft(prompt); composerRef.current?.focus() }} type="button">{prompt}<span aria-hidden="true">↗</span></button>)}
            </div>
          </motion.div>}
          <AnimatePresence initial={false}>
            {messages.map((message) => <motion.article className={`ai-chat-message message-${message.role}`} key={message.id} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
              <span aria-hidden="true" className="ai-message-avatar">{message.role === 'assistant' ? 'DB' : 'YOU'}</span>
              <div className="ai-message-content"><div><strong>{message.role === 'assistant' ? 'Sample response' : 'Your prompt'}</strong>{message.role === 'assistant' && <span>Illustrative · canned</span>}</div><p>{message.text}</p></div>
            </motion.article>)}
          </AnimatePresence>
          {typing && <div className="ai-chat-typing" role="status"><span aria-hidden="true" className="ai-message-avatar">DB</span><span>Preparing a sample response</span><span className="ai-typing-dots" aria-hidden="true"><i /><i /><i /></span></div>}
          <div ref={conversationEndRef} />
        </div>
        {messages.length > 0 && !typing && <div className="ai-chat-followups" aria-label="Suggested prompts">{suggestedPrompts.map((prompt) => <button key={prompt} onClick={() => { setDraft(prompt); composerRef.current?.focus() }} type="button">{prompt}</button>)}</div>}
        <form className="ai-chat-composer" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="ai-mentor-message">Write a message for the demo chat</label>
          <textarea id="ai-mentor-message" maxLength={1000} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} placeholder="Write a prompt… (Enter to send, Shift+Enter for a new line)" ref={composerRef} rows={2} value={draft} />
          <div className="ai-chat-composer-footer"><span>{draft.length}/1000 · temporary local demo</span><Button disabled={!draft.trim() || typing} type="submit">{typing ? 'Preparing…' : 'Send prompt'} <span aria-hidden="true">↑</span></Button></div>
        </form>
      </Card>
    </FeaturePage>
  )
}
