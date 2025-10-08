import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config/config';
import connectDB from './config/database';

// Memory optimization for production
if (process.env.NODE_ENV === 'production') {
  // Force garbage collection more frequently
  if (typeof global.gc === 'function') {
    setInterval(() => {
      global.gc!();
    }, 30000); // Run GC every 30 seconds
  }
}

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import projectRoutes from './routes/projects';
import diaryRoutes from './routes/diary';
import notificationRoutes from './routes/notifications';
import institutionRoutes from './routes/institutions';
import problemStatementRoutes from './routes/problemStatements';
import mentorAnalyticsRoutes from './routes/mentorAnalytics';
import mentorMatchingRoutes from './routes/mentorMatching';
import resourceLibraryRoutes from './routes/resourceLibrary';
import mentorNetworkingRoutes from './routes/mentorNetworking';
import schedulingRoutes from './routes/scheduling';
import hackathonRoutes from './routes/hackathons';
import hackathonRegistrationRoutes from './routes/hackathonRegistration';
import hackathonSubmissionRoutes from './routes/hackathonSubmission';

const app = express();

// Connect to database and wait for connection
const startServer = async () => {
  try {
    await connectDB();
    
    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    const corsOptions = {
      origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Split the CORS_ORIGIN env variable by comma to get array of allowed origins
        const allowedOrigins = config.CORS_ORIGIN.split(',').map(o => o.trim());
        
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: config.CORS_CREDENTIALS,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };

    app.use(cors(corsOptions));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      max: config.RATE_LIMIT_MAX_REQUESTS,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    app.use(limiter);

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    app.use(compression());

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // Request logging middleware
    app.use((req, res, next) => {
      if (config.VERBOSE_LOGGING) {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
      }
      next();
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
      });
    });

    // API routes
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/auth`, authRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/users`, userRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/projects`, projectRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/diary`, diaryRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/notifications`, notificationRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/institutions`, institutionRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/problem-statements`, problemStatementRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/mentor-analytics`, mentorAnalyticsRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/mentor-matching`, mentorMatchingRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/resources`, resourceLibraryRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/mentor-networking`, mentorNetworkingRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/scheduling`, schedulingRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/hackathons`, hackathonRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/hackathon-registrations`, hackathonRegistrationRoutes);
    app.use(`${config.API_PREFIX}/${config.API_VERSION}/hackathon-submissions`, hackathonSubmissionRoutes);

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });

    // Global error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Global error handler:', err);

      // Mongoose validation error
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((error: any) => error.message);
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors
        });
      }

      // Mongoose duplicate key error
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
          success: false,
          message: `${field} already exists`
        });
      }

      // JWT errors
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }

      // Default error
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error'
      });
    });

    // Start server
    const PORT = config.PORT;
    const HOST = config.HOST;

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`📊 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://${HOST}:${PORT}${config.API_PREFIX}/${config.API_VERSION}`);
      console.log(`🌐 CORS Origin: ${config.CORS_ORIGIN}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;