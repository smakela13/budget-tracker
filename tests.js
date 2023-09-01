const chai = require('chai');
const expect = chai.expect;
const Transaction = require('./models/transaction.js');

describe('Transaction Model Name', function() {
    it('should be invalid if name is empty', async function() {
        let transaction = new Transaction();
        try {
            await transaction.validate();
            throw new Error('Expected an error to be thrown but it was not');
        } catch (err) {
            expect(err.errors.name).to.exist;
        }
    });

    it('should be invalid if name exceeds 100 characters', async function () {
        let longName = 'a'.repeat(101);
        let transaction = new Transaction({ name: longName, value: 30 });
        try {
            await transaction.validate();
            throw new Error('Expected an error to be thrown but it was not');
        } catch (err) {
            expect(err.errors.name).to.exist;
        }
    });

    it('should be invalid if name is a number', async function () {
        let transaction = new Transaction({ name: 0, value: 500 });
        try {
            await transaction.validate();
            throw new Error('Expected an error to be thrown but it was not');
        } catch (err) {
            expect(err.errors.name.message).to.be.a('string');
        }
    });
    
    it('should have 100 characters', async function () {
        let longName = 'a'.repeat(100);
        let transaction = new Transaction({ name: longName, value: 30 });
        await transaction.validate(); // This should not throw any errors
    });

    it('should be valid with a correct name and value', async function() {
        let transaction = new Transaction({ name: 'Test', value: 50 });
        await transaction.validate(); // This should not throw any errors
    });

});

describe('Transaction Model Value', function() {
    it('should be invalid if value is zero', async function () {
        let transaction = new Transaction({name: 'Test', value: 0});
        try {
            await transaction.validate();
                throw new Error('Expected an error to be thrown but it was not');
            } catch (err) {
                expect(err.errors.value).to.exist;
            }
    });

    it('should be invalid if value is empty', async function () {
        let transaction = new Transaction();
        try {
            await transaction.validate();
            throw new Error('Expected an error to be thrown but it was not');
        } catch (err) {
            expect(err.errors.value).to.exist;
        }
    });

    it('should be invalid if value is a string', async function () { 
        let transaction = new Transaction({ name: 'Test', value: 'Test' });
        try {
            await transaction.validate();
            throw new Error('Expected an error to be thrown but it was not');
        } catch (err) {
            expect(err.errors.value).to.exist;
        }
    });
})
