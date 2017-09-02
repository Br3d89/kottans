import PropTypes from 'prop-types';
import React from 'react';

const Search = (props) => {
    console.log('Rendering Search...')
    const { updateRepos,clearFilters  } = props;
    let searchInput='';

    const search= () => {
        console.log(`Searching...${searchInput.value}`);
        let xhr = new XMLHttpRequest();
        //const orgUrl = 'https://api.github.com/orgs/';
        xhr.open('GET', `https://api.github.com/users/${searchInput.value}/repos?per_page=100`);
        xhr.setRequestHeader('Accept', 'application/vnd.github.mercy-preview+json');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                let data = JSON.parse(xhr.responseText);
                //console.log(xhr.getResponseHeader("Link"));
                //xhr.open('GET', `https://api.github.com/users/${searchInput.value}/repos?per_page=100`);
                updateRepos(data);

            }
        }

        searchInput.value = '';

    }


    return (
        <div>
            <label htmlFor="search">Please enter user or organisation: </label>
            <input id="search" type="text" ref={(input)=>{searchInput=input}} />
            <button id="search_btn" onClick={search}>Find</button>
        </div>
    );
}


export default Search;