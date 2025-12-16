import { Request, Response } from 'express';

export interface IBlock {
  subdomain: string;
  entityId: string;
}

export interface IImageFields {
  logo?: string;
  coverImage?: string;
  images?: string;
}

export interface IRequest<T, E = {}> extends Request {
  subdomain?: string;
  body: {
    subdomain: string;
    payload: {
      entities?: Record<string, T>;
      entityId: string;
      data: {
        input: T;
      } & E;
    };
  };
}

export interface IResponse extends Response {}
