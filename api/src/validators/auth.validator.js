const Joi = require('joi');

const loginSchema = Joi.object({
  // Disable IANA TLD validation so reserved/demo domains (.test, .local) are
  // accepted — the structure is still validated.
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(1).required(),
});

module.exports = { loginSchema };