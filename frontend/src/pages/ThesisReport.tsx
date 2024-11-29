import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, Download, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface ReportSection {
  content: string;
  similarity: number;
  source: string;
}

interface ThesisReport {
  id: string;
  fileName: string;
  totalSimilarity: number;
  sections: ReportSection[];
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export default function ThesisReport() {
  const { reportId } = useParams();
  const [report, setReport] = useState<ThesisReport | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/thesis/report/${reportId}`);
        if (!response.ok) {
          throw new Error('获取报告失败');
        }
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError('加载报告失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    const pollReport = async () => {
      try {
        const response = await fetch(`/api/thesis/report/${reportId}`);
        if (!response.ok) {
          throw new Error('获取报告失败');
        }
        const data = await response.json();
        setReport(data);

        if (data.status === 'processing') {
          setTimeout(pollReport, 5000); // Poll every 5 seconds
        }
      } catch (err) {
        setError('加载报告失败，请重试');
      }
    };

    pollReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在加载查重报告...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto" />
          <p className="mt-4">{error || '报告不存在'}</p>
        </div>
      </div>
    );
  }

  if (report.status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在进行查重分析...</p>
          <p className="text-sm text-gray-500">预计需要5-10分钟</p>
        </div>
      </div>
    );
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity < 20) return 'text-green-500';
    if (similarity < 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">查重报告</h1>
              <p className="text-gray-500 mt-1">{report.fileName}</p>
            </div>
            <Button
              onClick={() => window.print()}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700">总体相似度</p>
                <p className={`text-3xl font-bold ${getSimilarityColor(report.totalSimilarity)}`}>
                  {report.totalSimilarity}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-700">检测时间</p>
                <p className="text-gray-900">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            详细分析
          </h2>

          <div className="space-y-6">
            {report.sections.map((section, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${getSimilarityColor(section.similarity)}`}>
                    相似度: {section.similarity}%
                  </span>
                  <a
                    href={section.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    查看来源
                  </a>
                </div>
                <div className="text-gray-700 text-sm whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900">报告说明</h3>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• 总体相似度低于20%为正常范围（绿色）</li>
            <li>• 相似度在20%-40%之间需要注意（黄色）</li>
            <li>• 相似度超过40%建议修改（红色）</li>
            <li>• 点击"查看来源"可以查看具体重复内容的来源</li>
            <li>• 可以导出报告进行离线查看或打印</li>
          </ul>
        </div>
      </div>
    </div>
  );
}