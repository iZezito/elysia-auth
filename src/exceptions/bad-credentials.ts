export class BadCredentials extends Error {
  constructor() {
    super(
      "Credenciais inválidas. Por favor, verifique seu e-mail e senha e tente novamente."
    );
  }
}
