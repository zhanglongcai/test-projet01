import { motion } from 'framer-motion';
import { Upload, Search, FileText } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: '上传文件',
    description: '支持PDF、Word格式，文件大小不超过15MB'
  },
  {
    icon: Search,
    title: '开始检测',
    description: '系统自动分析文本内容，与数据库进行对比'
  },
  {
    icon: FileText,
    title: '查看报告',
    description: '生成详细的查重报告，展示重复率和具体内容'
  }
];

export const Steps = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">使用流程</h2>
          <p className="mt-4 text-xl text-gray-600">
            简单三步，快速完成论文查重
          </p>
        </div>
        <div className="mt-16">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white px-4"
                >
                  <div className="text-center">
                    <div className="relative">
                      <div className="mx-auto h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};