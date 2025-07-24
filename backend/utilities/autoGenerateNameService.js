const { faker } = require('@faker-js/faker');


const randomFullName = async function (){
  try {
    
    return await faker.person.fullName();
    
  } catch (err) {
    console.error(err);
    return '';
  }
}

const randomPerson = async function (){
  try {
    
    return await faker.person;
    
  } catch (err) {
    console.error(err);
    return null;
  }
}

const randomLocation = async function (){
  try {
    
    return await faker.location;
    
  } catch (err) {
    console.error(err);
    return null;
  }
}

const enterpriseName = async function (){
  try {
    
    return await faker.company.name();
    
  } catch (err) {
    console.error(err);
    return '';
  }
}

const randomPassword = async function (){
  try {
    
    return await faker.internet.password();
    
  } catch (err) {
    console.error(err);
    return '';
  }
}

module.exports = { randomFullName, enterpriseName, randomPassword, randomPerson, randomLocation };