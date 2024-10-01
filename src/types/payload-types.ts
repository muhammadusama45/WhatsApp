export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  surname: string;
  email: string;
  confirmEmail: string;
  password: string;
  gender: string;
};

export type forgetPayload = {
  email: string;
};
