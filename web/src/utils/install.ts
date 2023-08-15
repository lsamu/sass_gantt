import type { EmitsOptions, MethodOptions, ObjectEmitsOptions } from 'vue';

export const withInstall = <
  T = Record<string, unknown>,
  M extends MethodOptions = MethodOptions,
  E extends EmitsOptions = string[] | ObjectEmitsOptions
>(
  name: string,
  comp: any
) => {
  (comp as any).install = app => {
    app.component(name, comp);
  };

  return comp as any;
};
