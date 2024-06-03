// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      displayName: string;
    }

    interface Request {
      user?: User;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Request as ExpressRequest } from 'express';

// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: {
//       id: string;
//       displayName: string;
//     };
//   }
// }