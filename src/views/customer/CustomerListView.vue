<template>
    <!-- Breadcrumbs -->
    <ul class="flex space-x-2 rtl:space-x-reverse">
        <li>
            <a href="javascript:" class="text-primary hover:underline">Clientes</a>
        </li>
        <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Lista de Clientes</span>
        </li>
    </ul>

    <div class="pt-5">
        <div class="flex items-center justify-between mb-5">
            <h5 class="font-semibold text-lg dark:text-white-light">Lista de Clientes</h5>
        </div>

        <!-- Filtros -->
        <div class="panel mb-5">
            <div class="flex flex-wrap items-center gap-4 p-4">
                <div class="flex items-center gap-2">
                    <label class="text-sm font-medium">Status:</label>
                    <select v-model="statusFilter" @change="applyFilters" class="form-select w-auto">
                        <option value="">Todos</option>
                        <option value="active">Plano Ativo</option>
                        <option value="inactive">Plano Inativo</option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-sm font-medium">Empresa:</label>
                    <select v-model="companyFilter" @change="applyFilters" class="form-select w-auto">
                        <option value="">Todas</option>
                        <option v-for="company in companies" :key="company.id" :value="company.id">
                            {{ company.name }}
                        </option>
                    </select>
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-sm font-medium">Completude:</label>
                    <select v-model="completionFilter" @change="applyFilters" class="form-select w-auto">
                        <option value="">Todos</option>
                        <option value="complete">Dados Completos</option>
                        <option value="incomplete">Dados Incompletos</option>
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
                        <input v-model="search" type="text" class="form-input" placeholder="Pesquisar por nome, email ou CPF..." />
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="exportData" class="btn btn-outline-primary gap-2">
                            <IconDownload />
                            Exportar
                        </button>
                    </div>
                </div>

                <vue3-datatable
                    ref="datatable"
                    :rows="filteredCustomers"
                    :columns="cols"
                    :totalRows="filteredCustomers?.length"
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
                            <!-- Avatar com foto ou iniciais -->
                            <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
                                <img
                                    v-if="data.value.photoUrl"
                                    :src="data.value.photoUrl"
                                    :alt="data.value.name"
                                    class="w-full h-full object-cover"
                                />
                                <span
                                    v-else
                                    class="text-primary font-semibold text-sm"
                                >
                                    {{ getInitials(data.value.name) }}
                                </span>
                            </div>
                            <div>
                                <div class="font-semibold">{{ data.value.name }}</div>
                                <div class="text-xs text-gray-500">{{ data.value.email }}</div>
                            </div>
                        </div>
                    </template>

                    <template #cpf="data">
                        <span>{{ formatCpf(data.value.cpf) }}</span>
                    </template>

                    <template #phone="data">
                        <span>{{ formatPhone(data.value.phone) }}</span>
                    </template>

                    <template #company="data">
                        <span v-if="data.value.companyId">
                            {{ getCompanyName(data.value.companyId) }}
                        </span>
                        <span v-else class="text-gray-400">Sem Convênio</span>
                    </template>

                    <template #status="data">
                        <div class="flex flex-col gap-1">
                            <span v-if="data.value.isPlanoAtivo" class="badge bg-success">Ativo</span>
                            <span v-else class="badge bg-danger">Inativo</span>
                        </div>
                    </template>

                    <template #createdAt="data">
                        <span>{{ formatDate(data.value.createdAt) }}</span>
                    </template>

                    <template #actions="data">
                        <div class="flex gap-2 justify-center">
                            <button
                                @click="viewCustomer(data.value.uid)"
                                class="btn btn-sm btn-outline-primary"
                                title="Visualizar"
                            >
                                <IconEye class="w-4 h-4" />
                            </button>
<!--                            <button-->
<!--                                @click="togglePlan(data.value)"-->
<!--                                :class="data.value.isPlanoAtivo ? 'btn btn-sm btn-outline-danger' : 'btn btn-sm btn-outline-success'"-->
<!--                                :title="data.value.isPlanoAtivo ? 'Desativar Plano' : 'Ativar Plano'"-->
<!--                            >-->
<!--                                <IconToggleLeft v-if="data.value.isPlanoAtivo" class="w-4 h-4" />-->
<!--                                <IconToggleRight v-else class="w-4 h-4" />-->
<!--                            </button>-->
<!--                            <button-->
<!--                                @click="deleteCustomer(data.value.uid)"-->
<!--                                class="btn btn-sm btn-outline-danger"-->
<!--                                title="Excluir"-->
<!--                            >-->
<!--                                <IconTrashLines class="w-4 h-4" />-->
<!--                            </button>-->
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
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { CustomerModel } from '@/models/CustomerModel';
    import { CompanyModel } from '@/models/CompanyModel';
    import CustomerService from '@/services/CustomerService';
    import CompanyService from '@/services/CompanyService';
    import Vue3Datatable from '@bhplugin/vue3-datatable';
    import Swal from 'sweetalert2';

    // Importar ícones
    import IconTrashLines from '@/components/icon/icon-trash-lines.vue';
    import IconPlus from '@/components/icon/icon-plus.vue';
    import IconEdit from '@/components/icon/icon-edit.vue';
    import IconEye from '@/components/icon/icon-eye.vue';
    import IconDownload from '@/components/icon/icon-download.vue';
    import IconRefresh from '@/components/icon/icon-refresh.vue';
    import IconToggleLeft from '@/components/icon/icon-toggle-left.vue';
    import IconToggleRight from '@/components/icon/icon-toggle-right.vue';

    const router = useRouter();

    // Estados
    const customers = ref<CustomerModel[]>([]);
    const companies = ref<CompanyModel[]>([]);
    const isLoading = ref(false);

    // Filtros
    const statusFilter = ref('');
    const companyFilter = ref('');
    const completionFilter = ref('');

    // Configuração da tabela
    const datatable: any = ref(null);
    const search = ref('');
    const searchText = ref('');

    const cols = ref([
        { field: 'name', title: 'Cliente', type: 'html' },
        { field: 'cpf', title: 'CPF', type: 'html' },
        { field: 'phone', title: 'Telefone', type: 'html' },
        { field: 'company', title: 'Empresa', type: 'html' },
        { field: 'status', title: 'Plano Ativo?', type: 'html', headerClass: 'justify-center' },
        { field: 'createdAt', title: 'Criado em', type: 'html' },
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
            status: '!text-center'
        },
        pagination: { show: true, nav: 'scroll', chunk: 10 },
        texts: {
            count: '{to} de {count} registros',
            filter: '',
            filterPlaceholder: 'Pesquisar...',
            limit: '',
        },
        resizableColumns: false,
        sortable: ['name', 'email', 'createdAt'],
        sortIcon: {
            base: 'sort-icon-none',
            up: 'sort-icon-asc',
            down: 'sort-icon-desc',
        },
    });

    // Computed para clientes filtrados
    const filteredCustomers = computed(() => {
        let filtered = [...customers.value];

        // Filtro por status
        if (statusFilter.value === 'active') {
            filtered = filtered.filter(customer => customer.isPlanoAtivo === true);
        } else if (statusFilter.value === 'inactive') {
            filtered = filtered.filter(customer => customer.isPlanoAtivo === false);
        }

        // Filtro por empresa
        if (companyFilter.value) {
            filtered = filtered.filter(customer => customer.companyId === companyFilter.value);
        }

        // Filtro por completude
        if (completionFilter.value === 'complete') {
            filtered = filtered.filter(customer =>
                customer.isPersonalInfoComplete &&
                customer.isAdressInfoComplete &&
                customer.isMilitaryInfoComplete
            );
        } else if (completionFilter.value === 'incomplete') {
            filtered = filtered.filter(customer =>
                !customer.isPersonalInfoComplete ||
                !customer.isAdressInfoComplete ||
                !customer.isMilitaryInfoComplete
            );
        }

        return filtered;
    });

    // Carregar dados ao montar o componente
    onMounted(async () => {
        await loadData();
    });

    // Carregar clientes e empresas
    const loadData = async () => {
        isLoading.value = true;
        try {
            const [customersData, companiesData] = await Promise.all([
                CustomerService.getAllCustomers(),
                CompanyService.getAllCompanies()
            ]);

            customers.value = customersData;
            companies.value = companiesData;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire('Erro', 'Erro ao carregar dados', 'error');
        } finally {
            isLoading.value = false;
        }
    };

    // Métodos de ação
    const viewCustomer = (uid: string) => {
        router.push(`/customers/view/${uid}`);
    };

    const editCustomer = (uid: string) => {
        router.push(`/customers/edit/${uid}`);
    };

    const deleteCustomer = async (uid: string) => {
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: 'Esta ação não pode ser desfeita!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await CustomerService.deleteCustomer(uid);
                customers.value = customers.value.filter(customer => customer.uid !== uid);
                Swal.fire('Excluído!', 'Cliente excluído com sucesso.', 'success');
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
                Swal.fire('Erro', 'Erro ao excluir cliente', 'error');
            }
        }
    };

    const togglePlan = async (customer: CustomerModel) => {
        const action = customer.isPlanoAtivo ? 'desativar' : 'ativar';
        const result = await Swal.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} plano?`,
            text: `Deseja ${action} o plano deste cliente?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sim, ${action}!`,
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                if (customer.isPlanoAtivo) {
                    await CustomerService.deactivateCustomerPlan(customer.uid!);
                } else {
                    await CustomerService.activateCustomerPlan(customer.uid!);
                }

                // Atualizar estado local
                const index = customers.value.findIndex(c => c.uid === customer.uid);
                if (index !== -1) {
                    customers.value[index].isPlanoAtivo = !customer.isPlanoAtivo;
                }

                Swal.fire('Sucesso!', `Plano ${customer.isPlanoAtivo ? 'desativado' : 'ativado'} com sucesso.`, 'success');
            } catch (error) {
                console.error('Erro ao alterar status do plano:', error);
                Swal.fire('Erro', 'Erro ao alterar status do plano', 'error');
            }
        }
    };

    // Métodos de filtro
    const applyFilters = () => {
        // Os filtros são aplicados automaticamente via computed
    };

    const clearFilters = () => {
        statusFilter.value = '';
        companyFilter.value = '';
        completionFilter.value = '';
        search.value = '';
    };

    // Métodos de exportação
    const exportData = () => {
        const csvContent = convertToCSV(filteredCustomers.value);
        downloadCSV(csvContent, 'clientes.csv');
    };

    const convertToCSV = (data: CustomerModel[]): string => {
        const headers = ['Nome', 'Email', 'CPF', 'Telefone', 'Empresa', 'Status', 'Criado em'];
        const csvArray = [headers];

        data.forEach(customer => {
            const row = [
                customer.name || '',
                customer.email || '',
                customer.cpf || '',
                customer.phone || '',
                getCompanyName(customer.companyId || ''),
                customer.isPlanoAtivo ? 'Ativo' : 'Inativo',
                formatDate(customer.createdAt || '')
            ];
            csvArray.push(row);
        });

        return csvArray.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    };

    const downloadCSV = (csvContent: string, filename: string) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Métodos utilitários
    const getInitials = (name: string): string => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatCpf = (cpf: string): string => {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatPhone = (phone: string): string => {
        if (!phone) return '';
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const getCompanyName = (companyId: string): string => {
        const company = companies.value.find(c => c.id === companyId);
        return company?.name || '';
    };

    const getCompletionProgress = (customer: CustomerModel): number => {
        let completed = 0;
        let total = 3;

        if (customer.isPersonalInfoComplete) completed++;
        if (customer.isAdressInfoComplete) completed++;
        if (customer.isMilitaryInfoComplete) completed++;

        return Math.round((completed / total) * 100);
    };
</script>

<style scoped>
    .badge {
        @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
    }

    .bg-success {
        @apply bg-green-100 text-green-800;
    }

    .bg-danger {
        @apply bg-red-100 text-red-800;
    }

    .btn-sm {
        @apply text-xs px-2 py-1;
    }
</style>
