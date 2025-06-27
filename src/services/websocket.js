import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 5;
    }

    connect() {
        if (this.socket && this.isConnected) {
            console.log('🔌 WebSocket já está conectado');
            return;
        }

        console.log('🔌 Tentando conectar ao WebSocket...');
        
        try {
            this.socket = io('http://localhost:3000', {
                transports: ['websocket', 'polling'],
                timeout: 10000,
                reconnection: true,
                reconnectionAttempts: this.maxConnectionAttempts,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                maxReconnectionAttempts: this.maxConnectionAttempts,
                forceNew: true,
                upgrade: true,
                rememberUpgrade: true,
            });

            this.socket.on('connect', () => {
                console.log('🔌 WebSocket conectado com sucesso:', this.socket.id);
                this.isConnected = true;
                this.connectionAttempts = 0;
            });

            this.socket.on('disconnect', (reason) => {
                console.log('❌ WebSocket desconectado. Motivo:', reason);
                this.isConnected = false;
            });

            this.socket.on('connect_error', (error) => {
                this.connectionAttempts++;
                console.error('❌ Erro na conexão WebSocket:', error);
                console.log(`📊 Tentativa ${this.connectionAttempts}/${this.maxConnectionAttempts}`);
                this.isConnected = false;
                
                if (this.connectionAttempts >= this.maxConnectionAttempts) {
                    console.error('❌ Máximo de tentativas de conexão atingido. Verifique se o backend está rodando.');
                }
            });

            this.socket.on('reconnect', (attemptNumber) => {
                console.log('🔄 WebSocket reconectado na tentativa:', attemptNumber);
                this.isConnected = true;
            });

            this.socket.on('reconnect_error', (error) => {
                console.error('❌ Erro na reconexão WebSocket:', error);
            });

            this.socket.on('reconnect_failed', () => {
                console.error('❌ Falha na reconexão WebSocket após todas as tentativas');
            });

            // Eventos específicos do backend
            this.socket.on('listaTemas', (temas) => {
                console.log('📋 Lista de temas recebida via WebSocket:', temas);
                this.emit('temasAtualizados', temas);
            });

            this.socket.on('newTema', (tema) => {
                console.log('🆕 Novo tema criado:', tema);
                this.emit('temaCriado', tema);
            });

            this.socket.on('updateTema', (tema) => {
                console.log('✏️ Tema atualizado:', tema);
                this.emit('temaAtualizado', tema);
            });

            this.socket.on('temaInativado', (data) => {
                console.log('🚫 Tema inativado:', data);
                this.emit('temaInativado', data);
            });

            this.socket.on('temaAtivado', (data) => {
                console.log('✅ Tema ativado:', data);
                this.emit('temaAtivado', data);
            });

            this.socket.on('votoRegistrado', (data) => {
                console.log('🗳️ Voto registrado:', data);
                // this.emit('votoRegistrado', data);
            });

        } catch (error) {
            console.error('❌ Erro ao inicializar WebSocket:', error);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Método para adicionar listeners
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    // Método para remover listeners
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    // Método para emitir eventos internos
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Erro no callback do evento ${event}:`, error);
                }
            });
        }
    }

    // Método para emitir eventos para o servidor
    emitToServer(event, data) {
        if (this.socket && this.isConnected) {
            this.socket.emit(event, data);
        } else {
            console.warn('WebSocket não está conectado');
        }
    }

    // Método para testar conexão
    testConnection() {
        console.log('🧪 Testando conexão WebSocket...');
        
        if (!this.socket) {
            console.error('❌ Socket não inicializado');
            return false;
        }
        
        console.log('📊 Status da conexão:', {
            connected: this.socket.connected,
            id: this.socket.id,
            transport: this.socket.io.engine.transport.name
        });
        
        return this.socket.connected;
    }

    // Método para forçar reconexão
    forceReconnect() {
        console.log('🔄 Forçando reconexão...');
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.connect();
    }

    // Getters
    get connected() {
        return this.isConnected;
    }

    get socketId() {
        return this.socket ? this.socket.id : null;
    }
}

// Criar instância singleton
const websocketService = new WebSocketService();

export default websocketService; 