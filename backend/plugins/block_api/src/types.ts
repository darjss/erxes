import { Request, Response } from 'express';

export interface IBlock {
  subdomain: string;
  entityId: string;
}

export interface IRequest<T, E = {}> extends Request {
  subdomain?: string;
  body: {
    payload: {
      entityId: string;
      data: T & E;
    };
  };
}

export interface IResponse extends Response {}
