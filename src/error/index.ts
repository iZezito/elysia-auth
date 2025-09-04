export class CustomizedError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
  }

  toResponse() {
    return Response.json(
      {
        error: this.message,
        code: this.status,
        timestamp: new Date().toLocaleString(),
      },
      {
        status: this.status,
      }
    );
  }
}

export class BadCredentialsError extends CustomizedError {
  constructor(message?: string) {
    super(
      message ||
        "Invalid credentials. Please check your email and password and try again.",
      401
    );
  }
}

export class NotFoundError extends CustomizedError {
  constructor(message: string) {
    super(message, 404);
  }
}
