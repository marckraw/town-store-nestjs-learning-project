import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('monthly_expenses', (table) => {
    table.increments('id').primary();

    table.string('name').notNullable();
    table.string('description');
    table.decimal('amount').notNullable().defaultTo(0);
    table.decimal('amount_chf').notNullable().defaultTo(0);
    table.string('currency').notNullable().defaultTo('CHF');
    table.boolean('splitted').notNullable().defaultTo(false);
    table.decimal('my_part');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('monthly_expenses');
}
