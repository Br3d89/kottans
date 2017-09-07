import React from 'react';
// import filterStyles from './filter.css'
import styles from './styles.css'

const Filters = (props) => {
    console.log('Rendering Filters...')
    const { updateFilter, filters, languages  } = props;
    console.log('Filters filters = ',filters);

    const handleInputChange = (event) => {
        console.log('handleInputChange');
        const target = event.target;
        const enabled = target.checked;
        const name = target.name;
        const id = target.id;
        const value = true;
        console.log(value);
        updateFilter(id,value,enabled);
    }

    const handleTextInputChange = (event) => {
        console.log('handleInputChange');
        const target = event.target;
        console.log(target.value)
        const enabled = !!target.value;
        const name = target.name;
        const id = target.id;
        const value = target.value;
        updateFilter(id,value,enabled);
     }
     
     const handleSpanClick = (event) => {
        console.log('handleSpanClick');
        const target = event.target;
        const value= target.getAttribute("value")
        console.log(value)
        const enabled = !!value;
        const id = target.id;
        updateFilter(id,value,enabled);
     }
     
     

    const langSelect = languages.map((value,index)=>{
        return (<option
            key={value+index}
            value={value}
            defaultValue = {filters[5].enabled}
            >{value}
            </option>)
    })


    return (
        <ul className={styles.filterBlockContainer}>

        <li className={styles.filterBlockView}>
        <label htmlFor="hasIssues">Has issues</label>
        <input id="0"
               type="checkbox"
               checked={filters[0].enabled}
               name="has_issues"
               onChange={handleInputChange}
               className={styles.hasIssuesFilter}/>
        </li>

        <li className={styles.filterBlockView}>
            <label htmlFor="hasTopics">Has topics</label>
            <input id="1"
                   type="checkbox"
                   checked={filters[1].enabled}
                   name="has_topics"
                   onChange={handleInputChange}
                   className={styles.hasTopicsFilter}
            />
        </li>

        <li className={styles.filterBlockView}>
            <label htmlFor="starred">Starred >= </label>
            <input id="2"
                   type="text"
                   value={filters[2].value}
                   name="starred"
                   onChange={handleTextInputChange}
                   className={styles.starredFilter}/>
        </li>
         <li className={styles.filterBlockView}>
            <label htmlFor="updated">Updated after date </label>
            <input id="3"
                   type="datetime-local"
                   value={filters[3].value}
                   name="updated"
                   onChange={handleTextInputChange}
                   className={styles.updatedDateFilter}/>
        </li>
         <li className={styles.filterBlockView}>
         <label htmlFor="type">Repo type </label>
         <select id="4" size="1" className={styles.repoTypeFilter} onChange={handleTextInputChange}>
            <option  value="all">All</option>
            <option  value="forked">Forked</option>
            <option  value="sources">Sources</option>
        </select>
        </li>
         <li className={styles.filterBlockView}>
            <label htmlFor="language">Language </label>
            <select id="5" size="1" className={styles.languageFilter} onChange={handleTextInputChange}>
                <option label=" "></option>
                {langSelect}
            </select>
            </li>
        </ul>
    )
};


export default Filters;