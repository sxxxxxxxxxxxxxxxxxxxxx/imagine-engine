'use client';

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';

export default function TestApiPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testGenerateAPI = async () => {
    setIsLoading(true);
    setTestResult('正在测试文生图API...\n');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: '一只可爱的小猫',
          style: 'realistic',
          aspectRatio: '1:1'
        }),
      });

      const data = await response.json();
      
      setTestResult(prev => prev + `\n响应状态: ${response.status}\n`);
      setTestResult(prev => prev + `响应数据: ${JSON.stringify(data, null, 2)}\n`);
      
      if (response.ok && data.imageUrl) {
        setTestResult(prev => prev + `✅ 文生图API测试成功！\n图片URL: ${data.imageUrl}\n`);
      } else {
        setTestResult(prev => prev + `❌ 文生图API测试失败: ${data.error || '未知错误'}\n`);
      }
    } catch (error) {
      setTestResult(prev => prev + `❌ 请求失败: ${error instanceof Error ? error.message : '未知错误'}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setIsLoading(true);
    setTestResult('正在直接测试API端点...\n');
    
    try {
      const response = await fetch('https://newapi.pockgo.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-C358zCIUzlUZ7daJl4PEtu6njZz7g7k3luAWRqpS64gi0pjs',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash-image-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Generate an image based on this prompt: a cute cat. High quality, detailed, professional.',
                }
              ],
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      setTestResult(prev => prev + `\n直接API响应状态: ${response.status}\n`);
      setTestResult(prev => prev + `直接API响应数据: ${JSON.stringify(data, null, 2)}\n`);
      
      if (response.ok) {
        setTestResult(prev => prev + `✅ 直接API调用成功！\n`);
      } else {
        setTestResult(prev => prev + `❌ 直接API调用失败\n`);
      }
    } catch (error) {
      setTestResult(prev => prev + `❌ 直接API请求失败: ${error instanceof Error ? error.message : '未知错误'}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  const testChatAPI = async () => {
    setIsLoading(true);
    setTestResult('正在测试聊天API...\n');
    
    try {
      const response = await fetch('https://newapi.aicohere.org/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-C358zCIUzlUZ7daJl4PEtu6njZz7g7k3luAWRqpS64gi0pjs',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-7-sonnet-20250219',
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a test message.',
            }
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      setTestResult(prev => prev + `\n聊天API响应状态: ${response.status}\n`);
      setTestResult(prev => prev + `聊天API响应数据: ${JSON.stringify(data, null, 2)}\n`);
      
      if (response.ok) {
        setTestResult(prev => prev + `✅ 聊天API调用成功！\n`);
      } else {
        setTestResult(prev => prev + `❌ 聊天API调用失败\n`);
      }
    } catch (error) {
      setTestResult(prev => prev + `❌ 聊天API请求失败: ${error instanceof Error ? error.message : '未知错误'}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 API 测试工具</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={testGenerateAPI}
              disabled={isLoading}
              className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              测试文生图API
            </button>
            
            <button
              onClick={testDirectAPI}
              disabled={isLoading}
              className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              直接测试图像API
            </button>
            
            <button
              onClick={testChatAPI}
              disabled={isLoading}
              className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              测试聊天API
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap h-96 overflow-y-auto">
            {testResult || '点击上方按钮开始测试...'}
            {isLoading && (
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin mr-2"></div>
                <span>测试中...</span>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">API 配置信息:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li><strong>图像API:</strong> https://newapi.pockgo.com/v1/chat/completions</li>
              <li><strong>聊天API:</strong> https://newapi.aicohere.org/v1/chat/completions</li>
              <li><strong>图像模型:</strong> gemini-2.5-flash-image-preview</li>
              <li><strong>聊天模型:</strong> claude-3-7-sonnet-20250219</li>
              <li><strong>API Key:</strong> sk-C358zCIUzlUZ7daJl4PEtu6njZz7g7k3luAWRqpS64gi0pjs</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}