'use strict'
const NAME_FORM_SEARCH = 'search';
const PAGE_SIZE = 14

export class UserController{
    constructor(viewMap){
        console.log("controllel constructor");
        this.viewMap = viewMap
        this.viewCountryPage = 0
        this.countPage = 0
        this.list = {}
        this.totalFollowers = 0
        let login = getUserLogin.call(this)
        this.setEventsListener();
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
        setEventHandler('.countries__buttons__next', 'click', this.getCountriesNextPage.bind(this))
        setEventHandler('.countries__buttons__prev', 'click', this.getCountriesPrevPage.bind(this))
        setEventHandler('.search__my-followers', 'click', this.renderMyFollowers.bind(this))
        setEventHandler('#countries__sort_value', 'change', this.sortingData.bind(this), SORT_VALUE)
        setEventHandler('#countries__sort_alphabet', 'change', this.sortingData.bind(this), SORT_ALPHABET)
        setEventHandler('.button', 'focus', this.removeShadow.bind(this))
        setEventHandler('.search__followers-button', 'focus', this.removeShadow.bind(this))
    }

    sortingData(event, mode){
        setCountriesData(this.list, mode[0])
        this.viewCountryPage = 0
        this.getCountriesNextPage()
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
        await this.renderFollowers(event, this.userLogin)
        this.setFollowersInfo('search__my-followers_info', this.totalFollowers,
            Object.keys(this.list).length, this.userLogin)
        setButtonText(event.target, STATE_MY_FOLLOWERS)
        userPathStep1(event.target)
    }
    async processPressSubmit(event){
        let searchLogo = event.target.search__logo.value;
        if (searchLogo === '')
            return
        event.preventDefault();
        setButtonText(event.target.search__button, STATE_SEARCH)
        await this.renderFollowers(event, searchLogo)
        this.setFollowersInfo('search__followers_info', this.totalFollowers, this.detectedFollowersCount, searchLogo)
        setButtonText(event.target.search__button, STATE_START)
        userPathStep2()
    }

    async renderFollowers(event, searchLogo){
        let total;
        try{
            let resultQuery = await this.getFollowerLocations(searchLogo);

            this.list = resultQuery.list;
            this.totalFollowers = resultQuery.totalFollowersCount
            this.detectedFollowersCount = resultQuery.detectedFollowersCount
            this.viewCountryPage = 0

            this.viewMap.setDataIntoMap(this.list)
            setCountriesData(this.list)
            this.countPage = parseInt(Object.keys(this.list).length / PAGE_SIZE) + 1
            this.getCountriesNextPage()
        }catch(err){
            console.log(err.message);
            switch(err.message){
                case ERR_USER_NOT_FOUND: handleErrUserNotFound(event); break;
            }
        }
    }

    getCountriesNextPage(){
        if (this.viewCountryPage < this.countPage - 1) {
            let list = document.querySelectorAll('.countries__list__item')
            addClassToPageList(list, 'countries__list__item_hide', this.viewCountryPage)
            this.viewCountryPage++
            removeClassToPageList(list, 'countries__list__item_hide', this.viewCountryPage)
        }
    }

    getCountriesPrevPage(event){
        if (this.viewCountryPage > 1) {
            let list = document.querySelectorAll('.countries__list__item')
            addClassToPageList(list, 'countries__list__item_hide', this.viewCountryPage)
            this.viewCountryPage--
            removeClassToPageList(list, 'countries__list__item_hide', this.viewCountryPage)
        }
    }

    setFollowersInfo(className, total, detected, name){
        name = (name === this.userLogin) ? 'тебя' : name
        let totalFild = document.querySelector('.' + className + '-total')
        let detectedFild = document.querySelector('.' + className + '-detected')
        let textFollowers = getTextFollowers(total)
        total = (total === 0) ? 'нет' : total
        totalFild.textContent = "У " + name + " " + total + " " + textFollowers
        detectedFild.textContent = (detected === 0) ?
            "Местополонежение определить не возможно" :
            "Местоположение определено у " + detected + " из них"
    }

    removeShadow(event){
        event.target.classList.remove('box-shadow')
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

function generateListIteam(value){
    let strInHtml = value[0] + '  ' + value[1]
    return `<li class=\"countries__list__item countries__list__item_hide \">` + strInHtml
}

const SORT_VALUE = 1;
const SORT_ALPHABET = 2;

function getSortData(data, mode=SORT_VALUE){
    let sortKeys;
    switch (mode){
        case (SORT_ALPHABET):
            sortKeys = { more: 1, less: -1, index:0}; break;
        case (SORT_VALUE):
            sortKeys = { more: -1, less: 1, index:1}; break;
    }

    return Object.entries(data).sort((curr, next)=>{
        if (curr[sortKeys.index] > next[sortKeys.index]) return sortKeys.more;
        if (curr[sortKeys.index] < next[sortKeys.index]) return sortKeys.less;
        return 0;
    })
}

function createListCountries(data){
    let listCountriesHtml = Object.values(data).reduce((listCountriesHtml, country) => {
        return listCountriesHtml + generateListIteam(country)
    }, '')
    return listCountriesHtml
}

function setCountriesData(data, modeSort=SORT_VALUE){
    console.log('setCountriesData', data)
    if (data) {
        let sortData = getSortData(data, modeSort)
        let listHtml = createListCountries(sortData)
        document.querySelector('.countries__list').innerHTML = listHtml;
    }
}

function setEventHandler(conditions, hotEvent, callback){
    let element = document.querySelector(conditions)
    let params = Array.from(arguments).slice(3);
    console.log('params', params);
    element.addEventListener(hotEvent, (event) => callback(event, params))
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
        return;
    let endPoint = startPoint + PAGE_SIZE
    for (let i = startPoint; i < endPoint && i < list.length; i++){
        list[i].classList.add(newClass)
    }
}

async function getUserLogin(){
    this.userLogin = await request('/user/login')
    console.log('getLogin', this.userLogin)
}

function getTextFollowers(number){
    let tail = number % 10
    switch(tail){
        case 0: return 'подписчиков';
        case 1: return 'подписчик';
        case 2: return 'подписчика';
        case 3: return 'подписчика';
        case 4: return 'подписчика';
        case 5: return 'подписчиков';
        case 6: return 'подписчиков';
        case 7: return 'подписчиков';
        case 8: return 'подписчиков';
        case 9: return 'подписчиков';
    }
}

function userPathStep1(button) {
    button.classList.remove('box-shadow')
    let searchFollowersButtons = document.querySelectorAll('.search__followers-button')
    for (let field of searchFollowersButtons) {
        field.classList.remove('hide')
        field.classList.add('search__appearButton')
    }
    let searchFollowers = document.querySelector('.search__login')
    searchFollowers.classList.add('box-shadow')
}
function userPathStep2() {
    let hideList = document.querySelectorAll('.hide')
    for ( let hide of hideList){
        hide.classList.remove('hide')
    }
}