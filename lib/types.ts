export interface InstanceType<T> {
  new (...args: any[]): T
}
