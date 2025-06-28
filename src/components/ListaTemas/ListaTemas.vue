<template>
    <div>
        <!-- Header -->
        <div class="mb-4">
            <div class="flex align-items-center justify-content-between">
                <div>
                    <h2 class="text-2xl font-bold mb-2">
                        Temas para Votação
                    </h2>
                    <p class="">
                        Escolha um tema e vote para participar da votação
                    </p>
                </div>
                <button
                    label="Atualizar"
                    icon="pi pi-refresh"
                    @click="carregarTemas"
                    :loading="loading"
                    class="refresh-button"
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
        <!-- Empty State -->
        <div
            v-else-if="!loading && !error && temasAtivos.length === 0"
            class="text-center p-6"
        >
            <i class="pi pi-inbox text-6xl mb-3"></i>
            <h3 class="text-xl mb-2">Nenhum tema disponível</h3>
            <p class="">
                Não há temas ativos para votação no momento.
            </p>
        </div>
        <!-- Temas Grid -->
        <div v-else-if="!loading && !error && temasAtivos.length > 0" class="grid">
            <div
                v-for="tema in temasAtivos"
                :key="tema.id"
                class="col-6 sm:col-6 md:col-6 lg:col-4 xl:col-4"
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
                        </div>
                    </template>
                    <template #title>
                        <h3 class="text-xl font-semibold mb-2">
                            {{ tema.nome }}
                        </h3>
                    </template>
                    <template #content>
                        <div class="flex flex-column h-full">
                            <p class="mb-3 line-height-1-5">
                                {{ truncateDescription(tema.descricao, 120) }}
                            </p>
                            <div class="mt-auto flex align-items-center justify-content-between text-sm">
                                <span>
                                    <i class="pi pi-calendar mr-1"></i>
                                    {{ formatDate(tema.created_at) }}
                                </span>
                                <span v-if="tema.totalVotos > 0">
                                    <i class="pi pi-heart mr-1"></i>
                                    {{ tema.totalVotos }} voto{{ tema.totalVotos !== 1 ? 's' : '' }}
                                </span>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex gap-2">
                            <Button
                                label="Votar"
                                icon="pi pi-heart"
                                @click="votar(tema)"
                                :loading="votando === tema.id"
                                :disabled="votando === tema.id"
                                class="flex-1"
                                severity="primary"
                            />
                            <Button
                                label="Detalhes"
                                icon="pi pi-eye"
                                @click="verDetalhes(tema)"
                                class="flex-1"
                                severity="primary"
                                outlined
                            />
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>
<script src="./ListaTemas.js"></script>
<style scoped></style>
