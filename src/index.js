import './css/styles.css';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchCountries} from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchForm: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.searchForm.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(e) {
    let searchQuery = e.target.value.trim();
    if (searchQuery === '') {
        return clearMarkup()
    }

    fetchCountries(searchQuery)
        .then(countries => {
            if (countries.length > 10) {
                clearMarkup();
                return Notify.info('Too many matches found. Please enter a more specific name.');
                }
            const markup = countries.map(({ name, flags,}) => {
                        return `<li class="country-item">
                                <img src="${flags.svg}" alt="${name.official}" width="40" height="20">
                                <p class="country-name">${name.official}</p>
                                </li>`}).join('')
            clearInfoMarkup();
            refs.countryList.innerHTML = markup;

        if (countries.length === 1) {
            const { capital, population, languages } = countries[0];   
            const markupInfo = `<div><span class="title">Capital:</span>${capital}</div>
                       <div><span class="title">Population:</span>${population}</div>
                       <div><span class="title">Languages:</span>${Object.values(languages).join(', ')}</div>`;
            refs.countryInfo.innerHTML = markupInfo;
        }
    }).catch(e => {
        clearMarkup();
        return Notify.failure('Oops, there is no country with that name')
})
}

function clearMarkup() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

function clearInfoMarkup() {
    refs.countryInfo.innerHTML = '';
}