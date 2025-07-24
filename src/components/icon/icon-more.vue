<template>
    <svg
        :width="width"
        :height="height"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="className"
    >
        <!-- Três pontos para "mais opções" -->
        <circle
            :cx="dot1Position.cx"
            :cy="dot1Position.cy"
            :r="dotRadius"
            :fill="dotFill"
            :stroke="stroke"
            :stroke-width="dotStrokeWidth"
        />
        <circle
            :cx="dot2Position.cx"
            :cy="dot2Position.cy"
            :r="dotRadius"
            :fill="dotFill"
            :stroke="stroke"
            :stroke-width="dotStrokeWidth"
        />
        <circle
            :cx="dot3Position.cx"
            :cy="dot3Position.cy"
            :r="dotRadius"
            :fill="dotFill"
            :stroke="stroke"
            :stroke-width="dotStrokeWidth"
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
        class?: string;
        variant?: 'vertical' | 'horizontal' | 'filled' | 'outline';
        dotSize?: 'small' | 'medium' | 'large';
    }

    const props = withDefaults(defineProps<Props>(), {
        width: 24,
        height: 24,
        stroke: 'currentColor',
        strokeWidth: 0,
        class: '',
        variant: 'filled',
        dotSize: 'medium'
    });

    const className = computed(() => props.class);

    const dotFill = computed(() => {
        if (props.variant === 'outline') {
            return 'none';
        }
        return props.stroke;
    });

    const dotStrokeWidth = computed(() => {
        if (props.variant === 'outline') {
            return Number(props.strokeWidth) || 1.5;
        }
        return 0;
    });

    // Computed para posições dos pontos baseado na variante
    const dot1Position = computed(() => {
        if (props.variant === 'horizontal') {
            return { cx: 5, cy: 12 };
        }
        return { cx: 12, cy: 5 };
    });

    const dot2Position = computed(() => {
        return { cx: 12, cy: 12 };
    });

    const dot3Position = computed(() => {
        if (props.variant === 'horizontal') {
            return { cx: 19, cy: 12 };
        }
        return { cx: 12, cy: 19 };
    });

    // Tamanho dos pontos baseado na prop dotSize
    const dotRadius = computed(() => {
        switch (props.dotSize) {
            case 'small':
                return 0.5;
            case 'large':
                return 1.5;
            default:
                return 1;
        }
    });
</script>
