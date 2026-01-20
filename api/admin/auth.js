export function requireAdminAuth(req, res) {
  if (!process.env.ADMIN_PASSWORD) {
    res.status(500).json({ error: 'ADMIN_PASSWORD is not configured' });
    return false;
  }

  const { password } = req.body ?? {};

  if (password !== process.env.ADMIN_PASSWORD) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }

  return true;
}
