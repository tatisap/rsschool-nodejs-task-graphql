import * as DataLoader from 'dataloader';

export const dataLoad = <T>(dataloaders: WeakMap<Readonly<T[]>, DataLoader<any, any>>, key: Readonly<T[]>, cb: any, value: any) => {
  let dl = dataloaders.get(key);
  if (!dl) {
    dl = new DataLoader(cb);
    dataloaders.set(key, dl);
  }
  return dl.load(value);
}