<template>
    <main>
        <h2>현재 마우스 위치</h2>
        <p>
            {{ printMousePosition.position.x }} |
            {{ printMousePosition.position.y }}
        </p>
        <br />

        <h2>마우스 이동</h2>
        <label
            >x: <input v-model="moveMousePosition.$input.x" type="text"
        /></label>
        <label
            >y:
            <input v-model="moveMousePosition.$input.y" type="text" />
        </label>
        <button @click="moveMousePosition.action">move</button>
        <br />
        <br />

        <h2>마우스 스무스하게 이동</h2>
        <label
            >x: <input v-model="smoothMoveMousePosition.$input.x" type="text"
        /></label>
        <label
            >y:
            <input v-model="smoothMoveMousePosition.$input.y" type="text" />
        </label>
        <button @click="smoothMoveMousePosition.action">smooth move</button>
        <br />
        <br />

        <h2>마우스 클릭</h2>
        <label>x: <input v-model="mouseClick.$input.x" type="text" /></label>
        <label>y: <input v-model="mouseClick.$input.y" type="text" /> </label>
        <br />
        <label
            >count: <input v-model="mouseClick.$input.count" type="text" />
        </label>
        <button @click="mouseClick.setPosition">set position</button>
        <br />
        settings | x: {{ mouseClick.settings.x }}, y:
        {{ mouseClick.settings.y }}, count: {{ mouseClick.settings.count }}
        <button @click="mouseClick.action">mouse click</button>

        <br /><br /><br />
        {{ count }}
        <button @click="count++">Click me!</button>
    </main>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";

interface Position {
    x: number;
    y: number;
}

const count = ref(0);

// 마우스 좌표 출력
const printMousePosition = reactive<{
    position: Position;
    $interval: any;
    action: () => void;
}>({
    position: {
        x: 0,
        y: 0,
    },
    $interval: null,
    action: async function () {
        try {
            const { x, y } = await window.api.getMousePosition();

            this.position = {
                x,
                y,
            };
        } catch (error) {
            console.error(error);
        }
    },
});

// 마우스 좌표 이동
const moveMousePosition = reactive<{
    $input: Record<keyof Position, string>;
    action: () => void;
}>({
    $input: {
        x: "",
        y: "",
    },
    action: async function () {
        const { x, y } = this.$input;

        const parsingX = parseInt(x);
        const parsingY = parseInt(y);

        if (isNaN(parsingX) || isNaN(parsingY)) {
            alert("좌표를 다시 입력해주세요");
            return;
        }

        window.api.setMousePosition(parsingX, parsingY);
    },
});

// 마우스 스무스하게 이동
const smoothMoveMousePosition = reactive<{
    $input: Record<keyof Position, string>;
    action: () => void;
}>({
    $input: {
        x: "",
        y: "",
    },
    action: async function () {
        const { x, y } = this.$input;

        const parsingX = parseInt(x);
        const parsingY = parseInt(y);

        if (isNaN(parsingX) || isNaN(parsingY)) {
            alert("좌표를 다시 입력해주세요");
            return;
        }

        window.api.setSmoothMousePosition(parsingX, parsingY);
    },
});

// 마우스 클릭
const mouseClick = reactive<{
    $input: Record<keyof Position, string> & { count: string };
    settings: Position & { count: number };
    setPosition: () => void;
    action: () => void;
}>({
    $input: {
        x: "",
        y: "",
        count: "",
    },
    settings: {
        x: 0,
        y: 0,
        count: 0,
    },
    setPosition: function () {
        const { x, y, count } = this.$input;

        const parsingX = parseInt(x);
        const parsingY = parseInt(y);
        const parsingCount = parseInt(count);

        if (isNaN(parsingX) || isNaN(parsingY) || isNaN(parsingCount)) {
            alert("좌표나 개수를 다시 입력해주세요");
            return;
        }

        this.settings = {
            x: parsingX,
            y: parsingY,
            count: parsingCount,
        };
    },
    action: function () {
        const { x, y, count } = this.settings;

        window.api.actionClick(x, y, count);
    },
});

function init() {
    printMousePosition.$interval = setInterval(() => {
        printMousePosition.action();
    }, 2000);
}

onBeforeMount(() => {
    init();
});
</script>

<style scoped>
label > input {
    border: 1px solid #000;
    margin-right: 8px;
}

main > button {
    padding: 8px 16px;
}
</style>
