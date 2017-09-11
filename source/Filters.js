import React from 'react';
import styles from './styles.css'

const Filters = (props) => {
    const { languages, queryObject, updateHistory  } = props;
    const has = (obj, key) => {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    const handleChange = (event) => {
        const target = event.target;
        let id = target.id;
        switch(id){
            case 'updated':
                if (!target.value){
                    break;
                }
            case 'language':
                if (!target.value){
                    break;
                }
            case 'type':
            case 'starred_gt':
                id=id+'='+target.value;
                break;
        }
        updateHistory(id);
    }


    const langSelect = languages.map((value,index)=>{
        return (<option
            key={value+index}
            value={value}
            >{value}
            </option>)
    })

    const type = ['all','forked','sources'];
    const typeSelect = type.map((value,index)=>{
        return (<option
            key={value+index}
            value={value}
        >{value}
        </option>)
    })


    return (
        <ul className={styles.filterBlockContainer}>

        <li className={styles.filterBlockView}>
        <label htmlFor="has_issues">Has issues</label>
        <input id="has_issues"
               type="checkbox"
               checked={has(queryObject,'has_issues')}
               name="has_issues"
               onChange={handleChange}
               className={styles.hasIssuesFilter}/>
        </li>

        <li className={styles.filterBlockView}>
            <label htmlFor="hasTopics">Has topics</label>
            <input id="has_topics"
                   type="checkbox"
                   checked={has(queryObject,'has_topics')}
                   name="has_topics"
                   onChange={handleChange}
                   className={styles.hasTopicsFilter}
            />
        </li>

        <li className={styles.filterBlockView}>
            <label htmlFor="starred_gt">Starred >= </label>
            <input id="starred_gt"
                   type="text"
                   value={queryObject.starred_gt}
                   name="starred_gt"
                   onChange={handleChange}
                   className={styles.starredFilter}/>
        </li>
         <li className={styles.filterBlockView}>
            <label htmlFor="updated">Updated after date </label>
            <input id="updated"
                   type="datetime-local"
                   value={queryObject.updated}
                   name="updated"
                   onChange={handleChange}
                   className={styles.updatedDateFilter}/>
        </li>
         <li className={styles.filterBlockView}>
         <label htmlFor="type">Repo type </label>
         <select id="type" size="1" value={queryObject.type} className={styles.repoTypeFilter} onChange={handleChange}>
             {typeSelect}
        </select>
        </li>
         <li className={styles.filterBlockView}>
            <label htmlFor="language">Language </label>
            <select id="language" size="1" value = {queryObject.language} className={styles.languageFilter} onChange={handleChange}>
                <option label=" "></option>
                {langSelect}
            </select>
            </li>
        </ul>
    )
};


export default Filters;