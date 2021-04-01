'use strict'
const NAME_FORM_SEARCH = 'search';
const PAGE_SIZE = 12

export class UserController{
    constructor(viewMap){
        console.log("controllel constructor");
        this.setEventsListener();
        this.viewMap = viewMap
        this.viewCountryPage = 0
        this.countPage = 0
        let login = getUserLogin.call(this)
        console.log('constructor', login)
    }

    setFormEventListner(){
    var form = document.forms[NAME_FORM_SEARCH];
        setButtonText(form.search__button, STATE_START)
        form.addEventListener('submit', (event) => {
        this.processPressSubmit(event, this.viewMap);
    }, false);
    form.elements[0].addEventListener('click', (event) => {
        this.clearForm(event);
    }, false);
    }

    clearForm(event){
        event.target.value=''
    }
    setCountryButtonsEventListner(){
        setEventHandler('countries__buttons__next', this.getCountriesNextPage.bind(this))
        setEventHandler('countries__buttons__prev', this.getCountriesPrevPage.bind(this))
        setEventHandler('search__my-followers', this.renderMyFollowers.bind(this))
    }

    async setEventsListener(){
        this.setFormEventListner()
        this.setCountryButtonsEventListner()
    }


    async getFollowerLocations(searchLogo){
        return await request('/followers/' + searchLogo);
    }
    async renderMyFollowers(event){
        setButtonText(event.target, STATE_SEARCH)
        this.renderFollowers(event, this.userLogin)
        setButtonText(event.target, STATE_MY_FOLLOWERS)
    }
    async processPressSubmit(event){
        let searchLogo = event.target.search__logo.value;
        if (searchLogo === '')
            return
        event.preventDefault();//?? не перерисовывает?
        setButtonText(event.target.search__button, STATE_SEARCH)
        this.renderFollowers(event, searchLogo)
        setButtonText(event.target.search__button, STATE_START)
    }

    async renderFollowers(event, searchLogo){
        let list = {};
        let total;
        try{
            //this.viewMap.deinitMap('start')
            // TODO убрать заглушку
            let resultQuery = await this.getFollowerLocations(searchLogo);
            list = resultQuery.list;
            total = resultQuery.total;
            this.viewMap.setDataIntoMap(list)
            setCountriesData(list)
            this.countPage = parseInt(Object.keys(list).length / PAGE_SIZE) + 1
            this.getCountriesNextPage()
        }catch(err){
            console.log(err.message);
            switch(err.message){
                case ERR_USER_NOT_FOUND: handleErrUserNotFound(event); break;
            }
        }
    }

    getCountriesNextPage(){
        if (this.viewCountryPage < this.countPage) {
            let list = document.querySelectorAll('.countries__list__item')
            removeClassToPageList(list, 'countries__list__item_display', this.viewCountryPage)
            this.viewCountryPage++
            addClassToPageList(list, 'countries__list__item_display', this.viewCountryPage)
        }
    }

    getCountriesPrevPage(event){
        if (this.viewCountryPage > 1) {
            let list = document.querySelectorAll('.countries__list__item')
            removeClassToPageList(list, 'countries__list__item_display', this.viewCountryPage)
            this.viewCountryPage--
            addClassToPageList(list, 'countries__list__item_display', this.viewCountryPage)
        }
    }
}



async function request(url, method='GET', data=null){
    try{
        const headers = {};
        let body;

        if (data){
            headers['Content-Type'] = 'application/json;';
            body = JSON.stringlify(data);
        }

        let response = await fetch(url, {
            method,
            headers,
            body
        });
        return await response.json();
    } catch(err){
        console.log('Error in UserController', err);
    }
}

const STATE_START = 1
const STATE_SEARCH = 2
const STATE_MY_FOLLOWERS = 3
const TEXT_BUTTON_START_RU = 'Найти подписчиков'
const TEXT_BUTTON_SEARCH_RU = 'Ищу подписчиков'
const TEXT_BUTTON_MY_FOLLOWERS_RU = 'Мои подписчики'

function setButtonText(button, state){
    switch(state) {
        case STATE_START:
            button.value = TEXT_BUTTON_START_RU;
            break;
        case STATE_SEARCH:
            button.value = TEXT_BUTTON_SEARCH_RU;
            break;
        case STATE_MY_FOLLOWERS:
            button.value = TEXT_BUTTON_MY_FOLLOWERS_RU;
            break;
    }
}


function generateListIteam(key, value, number, maxValue){
    let decreaseValue = maxValue - value
    let orderAlphabet = ' --alphabet:' + number + ';'
    let orderDecrease = ' --decrease:' + decreaseValue + ';'
    return `<li class=\"countries__list__item\" style=\"`+ orderAlphabet + orderDecrease + `\">` + key + ':' + value
}

function setCountriesData(data){
    console.log('data in setCountriesData', data)
    let arrayCountries = Object.keys(data)
    console.log('before', arrayCountries)
    arrayCountries.sort()
    console.log('after', arrayCountries)
    let maxValue = Math.max.apply(null, Object.values(data))
    console.log('maxValue', maxValue)
    let listCountriesHtml = arrayCountries.reduce((listCountriesHtml, country, i) => {
        return listCountriesHtml + generateListIteam(country, data[country], i, maxValue)
    }, '')

    console.log('listCountriesHtml', listCountriesHtml)
    document.querySelector('.countries__list').innerHTML = listCountriesHtml;
}

let testString = '<li>TR:1</li><li>BE:1</li><li>GH:2</li><li>FR:3</li><li>IN:10</li><li>US:1</li><li>CO:1</li><li>OH:1</li><li>PH:4</li><li>DZ:3</li><li>RW:1</li><li>TN:1</li><li>CA:2</li><li>FI:1</li><li>RU:4</li><li>PT:2</li><li>SE:1</li><li>ET:1</li><li>NO:1</li><li>CD:1</li><li>CL:1</li><li>GB:1</li><li>ID:1</li><li>IT:1</li><li>BY:1</li><li>BD:3</li><li>VN:1</li><li>SD:1</li><li>RO:1</li><li>KR:1</li><li>ES:1</li><li>NG:2</li><li>UP:1</li><li>MA:3</li><li>CI:1</li><li>TZ:1</li><li>UZ:1</li><li>AU:2</li><li>NP:1</li><li>MN:1</li><li>CN:1</li><li>EC:1</li><li>MD:1</li><li>UA:1</li><li>EG:1</li><li>MX:2</li><li>PL:2</li><li>SV:2</li><li>BR:3</li><li>SP:1</li><li>UK:1</li><li>SK:1</li><li>PK:2</li><li>KE:1</li><li>SY:1</li>';
let testString2 = '<li class="countries__list__item">TR:10<li class="countries__list__item">BE:1<li class="countries__list__item">GH:2<li class="countries__list__item">FR:3<li class="countries__list__item">IN:10<li class="countries__list__item">US:1<li class="countries__list__item">CO:1<li class="countries__list__item">OH:1<li class="countries__list__item">PH:4<li class="countries__list__item">DZ:3<li class="countries__list__item">RW:1<li class="countries__list__item">TN:1<li class="countries__list__item">CA:2<li class="countries__list__item">FI:1<li class="countries__list__item">RU:4<li class="countries__list__item">PT:2<li class="countries__list__item">SE:1<li class="countries__list__item">ET:1<li class="countries__list__item">NO:1<li class="countries__list__item">CD:1<li class="countries__list__item">CL:1<li class="countries__list__item">GB:1<li class="countries__list__item">ID:1<li class="countries__list__item">IT:1<li class="countries__list__item">BY:1<li class="countries__list__item">BD:3<li class="countries__list__item">VN:1<li class="countries__list__item">SD:1<li class="countries__list__item">RO:1<li class="countries__list__item">KR:1<li class="countries__list__item">ES:1<li class="countries__list__item">NG:2<li class="countries__list__item">UP:1<li class="countries__list__item">MA:3<li class="countries__list__item">CI:1<li class="countries__list__item">TZ:1<li class="countries__list__item">UZ:1<li class="countries__list__item">AU:2<li class="countries__list__item">NP:1<li class="countries__list__item">MN:1<li class="countries__list__item">CN:1<li class="countries__list__item">EC:1<li class="countries__list__item">MD:1<li class="countries__list__item">UA:1<li class="countries__list__item">EG:1<li class="countries__list__item">MX:2<li class="countries__list__item">PL:2<li class="countries__list__item">SV:2<li class="countries__list__item">BR:3<li class="countries__list__item">SP:1<li class="countries__list__item">UK:1<li class="countries__list__item">SK:1<li class="countries__list__item">PK:2<li class="countries__list__item">KE:1<li class="countries__list__item">SY:1';

function setEventHandler(elementClass, callback){
    let element = document.querySelector('.' + elementClass)
    element.addEventListener('click', (event) => callback(event))
}


function removeClassToPageList(list, oldClass, page){
    let startPoint=page * PAGE_SIZE - PAGE_SIZE
    if (startPoint < 0)
        return;
    let endPoint = startPoint + PAGE_SIZE
    for (let i = startPoint; i < endPoint && i < list.length; i++){
        list[i].classList.remove(oldClass)
    }
}
function addClassToPageList(list, newClass, page){
    let startPoint=page * PAGE_SIZE - PAGE_SIZE
    if (startPoint < 0)
        return
    let endPoint = startPoint + PAGE_SIZE
    for (let i = startPoint; i < endPoint && i < list.length; i++){
        list[i].classList.add(newClass)
    }
}

async function getUserLogin(){
    this.userLogin = await request('/user/login')
    console.log('getLogin', this.userLogin)
}
