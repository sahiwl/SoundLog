export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request";
    return res.status(400).json({ message });
  }

  next();
};
