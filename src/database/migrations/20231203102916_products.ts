import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();

    table.string('name').notNullable();
    table.string('stock').defaultTo(0);
    table.string('price').defaultTo(0);
    table.string('img_url').defaultTo('https://via.placeholder.com/150');
    table.string('description');

    table.integer('category_id').unsigned().notNullable();
    table
      .foreign('category_id')
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products');
}
