import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { toastManager } from '../../utils/toast-manager';
import { Logo } from '../../components/Logo';
import { EmailLogin } from '../../components/auth/EmailLogin';
import { PhoneLogin } from '../../components/auth/PhoneLogin';
import { QRCode } from '../../components/auth/QRCode';
import { WeChatMPLogin } from '../../components/auth/WeChatMPLogin';
import { PageTransition } from '../PageTransition';
import { motion } from 'framer-motion';

type LoginType = 'email' | 'phone' | 'wechat';

const tabVariants = {
  active: {
    borderColor: '#3B82F6',
    color: '#3B82F6',
    transition: { duration: 0.2 }
  },
  inactive: {
    borderColor: 'transparent',
    color: '#6B7280',
    transition: { duration: 0.2 }
  }
};

const contentVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export function Login() {
  // ... existing state and handlers ...

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Logo />
          </motion.div>
          <motion.h2 
            className="mt-6 text-center text-3xl font-extrabold text-gray-900"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            登录账号
          </motion.h2>
          <motion.p 
            className="mt-2 text-center text-sm text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            还没有账号？{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              立即注册
            </Link>
          </motion.p>
        </div>

        <motion.div 
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center space-x-4 border-b mb-6">
              {['email', 'phone', 'wechat'].map((type) => (
                <motion.button
                  key={type}
                  className="pb-2 px-4 border-b-2"
                  variants={tabVariants}
                  animate={loginType === type ? 'active' : 'inactive'}
                  onClick={() => setLoginType(type as LoginType)}
                >
                  {type === 'email' ? '邮箱登录' : 
                   type === 'phone' ? '手机号登录' : '微信登录'}
                </motion.button>
              ))}
            </div>

            <motion.div
              key={loginType}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {loginType === 'email' && (
                <EmailLogin onLogin={handleEmailLogin} isLoading={isLoading} />
              )}
              
              {loginType === 'phone' && (
                <PhoneLogin onLogin={handlePhoneLogin} isLoading={isLoading} />
              )}
              
              {loginType === 'wechat' && (
                <div className="space-y-6">
                  <QRCode onSuccess={handleWeChatLogin} />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">或</span>
                    </div>
                  </div>
                  <WeChatMPLogin />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}