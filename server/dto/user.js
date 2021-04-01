'use strict'

export class User {

    constructor(login, accessToken){
        this.githubToken = accessToken;
        this.login = login;
        this.followerLocations = [];
        this.followerCount = 0;
    }
}
