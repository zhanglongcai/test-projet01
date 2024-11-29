import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, '密码长度至少为8位')
  .regex(/[A-Z]/, '密码必须包含大写字母')
  .regex(/[a-z]/, '密码必须包含小写字母')
  .regex(/[0-9]/, '密码必须包含数字')
  .regex(/[^A-Za-z0-9]/, '密码必须包含特殊字符');

export function getPasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  const checks = [
    { regex: /.{8,}/, points: 1, message: '长度至少为8位' },
    { regex: /[A-Z]/, points: 1, message: '包含大写字母' },
    { regex: /[a-z]/, points: 1, message: '包含小写字母' },
    { regex: /[0-9]/, points: 1, message: '包含数字' },
    { regex: /[^A-Za-z0-9]/, points: 1, message: '包含特殊字符' }
  ];

  const failedChecks = checks.filter(check => !check.regex.test(password));
  const passedChecks = checks.filter(check => check.regex.test(password));
  
  score = passedChecks.reduce((acc, check) => acc + check.points, 0);

  let feedback = '';
  if (failedChecks.length > 0) {
    feedback = `密码需要${failedChecks.map(check => check.message).join('、')}`;
  } else {
    feedback = '密码强度良好';
  }

  return { score, feedback };
}