<template>
    <!-- Breadcrumbs -->
    <ul class="flex space-x-2 rtl:space-x-reverse">
        <li>
            <router-link to="/company/list" class="text-primary hover:underline">Empresas</router-link>
        </li>
        <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Visualizar Empresa</span>
        </li>
    </ul>

    <div class="pt-5">
        <div class="flex items-center justify-between mb-5">
            <h5 class="font-semibold text-lg dark:text-white-light">
                {{ company?.name || 'Carregando...' }}
            </h5>
            <div class="flex gap-2">
                <router-link
                    :to="`/company/add/${company?.id}`"
                    v-if="company"
                    class="btn btn-warning gap-2"
                >
                    <IconEdit class="w-4 h-4" />
                    Editar
                </router-link>
                <router-link to="/company/list" class="btn btn-outline-secondary gap-2">
                    <IconArrowLeft class="w-4 h-4" />
                    Voltar
                </router-link>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="animate-spin border-4 border-primary border-l-transparent rounded-full w-8 h-8"></div>
        </div>

        <!-- Company Not Found -->
        <div v-else-if="!company" class="panel text-center py-20">
            <h3 class="text-xl font-semibold mb-4">Empresa não encontrada</h3>
            <p class="text-gray-500 mb-6">A empresa solicitada não existe ou foi removida.</p>
            <router-link to="/company/list" class="btn btn-primary">
                Voltar para Lista
            </router-link>
        </div>

        <!-- Company Details -->
        <div v-else>
            <TabGroup>
                <TabList class="flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconBuilding class="w-5 h-5" />
                            Dados Gerais
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconDollarSignCircle class="w-5 h-5" />
                            Financeiro
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconPhone class="w-5 h-5" />
                            Contatos
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconStar class="w-5 h-5" />
                            Benefícios
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconUser class="w-5 h-5" />
                            Clientes
                        </a>
                    </Tab>
                </TabList>

                <TabPanels>
                    <!-- Dados Gerais -->
                    <TabPanel>
                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <!-- Informações Básicas -->
                            <div class="panel">
                                <h6 class="text-lg font-bold mb-5">Informações Básicas</h6>

                                <div class="flex flex-col gap-6">
                                    <!-- Logo -->
                                    <div class="flex justify-center mb-6">
                                        <img
                                            :src="company.logoUrl || '/assets/images/no-company.png'"
                                            :alt="company.name"
                                            class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                                            @error="handleImageError"
                                        />
                                    </div>

                                    <div class="grid grid-cols-1 gap-4">
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Nome da Empresa</label>
                                            <p class="text-lg">{{ company.name || '-' }}</p>
                                        </div>
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">CNPJ</label>
                                            <p class="text-lg">{{ formatCNPJ(company.cnpj) }}</p>
                                        </div>
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">OAB</label>
                                            <p class="text-lg">{{ company.oab || '-' }}</p>
                                        </div>
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Descrição</label>
                                            <p class="text-lg">{{ company.description || '-' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Contrato -->
                            <div class="panel">
                                <h6 class="text-lg font-bold mb-5">Contrato</h6>

                                <div v-if="company.urlContract" class="text-center">
                                    <div class="mb-4">
                                        <IconDocument class="w-20 h-20 text-primary mx-auto mb-3" />
                                        <p class="text-sm text-gray-600">Contrato disponível</p>
                                    </div>
                                    <a
                                        :href="company.urlContract"
                                        target="_blank"
                                        class="btn btn-primary gap-2"
                                    >
                                        <IconDownload class="w-4 h-4" />
                                        Baixar Contrato
                                    </a>
                                </div>
                                <div v-else class="text-center py-8">
                                    <IconDocument class="w-20 h-20 text-gray-400 mx-auto mb-3" />
                                    <p class="text-gray-500">Nenhum contrato cadastrado</p>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Financeiro -->
                    <TabPanel>
                        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <!-- Valor Mensal -->
                            <div class="panel">
                                <h6 class="text-lg font-bold mb-5">Valor Mensal</h6>

                                <div class="text-center">
                                    <div class="text-4xl font-bold text-success mb-2">
                                        {{ formatCurrency(company.monthlyValue) }}
                                    </div>
                                    <p class="text-gray-600">Valor por cliente/mês</p>
                                </div>
                            </div>

                            <!-- Dados Bancários -->
                            <div class="panel">
                                <h6 class="text-lg font-bold mb-5">Dados Bancários</h6>

                                <div v-if="company.bank" class="grid grid-cols-1 gap-4">
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Banco</label>
                                        <p class="text-lg">{{ company.bank.name || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Agência</label>
                                        <p class="text-lg">{{ company.bank.agency || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Conta</label>
                                        <p class="text-lg">{{ company.bank.account || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Titular</label>
                                        <p class="text-lg">{{ company.bank.account || '-' }}</p>
                                    </div>
                                </div>
                                <div v-else class="text-center py-8">
                                    <p class="text-gray-500">Dados bancários não cadastrados</p>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Contatos -->
                    <TabPanel>
                        <div class="panel">
                            <h6 class="text-lg font-bold mb-5">Informações de Contato</h6>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">E-mail</label>
                                    <p class="text-lg">
                                        <a :href="`mailto:${company.email}`" class="text-primary hover:underline">
                                            {{ company.email || '-' }}
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Telefone Principal</label>
                                    <p class="text-lg">
                                        <a :href="`tel:${company.phone}`" class="text-primary hover:underline">
                                            {{ formatPhone(company.phone) }}
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">WhatsApp</label>
                                    <p class="text-lg">
                                        <a
                                            v-if="company.whatsapp"
                                            :href="`https://wa.me/${company.whatsapp.replace(/\D/g, '')}`"
                                            target="_blank"
                                            class="text-primary hover:underline"
                                        >
                                            {{ formatPhone(company.whatsapp) }}
                                        </a>
                                        <span v-else>-</span>
                                    </p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Telefone Emergência</label>
                                    <p class="text-lg">
                                        <a
                                            v-if="company.phoneEmergencia"
                                            :href="`tel:${company.phoneEmergencia}`"
                                            class="text-primary hover:underline"
                                        >
                                            {{ formatPhone(company.phoneEmergencia) }}
                                        </a>
                                        <span v-else>-</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Benefícios -->
                    <TabPanel>
                        <div class="panel">
                            <h6 class="text-lg font-bold mb-5">Benefícios Oferecidos</h6>

                            <div v-if="company.beneficios && company.beneficios.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div
                                    v-for="beneficio in company.beneficios"
                                    :key="beneficio"
                                    class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span class="font-medium">{{ getBeneficioLabel(beneficio) }}</span>
                                </div>
                            </div>
                            <div v-else class="text-center py-8">
                                <IconStar class="w-20 h-20 text-gray-400 mx-auto mb-3" />
                                <p class="text-gray-500">Nenhum benefício cadastrado</p>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Clientes -->
                    <TabPanel>
                        <div class="panel">
                            <div class="flex items-center justify-between mb-5">
                                <h6 class="text-lg font-bold">Clientes da Empresa</h6>
                                <span class="badge badge-primary">{{ companyClients.length }} cliente(s)</span>
                            </div>

                            <div v-if="companyClients.length > 0" class="overflow-x-auto">
                                <table class="table-auto w-full border border-gray-200 dark:border-gray-700">
                                    <thead class="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th class="px-4 py-3 text-left">Nome</th>
                                        <th class="px-4 py-3 text-left">CPF</th>
                                        <th class="px-4 py-3 text-left">Email</th>
                                        <th class="px-4 py-3 text-center">Plano Ativo</th>
                                        <th class="px-4 py-3 text-center">Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="client in companyClients" :key="client.uid" class="border-b border-gray-200 dark:border-gray-700">
                                        <td class="px-4 py-3">{{ client.name || '-' }}</td>
                                        <td class="px-4 py-3">{{ formatCPF(client.cpf) }}</td>
                                        <td class="px-4 py-3">{{ client.email || '-' }}</td>
                                        <td class="px-4 py-3 text-center">
                                                <span
                                                    class="badge"
                                                    :class="client.isPlanoAtivo ? 'badge-success' : 'badge-secondary'"
                                                >
                                                    {{ client.isPlanoAtivo ? 'Ativo' : 'Inativo' }}
                                                </span>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <router-link
                                                :to="`/customers/view/${client.uid}`"
                                                class="btn btn-sm btn-outline-info"
                                                title="Visualizar Cliente"
                                            >
                                                <IconEye class="w-4 h-4" />
                                            </router-link>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="text-center py-8">
                                <IconUser class="w-20 h-20 text-gray-400 mx-auto mb-3" />
                                <p class="text-gray-500">Nenhum cliente vinculado a esta empresa</p>
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
    import { CompanyModel } from '@/models/CompanyModel';
    import { CustomerModel } from '@/models/CustomerModel';
    import CompanyService from '@/services/CompanyService';
    import CustomerService from '@/services/CustomerService';
    import BeneficioType, { BeneficioTypeLabels } from '@/enums/BeneficioType';
    import Swal from 'sweetalert2';

    // Importar ícones
    import IconBuilding from '@/components/icon/icon-building.vue';
    import IconDollarSignCircle from '@/components/icon/icon-dollar-sign-circle.vue';
    import IconPhone from '@/components/icon/icon-phone.vue';
    import IconStar from '@/components/icon/icon-star.vue';
    import IconUser from '@/components/icon/icon-user.vue';
    import IconEdit from '@/components/icon/icon-edit.vue';
    import IconArrowLeft from '@/components/icon/icon-arrow-left.vue';
    import IconDocument from '@/components/icon/icon-document.vue';
    import IconDownload from '@/components/icon/icon-download.vue';
    import IconEye from '@/components/icon/icon-eye.vue';

    const route = useRoute();
    const router = useRouter();

    // Estados
    const company = ref<CompanyModel | null>(null);
    const allCustomers = ref<CustomerModel[]>([]);
    const isLoading = ref(true);

    // Computed para clientes da empresa
    const companyClients = computed(() => {
        if (!company.value?.id) return [];
        return allCustomers.value.filter(customer => customer.companyId === company.value?.id);
    });

    // Carregar dados da empresa
    onMounted(async () => {
        await loadCompany();
    });

    const loadCompany = async () => {
        isLoading.value = true;
        try {
            const companyId = Array.isArray(route.params.id) ?
                route.params.id[0] : route.params.id;

            if (!companyId) {
                throw new Error('ID da empresa não fornecido');
            }

            // Carregar empresa e clientes em paralelo
            const [companyData, customersData] = await Promise.all([
                CompanyService.getCompanyById(companyId),
                CustomerService.getAllCustomers()
            ]);

            if (!companyData) {
                company.value = null;
                return;
            }

            company.value = companyData;
            allCustomers.value = customersData;

        } catch (error) {
            console.error('Erro ao carregar empresa:', error);
            Swal.fire('Erro', 'Erro ao carregar dados da empresa', 'error');
            company.value = null;
        } finally {
            isLoading.value = false;
        }
    };

    // Métodos de formatação
    const formatCNPJ = (cnpj: string | undefined): string => {
        if (!cnpj) return '-';
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    };

    const formatCPF = (cpf: string | undefined): string => {
        if (!cpf) return '-';
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    };

    const formatPhone = (phone: string | undefined): string => {
        if (!phone) return '-';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        }
        return phone;
    };

    const formatCurrency = (value: number | undefined): string => {
        if (!value) return 'R$ 0,00';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const getBeneficioLabel = (beneficio: BeneficioType): string => {
        return BeneficioTypeLabels[beneficio] || beneficio;
    };

    // Handler para erro de imagem
    const handleImageError = (event: Event) => {
        const img = event.target as HTMLImageElement;
        img.src = '/assets/images/no-company.png';
    };
</script>

<style scoped>
    .badge {
        @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
    }

    .badge-primary {
        @apply bg-primary/10 text-primary;
    }

    .badge-success {
        @apply bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100;
    }

    .badge-secondary {
        @apply bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300;
    }
</style>
