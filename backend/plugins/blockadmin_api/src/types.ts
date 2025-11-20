import { Request, Response } from 'express';

export interface IBlock {
  subdomain: string;
  entityId: string;
}

export interface IRequest<T, E = {}> extends Request {
  subdomain?: string;
  body: {
    subdomain: string;
    payload: {
      entityId: string;
      data: {
        input: T;
      } & E;
    };
  };
}

export interface IResponse extends Response {}
