<template>
    <div>
    <!-- Header -->
    <div class="mb-4">
        <Button
            label="Voltar"
            icon="pi pi-arrow-left"
            text
            @click="$emit('voltar')"
            class="mb-3 back-button"
        />
        <div class="flex align-items-center justify-content-between">
            <div>
                <h2 class="text-2xl font-bold mb-2">
                    Painel de Administração
                </h2>
                <p class="">
                    Gerencie temas e visualize estatísticas
                </p>
            </div>
            <Button
                label="Novo Tema"
                icon="pi pi-plus"
                @click="abrirDialogNovoTema"
                severity="primary"
            />
        </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-content-center p-4">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-4 surface-100 border-round border-red-200">
        <div class="flex align-items-center">
            <i class="pi pi-exclamation-triangle text-red-500 mr-2"></i>
            <span class="text-red-700">{{ error }}</span>
        </div>
    </div>

    <!-- Temas Grid -->
    <div v-else class="grid">
        <div
            v-for="tema in temas"
            :key="tema.id"
            class="col-12 sm:col-6 lg:col-4 xl:col-3"
        >
            <Card class="h-full">
                <template #header>
                    <div class="relative">
                        <img
                            :src="getValidImageUrl(tema.foto)"
                            :alt="tema.nome"
                            class="w-full border-round-top"
                            style="height: 192px; object-fit: cover;"
                            @error="handleImageError"
                        />
                        <div class="absolute top-2 right-2">
                            <Badge
                                :value="tema.totalVotos || 0"
                                severity="info"
                                class="font-bold"
                            />
                        </div>
                        <Tag
                            v-if="!tema.ativo"
                            value="Inativo"
                            severity="danger"
                            class="absolute top-2 left-2"
                        />
                    </div>
                </template>

                <template #title>
                    <div class="w-15rem w-2rem text-overflow-ellipsis overflow-hidden">
                        <h3 class="text-xl font-semibold text-primary-500 mb-2">
                            {{ tema.nome }}
                        </h3>
                    </div>
                </template>

                <template #content>
                    <div class="flex flex-column h-full">
                        <p class="mb-3 line-height-1-5">
                            {{ truncateDescription(tema.descricao, 100) }}
                        </p>

                        <div class="mt-auto">
                            <div class="grid">
                                <div class="col-6">
                                    <div class="text-sm">Criado em</div>
                                    <div class="font-semibold text-xs">
                                        {{ formatDate(tema.dataCriacao) }}
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="text-sm">Total de votos</div>
                                    <div class="font-semibold text-primary">
                                        {{ tema.totalVotos || 0 }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #footer>
                    <div class="flex gap-2">
                        <Button
                            label="Editar"
                            icon="pi pi-pencil"
                            @click="editarTema(tema)"
                            severity="secondary"
                            outlined
                            class="flex-1"
                        />
                        <Button
                            :label="tema.ativo ? 'Desativar' : 'Ativar'"
                            :icon="tema.ativo ? 'pi pi-ban' : 'pi pi-check'"
                            @click="tema.ativo ? inativarTema(tema) : ativarTema(tema)"
                            :severity="tema.ativo ? 'warn' : 'success'"
                            class="flex-1"
                        />
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <!-- Dialog para Criar/Editar Tema -->
    <Dialog
        v-model:visible="dialogVisible"
        :header="editando ? 'Editar Tema' : 'Novo Tema'"
        modal
        class="w-6"
    >
        <form @submit.prevent="salvarTema">
            <div class="field mb-4">
                <label for="nome" class="block font-semibold mb-2">
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
                <label for="descricao" class="block font-semibold mb-2">
                    Descrição
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
                <label for="foto" class="block font-semibold mb-2">
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

            <div class="flex gap-2 justify-content-end">
                <Button
                    type="button"
                    label="Cancelar"
                    icon="pi pi-times"
                    @click="fecharDialog"
                    severity="secondary"
                    outlined
                />
                <Button
                    type="submit"
                    label="Salvar"
                    icon="pi pi-check"
                    :loading="salvando"
                    severity="primary"
                />
            </div>
        </form>
    </Dialog>

    <!-- Dialog de Detalhes -->
    <Dialog
        v-model:visible="dialogDetalhesVisible"
        header="Detalhes do Tema"
        modal
        class="w-8"
    >
        <DetalhesTema
            v-if="temaSelecionado"
            :tema="temaSelecionado"
            @fechar="dialogDetalhesVisible = false"
        />
    </Dialog>
</div> 
</template>
<script src="./PainelAdministracao.js"></script>
<style scoped></style>
