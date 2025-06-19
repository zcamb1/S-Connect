import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
  showChangePasswordModal?: boolean;
  onOpenChangePassword?: () => void;
  onCloseChangePassword?: () => void;
}

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  email: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Login: React.FC<LoginProps> = ({ 
  onLogin, 
  showChangePasswordModal = false, 
  onOpenChangePassword, 
  onCloseChangePassword 
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  
  // Register form state
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  
  // Forgot password state
  const [forgotData, setForgotData] = useState<ForgotPasswordData>({
    email: ''
  });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  
  // Change password state
  const [changePasswordData, setChangePasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(token, user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Register handlers
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Mật khẩu không khớp');
      return;
    }
    
    setRegisterLoading(true);
    setRegisterError('');
    
    try {
      await axios.post('/api/register', {
        username: registerData.username,
        password: registerData.password,
        full_name: registerData.fullName,
        email: registerData.email
      });
      
      setShowRegisterModal(false);
      setRegisterData({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: ''
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (err: any) {
      setRegisterError(err.response?.data?.error || 'Đăng ký thất bại');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  // Forgot password handlers
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');
    
    try {
      await axios.post('/api/forgot-password', forgotData);
      setForgotSuccess('Email khôi phục mật khẩu đã được gửi!');
      setForgotData({ email: '' });
    } catch (err: any) {
      setForgotError(err.response?.data?.error || 'Có lỗi xảy ra');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotData({
      ...forgotData,
      [e.target.name]: e.target.value
    });
  };

  // Change password handlers
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setChangePasswordError('Mật khẩu mới không khớp');
      return;
    }
    
    setChangePasswordLoading(true);
    setChangePasswordError('');
    setChangePasswordSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/change-password', {
        currentPassword: changePasswordData.currentPassword,
        newPassword: changePasswordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChangePasswordSuccess('Đổi mật khẩu thành công!');
      setChangePasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setChangePasswordError(err.response?.data?.error || 'Đổi mật khẩu thất bại');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleChangePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangePasswordData({
      ...changePasswordData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-md w-full space-y-8 px-8">
          {/* Logo with modern design */}
          <div className="text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">S-Connect</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Form */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Đăng nhập tài khoản
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Để tiếp tục, hãy đăng nhập vào tài khoản của bạn
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pr-12"
                    placeholder="••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Quên mật khẩu?
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChangePassword?.()}
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Đổi mật khẩu
                </button>
              </div>

              <div className="text-sm text-gray-600 mb-6">
                Bằng cách nhấp vào Đăng nhập, bạn đồng ý với các Điều khoản và Điều kiện của chúng tôi, xác nhận bạn đã đọc Chính sách Bảo mật của chúng tôi.
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300/50 ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Đăng nhập
                    </>
                  )}
                </span>
                {!loading && (
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                )}
                            </button>
            </form>

            {/* Register link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
 
          </div>
        </div>
      </div>

      {/* Right side - Dreamy Mountain Background */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        {/* Beautiful mountain image with dreamy colors */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('./platform-showcasing-products-with-dreamy-aesthetic-colors.jpg')`
          }}
        >
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Đăng ký tài khoản</h2>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {registerError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {registerError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Nhập họ và tên"
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="input-field"
                    placeholder="Nhập email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đăng nhập *
                  </label>
                  <input
                    name="username"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Nhập tên đăng nhập"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu *
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="input-field"
                    placeholder="Nhập mật khẩu"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="input-field"
                    placeholder="Nhập lại mật khẩu"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={registerLoading}
                  className={`w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    registerLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-700 hover:to-blue-700'
                  }`}
                >
                  {registerLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h2>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Nhập email của bạn và chúng tôi sẽ gửi link khôi phục mật khẩu.
              </p>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {forgotError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {forgotError}
                  </div>
                )}

                {forgotSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                    {forgotSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="input-field"
                    placeholder="Nhập email của bạn"
                    value={forgotData.email}
                    onChange={handleForgotChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    forgotLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  {forgotLoading ? 'Đang gửi...' : 'Gửi email khôi phục'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>
                <button
                  onClick={() => onCloseChangePassword?.()}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                {changePasswordError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {changePasswordError}
                  </div>
                )}

                {changePasswordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                    {changePasswordSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại *
                  </label>
                  <input
                    name="currentPassword"
                    type="password"
                    required
                    className="input-field"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={changePasswordData.currentPassword}
                    onChange={handleChangePasswordChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới *
                  </label>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    className="input-field"
                    placeholder="Nhập mật khẩu mới"
                    value={changePasswordData.newPassword}
                    onChange={handleChangePasswordChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới *
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="input-field"
                    placeholder="Nhập lại mật khẩu mới"
                    value={changePasswordData.confirmPassword}
                    onChange={handleChangePasswordChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={changePasswordLoading}
                  className={`w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    changePasswordLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-orange-700 hover:to-red-700'
                  }`}
                >
                  {changePasswordLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 