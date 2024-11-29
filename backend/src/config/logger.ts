import pino from 'pino';
import { randomUUID } from 'crypto';
import { createStream } from 'rotating-file-stream';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 日志目录配置
const logsDir = path.join(__dirname, '../../logs');

// 确保日志目录存在
const ensureLogDir = async (dir: string) => {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    console.error('Failed to create logs directory:', error);
  }
};

// 创建日志目录
await ensureLogDir(logsDir);

// 创建日志流
const accessStream = createStream('access.log', {
  interval: '1d', // 每天轮转
  path: logsDir,
  compress: 'gzip' // 压缩旧日志
});

const errorStream = createStream('error.log', {
  interval: '1d',
  path: logsDir,
  compress: 'gzip'
});

const appStream = createStream('app.log', {
  interval: '1d',
  path: logsDir,
  compress: 'gzip'
});

// 日志级别配置
const levels = {
  development: 'debug',
  test: 'debug',
  production: 'info'
};

// 创建日志实例
export const logger = pino({
  level: levels[process.env.NODE_ENV as keyof typeof levels] || 'info',
  transport: {
    targets: [
      // 控制台输出
      {
        target: 'pino-pretty',
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          messageFormat: '{msg} {context}'
        }
      },
      // 错误日志
      {
        target: 'pino/file',
        level: 'error',
        options: { destination: errorStream }
      },
      // 应用日志
      {
        target: 'pino/file',
        level: 'info',
        options: { destination: appStream }
      },
      // 访问日志
      {
        target: 'pino/file',
        level: 'info',
        options: { destination: accessStream }
      }
    ]
  },
  // 添加默认字段
  base: {
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version
  },
  // 添加请求ID
  mixin() {
    return {
      requestId: randomUUID()
    };
  },
  // 敏感信息脱敏
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'body.password',
      'body.token',
      '*.password',
      '*.token'
    ],
    remove: true
  },
  // 时间戳
  timestamp: pino.stdTimeFunctions.isoTime,
  // 错误序列化
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res
  }
});

// 创建子日志记录器
export const createLogger = (name: string) => logger.child({ name });

// 请求日志中间件
export const requestLogger = (req: any, res: any, next: any) => {
  const startTime = Date.now();
  const requestId = randomUUID();

  // 添加请求ID到响应头
  res.setHeader('X-Request-ID', requestId);

  // 请求完成时记录日志
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info({
      type: 'request',
      requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });
  });

  next();
};

// 错误日志中间件
export const errorLogger = (err: any, req: any, res: any, next: any) => {
  logger.error({
    type: 'error',
    requestId: res.getHeader('X-Request-ID'),
    error: err,
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
    stack: err.stack
  });

  next(err);
};