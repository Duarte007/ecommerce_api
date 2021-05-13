import { knex, Knex } from "knex";
import { attachPaginate } from "knex-paginate";
import { databaseConfig } from "./knexfile";

const connection: Knex = knex(databaseConfig as Knex.Config);

attachPaginate();

export { Knex, connection };
