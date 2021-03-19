import {UserController} from '../frontend/UserController.js';
import {ViewMap}  from '../frontend/view.js';


document.addEventListener('DOMContentLoaded', function() {
    var viewMap = new ViewMap();
    var userController = new UserController(viewMap);

}, false);
