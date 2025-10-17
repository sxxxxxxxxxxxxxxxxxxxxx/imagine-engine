'use client';

import { useMemo } from 'react';

interface MarkdownMessageProps {
  content: string;
}

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
  // 简单的Markdown渲染（不依赖外部库）
  const renderMarkdown = useMemo(() => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside mb-3 space-y-1">
            {currentList.map((item, i) => (
              <li key={i} className="text-sm leading-relaxed">{renderInline(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const flushCodeBlock = () => {
      if (currentCodeBlock.length > 0) {
        elements.push(
          <div key={`code-${elements.length}`} className="mb-3 rounded-xl overflow-hidden border border-dark-200 dark:border-dark-700">
            <div className="bg-dark-800 dark:bg-dark-900 px-3 py-1.5 flex items-center justify-between">
              <span className="text-xs text-dark-400">{codeLanguage || 'code'}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentCodeBlock.join('\n'));
                }}
                className="text-xs text-dark-400 hover:text-primary-400 transition-colors"
              >
                复制
              </button>
            </div>
            <pre className="bg-dark-900 dark:bg-dark-950 p-4 overflow-x-auto">
              <code className="text-sm text-green-400 font-mono">
                {currentCodeBlock.join('\n')}
              </code>
            </pre>
          </div>
        );
        currentCodeBlock = [];
        codeLanguage = '';
      }
    };

    const renderInline = (text: string): JSX.Element => {
      let processed = text;
      const parts: (string | JSX.Element)[] = [];
      let key = 0;

      // 处理加粗 **text**
      const boldRegex = /\*\*(.+?)\*\*/g;
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(processed)) !== null) {
        if (match.index > lastIndex) {
          parts.push(processed.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`bold-${key++}`} className="font-semibold text-dark-900 dark:text-dark-50">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < processed.length) {
        parts.push(processed.substring(lastIndex));
      }

      // 处理行内代码 `code`
      const codeRegex = /`([^`]+)`/g;
      const finalParts: (string | JSX.Element)[] = [];
      parts.forEach((part, idx) => {
        if (typeof part === 'string') {
          let str = part;
          let lastIdx = 0;
          let codeMatch;
          while ((codeMatch = codeRegex.exec(str)) !== null) {
            if (codeMatch.index > lastIdx) {
              finalParts.push(str.substring(lastIdx, codeMatch.index));
            }
            finalParts.push(
              <code key={`code-${idx}-${key++}`} className="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs font-mono">
                {codeMatch[1]}
              </code>
            );
            lastIdx = codeMatch.index + codeMatch[0].length;
          }
          if (lastIdx < str.length) {
            finalParts.push(str.substring(lastIdx));
          }
        } else {
          finalParts.push(part);
        }
      });

      return <>{finalParts}</>;
    };

    lines.forEach((line, index) => {
      // 代码块检测
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          flushList();
          inCodeBlock = true;
          codeLanguage = line.trim().substring(3);
        } else {
          inCodeBlock = false;
          flushCodeBlock();
        }
        return;
      }

      if (inCodeBlock) {
        currentCodeBlock.push(line);
        return;
      }

      // 标题
      if (line.startsWith('###')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="text-lg font-bold text-dark-900 dark:text-dark-50 mt-4 mb-2">
            {line.substring(3).trim()}
          </h3>
        );
      } else if (line.startsWith('##')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl font-bold text-dark-900 dark:text-dark-50 mt-4 mb-3">
            {line.substring(2).trim()}
          </h2>
        );
      } else if (line.startsWith('#')) {
        flushList();
        elements.push(
          <h1 key={`h1-${index}`} className="text-2xl font-bold text-dark-900 dark:text-dark-50 mt-5 mb-3">
            {line.substring(1).trim()}
          </h1>
        );
      }
      // 列表
      else if (line.trim().match(/^[-*]\s/)) {
        currentList.push(line.trim().substring(2));
      }
      else if (line.trim().match(/^\d+\.\s/)) {
        currentList.push(line.trim().replace(/^\d+\.\s/, ''));
      }
      // 空行
      else if (line.trim() === '') {
        flushList();
        if (elements.length > 0 && elements[elements.length - 1].type !== 'div') {
          elements.push(<div key={`space-${index}`} className="h-2" />);
        }
      }
      // 普通段落
      else if (line.trim()) {
        flushList();
        elements.push(
          <p key={`p-${index}`} className="text-sm leading-relaxed mb-2 text-dark-700 dark:text-dark-300">
            {renderInline(line)}
          </p>
        );
      }
    });

    flushList();
    flushCodeBlock();

    return elements;
  }, [content]);

  return (
    <div className="markdown-content">
      {renderMarkdown}
    </div>
  );
}

