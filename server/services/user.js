'use strict'
import countryCodeLookup from 'iso-countries-lookup';
import {getAccessToken, getUserLogin, getFollowerLocations} from '../reposirory/user.js';

const COMA = ',';
const SPACE = ' ';

function detectCountry(location, seperator, codeList){
    let found = false;
    let sliceLocation = location.split(seperator);
    sliceLocation.forEach(function(subStr){
        let countryCode = countryCodeLookup(subStr)
        if (countryCode !== undefined){
            found = true
            if (countryCode in codeList)
                codeList[countryCode]++
            else
                codeList[countryCode] = 1
        }
    });
    return found
}


function fillingFollowerCountriesList(user, followerCountriesList){
    user.followerLocations.forEach(function(item){
        let found = detectCountry(item, COMA, followerCountriesList);
        if (!found)
            detectCountry(item, SPACE, followerCountriesList);

        if (found)
            user.detectedFollowerCount++;

        console.log(user.detectedFollowerCount, item)
        found = false;
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

