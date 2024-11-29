import { Layout } from '../../components/Layout';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { useUserStore } from '../../stores/userStore';

export function Profile() {
  const user = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">个人资料</h3>
              <p className="mt-1 text-sm text-gray-600">
                查看和管理您的账号信息
              </p>
            </div>
          </div>

          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="mb-6">
                  <h4 className="text-base font-medium text-gray-900">用户名</h4>
                  <p className="mt-1 text-sm text-gray-600">{user?.name}</p>
                </div>

                <ProfileForm
                  initialData={{
                    email: user?.email || '',
                    phone: user?.phone || ''
                  }}
                  onSubmit={async (data) => {
                    const response = await fetch('/api/user/profile', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${useUserStore.getState().token}`
                      },
                      body: JSON.stringify(data)
                    });

                    const result = await response.json();
                    if (response.ok) {
                      updateUser(result.data);
                      return true;
                    }
                    return false;
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