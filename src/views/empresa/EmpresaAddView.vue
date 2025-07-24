<template>
    <div>
        <ul class="flex space-x-2 rtl:space-x-reverse">
            <li>
                <a href="javascript:" class="text-primary hover:underline">Empresas</a>
            </li>
            <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Adicionar Empresas</span>
            </li>
        </ul>
        <div class="pt-5">
            <div class="flex items-center justify-between mb-5">
                <h5 class="font-semibold text-lg dark:text-white-light">Adicionar Empresas</h5>
            </div>
            <TabGroup>
                <TabList class="flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <icon-home />
                            Home
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <icon-dollar-sign-circle />
                            Dados Financeiros
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <icon-user class="w-5 h-5" />
                            Beneficios
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <icon-phone />
                            Atividades
                        </a>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>

                        <div>
                            <form class="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-[#0e1726]">
                                <h6 class="text-lg font-bold mb-5">Informações Gerais</h6>
                                <div class="flex flex-col sm:flex-row">
                                    <div class="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                        <!-- Imagem que o usuário pode clicar -->
                                        <img
                                            :src="imageSrc"
                                            alt="User Profile"
                                            class="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto cursor-pointer"
                                            @click="triggerFileInput"
                                        />

                                        <!-- Input de arquivo oculto -->
                                        <input
                                            type="file"
                                            ref="fileInput"
                                            class="hidden"
                                            @change="handleFileChange"
                                            accept="image/*"
                                        />
                                    </div>
                                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label for="name">Nome *</label>
                                            <input id="name" type="text" v-model="company.name" placeholder="Informe o nome da empresa" class="form-input" />
                                        </div>
                                        <div>
                                            <label for="profession">CNPJ *</label>
                                            <input id="profession" type="text" v-model="company.cnpj" v-maska="'**.***.***/****-**'" placeholder="00.000.000/0000-00" class="form-input" />
                                        </div>
                                        <div>
                                            <label for="profession">E-mail *</label>
                                            <input id="email" type="text" v-model="company.email" placeholder="contato@contato.com" class="form-input" />
                                        </div>
                                        <div>
                                            <label for="address">Telefone *</label>
                                            <input id="address" type="text" v-model="company.phone" v-maska="'(##) #####-####'" placeholder="(00) 00000-0000" class="form-input" />
                                        </div>
                                        <div>
                                            <label for="location">OAB *</label>
                                            <input id="location" v-model="company.oab" type="text" v-maska="'OAB-@@/**********'" placeholder="OAB/DF 00000" class="form-input" />
                                        </div>
                                        <div>
                                            <label for="phone">Telefone de Emergência</label>
                                            <input id="phone" v-model="company.phoneEmergencia" type="text" placeholder="(00) 00000-0000" v-maska="'(##) #####-####'" class="form-input" />
                                        </div>
                                        <div>
                                            <label for="email">Whatsapp</label>
                                            <input id="email" type="text" v-model="company.whatsapp" v-maska="'(##) #####-####'"  placeholder="(00) 00000-0000" class="form-input" />
                                        </div>
                                        <div>
                                            <label for="email">Valor Mensalidade *</label>
                                            <input id="currencyMask" type="text" placeholder="R$" v-model="maskedValue" class="form-input" v-maska:unmaskedValue.unmasked="'R$ ###'" />
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="email">Descrição *</label>
                                            <textarea id="email" type="text" rows="5" v-model="company.description"  class="form-input" />
                                        </div>
                                        <div>
                                            <label for="email">Upload do Contrato *</label>
                                            <input
                                                type="file"
                                                ref="fileInputContract"
                                                @change="handleFileChangeContract"
                                                accept="application/pdf"
                                            />
                                        </div>
                                        <div class="sm:col-span-2 mt-3 flex justify-end">
                                            <button type="button" class="btn btn-primary" @click.prevent="saveCompany">
                                                <span class="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" v-if="isLoading">Loading...</span>
                                                Salvar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div>
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                                <div class="panel">
                                    <div class="mb-5">
                                        <h5 class="font-semibold text-lg mb-4">Dados para Pagamentos</h5>
                                        <p>Informações <span class="text-primary">Bancárias</span> para o pagamento.</p>
                                    </div>
                                    <div class="mb-5">
                                        <form>
                                            <div class="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div class="col-span-1">
                                                    <label for="billingName">Código do Banco</label>
                                                    <input id="billingName" type="text" placeholder="256" class="form-input" v-model="bank.code"/>
                                                </div>
                                                <div class="col-span-2">
                                                    <label for="billingEmail">Nome do Banco</label>
                                                    <input id="billingEmail" type="text" placeholder="Banco Guardião" class="form-input" v-model="bank.name"/>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
                                                <div class="md:col-span-1">
                                                    <label for="billingCity">Agência</label>
                                                    <input id="billingCity" type="text" placeholder="0001" class="form-input" v-model="bank.agency"/>
                                                </div>
                                                <div class="md:col-span-2">
                                                    <label for="billingState">Conta Corrente</label>
                                                    <input id="billingState" type="text" placeholder="12345-6" class="form-input" v-model="bank.account"/>
                                                </div>
                                                <div class="md:col-span-2">
                                                    <label for="billingZip">Dia do Pagamento</label>
                                                    <input id="billingZip" type="text" placeholder="Todo dia 10" class="form-input" v-model="bank.payDay"/>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div class="panel">
                                    <div class="mb-5">
                                        <h5 class="font-semibold text-lg mb-4">Histórico de Pagamentos</h5>
                                        <p>
                                            As alterações nas informações do seu <span class="text-primary">Método de Pagamento</span> realizado ao prestador de serviço.
                                        </p>
                                    </div>
                                    <div class="mb-5">
                                        <div class="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                            <div class="flex items-start justify-between py-3">
                                                <div class="flex-none ltr:mr-4 rtl:ml-4">
                                                    <img src="/assets/images/card-americanexpress.svg" alt="" />
                                                </div>
                                                <h6 class="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                                                    Mastercard
                                                    <span class="block text-white-dark dark:text-white-light font-normal text-xs mt-1"
                                                    >XXXX XXXX XXXX 9704</span
                                                    >
                                                </h6>
                                                <div class="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                                    <button class="btn btn-dark">Edit</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                            <div class="flex items-start justify-between py-3">
                                                <div class="flex-none ltr:mr-4 rtl:ml-4">
                                                    <img src="/assets/images/card-mastercard.svg" alt="" />
                                                </div>
                                                <h6 class="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                                                    American Express<span class="block text-white-dark dark:text-white-light font-normal text-xs mt-1"
                                                >XXXX XXXX XXXX 310</span
                                                >
                                                </h6>
                                                <div class="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                                    <button class="btn btn-dark">Edit</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="flex items-start justify-between py-3">
                                                <div class="flex-none ltr:mr-4 rtl:ml-4">
                                                    <img src="/assets/images/card-visa.svg" alt="" />
                                                </div>
                                                <h6 class="text-[#515365] font-bold dark:text-white-dark text-[15px]">
                                                    Visa<span class="block text-white-dark dark:text-white-light font-normal text-xs mt-1"
                                                >XXXX XXXX XXXX 5264</span
                                                >
                                                </h6>
                                                <div class="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                                    <button class="btn btn-dark">Edit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="sm:col-span-2 mt-3 flex justify-end">
                                    <button type="button" class="btn btn-primary" @click.prevent="saveCompany">
                                        <span class="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle" v-if="isLoading">Loading...</span>
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div class="switch">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div class="panel space-y-5">
                                    <h5 class="font-semibold text-lg mb-4">Emergência</h5>
                                    <p>Empresa aceita chamadas de <span class="text-primary">Emergência</span> caso o cliente necessite.</p>
                                    <label class="w-12 h-6 relative">
                                        <input
                                            type="checkbox"
                                            class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                            id="custom_switch_checkbox1"
                                            :checked="company.beneficios?.some(value => value === BeneficioType.EMERGENCIA)"
                                            @change="updateEmergencia($event.target.checked)"
                                        />
                                        <span
                                            for="custom_switch_checkbox1"
                                            class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                        ></span>
                                    </label>
                                </div>
                                <div class="panel space-y-5">
                                    <h5 class="font-semibold text-lg mb-4">Sem Carência</h5>
                                    <p>Plano sem <span class="text-primary">Carência</span> para o cliente.</p>
                                    <label class="w-12 h-6 relative">
                                        <input
                                            type="checkbox"
                                            class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                            id="custom_switch_checkbox2"
                                            :checked="company.beneficios?.some(value => value === BeneficioType.SEM_CARENCIA)"
                                            @change="updateCarencia($event.target.checked)"
                                        />
                                        <span
                                            for="custom_switch_checkbox2"
                                            class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                        ></span>
                                    </label>
                                </div>
                                <div class="panel space-y-5">
                                    <h5 class="font-semibold text-lg mb-4">Atendimento 24hr</h5>
                                    <p>Atendimento 24hrs para os clientes do plano</p>
                                    <label class="w-12 h-6 relative">
                                        <input
                                            type="checkbox"
                                            class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                            id="custom_switch_checkbox3"
                                            :checked="company.beneficios?.some(value => value === BeneficioType.ATENDIMENTO_24)"
                                            @change="update24($event.target.checked)"
                                        />
                                        <span
                                            for="custom_switch_checkbox3"
                                            class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                        ></span>
                                    </label>
                                </div>
                                <div class="panel space-y-5">
                                    <h5 class="font-semibold text-lg mb-4">Processos Diversos</h5>
                                    <p>Aceita além dos <span class="text-primary">Processos</span>  militares, processos em outras áreas de atuação</p>
                                    <label class="w-12 h-6 relative">
                                        <input
                                            type="checkbox"
                                            class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                            id="custom_switch_checkbox4"
                                            :checked="company.beneficios?.some(value => value === BeneficioType.PROCESSOS_DIVERSOS)"
                                            @change="updateDiversos($event.target.checked)"
                                        />
                                        <span
                                            for="custom_switch_checkbox4"
                                            class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                        ></span>
                                    </label>
                                </div>
                                <div class="panel space-y-5">
                                    <h5 class="font-semibold text-lg mb-4">Dependentes</h5>
                                    <p>O plano se extende a <span class="text-primary">Dependentes</span> como cônjuge e filhos</p>
                                    <label class="w-12 h-6 relative">
                                        <input
                                            type="checkbox"
                                            class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                            id="custom_switch_checkbox5"
                                            :checked="company.beneficios?.some(value => value === BeneficioType.DEPENDENTES)"
                                            @change="updateDependentes($event.target.checked)"
                                        />
                                        <span
                                            for="custom_switch_checkbox5"
                                            class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                        ></span>
                                    </label>
                                </div>
                                <div class="panel space-y-5">
                                    <h5 class="font-semibold text-lg mb-4">Whatsapp</h5>
                                    <p>Comunicação via <span class="text-primary">Whatsapp</span> para facilitar a comunicação</p>
                                    <label class="w-12 h-6 relative">
                                        <input
                                            type="checkbox"
                                            class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                            id="custom_switch_checkbox6"
                                            :checked="company.beneficios?.some(value => value === BeneficioType.WHATSAPP)"
                                            @change="updateWhatsapp($event.target.checked)"
                                        />
                                        <span
                                            for="custom_switch_checkbox6"
                                            class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                        ></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div class="switch">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div class="panel space-y-5">
                                    <h5 class="font-semibold text-lg mb-4">Desativar Empresa</h5>
                                    <p>Você não poderá receber mensagens e notificações por até 24 horas.</p>
                                    <label class="w-12 h-6 relative">
                                        <input
                                            type="checkbox"
                                            class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                            id="custom_switch_checkbox7"
                                        />
                                        <span
                                            for="custom_switch_checkbox7"
                                            class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"
                                        ></span>
                                    </label>
                                </div>
                                <div class="panel space-y-5">
                                    <h5 class="font-semibold text-lg mb-4">Deletar Conta</h5>
                                    <p>Depois que você excluir a conta, não há como voltar atrás. Por favor, tenha certeza.</p>
                                    <button class="btn btn-danger btn-delete-account">Deleta Conta</button>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
    import { useMeta } from '@/composables/use-meta';

    import IconHome from '@/components/icon/icon-home.vue';
    import IconDollarSignCircle from '@/components/icon/icon-dollar-sign-circle.vue';
    import IconUser from '@/components/icon/icon-user.vue';
    import IconPhone from '@/components/icon/icon-phone.vue';
    import { onMounted, ref } from 'vue';
    import FileService from '@/services/FileService';
    import { v4 as uuidv4 } from 'uuid';
    import Swal from 'sweetalert2';
    import companyService from '@/services/CompanyService';
    import BeneficioType from '@/enums/BeneficioType';
    import { useRoute } from 'vue-router';
    import { CompanyModel } from '@/models/CompanyModel';
    import { BankModel } from '@/models/BankModel';

    const unmaskedValue = ref('');
    const maskedValue = ref('');

    defineExpose({ unmaskedValue })


    const route = useRoute();

    useMeta({ title: 'Account Setting' });

    const imageSrc = ref("/assets/images/no-user.jpeg");

    const contractPdfSrc = ref("");
    const isLoading = ref(false);

    const fileInput = ref<HTMLInputElement | null>(null);

    let company = ref<CompanyModel>(new CompanyModel());
    let bank = ref<BankModel>(new BankModel());

    let fileNameImage = "";
    let fileImage: File | null = null;

    let fileNamePdf = "";
    let filePdf: File | null = null;

    const triggerFileInput = () => {
        if (fileInput.value) {
            fileInput.value.click();
        }
    };
    onMounted(() => {
        if(route.params.id) {
            loadCompany();
        }
    });

    const loadCompany = async () => {
        if(company.value) {
            const companyId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
            const result = await companyService.getCompanyById(companyId);
            console.info(`--------------------- ${JSON.stringify(result)}`);
            if (result) {
                company.value = result;
                imageSrc.value = result.logoUrl ?? "/assets/images/no-user.jpeg";
                maskedValue.value = (result.monthlyValue ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                contractPdfSrc.value = result.urlContract ?? "";
                bank.value = company.value.bank;
            } else {
                throw new Error('Empresa não encontrada');
            }
        }
    }


    const saveCompany = async () => {
        try {
            isLoading.value = true;
            if (!imageSrc.value) {
                showMessage('Por favor, selecione uma imagem para a empresa', 'warning');
            } else if (!contractPdfSrc.value) {
                showMessage('Por favor, selecione um contrato para a empresa', 'warning');
            } else if (!company.value || !company.value.name) {
                showMessage('Por favor, preencha o nome da empresa', 'warning');
            } else if (!company.value.oab) {
                showMessage('Por favor, preencha o OAB da empresa', 'warning');
            } else if (!company.value.cnpj || company.value.cnpj.length !== 18) {
                showMessage('Por favor, preencha o CNPJ da empresa com 14 caracteres', 'warning');
            } else if (!company.value.email || !validateEmail(company.value.email)) {
                showMessage('Por favor, preencha um email válido para a empresa', 'warning');
            } else if (!company.value.phone || !validatePhone(company.value.phone)) {
                showMessage('Por favor, preencha um número de telefone válido para a empresa', 'warning');
            } else if (!company.value.description) {
                showMessage('Por favor, preencha a descrição', 'warning');
            } else {
                if(!company.value.urlContract) {
                    const filePathImage = `profile_images/${fileNameImage}`;
                    if (fileImage) {
                        imageSrc.value = await FileService.uploadFile(fileImage, filePathImage);
                    } else {
                        throw new Error('Nenhum arquivo foi selecionado para upload.');
                    }

                    const filePathPdf = `companies/contracts/${fileNamePdf}`;
                    if (filePdf) {
                        contractPdfSrc.value = await FileService.uploadFile(filePdf, filePathPdf);
                    } else {
                        throw new Error('Nenhum arquivo foi selecionado para upload.');
                    }
                }

                if (company.value) {
                    company.value.urlContract = contractPdfSrc.value;
                    company.value.logoUrl = imageSrc.value;
                    company.value.whatsapp = company.value.whatsapp ?? '';
                    company.value.phoneEmergencia = company.value.phoneEmergencia ?? '';
                    console.log(convertBRToFloat(unmaskedValue.value));
                    company.value.monthlyValue = parseFloat(unmaskedValue.value) || 0;
                    company.value.bank = bank.value;
                    if(company.value.id) {
                        console.log(`========================= ${JSON.stringify(company.value)}`);
                        await companyService.updateCompany(company.value);
                    } else {
                        await companyService.createCompany(company.value);
                    }
                    showMessage('Empresa cadastrada com sucesso', 'success');
                }
            }
        } catch (error) {
            console.error(error);
            showMessage('Ocorreu um erro ao salvar a empresa', 'error');
        } finally {
            isLoading.value = false;
        }
    };

    const convertBRToFloat = (value: string): number => {
        let cleanValue = value.replace(/[^\d.,]/g, '');

        if (cleanValue.includes('.') && cleanValue.includes(',')) {
            // "1.234.567,89" -> "1234567.89"
            cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
        } else if (cleanValue.includes(',')) {
            // "1234,56" -> "1234.56"
            cleanValue = cleanValue.replace(',', '.');
        }

        return parseFloat(cleanValue) || 0;
    };

    function validateEmail(email: string): boolean {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }
    function validatePhone(phone: string): boolean {
        const regex = /^[\+\d]?(?:[\d-.\s()]*)$/;  // Regex para telefone simples
        return regex.test(phone);
    }

    function updateEmergencia(value: boolean) {
        if (!company.value) return;

        if (value) {
            // Adicionar se não existir
            if (!company.value.beneficios) {
                company.value.beneficios = [];
            }
            if (!company.value.beneficios.includes(BeneficioType.EMERGENCIA)) {
                company.value.beneficios.push(BeneficioType.EMERGENCIA);
            }
        } else {
            // Remover usando filter - retorna novo array SEM o item
            company.value.beneficios = company.value.beneficios?.filter(
                beneficio => beneficio !== BeneficioType.EMERGENCIA
            ) || [];
        }

        companyService.updateCompany(company.value);
    }

    function updateCarencia(value: boolean) {
        if (!company.value) return;

        if (value) {
            // Adicionar se não existir
            if (!company.value.beneficios) {
                company.value.beneficios = [];
            }
            if (!company.value.beneficios.includes(BeneficioType.SEM_CARENCIA)) {
                company.value.beneficios.push(BeneficioType.SEM_CARENCIA);
            }
        } else {
            // Remover usando filter - retorna novo array SEM o item
            company.value.beneficios = company.value.beneficios?.filter(
                beneficio => beneficio !== BeneficioType.SEM_CARENCIA
            ) || [];
        }

        companyService.updateCompany(company.value);
    }

    function update24(value: boolean) {
        if (!company.value) return;

        if (value) {
            // Adicionar se não existir
            if (!company.value.beneficios) {
                company.value.beneficios = [];
            }
            if (!company.value.beneficios.includes(BeneficioType.ATENDIMENTO_24)) {
                company.value.beneficios.push(BeneficioType.ATENDIMENTO_24);
            }
        } else {
            // Remover usando filter - retorna novo array SEM o item
            company.value.beneficios = company.value.beneficios?.filter(
                beneficio => beneficio !== BeneficioType.ATENDIMENTO_24
            ) || [];
        }

        companyService.updateCompany(company.value);
    }

    function updateDiversos(value: boolean) {
        if (!company.value) return;

        if (value) {
            // Adicionar se não existir
            if (!company.value.beneficios) {
                company.value.beneficios = [];
            }
            if (!company.value.beneficios.includes(BeneficioType.PROCESSOS_DIVERSOS)) {
                company.value.beneficios.push(BeneficioType.PROCESSOS_DIVERSOS);
            }
        } else {
            // Remover usando filter - retorna novo array SEM o item
            company.value.beneficios = company.value.beneficios?.filter(
                beneficio => beneficio !== BeneficioType.PROCESSOS_DIVERSOS
            ) || [];
        }

        companyService.updateCompany(company.value);
    }

    function updateDependentes(value: boolean) {
        if (!company.value) return;

        if (value) {
            // Adicionar se não existir
            if (!company.value.beneficios) {
                company.value.beneficios = [];
            }
            if (!company.value.beneficios.includes(BeneficioType.DEPENDENTES)) {
                company.value.beneficios.push(BeneficioType.DEPENDENTES);
            }
        } else {
            // Remover usando filter - retorna novo array SEM o item
            company.value.beneficios = company.value.beneficios?.filter(
                beneficio => beneficio !== BeneficioType.DEPENDENTES
            ) || [];
        }

        companyService.updateCompany(company.value);
    }

    function updateWhatsapp(value: boolean) {
        if (!company.value) return;

        if (value) {
            // Adicionar se não existir
            if (!company.value.beneficios) {
                company.value.beneficios = [];
            }
            if (!company.value.beneficios.includes(BeneficioType.WHATSAPP)) {
                company.value.beneficios.push(BeneficioType.WHATSAPP);
            }
        } else {
            // Remover usando filter - retorna novo array SEM o item
            company.value.beneficios = company.value.beneficios?.filter(
                beneficio => beneficio !== BeneficioType.WHATSAPP
            ) || [];
        }

        companyService.updateCompany(company.value);
    }

    const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            fileImage = input.files[0];
            fileNameImage = `${uuidv4()}-${fileImage.name}`;

            if (fileImage.type.includes('image')) {
                imageSrc.value = URL.createObjectURL(fileImage); // Atualiza a imagem ao carregar
            }
        }
    };

    const handleFileChangeContract = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            filePdf = input.files[0];
            fileNamePdf = `${uuidv4()}-${filePdf.name}`;

            if (filePdf.type.includes('pdf')) {
                contractPdfSrc.value = URL.createObjectURL(filePdf); // Exibe o PDF carregado
            }
        }
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };
</script>
