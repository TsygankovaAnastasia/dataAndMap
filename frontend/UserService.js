'use strict'
const countryCodeLookup = require('iso-countries-lookup');
const User = require('./userDto.js');
// const requireEsm = require("esm")(module);
const UserRepository = require('./UserRepository.js');
// import UserRepository  from './UserRepository.js';

const COMA = ',';
const SPACE = ' ';

function detectCountry(location, seperator, codeList, found){
    let sliceLocation = location.split(seperator);
    sliceLocation.forEach(function(subStr){
        if (found)
            return;
        let countryCode = countryCodeLookup(subStr)
        if (!(countryCode === undefined)){
            found = true;
            if (countryCode in codeList)
                codeList[countryCode]++;
            else
                codeList[countryCode] = 1;
        }
    });
}


function fillingFollowerCountriesList(user, followerCountriesList){
    user.followerLocations.forEach(function(item){
        let found = false;
        detectCountry(item, COMA, followerCountriesList, found);
        if (!found)
            detectCountry(item, SPACE, followerCountriesList, found);
        found = false;
    });

    console.log(followerCountriesList);
    console.log('length', Object.keys(followerCountriesList).length);
}


module.exports = class UserService {

    constructor(userRepository){
        this.userRepository = userRepository;
    }

    async fillingFollowerCountriesList(user, followerCountriesList){
        await this.userRepository.getFollowerLocations(user);
        fillingFollowerCountriesList(user, followerCountriesList);
    }

}
