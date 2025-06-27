import { api } from "../../services/api.js";
import websocketService from "../../services/websocket.js";
import moment from 'moment';

export default {
    name: "DetalhesTema",
    props: {
        tema: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            totalVotos: 0,
            ultimosVotos: [],
            votando: false,
            percentual: 0,
            editando: false,
            salvando: false,
            alterandoStatus: false,
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
        
        await this.carregarDados();
    },
    beforeUnmount() {
        // Remover listeners do WebSocket
        this.removeWebSocketListeners();
    },
    methods: {
        setupWebSocketListeners() {
            // Listener para quando um voto é registrado
            websocketService.on('votoRegistrado', this.handleVotoRegistrado);
            
            // Listener para quando um tema é atualizado
            websocketService.on('temaAtualizado', this.handleTemaAtualizado);
        },
        
        removeWebSocketListeners() {
            websocketService.off('votoRegistrado', this.handleVotoRegistrado);
            websocketService.off('temaAtualizado', this.handleTemaAtualizado);
        },
        
        // Handlers do WebSocket
        handleVotoRegistrado(data) {
            console.log('🗳️ Voto registrado via WebSocket:', data);
            // Atualizar dados se for do tema atual
            if (data.idTema == this.tema.id) {
                this.carregarDados();
            }
        },
        
        handleTemaAtualizado(temaAtualizado) {
            console.log('✏️ Tema atualizado via WebSocket:', temaAtualizado);
            if (temaAtualizado.id === this.tema.id) {
                // Atualizar o tema local
                Object.assign(this.tema, temaAtualizado);
            }
        },
        
        async carregarDados() {
            try {
                // Carregar total de votos
                const totalResponse = await api.getTotalVotos(this.tema.id);
                if (totalResponse.data && totalResponse.data.length > 0) {
                    this.totalVotos = totalResponse.data[0].total;
                }

                // Carregar todos os votos
                const votosResponse = await api.getVotos(this.tema.id);
                this.ultimosVotos = votosResponse.data || [];

                // Calcular percentual (simulado - seria melhor ter total geral)
                this.percentual =
                    this.totalVotos > 0
                        ? Math.min((this.totalVotos / 100) * 10, 100)
                        : 0;
            } catch (error) {
                console.error("Erro ao carregar dados do tema:", error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao carregar dados do tema",
                    life: 3000,
                });
            }
        },

        async toggleStatusTema() {
            try {
                this.alterandoStatus = true;
                
                if (this.tema.ativo) {
                    // Desativar tema
                    await api.inativarTema(this.tema.id);
                    this.tema.ativo = false;
                    
                    this.$toast.add({
                        severity: "warn",
                        summary: "Tema Desativado",
                        detail: "O tema foi desativado com sucesso",
                        life: 3000,
                    });
                } else {
                    // Ativar tema
                    await api.ativarTema(this.tema.id);
                    this.tema.ativo = true;
                    
                    this.$toast.add({
                        severity: "success",
                        summary: "Tema Ativado",
                        detail: "O tema foi ativado com sucesso",
                        life: 3000,
                    });
                }
                
                // Emitir evento para atualizar na lista
                this.$emit("tema-atualizado", this.tema);
                
            } catch (error) {
                const message =
                    error.response?.data?.message || "Erro ao alterar status do tema";
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: message,
                    life: 3000,
                });
            } finally {
                this.alterandoStatus = false;
            }
        },

        iniciarEdicao() {
            this.editando = true;
            this.form = {
                nome: this.tema.nome,
                descricao: this.tema.descricao,
                foto: this.tema.foto,
            };
            this.errors = {};
        },

        cancelarEdicao() {
            this.editando = false;
            this.form = {
                nome: "",
                descricao: "",
                foto: "",
            };
            this.errors = {};
        },

        validarForm() {
            this.errors = {};

            if (!this.form.nome || this.form.nome.trim().length === 0) {
                this.errors.nome = "Nome é obrigatório";
            } else if (this.form.nome.trim().length < 3) {
                this.errors.nome = "Nome deve ter pelo menos 3 caracteres";
            }

            if (
                !this.form.descricao ||
                this.form.descricao.trim().length === 0
            ) {
                this.errors.descricao = "Descrição é obrigatória";
            } else if (this.form.descricao.trim().length < 10) {
                this.errors.descricao =
                    "Descrição deve ter pelo menos 10 caracteres";
            }

            if (!this.form.foto || this.form.foto.trim().length === 0) {
                this.errors.foto = "URL da imagem é obrigatória";
            } else if (!this.isValidUrl(this.form.foto)) {
                this.errors.foto = "URL da imagem deve ser válida";
            }

            return Object.keys(this.errors).length === 0;
        },

        isValidUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        },

        async salvarAlteracoes() {
            if (!this.validarForm()) {
                this.$toast.add({
                    severity: "error",
                    summary: "Erro de Validação",
                    detail: "Por favor, corrija os erros no formulário",
                    life: 3000,
                });
                return;
            }

            try {
                this.salvando = true;

                await api.updateTema(this.tema.id, this.form);

                // Atualizar o tema local
                Object.assign(this.tema, this.form);

                this.editando = false;
                this.errors = {};

                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Tema atualizado com sucesso",
                    life: 3000,
                });

                // Emitir evento para atualizar na lista
                this.$emit("tema-atualizado", this.tema);
            } catch (error) {
                const message =
                    error.response?.data?.message || "Erro ao atualizar tema";
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

        async votar() {
            try {
                this.votando = true;

                await api.votar(this.tema.id);

                // Atualizar dados
                await this.carregarDados();

                this.$emit("votar", this.tema);
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
                this.votando = false;
            }
        },

        formatDate(dateString) {
            return moment(dateString).format("DD/MM/YY [às] HH[h]mm");
        },
    },
};
