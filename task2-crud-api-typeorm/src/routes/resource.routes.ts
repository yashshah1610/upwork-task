import { Router } from 'express';
import {
  createResource,
  listResources,
  getResource,
  updateResource,
  deleteResource,
} from '../controller/ResourceController';
import { validate } from '../middlewares/validate';
import { createResourceSchema, updateResourceSchema } from '../validation/resource.validation';

const router = Router();

router.post('/', validate(createResourceSchema), createResource);
router.get('/', listResources);
router.get('/:id', getResource);
router.put('/:id', validate(updateResourceSchema), updateResource);
router.delete('/:id', deleteResource);

export default router;
