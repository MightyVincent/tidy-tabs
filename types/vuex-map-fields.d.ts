declare module 'vuex-map-fields' {
  import { Accessors } from 'vue/types/options'
  import { Computed } from 'vuex'

  export function getField(state: any): any;

  export function updateField(state: any, { path, value }: { path: string, value: any }): void;

  export function mapFields(map: string[] | object, getterType?: string, mutationType?: string): Accessors<Computed>;
  export function mapFields(namespace: string, map: string[] | object, getterType?: string, mutationType?: string): Accessors<Computed>;

  export function mapMultiRowFields(map: string[] | object, getterType?: string, mutationType?: string): Accessors<Computed>;
  export function mapMultiRowFields(namespace: string, map: string[] | object, getterType?: string, mutationType?: string): Accessors<Computed>;
}
