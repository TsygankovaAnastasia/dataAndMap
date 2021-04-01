'use strict'
import {ViewMap}  from './viewMap';
import {UserController} from './viewController.js';

import './style/header.css'
import './style/body.css'
import './style/main.css'
import './style/footer.css'

document.addEventListener('DOMContentLoaded', function() {
    var viewMap = new ViewMap();
    var userController = new UserController(viewMap);

}, false);
