import React, {Component} from 'react';
import Search from './Search';
import Result from './Result';
import Filters from './Filters';
import Sort from './Sort';
import styles from './app.css'
import Modal from 'react-modal';
import RepoDialog from './RepoDialog'
import { BrowserRouter as Router, Route } from 'react-router-dom'


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            repos: [],
            languages: [],
            searchName: '',
            showFilters: false,
            showResults: false,
            showSort: false,
            modalIsOpen: false,
            modalRepoName:'',
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
                },
            ],
            sorts:{
                sortOrderType: true,
                sortType: [
                    // {
                    //     name: 'clear',
                    //     description: 'clear sorting',
                    //     enabled: true,
                    //     type: 'select',
                    // },
                    {
                    name: 'name',
                    description: 'Repo name',
                    enabled: true,
                    type: 'select',
                },
                {
                    name: 'stargazers_count',
                    description: 'Stars count',
                    enabled: false,
                    type: 'select',
                },
                {
                    name: 'open_issues_count',
                    description: 'Open issues count',
                    enabled: false,
                    type: 'select',
                },
                {
                    name: 'updated_at',
                    description: 'Updated date',
                    enabled: false,
                    type: 'select',
                    value: ''
                }
            ]
            }
        };
        this.subtitle='';
        this.updateRepos = this.updateRepos.bind(this);
        this.filterRepos = this.filterRepos.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.languageArr = this.languageArr.bind(this);
        this.updateSort = this.updateSort.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.clearFiltersSorts = this.clearFiltersSorts.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    updateRepos(repos){
        console.log('updateRepos func');
        let languages = this.languageArr(repos);
        this.setState({repos,languages,showFilters:true,showResults:true, showSort:true});
        this.clearFiltersSorts()
    }

    updateFilter(id,value,enabled){
        console.log('updateFilter func value= ',value, id)
        let filters = this.state.filters;
        filters[id].enabled=enabled;
        filters[id].value=value;
        this.setState({filters});
        console.log('%c Updatefilter filters', 'background: #222; color: #bada55', filters);
    }

    updateSort(value){
        console.log('updateSort func value= ', this.state.sorts);
        let sorts = this.state.sorts;
        sorts.sortType.forEach(function(item, i) { if (item.enabled === true) sorts.sortType[i].enabled = false; });
        sorts.sortType.forEach(function(item, i) {if (item.name === value) sorts.sortType[i].enabled = true; });
        sorts.sortOrderType = true;
        this.setState({sorts})
    }

    updateOrder(){
        const sorts = this.state.sorts;
        sorts.sortOrderType = !sorts.sortOrderType
        this.setState({sorts})
    }

    clearFilters(){
        console.log('clearFilters func');
        const filters = [
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
        return filters;
    }

    clearSorts(){
        console.log('clearSort func');
        const sorts = {
            sortOrderType: true,
            sortType: [
                // {
                //     name: 'clear',
                //     description: 'clear sorting',
                //     enabled: true,
                //     type: 'select',
                // },
                {
                    name: 'name',
                    description: 'Repo name',
                    enabled: true,
                    type: 'select',
                },
                {
                    name: 'stargazers_count',
                    description: 'Stars count',
                    enabled: false,
                    type: 'select',
                },
                {
                    name: 'open_issues_count',
                    description: 'Open issues count',
                    enabled: false,
                    type: 'select',
                },
                {
                    name: 'updated_at',
                    description: 'Updated date',
                    enabled: false,
                    type: 'select',
                    value: ''
                }
            ]
        };
        return sorts;
    }

    clearFiltersSorts(){
        const filters = this.clearFilters();
        const sorts = this.clearSorts();
        this.setState({filters,sorts});
    }

    filterRepos(repos,filtersArray,sortsArray) {
        console.log('filterRepos func, filtersArray= ', filtersArray)
        //We dont change repos that we get from xhr instead we change its copy newRepos
        let newRepos = repos;
        if (filtersArray.length) { for (let i in filtersArray) {
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
                    newRepos = newRepos.filter((item)=>Date.parse(item.updated_at) >= Date.parse(filtersArray[i].value));
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
        } }
        if (sortsArray.length) {for (let i in sortsArray) {
            console.log('Working on sort switch...,  sortsArray= ',sortsArray)
            switch(sortsArray[i].name){
                case 'name':
                    switch(this.state.sorts.sortOrderType){
                        case true:
                        newRepos = newRepos.sort((a,b)=>{
                        if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    })
                    break;
                        case false:
                            newRepos = newRepos.sort((a,b)=>{
                                if(a.name.toLowerCase() < b.name.toLowerCase()) return 1;
                                if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
                            })
                     break;
                     } break;
                case 'stargazers_count':
                    switch(this.state.sorts.sortOrderType){
                        case true:
                            newRepos = newRepos.sort((a,b)=>{
                                let x = parseInt(a.stargazers_count);
                                let y = parseInt(b.stargazers_count);
                                if(x < y) return 1;
                                if (x > y) return -1;
                            })
                            break;
                        case false:
                            newRepos = newRepos.sort((a,b)=>{
                                const x = parseInt(a.stargazers_count);
                                const y = parseInt(b.stargazers_count);
                                if(x > y) return 1;
                                if (x < y) return -1;
                            })
                        break;
                    } break;
                case 'open_issues_count':
                switch(this.state.sorts.sortOrderType){
                    case true:
                        newRepos = newRepos.sort((a,b)=>{
                            let x = parseInt(a.open_issues_count);
                            let y = parseInt(b.open_issues_count);
                            if(x < y) return 1;
                            if (x > y) return -1;
                        })
                        break;
                    case false:
                        newRepos = newRepos.sort((a,b)=>{
                            const x = parseInt(a.open_issues_count);
                            const y = parseInt(b.open_issues_count);
                            if(x > y) return 1;
                            if (x < y) return -1;
                        })
                        break;
                } break;
                case 'updated_at':
                    switch(this.state.sorts.sortOrderType){
                        case true:
                            newRepos = newRepos.sort((a,b)=>{
                                let x = parseInt(Date.parse(a.updated_at));
                                let y = parseInt(Date.parse(b.updated_at));
                                if(x < y) return 1;
                                if (x > y) return -1;
                            })
                            break;
                        case false:
                            newRepos = newRepos.sort((a,b)=>{
                                const x = parseInt(Date.parse(a.updated_at));
                                const y = parseInt(Date.parse(b.updated_at));
                                if(x > y) return 1;
                                if (x < y) return -1;
                            })
                            break;
                    } break;
            }
        }}
        else console.log('Filter and Sorts arrays are empty');

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



    openModal(evt) {
        console.log(evt.target.parentNode)
        console.log(evt.target.children)
        console.log('Open modal func')
        let modalRepoName;
        const target = evt.target
        if (target.children.length != 0){
            console.log('div')
            modalRepoName =target.firstChild.firstChild.getAttribute('value')
        }
        else {
            console.log('li')
            modalRepoName=target.parentNode.firstChild.getAttribute('value')
        }
        console.log(modalRepoName)
        this.setState({modalIsOpen: true,modalRepoName});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
         //this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }


    render(){
        const customStyles = {
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
            }
        };
        console.log('%c Rendering App...','background: #222; color: red')
        console.log('%c App state ','background: #222; color: #bada55', this.state);
        let enabledFilters = this.state.filters.filter((item)=>item.enabled===true);
        let enabledSort = this.state.sorts.sortType.filter((item)=>item.enabled===true);
        console.log('enabledFilters',enabledFilters);
        console.log('enabledSort',enabledSort);
        let filteredRepos = (enabledFilters.length || enabledSort.length) ? this.filterRepos(this.state.repos, enabledFilters, enabledSort): this.state.repos;
        console.log('filteredRepos ', filteredRepos);
        //if error change null to []
        return (
            <div className={styles.appContainer}>
            <div id='search' className={styles.searchContainer}>
                <Search
                updateRepos = {this.updateRepos}
                clearFilters = {this.clearFilters}
                />
            </div>
                <div className={styles.filterContainer}>
                <div id="filters">
                    {this.state.showFilters ? <Filters
                        updateFilter = {this.updateFilter}
                        filters = {this.state.filters}
                        languages = {this.state.languages}
                    /> : null}
                </div>
                <div id="sort">
                    {this.state.showSort ? <Sort
                        updateSort = {this.updateSort}
                        updateOrder = {this.updateOrder}
                        sorts= {this.state.sorts.sortType}
                        order={this.state.sorts.sortOrderType}
                    /> : null}
                </div>
                </div>
                <div id='result' className={styles.resultContainer}>
                {this.state.showResults ? <Result
                    repos  = {filteredRepos}
                    openModal = {this.openModal}
                    modalIsOpen = {this.state.modalIsOpen}
                    subtitleApp = {this.state.subtitle}
                    closeModal = {this.closeModal}
                    afterOpenModal = {this.afterOpenModal}
                    modalRepoName = {this.state.modalRepoName}
                /> : null}
                </div>
                <div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        contentLabel="Card Modal Example"
                        onRequestClose={this.closeModal}
                        style={customStyles}
                    >
                        <RepoDialog
                            repos  = {filteredRepos}
                            modalRepoName = {this.state.modalRepoName}
                            closeModal = {this.closeModal}
                        />
                    </Modal>
                </div>
                <div>
                </div>
            </div>
        );
    }
}