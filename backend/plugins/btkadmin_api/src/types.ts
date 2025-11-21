import { Request, Response } from 'express';

export interface IBtk {
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
      entityId: string;
      data: {
        input: T;
      } & E;
    };
  };
}

export type IResponse = Response;
