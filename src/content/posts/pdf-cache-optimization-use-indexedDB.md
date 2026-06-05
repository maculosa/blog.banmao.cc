---
title: PDF 缓存优化：使用 IndexedDB
description: PDF 本地化缓存，缓减带宽压力
tags: [pdf, web, vue]
categories: [笔记]
lang: zh
---

# PDF预览优化：避免自动下载

## 问题背景

在开发发票记录系统时，我们遇到了一个问题：点击PDF预览时，浏览器会直接触发下载而不是在页面内预览。这是因为大多数浏览器对于直接链接到PDF文件的响应会默认执行下载操作。

## 解决方案

我们采用了 Blob URL 的方式来解决这个问题。Blob URL 是一种通过 URL.createObjectURL() 方法生成的临时 URL，可以指向一个 Blob 对象，这样浏览器就会将其作为一个可预览的文件来处理。

## 实现步骤

### 1. 准备预览对话框

首先，我们创建了一个 Element UI 的 Dialog 组件用于展示 PDF 预览：

```vue
<el-dialog
    title="发票预览"
    :visible.sync="previewVisible"
    width="80%"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleDialogClose">
    <div
        v-if="currentInvoice && currentInvoice.pdfUrl"
        style="height: 70vh;">
        <div v-if="previewLoading" style="display: flex; align-items: center; justify-content: center; height: 100%;">
            <i class="el-icon-loading" style="font-size: 30px;"></i>
            <span style="margin-left: 10px;">加载中...</span>
        </div>
        <iframe
            v-else-if="previewBlobUrl"
            :src="previewBlobUrl"
            style="width: 100%; height: 100%; border: none;"
            frameborder="0">
        </iframe>
    </div>
    <div v-else style="text-align: center; padding: 40px;">
        <el-empty description="暂无发票预览"></el-empty>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button
            type="primary"
            icon="el-icon-download"
            @click="handleDownloadInvoice"
            v-if="currentInvoice && currentInvoice.pdfUrl && !previewLoading">
            下载发票
        </el-button>
    </div>
</el-dialog>
```

### 2. 添加数据状态

在 Vue 组件的 `data()` 方法中添加以下状态：

```javascript
data() {
    return {
        // ... 其他数据
        previewVisible: false,      // 控制对话框显示/隐藏
        currentInvoice: null,       // 当前正在预览的发票数据
        previewBlobUrl: '',         // 用于预览的 Blob URL
        previewLoading: false       // 加载状态
    };
}
```

### 3. 实现 Blob URL 获取方法

```javascript
/**
 * 获取 Blob URL，用于预览 PDF
 * @param {string} url - 原始 PDF 链接
 * @returns {string} Blob URL
 */
async fetchBlobUrl(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        return URL.createObjectURL(pdfBlob);
    } catch (error) {
        console.error('获取 Blob URL 失败:', error);
        this.$message.error('获取预览文件失败');
        return null;
    }
}
```

### 4. 实现预览触发方法

```javascript
/**
 * 打开发票预览
 * @param {Object} row - 发票数据行
 */
async handlePreview(row) {
    this.currentInvoice = row;
    this.previewVisible = true;
    
    if (row.pdfUrl) {
        this.previewLoading = true;
        this.previewBlobUrl = await this.fetchBlobUrl(row.pdfUrl);
        this.previewLoading = false;
    }
}
```

### 5. 实现下载方法

```javascript
/**
 * 下载发票
 * @description 通过 Blob URL 下载，避免浏览器直接预览
 */
handleDownloadInvoice() {
    if (!this.currentInvoice || !this.currentInvoice.pdfUrl) {
        this.$message.warning('暂无发票可下载');
        return;
    }
    
    const link = document.createElement('a');
    link.href = this.previewBlobUrl || this.currentInvoice.pdfUrl;
    link.target = '_blank';
    link.download = `发票_${this.currentInvoice.invoiceNumber || 'download'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
```

### 6. 添加资源释放逻辑

```javascript
/**
 * 关闭预览对话框
 * @description 清理 Blob URL 释放内存
 */
handleDialogClose() {
    if (this.previewBlobUrl) {
        URL.revokeObjectURL(this.previewBlobUrl);
        this.previewBlobUrl = '';
    }
    this.previewLoading = false;
}
```

## 核心要点

1. **正确的 MIME 类型**：确保创建 Blob 时指定 `type: 'application/pdf'`，这样浏览器才会识别为可预览的 PDF。
2. **内存管理**：使用完 Blob URL 后务必调用 `URL.revokeObjectURL()` 释放内存，避免内存泄漏。
3. **用户体验**：添加加载状态和下载按钮，提升用户体验。

## 完整代码

查看完整实现：[invoice_records/index.vue](../src/views/trade_tax/invoice_records/index.vue)
