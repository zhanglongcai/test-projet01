import { useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { Layout } from '../../components/Layout';
import { PhoneBinding } from '../../components/profile/PhoneBinding';
import { WeChatBinding } from '../../components/profile/WeChatBinding';
import { GoogleBinding } from '../../components/profile/GoogleBinding';
import { FacebookBinding } from '../../components/profile/FacebookBinding';
import { GitHubBinding } from '../../components/profile/GitHubBinding';
import { AppleBinding } from '../../components/profile/AppleBinding';

export function AccountBinding() {
  const user = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              账号绑定
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>绑定第三方账号，享受更便捷的登录体验</p>
            </div>

            <div className="mt-8 space-y-8">
              <PhoneBinding
                currentPhone={user?.phone}
                onBind={async (data) => {
                  const response = await fetch('/api/auth/phone/bind', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${useUserStore.getState().token}`
                    },
                    body: JSON.stringify(data)
                  });
                  const result = await response.json();
                  if (response.ok) {
                    updateUser(result.data);
                  }
                  return response.ok;
                }}
                onUnbind={async () => {
                  const response = await fetch('/api/auth/phone/unbind', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${useUserStore.getState().token}`
                    }
                  });
                  const result = await response.json();
                  if (response.ok) {
                    updateUser(result.data);
                  }
                  return response.ok;
                }}
              />

              <div className="border-t border-gray-200 pt-8">
                <WeChatBinding
                  isConnected={!!user?.wechatId}
                  onBind={async (data) => {
                    const response = await fetch('/api/auth/wechat/bind', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      },
                      body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                  onUnbind={async () => {
                    const response = await fetch('/api/auth/wechat/unbind', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      }
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                />
              </div>

              <div className="border-t border-gray-200 pt-8">
                <GoogleBinding
                  isConnected={!!user?.googleId}
                  onBind={async (data) => {
                    const response = await fetch('/api/auth/google/bind', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      },
                      body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                  onUnbind={async () => {
                    const response = await fetch('/api/auth/google/unbind', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      }
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                />
              </div>

              <div className="border-t border-gray-200 pt-8">
                <FacebookBinding
                  isConnected={!!user?.facebookId}
                  onBind={async (data) => {
                    const response = await fetch('/api/auth/facebook/bind', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      },
                      body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                  onUnbind={async () => {
                    const response = await fetch('/api/auth/facebook/unbind', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      }
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                />
              </div>

              <div className="border-t border-gray-200 pt-8">
                <GitHubBinding
                  isConnected={!!user?.githubId}
                  onBind={async (data) => {
                    const response = await fetch('/api/auth/github/bind', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      },
                      body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                  onUnbind={async () => {
                    const response = await fetch('/api/auth/github/unbind', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      }
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                />
              </div>

              <div className="border-t border-gray-200 pt-8">
                <AppleBinding
                  isConnected={!!user?.appleId}
                  onBind={async (data) => {
                    const response = await fetch('/api/auth/apple/bind', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      },
                      body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                  onUnbind={async () => {
                    const response = await fetch('/api/auth/apple/unbind', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      }
                    });
                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                    }
                    return response.ok;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}