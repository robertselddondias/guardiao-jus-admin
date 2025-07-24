<template>
    <!-- Breadcrumbs -->
    <ul class="flex space-x-2 rtl:space-x-reverse">
        <li>
            <a href="javascript:" class="text-primary hover:underline">Empresas</a>
        </li>
        <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Lista de Empresas</span>
        </li>
    </ul>

    <div class="pt-5">
        <div class="flex items-center justify-between mb-5">
            <h5 class="font-semibold text-lg dark:text-white-light">Lista de Empresas</h5>
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">{{ filteredCompanies.length }} empresa(s) encontrada(s)</span>
            </div>
        </div>

        <!-- Filtros -->
        <div class="panel mb-5">
            <div class="flex flex-wrap items-center gap-4 p-4">
                <div class="flex items-center gap-2">
                    <label class="text-sm font-medium">Status:</label>
                    <select v-model="statusFilter" @change="applyFilters" class="form-select w-auto">
                        <option value="">Todos</option>
                        <option value="with-clients">Com Clientes</option>
                        <option value="without-clients">Sem Clientes</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-sm font-medium">Valor:</label>
                    <select v-model="valorFilter" @change="applyFilters" class="form-select w-auto">
                        <option value="">Todos</option>
                        <option value="0-100">R$ 0 - R$ 100</option>
                        <option value="100-500">R$ 100 - R$ 500</option>
                        <option value="500-1000">R$ 500 - R$ 1.000</option>
                        <option value="1000+">Acima de R$ 1.000</option>
                    </select>
                </div>
                <button @click="clearFilters" class="btn btn-outline-secondary">
                    <IconRefresh class="w-4 h-4 mr-1" />
                    Limpar Filtros
                </button>
            </div>
        </div>

        <!-- Tabela -->
        <div class="panel px-0 pb-1.5 border-[#e0e6ed] dark:border-[#1b2e4b]">
            <div class="datatable invoice-table">
                <div class="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div class="ltr:ml-auto rtl:mr-auto">
                        <input v-model="search" type="text" class="form-input" placeholder="Pesquisar por nome, CNPJ, email ou telefone..." />
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="exportData" class="btn btn-outline-primary gap-2">
                            <IconDownload class="w-4 h-4" />
                            Exportar
                        </button>
                        <button @click="loadData" class="btn btn-outline-secondary gap-2" :disabled="isLoading">
                            <IconRefresh class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
                            Atualizar
                        </button>
                        <router-link to="/company/add" class="btn btn-primary gap-2">
                            <IconPlus class="w-4 h-4" />
                            Adicionar Empresa
                        </router-link>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <vue3-datatable
                        ref="datatable"
                        :rows="filteredCompanies"
                        :columns="cols"
                        :totalRows="filteredCompanies?.length"
                        :hasCheckbox="false"
                        :sortable="true"
                        :search="search"
                        :searchText="searchText"
                        :tableOption="tableOption"
                        skin="whitespace-nowrap bh-table-hover"
                        firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                        lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                        previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                        nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    >
                        <template #name="data">
                            <div class="flex items-center gap-3">
                                <img
                                    :src="data.value.logoUrl || '/assets/images/no-company.png'"
                                    :alt="data.value.name"
                                    class="w-10 h-10 rounded-full object-cover border border-gray-200"
                                    @error="handleImageError"
                                />
                                <div>
                                    <div class="font-semibold text-primary cursor-pointer hover:underline" @click="viewCompany(data.value.id)">
                                        {{ data.value.name }}
                                    </div>
                                    <div class="text-xs text-gray-500">{{ data.value.oab || 'OAB não informado' }}</div>
                                </div>
                            </div>
                        </template>

                        <template #cnpj="data">
                            <div class="text-sm">
                                {{ formatCNPJ(data.value.cnpj) }}
                            </div>
                        </template>

                        <template #email="data">
                            <div class="text-sm">
                                <a :href="`mailto:${data.value.email}`" class="text-primary hover:underline">
                                    {{ data.value.email }}
                                </a>
                            </div>
                        </template>

                        <template #phone="data">
                            <div class="text-sm">
                                <a :href="`tel:${data.value.phone}`" class="text-primary hover:underline">
                                    {{ formatPhone(data.value.phone) }}
                                </a>
                            </div>
                        </template>

                        <template #monthlyValue="data">
                            <div class="text-sm font-medium text-success">
                                {{ formatCurrency(data.value.monthlyValue) }}
                            </div>
                        </template>

                        <template #clientCount="data">
                            <div class="text-center">
                            <span class="badge" :class="getClientCountClass(getClientCount(data.value.id))">
                                {{ getClientCount(data.value.id) }}
                            </span>
                            </div>
                        </template>

                        <template #actions="data">
                            <div class="flex items-center justify-center gap-2">
                                <button
                                    @click="viewCompany(data.value.id)"
                                    class="btn btn-sm btn-outline-info"
                                    title="Visualizar"
                                >
                                    <IconEye class="w-4 h-4" />
                                </button>
                                <button
                                    @click="editCompany(data.value.id)"
                                    class="btn btn-sm btn-outline-warning"
                                    title="Editar"
                                >
                                    <IconEdit class="w-4 h-4" />
                                </button>
                            </div>
                        </template>
                    </vue3-datatable>
                </div>
            </div>
        </div>

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <div class="animate-spin border-4 border-primary border-l-transparent rounded-full w-8 h-8 mx-auto mb-3"></div>
                <p>Carregando...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { CompanyModel } from '@/models/CompanyModel';
    import { CustomerModel } from '@/models/CustomerModel';
    import CompanyService from '@/services/CompanyService';
    import CustomerService from '@/services/CustomerService';
    import Vue3Datatable from '@bhplugin/vue3-datatable';
    import Swal from 'sweetalert2';

    // Importar ícones
    import IconPlus from '@/components/icon/icon-plus.vue';
    import IconEdit from '@/components/icon/icon-edit.vue';
    import IconEye from '@/components/icon/icon-eye.vue';
    import IconDownload from '@/components/icon/icon-download.vue';
    import IconRefresh from '@/components/icon/icon-refresh.vue';

    const router = useRouter();

    // Estados
    const companies = ref<CompanyModel[]>([]);
    const customers = ref<CustomerModel[]>([]);
    const isLoading = ref(false);

    // Filtros
    const statusFilter = ref('');
    const valorFilter = ref('');

    // Configuração da tabela
    const datatable: any = ref(null);
    const search = ref('');
    const searchText = ref('');

    const cols = ref([
        { field: 'name', title: 'Empresa', type: 'html' },
        { field: 'cnpj', title: 'CNPJ', type: 'html' },
        { field: 'email', title: 'E-mail', type: 'html' },
        { field: 'phone', title: 'Telefone', type: 'html' },
        { field: 'monthlyValue', title: 'Valor Mensal', type: 'html', headerClass: 'justify-center' },
        { field: 'clientCount', title: 'Clientes', type: 'html', headerClass: 'justify-center' },
        { field: 'actions', title: 'Ações', sort: false, headerClass: 'justify-center', type: 'html' },
    ]);

    const tableOption = ref({
        headings: {
            id: (h: any, row: any, index: number) => {
                return '#';
            },
        },
        perPage: 20,
        perPageValues: [10, 20, 30, 50, 100],
        skin: 'table-hover',
        columnsClasses: {
            actions: 'actions !text-center w-1',
            monthlyValue: '!text-center',
            clientCount: '!text-center'
        },
        pagination: { show: true, nav: 'scroll', chunk: 10 },
        texts: {
            count: '{to} de {count} registros',
            filter: '',
            filterPlaceholder: 'Pesquisar...',
            limit: '',
        },
        resizableColumns: false,
        sortable: ['name', 'email', 'cnpj', 'monthlyValue'],
        sortIcon: {
            base: 'sort-icon-none',
            up: 'sort-icon-asc',
            down: 'sort-icon-desc',
        },
    });

    // Computed para empresas filtradas
    const filteredCompanies = computed(() => {
        let filtered = [...companies.value];

        // Filtro por status (com/sem clientes)
        if (statusFilter.value === 'with-clients') {
            filtered = filtered.filter(company => getClientCount(company.id) > 0);
        } else if (statusFilter.value === 'without-clients') {
            filtered = filtered.filter(company => getClientCount(company.id) === 0);
        }

        // Filtro por valor
        if (valorFilter.value) {
            filtered = filtered.filter(company => {
                const valor = company.monthlyValue || 0;
                switch (valorFilter.value) {
                    case '0-100':
                        return valor >= 0 && valor <= 100;
                    case '100-500':
                        return valor > 100 && valor <= 500;
                    case '500-1000':
                        return valor > 500 && valor <= 1000;
                    case '1000+':
                        return valor > 1000;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    });

    // Carregar dados ao montar o componente
    onMounted(async () => {
        await loadData();
    });

    // Carregar empresas e clientes
    const loadData = async () => {
        isLoading.value = true;
        try {
            const [companiesData, customersData] = await Promise.all([
                CompanyService.getAllCompanies(),
                CustomerService.getAllCustomers()
            ]);

            companies.value = companiesData;
            customers.value = customersData;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire('Erro', 'Erro ao carregar dados', 'error');
        } finally {
            isLoading.value = false;
        }
    };

    // Métodos de ação
    const viewCompany = (id: string) => {
        router.push(`/company/view/${id}`);
    };

    const editCompany = (id: string) => {
        router.push(`/company/${id}`); // Corrigido: usa a mesma rota de add com ID para edição
    };

    // Métodos de filtro
    const applyFilters = () => {
        // Os filtros são aplicados automaticamente via computed
    };

    const clearFilters = () => {
        statusFilter.value = '';
        valorFilter.value = '';
        search.value = '';
    };

    // Métodos de formatação
    const formatCNPJ = (cnpj: string | undefined): string => {
        if (!cnpj) return '-';
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
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

    // Métodos de contagem de clientes
    const getClientCount = (companyId: string | undefined): number => {
        if (!companyId) return 0;
        return customers.value.filter(customer => customer.companyId === companyId).length;
    };

    const getClientCountClass = (count: number): string => {
        if (count === 0) return 'badge-secondary';
        if (count <= 5) return 'badge-warning';
        if (count <= 20) return 'badge-info';
        return 'badge-success';
    };

    // Métodos de exportação
    const exportData = () => {
        const csvContent = convertToCSV(filteredCompanies.value);
        downloadCSV(csvContent, 'empresas.csv');
    };

    const convertToCSV = (data: CompanyModel[]): string => {
        const headers = ['Nome', 'CNPJ', 'Email', 'Telefone', 'OAB', 'Valor Mensal', 'Clientes'];
        const csvArray = [headers];

        data.forEach(company => {
            const row = [
                company.name || '',
                company.cnpj || '',
                company.email || '',
                company.phone || '',
                company.oab || '',
                formatCurrency(company.monthlyValue),
                getClientCount(company.id).toString()
            ];
            csvArray.push(row);
        });

        return csvArray.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    };

    const downloadCSV = (csvContent: string, filename: string) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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

    .badge-secondary {
        @apply bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300;
    }

    .badge-success {
        @apply bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100;
    }

    .badge-warning {
        @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100;
    }

    .badge-info {
        @apply bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100;
    }
</style>
