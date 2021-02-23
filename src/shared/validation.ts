import * as express from 'express';
import { NextFunction } from 'express';
import { deserialize } from 'json-typescript-mapper';
import { Validator } from "class-validator";
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

type Constructor<T> = {new(): T};

// Middleware which validates that the request's JSON body conforms to the passed-in type.
export function validateObject<T extends Object>(type: Constructor<T>): express.RequestHandler {
  const validator = new Validator();
  return (req, res, next) => {
    const input = deserialize(type, req.body);

    const errors = validator.validateSync(input);
    if (errors.length > 0) {
        next(errors);
    } else {
      req.body = input;
      next();
    }
  }
}

// Middleware to handle the case where the request failed validation
export function validationError(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Array && err[0] instanceof ValidationError) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({errors: err});
  } else {
    next(err);
  }
}