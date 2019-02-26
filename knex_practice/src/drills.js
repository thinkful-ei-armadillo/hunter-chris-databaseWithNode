'use strict';

require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL});

function retrievingSearchTerm (searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `${searchTerm}`)
    .then(result => {
      console.log(result);
    });
}

retrievingSearchTerm('tofurkey');


function allPaginated(pageNumber){
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(6)
    .offset((pageNumber - 1) * 6)
    .then(result =>{
      console.log(result); 
    });
}

allPaginated(2);
allPaginated(1); 