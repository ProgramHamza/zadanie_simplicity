import { Server as HttpServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'

let wsServer: WebSocketServer | null = null

export function setupWebSocket(server: HttpServer) {
  wsServer = new WebSocketServer({ server, path: '/ws' })

  wsServer.on('connection', (socket) => {
    socket.send(JSON.stringify({ event: 'connected', data: { message: 'WebSocket connected' } }))
  })
}

export function broadcastAnnouncementCreated(announcement: unknown) {
  if (!wsServer) {
    return
  }

  const payload = JSON.stringify({
    event: 'announcement.created',
    data: announcement,
  })

  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload)
    }
  })
}
