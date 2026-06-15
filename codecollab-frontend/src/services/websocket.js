import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Fix for 'global is not defined' error
if (typeof window !== 'undefined' && !window.global) {
    window.global = window;
}

// Use environment variable for WebSocket URL
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

console.log('🔌 WebSocket URL:', WS_URL);

class WebSocketService {
    constructor() {
        this.client = null;
        this.connected = false;
        this.subscriptions = new Map();
        this.currentRoomId = null;
        this.currentUserEmail = null;
    }

    connect(roomId, userEmail, onMessage, onDisconnect) {
        this.currentRoomId = roomId;
        this.currentUserEmail = userEmail;
        
        console.log('🔌 Connecting to WebSocket at:', WS_URL);
        
        try {
            // Create SockJS connection
            const socket = new SockJS(WS_URL);
            
            this.client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {},
                debug: (str) => {
                    if (str.includes('Connected') || str.includes('ERROR')) {
                        console.log('STOMP:', str);
                    }
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('✅ WebSocket connected successfully!');
                    this.connected = true;
                    
                    // Subscribe to code updates
                    const codeSub = this.client.subscribe(`/topic/room/${roomId}/code`, (message) => {
                        try {
                            const data = JSON.parse(message.body);
                            if (onMessage) onMessage('code', data);
                        } catch (e) {
                            console.error('Error parsing code message:', e);
                        }
                    });
                    this.subscriptions.set('code', codeSub);
                    
                    // Subscribe to typing indicators
                    const typingSub = this.client.subscribe(`/topic/room/${roomId}/typing`, (message) => {
                        try {
                            const data = JSON.parse(message.body);
                            if (onMessage) onMessage('typing', data);
                        } catch (e) {
                            console.error('Error parsing typing message:', e);
                        }
                    });
                    this.subscriptions.set('typing', typingSub);
                    
                    // Subscribe to participant updates
                    const participantSub = this.client.subscribe(`/topic/room/${roomId}/participants`, (message) => {
                        try {
                            const data = JSON.parse(message.body);
                            if (onMessage) onMessage('participants', data);
                        } catch (e) {
                            console.error('Error parsing participants message:', e);
                        }
                    });
                    this.subscriptions.set('participants', participantSub);
                    
                    // Send join event
                    this.send('/app/room.join', {
                        roomId: roomId,
                        eventType: 'JOIN',
                        participantEmail: userEmail,
                        participantName: userEmail
                    });
                    
                    if (onMessage) onMessage('connected', { connected: true });
                },
                onStompError: (frame) => {
                    console.error('STOMP error:', frame);
                    if (onDisconnect) onDisconnect();
                },
                onDisconnect: () => {
                    console.log('WebSocket disconnected');
                    this.connected = false;
                    if (onDisconnect) onDisconnect();
                },
                onWebSocketError: (event) => {
                    console.error('WebSocket error:', event);
                }
            });
            
            this.client.activate();
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }
        
        return this.client;
    }

    disconnect() {
        if (this.client && this.client.connected) {
            if (this.currentRoomId && this.currentUserEmail) {
                this.send('/app/room.leave', {
                    roomId: this.currentRoomId,
                    eventType: 'LEAVE',
                    participantEmail: this.currentUserEmail,
                    participantName: this.currentUserEmail
                });
            }
            this.client.deactivate();
        }
        this.connected = false;
        this.subscriptions.clear();
    }

    send(destination, body) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: destination,
                body: JSON.stringify(body)
            });
        } else {
            console.warn('WebSocket not connected, cannot send message to:', destination);
        }
    }

    isConnected() {
        return this.connected && this.client && this.client.connected;
    }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;