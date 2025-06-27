import { api } from "../../services/api.js";
import websocketService from "../../services/websocket.js";
import moment from "moment";

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
        // WebSocket já está conectado pelo App.js
        // websocketService.connect();
        
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
        },
        
        handleTemaInativado(temaAtualizado) {
            console.log('🚫 Tema inativado via WebSocket (Admin):', temaAtualizado);
            const index = this.temas.findIndex(t => t.id === temaAtualizado.id);
            if (index !== -1) {
                this.temas[index] = { ...this.temas[index], ...temaAtualizado };
            }
        },
        
        handleTemaAtivado(temaAtualizado) {
            console.log('✅ Tema ativado via WebSocket (Admin):', temaAtualizado);
            const index = this.temas.findIndex(t => t.id === temaAtualizado.id);
            if (index !== -1) {
                this.temas[index] = { ...this.temas[index], ...temaAtualizado };
            }
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
                    await api.updateTema(this.temaSelecionado.id, this.form);
                    
                    this.$toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: "Tema atualizado com sucesso",
                        life: 3000,
                    });
                } else {
                    await api.createTema(this.form);
                    
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
            if (moment(dateString).isSame(moment(), 'day')) 
            {
                return moment(dateString).format("[Hoje] [às] HH[h]mm");
            }
            else if (moment(dateString).date().startOf('day') == moment().subtract(1, 'days').startOf('day')) 
            {
                    return moment(dateString).format("[Ontem] [às] HH[h]mm");
            }
            else if (moment(dateString).date().startOf('day') == moment().subtract(2, 'days').startOf('day')) 
            {
                    return moment(dateString).format("[Anteontem] [às] HH[h]mm");
            }
            else if (moment(dateString).week() == moment().week()
                    && moment(dateString).month() == moment().month() 
                    && moment(dateString).year() == moment().year()) 
            {
                return moment(dateString).format("EEE [às] HH[h]mm");
            } 
            else if (moment(dateString).month() == moment().month() 
                && moment(dateString).year() == moment().year()) 
            {
                return moment(dateString).format("DD [de] MMM [às] HH[h]mm");
            } 
            else {
                return moment(dateString).format("DD/MM/YYYY [às] HH[h]mm");
            }
        },
    },
};
