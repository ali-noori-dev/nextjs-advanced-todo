export type LoginState = {
  errors: Record<string, string>;
  values: {
    email: string;
    password: string;
  };
};

export type SignupState = {
  errors: Record<string, string>;
  success?: boolean;
  values: {
    name: string;
    email: string;
    password: string;
  };
};
