<template>
    <div>
        <div class="absolute inset-0">
            <img src="/assets/images/auth/bg-gradient.png" alt="image" class="h-full w-full object-cover" />
        </div>
        <div
            class="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16"
        >
            <img src="/assets/images/auth/coming-soon-object1.png" alt="image" class="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
            <img src="/assets/images/auth/coming-soon-object2.png" alt="image" class="absolute left-24 top-0 h-40 md:left-[30%]" />
            <img src="/assets/images/auth/coming-soon-object3.png" alt="image" class="absolute right-0 top-0 h-[300px]" />
            <img src="/assets/images/auth/polygon-object.svg" alt="image" class="absolute bottom-0 end-[28%]" />
            <div
                class="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0"
            >
                <div
                    class="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]"
                >
                    <div
                        class="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"
                    ></div>
<!--                    <div class="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">-->
<!--                        <router-link to="/" class="w-48 block lg:w-72 ms-10">-->
<!--                            <img src="/assets/images/auth/logo-white.svg" alt="Logo" class="w-full" />-->
<!--                        </router-link>-->
<!--                        <div class="mt-24 hidden w-full max-w-[430px] lg:block">-->
<!--                            <img src="/assets/images/auth/login.svg" alt="Cover Image" class="w-full" />-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
                <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                    <div class="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                        <router-link to="/" class="w-8 block lg:hidden">
                            <img src="/assets/images/logo.svg" alt="Logo" class="mx-auto w-10" />
                        </router-link>
                    </div>
                    <div class="w-full max-w-[440px] lg:mt-16">
                        <div class="mb-10">
                            <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Login</h1>
                            <p class="text-base font-bold leading-normal text-white-dark">Entre com sei e-mail e sua senha</p>
                        </div>
                        <form class="space-y-5 dark:text-white" @submit.prevent="login">
                            <div>
                                <label for="Email">Email</label>
                                <div class="relative text-white-dark">
                                    <input id="Email" type="email" v-model="email" placeholder="Informe seu e-mail" class="form-input ps-10 placeholder:text-white-dark" />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-mail :fill="true" />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label for="Password">Password</label>
                                <div class="relative text-white-dark">
                                    <input id="Password" type="password" v-model="password" placeholder="Informe sua senha" class="form-input ps-10 placeholder:text-white-dark" />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                Entrar
                            </button>
                        </form>

                    </div>
                    <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear() }}.GUARDIAO JUS Rights Reserved.</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { onMounted, ref } from 'vue';
    import { useMeta } from '@/composables/use-meta';
    import IconMail from '@/components/icon/icon-mail.vue';
    import IconLockDots from '@/components/icon/icon-lock-dots.vue';

    import Swal from 'sweetalert2';
    import { useRouter } from 'vue-router';
    import AuthService from '@/services/AuthService';

    useMeta({ title: 'Login Cover' });
    const router = useRouter();

    const email = ref('');
    const password = ref('');

    const errorMessage = ref('');

    onMounted(() => {
        console.log(`ENTROU LOGIN`);
    })

    const login = async () => {
        errorMessage.value = '';
        try {
            await AuthService.login(email.value, password.value);
            router.push('/');
        } catch (error: any) {
            console.error('Erro ao fazer login:', error);
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage.value = 'O e-mail inserido não é válido.';
                    break;
                case 'auth/user-not-found':
                    errorMessage.value = 'Usuário não encontrado. Verifique o e-mail digitado.';
                    break;
                case 'auth/wrong-password':
                    errorMessage.value = 'Senha incorreta. Tente novamente.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage.value = 'Muitas tentativas falhas. Tente novamente mais tarde.';
                    break;
                default:
                    errorMessage.value = 'Erro ao fazer login. Verifique os dados e tente novamente.';
            }
                Swal.fire({
                    icon: 'info',
                    title: 'Falha ao fazer login',
                    text: errorMessage.value,
                    padding: '2em',
                    customClass: { popup: 'sweet-alerts' },
                });
        }
    };


</script>
