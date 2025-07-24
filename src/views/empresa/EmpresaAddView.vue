<template>
    <div>
        <ul class="flex space-x-2 rtl:space-x-reverse">
            <li>
                <a href="javascript:" class="text-primary hover:underline">Empresas</a>
            </li>
            <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>{{ route.params.id ? 'Editar' : 'Adicionar' }} Empresa</span>
            </li>
        </ul>
        <div class="pt-5">
            <div class="flex items-center justify-between mb-5">
                <h5 class="font-semibold text-lg dark:text-white-light">
                    {{ route.params.id ? 'Editar' : 'Adicionar' }} Empresa
                </h5>
            </div>
            <TabGroup>
                <TabList class="flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconHome class="w-5 h-5" />
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
                            <IconUser class="w-5 h-5" />
                            Benefícios
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }" v-if="isEditMode">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconUsers class="w-5 h-5" />
                            Advogados
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }" v-if="isEditMode">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconUserGroup class="w-5 h-5" />
                            Clientes
                        </a>
                    </Tab>
                    <Tab as="template" v-slot="{ selected }">
                        <a
                            href="javascript:"
                            class="flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary !outline-none"
                            :class="{ '!border-primary text-primary': selected }"
                        >
                            <IconPhone class="w-5 h-5" />
                            Configurações
                        </a>
                    </Tab>
                </TabList>
                <TabPanels>
                    <!-- Aba Dados Gerais -->
                    <TabPanel>
                        <div class="panel">
                            <h6 class="text-lg font-bold mb-5">Informações Gerais</h6>
                            <div class="flex flex-col sm:flex-row gap-5">
                                <div class="w-full sm:w-2/12">
                                    <img
                                        :src="imageSrc"
                                        alt="Logo da Empresa"
                                        class="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto ring-2 ring-[#ebedf2] dark:ring-white-dark"
                                    />
                                    <div class="mt-3 text-center">
                                        <button type="button" class="btn btn-primary btn-sm" @click="triggerFileInput">
                                            Escolher Logo
                                        </button>
                                        <input
                                            ref="fileInput"
                                            type="file"
                                            class="hidden"
                                            accept="image/*"
                                            @change="handleFileChange"
                                        />
                                    </div>
                                </div>
                                <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label for="name">Nome da Empresa *</label>
                                        <input id="name" type="text" placeholder="Nome da Empresa" class="form-input" v-model="company.name" />
                                    </div>
                                    <div>
                                        <label for="cnpj">CNPJ *</label>
                                        <input id="cnpj" type="text" placeholder="00.000.000/0000-00" class="form-input" v-model="company.cnpj" />
                                    </div>
                                    <div>
                                        <label for="oab">OAB *</label>
                                        <input id="oab" type="text" placeholder="OAB/SP 123456" class="form-input" v-model="company.oab" />
                                    </div>
                                    <div>
                                        <label for="email">E-mail *</label>
                                        <input id="email" type="email" placeholder="empresa@exemplo.com" class="form-input" v-model="company.email" />
                                    </div>
                                    <div>
                                        <label for="phone">Telefone *</label>
                                        <input id="phone" type="text" placeholder="(11) 99999-9999" class="form-input" v-model="company.phone" />
                                    </div>
                                    <div>
                                        <label for="whatsapp">WhatsApp</label>
                                        <input id="whatsapp" type="text" placeholder="(11) 99999-9999" class="form-input" v-model="company.whatsapp" />
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label for="description">Descrição *</label>
                                        <textarea id="description" rows="4" placeholder="Descrição da empresa..." class="form-textarea" v-model="company.description"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Aba Financeiro -->
                    <TabPanel>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <!-- Dados Bancários -->
                            <div class="panel">
                                <h6 class="text-lg font-bold mb-5">Dados Bancários</h6>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    <div class="col-span-1">
                                        <label for="bankCode">Código do Banco</label>
                                        <input id="bankCode" type="text" placeholder="001" class="form-input" v-model="bank.code"/>
                                    </div>
                                    <div class="col-span-2">
                                        <label for="bankName">Nome do Banco</label>
                                        <input id="bankName" type="text" placeholder="Banco do Brasil" class="form-input" v-model="bank.name"/>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label for="agency">Agência</label>
                                        <input id="agency" type="text" placeholder="1234-5" class="form-input" v-model="bank.agency"/>
                                    </div>
                                    <div>
                                        <label for="account">Conta</label>
                                        <input id="account" type="text" placeholder="12345-6" class="form-input" v-model="bank.account"/>
                                    </div>
                                </div>
                                <div>
                                    <label for="accountHolder">Titular da Conta</label>
                                    <input id="accountHolder" type="text" placeholder="Nome do Titular" class="form-input" v-model="bank.account"/>
                                </div>
                            </div>

                            <!-- Valor Mensal -->
                            <div class="panel">
                                <h6 class="text-lg font-bold mb-5">Valor Mensal</h6>
                                <div>
                                    <label for="monthlyValue">Valor (R$)</label>
                                    <input
                                        id="monthlyValue"
                                        type="text"
                                        placeholder="R$ 0,00"
                                        class="form-input"
                                        v-model="maskedValue"
                                        @input="updateMonthlyValue"
                                    />
                                </div>
                                <div class="mt-3">
                                    <button type="button" class="btn btn-info btn-sm" @click="triggerContractInput">
                                        Upload Contrato (PDF)
                                    </button>
                                    <input
                                        ref="contractInput"
                                        type="file"
                                        class="hidden"
                                        accept=".pdf"
                                        @change="handleContractChange"
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Aba Benefícios -->
                    <TabPanel>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <!-- Atendimento de Emergência -->
                            <div class="panel space-y-3">
                                <h5 class="font-semibold text-lg">Atendimento de Emergência</h5>
                                <p class="text-sm text-gray-600">Atendimento prioritário em casos de emergência</p>
                                <label class="w-12 h-6 relative">
                                    <input
                                        type="checkbox"
                                        class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                        :checked="company.beneficios?.includes(BeneficioType.EMERGENCIA)"
                                        @change="updateBeneficio('EMERGENCIA', $event)"
                                    />
                                    <span class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>

                            <!-- Sem Carência -->
                            <div class="panel space-y-3">
                                <h5 class="font-semibold text-lg">Sem Carência</h5>
                                <p class="text-sm text-gray-600">Serviço sem período de carência</p>
                                <label class="w-12 h-6 relative">
                                    <input
                                        type="checkbox"
                                        class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                        :checked="company.beneficios?.includes(BeneficioType.SEM_CARENCIA)"
                                        @change="updateBeneficio('SEM_CARENCIA', $event)"
                                    />
                                    <span class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>

                            <!-- Atendimento 24hrs -->
                            <div class="panel space-y-3">
                                <h5 class="font-semibold text-lg">Atendimento 24hrs</h5>
                                <p class="text-sm text-gray-600">Atendimento disponível 24 horas por dia</p>
                                <label class="w-12 h-6 relative">
                                    <input
                                        type="checkbox"
                                        class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                        :checked="company.beneficios?.includes(BeneficioType.ATENDIMENTO_24)"
                                        @change="updateBeneficio('ATENDIMENTO_24', $event)"
                                    />
                                    <span class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>

                            <!-- Processos Diversos -->
                            <div class="panel space-y-3">
                                <h5 class="font-semibold text-lg">Processos Diversos</h5>
                                <p class="text-sm text-gray-600">Aceita processos além dos militares</p>
                                <label class="w-12 h-6 relative">
                                    <input
                                        type="checkbox"
                                        class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                        :checked="company.beneficios?.includes(BeneficioType.PROCESSOS_DIVERSOS)"
                                        @change="updateBeneficio('PROCESSOS_DIVERSOS', $event)"
                                    />
                                    <span class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>

                            <!-- Dependentes -->
                            <div class="panel space-y-3">
                                <h5 class="font-semibold text-lg">Dependentes</h5>
                                <p class="text-sm text-gray-600">Cobertura estendida aos dependentes</p>
                                <label class="w-12 h-6 relative">
                                    <input
                                        type="checkbox"
                                        class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                        :checked="company.beneficios?.includes(BeneficioType.DEPENDENTES)"
                                        @change="updateBeneficio('DEPENDENTES', $event)"
                                    />
                                    <span class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>

                            <!-- WhatsApp -->
                            <div class="panel space-y-3">
                                <h5 class="font-semibold text-lg">Atendimento WhatsApp</h5>
                                <p class="text-sm text-gray-600">Atendimento via WhatsApp</p>
                                <label class="w-12 h-6 relative">
                                    <input
                                        type="checkbox"
                                        class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                        :checked="company.beneficios?.includes(BeneficioType.WHATSAPP)"
                                        @change="updateBeneficio('WHATSAPP', $event)"
                                    />
                                    <span class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Aba Advogados (apenas em modo edição) -->
                    <TabPanel v-if="isEditMode">
                        <div class="panel">
                            <div class="flex items-center justify-between mb-5">
                                <h6 class="text-lg font-bold">Advogados da Empresa</h6>
                                <div class="flex gap-2">
                                    <button @click="showAddAdvogadoModal = true" class="btn btn-primary gap-2">
                                        <IconPlus class="w-4 h-4" />
                                        Adicionar Advogado
                                    </button>
                                    <button @click="loadAdvogados" class="btn btn-outline-secondary gap-2" :disabled="isLoadingAdvogados">
                                        <IconRefresh class="w-4 h-4" :class="{ 'animate-spin': isLoadingAdvogados }" />
                                        Atualizar
                                    </button>
                                </div>
                            </div>

                            <!-- Loading State -->
                            <div v-if="isLoadingAdvogados" class="flex justify-center items-center py-10">
                                <div class="animate-spin border-4 border-primary border-l-transparent rounded-full w-8 h-8"></div>
                            </div>

                            <!-- Lista de Advogados -->
                            <div v-else-if="companyAdvogados.length > 0" class="overflow-x-auto">
                                <table class="table-auto w-full border border-gray-200 dark:border-gray-700">
                                    <thead class="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th class="px-4 py-3 text-left">Foto</th>
                                        <th class="px-4 py-3 text-left">Nome</th>
                                        <th class="px-4 py-3 text-left">Email</th>
                                        <th class="px-4 py-3 text-left">OAB</th>
                                        <th class="px-4 py-3 text-left">Telefone</th>
                                        <th class="px-4 py-3 text-center">Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="advogado in companyAdvogados" :key="advogado.uid" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td class="px-4 py-3">
                                            <img
                                                :src="advogado.photoUrl || '/assets/images/no-user.jpeg'"
                                                :alt="advogado.name"
                                                class="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                @error="handleAdvogadoImageError"
                                            />
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="font-medium">{{ advogado.name || '-' }}</div>
                                            <div class="text-sm text-gray-500">{{ formatCPF(advogado.cpf) }}</div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <a
                                                :href="`mailto:${advogado.email}`"
                                                class="text-primary hover:underline"
                                                v-if="advogado.email"
                                            >
                                            </a>
                                            <span v-else>-</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="font-mono">{{ advogado.oab || '-' }}</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <a
                                                :href="`tel:${advogado.phone}`"
                                                class="text-primary hover:underline"
                                                v-if="advogado.phone"
                                            >
                                                {{ formatPhone(advogado.phone) }}
                                            </a>
                                            <span v-else>-</span>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <div class="flex items-center justify-center gap-2">
                                                <button
                                                    @click="resendSetupEmail(advogado.email!)"
                                                    v-if="advogado.email"
                                                    class="btn btn-sm btn-outline-info"
                                                    title="Reenviar Email de Configuração"
                                                >
                                                    <IconMail class="w-4 h-4" />
                                                </button>
                                                <button
                                                    @click="editAdvogado(advogado)"
                                                    class="btn btn-sm btn-outline-warning"
                                                    title="Editar Advogado"
                                                >
                                                    <IconEdit class="w-4 h-4" />
                                                </button>
                                                <button
                                                    @click="removeAdvogadoFromCompany(advogado.uid!)"
                                                    class="btn btn-sm btn-outline-danger"
                                                    title="Remover da Empresa"
                                                >
                                                    <IconUserMinus class="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Estado Vazio -->
                            <div v-else class="text-center py-10">
                                <IconUsers class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Nenhum advogado vinculado
                                </h3>
                                <p class="text-gray-500 mb-6">
                                    Adicione advogados à esta empresa para começar.
                                </p>
                                <button @click="showAddAdvogadoModal = true" class="btn btn-primary gap-2">
                                    <IconPlus class="w-4 h-4" />
                                    Adicionar Primeiro Advogado
                                </button>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Aba Clientes (apenas em modo edição) -->
                    <TabPanel v-if="isEditMode">
                        <div class="panel">
                            <div class="flex items-center justify-between mb-5">
                                <h6 class="text-lg font-bold">Clientes da Empresa</h6>
                                <div class="flex gap-2">
                                    <button @click="loadClientes" class="btn btn-outline-secondary gap-2" :disabled="isLoadingClientes">
                                        <IconRefresh class="w-4 h-4" :class="{ 'animate-spin': isLoadingClientes }" />
                                        Atualizar
                                    </button>
                                    <div class="flex items-center gap-2 text-sm text-gray-600">
                                        <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                                        <span>Ativo</span>
                                        <span class="w-3 h-3 bg-red-500 rounded-full ml-3"></span>
                                        <span>Inativo</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Estatísticas -->
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div class="flex items-center gap-3">
                                        <IconUserGroup class="w-8 h-8 text-blue-600" />
                                        <div>
                                            <p class="text-sm text-blue-600 dark:text-blue-400">Total de Clientes</p>
                                            <p class="text-2xl font-bold text-blue-800 dark:text-blue-200">{{ companyClientes.length }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div class="flex items-center gap-3">
                                        <IconUserCheck class="w-8 h-8 text-green-600" />
                                        <div>
                                            <p class="text-sm text-green-600 dark:text-green-400">Planos Ativos</p>
                                            <p class="text-2xl font-bold text-green-800 dark:text-green-200">{{ clientesAtivos.length }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <div class="flex items-center gap-3">
                                        <IconUserX class="w-8 h-8 text-red-600" />
                                        <div>
                                            <p class="text-sm text-red-600 dark:text-red-400">Planos Inativos</p>
                                            <p class="text-2xl font-bold text-red-800 dark:text-red-200">{{ clientesInativos.length }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                    <div class="flex items-center gap-3">
                                        <IconDollarSignCircle class="w-8 h-8 text-yellow-600" />
                                        <div>
                                            <p class="text-sm text-yellow-600 dark:text-yellow-400">Receita Mensal</p>
                                            <p class="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{{ formatCurrency(receitaMensal) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Filtros -->
                            <div class="flex flex-wrap items-center gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div class="flex items-center gap-2">
                                    <label class="text-sm font-medium">Status do Plano:</label>
                                    <select v-model="filtroStatusCliente" @change="aplicarFiltroClientes" class="form-select w-auto">
                                        <option value="">Todos</option>
                                        <option value="ativo">Planos Ativos</option>
                                        <option value="inativo">Planos Inativos</option>
                                    </select>
                                </div>
                                <div class="flex items-center gap-2">
                                    <label class="text-sm font-medium">Pesquisar:</label>
                                    <input
                                        v-model="searchCliente"
                                        type="text"
                                        placeholder="Nome, email ou CPF..."
                                        class="form-input w-64"
                                        @input="aplicarFiltroClientes"
                                    />
                                </div>
                                <button @click="limparFiltrosClientes" class="btn btn-outline-secondary btn-sm">
                                    Limpar Filtros
                                </button>
                            </div>

                            <!-- Loading State -->
                            <div v-if="isLoadingClientes" class="flex justify-center items-center py-10">
                                <div class="animate-spin border-4 border-primary border-l-transparent rounded-full w-8 h-8"></div>
                            </div>

                            <!-- Lista de Clientes -->
                            <div v-else-if="clientesFiltrados.length > 0" class="overflow-x-auto">
                                <table class="table-auto w-full border border-gray-200 dark:border-gray-700">
                                    <thead class="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th class="px-4 py-3 text-left">Cliente</th>
                                        <th class="px-4 py-3 text-left">Email</th>
                                        <th class="px-4 py-3 text-left">Telefone</th>
                                        <th class="px-4 py-3 text-center">Status do Plano</th>
                                        <th class="px-4 py-3 text-left">Data de Criação</th>
                                        <th class="px-4 py-3 text-center">Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="cliente in clientesFiltrados" :key="cliente.uid" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-3">
                                                <img
                                                    :src="cliente.photoUrl || '/assets/images/no-user.jpeg'"
                                                    :alt="cliente.name"
                                                    class="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                    @error="handleClienteImageError"
                                                />
                                                <div>
                                                    <div class="font-medium">{{ cliente.name || '-' }}</div>
                                                    <div class="text-sm text-gray-500">{{ formatCPF(cliente.cpf) }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <a
                                                :href="`mailto:${cliente.email}`"
                                                class="text-primary hover:underline"
                                                v-if="cliente.email"
                                            >
                                                {{ cliente.email }}
                                            </a>
                                            <span v-else>-</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <a
                                                :href="`tel:${cliente.phone}`"
                                                class="text-primary hover:underline"
                                                v-if="cliente.phone"
                                            >
                                                {{ formatPhone(cliente.phone) }}
                                            </a>
                                            <span v-else>-</span>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <div class="flex items-center justify-center gap-2">
                                                <div
                                                    class="w-3 h-3 rounded-full"
                                                    :class="cliente.isPlanoAtivo ? 'bg-green-500' : 'bg-red-500'"
                                                ></div>
                                                <span
                                                    class="font-medium"
                                                    :class="cliente.isPlanoAtivo ? 'text-green-600' : 'text-red-600'"
                                                >
                                                        {{ cliente.isPlanoAtivo ? 'Ativo' : 'Inativo' }}
                                                    </span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="text-sm">{{ formatDate(cliente.createdAt) }}</span>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <router-link
                                                :to="`/customers/view/${cliente.uid}`"
                                                class="btn btn-sm btn-outline-info"
                                                title="Visualizar Cliente"
                                            >
                                                <IconEye class="w-4 h-4" />
                                            </router-link>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <!-- Paginação simples -->
                                <div v-if="clientesFiltrados.length > 10" class="flex justify-center mt-4">
                                    <p class="text-sm text-gray-600">
                                        Mostrando {{ Math.min(10, clientesFiltrados.length) }} de {{ clientesFiltrados.length }} cliente(s)
                                    </p>
                                </div>
                            </div>

                            <!-- Estado Vazio -->
                            <div v-else class="text-center py-10">
                                <IconUserGroup class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {{ companyClientes.length === 0 ? 'Nenhum cliente vinculado' : 'Nenhum cliente encontrado' }}
                                </h3>
                                <p class="text-gray-500">
                                    {{ companyClientes.length === 0
                                    ? 'Esta empresa ainda não possui clientes cadastrados.'
                                    : 'Tente ajustar os filtros para encontrar clientes.'
                                    }}
                                </p>
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Aba Configurações -->
                    <TabPanel>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="panel space-y-5">
                                <h5 class="font-semibold text-lg">Salvar Empresa</h5>
                                <p class="text-gray-600">Salvar todas as alterações realizadas.</p>
                                <button
                                    type="button"
                                    class="btn btn-success"
                                    @click="saveCompany"
                                    :disabled="isLoading"
                                >
                                    <span v-if="isLoading" class="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 mr-2"></span>
                                    {{ isLoading ? 'Salvando...' : 'Salvar Empresa' }}
                                </button>
                            </div>

                            <!-- Desativar/Ativar Empresa -->
                            <div class="panel space-y-5" v-if="isEditMode">
                                <h5 class="font-semibold text-lg">Status da Empresa</h5>
                                <p class="text-gray-600">Controle o status de ativação da empresa no sistema.</p>

                                <div class="flex items-center gap-3">
                                    <label class="w-12 h-6 relative">
                                        <input
                                            type="checkbox"
                                            class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                            :checked="company.isActive !== false"
                                            @change="toggleCompanyStatus($event)"
                                        />
                                        <span class="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                    </label>
                                    <div>
                                        <span class="font-medium" :class="company.isActive !== false ? 'text-green-600' : 'text-red-600'">
                                            {{ company.isActive !== false ? 'Empresa Ativa' : 'Empresa Desativada' }}
                                        </span>
                                        <p class="text-sm text-gray-500 mt-1">
                                            {{ company.isActive !== false
                                            ? 'A empresa pode receber novos clientes e os advogados podem acessar o sistema'
                                            : 'A empresa está desativada e não pode receber novos clientes'
                                            }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Aviso quando desativada -->
                                <div v-if="company.isActive === false" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <div class="flex items-start gap-3">
                                        <IconAlert class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h6 class="font-medium text-red-800 dark:text-red-200">Empresa Desativada</h6>
                                            <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                                                Quando desativada, a empresa não aparecerá nas listagens ativas e não poderá receber novos clientes.
                                                Os clientes existentes continuam com acesso normal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    </div>

    <!-- Modal Adicionar/Editar Advogado -->
    <div v-if="showAddAdvogadoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 class="text-lg font-bold mb-4">
                {{ editingAdvogado ? 'Editar Advogado' : 'Adicionar Advogado' }}
            </h3>

            <form @submit.prevent="saveAdvogado">
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label for="advogadoName">Nome *</label>
                        <input
                            id="advogadoName"
                            type="text"
                            placeholder="Nome completo"
                            class="form-input"
                            v-model="formAdvogado.name"
                            required
                        />
                    </div>
                    <div>
                        <label for="advogadoEmail">Email *</label>
                        <input
                            id="advogadoEmail"
                            type="email"
                            placeholder="email@exemplo.com"
                            class="form-input"
                            v-model="formAdvogado.email"
                            required
                        />
                    </div>
                    <div>
                        <label for="advogadoCpf">CPF *</label>
                        <input
                            id="advogadoCpf"
                            type="text"
                            placeholder="000.000.000-00"
                            class="form-input"
                            v-model="formAdvogado.cpf"
                            required
                        />
                    </div>
                    <div>
                        <label for="advogadoOab">OAB *</label>
                        <input
                            id="advogadoOab"
                            type="text"
                            placeholder="OAB/SP 123456"
                            class="form-input"
                            v-model="formAdvogado.oab"
                            required
                        />
                    </div>
                    <div>
                        <label for="advogadoPhone">Telefone</label>
                        <input
                            id="advogadoPhone"
                            type="text"
                            placeholder="(11) 99999-9999"
                            class="form-input"
                            v-model="formAdvogado.phone"
                        />
                    </div>
                    <div>
                        <label for="advogadoUf">UF</label>
                        <select id="advogadoUf" class="form-select" v-model="formAdvogado.uf">
                            <option value="">Selecione...</option>
                            <option value="AC">AC</option>
                            <option value="AL">AL</option>
                            <option value="AP">AP</option>
                            <option value="AM">AM</option>
                            <option value="BA">BA</option>
                            <option value="CE">CE</option>
                            <option value="DF">DF</option>
                            <option value="ES">ES</option>
                            <option value="GO">GO</option>
                            <option value="MA">MA</option>
                            <option value="MT">MT</option>
                            <option value="MS">MS</option>
                            <option value="MG">MG</option>
                            <option value="PA">PA</option>
                            <option value="PB">PB</option>
                            <option value="PR">PR</option>
                            <option value="PE">PE</option>
                            <option value="PI">PI</option>
                            <option value="RJ">RJ</option>
                            <option value="RN">RN</option>
                            <option value="RS">RS</option>
                            <option value="RO">RO</option>
                            <option value="RR">RR</option>
                            <option value="SC">SC</option>
                            <option value="SP">SP</option>
                            <option value="SE">SE</option>
                            <option value="TO">TO</option>
                        </select>
                    </div>

                    <!-- Opção de enviar email de cadastro -->
                    <div v-if="!editingAdvogado" class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <input
                            type="checkbox"
                            id="sendEmailLink"
                            v-model="sendAuthEmail"
                            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                        />
                        <label for="sendEmailLink" class="text-sm">
                            <span class="font-medium text-blue-900 dark:text-blue-200">
                                Enviar link de cadastro por email
                            </span>
                            <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                O advogado receberá um email para definir sua senha e acessar o sistema
                            </p>
                        </label>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        @click="cancelAdvogadoModal"
                        class="btn btn-outline-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="isSavingAdvogado"
                    >
                        <span v-if="isSavingAdvogado" class="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 mr-2"></span>
                        {{ isSavingAdvogado ? 'Salvando...' : (editingAdvogado ? 'Atualizar' : 'Adicionar') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
    import { useMeta } from '@/composables/use-meta';
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { v4 as uuidv4 } from 'uuid';
    import Swal from 'sweetalert2';

    // Services
    import FileService from '@/services/FileService';
    import CompanyService from '@/services/CompanyService';
    import UserAdvService from '@/services/UserAdvService';
    import CustomerService from '@/services/CustomerService';

    // Models
    import { CompanyModel } from '@/models/CompanyModel';
    import { BankModel } from '@/models/BankModel';
    import { UserAdvModel } from '@/models/UserAdvModel';
    import { CustomerModel } from '@/models/CustomerModel';

    // Ícones
    import IconHome from '@/components/icon/icon-home.vue';
    import IconDollarSignCircle from '@/components/icon/icon-dollar-sign-circle.vue';
    import IconUser from '@/components/icon/icon-user.vue';
    import IconUsers from '@/components/icon/icon-users.vue';
    import IconPhone from '@/components/icon/icon-phone.vue';
    import IconPlus from '@/components/icon/icon-plus.vue';
    import IconEdit from '@/components/icon/icon-edit.vue';
    import IconRefresh from '@/components/icon/icon-refresh.vue';
    import IconUserMinus from '@/components/icon/icon-user-minus.vue';
    import IconMail from '@/components/icon/icon-mail.vue';
    import IconAlert from '@/components/icon/icon-alert.vue';
    import IconUserGroup from '@/components/icon/icon-user-group.vue';
    import IconUserCheck from '@/components/icon/icon-user-check.vue';
    import IconUserX from '@/components/icon/icon-user-x.vue';
    import IconEye from '@/components/icon/icon-eye.vue';
    import BeneficioType from '@/enums/BeneficioType';

    const route = useRoute();
    useMeta({ title: 'Gerenciar Empresa' });

    // Estados principais
    const imageSrc = ref("/assets/images/no-user.jpeg");
    const isLoading = ref(false);
    const fileInput = ref<HTMLInputElement | null>(null);
    const contractInput = ref<HTMLInputElement | null>(null);

    // Models
    const company = ref<CompanyModel>(new CompanyModel());
    const bank = ref<BankModel>(new BankModel());

    // Estados para advogados
    const companyAdvogados = ref<UserAdvModel[]>([]);
    const isLoadingAdvogados = ref(false);
    const showAddAdvogadoModal = ref(false);
    const editingAdvogado = ref<UserAdvModel | null>(null);
    const isSavingAdvogado = ref(false);
    const sendAuthEmail = ref(true);

    // Estados para clientes
    const companyClientes = ref<CustomerModel[]>([]);
    const isLoadingClientes = ref(false);
    const filtroStatusCliente = ref('');
    const searchCliente = ref('');

    // Formulário de advogado
    const formAdvogado = ref<UserAdvModel>(new UserAdvModel());

    // Arquivos
    const maskedValue = ref('');
    let fileImage: File | null = null;
    let filePdf: File | null = null;

    // Computed
    const isEditMode = computed(() => !!route.params.id);

    // Lifecycle
    onMounted(async () => {
        if (route.params.id) {
            await loadCompany();
        }
    });

    // Métodos principais
    const loadCompany = async () => {
        try {
            const companyId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
            const result = await CompanyService.getCompanyById(companyId);

            if (result) {
                company.value = result;
                bank.value = result.bank || new BankModel();
                imageSrc.value = result.logoUrl ?? "/assets/images/no-user.jpeg";
                maskedValue.value = (result.monthlyValue ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                // Carregar advogados da empresa
                await loadAdvogados();
                // Carregar clientes da empresa
                await loadClientes();
            } else {
                throw new Error('Empresa não encontrada');
            }
        } catch (error) {
            console.error('Erro ao carregar empresa:', error);
            showMessage('Erro ao carregar dados da empresa', 'error');
        }
    };

    const loadAdvogados = async () => {
        if (!company.value.id) return;

        isLoadingAdvogados.value = true;
        try {
            const advogados = await UserAdvService.getUsersAdvByCompany(company.value.id);
            companyAdvogados.value = advogados;
        } catch (error) {
            console.error('Erro ao carregar advogados:', error);
            showMessage('Erro ao carregar advogados', 'error');
        } finally {
            isLoadingAdvogados.value = false;
        }
    };

    const saveCompany = async () => {
        try {
            isLoading.value = true;

            // Validações
            if (!company.value.name) {
                showMessage('Nome da empresa é obrigatório', 'warning');
                return;
            }
            if (!company.value.oab) {
                showMessage('OAB é obrigatório', 'warning');
                return;
            }
            if (!company.value.cnpj) {
                showMessage('CNPJ é obrigatório', 'warning');
                return;
            }
            if (!company.value.email || !validateEmail(company.value.email)) {
                showMessage('Email válido é obrigatório', 'warning');
                return;
            }
            if (!company.value.phone) {
                showMessage('Telefone é obrigatório', 'warning');
                return;
            }
            if (!company.value.description) {
                showMessage('Descrição é obrigatória', 'warning');
                return;
            }

            // Upload de arquivos se necessário
            if (fileImage) {
                const filePathImage = `companies/logos/${uuidv4()}-${fileImage.name}`;
                company.value.logoUrl = await FileService.uploadFile(fileImage, filePathImage);
            }

            if (filePdf) {
                const filePathPdf = `companies/contracts/${uuidv4()}-${filePdf.name}`;
                company.value.urlContract = await FileService.uploadFile(filePdf, filePathPdf);
            }

            // Configurar dados bancários
            company.value.bank = bank.value;

            // Salvar empresa
            if (isEditMode.value) {
                await CompanyService.updateCompany(company.value);
                showMessage('Empresa atualizada com sucesso!', 'success');
            } else {
                await CompanyService.createCompany(company.value);
                showMessage('Empresa criada com sucesso!', 'success');
            }

        } catch (error) {
            console.error('Erro ao salvar empresa:', error);
            showMessage('Erro ao salvar empresa', 'error');
        } finally {
            isLoading.value = false;
        }
    };

    // Métodos de advogados
    const editAdvogado = (advogado: UserAdvModel) => {
        editingAdvogado.value = advogado;
        formAdvogado.value = new UserAdvModel(
            advogado.uid,
            advogado.name,
            advogado.email,
            advogado.phone,
            advogado.photoUrl,
            advogado.createdAt,
            advogado.cpf,
            advogado.oab,
            advogado.birthDate,
            advogado.companyId,
            advogado.uf,
            advogado.fcmToken
        );
        sendAuthEmail.value = false;
        showAddAdvogadoModal.value = true;
    };

    const saveAdvogado = async () => {
        try {
            isSavingAdvogado.value = true;

            // Validações
            if (!formAdvogado.value.name) {
                showMessage('Nome é obrigatório', 'warning');
                return;
            }
            if (!formAdvogado.value.email) {
                showMessage('Email é obrigatório', 'warning');
                return;
            }
            if (!formAdvogado.value.cpf) {
                showMessage('CPF é obrigatório', 'warning');
                return;
            }
            if (!formAdvogado.value.oab) {
                showMessage('OAB é obrigatório', 'warning');
                return;
            }

            // Definir empresa
            formAdvogado.value.companyId = company.value.id;

            if (editingAdvogado.value) {
                // Atualizar advogado existente
                await UserAdvService.updateUserAdv(formAdvogado.value);
                showMessage('Advogado atualizado com sucesso!', 'success');
            } else {
                // Criar novo advogado com ou sem Firebase Auth
                if (sendAuthEmail.value) {
                    await UserAdvService.createUserAdvWithAuth(formAdvogado.value, true);
                    showMessage('Advogado criado e email de configuração enviado!', 'success');
                } else {
                    await UserAdvService.createUserAdv(formAdvogado.value);
                    showMessage('Advogado adicionado com sucesso!', 'success');
                }
            }

            // Recarregar lista e fechar modal
            await loadAdvogados();
            cancelAdvogadoModal();

        } catch (error) {
            console.error('Erro ao salvar advogado:', error);
            showMessage('Erro ao salvar advogado', 'error');
        } finally {
            isSavingAdvogado.value = false;
        }
    };

    const removeAdvogadoFromCompany = async (advogadoId: string) => {
        const result = await Swal.fire({
            title: 'Remover advogado?',
            text: 'Isso irá remover o vínculo do advogado com a empresa.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const advogado = await UserAdvService.getUserAdvById(advogadoId);
                if (advogado) {
                    advogado.companyId = undefined;
                    await UserAdvService.updateUserAdv(advogado);
                    await loadAdvogados();
                    showMessage('Advogado removido da empresa!', 'success');
                }
            } catch (error) {
                console.error('Erro ao remover advogado:', error);
                showMessage('Erro ao remover advogado', 'error');
            }
        }
    };

    const resendSetupEmail = async (email: string) => {
        try {
            await UserAdvService.resendSetupEmail(email);
            showMessage('Email de configuração reenviado!', 'success');
        } catch (error) {
            console.error('Erro ao reenviar email:', error);
            showMessage('Erro ao reenviar email', 'error');
        }
    };

    const cancelAdvogadoModal = () => {
        showAddAdvogadoModal.value = false;
        editingAdvogado.value = null;
        formAdvogado.value = new UserAdvModel();
        sendAuthEmail.value = true;
    };

    // Métodos de arquivo
    const triggerFileInput = () => {
        fileInput.value?.click();
    };

    const triggerContractInput = () => {
        contractInput.value?.click();
    };

    const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            fileImage = input.files[0];

            if (fileImage.type.includes('image')) {
                imageSrc.value = URL.createObjectURL(fileImage);
            }
        }
    };

    const handleContractChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            filePdf = input.files[0];

            if (filePdf.type.includes('pdf')) {
                showMessage('Contrato selecionado com sucesso!', 'success');
            }
        }
    };

    // Métodos de formatação
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

    const formatCurrency = (value: number): string => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return '-';
        }
    };

    // Métodos de valor monetário
    const updateMonthlyValue = (event: Event) => {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        let cleanValue = value.replace(/[^\d.,]/g, '');

        if (cleanValue.includes('.') && cleanValue.includes(',')) {
            cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
        } else if (cleanValue.includes(',')) {
            cleanValue = cleanValue.replace(',', '.');
        }

        const numericValue = parseFloat(cleanValue) || 0;
        company.value.monthlyValue = numericValue;

        maskedValue.value = numericValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    // Métodos de validação
    const validateEmail = (email: string): boolean => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    };

    // Métodos de benefícios
    const updateBeneficio = (beneficio: string, event: Event) => {
        const add = event.target as HTMLInputElement;
        if (!company.value.beneficios) {
            company.value.beneficios = [];
        }

        if (add.checked) {
            if (!company.value.beneficios.includes(beneficio as any)) {
                company.value.beneficios.push(beneficio as any);
            }
        } else {
            company.value.beneficios = company.value.beneficios.filter(b => b !== beneficio);
        }
    };

    // Método para ativar/desativar empresa
    const toggleCompanyStatus = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const isActive = target.checked;
        try {
            const action = isActive ? 'ativar' : 'desativar';

            const result = await Swal.fire({
                title: `${action.charAt(0).toUpperCase() + action.slice(1)} empresa?`,
                text: `Tem certeza que deseja ${action} esta empresa?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: isActive ? '#10b981' : '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: `Sim, ${action}!`,
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                company.value.isActive = isActive;

                // Salvar automaticamente a alteração
                await CompanyService.updateCompany(company.value);

                showMessage(
                    `Empresa ${isActive ? 'ativada' : 'desativada'} com sucesso!`,
                    'success'
                );
            } else {
                // Reverter o switch se cancelado
                company.value.isActive = !isActive;
            }
        } catch (error) {
            console.error('Erro ao alterar status da empresa:', error);
            showMessage('Erro ao alterar status da empresa', 'error');
            // Reverter o switch em caso de erro
            company.value.isActive = !isActive;
        }
    };

    // Métodos utilitários
    const handleAdvogadoImageError = (event: Event) => {
        const img = event.target as HTMLImageElement;
        img.src = '/assets/images/no-user.jpeg';
    };

    const handleClienteImageError = (event: Event) => {
        const img = event.target as HTMLImageElement;
        img.src = '/assets/images/no-user.jpeg';
    };

    const showMessage = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
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

    // Métodos de clientes
    const aplicarFiltroClientes = () => {
// Os filtros são aplicados automaticamente via computed
    };

    const limparFiltrosClientes = () => {
        filtroStatusCliente.value = '';
        searchCliente.value = '';
    };    const loadClientes = async () => {
        if (!company.value.id) return;

        isLoadingClientes.value = true;
        try {
            const allClientes = await CustomerService.getAllCustomers();
            companyClientes.value = allClientes.filter(cliente => cliente.companyId === company.value.id);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            showMessage('Erro ao carregar clientes', 'error');
        } finally {
            isLoadingClientes.value = false;
        }
    };

    // Computed para clientes
    const clientesAtivos = computed(() =>
        companyClientes.value.filter(cliente => cliente.isPlanoAtivo === true)
    );

    const clientesInativos = computed(() =>
        companyClientes.value.filter(cliente => cliente.isPlanoAtivo !== true)
    );

    const receitaMensal = computed(() => {
        const clientesAtivosCount = clientesAtivos.value.length;
        const valorMensal = company.value.monthlyValue || 0;
        return clientesAtivosCount * valorMensal;
    });

    const clientesFiltrados = computed(() => {
        let filtered = [...companyClientes.value];

        if (filtroStatusCliente.value === 'ativo') {
            filtered = filtered.filter(cliente => cliente.isPlanoAtivo === true);
        } else if (filtroStatusCliente.value === 'inativo') {
            filtered = filtered.filter(cliente => cliente.isPlanoAtivo !== true);
        }

        if (searchCliente.value.trim()) {
            const searchTerm = searchCliente.value.toLowerCase();
            filtered = filtered.filter(cliente =>
                cliente.name?.toLowerCase().includes(searchTerm) ||
                cliente.email?.toLowerCase().includes(searchTerm) ||
                cliente.cpf?.includes(searchTerm.replace(/\D/g, ''))
            );
        }

        return filtered;
    });
</script>

<style scoped>
    .custom_switch {
        @apply absolute w-full h-full opacity-0 z-10 cursor-pointer;
    }
</style>
