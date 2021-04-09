import fetch from "node-fetch"
import 'dotenv'
import 'express-session';
import {processAuth, getFollowerCountriesList} from '../services/user.js'
import {User} from '../dto/user.js'

export const userLogin = async (req, res) =>{
    res.json(req.session.userLogin)
}

export const oAuthUser = async (req, res) => {
    const {query} = req;
    const {code} = query;
    console.log('oAuthUser code', code)

    if (!code)
    {
        res.send({
            success: false,
            message: 'Error: no code'
        })
    }
    let auth = await processAuth(code, process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET);
    req.session.accessToken = auth.accessToken
    req.session.userLogin = auth.userLogin
    console.log('userLogin', req.session.userLogin)
    res.redirect("/home");
}

export async function getFollowerLocations(req, res) {
    let list = {}
    let searchLogo = req.params.searchLogo

    let user = new User(req.session.userLogin, req.session.accessToken)
    await getFollowerCountriesList(user, searchLogo, list)
    console.log('detected', user.detectedFollowerCount)
    res.json({totalFollowersCount: user.followerCount, detectedFollowersCount: user.detectedFollowerCount, list: list})
}
