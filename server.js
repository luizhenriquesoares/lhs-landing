const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

console.log('Starting LHS Global Digital server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);
console.log('Host:', HOST);

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check endpoint (must be before static files)
app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'LHS Global Digital'
    });
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'running',
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true
}));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 LHS Global Digital server running on ${HOST}:${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Access: http://${HOST}:${PORT}`);
    console.log(`✅ Health check available at: http://${HOST}:${PORT}/health`);
    console.log(`✅ Server is ready to accept connections`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
});

// Keep-alive mechanism
setInterval(() => {
    console.log(`Server alive - Uptime: ${process.uptime().toFixed(2)}s`);
}, 30000); // Log every 30 seconds

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
