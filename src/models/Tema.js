/**
 * Model para Tema de Votação
 */
export class Tema {
    constructor(data = {}) {
        this.id = data.id || null;
        this.nome = data.nome || "";
        this.descricao = data.descricao || "";
        this.foto = data.foto || "";
        this.inativado = data.inativado || false;
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
        this.totalVotos = data.totalVotos || 0;
    }

    /**
     * Cria uma instância de Tema a partir de dados da API
     */
    static fromApi(data) {
        return new Tema({
            id: data.id,
            nome: data.nome,
            descricao: data.descricao,
            foto: data.foto,
            inativado: data.inativado,
            created_at: data.created_at,
            updated_at: data.updated_at,
            totalVotos: data.totalVotos || 0,
        });
    }

    /**
     * Converte para objeto simples para envio à API
     */
    toApi() {
        return {
            nome: this.nome,
            descricao: this.descricao,
            foto: this.foto,
        };
    }

    /**
     * Verifica se o tema é válido
     */
    isValid() {
        return this.nome && this.nome.trim().length > 0;
    }

    /**
     * Verifica se o tema está ativo
     */
    isActive() {
        return !this.inativado;
    }
}

/**
 * Interface TypeScript (para referência)
 *
 * interface Tema {
 *   id: number | null
 *   nome: string
 *   descricao: string
 *   foto: string
 *   inativado: boolean
 *   created_at: string | null
 *   updated_at: string | null
 *   totalVotos: number
 * }
 */
