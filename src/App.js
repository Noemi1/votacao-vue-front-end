import ListaTemas from "./components/ListaTemas/ListaTemas.vue";
import DetalhesTema from "./components/DetalhesTema/DetalhesTema.vue";
import PainelAdministracao from "./components/PainelAdministracao/PainelAdministracao.vue";
import websocketService from "./services/websocket.js";

export default {
    name: "App",
    components: {
        ListaTemas,
        DetalhesTema,
        PainelAdministracao,
    },
    data() {
        return {
            items: [
                {
                    label: 'Home',
                    icon: 'pi pi-home',
                    command: () => {
                        this.currentView = 'temas';
                    }
                },
                {
                    label: 'Temas',
                    icon: 'pi pi-cog',
                    command: () => {
                        this.currentView = 'admin';
                    }
                }
            ],
            currentView: "temas",
            selectedTema: null,
            isDarkMode: true,
            websocketService: websocketService,
        };
    },
    mounted() {
        // Conectar ao WebSocket
        console.log('websocketService', this.websocketService);
        this.websocketService.connect();
        
        // Carregar preferência de tema do localStorage
        this.loadThemePreference();
        // Aplicar tema inicial
        this.applyTheme();
    },
    methods: {
        loadThemePreference() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                this.isDarkMode = savedTheme === 'dark';
            } else {
                // Verificar preferência do sistema
                this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        },

        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            this.applyTheme();
            // Salvar preferência
            localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        },

        applyTheme() {
            const html = document.documentElement;
            const body = document.body;
            
            if (this.isDarkMode) {
                html.classList.add('dark');
                html.setAttribute('data-theme', 'dark');
                body.classList.add('dark');
                console.log('🌙 Modo escuro ativado');
            } else {
                html.classList.remove('dark');
                html.setAttribute('data-theme', 'light');
                body.classList.remove('dark');
                console.log('☀️ Modo claro ativado');
            }
            
            // Forçar reflow para garantir que as mudanças sejam aplicadas
            html.offsetHeight;
        },

        handleVotar(tema) {
            this.$toast.add({
                severity: "success",
                summary: "Voto registrado!",
                detail: `Você votou em "${tema.nome}"`,
                life: 3000,
            });
        },
        handleVerDetalhes(tema) {
            this.selectedTema = tema;
            this.currentView = "detalhes";
        },
        handleTemaAtualizado(tema) {
            // Atualizar o tema selecionado
            this.selectedTema = tema;

            // Emitir evento para atualizar na lista de temas
            this.$refs.listaTemas?.carregarTemas();
        },
        
        testWebSocket() {
            console.log('🧪 Testando WebSocket...');
            const isConnected = this.websocketService.testConnection();
            
            this.$toast.add({
                severity: isConnected ? 'success' : 'error',
                summary: 'Teste WebSocket',
                detail: isConnected ? 'WebSocket conectado!' : 'WebSocket desconectado. Tentando reconectar...',
                life: 3000,
            });
            
            if (!isConnected) {
                this.websocketService.forceReconnect();
            }
        },
    },
};
