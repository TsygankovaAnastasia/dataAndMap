'use strict'
import {User} from './userDto.js';
// import graphqlFetch from 'graphql-fetch';
// const fetch = require('node-fetch');
// const fetch = require('graphql-fetch')('http://domain.com/graphql');
// var request = require( '@kgryte/github-get' );


const PATH_TOKEN ='Authorization:token a0d86f9cb94a82991c95659522719268f246666a https://api.github.com/user';
const PATH_RATE_LIMIT = 'https://api.github.com/rate_limit';
const PATH_TO_USERS = 'https://api.github.com/users/';
const FOLLOWERS_DIR = '/followersq';
const GRAPHQL_PATH = 'https://api.github.com/graphql';


const locationsOfFollowersQuery = `query ($login: String!, $pageSize: Int){
  user(login: $login){
    followers(first: $pageSize){
      totalCount
      nodes{
        location
      }
      pageInfo {
        endCursor
        hasNextPage
      }

    }
  }
}
`;


const locationsOfFollowersCursorQuery = `query ($login: String!, $pageSize: Int, $cursor: String!){
  user(login: $login){
    followers(first: $pageSize, after: $cursor){
      totalCount
      nodes{
        location
      }
      pageInfo {
        endCursor
        hasNextPage
      }

    }
  }
}
`;

function handleFollowers(locations, followers){
    console.log('Total folowers', followers.totalCount);
    console.log('Geted folowers', locations.length);
    // console.log('Nodes ', followers.nodes);

    for (let i in followers.nodes){
        if(!(followers.nodes[i].location === null))
            locations.push(followers.nodes[i].location);
    }
    //console.log("locations", locations);
}

function initCursorQuery(toServer, pageInfo, variables){
    console.log("Do initCursorQuery", pageInfo);
    toServer.hasNextPage = pageInfo.hasNextPage;
    if (!pageInfo.cursor){
        toServer.query = locationsOfFollowersCursorQuery;
        toServer.variables = variables;
        toServer.variables.cursor = pageInfo.endCursor;
    }
}


async function postData(toServer) {
    console.log('ToServer', toServer);
    try{
    const response = await fetch(toServer.url, {
            method: 'POST',
            headers: {
                authorization: toServer.userToken,            
                // 'Content-Type': 'application/json',
                // 'Accept': 'application/json',
                // method: "POST",
                // Referer: "127.0.0.1",
                // origin: "127.0.0.1",
                // referrerPolicy: "origin",
                // credentials: 'include',
                // cache: "no-cache",
                // mode: "no-cors", // to prevent CORS errors
                // redirect: "follow",                
            },
            body: JSON.stringify({
                query: toServer.query,
                variables: toServer.variables
            })
  });
    console.log('Response', response);
        return await response.json();
    }
    catch(err){
        console.log(err);
    }
}


function getPage(toServer, locationsOfFollowers, locationsOfFollowersCursorVariables){
    return new Promise(resolve =>{
        postData(toServer)
            .then((json) => {
               console.log("RESPONCE", json);
                handleFollowers(locationsOfFollowers, json.data.user.followers);
                initCursorQuery(toServer, json.data.user.followers.pageInfo, locationsOfFollowersCursorVariables);
//                console.log("toServer.hasNextPage ", toServer.hasNextPage);
                resolve();
                
            }
                 )});
}

async function getPageLog(toServer, locationsOfFollowers, locationsOfFollowersCursorVariables){
    await getPage(toServer, locationsOfFollowers, locationsOfFollowersCursorVariables);
}


async function getFollowersGraphql(user, inLogin = ''){
    //TODO: You will need to delete the userToken and login
    //______________________
    var userToken = "token a0d86f9cb94a82991c95659522719268f246666a";
    // let login = (inLogin) ? inLogin : user.login;    
    let login = "john-smilga";
    //______________________

    
    let pageSize = 100;
    let cursor = '';

    var locationsOfFollowersVariables = {login, pageSize};
    var locationsOfFollowersCursorVariables = {login, pageSize, cursor};

    let toServer = {
        userToken: userToken,
        url: GRAPHQL_PATH,
        query: locationsOfFollowersQuery,
        variables: locationsOfFollowersVariables,
        hasNextPage: false
    };
    
    do{
        await getPageLog(toServer, user.followerLocations, locationsOfFollowersCursorVariables);
    }while(toServer.hasNextPage);
    console.log('DONE');
    
}

export class UserRepository{

    constructor(){
    }

    async getFollowerLocations(user){
            await getFollowersGraphql(user);
    }
}
