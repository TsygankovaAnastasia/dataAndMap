'use strict'
import countryCodeLookup from 'iso-countries-lookup';
import {getAccessToken, getUserLogin, getFollowerLocations} from '../reposirory/user.js';

const COMA = ',';
const SPACE = ' ';

function detectCountry(location, seperator, codeList, found){
    let sliceLocation = location.split(seperator);
    sliceLocation.forEach(function(subStr){
        if (found)
            return;
        let countryCode = countryCodeLookup(subStr)
        if (countryCode !== undefined){
            found = true
            if (countryCode in codeList)
                codeList[countryCode]++
            else
                codeList[countryCode] = 1
        }
    });
}


function fillingFollowerCountriesList(user, followerCountriesList){
    user.followerLocations.forEach(function(item){
        let found = false;
        detectCountry(item, COMA, followerCountriesList, found);
        //TODO detect country by space
/*
        if (!found)
            detectCountry(item, SPACE, followerCountriesList, found);
*/
        found = false;
        console.log(item)
    })
}


export async function getFollowerCountriesList(user, searchLogo, followerCountriesList){
    await getFollowerLocations(user, searchLogo);
    fillingFollowerCountriesList(user, followerCountriesList);
}

export async function processAuth(code, client_id, client_secret){
    if (!code || !client_id || !client_secret) {
        return 0;
    }
    let accessToken = await getAccessToken({ code, client_id, client_secret });
    let userLogin = await getUserLogin(accessToken)
    return {accessToken: accessToken, userLogin: userLogin}
}

