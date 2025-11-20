const checkNotDemo = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  if (req.user.role === 'DEMO') {
    return res.status(403).json({
      success: false,
      message: 'Demo Account: This action is not allowed. Demo accounts have read-only access.',
      isDemo: true
    });
  }

  next();
};

export default checkNotDemo;
