import type { WebSocketIndex } from './constants';
import type { PassionData } from './data';
import { generateUniqueName } from './internal/random_id';
import { WSClient } from './internal/ws_client';
import type { SubSystem } from './subsystem';

export type SocketResponseType = 'connected' | 'disconnected' | 'error' | 'message';
export type OnServerResponse = (socketIndex: WebSocketIndex, responseType: SocketResponseType, data?: any) => void;

export interface INetwork {
  connect(address: string, responseCallback: OnServerResponse): WebSocketIndex;
  close(socket: WebSocketIndex): void;
  send(socket: WebSocketIndex, data: string | Object): boolean;
}

export class Network implements INetwork, SubSystem {
    private data: PassionData;

    constructor(data: PassionData) {
      this.data = data;
    }
    
    connect(address: string, responseCallback: OnServerResponse): WebSocketIndex {
      const id = generateUniqueName('ws') as WebSocketIndex;

      const socket = new WSClient(address);
      this.data.sockets.set(id, socket);
      
      socket.onOpen(() => {
        responseCallback(id, 'connected');
      });
      socket.onClose(() => {
        responseCallback(id, 'disconnected');
      });
      socket.onError(err => {
        responseCallback(id, 'error', err);
      });
      socket.onMessage(data => {
        responseCallback(id, 'message', data);
      });
      return id;
    }

    close(socket: WebSocketIndex) {
      this.data.sockets.get(socket)?.close();
      this.data.sockets.delete(socket);
    }

    send(socket: WebSocketIndex, data: string | Object): boolean {
      try {
        const payload = typeof data === 'string' ? data : JSON.stringify(data);
        this.data.sockets.get(socket)?.send(payload);
        return true;
      } catch {
        return false;
      }
    }

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}
}