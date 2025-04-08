type BaseAuthState = {
  errors: Record<string, string>;
  success?: boolean;
  values: {
    email: string;
    password: string;
  };
};

export type LoginState = BaseAuthState;

export type SignupState = BaseAuthState & {
  values: BaseAuthState["values"] & {
    name: string;
  };
};
