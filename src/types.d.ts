declare module "*.css";

declare global {
  var mongoose: {
    conn: any;
    promise: Promise<any> | null;
  };
}

export {};