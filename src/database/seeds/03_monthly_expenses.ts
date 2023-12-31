import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('monthly_expenses').del();

  // Inserts seed entries
  await knex('monthly_expenses').insert([
    {
      id: 1,
      name: 'Czynsz Ossowskiego 24a/11 - Polska',
      amount: 807.52,
      amount_chf: 180.0,
      currency: 'PLN',
      splitted: false,
    },
    {
      id: 2,
      name: 'Czynsz Gutschstrasse 5 - Szwajcaria',
      amount: 1800.0,
      amount_chf: 1800.0,
      currency: 'CHF',
      splitted: true,
      my_part: 900.0,
    },
    {
      id: 3,
      name: 'Czynsz parking - Gutschstrasse 5 - Szwajcaria',
      amount: 200.0,
      amount_chf: 200.0,
      currency: 'CHF',
      splitted: true,
      my_part: 100.0,
    },
    {
      id: 4,
      name: 'Linear',
      amount: 10.0,
      amount_chf: 10.0,
      currency: 'USD',
      splitted: false,
    },
    {
      id: 5,
      name: 'Swica',
      amount: 837.8,
      amount_chf: 837.8,
      currency: 'CHF',
      splitted: true,
      my_part: 368.7,
    },
    {
      id: 6,
      name: 'Sunrise',
      amount: 49.95,
      amount_chf: 49.95,
      currency: 'CHF',
      splitted: false,
    },
    {
      id: 7,
      name: 'Yallo',
      amount: 159.0,
      amount_chf: 159.0,
      currency: 'CHF',
      splitted: false,
    },
    {
      id: 8,
      name: 'UPC - Polska',
      amount: 89.0,
      amount_chf: 20,
      currency: 'CHF',
      splitted: false,
    },
    {
      id: 9,
      name: 'Vercel - private',
      amount: 20,
      amount_chf: 18,
      currency: 'USD',
      splitted: false,
    },
    {
      id: 10,
      name: 'Notion - private',
      amount: 10,
      amount_chf: 10,
      currency: 'USD',
      splitted: false,
    },
    {
      id: 11,
      name: 'Frontend masters',
      amount: 39,
      amount_chf: 39,
      currency: 'USD',
      splitted: false,
    },
    {
      id: 12,
      name: 'ngrok',
      amount: 10,
      amount_chf: 10,
      currency: 'USD',
      splitted: false,
    },
    {
      id: 13,
      name: 'Oszczednosci na wspolne konto',
      amount: 2000,
      amount_chf: 2000,
      currency: 'CHF',
      splitted: true,
      my_part: 1000,
    },
  ]);
}
