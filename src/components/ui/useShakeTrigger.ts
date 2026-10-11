import React from 'react'

export function useShakeTrigger() {
  const [trigger, setTrigger] = React.useState(0)
  const shake = React.useCallback(() => setTrigger((t) => t + 1), [])
  return { trigger, shake }
}