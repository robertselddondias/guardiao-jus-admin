<template>
    <svg
        :width="width"
        :height="height"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="className"
    >
        <!-- Linha diagonal da seta -->
        <path
            d="M7 17L17 7"
            :stroke="stroke"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke-linejoin="strokeLinejoin"
        />

        <!-- Linha horizontal da ponta da seta -->
        <path
            d="M7 7H17"
            :stroke="stroke"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke-linejoin="strokeLinejoin"
        />

        <!-- Linha vertical da ponta da seta -->
        <path
            d="M17 7V17"
            :stroke="stroke"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke-linejoin="strokeLinejoin"
        />
    </svg>
</template>

<script setup lang="ts">
    import { computed } from 'vue';

    interface Props {
        width?: string | number;
        height?: string | number;
        stroke?: string;
        strokeWidth?: string | number;
        strokeLinecap?: 'butt' | 'round' | 'square';
        strokeLinejoin?: 'miter' | 'round' | 'bevel';
        class?: string;
        variant?: 'outline' | 'bold' | 'thin';
    }

    const props = withDefaults(defineProps<Props>(), {
        width: 24,
        height: 24,
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        class: '',
        variant: 'outline'
    });

    const className = computed(() => props.class);

    // Ajusta a espessura baseado na variante
    const computedStrokeWidth = computed(() => {
        if (props.variant === 'bold') {
            return Number(props.strokeWidth) + 0.5;
        }
        if (props.variant === 'thin') {
            return Number(props.strokeWidth) - 0.5;
        }
        return props.strokeWidth;
    });
</script>
