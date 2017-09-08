import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

const Search = (props) => {
    console.log('Rendering Search...')
    const { updateRepos,clearFilters, loadRepos, reposLength, updateHistory, repoIsLoading  } = props;
    let searchInput='';
    const submitByEnter = (event) => {
        if (event.keyCode == 13) {
            document.getElementById("search_btn").click();
            return false;
        }
    }

    const search= () => {
        const value = searchInput.value ;
        searchInput.value ?
            (searchInput.value = '',updateHistory(value)): alert('Please enter value')
        // loadRepos(value);

    }


    return (
        <div className={[styles.searchContainer, !reposLength ? styles.__noData: ''].join(' ')}>
             <div><input className={styles.searchInput} autoComplete="on" required size="40"  placeholder="Search..."  type="text" ref={(input)=>{searchInput=input}} onKeyDown={submitByEnter} />
             <img className={styles.searchLogo} id="search_btn" onClick={search} src={require("../static/github.png")} /></div>
        </div>
    );
}


export default Search;