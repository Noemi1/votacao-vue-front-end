<template>
<div>
    <!-- Header -->
    <div class="mb-4">
        <div class="flex align-items-center justify-content-between">
            <div>
                <h2 class="text-2xl font-bold m-0">
                    Detalhes do Tema
                </h2>
            </div>
            <Button
                label="Voltar"
                icon="pi pi-arrow-left"
                @click="$emit('fechar')"
                severity="secondary"
                outlined
            />
        </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-content-center p-4">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <!-- Conteúdo -->
    <div v-else class="grid">
        <!-- Informações do Tema -->
        <div class="col-12 lg:col-8">
            <Card>
                <template #title>
                    <div class="flex align-items-center justify-content-between">
                        <h1 class="text-3xl font-bold mb-3">
                            {{ tema.nome }}
                        </h1>
                        <div class="flex gap-2">
                            <Button
                                v-if="!editando"
                                label="Editar"
                                icon="pi pi-pencil"
                                @click="iniciarEdicao"
                                severity="secondary"
                                outlined
                            />
                            <Button
                                v-if="!editando"
                                :label="tema.ativo ? 'Desativar' : 'Ativar'"
                                :icon="tema.ativo ? 'pi pi-ban' : 'pi pi-check'"
                                @click="toggleStatusTema"
                                :loading="alterandoStatus"
                                :severity="tema.ativo ? 'warn' : 'success'"
                            />
                        </div>
                    </div>
                </template>

                <template #content>
                    <!-- Modo de Edição -->
                    <div v-if="editando">
                        <form @submit.prevent="salvarAlteracoes">
                            <div class="field mb-4">
                                <label for="nome" class="block text-sm font-semibold mb-2">
                                    Nome do Tema
                                </label>
                                <InputText
                                    id="nome"
                                    v-model="form.nome"
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.nome }"
                                />
                                <small v-if="errors.nome" class="p-error">{{ errors.nome }}</small>
                            </div>

                            <div class="field mb-4">
                                <h3 class="text-lg font-semibold mb-2">
                                    Descrição
                                </h3>
                                <p class="line-height-3">
                                    {{ tema.descricao }}
                                </p>
                                <label for="descricao" class="block text-sm font-semibold mb-2">
                                    Nova Descrição
                                </label>
                                <Textarea
                                    id="descricao"
                                    v-model="form.descricao"
                                    rows="4"
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.descricao }"
                                />
                                <small v-if="errors.descricao" class="p-error">{{ errors.descricao }}</small>
                            </div>

                            <div class="field mb-4">
                                <label for="foto" class="block text-sm font-semibold mb-2">
                                    URL da Foto
                                </label>
                                <InputText
                                    id="foto"
                                    v-model="form.foto"
                                    class="w-full"
                                    :class="{ 'p-invalid': errors.foto }"
                                />
                                <small v-if="errors.foto" class="p-error">{{ errors.foto }}</small>
                            </div>

                            <div class="flex gap-2">
                                <Button
                                    type="submit"
                                    label="Salvar"
                                    icon="pi pi-check"
                                    :loading="salvando"
                                    severity="primary"
                                />
                                <Button
                                    type="button"
                                    label="Cancelar"
                                    icon="pi pi-times"
                                    @click="cancelarEdicao"
                                    severity="secondary"
                                    outlined
                                />
                            </div>
                        </form>
                    </div>

                    <!-- Modo de Visualização -->
                    <div v-else>
                        <div class="mb-4">
                            <img
                                :src="getValidImageUrl(tema.foto)"
                                :alt="tema.nome"
                                class="w-full border-round"
                                style="height: 256px; object-fit: cover;"
                                @error="handleImageError"
                            />
                        </div>

                        <div class="mb-4">
                            <h3 class="text-lg font-semibold mb-2">
                                Descrição
                            </h3>
                            <p class="line-height-3">
                                {{ tema.descricao }}
                            </p>
                        </div>

                        <!-- Estatísticas -->
                        <div class="grid">
                            <div class="col-12 md:col-6">
                                <div class="flex align-items-center p-3 surface-100 border-round">
                                    <i class="pi pi-calendar text-primary mr-2"></i>
                                    <div>
                                        <div class="text-sm">Criado em</div>
                                        <div class="font-semibold">{{ formatDate(tema.dataCriacao) }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 md:col-6">
                                <div class="flex align-items-center p-3 surface-100 border-round">
                                    <i class="pi pi-users text-primary mr-2"></i>
                                    <div>
                                        <div class="text-sm">Total de votos</div>
                                        <div class="font-semibold text-xl">{{ totalVotos }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Status -->
                        <div v-if="!tema.ativo" class="mt-3">
                            <div class="flex align-items-center p-3 surface-100 border-round">
                                <i class="pi pi-ban text-red-500 mr-2"></i>
                                <div>
                                    <div class="text-sm">Status</div>
                                    <div class="font-semibold text-red-600">Tema Inativo</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Sidebar com Estatísticas -->
        <div class="col-12 lg:col-4">
            <!-- Estatísticas Gerais -->
            <Card class="mb-3">
                <template #title>
                    <h3 class="text-xl font-semibold mb-3">
                        Estatísticas
                    </h3>
                </template>

                <template #content>
                    <!-- Total de Votos -->
                    <div class="text-center p-4 surface-100 border-round">
                        <div class="text-3xl font-bold mb-1">
                            {{ totalVotos }}
                        </div>
                        <div class="text-sm">
                            Total de Votos
                        </div>
                    </div>

                    <!-- Percentual -->
                    <div class="mt-3">
                        <div class="flex justify-content-between text-sm">
                            <span>Percentual</span>
                            <span class="font-semibold">{{ percentual.toFixed(1) }}%</span>
                        </div>
                        <ProgressBar :value="percentual" class="mt-2" />
                    </div>
                </template>
            </Card>

            <!-- Últimos Votos -->
            <Card>
                <template #title>
                    <h4 class="font-semibold mb-2">
                        Últimos Votos
                    </h4>
                </template>

                <template #content>
                    <div v-if="ultimosVotos.length > 0">
                        <div
                            v-for="voto in ultimosVotos.slice(0, 5)"
                            :key="voto.id"
                            class="flex align-items-center justify-content-between p-3 surface-100 border-round"
                        >
                            <div class="flex align-items-center">
                                <i class="pi pi-user mr-2"></i>
                                <div>
                                    <div class="text-sm font-medium">
                                        IP: {{ voto.ip }}
                                    </div>
                                    <div class="text-xs">
                                        {{ formatDate(voto.dataHora) }}
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs">
                                {{ formatTime(voto.dataHora) }}
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center p-4 surface-100 border-round">
                        <i class="pi pi-users text-2xl mb-2"></i>
                        <div class="text-sm">
                            Nenhum voto registrado ainda
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <!-- Botão de Votar -->
    <div class="mt-4 text-center" v-if="tema.ativo">
        <Button
            label="Votar neste Tema"
            icon="pi pi-heart"
            @click="votar"
            :loading="votando"
            size="large"
            severity="primary"
        />
    </div>
</div>
</template>
<script src="./DetalhesTema.js"></script>
<style scoped></style>
