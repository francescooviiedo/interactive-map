import { resetEventsTable } from '../lib/eventsAdmin';

function run() {
  resetEventsTable();
  console.log('Tabela events limpa e sequência de autoincremento resetada.');
}

run();
