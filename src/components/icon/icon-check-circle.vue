<template>
    <svg
        :width="width"
        :height="height"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="className"
    >
        <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            :stroke="stroke"
            :stroke-width="strokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke-linejoin="strokeLinejoin"
            :fill="fillColor"
        />
        <path
            d="M9 12L11 14L15 10"
            :stroke="checkStroke"
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
        variant?: 'outline' | 'filled' | 'solid';
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
        variant: 'outline'
    });

    const className = computed(() => props.class);

    const fillColor = computed(() => {
        if (props.variant === 'filled' || props.variant === 'solid') {
            return props.stroke;
        }
        return props.fill ? props.stroke : 'none';
    });

    const checkStroke = computed(() => {
        if (props.variant === 'filled' || props.variant === 'solid') {
            return 'white';
        }
        return props.stroke;
    });
</script>
