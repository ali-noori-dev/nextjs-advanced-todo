export type LoginState = {
  errors: Record<string, string>;
  values: {
    email: string;
    password: string;
  };
};
