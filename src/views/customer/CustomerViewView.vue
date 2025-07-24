<template>
    <!-- Breadcrumbs -->
    <ul class="flex space-x-2 rtl:space-x-reverse">
        <li>
            <router-link to="/customers" class="text-primary hover:underline">Clientes</router-link>
        </li>
        <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Visualizar Cliente</span>
        </li>
    </ul>

    <div class="pt-5">
        <div class="flex items-center justify-between mb-5">
            <h5 class="font-semibold text-lg dark:text-white-light">
                {{ customer?.name || 'Carregando...' }}
            </h5>
            <div class="flex gap-2">
                <router-link to="/customers" class="btn btn-outline-secondary gap-2">
                    <IconArrowLeft class="w-4 h-4" />
                    Voltar
                </router-link>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="animate-spin border-4 border-primary border-l-transparent rounded-full w-8 h-8"></div>
        </div>

        <!-- Customer Not Found -->
        <div v-else-if="!customer" class="panel text-center py-20">
            <h3 class="text-xl font-semibold mb-4">Cliente não encontrado</h3>
            <p class="text-gray-500 mb-6">O cliente solicitado não existe ou foi removido.</p>
            <router-link to="/customers" class="btn btn-primary">
                Voltar para Lista
            </router-link>
        </div>

        <!-- Customer Details -->
        <div v-else>
            <TabGroup>
                <TabList class="flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconUser class="w-5 h-5" />
                            Dados Pessoais
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconHome class="w-5 h-5" />
                            Endereço
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconShield class="w-5 h-5" />
                            Dados Militares
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconBuilding class="w-5 h-5" />
                            Empresa & Plano
                        </a>
                    </Tab>
                </TabList>

                <TabPanels>
                    <!-- Dados Pessoais -->
                    <TabPanel>
                        <div class="panel">
                            <h6 class="text-lg font-bold mb-5">Informações Pessoais</h6>

                            <!-- Avatar e Info Principal -->
                            <div class="flex flex-col sm:flex-row items-start gap-6 mb-8">
                                <!-- Avatar -->
                                <div class="flex-shrink-0">
                                    <div class="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
                                        <img
                                            v-if="customer.photoUrl"
                                            :src="customer.photoUrl"
                                            :alt="customer.name"
                                            class="w-full h-full object-cover"
                                        />
                                        <span
                                            v-else
                                            class="text-primary font-bold text-2xl"
                                        >
                                            {{ getInitials(customer.name!) }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Info Principal -->
                                <div class="flex-1">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Nome Completo</label>
                                            <p class="text-lg font-medium">{{ customer.name || '-' }}</p>
                                        </div>
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Email</label>
                                            <p class="text-lg">{{ customer.email || '-' }}</p>
                                        </div>
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">CPF</label>
                                            <p class="text-lg">{{ formatCpf(customer.cpf!) || '-' }}</p>
                                        </div>
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Data de Nascimento</label>
                                            <p class="text-lg">{{ formatDate(customer.birthDate!) || '-' }}</p>
                                        </div>
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Telefone</label>
                                            <p class="text-lg">{{ formatPhone(customer.phone!) || '-' }}</p>
                                        </div>
                                        <div>
                                            <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">País</label>
                                            <p class="text-lg">{{ getCountryName(customer.countryCode!) || '-' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Status de Completude -->
                            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h6 class="font-semibold mb-3">Status de Completude dos Dados</h6>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 rounded-full" :class="customer.isPersonalInfoComplete ? 'bg-green-500' : 'bg-red-500'"></div>
                                        <span>Dados Pessoais</span>
                                        <span class="text-sm" :class="customer.isPersonalInfoComplete ? 'text-green-600' : 'text-red-600'">
                                            {{ customer.isPersonalInfoComplete ? 'Completo' : 'Incompleto' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 rounded-full" :class="customer.isAdressInfoComplete ? 'bg-green-500' : 'bg-red-500'"></div>
                                        <span>Endereço</span>
                                        <span class="text-sm" :class="customer.isAdressInfoComplete ? 'text-green-600' : 'text-red-600'">
                                            {{ customer.isAdressInfoComplete ? 'Completo' : 'Incompleto' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="w-3 h-3 rounded-full" :class="customer.isMilitaryInfoComplete ? 'bg-green-500' : 'bg-red-500'"></div>
                                        <span>Dados Militares</span>
                                        <span class="text-sm" :class="customer.isMilitaryInfoComplete ? 'text-green-600' : 'text-red-600'">
                                            {{ customer.isMilitaryInfoComplete ? 'Completo' : 'Incompleto' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Endereço -->
                    <TabPanel>
                        <div class="panel">
                            <h6 class="text-lg font-bold mb-5">Endereço</h6>

                            <div v-if="customer.address" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">CEP</label>
                                    <p class="text-lg">{{ formatCep(customer.address.cep!) || '-' }}</p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Estado</label>
                                    <p class="text-lg">{{ customer.address.uf || '-' }}</p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Cidade</label>
                                    <p class="text-lg">{{ customer.address.city || '-' }}</p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Bairro</label>
                                    <p class="text-lg">{{ customer.address.district || '-' }}</p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Rua</label>
                                    <p class="text-lg">{{ customer.address.street || '-' }}</p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Número</label>
                                    <p class="text-lg">{{ customer.address.number || '-' }}</p>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Complemento</label>
                                    <p class="text-lg">{{ customer.address.complement || '-' }}</p>
                                </div>
                            </div>

                            <div v-else class="text-center py-12">
                                <IconHome class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 class="text-lg font-semibold text-gray-500 mb-2">Nenhum endereço cadastrado</h3>
                                <p class="text-gray-400">O cliente ainda não informou seus dados de endereço.</p>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Dados Militares -->
                    <TabPanel>
                        <div class="panel">
                            <h6 class="text-lg font-bold mb-5">Dados Militares</h6>

                            <div v-if="customer.militarData" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Número de Registro</label>
                                    <p class="text-lg">{{ customer.militarData.registrationNumber || '-' }}</p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Patente</label>
                                    <p class="text-lg">{{ customer.militarData.rank || '-' }}</p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">UF Militar</label>
                                    <p class="text-lg">{{ customer.militarData.militaryUf || '-' }}</p>
                                </div>
                                <div>
                                    <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Entidade</label>
                                    <p class="text-lg">{{ customer.militarData.entity || '-' }}</p>
                                </div>
                            </div>

                            <div v-else class="text-center py-12">
                                <IconShield class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 class="text-lg font-semibold text-gray-500 mb-2">Nenhum dado militar cadastrado</h3>
                                <p class="text-gray-400">O cliente ainda não informou seus dados militares.</p>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Empresa & Plano -->
                    <TabPanel>
                        <div class="space-y-6">
                            <!-- Informações da Empresa -->
                            <div class="panel">
                                <h6 class="text-lg font-bold mb-5">Empresa</h6>

                                <div v-if="companyInfo" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Nome da Empresa</label>
                                        <p class="text-lg">{{ companyInfo.name }}</p>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">CNPJ</label>
                                        <p class="text-lg">{{ formatCnpj(companyInfo.cnpj!) }}</p>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Email</label>
                                        <p class="text-lg">{{ companyInfo.email }}</p>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Telefone</label>
                                        <p class="text-lg">{{ formatPhone(companyInfo.phone!) }}</p>
                                    </div>
                                </div>

                                <div v-else class="text-center py-8">
                                    <IconBuilding class="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                    <p class="text-gray-500">Nenhuma empresa vinculada</p>
                                </div>
                            </div>

                            <!-- Status do Plano -->
                            <div class="panel">
                                <h6 class="text-lg font-bold mb-5">Status do Plano</h6>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Status</label>
                                        <div class="flex items-center gap-2 mt-1">
                                            <span class="badge" :class="customer.isPlanoAtivo ? 'bg-success' : 'bg-danger'">
                                                {{ customer.isPlanoAtivo ? 'Ativo' : 'Inativo' }}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">ID do Contrato</label>
                                        <p class="text-lg">{{ customer.contractId || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">ID do Cliente</label>
                                        <p class="text-lg">{{ customer.customerId || '-' }}</p>
                                    </div>
                                </div>

                                <!-- Ações do Plano -->
                                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div class="flex gap-3">
                                        <button
                                            @click="togglePlan"
                                            :class="customer.isPlanoAtivo ? 'btn btn-danger' : 'btn btn-success'"
                                        >
                                            {{ customer.isPlanoAtivo ? 'Desativar Plano' : 'Ativar Plano' }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Informações Adicionais -->
                            <div class="panel">
                                <h6 class="text-lg font-bold mb-5">Informações Adicionais</h6>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Data de Cadastro</label>
                                        <p class="text-lg">{{ formatDateTime(customer.createdAt!) || '-' }}</p>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">Primeiro Acesso</label>
                                        <p class="text-lg">{{ customer.isFirstAccess ? 'Sim' : 'Não' }}</p>
                                    </div>
                                    <div>
                                        <label class="font-semibold text-sm text-gray-600 dark:text-gray-400">FCM Token</label>
                                        <p class="text-sm text-gray-500 break-all">{{ customer.fcmToken || '-' }}</p>
                                    </div>
                                </div>
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
    import { CustomerModel } from '@/models/CustomerModel';
    import { CompanyModel } from '@/models/CompanyModel';
    import CustomerService from '@/services/CustomerService';
    import CompanyService from '@/services/CompanyService';
    import Swal from 'sweetalert2';

    // Importar ícones
    import IconUser from '@/components/icon/icon-user.vue';
    import IconHome from '@/components/icon/icon-home.vue';
    import IconShield from '@/components/icon/icon-shield.vue';
    import IconBuilding from '@/components/icon/icon-building.vue';
    import IconEdit from '@/components/icon/icon-edit.vue';
    import IconArrowLeft from '@/components/icon/icon-arrow-left.vue';

    const route = useRoute();
    const router = useRouter();

    // Estados
    const customer = ref<CustomerModel | null>(null);
    const companyInfo = ref<CompanyModel | null>(null);
    const isLoading = ref(true);

    // Computed para empresa
    const hasCompany = computed(() => customer.value?.companyId);

    // Carregar dados do cliente
    onMounted(async () => {
        await loadCustomer();
    });

    const loadCustomer = async () => {
        isLoading.value = true;
        try {
            const customerId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

            if (!customerId) {
                throw new Error('ID do cliente não fornecido');
            }

            const customerData = await CustomerService.getCustomerById(customerId);

            if (!customerData) {
                customer.value = null;
                return;
            }

            customer.value = customerData;

            // Carregar dados da empresa se existir
            if (customerData.companyId) {
                try {
                    const company = await CompanyService.getCompanyById(customerData.companyId);
                    companyInfo.value = company;
                } catch (error) {
                    console.warn('Erro ao carregar dados da empresa:', error);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            Swal.fire('Erro', 'Erro ao carregar dados do cliente', 'error');
            customer.value = null;
        } finally {
            isLoading.value = false;
        }
    };

    // Ativar/Desativar plano
    const togglePlan = async () => {
        if (!customer.value) return;

        const action = customer.value.isPlanoAtivo ? 'desativar' : 'ativar';
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
                if (customer.value.isPlanoAtivo) {
                    await CustomerService.deactivateCustomerPlan(customer.value.uid!);
                    customer.value.isPlanoAtivo = false;
                } else {
                    await CustomerService.activateCustomerPlan(customer.value.uid!);
                    customer.value.isPlanoAtivo = true;
                }

                Swal.fire('Sucesso!', `Plano ${action}do com sucesso.`, 'success');
            } catch (error) {
                console.error('Erro ao alterar status do plano:', error);
                Swal.fire('Erro', 'Erro ao alterar status do plano', 'error');
            }
        }
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

    const formatCnpj = (cnpj: string): string => {
        if (!cnpj) return '';
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    const formatPhone = (phone: string): string => {
        if (!phone) return '';
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const formatCep = (cep: string): string => {
        if (!cep) return '';
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
    };

    const getCountryName = (countryCode: string): string => {
        const countries: Record<string, string> = {
            'BR': 'Brasil',
            'US': 'Estados Unidos',
            'AR': 'Argentina',
            'UY': 'Uruguai',
            'PY': 'Paraguai',
            'CL': 'Chile',
            'PE': 'Peru',
            'BO': 'Bolívia',
            'CO': 'Colômbia',
            'VE': 'Venezuela',
            'EC': 'Equador',
            'GY': 'Guiana',
            'SR': 'Suriname',
            'GF': 'Guiana Francesa',
        };

        return countries[countryCode] || countryCode;
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
</style>
