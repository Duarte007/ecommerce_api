const config = {
  port: process.env.PORT ? process.env.PORT : 3007,
  secret: process.env.SECRET ? process.env.SECRET : "pucmg",
  database: {
    host: process.env.DB_HOST ? process.env.DB_HOST : "",
    port: process.env.DB_PORT ? process.env.DB_PORT : "",
    user: process.env.DB_USER ? process.env.DB_USER : "",
    password: process.env.DB_PASS ? process.env.DB_PASS : "",
    name: process.env.DB_NAME ? process.env.DB_NAME : "",
  },
};

export const showEnvs = (): void => {
  console.log(
    "------------------------  E n v   A p i -------------------------"
  );
  console.log(`PORT=${process.env.PORT}`);
  console.log(`SECRET=${process.env.SECRET}`);
  console.log(`DB_HOST=${process.env.DB_HOST}`);
  console.log(`DB_PORT=${process.env.DB_PORT}`);
  console.log(`DB_USER=${process.env.DB_USER}`);
  console.log(`DB_PASS=${process.env.DB_PASS}`);
  console.log(`DB_NAME=${process.env.DB_NAME}`);
  console.log(
    "------------------------  E n v   A p i -------------------------\n\n"
  );
};

export default config;
