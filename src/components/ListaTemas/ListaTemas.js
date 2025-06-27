import { api } from "../../services/api.js";
import websocketService from "../../services/websocket.js";
import moment from 'moment';

export default {
    name: "ListaTemas",
    data() {
        return {
            temas: [],
            loading: true,
            error: null,
            votando: null,
        };
    },
    computed: {
        temasAtivos() {
            // Filtrar temas que existem e estão ativos
            let temasAtivos = this.temas.filter((tema) => {
                // Verificar se o tema existe e tem as propriedades necessárias
                if (!tema || typeof tema !== 'object') {
                    return false;
                }
                
                // Converter para boolean se necessário (SQLite retorna 1/0)
                const isAtivo = tema.ativo === true || tema.ativo === 1 || tema.ativo === '1';
                console.log(`Tema "${tema.nome}": ativo = ${tema.ativo} (${typeof tema.ativo}) -> ${isAtivo}`);
                
                return isAtivo;
            });
            console.log('temasAtivos filtrados:', temasAtivos);
            return temasAtivos;
        },
    },
    async mounted() {
        console.log('mounted');
        // Conectar ao WebSocket
        websocketService.connect();
        
        // Configurar listeners do WebSocket
        this.setupWebSocketListeners();
        
        // Carregar dados iniciais
        await this.carregarTemas();
    },
    beforeUnmount() {
        // Remover listeners do WebSocket
        this.removeWebSocketListeners();
    },
    methods: {
        setupWebSocketListeners() {
            // Listener para quando a lista de temas é atualizada
            websocketService.on('temasAtualizados', this.handleTemasAtualizados);
            
            // Listener para quando um novo tema é criado
            websocketService.on('temaCriado', this.handleTemaCriado);
            
            // Listener para quando um tema é atualizado
            websocketService.on('temaAtualizado', this.handleTemaAtualizado);
            
            // Listener para quando um tema é inativado
            websocketService.on('temaInativado', this.handleTemaInativado);
            
            // Listener para quando um tema é ativado
            websocketService.on('temaAtivado', this.handleTemaAtivado);
            
            // Listener para quando um voto é registrado
            websocketService.on('votoRegistrado', this.handleVotoRegistrado);
        },
        
        removeWebSocketListeners() {
            websocketService.off('temasAtualizados', this.handleTemasAtualizados);
            websocketService.off('temaCriado', this.handleTemaCriado);
            websocketService.off('temaAtualizado', this.handleTemaAtualizado);
            websocketService.off('temaInativado', this.handleTemaInativado);
            websocketService.off('temaAtivado', this.handleTemaAtivado);
            websocketService.off('votoRegistrado', this.handleVotoRegistrado);
        },
        
        // Handlers do WebSocket
        handleTemasAtualizados(temas) {
            console.log('📋 Recebendo lista atualizada de temas via WebSocket');
            this.temas = temas.filter((t) => t && t.nome);
            this.loading = false;
            this.error = null;
        },
        
        handleTemaCriado(novoTema) {
            console.log('🆕 Novo tema recebido via WebSocket:', novoTema);
            this.temas.unshift(novoTema);
            this.$toast.add({
                severity: 'success',
                summary: 'Novo Tema',
                detail: `Tema "${novoTema.nome}" foi criado!`,
                life: 3000
            });
        },
        
        handleTemaAtualizado(temaAtualizado) {
            console.log('✏️ Tema atualizado via WebSocket:', temaAtualizado);
            const index = this.temas.findIndex(t => t.id === temaAtualizado.id);
            if (index !== -1) {
                this.temas[index] = { ...this.temas[index], ...temaAtualizado };
            }
            this.$toast.add({
                severity: 'info',
                summary: 'Tema Atualizado',
                detail: `Tema "${temaAtualizado.nome}" foi atualizado!`,
                life: 3000
            });
        },
        
        handleTemaInativado(data) {
            console.log('🚫 Tema inativado via WebSocket:', data);
            const tema = this.temas.find(t => t.id === data.id);
            if (tema) {
                tema.inativado = true;
            }
            this.$toast.add({
                severity: 'warn',
                summary: 'Tema Inativado',
                detail: 'Um tema foi inativado.',
                life: 3000
            });
        },
        
        handleTemaAtivado(data) {
            console.log('✅ Tema ativado via WebSocket:', data);
            const tema = this.temas.find(t => t.id === data.id);
            if (tema) {
                tema.inativado = false;
            }
            this.$toast.add({
                severity: 'success',
                summary: 'Tema Ativado',
                detail: 'Um tema foi ativado.',
                life: 3000
            });
        },
        
        handleVotoRegistrado(data) {
            console.log('🗳️ Voto registrado via WebSocket:', data);
            // Atualizar o total de votos do tema
            this.atualizarTotalVotos(data.idTema);
            this.$toast.add({
                severity: 'success',
                summary: 'Voto Registrado',
                detail: 'Seu voto foi registrado com sucesso!',
                life: 2000
            });
        },
        
        async atualizarTotalVotos(idTema) {
            try {
                const response = await api.getTotalVotos(idTema);
                if (response.data && response.data.length > 0) {
                    const tema = this.temas.find(t => t.id === idTema);
                    if (tema) {
                        tema.totalVotos = response.data[0].total;
                    }
                }
            } catch (error) {
                console.error('Erro ao atualizar total de votos:', error);
            }
        },

        async carregarTemas() {
            try {
                this.loading = true;
                this.error = null;

                const response = await api.getTemas();
                this.temas = (response.data || []).filter((t) => t && t.nome);
                console.log('temas', this.temas);
                // Carregar totais de votos para cada tema
                await this.carregarTotaisVotos();
            } catch (error) {
                this.error =
                    "Erro ao carregar temas: " +
                    (error.response?.data?.message || error.message);
            } finally {
                this.loading = false;
            }
        },

        async carregarTotaisVotos() {
            for (let tema of this.temas) {
                try {
                    const response = await api.getTotalVotos(tema.id);
                    if (response.data && response.data.length > 0) {
                        tema.totalVotos = response.data[0].total;
                    } else {
                        tema.totalVotos = 0;
                    }
                } catch (error) {
                    console.error(
                        `Erro ao carregar votos do tema ${tema.id}:`,
                        error,
                    );
                    tema.totalVotos = 0;
                }
            }
        },

        async votar(tema) {
            try {
                this.votando = tema.id;

                await api.votar(tema.id);

                // Atualizar total de votos
                const response = await api.getTotalVotos(tema.id);
                if (response.data && response.data.length > 0) {
                    tema.totalVotos = response.data[0].total;
                }

                this.$emit("votar", tema);
            } catch (error) {
                const message =
                    error.response?.data?.message || "Erro ao registrar voto";
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: message,
                    life: 3000,
                });
            } finally {
                this.votando = null;
            }
        },

        verDetalhes(tema) {
            this.$emit("ver-detalhes", tema);
        },

        truncateDescription(text, maxLength) {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + "...";
        },

        formatDate(dateString) {
            return moment(dateString).format("DD/MM/YY [às] HH[h]mm");
        },

        getValidImageUrl(url) {
            // Se não há URL ou é vazia, retornar imagem padrão
            if (!url || url.trim() === '') {
                return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZW0gSW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K';
            }
            
            // Se já é uma imagem base64, retornar como está
            if (url.startsWith('data:image/')) {
                return url;
            }
            
            // Tentar validar URL
            try {
                new URL(url);
                return url;
            } catch (e) {
                // Se não é uma URL válida, retornar imagem padrão
                return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZW0gSW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K';
            }
        },

        handleImageError(event) {
            // Verificar se já está usando a imagem padrão para evitar loop infinito
            if (event.target.src.includes('data:image/svg+xml') || event.target.dataset.fallback) {
                // Se já é a imagem padrão, não fazer nada para evitar loop
                return;
            }
            
            // Marcar que já tentou usar fallback
            event.target.dataset.fallback = 'true';
            
            // Substituir por uma imagem SVG inline (não depende de requisições externas)
            event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZW0gSW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K';
        },
    },
};