import React from 'react';
import styles from './styles.css'

const Search = (props) => {
    const { reposLength, updateHistory, error, errorText  } = props;
    let searchInput='';
    const submitByEnter = (event) => {
        if (event.keyCode == 13) {
            document.getElementById("search_btn").click();
            return false;
        }
    }

    const search= () => {
        const value = searchInput.value ;
        const id = searchInput.id;
        searchInput.value ?
            (searchInput.value = '',updateHistory(value,id)): '';

    }


    return (
        <div className={[styles.searchContainer, !reposLength ? styles.__noData: ''].join(' ')}>
             <div><input className={styles.searchInput} id='search' autoComplete="off" required size="40"  placeholder="Search..."  type="text" ref={(input)=>{searchInput=input}} onKeyDown={submitByEnter} />
             <img className={styles.searchLogo} id="search_btn" onClick={search} src={require("../static/github.png")} /></div>
            {error && (
                <span>
                    {errorText}
                </span>
            )}
        </div>
    );
}


export default Search;