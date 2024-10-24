<template>
  <div class="flex lt-sm:flex-col gap-4">
    <Card title="金额录入">
      <template #header-extra>
        <button
          type="button"
          class="cursor-pointer text-white transition-all text-14px px-2 py-1 rounded-1 bg-blue-600 hover:bg-blue-500 hover:shadow"
          @click="handleAdd"
        >
          新增
        </button>
      </template>
      <div
        class="flex items-center gap-2 mb-4"
        v-for="(item, index) in items"
        :key="item"
      >
        <label class="font-bold">金额 {{ index + 1 }}: </label>
        <input
          class="flex-1 h-32px p-16px border-1 rounded-1"
          v-model="amount[index]"
          type="text"
          :placeholder="`金额 ${index + 1}`"
        />
        <button
          type="button"
          class="flex justify-center items-center h-30px w-30px bg-red-100 text-red-5 rounded-4 hover:shadow"
          @click="handleDelete(index)"
        >
          <div class="w-12px h-2px bg-red-600"></div>
        </button>
      </div>

      <div class="w-100% b-b-2 b-dashed my-4"></div>

      <form class="transition p-4 rounded-4 flex flex-col gap-4">
        <div class="flex lt-sm:flex-col lt-sm:items-start items-center gap-4">
          <label
            for="total"
            class="font-bold min-w-120px lt-sm:text-left text-right"
          >
            总金额：
          </label>
          <div class="w-100% box-border h-32px px-4 border-1 rounded-1">
            <input
              type="number"
              id="total"
              v-model="formModel.total"
              placeholder="Total"
            />
          </div>
        </div>
        <div class="flex lt-sm:flex-col lt-sm:items-start items-center gap-4">
          <label
            for="total"
            class="font-bold min-w-120px lt-sm:text-left text-right"
          >
            分隔次数：
          </label>
          <div class="w-100% box-border h-32px px-4 border-1 rounded-1">
            <input
              class="w-100% h-100%"
              type="number"
              id="total"
              v-model="formModel.partsCount"
              placeholder="partsCount"
            />
          </div>
        </div>
        <div class="flex lt-sm:flex-col lt-sm:items-start items-center gap-4">
          <label
            for="total"
            class="font-bold min-w-120px lt-sm:text-left text-right"
          >
            浮动范围(%):
          </label>
          <div class="w-100% box-border h-32px px-4 border-1 rounded-1">
            <input
              class="w-100% h-100%"
              type="number"
              id="total"
              v-model="formModel.percentageRange"
              placeholder="partsCount"
            />
          </div>
        </div>
        <div class="flex gap-4 justify-center">
          <button
            type="button"
            class="w-100% block py-8px px-16px border-1 rounded-2 text-white transition bg-blue-600 hover:bg-blue-400"
            @click="handleComputed"
          >
            计算
          </button>
        </div>
      </form>
    </Card>

    <Card title="计算结果">
      <template #header-extra>
        <div class="flex gap-2 items-center">
          <button
            type="button"
            class="cursor-pointer transition-all text-14px px-2 py-1 border-1 rounded-1 hover:bg-gray-200 hover:shadow"
            @click="handleExportImg"
          >
            <div class="i-hugeicons:image-download" />
          </button>
          <button
            type="button"
            class="cursor-pointer text-white transition-all text-14px px-2 py-1 rounded-1 bg-blue-600 hover:bg-blue-500 hover:shadow"
            v-if="historyList.length > 0"
            @click="checkedRecord = true"
          >
            上次记录
          </button>
        </div>
      </template>
      <table id="table-data" border class="w-full bg-white mt-4">
        <thead class="bg-gray-100">
          <tr class="h-40px">
            <th class="w-120px text-center">序号</th>
            <th class="w-120px text-center">金额</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="record.length > 0">
            <tr
              class="h-40px"
              v-for="(part, index) in record"
              :key="index"
              :style="{
                backgroundColor: index % 2 !== 0 ? '#f5f5f5' : '#fff',
              }"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ part }}</td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="2" class="text-center">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import Card from "./Card/index.vue";
import html2canvas from "html2canvas";

defineOptions({
  name: "BankTool",
});

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
  const range = Math.floor((avg * percentageRange) / 100);
  const minPart = avg - range;
  const maxPart = avg + range;

  // 生成10个正整数，每个都在平均值的波动范围内
  let parts: number[] = [];
  let remainingTotal = total;
  for (let i = 0; i < partsCount - 1; i++) {
    const partValue = Math.floor(
      Math.random() * (maxPart - minPart + 1) + minPart
    );
    parts.push(partValue);
    remainingTotal -= partValue;
  }

  // 最后一个数确保总和等于原始值
  const lastPart = Math.floor(remainingTotal);
  parts.push(lastPart);

  return parts;
}

const items = ref(3);
const amount = ref<number[]>(initAmount());
function initAmount() {
  return new Array(items.value).fill(0);
}

const handleAdd = () => {
  items.value += 1;

  amount.value.push(0);
};

const handleDelete = (index: number) => {
  items.value -= 1;
  amount.value.splice(index, 1);
};

// 根据不同金额，合计总数
function getTotal(arr: number[]) {
  return arr
    .map((item) => Number(item) || 0)
    .reduce((total, current) => {
      if (typeof current !== "number") {
        throw new Error("Array must contain only numbers");
      }
      if (current < 0) {
        throw new Error("Array must contain only non-negative integers");
      }
      return total + current;
    }, 0);
}

const formModel = reactive({
  total: 30000,
  partsCount: 10,
  percentageRange: 25,
});

watch(
  () => amount.value,
  (newVal) => {
    formModel.total = getTotal(newVal);
  },
  { deep: true, immediate: true }
);

// 上次历史缓存
const historyList = ref<number[]>(
  JSON.parse(localStorage.getItem("history") || "[]") || []
);
const checkedRecord = ref(false);

const parts = ref<number[]>([]);

// 展示记录
const record = computed(() => {
  if (historyList.value.length > 0 && checkedRecord.value) {
    return historyList.value;
  } else {
    return parts.value;
  }
});

const handleComputed = () => {
  parts.value =
    randomSplit2Int(
      formModel.total,
      formModel.partsCount,
      formModel.percentageRange
    ) || [];

  checkedRecord.value = false;

  localStorage.setItem("history", JSON.stringify(parts.value));
};

const handleExportImg = async () => {
  const table = document.getElementById("table-data");
  if (!table) {
    return;
  }
  const canvasDom = document.createElement("canvas");

  const w = parseInt(window.getComputedStyle(table).width, 10);
  const h = parseInt(window.getComputedStyle(table).height, 10);

  const scaleBy = window.devicePixelRatio;
  canvasDom.width = w * scaleBy;
  canvasDom.height = h * scaleBy;

  const canvas = await html2canvas(table, {
    canvas: canvasDom,
    scale: scaleBy,
    useCORS: true,
  });

  const url = canvas.toDataURL();

  const fileName = `分期计划-${new Date().valueOf()}`;
  downloadFile(url, fileName);
};

function downloadFile(url: string, fileName: string) {
  const downloadElement = document.createElement("a");
  downloadElement.href = url;
  downloadElement.download = `${fileName}.png`;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(url);
}
</script>

<style></style>
