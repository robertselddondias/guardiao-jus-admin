<template>
    <svg
        :width="width"
        :height="height"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="className"
    >
        <!-- Marca de check -->
        <path
            d="M20 6L9 17L4 12"
            :stroke="stroke"
            :stroke-width="computedStrokeWidth"
            :stroke-linecap="strokeLinecap"
            :stroke-linejoin="strokeLinejoin"
            :fill="fillColor"
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
        variant?: 'outline' | 'bold' | 'thin' | 'heavy';
    }

    const props = withDefaults(defineProps<Props>(), {
        width: 24,
        height: 24,
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        fill: false,
        class: '',
        variant: 'outline'
    });

    const className = computed(() => props.class);

    const fillColor = computed(() => {
        return props.fill ? props.stroke : 'none';
    });

    // Ajusta a espessura baseado na variante
    const computedStrokeWidth = computed(() => {
        const baseWidth = Number(props.strokeWidth);

        switch (props.variant) {
            case 'thin':
                return baseWidth - 0.5;
            case 'bold':
                return baseWidth + 1;
            case 'heavy':
                return baseWidth + 2;
            default:
                return baseWidth;
        }
    });
</script>
