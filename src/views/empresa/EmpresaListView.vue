<template>
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
        </div>
        <div class="panel px-0 pb-1.5 border-[#e0e6ed] dark:border-[#1b2e4b]">
            <div class="datatable invoice-table">
                <div class="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div class="ltr:ml-auto rtl:mr-auto">
                        <input v-model="search" type="text" class="form-input" placeholder="Pesquisar..." />
                    </div>
                    <div class="flex items-center gap-2">
                        <router-link to="/company/add" class="btn btn-primary gap-2">
                            <icon-plus />
                            Adicionar Empresa
                        </router-link>
                    </div>
                </div>

                <vue3-datatable
                    ref="datatable"
                    :rows="companies"
                    :columns="cols"
                    :totalRows="companies?.length"
                    :hasCheckbox="false"
                    :sortable="true"
                    :search="search"
                    :searchText="searchText"
                    :tableOption="tableOption"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #name="data">
                        <div class="flex items-center font-semibold">
                            <div class="p-0.5 bg-white-dark/30 rounded-full w-max ltr:mr-2 rtl:ml-2">
                                <img class="h-8 w-8 rounded-full object-cover" :src="data.value.logoUrl" alt="Logo" />
                            </div>
                            {{ data.value.name }}
                        </div>
                    </template>
                    <template #amount="data">
                        <div class="font-semibold ltr:text-right rtl:text-left">${{ data.value.amount }}</div>
                    </template>
                    <template #status="data">
                        <span class="badge" :class="[data.value.status.toLowerCase() === 'paid' ? 'badge-outline-success' : 'badge-outline-danger']">{{
                                data.value.status
                            }}</span>
                    </template>
                    <template #actions="data">
                        <div class="flex gap-4 items-center justify-center">
                            <router-link :to="'/company/' + data.value.id" class="hover:text-info">
                                <icon-edit class="w-4.5 h-4.5" />
                            </router-link>
                            <router-link to="/apps/invoice/preview" class="hover:text-primary">
                                <icon-eye />
                            </router-link>
                            <button type="button" class="hover:text-danger" >
                                <icon-trash-lines />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref } from 'vue';
    import CompanyService from '@/services/CompanyService';
    import { CompanyModel } from '@/models/CompanyModel';
    import Vue3Datatable from '@bhplugin/vue3-datatable';

    import IconTrashLines from '@/components/icon/icon-trash-lines.vue';
    import IconPlus from '@/components/icon/icon-plus.vue';
    import IconEdit from '@/components/icon/icon-edit.vue';
    import IconEye from '@/components/icon/icon-eye.vue';

    const companies = ref<CompanyModel[]>([]);

    const datatable: any = ref(null);
    const search = ref('');
    const cols = ref([
        { field: 'name', title: 'Nome' },
        { field: 'cnpj', title: 'CNPJ' },
        { field: 'email', title: 'E-mail' },
        { field: 'phone', title: 'Telefone', headerClass: 'justify-end' },
        { field: 'actions', title: 'Ações', sort: false, headerClass: 'justify-center' },
    ]);

    const searchText = ref('');
    const tableOption = ref({
        headings: {
            id: (h: any, row: any, index: number) => {
                return '#';
            },
        },
        perPage: 10,
        perPageValues: [10, 20, 30, 50, 100],
        skin: 'table-hover',
        columnsClasses: { actions: 'actions !text-center w-1' },
        pagination: { show: true, nav: 'scroll', chunk: 10 },
        texts: {
            count: '{to} de {count} entries',
            filter: '',
            filterPlaceholder: 'Pesquisar...',
            limit: '',
        },
        resizableColumns: false,
        sortable: ['name', 'email'],
        sortIcon: {
            base: 'sort-icon-none',
            up: 'sort-icon-asc',
            down: 'sort-icon-desc',
        },
    });

    // Carregar as empresas ao montar o componente
    onMounted(async () => {
        try {
            companies.value = await CompanyService.getAllCompanies(); // Recuperando empresas do serviço
        } catch (error) {
            console.error('Erro ao carregar empresas:', error);
        }
    });

    // Método para editar uma empresa
    const editCompany = (id: string) => {
        console.log('Edit company', id);
        // Lógica para editar a empresa
    };

    // Método para excluir uma empresa
    const deleteCompany = async (id: string) => {
        try {
            await CompanyService.deleteCompany(id); // Excluindo a empresa
            companies.value = companies.value.filter((company) => company.id !== id); // Atualizando a lista
            console.log('Empresa excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir a empresa:', error);
        }
    };
</script>

<style scoped>

</style>
