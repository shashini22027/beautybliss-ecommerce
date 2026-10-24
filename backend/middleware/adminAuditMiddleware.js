import AdminAuditLog from '../models/AdminAuditLog.js';

const adminAuditMiddleware = (req, res, next) => {
  const isWriteRequest = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  if (isWriteRequest) {
    res.once('finish', () => {
      if (!req.user?.isAdmin || res.statusCode >= 500) return;
      const resource = `${req.baseUrl || ''}${req.path || req.originalUrl}`.slice(0, 240);
      AdminAuditLog.create({
        actor: req.user._id,
        actorEmail: req.user.email,
        action: req.method,
        resource,
        statusCode: res.statusCode,
      }).catch((error) => console.error('Admin audit log write failed:', error.message));
    });
  }
  next();
};

export default adminAuditMiddleware;
