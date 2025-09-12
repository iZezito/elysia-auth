export class CustomizedError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
  }

  // toResponse() {
  //   return Response.json(
  //     {
  //       message: this.message,
  //       code: this.status,
  //       timestamp: new Date().toLocaleString(),
  //     },
  //     {
  //       status: this.status,
  //       // headers: {
  //       //   "Content-Type": "application/json",
  //       //   "Access-Control-Allow-Origin": process.env.CLIENT_URL!,
  //       //   "Access-Control-Allow-Credentials": "true",
  //       // },
  //     }
  //   );
  // }
}

export class UnauthorizedError extends CustomizedError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomizedError {
  constructor(message: string) {
    super(message, 403);
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
