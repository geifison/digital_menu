import React, { useState, useEffect } from 'react'

interface OrderTimerProps {
  createdAt: string
  status: string
}

const OrderTimer: React.FC<OrderTimerProps> = ({ createdAt, status }) => {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (status === 'Finalizado' || !createdAt) {
      setElapsedTime(0)
      return
    }
    
    const calculateTime = () => {
      const now = new Date()
      const start = new Date(createdAt)
      const diff = Math.floor((now.getTime() - start.getTime()) / 1000)
      setElapsedTime(diff > 0 ? diff : 0)
    }
    
    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [createdAt, status])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  return <span className="font-mono text-sm font-semibold">{formatTime(elapsedTime)}</span>
}

export default OrderTimer