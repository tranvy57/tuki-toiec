import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RegisterRequest } from '@/types';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterRequest>();
  const password = watch('password');

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Register data:', data);
      
      // Redirect to login after successful registration
      navigate('/auth/login');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
        <CardDescription className="text-center">
          Tạo tài khoản mới để truy cập hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nguyễn Văn A"
              {...register('name', {
                required: 'Họ và tên là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Họ và tên phải có ít nhất 2 ký tự'
                }
              })}
            />
            {errors.name && (
              <p className="text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              {...register('email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Email không hợp lệ'
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-error">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Mật khẩu là bắt buộc',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự'
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-error">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Xác nhận mật khẩu là bắt buộc',
                validate: value => value === password || 'Mật khẩu không khớp'
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-warm-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/auth/login" className="text-brand-coral-600 hover:text-brand-coral-700 font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
