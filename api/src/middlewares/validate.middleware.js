const validate = (schema) => {
  return (req, res, next) => {
    // Check the incoming request body against your Joi schema
    const { error } = schema.validate(req.body);
    
    if (error) {
      // If validation fails, return a 400 Bad Request with the error message
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }
    
    // If validation passes, move on to the controller (e.g., login)
    next();
  };
};

module.exports = { validate };