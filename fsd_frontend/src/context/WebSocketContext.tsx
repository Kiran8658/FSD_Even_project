import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { DashboardStats } from '../types/dashboard'
import { useAuth } from './AuthContext'

type WebSocketContextValue = {
  dashboardStats: DashboardStats | null
  isConnected: boolean
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined)

const WS_URL = 'http://localhost:8080/ws'
const DASHBOARD_TOPIC = '/topic/dashboard'

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setDashboardStats(null)
      setIsConnected(false)
      clientRef.current?.deactivate()
      clientRef.current = null
      return
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {
        // Keep logs low-noise; enable if you need it.
      }
    })

    client.onConnect = () => {
      setIsConnected(true)

      client.subscribe(DASHBOARD_TOPIC, (message) => {
        try {
          const parsed = JSON.parse(message.body) as DashboardStats
          if (!parsed) return
          setDashboardStats(parsed)
        } catch {
          // ignore malformed payloads
        }
      })
    }

    client.onDisconnect = () => {
      setIsConnected(false)
    }

    client.onWebSocketClose = () => {
      setIsConnected(false)
    }

    client.onStompError = () => {
      // Broker reported an error; reconnectDelay handles retry.
      setIsConnected(false)
    }

    clientRef.current = client
    client.activate()

    return () => {
      setIsConnected(false)
      client.deactivate()
      clientRef.current = null
    }
  }, [isAuthenticated])

  const value = useMemo(
    () => ({
      dashboardStats,
      isConnected
    }),
    [dashboardStats, isConnected]
  )

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext)
  if (!ctx) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return ctx
}
