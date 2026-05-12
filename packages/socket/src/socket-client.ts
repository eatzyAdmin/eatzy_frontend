import { Client, IFrame, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface SocketConfig {
  url: string;
  token?: string | null;
  onConnect?: (frame: IFrame) => void;
  onDisconnect?: () => void;
  onStompError?: (frame: IFrame) => void;
}

export class SocketClient {
  private client: Client;
  private subscriptions: Map<string, StompSubscription> = new Map();

  constructor(config: SocketConfig) {
    const { url, token } = config;
    
    // Microservices auth: JWT is sent via STOMP CONNECT headers (not URL query param)
    // WebSocketAuthChannelInterceptor reads "Authorization: Bearer xxx" from STOMP frame
    this.client = new Client({
      webSocketFactory: () => new SockJS(url),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: config.onConnect,
      onDisconnect: config.onDisconnect,
      onStompError: config.onStompError,
      debug: (msg) => console.log('STOMP Debug:', msg),
    });
  }

  activate() {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  deactivate() {
    if (this.client.active) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
    }
  }

  get connected(): boolean {
    return this.client.connected;
  }

  subscribe(destination: string, callback: (message: IMessage) => void): StompSubscription {
    const subscription = this.client.subscribe(destination, callback);
    this.subscriptions.set(destination, subscription);
    return subscription;
  }

  unsubscribe(destination: string) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  publish(destination: string, body: any) {
    if (this.client.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn(`STOMP client not connected. Failed to publish to ${destination}`);
    }
  }
}
