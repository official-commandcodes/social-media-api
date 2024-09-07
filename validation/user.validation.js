const Joi = require("joi");

function validationRegisterUser(data) {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(255).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).required(),
  });

  return schema.validate(data);
}

function validationLoginUser(data) {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  });

  return schema.validate(data);
}

module.exports = { validationRegisterUser, validationLoginUser };
