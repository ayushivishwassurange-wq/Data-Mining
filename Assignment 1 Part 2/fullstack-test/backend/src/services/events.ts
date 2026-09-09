import { Response } from 'express';

interface Client {
  id: string;
  res: Response;
}

class EventManager {
  private clients: Client[] = [];

  addClient(id: string, res: Response) {
    this.clients.push({ id, res });
    
    // Send initial ping
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId: id, timestamp: new Date().toISOString() })}\n\n`);

    // Remove client on connection close
    res.on('close', () => {
      this.clients = this.clients.filter(c => c.id !== id);
    });
  }

  broadcast(eventType: string, payload: unknown) {
    const data = JSON.stringify({ type: eventType, payload, timestamp: new Date().toISOString() });
    for (const client of this.clients) {
      try {
        client.res.write(`data: ${data}\n\n`);
      } catch (err) {
        console.error(`Error sending SSE to client ${client.id}:`, err);
      }
    }
  }

  getClientCount(): number {
    return this.clients.length;
  }
}

export const eventManager = new EventManager();
