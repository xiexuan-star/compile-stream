// GlobalComponents for Volar
declare module 'vue' {
  export interface GlobalComponents {
    // @ts-ignore
    ButtonPrint: typeof import('cnhis-design-vue')['ButtonPrint'];
  }
}

export {};
