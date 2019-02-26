'use strict';

const shopping_listservice = require('../src/shopping-list-service');
const knex = require('knex');
require('dotenv').config();

describe('ShoppingList service object', function() {
    let db;
    let testshopping_list = [
        {
            id: 1,
            name:'Fish tricks', 
            price: '13.10', 
            category: 'Main',
            checked: false,  
            date_added: new Date('2020-01-01T00:00:00.000Z')
        },
        {
            id: 2,
            name:'Not Dogs', 
            price: '4.99', 
            category: 'Snack',
            checked: true,  
            date_added: new Date('2020-01-01T00:00:00.000Z')
        },
        {
            id: 3,
            name:'Bluffalo Wings', 
            price: '5.50', 
            category: 'Snack',
            checked: false,  
            date_added: new Date('2020-01-01T00:00:00.000Z')
        }
    ];
  
  
    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.DB_URL,
      });
    });
  
    before(() => db('shopping_list').truncate());
  
    afterEach(() => db('shopping_list').truncate()); 
    
    after(() => db.destroy());
    
    context('Given \'shopping_list\' has data', () => {
      beforeEach(() => {
        return db
          .into('shopping_list')
          .insert(testshopping_list);
      });
  
      it('updateItem() updates an ShoppingList from the \'shopping_list\' table', () => {
        const idOfShoppingListToUpdate = 3;
        const newShoppingListData = {
            name:'Test new name', 
            price: '5.99', 
            category: 'Main',
            checked: false,  
            date_added: new Date('2020-01-01T00:00:00.000Z')
        };
        return shopping_listservice.updateItem(db, idOfShoppingListToUpdate, newShoppingListData)
          .then(() => shopping_listservice.getById(db, idOfShoppingListToUpdate))
          .then(ShoppingList => {
            expect(ShoppingList).to.eql({
              id: idOfShoppingListToUpdate,
            ...newShoppingListData,
            });
          });
      });
  
      it('deleteShoppingList() removes an ShoppingList by id from \'shopping_list\' table', () => {
        const ShoppingListId = 4;
        return shopping_listservice.deleteItem(db, ShoppingListId)
          .then(() => shopping_listservice.getItems(db))
          .then(allshopping_list => {
            // copy the test shopping_list array without the "deleted" ShoppingList
            const expected = testshopping_list.filter(ShoppingList => ShoppingList.id !== ShoppingListId);
            expect(allshopping_list).to.eql(expected);
          });
      });
      
      it('getById() resolves an ShoppingList by id from \'shopping_list\' table', () => {
        const thirdId = 3;
        const thirdTestShoppingList = testshopping_list[thirdId - 1];
        return shopping_listservice.getById(db, thirdId)
          .then(actual => {
            expect(actual).to.eql({
                id: thirdTestShoppingList.id,
                name: thirdTestShoppingList.name, 
                price: thirdTestShoppingList.price, 
                category: thirdTestShoppingList.category,
                checked: thirdTestShoppingList.checked,  
                date_added: thirdTestShoppingList.date_added
            });
          });
      });
  
      it('getItems() resolves all shopping_list from \'shopping_list\' table', () => {
        return shopping_listservice.getItems(db)
          .then(actual => {
            expect(actual).to.eql(testshopping_list);
          });
      });
    });
  
    context('Given \'shopping_list\' has no data', () => {
      it('getItems() resolves an empty array', () => {
        return shopping_listservice.getItems(db)
          .then(actual => {
            expect(actual).to.eql([]);
          });
      });
      it('insertShoppingList() inserts a new ShoppingList and resolves the new ShoppingList with an \'id\'', () => {
        const newShoppingList = {
          name:'Test new name', 
          price: '5.99', 
          category: 'Main',
          checked: false,  
          date_added: new Date('2020-01-01T00:00:00.000Z')
        };
        return shopping_listservice.insertItem(db, newShoppingList)
          .then(actual => {
            expect(actual).to.eql({
              id: 1,
              name: newShoppingList.name, 
              price: newShoppingList.price, 
              category: newShoppingList.category,
              checked: newShoppingList.checked,  
              date_added: newShoppingList.date_added
            });
          });
      });
  
    }); 
  });