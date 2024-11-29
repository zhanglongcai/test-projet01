import { z } from 'zod';

export const loginSchema = {
  email: z.object({
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(8, '密码至少8个字符')
  }),
  phone: z.object({
    phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
    code: z.string().length(6, '验证码必须是6位数字')
  })
};

export const registerSchema = {
  email: z.object({
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string()
      .min(8, '密码至少8个字符')
      .regex(/[A-Z]/, '密码必须包含大写字母')
      .regex(/[a-z]/, '密码必须包含小写字母')
      .regex(/[0-9]/, '密码必须包含数字')
      .regex(/[^A-Za-z0-9]/, '密码必须包含特殊字符'),
    name: z.string().min(2, '用户名至少2个字符')
  }),
  phone: z.object({
    phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
    code: z.string().length(6, '验证码必须是6位数字'),
    name: z.string().min(2, '用户名至少2个字符')
  })
};

export const resetPasswordSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  code: z.string().length(6, '验证码必须是6位数字'),
  newPassword: z.string()
    .min(8, '密码至少8个字符')
    .regex(/[A-Z]/, '密码必须包含大写字母')
    .regex(/[a-z]/, '密码必须包含小写字母')
    .regex(/[0-9]/, '密码必须包含数字')
    .regex(/[^A-Za-z0-9]/, '密码必须包含特殊字符')
});