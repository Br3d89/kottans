import React from 'react';

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

    const langSelect = languages.map((value,index)=>{
        return (<option
            key={value+index}
            value={value}
            defaultValue = {filters[5].enabled}
            >{value}
            </option>)
    })


    return (<div>
        <div>
        <label htmlFor="hasIssues">Has issues</label>
        <input id="0"
               type="checkbox"
               checked={filters[0].enabled}
               name="has_issues"
               onChange={handleInputChange}/>
    </div>
        <div>
            <label htmlFor="hasTopics">Has topics</label>
            <input id="1"
                   type="checkbox"
                   checked={filters[1].enabled}
                   name="has_topics"
                   onChange={handleInputChange}/>
        </div>
        <div>
            <label htmlFor="starred">Starred >= </label>
            <input id="2"
                   type="text"
                   value={filters[2].value}
                   name="starred"
                   onChange={handleTextInputChange}/>
        </div>
        <div>
            <label htmlFor="updated">Updated after date </label>
            <input id="3"
                   type="datetime-local"
                   value={filters[3].value}
                   name="updated"
                   onChange={handleTextInputChange}/>
        </div>
        <div>
         <label htmlFor="type">Repo type </label>
         <select id="4" size="1" onChange={handleTextInputChange}>
            <option label=" "></option>
            <option defaultValue = {filters[4].enabled} value="all">All</option>
            <option defaultValue = {filters[4].enabled} value="forked">Forked</option>
            <option defaultValue = {filters[4].enabled} value="sources">Sources</option>
        </select>
        </div>
        <div>
            <label htmlFor="language">Language </label>
            <select id="5" size="1" onChange={handleTextInputChange}>
                <option label=" "></option>
                {langSelect}
            </select>
        </div>
    </div>)
};


export default Filters;