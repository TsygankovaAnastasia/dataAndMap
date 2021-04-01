import {Router} from 'express'
import {userLogin, oAuthUser, getFollowerLocations} from '../controllers/user.js'
const router = Router();

router.get('/login', oAuthUser);
router.get('/followers/:searchLogo', getFollowerLocations);
router.get('/user/login', userLogin);

export default router;