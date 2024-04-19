<template>
    <div class="flex gap-4">
        <div class="w-full">
            <form
                class="mb-4 transition shadow hover:shadow-xl bg-#fff flex flex-col p-4 rounded-4">

                <div class="flex flex-col gap-4">
                    <label for="total" class="font-bold min-w-120px h-32px line-height-32px">Total：</label>
                    <input class="h-32px p-16px border-1 rounded-1 mb-4" type="number" id="total"
                        v-model="formModel.total" placeholder="Total" />
                </div>
                <div class="flex flex-col gap-4">
                    <label for="total" class="font-bold min-w-120px h-32px line-height-32px">分隔数量：</label>
                    <input class="h-32px p-16px border-1 rounded-1 mb-4" type="number" id="total"
                        v-model="formModel.partsCount" placeholder="partsCount" />
                </div>
                <div class="flex flex-col gap-4">
                    <label for="total" class="font-bold min-w-120px h-32px line-height-32px">浮动范围（%）：</label>
                    <input class="h-32px p-16px border-1 rounded-1 mb-4" type="number" id="total"
                        v-model="formModel.percentageRange" placeholder="partsCount" />
                </div>
                <div class="flex gap-4 justify-center">
                    <button type="button"
                        class="py-4px px-16px border-1 rounded-1 text-white transition bg-blue-600 hover:bg-blue-400 w-120px"
                        @click="handleComputed">计算</button>
                </div>
            </form>
        </div>

        <!-- <div>
            <div v-for="(part, index) in parts" :key="index">
                {{ part }}
            </div>
        </div> -->
        <table border class="w-full bg-white">
            <thead class="bg-gray-100">
                <tr class="h-40px">
                    <th class="w-120px text-center">序号</th>
                    <th class="w-120px text-center">金额</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="parts.length > 0">
                    <tr class="h-40px" v-for="(part, index) in parts" :key="index"
                        :style="{ backgroundColor: index % 2 !== 0 ? '#f5f5f5' : '#fff' }">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td class="text-center">{{ part }}</td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="2" class="text-center">
                        暂无数据
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

defineOptions({
    name: 'BankTool'
})


function randomSplit2Int(total, partsCount, percentageRange) {
    if (partsCount <= 0) {
        throw new Error("Parts count must be a positive integer");
    }
    if (total < partsCount) {
        throw new Error("Total must be greater than or equal to parts count");
    }

    // 计算平均值和波动范围
    const avg = Math.floor(total / partsCount);
    // const range = total % partsCount;
    const range = Math.floor(avg * percentageRange / 100);
    const minPart = avg - range;
    const maxPart = avg + range;

    // 生成10个正整数，每个都在平均值的波动范围内
    let parts: number[] = [];
    let remainingTotal = total;
    for (let i = 0; i < partsCount - 1; i++) {
        const partValue = Math.floor(Math.random() * (maxPart - minPart + 1) + minPart);
        parts.push(partValue);
        remainingTotal -= partValue;
    }

    // 最后一个数确保总和等于原始值
    const lastPart = Math.floor(remainingTotal);
    parts.push(lastPart);

    return parts;
}

const formModel = reactive({
    total: 30000,
    partsCount: 10,
    percentageRange: 25
})

// const historyList = ref<any[]>(JSON.parse(localStorage.getItem('history') || '[]') || [])

const historyList = ref<any[]>([])
const parts = ref<number[]>([])

const handleComputed = () => {

    parts.value = randomSplit2Int(formModel.total, formModel.partsCount, formModel.percentageRange) || []

    historyList.value.push({
        total: formModel.total,
        partsCount: formModel.partsCount,
        percentageRange: formModel.percentageRange,
        result: parts.value
    })

    localStorage.setItem('history', JSON.stringify(historyList.value))
}


</script>

<style></style>
