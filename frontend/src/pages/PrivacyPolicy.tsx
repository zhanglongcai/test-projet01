import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-blue max-w-none">
            <h1>隐私政策</h1>
            
            <h2>1. 信息收集</h2>
            <p>我们收集的信息包括：</p>
            <ul>
              <li>注册信息（邮箱、手机号等）</li>
              <li>使用记录</li>
              <li>设备信息</li>
              <li>日志信息</li>
            </ul>

            <h2>2. 信息使用</h2>
            <p>我们使用收集的信息用于：</p>
            <ul>
              <li>提供、维护和改进服务</li>
              <li>处理您的请求和订单</li>
              <li>发送服务通知</li>
              <li>防范安全风险</li>
            </ul>

            <h2>3. 信息共享</h2>
            <p>除以下情况外，我们不会与第三方共享您的个人信息：</p>
            <ul>
              <li>获得您的明确同意</li>
              <li>法律法规要求</li>
              <li>保护FreeNoAI的合法权益</li>
            </ul>

            <h2>4. 信息安全</h2>
            <p>我们采取多种安全措施保护您的个人信息：</p>
            <ul>
              <li>数据加密存储</li>
              <li>访问控制</li>
              <li>安全审计</li>
            </ul>

            <h2>5. Cookie使用</h2>
            <p>我们使用Cookie和类似技术：</p>
            <ul>
              <li>记住您的偏好设置</li>
              <li>改善用户体验</li>
              <li>分析服务使用情况</li>
            </ul>

            <h2>6. 您的权利</h2>
            <p>您对个人信息享有以下权利：</p>
            <ul>
              <li>访问和更正您的个人信息</li>
              <li>删除您的账号</li>
              <li>撤回同意</li>
              <li>投诉举报</li>
            </ul>

            <h2>7. 未成年人保护</h2>
            <p>我们高度重视对未成年人个人信息的保护。如果您是未成年人，请在监护人指导下使用我们的服务。</p>

            <h2>8. 政策更新</h2>
            <p>我们可能适时修改本隐私政策。当政策发生重大变更时，我们会在网站显著位置发布通知。</p>

            <h2>9. 联系我们</h2>
            <p>如果您对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
            <ul>
              <li>邮箱：support@freenoai.com</li>
              <li>电话：400-xxx-xxxx</li>
            </ul>
          </div>
        </article>
      </main>
    </div>
  );
}