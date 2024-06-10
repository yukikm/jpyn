declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        PRIVATE_KEY: string;
        // ...
      }
    }
  }
}
