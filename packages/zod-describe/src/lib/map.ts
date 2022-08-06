import { Observable } from './ob';
import { z } from 'zod';
import './zod-describe';

declare module './ob' {
  interface Observable<T> {
    map<U>(f: (x: T) => U): void;
  }
}
Observable.prototype.map = () => {
  // ... another exercise for the reader
};

z.string().a;
