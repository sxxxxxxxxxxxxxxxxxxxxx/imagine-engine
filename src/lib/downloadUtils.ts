/**
 * 通用图片下载工具函数
 * 支持跨域图片下载，使用服务端代理解决CORS问题
 */

/**
 * 下载图片（支持跨域）
 * @param imageUrl - 图片URL（可以是HTTP URL或Data URL）
 * @param filename - 下载的文件名（可选）
 */
export async function downloadImage(imageUrl: string, filename?: string): Promise<void> {
  const downloadFilename = filename || `image-${Date.now()}.png`;
  
  console.log('🔽 开始下载图片:', imageUrl.substring(0, 100));
  
  // 如果是 Data URL，直接下载
  if (imageUrl.startsWith('data:image/')) {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = downloadFilename;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      setTimeout(() => {
        link.click();
        console.log('✅ Data URL 下载成功');
        
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      }, 10);
      
      return;
    } catch (error) {
      console.error('❌ Data URL 下载失败:', error);
      throw error;
    }
  }
  
  // HTTP URL：通过服务端代理下载（解决CORS问题）
  try {
    const proxyResponse = await fetch(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`);
    
    if (!proxyResponse.ok) {
      throw new Error(`代理下载失败: ${proxyResponse.status} ${proxyResponse.statusText}`);
    }
    
    const blob = await proxyResponse.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    // 创建隐藏的下载链接
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadFilename;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // 使用setTimeout确保DOM更新完成
    setTimeout(() => {
      link.click();
      console.log('✅ 通过服务端代理下载成功');
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    }, 10);
    
  } catch (error) {
    console.error('❌ 图片下载失败:', error);
    
    // 如果代理失败，尝试直接打开（作为后备方案）
    console.warn('⚠️ 尝试直接打开图片链接');
    window.open(imageUrl, '_blank');
    
    throw error;
  }
}