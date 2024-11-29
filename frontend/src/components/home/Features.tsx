import { motion } from 'framer-motion';
import { Shield, Clock, FileCheck, PieChart } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '安全可靠',
    description: '采用先进的加密技术，确保您的论文数据安全。所有上传的文件都经过严格的保护。'
  },
  {
    icon: Clock,
    title: '快速处理',
    description: '先进的查重算法，快速完成分析。通常在15分钟内即可获得详细的查重报告。'
  },
  {
    icon: FileCheck,
    title: '准确度高',
    description: '多重对比算法，确保查重结果的准确性。支持多种文件格式，全面分析重复内容。'
  },
  {
    icon: PieChart,
    title: '详细报告',
    description: '生成清晰直观的查重报告，包含总体重复率、段落分析等多维度数据展示。'
  }
];

export const Features = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">为什么选择我们</h2>
          <p className="mt-4 text-xl text-gray-600">
            专业的论文查重服务，让您的学术成果更有保障
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-blue-600 rounded-full p-3">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};