'use strict'
import {ViewMap}  from './view.js';
import {UserService}  from './UserService.js';
import {UserRepository} from './UserRepository.js';
import {User} from './userDto.js';
// const User = require('./userDto.js');
// const requireEsm = require("esm")(module);
// const UserService = requireEsm('./UserService.js');
// const UserRepository = requireEsm('./repositoryUser.js');

const NAME_FORM_SEARCH = 'search';

// document.addEventListener('DOMContentLoaded', function() {
//     initCtx();
// }, false);

// function initCtx(){
//     var userController = new UserController();
//     var viewMap = new ViewMap();
//     setFormEventListner(userController, viewMap);
// }


export class UserController{
    constructor(viewMap){
        this.viewMap = viewMap;
        this.userRepository = new UserRepository();
        this.userService = new UserService(this.userRepository);
        this.user = new User('test');
        this.setFormEventListner();        
    }

    setFormEventListner(){
        var form = document.forms[NAME_FORM_SEARCH];
        form.addEventListener('submit', (event) => {
            this.processPressSubmit(event, this.viewMap);
        }, false);
    }


    async getFollowerLocations(list){
        // let list = [];

        await this.userService.fillingFollowerCountriesList(this.user, list);
        // return list;
    }

    async processPressSubmit(event){
        console.log('Event caught!!!');
        let list = [];
        event.preventDefault();//?? не перерисовывает?
        await this.getFollowerLocations(list);
        this.viewMap.setDataIntoMap(list);
    }
}

// main();
