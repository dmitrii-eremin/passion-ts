import type { WebSocketIndex } from './constants';
import type { PassionData } from './data';
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
      const socketIndex: WebSocketIndex = this.data.sockets.length;

      const socket = new WSClient(address);
      this.data.sockets.push(socket);
      
      socket.onOpen(() => {
        responseCallback(socketIndex, 'connected');
      });
      socket.onClose(() => {
        responseCallback(socketIndex, 'disconnected');
      });
      socket.onError(err => {
        responseCallback(socketIndex, 'error', err);
      });
      socket.onMessage(data => {
        responseCallback(socketIndex, 'message', data);
      });
      return socketIndex;
    }

    close(socket: WebSocketIndex) {
      if (socket >= 0 && socket < this.data.sockets.length) {
        this.data.sockets[socket].close();
      }
    }

    send(socket: WebSocketIndex, data: string | Object): boolean {
      try {
      if (socket < 0 || socket >= this.data.sockets.length) {
        return false;
      }
      const payload = typeof data === 'string' ? data : JSON.stringify(data);
      this.data.sockets[socket].send(payload);
      return true;
      } catch {
      return false;
      }
    }

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}
}