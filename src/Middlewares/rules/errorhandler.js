export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);
  // return res.status(500).json({ status: false, error: err.stack });
  return res.status(500).json({
    status: false,
    error: "Failed to load data. Please try again later.",
  });
};

export const handleServerError = (err, req, res, next) => {
  console.error("Error:", err.stack);
  return res.render("pages/500", { layout: false });
};
