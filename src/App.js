import React, {Component} from 'react';
import Search from './Search';
import Result from './Result';
import Filters from './Filters';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            repos: [],
            languages: [],
            searchName: '',
            showFilters: false,
            showResults: false,
            filters: [
                {
                    name: 'has_issues',
                    enabled: false,
                    type: 'checkbox',
                    value: true
                },
                {
                    name: 'has_topics',
                    enabled: false,
                    type: 'checkbox',
                    value: true
                },
                {
                    name: 'starred',
                    enabled: false,
                    type: 'text',
                    value: '0'
                },
                {
                    name: 'updated',
                    enabled: false,
                    type: 'datetime-local',
                    value: ''
                },
                {
                    name: 'type',
                    enabled: false,
                    type: 'select',
                    value: ''
                },
                {
                    name: 'language',
                    enabled: false,
                    type: 'select',
                    value: ''
                }
            ]

        }
        ;
        this.updateRepos = this.updateRepos.bind(this);
        this.filterRepos = this.filterRepos.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.languageArr = this.languageArr.bind(this);
    }

    updateRepos(repos){
        console.log('updateRepos func');
        let languages = this.languageArr(repos);
        this.setState({repos,languages,showFilters:true,showResults:true});
        this.clearFilters();
    }

    updateFilter(id,value,enabled){
        console.log('updateFilter func value= ',value, id)
        let filters = this.state.filters;
        filters[id].enabled=enabled;
        filters[id].value=value;
        this.setState({filters});
        console.log('%c Updatefilter filters', 'background: #222; color: #bada55', filters);
    }

    clearFilters(){
        console.log('clearFilters func');
        const defaultFilters = [
            {
                name: 'has_issues',
                enabled: false,
                type: 'checkbox',
                value: true
            },
            {
                name: 'has_topics',
                enabled: false,
                type: 'checkbox',
                value: true
            },
            {
                name: 'starred',
                enabled: false,
                type: 'text',
                value: '0'
            },
            {
                name: 'updated',
                enabled: false,
                type: 'datetime-local',
                value: ''
            },
            {
                name: 'type',
                enabled: false,
                type: 'select',
                value: ''
            },
            {
                name: 'language',
                enabled: false,
                type: 'select',
                value: ''
            }
        ];
        const filters = defaultFilters
        this.setState({filters});
    }

    filterRepos(repos,filtersArray) {
        console.log('filterRepos funct, filtersArray= ', filtersArray)
        let newRepos = repos;
        for (let i in filtersArray) {
            console.log(filtersArray[i].name);
            switch(filtersArray[i].name){
                case 'has_issues':
                    console.log('has_issues before case, newRepos= ',newRepos)
                    newRepos = newRepos.filter((item)=>item.has_issues===true);
                    console.log('has_issues after case, newRepos= ',newRepos)
                    break;
                case 'has_topics':
                    console.log('has_topics before case, newRepos= ',newRepos)
                    newRepos = newRepos.filter((item)=>item.topics.length > 0);
                    break;
                case 'starred':
                    console.log('starred before case, newRepos= ',newRepos)
                    newRepos = newRepos.filter((item)=>item.stargazers_count >= filtersArray[i].value);
                    break;
                case 'updated':
                    console.log('updated before case, newRepos= ',newRepos)
                    newRepos = newRepos.filter((item)=>item.updated_at >= filtersArray[i].value);
                    break;
                case 'type':
                    console.log('type before case, newRepos= ',newRepos)
                    newRepos = newRepos.filter((item)=>{
                        switch(filtersArray[i].value){
                            case 'forked':
                                return item.fork===true;
                            case 'sources':
                                return item.fork===false;
                            default:
                                return true;
                        }
                        item.fork === filtersArray[i].value});
                    break;
                case 'language':
                    console.log('language before case, newRepos= ',newRepos)
                    newRepos = newRepos.filter((item)=>item.language === filtersArray[i].value);
                    break;
            }
        }
        console.log('newRepos= ',newRepos);
        return newRepos;
    }

    languageArr(newRepos){
    let langArr = [...new Set(newRepos.map((value)=>value.language).filter((value)=>value!=null))];
    //console.log('%c Language array ','background: #222; color: #bada55',alllangs);
    //let langArr = [...new Set(alllangs)];
    //console.log('%c Language array ','background: #222; color: #bada55',langArr);
    return langArr;
    }

    render(){
        console.log('%c Rendering App...','background: #222; color: red')
        console.log('%c App state ','background: #222; color: #bada55', this.state);
        let enabledFilters = this.state.filters.filter((item)=>item.enabled===true);
        console.log('enabledFilters',enabledFilters);
        let filteredRepos = enabledFilters.length ? this.filterRepos(this.state.repos, enabledFilters): this.state.repos;
        console.log('filteredRepos ', filteredRepos);
        //if error change null to []
        return (
            <div>
            <div>
                <Search
                updateRepos = {this.updateRepos}
                clearFilters = {this.clearFilters}
                />
            </div>
                <div>
                    {this.state.showFilters ? <Filters
                        updateFilter = {this.updateFilter}
                        filters = {this.state.filters}
                        languages = {this.state.languages}
                    /> : null}
                </div>
                <div>
                {this.state.showResults ? <Result
                    repos  = {filteredRepos}
                /> : null}
                </div>
                <div>
                </div>
            </div>
        );
    }
}