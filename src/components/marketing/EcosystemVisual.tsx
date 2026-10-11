import { motion, useReducedMotion } from 'motion/react'

const nodes = [
  { id: 'discover', x: 92, y: 65, label: 'Discover', icon: '↗' },
  { id: 'build', x: 255, y: 43, label: 'Build', icon: '<>' },
  { id: 'learn', x: 321, y: 184, label: 'Learn', icon: '↗' },
  { id: 'share', x: 185, y: 254, label: 'Share', icon: '＋' },
  { id: 'practice', x: 48, y: 188, label: 'Practice', icon: '⌘' },
]

export function EcosystemVisual() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      aria-label="Illustration of connected paths between discovering, building, practicing, learning, and sharing"
      className="ecosystem-visual"
      role="img"
    >
      <div className="visual-orb visual-orb-one" />
      <div className="visual-orb visual-orb-two" />
      <svg
        aria-hidden="true"
        className="ecosystem-lines"
        fill="none"
        viewBox="0 0 370 310"
      >
        <path d="M92 65 255 43 321 184 185 254 48 188 92 65" />
        <path d="m92 65 93 189M255 43 48 188m273-4L92 65" />
        <circle cx="185" cy="152" r="76" />
        <circle cx="185" cy="152" r="112" />
      </svg>
      {nodes.map((node, index) => (
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : { y: [0, index % 2 ? -5 : 5, 0] }
          }
          className={`ecosystem-node ecosystem-node-${node.id}`}
          key={node.id}
          style={{ left: `${(node.x / 370) * 100}%`, top: `${(node.y / 310) * 100}%` }}
          transition={{
            duration: 4 + index * 0.35,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <span aria-hidden="true" className="ecosystem-node-icon">
            {node.icon}
          </span>
          <span>{node.label}</span>
        </motion.div>
      ))}
      <div className="ecosystem-core">
        <span className="ecosystem-core-mark">{'{ }'}</span>
        <span>DEV BYTE</span>
        <small>Ideas move further together.</small>
      </div>
      <div aria-hidden="true" className="visual-caption">
        <span className="visual-caption-dot" />
        Many paths. One community.
      </div>
    </div>
  )
}
