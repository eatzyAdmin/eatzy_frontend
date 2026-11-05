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
  private listeners = new Map<string, Map<string, (message: IMessage) => void>>();
  private subscriptions = new Map<string, StompSubscription>();
  private sequence = 0;
  private epoch = 0;
  private ready = false;
  private enabled = false;

  constructor(config: SocketConfig) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(config.url),
      connectHeaders: config.token ? { Authorization: `Bearer ${config.token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        if (!this.enabled) return;
        this.epoch++;
        this.ready = true;
        this.subscriptions.clear();
        this.listeners.forEach((_, destination) => this.bind(destination));
        config.onConnect?.(frame);
      },
      onDisconnect: () => this.disconnected(config),
      // A STOMP disconnect receipt does not cover abrupt transport loss.
      onWebSocketClose: () => this.disconnected(config),
      onStompError: (frame) => {
        this.disconnected(config);
        if (this.enabled) config.onStompError?.(frame);
      },
      // CONNECT debug frames contain the bearer token.
      debug: () => {},
    });
  }

  private disconnected(config: SocketConfig) {
    const wasReady = this.ready;
    this.ready = false;
    this.epoch++;
    this.subscriptions.clear();
    if (wasReady && this.enabled) config.onDisconnect?.();
  }

  activate() {
    this.enabled = true;
    this.client.activate();
  }

  deactivate() {
    this.enabled = false;
    this.ready = false;
    this.epoch++;
    this.listeners.clear();
    this.subscriptions.clear();
    // Closing the transport releases broker subscriptions even after a lost connection.
    return this.client.deactivate();
  }

  get connected(): boolean {
    return this.enabled && this.ready && this.client.connected;
  }

  private bind(destination: string) {
    if (!this.connected || this.subscriptions.has(destination)) return;
    const epoch = this.epoch;
    const subscription = this.client.subscribe(destination, (message) => {
      if (!this.connected || epoch !== this.epoch || this.subscriptions.get(destination) !== subscription) return;
      const listeners = this.listeners.get(destination);
      if (!listeners) return;
      for (const [id, callback] of Array.from(listeners.entries())) {
        if (listeners.get(id) !== callback) continue;
        try { callback(message); }
        catch { console.error('Socket message handler failed'); }
      }
    });
    this.subscriptions.set(destination, subscription);
  }

  subscribe(destination: string, callback: (message: IMessage) => void): StompSubscription {
    const id = `listener-${++this.sequence}`;
    let listeners = this.listeners.get(destination);
    if (!listeners) this.listeners.set(destination, listeners = new Map());
    listeners.set(id, callback);
    this.bind(destination);
    return { id, unsubscribe: () => {
      const current = this.listeners.get(destination);
      current?.delete(id);
      if (current?.size === 0) this.unsubscribe(destination);
    } };
  }

  unsubscribe(destination: string) {
    this.listeners.delete(destination);
    const subscription = this.subscriptions.get(destination);
    this.subscriptions.delete(destination);
    if (this.connected) subscription?.unsubscribe();
  }

  publish(destination: string, body: unknown): boolean {
    if (!this.connected) return false;
    this.client.publish({ destination, body: JSON.stringify(body) });
    return true;
  }
}
