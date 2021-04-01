
import {UserController} from '../client/viewController.js';
import {ViewMap}  from '../client/view.js';


document.addEventListener('DOMContentLoaded', function() {
    var viewMap = new ViewMap();
    var userController = new UserController(viewMap);

}, false);
