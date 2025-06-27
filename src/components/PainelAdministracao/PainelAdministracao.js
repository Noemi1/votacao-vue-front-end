import { api } from "../../services/api.js";
import websocketService from "../../services/websocket.js";

export default {
    name: "PainelAdministracao",
    data() {
        return {
            temas: [],
            loading: true,
            error: null,
            dialogVisible: false,
            dialogDetalhesVisible: false,
            editando: false,
            salvando: false,
            temaSelecionado: null,
            form: {
                nome: "",
                descricao: "",
                foto: "",
            },
            errors: {},
        };
    },
    async mounted() {
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
        },
        
        removeWebSocketListeners() {
            websocketService.off('temasAtualizados', this.handleTemasAtualizados);
            websocketService.off('temaCriado', this.handleTemaCriado);
            websocketService.off('temaAtualizado', this.handleTemaAtualizado);
            websocketService.off('temaInativado', this.handleTemaInativado);
            websocketService.off('temaAtivado', this.handleTemaAtivado);
        },
        
        // Handlers do WebSocket
        handleTemasAtualizados(temas) {
            console.log('📋 Recebendo lista atualizada de temas via WebSocket (Admin)');
            this.temas = temas.filter((t) => t && t.nome);
            this.loading = false;
            this.error = null;
        },
        
        handleTemaCriado(novoTema) {
            console.log('🆕 Novo tema recebido via WebSocket (Admin):', novoTema);
            this.temas.unshift(novoTema);
            this.$toast.add({
                severity: 'success',
                summary: 'Novo Tema',
                detail: `Tema "${novoTema.nome}" foi criado!`,
                life: 3000
            });
        },
        
        handleTemaAtualizado(temaAtualizado) {
            console.log('✏️ Tema atualizado via WebSocket (Admin):', temaAtualizado);
            const index = this.temas.findIndex(t => t.id === temaAtualizado.id);
            if (index !== -1) {
                this.temas[index] = { ...this.temas[index], ...temaAtualizado };
                
                // Se o tema selecionado foi atualizado, atualizar também
                if (this.temaSelecionado && this.temaSelecionado.id === temaAtualizado.id) {
                    this.temaSelecionado = { ...this.temaSelecionado, ...temaAtualizado };
                }
            }
            this.$toast.add({
                severity: 'info',
                summary: 'Tema Atualizado',
                detail: `Tema "${temaAtualizado.nome}" foi atualizado!`,
                life: 3000
            });
        },
        
        handleTemaInativado(data) {
            console.log('🚫 Tema inativado via WebSocket (Admin):', data);
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
            console.log('✅ Tema ativado via WebSocket (Admin):', data);
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

        async carregarTemas() {
            try {
                this.loading = true;
                this.error = null;

                const response = await api.getTemas();
                this.temas = response.data;

                // Carregar totais de votos
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

        abrirDialogNovoTema() {
            this.editando = false;
            this.form = {
                nome: "",
                descricao: "",
                foto: "",
            };
            this.errors = {};
            this.dialogVisible = true;
        },

        editarTema(tema) {
            this.editando = true;
            this.form = {
                nome: tema.nome,
                descricao: tema.descricao,
                foto: tema.foto,
            };
            this.temaSelecionado = tema;
            this.errors = {};
            this.dialogVisible = true;
        },

        async salvarTema() {
            try {
                this.salvando = true;
                this.errors = {};

                // Validação
                if (!this.form.nome.trim()) {
                    this.errors.nome = "Nome é obrigatório";
                    return;
                }
                if (!this.form.descricao.trim()) {
                    this.errors.descricao = "Descrição é obrigatória";
                    return;
                }
                if (!this.form.foto.trim()) {
                    this.errors.foto = "URL da foto é obrigatória";
                    return;
                }

                if (this.editando) {
                    const temaAtualizado = await api.updateTema(this.temaSelecionado.id, this.form);
                    
                    // Emitir evento WebSocket para notificar outros clientes
                    websocketService.emitToServer('temaAtualizado', temaAtualizado.data);
                    
                    this.$toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: "Tema atualizado com sucesso",
                        life: 3000,
                    });
                } else {
                    const novoTema = await api.createTema(this.form);
                    
                    // Emitir evento WebSocket para notificar outros clientes
                    websocketService.emitToServer('temaCriado', novoTema.data);
                    
                    this.$toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: "Tema criado com sucesso",
                        life: 3000,
                    });
                }

                this.fecharDialog();
                await this.carregarTemas();
            } catch (error) {
                const message =
                    error.response?.data?.message || "Erro ao salvar tema";
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: message,
                    life: 3000,
                });
            } finally {
                this.salvando = false;
            }
        },

        async inativarTema(tema) {
            try {
                await api.inativarTema(tema.id);
                tema.inativado = true;
                
                // Emitir evento WebSocket para notificar outros clientes
                websocketService.emitToServer('temaInativado', { id: tema.id });
                
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Tema inativado com sucesso",
                    life: 3000,
                });
            } catch (error) {
                const message =
                    error.response?.data?.message || "Erro ao inativar tema";
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: message,
                    life: 3000,
                });
            }
        },

        async ativarTema(tema) {
            try {
                await api.ativarTema(tema.id);
                tema.inativado = false;
                
                // Emitir evento WebSocket para notificar outros clientes
                websocketService.emitToServer('temaAtivado', { id: tema.id });
                
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Tema ativado com sucesso",
                    life: 3000,
                });
            } catch (error) {
                const message =
                    error.response?.data?.message || "Erro ao ativar tema";
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: message,
                    life: 3000,
                });
            }
        },

        verDetalhes(tema) {
            this.temaSelecionado = tema;
            this.dialogDetalhesVisible = true;
        },

        fecharDialog() {
            this.dialogVisible = false;
            this.temaSelecionado = null;
        },

        truncateDescription(text, maxLength) {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + "...";
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
    },
};
