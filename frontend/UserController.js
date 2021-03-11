'use strict'
import ViewMap  from './view.js';
import UserService  from './UserService.js';
import UserRepository  from './UserRepository.js';
// const User = require('./userDto.js');
// const requireEsm = require("esm")(module);
// const UserService = requireEsm('./UserService.js');
// const UserRepository = requireEsm('./repositoryUser.js');

const NAME_FORM_SEARCH = 'search';

document.addEventListener('DOMContentLoaded', function() {
    initCtx();
}, false);

function initCtx(){
    var userController = new UserController();
    var viewMap = new ViewMap();
    setFormEventListner();
}


function setFormEventListner(){
    var form = document.forms[NAME_FORM_SEARCH];
    form.addEventListener('submit', (event) => {
        console.log('EEE');
        let list = [];
        userController.getFollowerLocations(list);
        viewMap.setDataIntoMap();
        event.preventDefault();//?? не перерисовывает?
    }, false);
}

class UserController{
    constructor(){
    this.userRepository = new UserRepository();
    this.userService = new UserService(this.userRepository);
    this.user = new User('test');
    }

    getFollowerLocations(list){
        // let list = [];

        service.fillingFollowerCountriesList(user, list);
        // return list;
    }
}

// main();
