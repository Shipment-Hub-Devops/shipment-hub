const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(1).required(),
});


const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Please provide your name',
    'string.empty': 'Name cannot be empty'
  }),
  email: Joi.string()
    .email({ tlds: { allow: ['com', 'org', 'net', 'edu'] } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email ending in .com, .org, .net, or .edu'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long'
    }),
});

module.exports = { loginSchema, registerSchema };