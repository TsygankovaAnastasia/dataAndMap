'use strict'
import fetch from "node-fetch";

const PATH_TO_USERS = 'https://api.github.com/users/';
const GRAPHQL_PATH = 'https://api.github.com/graphql';

const ERR_USER_NOT_FOUND='User not found';
const ERR_USER_NOT_LOGGED='User is not logged in';


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
    for (let i in followers.nodes){
        if(!(followers.nodes[i].location === null))
            locations.push(followers.nodes[i].location);
    }
}

function initCursorQuery(toServer, pageInfo, variables){
    toServer.hasNextPage = pageInfo.hasNextPage;
    if (!pageInfo.cursor){
        toServer.query = locationsOfFollowersCursorQuery;
        toServer.variables = variables;
        toServer.variables.cursor = pageInfo.endCursor;
    }
}


async function postData(toServer) {
    try{
    const response = await fetch(toServer.url, {
            method: 'POST',
            headers: {
                authorization: toServer.userToken,            
            },
            body: JSON.stringify({
                query: toServer.query,
                variables: toServer.variables
            })
  });
        return await response.json();
    }
    catch(err){
        console.log(err);
    }
}


async function getPage(toServer, locationsOfFollowers, locationsOfFollowersCursorVariables){
    let json = await postData(toServer)
    handleFollowers(locationsOfFollowers, json.data.user.followers);
    initCursorQuery(toServer, json.data.user.followers.pageInfo, locationsOfFollowersCursorVariables);
    return  json.data.user.followers.totalCount;
}

async function getFollowersGraphql(user, login){
    if (!user || !user.githubToken){
        throw new Error(ERR_USER_NOT_LOGGED)
    }
    let pageSize = 100;
    let cursor = '';

    let locationsOfFollowersVariables = {login, pageSize};
    let locationsOfFollowersCursorVariables = {login, pageSize, cursor};

    let toServer = {
        userToken: "token " + user.githubToken,
        url: GRAPHQL_PATH,
        query: locationsOfFollowersQuery,
        variables: locationsOfFollowersVariables,
        hasNextPage: false
    };
    do{
        user.followerCount = await getPage(toServer, user.followerLocations, locationsOfFollowersCursorVariables);
    }while(toServer.hasNextPage);
    console.log(user)
}

function logoIsValid(logo){
    let valid = true;
    fetch(PATH_TO_USERS + logo)
        .then(
            response => response.json())
        .then( json =>{
            if (json.login === undefined){
                console.log("logoIsValid: INVALID");
                valid = false;
            }})
    return valid
}


export async function getFollowerLocations(user, searchLogo){
        if (logoIsValid(searchLogo))
            await getFollowersGraphql(user, searchLogo);
        else{
            throw new Error(ERR_USER_NOT_FOUND);
        }
    }

export async function getAccessToken({code, client_id, client_secret}) {
    return await request("https://github.com/login/oauth/access_token",
        'access_token',
        'POST', null, { code, client_id, client_secret })
}
export async function getUserLogin(accessToken){
    return await request('https://api.github.com/user', 'login', 'GET', accessToken, null)
}

async function request(url, searchParam, method, accessToken, data){
    const headers = {};
    let body;

    if (data !== null){
        headers['Content-Type'] = 'application/json;';
        body = JSON.stringify(data);
    }
    if (accessToken){
        headers['authorization'] = 'token ' + accessToken
    }

    let response = await fetch(url, {
        method,
        headers,
        body
    });
    const text = await response.text();
    const params = new URLSearchParams(text);
    console.log('params', params)

    let res = params.get(searchParam);
    if(!res){
        let info = JSON.parse(text)
        res = info[searchParam]
    }
    console.log('result query', res)
    return res
}


