<template>
    <svg
        :width="width"
        :height="height"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="className"
    >
        <!-- Corpo do documento -->
        <path
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            :stroke="stroke"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke-linejoin="strokeLinejoin"
            :fill="fillColor"
        />

        <!-- Dobra da página -->
        <path
            d="M14 2V8H20"
            :stroke="stroke"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke-linejoin="strokeLinejoin"
            :fill="variant === 'filled' ? 'white' : 'none'"
        />

        <!-- Linhas de texto -->
        <path
            d="M16 13H8"
            :stroke="textStroke"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke-linejoin="strokeLinejoin"
        />
        <path
            d="M16 17H8"
            :stroke="textStroke"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke-linejoin="strokeLinejoin"
        />
        <path
            d="M10 9H8"
            :stroke="textStroke"
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
        fill?: boolean;
        class?: string;
        variant?: 'outline' | 'filled' | 'minimal';
        showText?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        width: 24,
        height: 24,
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        fill: false,
        class: '',
        variant: 'outline',
        showText: true
    });

    const className = computed(() => props.class);

    const fillColor = computed(() => {
        if (props.variant === 'filled') {
            return props.stroke;
        }
        return props.fill ? props.stroke : 'none';
    });

    const textStroke = computed(() => {
        if (props.variant === 'filled') {
            return 'white';
        }
        if (props.variant === 'minimal') {
            return 'transparent';
        }
        return props.showText ? props.stroke : 'transparent';
    });
</script>
