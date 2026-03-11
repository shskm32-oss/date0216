/**
 * Middleware to extract the caller role from the request.
 * In production, this would validate a JWT or API key.
 * For this implementation, the role is passed via the X-Role header.
 */
function extractRole(req, res, next) {
  req.role = req.headers['x-role'] || 'anonymous';
  next();
}

/**
 * Middleware to prevent DELETE operations for the 'claude' role.
 */
function preventClaudeDeletion(req, res, next) {
  if (req.method === 'DELETE' && req.role === 'claude') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'The claude role is not permitted to perform delete operations.',
    });
  }
  next();
}

module.exports = { extractRole, preventClaudeDeletion };
