import { Invoice, Totals } from "./types";
import html2canvas from "html2canvas";

/**
 * 导出发票预览为 JPG 图片
 * @param invoice 发票数据
 * @param totals 发票总额计算结果
 * @param previewContainerId 预览容器的 ID
 */
export async function exportToJpg(invoice: Invoice, totals: Totals, previewContainerId: string): Promise<void> {
  try {
    const element = document.getElementById(previewContainerId);

    if (!element) {
      throw new Error(`Element with id '${previewContainerId}' not found`);
    }

    // 使用原始元素而不是克隆，因为克隆可能导致样式问题
    // 等待字体加载完成
    if (typeof document.fonts !== 'undefined') {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 100)); // 额外等待确保渲染完成
    }

    // 使用 html2canvas 截取元素
    const canvas = await html2canvas(element, {
      scale: 2, // 提高分辨率
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: Math.min(element.scrollWidth, 2000), // 限制最大宽度
      height: Math.min(element.scrollHeight, 3000), // 限制最大高度
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    // 将 canvas 转换为 JPG Blob
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.number || "invoice"}.jpg`;

      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 释放 URL 对象
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95); // 95% 质量的 JPG
  } catch (error) {
    console.error('Failed to export to JPG:', error);
    throw error;
  }
}