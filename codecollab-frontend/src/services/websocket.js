import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = null;
        this.connected = false;
        this.subscriptions = new Map();
    }

    connect(roomId, userEmail, onConnected, onDisconnected) {
        // Fix for the 'global is not defined' error
        window.global = window;
        
        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws/websocket',
            connectHeaders: {},
            debug: (str) => console.log('STOMP:', str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('✅ WebSocket connected');
                this.connected = true;
                
                // Subscribe to code updates
                const codeSub = this.client.subscribe(`/topic/room/${roomId}/code`, (message) => {
                    if (onConnected) {
                        const data = JSON.parse(message.body);
                        onConnected('code', data);
                    }
                });
                this.subscriptions.set('code', codeSub);
                
                // Subscribe to typing indicators
                const typingSub = this.client.subscribe(`/topic/room/${roomId}/typing`, (message) => {
                    if (onConnected) {
                        const data = JSON.parse(message.body);
                        onConnected('typing', data);
                    }
                });
                this.subscriptions.set('typing', typingSub);
                
                // Subscribe to participant updates
                const participantSub = this.client.subscribe(`/topic/room/${roomId}/participants`, (message) => {
                    if (onConnected) {
                        const data = JSON.parse(message.body);
                        onConnected('participants', data);
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
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
                if (onDisconnected) onDisconnected();
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
                this.connected = false;
                if (onDisconnected) onDisconnected();
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
            }
        });
        
        this.client.activate();
        
        return this.client;
    }

    disconnect() {
        if (this.client && this.client.connected) {
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
            console.warn('WebSocket not connected, cannot send message');
        }
    }

    isConnected() {
        return this.connected && this.client && this.client.connected;
    }
}

export default new WebSocketService();