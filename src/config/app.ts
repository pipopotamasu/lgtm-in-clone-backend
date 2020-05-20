import { ENVIRONMENT as env } from "@util/secrets";

const appConfig = {
  test: {
    frontend: {
      protcol: "http",
      host: "exmaple.com",
      port: 80,
    },
    backend: {
      protcol: "http",
      host: "api.exmaple.com",
      port: 80,
    }
  },
  development: {
    frontend: {
      protcol: "http",
      host: "localhost",
      port: 3000,
    },
    backend: {
      protcol: "http",
      host: "localhost",
      port: 8000,
    }
  },
  production: {
    frontend: {
      protcol: "https",
      host: "",
      port: 443,
    },
    backend: {
      protcol: "https",
      host: "",
      port: 443,
    }
  }
};

export const config = appConfig[env];

export function frontendOrigin () {
  const { protcol, host, port } = config.frontend;
  return `${protcol}://${host}:${port}`;
}

export function backendOrigin () {
  const { protcol, host, port } = config.backend;
  return `${protcol}://${host}:${port}`;
}
