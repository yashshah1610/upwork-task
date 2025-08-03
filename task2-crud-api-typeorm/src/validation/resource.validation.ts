import Joi from 'joi';

export const createResourceSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  type: Joi.string().valid('video', 'audio', 'document').required(),
  url: Joi.string().uri().required(),
});

export const updateResourceSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  type: Joi.string().valid('video', 'audio', 'document'),
  url: Joi.string().uri(),
});
