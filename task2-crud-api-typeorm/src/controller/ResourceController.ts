import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Resource } from '../entity/Resource';
import { FindOptionsWhere, ILike } from 'typeorm';

const resourceRepo = AppDataSource.getRepository(Resource);

export const createResource = async (req: Request, res: Response) => {
  const resource = resourceRepo.create(req.body);
  const result = await resourceRepo.save(resource);
  res.status(201).json(result);
};

export const listResources = async (req: Request, res: Response) => {
  const where: FindOptionsWhere<Resource> = {};

  if (req.query.name) {
    where.name = ILike(`%${String(req.query.name)}%`);
  }
  if (req.query.type) {
    where.type = String(req.query.type) as 'video' | 'audio' | 'document';
  }
  
  const resources = await resourceRepo.find({ where });
  res.json(resources);
};

export const getResource = async (req: Request, res: Response) => {
  const resource = await resourceRepo.findOneBy({ id: Number(req.params.id) });
  if (!resource) return res.status(404).json({ error: 'Not found' });
  res.json(resource);
};

export const updateResource = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await resourceRepo.update(id, req.body);
  const updated = await resourceRepo.findOneBy({ id });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
};

export const deleteResource = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await resourceRepo.delete(id);
  if (result.affected === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
};
