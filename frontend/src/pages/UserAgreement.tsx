import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserAgreement() {
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
            <h1>用户协议</h1>
            
            <h2>1. 服务条款</h2>
            <p>欢迎使用FreeNoAI（以下简称"本服务"）。本协议是您与FreeNoAI之间关于使用本服务所订立的协议。</p>

            <h2>2. 账号注册</h2>
            <p>您承诺：</p>
            <ul>
              <li>提供真实、准确、完整的个人资料</li>
              <li>及时更新注册资料，确保其真实性</li>
              <li>不得以任何非法目的使用本服务</li>
            </ul>

            <h2>3. 使用规则</h2>
            <p>您在使用本服务时应遵守以下规则：</p>
            <ul>
              <li>遵守所有适用的法律法规</li>
              <li>尊重知识产权</li>
              <li>不得从事任何可能损害本服务正常运营的行为</li>
            </ul>

            <h2>4. 服务内容</h2>
            <p>本服务提供：</p>
            <ul>
              <li>AIGC检测服务</li>
              <li>AIGC降重服务</li>
              <li>其他相关服务</li>
            </ul>

            <h2>5. 服务费用</h2>
            <p>本服务的收费标准和支付方式将在相关页面明确标示。我们保留调整服务价格的权利。</p>

            <h2>6. 知识产权</h2>
            <p>本服务涉及的所有知识产权均归FreeNoAI所有。未经许可，不得进行任何形式的复制或传播。</p>

            <h2>7. 免责声明</h2>
            <p>在法律允许的范围内，我们对以下情况不承担责任：</p>
            <ul>
              <li>因不可抗力导致的服务中断或数据丢失</li>
              <li>用户使用本服务产生的直接或间接损失</li>
              <li>第三方通过本服务发布的信息的准确性</li>
            </ul>

            <h2>8. 协议修改</h2>
            <p>我们保留随时修改本协议的权利。修改后的协议将在网站上公布。</p>

            <h2>9. 法律适用</h2>
            <p>本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。</p>
          </div>
        </article>
      </main>
    </div>
  );
}