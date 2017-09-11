import React, {Component} from 'react';
import Search from './Search';
import Result from './Result';
import Filters from './Filters';
import Sort from './Sort';
import styles from './styles.css'
import Modal from 'react-modal';
import RepoDialog from './RepoDialog'
import InfiniteScroll from 'react-infinite-scroller';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorText: '',
            test: false,
            repos: [],
            languages: [],
            searchName: '',
            showFilters: false,
            showResults: false,
            showSort: false,
            showFilterContainer: false,
            modalIsOpen: false,
            nextLink: '',
            searchString: '',
            rendModal: false,
            repoIsLoading: false,
            modalRepoName: '',
            scrollHasMore: false,
            scrollIsLoading:false,
            pageCount: 0,
            test: false,
            page: 0,
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
            filters1: {
                has_issues: {
                    enabled: false,
                    value: true,
                },
                has_topics: {
                    enabled: false,
                    value: true
                },
                starred: {
                    enabled: false,
                    value: '0'
                },
                updated: {
                    enabled: false,
                    value: '0'
                },
                type: {
                    enabled: false,
                    value: ''
                },
                language: {
                    enabled: false,
                    value: ''
                }
            },
            sorts: {
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
            },
            sort1: {
                order: true,
                name: {
                    enabled: false,
                    description: 'Repo name',
                },
                stargazers_count: {
                    enabled: false,
                    description: 'Stars count',
                },
                open_issues_count: {
                    enabled: false,
                    description: 'Open issues cunt',
                },
                updated_at: {
                    enabled: false,
                    description: 'Updated date',
                }

            }
        };
        this.subtitle = '';
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
        this.loadMore = this.loadMore.bind(this);
        this.loadRepos = this.loadRepos.bind(this);
        this.updateHistory = this.updateHistory.bind(this);
        this.fetchRepos = this.fetchRepos.bind(this);
        this.updateError = this.updateError.bind(this);
    }

    loadRepos = (searchString, action = 'loadRepos') => {
        console.log('Searching...');
        let url = '';
        let newRepos;
        switch (action) {
            case 'loadMore':
                // url = searchString;
                // searchString = this.state.searchString;
                // searchString = this.state.searchString;
                // url = `https://api.github.com/users/${searchString.user}/repos?per_page=100&page=${searchString.page}`
                // let page = searchString.page;
                // searchString = searchString.user;
                url = `https://api.github.com/users/${this.state.searchString}/repos?per_page=100&${searchString}`
                this.setState({scrollHasMore:false});
                // this.setState({page:searchString.page});
                // url = this.state.nextLink;
                // searchString = searchString.user
                // searchString=this.state.searchString;
                break;
            case 'loadQuery':
                // searchString = searchString.match.params.searchString
                url = `https://api.github.com/users/${searchString}/repos?per_page=100`
                // searchString ? this.setState({repoIsLoading: true}) : '';
                // this.setState({repoIsLoading: true});
                break;
            case 'loadRepos':
                url = `https://api.github.com/users/${searchString}/repos?per_page=100`
                searchString ? this.setState({repoIsLoading: true}) : '';

        }
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Accept', 'application/vnd.github.mercy-preview+json');
        xhr.send();
        let self = this
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                self.updateError(xhr, searchString);
                // self.setState({error: true})
                // setTimeout(() => {
                //     self.setState({error: false})
                // }, 2000)
            } else {
                let data = JSON.parse(xhr.responseText);
                data = action==='loadMore' ? (newRepos=self.state.repos, newRepos.concat(data)): data;
                action ==='loadMore' ? self.updateHistory(searchString):'';
                let nextUrl = xhr.getResponseHeader("Link");
                action==='loadMore' ? self.updateRepos(data, nextUrl, self.state.searchString) : self.updateRepos(data, nextUrl, searchString);

            }
        }

    }

    fetchRepos(searchString) {
        let result;
        fetch('searchString')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                result = data;
            })
            .catch(alert);
        setTimeout(() => result, 2000);
    }

    updateError(statusCode, searchString) {
        console.log('UpdateError func is running, statusCode=', statusCode)
        let state = this.state;
        state.repoIsLoading = false;
        state.searchString = searchString;
        state.error = true;
        state.scrollIsLoading= false;
        state.errorText = statusCode.status + ': ' + statusCode.statusText;
        this.setState(state);
        // this.setState({error: true, searchString});
        // alert(statusCode);
        // this.updateHistory('','search')
        // setTimeout(() => {
        //     this.setState({error: false});
        // }, 2000)
        setTimeout(() => {
            this.updateHistory('','search');
        }, 2000)

    }

    updateRepos(repos, nextUrl, searchString) {
        console.log('Updating user ', searchString)
        let state = this.state;
        state.searchString = searchString;
        state.repos = repos;
        state.repoIsLoading = false;
        state.error = false;
        // state.scrollIsLoading = false;
        // state.page= nextUrl ? parseInt(queryString.parse(nextUrl.split(',')[0].split(';')[0].slice(1,-1).split('?')[1].split('&')[1]).page)-1 :'';
        state.nextLink = nextUrl ? nextUrl.split(',')[0].split(';')[0].slice(1, -1) : '';
        const nextLinkRel = nextUrl ? nextUrl.split(',')[0].split(';')[1].split('"')[1] : '';
        state.scrollHasMore = (nextLinkRel === 'first') || (nextLinkRel === "") ? false : true;
        state.languages = (repos.length >= 1) ? this.languageArr(repos) : [];
        state.showFilterContainer = (repos.length >= 1) ? true : false;
        state.showResults = (repos.length >= 1) ? true : false;
        this.setState(state);
    }

    updateHistory(value, source='') {
        console.log('updateHistory function running', this.props, !!this.props.match.params.searchString)
        console.log('State=',this.state);
        switch (source) {
            case 'search':
                this.props.history.push(value);
                break;
            default:
                let qString = queryString.parse(this.props.location.search)
                let newValueQ = queryString.parse('?'+value);
                if (value in qString) {
                    delete qString[value];
                    newValueQ = {}
                }
                let newObject = Object.assign({},qString,newValueQ);
                let newQString = queryString.stringify(newObject);
                const searchString = this.props.match.params.searchString;
                const pushInfo = searchString + (newQString ? ('?'+newQString): newQString);
                this.props.history.push(pushInfo);
        }
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

    // filterRepos(repos,filtersArray,sortsArray) {
    //     console.log('filterRepos func, filtersArray= ', filtersArray)
    //     //We dont change repos that we get from xhr instead we change its copy newRepos
    //     let newRepos = repos;
    //     if (filtersArray.length) { for (let i in filtersArray) {
    //         switch(filtersArray[i].name){
    //             case 'has_issues':
    //                 console.log('has_issues before case, newRepos= ',newRepos)
    //                 newRepos = newRepos.filter((item)=>item.has_issues===true);
    //                 console.log('has_issues after case, newRepos= ',newRepos)
    //                 break;
    //             case 'has_topics':
    //                 console.log('has_topics before case, newRepos= ',newRepos)
    //                 newRepos = newRepos.filter((item)=>item.topics.length > 0);
    //                 break;
    //             case 'starred':
    //                 console.log('starred before case, newRepos= ',newRepos)
    //                 newRepos = newRepos.filter((item)=>item.stargazers_count >= filtersArray[i].value);
    //                 break;
    //             case 'updated':
    //                 console.log('updated before case, newRepos= ',newRepos)
    //                 newRepos = newRepos.filter((item)=>Date.parse(item.updated_at) >= Date.parse(filtersArray[i].value));
    //                 break;
    //             case 'type':
    //                 console.log('type before case, newRepos= ',newRepos)
    //                 newRepos = newRepos.filter((item)=>{
    //                     switch(filtersArray[i].value){
    //                         case 'forked':
    //                             return item.fork===true;
    //                         case 'sources':
    //                             return item.fork===false;
    //                         default:
    //                             return true;
    //                     }
    //                     item.fork === filtersArray[i].value});
    //                 break;
    //             case 'language':
    //                 console.log('language before case, newRepos= ',newRepos)
    //                 newRepos = newRepos.filter((item)=>item.language === filtersArray[i].value);
    //                 break;
    //         }
    //     } }
    //     if (sortsArray.length) {for (let i in sortsArray) {
    //         console.log('Working on sort switch...,  sortsArray= ',sortsArray)
    //         switch(sortsArray[i].name){
    //             case 'name':
    //                 switch(this.state.sorts.sortOrderType){
    //                     case true:
    //                     newRepos = newRepos.sort((a,b)=>{
    //                     if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    //                     if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    //                 })
    //                 break;
    //                     case false:
    //                         newRepos = newRepos.sort((a,b)=>{
    //                             if(a.name.toLowerCase() < b.name.toLowerCase()) return 1;
    //                             if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
    //                         })
    //                  break;
    //                  } break;
    //             case 'stargazers_count':
    //                 switch(this.state.sorts.sortOrderType){
    //                     case true:
    //                         newRepos = newRepos.sort((a,b)=>{
    //                             let x = parseInt(a.stargazers_count);
    //                             let y = parseInt(b.stargazers_count);
    //                             if(x < y) return 1;
    //                             if (x > y) return -1;
    //                         })
    //                         break;
    //                     case false:
    //                         newRepos = newRepos.sort((a,b)=>{
    //                             const x = parseInt(a.stargazers_count);
    //                             const y = parseInt(b.stargazers_count);
    //                             if(x > y) return 1;
    //                             if (x < y) return -1;
    //                         })
    //                     break;
    //                 } break;
    //             case 'open_issues_count':
    //             switch(this.state.sorts.sortOrderType){
    //                 case true:
    //                     newRepos = newRepos.sort((a,b)=>{
    //                         let x = parseInt(a.open_issues_count);
    //                         let y = parseInt(b.open_issues_count);
    //                         if(x < y) return 1;
    //                         if (x > y) return -1;
    //                     })
    //                     break;
    //                 case false:
    //                     newRepos = newRepos.sort((a,b)=>{
    //                         const x = parseInt(a.open_issues_count);
    //                         const y = parseInt(b.open_issues_count);
    //                         if(x > y) return 1;
    //                         if (x < y) return -1;
    //                     })
    //                     break;
    //             } break;
    //             case 'updated_at':
    //                 switch(this.state.sorts.sortOrderType){
    //                     case true:
    //                         newRepos = newRepos.sort((a,b)=>{
    //                             let x = parseInt(Date.parse(a.updated_at));
    //                             let y = parseInt(Date.parse(b.updated_at));
    //                             if(x < y) return 1;
    //                             if (x > y) return -1;
    //                         })
    //                         break;
    //                     case false:
    //                         newRepos = newRepos.sort((a,b)=>{
    //                             const x = parseInt(Date.parse(a.updated_at));
    //                             const y = parseInt(Date.parse(b.updated_at));
    //                             if(x > y) return 1;
    //                             if (x < y) return -1;
    //                         })
    //                         break;
    //                 } break;
    //         }
    //     }}
    //     else console.log('Filter and Sorts arrays are empty');
    //
    //     console.log('newRepos= ',newRepos);
    //     return newRepos;
    // }

    filterRepos(filterSortObject) {
        console.log('filterRepos func, filtersArray= ', filterSortObject)
        let newRepos = this.state.repos;
        const orderType=filterSortObject.order;
        for (let i in filterSortObject) {
            switch (i) {
                case 'has_issues':
                    console.log('has_issues before case, newRepos= ', newRepos);
                    newRepos = newRepos.filter((item) => item.has_issues === true);
                    console.log('has_issues after case, newRepos= ', newRepos);
                    break;
                case 'has_topics':
                    console.log('has_topics before case, newRepos= ', newRepos);
                    newRepos = newRepos.filter((item) => item.topics.length > 0);
                    console.log('has_topics after case, newRepos= ', newRepos);
                    break;
                case 'starred_gt':
                    console.log('starred before case, newRepos= ', newRepos);
                    newRepos = newRepos.filter((item) => item.stargazers_count >= filterSortObject[i]);
                    console.log('starred after case, newRepos= ', newRepos);
                    break;
                case 'updated':
                    console.log('updated before case, newRepos= ', newRepos);
                    newRepos = newRepos.filter((item) => Date.parse(item.updated_at) >= Date.parse(filterSortObject[i]));
                    console.log('updated after case, newRepos= ', newRepos);
                    break;
                case 'type':
                    console.log('type before case, newRepos= ', newRepos);
                    newRepos = newRepos.filter((item) => {
                        switch (filterSortObject[i]) {
                            case 'forked':
                                return item.fork === true;
                            case 'sources':
                                return item.fork === false;
                            default:
                                return true;
                        }
                        item.fork === filterSortObject[i]
                    });
                    console.log('type after case, newRepos= ', newRepos);
                    break;
                case 'language':
                    console.log('language before case, newRepos= ', newRepos);
                    newRepos = newRepos.filter((item) => item.language === filterSortObject[i]);
                    console.log('language after case, newRepos= ', newRepos);
                    break;
                case 'sort':
                    switch(filterSortObject['sort']) {
                        case 'name':
                            switch (orderType) {
                                case 'desc':
                                    newRepos = newRepos.sort((a, b) => {
                                        if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
                                        if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
                                    })
                                    break;
                                default:
                                    newRepos = newRepos.sort((a, b) => {
                                        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                                        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                                    })
                            }
                            break;
                        case 'stargazers_count':
                            switch (orderType) {
                                case 'desc':
                                    newRepos = newRepos.sort((a, b) => {
                                        const x = parseInt(a.stargazers_count);
                                        const y = parseInt(b.stargazers_count);
                                        if (x > y) return 1;
                                        if (x < y) return -1;
                                    })
                                    break;
                                default :
                                    newRepos = newRepos.sort((a, b) => {
                                        let x = parseInt(a.stargazers_count);
                                        let y = parseInt(b.stargazers_count);
                                        if (x < y) return 1;
                                        if (x > y) return -1;
                                    })
                            }
                            break;
                        case 'open_issues_count':
                            switch (orderType) {
                                case 'desc':
                                    newRepos = newRepos.sort((a, b) => {
                                        const x = parseInt(a.open_issues_count);
                                        const y = parseInt(b.open_issues_count);
                                        if (x > y) return 1;
                                        if (x < y) return -1;
                                    })
                                    break;
                                default:
                                    newRepos = newRepos.sort((a, b) => {
                                        let x = parseInt(a.open_issues_count);
                                        let y = parseInt(b.open_issues_count);
                                        if (x < y) return 1;
                                        if (x > y) return -1;
                                    })
                            }
                            break;
                        case 'updated_at':
                            switch (orderType) {
                                case 'desc':
                                    newRepos = newRepos.sort((a, b) => {
                                        const x = parseInt(Date.parse(a.updated_at));
                                        const y = parseInt(Date.parse(b.updated_at));
                                        if (x > y) return 1;
                                        if (x < y) return -1;
                                    })
                                    break;
                                default:
                                    newRepos = newRepos.sort((a, b) => {
                                        let x = parseInt(Date.parse(a.updated_at));
                                        let y = parseInt(Date.parse(b.updated_at));
                                        if (x < y) return 1;
                                        if (x > y) return -1;
                                    })
                            }
                            break;
                    } break;
                case 'order':
                    switch (orderType) {
                        case 'desc':
                            newRepos = newRepos.sort((a, b) => {
                                if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
                                if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
                            })
                            break;
                        default:
                            newRepos = newRepos.sort((a, b) => {
                                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                            })
                    }
                    break;
                    }
        }
        return newRepos;
    }

    languageArr(newRepos){
    let langArr = [...new Set(newRepos.map((value)=>value.language).filter((value)=>value!=null))];
    return langArr;
    }

    openModal(modalRepoName) {
        // console.log(evt.target.parentNode)
        // console.log(evt.target.children)
        // console.log('Open modal func')
        // let modalRepoName;
        // const target = evt.target
        // if (target.children.length != 0){
        //     console.log('div')
        //     modalRepoName =target.firstChild.firstChild.getAttribute('value')
        // }
        // else {
        //     console.log('li')
        //     modalRepoName=target.parentNode.firstChild.getAttribute('value')
        // }
        // console.log(modalRepoName)
        this.setState({modalIsOpen: true, modalRepoName});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
         //this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    loadMore(page)    {
        console.log('load more func if statement, page=', page, this.state.scrollHasMore)
        console.log('State=',this.state);
        // this.setState({hasMore:false});
        // this.state.scrollIsLoading?  console.log('Scroll in loading state, do nothing')
        // :this.updateHistory('page='+(parseInt(page)+1));

        // this.setState({scrollIsLoading:true});
        // this.setState({hasMore:false});
        // this.updateHistory('page='+(parseInt(page)+1));
        // let searchString = this.state.nextLink;
        this.loadRepos('page='+(parseInt(page)+1), 'loadMore');
       }


    // shouldComponentUpdate(nextProps, nextState){
    //     console.log('should component update props,nextprops,nextstate,prevState', this.props,nextProps, nextState,this.state)
    //     const searchString = nextProps.match.params.searchString===undefined ? '': nextProps.match.params.searchString;
    //     const shouldValue = this.state.searchString !== searchString;
    //     return shouldValue ? false: true;
    // }

    componentWillMount(){
        console.log('component will mount',this.props);
        this.props.match.params.searchString ? this.loadRepos(this.props.match.params.searchString) : '';
    }

    componentWillReceiveProps(nextProps){
        console.log('component will receive props NextProps=',nextProps, this.props);
        console.log('State=',this.state);
        const matchSearchString = nextProps.match.params.searchString;
        const locationSearch = nextProps.location.search;
        if (matchSearchString) {
            //only for clear search of new user
            if (locationSearch.length===0){
                //load repos for new user
                this.updateRepos([],'','');
                this.loadRepos(matchSearchString);
            }
            // only for loadMore action
            // else if (locationSearch.indexOf('page')) {
            //     {
            //         const newQueryObject = queryString.parse(nextProps.location.search);
            //         const oldQueryObject = queryString.parse(this.props.location.search);
            //         if (newQueryObject.page !== oldQueryObject.page) {
            //             // newQueryObject.user = nextProps.match.params.searchString;
            //             // this.loadRepos(newQueryObject, 'loadMore')
            //             this.loadMore(newQueryObject.page);
            //         }
            //     }
            // }

        }
        //clear state
        else {
            this.updateRepos([],'','');
        }
        // const queryObject = queryString.parse(nextProps.location.search);
        // if (('page' in queryObject) && this.state.page!==queryObject['page']) {
        //     // this.setState({scrollHasMore:false});
        //     queryObject.user = nextProps.match.params.searchString;
        //     this.loadRepos(queryObject, 'loadMore')
        // }
        // if (!nextProps.match.params.searchString) {
        //     this.updateRepos([],'','');
        // }
        // if ((nextProps.location.search.length < this.props.location.search.length) && nextProps.location.pathname) {
        //     return;
        // }
        // (nextProps.match.params.searchString && !nextProps.location.search) ? this.loadRepos(nextProps, 'loadQuery'):
        //     nextProps.match.params.searchString? '': this.updateRepos([],'','');
    }



    render(){
        console.log('%c Rendering App...','background: #222; color: red',this.state);
        const customStyles = {
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)',
                borderRadius          :  '15px',
                boxShadow             : '0 0 5px 5px lightgrey',
                padding               : '5px',
            },
        };
        const queryObject = this.props.location.search ? queryString.parse(this.props.location.search): '';
        let filteredRepos = !!(this.props.location.search.length && this.state.repos.length) ? this.filterRepos(queryObject): this.state.repos;
        let filteredLanguages = (this.props.location.search.indexOf('language'))? this.state.languages: this.languageArr(filteredRepos);
        return (
            <div className={[styles.appContainer, !this.state.repos.length ? styles.__noData : ''].join(' ')}>
                {!this.state.repoIsLoading ? (
                <Search
                    updateRepos = {this.updateRepos}
                    clearFilters = {this.clearFilters}
                    loadRepos = {this.loadRepos}
                    reposLength = {this.state.repos.length}
                    updateHistory = {this.updateHistory}
                    repoIsLoading = {this.state.repoIsLoading}
                    error = {this.state.error}
                    errorText = {this.state.errorText}
                    />
                ) : <img width='50' height='50' src={require('../static/loading.gif')}/> }

                    {this.state.showFilterContainer ?
                         <div className={styles.filterContainer}>
                             <Filters
                                updateFilter = {this.updateFilter}
                                filters = {this.state.filters}
                                languages = {filteredLanguages}
                                queryObject = {queryObject}
                                updateHistory = {this.updateHistory}
                             />
                             <Sort
                                 updateSort = {this.updateSort}
                                 updateOrder = {this.updateOrder}
                                 sorts= {this.state.sorts.sortType}
                                 // order={this.state.sorts.sortOrderType}
                                 order={queryObject.order}
                                 updateHistory = {this.updateHistory}

                             />
                    </div>: null}
              {this.state.showResults ?
                  <div  className={styles.resultContainer} >
                  <InfiniteScroll
                      pageStart={0}
                      loadMore={this.loadMore}
                      hasMore={this.state.scrollHasMore}
                      loader={<div className="loader">
                          <img width='50' height='50' src={require("../static/loading.gif")}/>
                          </div>}
                      useWindow={false}
                      initialLoad={true}

                  >
                      <Result
                          repos  = {filteredRepos}
                          openModal = {this.openModal}
                          modalIsOpen = {this.state.modalIsOpen}
                          subtitleApp = {this.state.subtitle}
                          closeModal = {this.closeModal}
                          afterOpenModal = {this.afterOpenModal}
                          modalRepoName = {this.state.modalRepoName}
                          updateHistory = {this.updateHistory}
                          searchString = {this.state.searchString}
                      />
                      {!filteredRepos.length? <span>No repos found</span>:null}
                  </InfiniteScroll> </div>
                  : null}

                    {/*{this.state.error && (*/}
                        {/*<div>*/}
                            {/*error motherfucker*/}
                        {/*</div>*/}
                    {/*)}*/}
                        <Modal
                            isOpen={this.state.modalIsOpen}
                            contentLabel="Card"
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
            );
    }
}

export default withRouter(App);