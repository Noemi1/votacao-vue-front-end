import axios from "axios";

// Interceptor para tratamento de erros
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Erro na API:", error.response?.data || error.message);
        return Promise.reject(error);
    },
);

export const api = {
    // Temas
    getTemas: () => axios.get("/tema"),
    getTema: (id) => axios.get(`/tema/${id}`),
    createTema: (tema) => axios.post("/tema", tema),
    updateTema: (id, tema) => axios.put(`/tema/${id}`, tema),
    inativarTema: (id) => axios.patch(`/tema/${id}/inativar`),
    ativarTema: (id) => axios.patch(`/tema/${id}/ativar`),

    // Votos
    getVotos: (idTema) => axios.get(`/votos/${idTema}`),
    votar: (idTema) => axios.post(`/votar/${idTema}`),
    getTotalVotos: (idTema) => axios.get(`/votos/total/${idTema}`),
};
