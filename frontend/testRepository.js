const User = require('./userDto.js');
import UserRepository from './UserRepository.js';


async function test(){
    let user = new User('test');
    let repo = new UserRepository();
    await repo.getFollowerLocations(user);
    console.log("followerLocations ", user.followerLocations);
}

test();
