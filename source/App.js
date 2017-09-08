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
            test:false,
            repos: [],
            languages: [],
            searchName: '',
            showFilters: false,
            showResults: false,
            showSort: false,
            showFilterContainer:false,
            modalIsOpen: false,
            nextLink:'',
            searchString:'',
            rendModal: false,
            repoIsLoading:false,
            modalRepoName:'',
            scrollHasMore:false,
            pageCount:0,
            test:false,
            page:0,
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
                has_topics:{
                    enabled: false,
                    value: true
                },
                starred:{
                    enabled: false,
                    value: '0'
                },
                updated:{
                    enabled: false,
                    value: '0'
                },
                type:{
                    enabled: false,
                    value: ''
                },
                language:{
                    enabled: false,
                    value: ''
                }
            },
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
            },
            sort1: {
                order: true,
                name: {
                    enabled: false,
                    description: 'Repo name',
                },
                stargazers_count:{
                    enabled: false,
                    description: 'Stars count',
                },
                open_issues_count:{
                    enabled: false,
                    description: 'Open issues cunt',
                },
                updated_at:{
                    enabled: false,
                    description: 'Updated date',
                }

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
        this.loadMore = this.loadMore.bind(this);
        this.loadRepos = this.loadRepos.bind(this);
        this.updateHistory = this.updateHistory.bind(this);
        this.fetchRepos = this.fetchRepos.bind(this);
    }

    loadRepos= (searchString, action='loadRepos') => {
        searchString ? this.setState({repoIsLoading:true}): '';
        console.log(`Searching...${searchString}`);
        let url='';
        switch(action) {
            case 'loadMore':
                // url = searchString;
                // searchString = this.state.searchString;
                searchString = this.state.searchString;
                url = this.state.nextLink;
                break;
            case 'loadQuery':
                searchString = searchString.match.params.searchString
                url = `https://api.github.com/users/${searchString}/repos?per_page=100`
                break;
            case 'loadRepos':
                url = `https://api.github.com/users/${searchString}/repos?per_page=100`

        }
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Accept', 'application/vnd.github.mercy-preview+json');
        xhr.send();
        let self = this
        console.log(xhr.readyState);
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                // alert(xhr.status + ': ' + xhr.statusText);
                self.setState({error: true})
                setTimeout(() => {
                    self.setState({error: false})
                }, 2000)
            } else {
                let data = JSON.parse(xhr.responseText);
                let nextUrl = xhr.getResponseHeader("Link");
                self.updateRepos(data,nextUrl,searchString);

            }
        }

    }

     fetchRepos(searchString) {
        let result;
        fetch('searchString')
             .then(function(response) {
                 return response.json();
             })
             .then(function(data) {
                 result=data;
             })
             .catch( alert );
        setTimeout(()=>result,2000);
     }


    updateRepos(repos, nextUrl, searchString) {
        console.log('Updating user ', searchString)
        let state = this.state;
        state.searchString=searchString;
        state.repos=repos;
        state.repoIsLoading=false;
        state.nextLink = nextUrl ? nextUrl.split(',')[0].split(';')[0].slice(1, -1) : '';
        const nextLinkRel = nextUrl ? nextUrl.split(',')[0].split(';')[1].split('"')[1] : '';
        state.scrollHasMore = (nextLinkRel === 'first') || (nextLinkRel === "") ? false : true;
        //this is for infinite loading, don't delete!!!
        // const newRepos = (this.state.searchString !== searchString) || (this.state.nextLink === nextLink) ? repos: oldRepos.concat(repos);
        state.languages = (repos.length >= 1) ? this.languageArr(repos) : [];
        state.showFilterContainer = (repos.length >= 1) ? true : false;
        state.showResults = (repos.length >= 1) ? true : false;
        // const queryParameters = searchString.location.search ? searchString.location.search: this.setState(state);
        // const queryObject = queryString.parse(queryParameters);
        // for (let i in queryObject) {
        //     switch (i) {
        //         case 'sort':
        //             const sortObject= state.sort1[queryObject[i]];
        //             sortObject.enabled = true;
        //             break;
        //         case 'order':
        //             state.sort1.order = queryObject[i];
        //             break;
        //         case 'page':
        //             state.page = queryObject[i];
        //             break;
        //         case 'has_issues':
        //             state.filters1.has_issues.enabled = true;
        //             break;
        //         case 'has_topics':
        //             state.filters1.has_topics.enabled = true;
        //             break;
        //         case 'starred':
        //             state.filters1.starred.enabled = true;
        //             state.filters1.starred.value = queryObject[i];
        //             break;
        //         case 'type':
        //             state.filters1.type.enabled = true;
        //             state.filters1.type.value = queryObject[i];
        //             break;
        //         case 'language':
        //             state.filters1.language.enabled = true;
        //             state.filters1.language.value = queryObject[i];
        //             break;
        //     }
        //     ;
        //
        // }
        this.setState(state);
    }


    updateHistory (value){
        console.log('updateHistory function running')
        this.props.history.push(this.props.match.params.searchString ? '&'+value : value)
        console.log('finish');
        // this.loadRepos(value);
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
                    console.log('has_issues before case, newRepos= ', newRepos)
                    newRepos = newRepos.filter((item) => item.has_issues === true);
                    console.log('has_issues after case, newRepos= ', newRepos)
                    break;
                case 'has_topics':
                    console.log('has_topics before case, newRepos= ', newRepos)
                    newRepos = newRepos.filter((item) => item.topics.length > 0);
                    break;
                case 'starred':
                    console.log('starred before case, newRepos= ', newRepos)
                    newRepos = newRepos.filter((item) => item.stargazers_count >= filterSortObject[i]);
                    break;
                case 'updated':
                    console.log('updated before case, newRepos= ', newRepos)
                    newRepos = newRepos.filter((item) => Date.parse(item.updated_at) >= Date.parse(filterSortObject[i]));
                    break;
                case 'type':
                    console.log('type before case, newRepos= ', newRepos)
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
                    break;
                case 'language':
                    console.log('language before case, newRepos= ', newRepos)
                    newRepos = newRepos.filter((item) => item.language === filterSortObject[i]);
                    break;
                case 'name':
                    switch (orderType) {
                        case false:
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
                    switch (this.state.sorts.sortOrderType) {
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
            }
        }
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

    loadMore(page)    {
        console.log('load more func if statement, page=', page)
        // let action = 'loadMore';
        // let searchString = this.state.nextLink;
        let newPage = 'page='+page
        this.updateHistory(newPage);
        // this.loadRepos('', 'loadMore');
       }

    // componentDidMount(){
    //     console.log('component did mount')
    // }

    // componentDidUpdate(){
    //     console.log('component did update', this.props)
    // //     this.props.match.params.searchString ? this.loadRepos(this.props.match.params.searchString):'';
    //  }

    shouldComponentUpdate(nextProps, nextState){
        return this.state.searchString !== nextProps.match.params.searchString ? false: true;
        console.log('should component update props,nextprops,nextstate,prevState', this.props,nextProps, nextState,this.state)
    }

    // componentWillUnmount(){
    //     console.log('component will unmount', this.props)
    // }

    // componentWillUpdate(){
    //     console.log('component will update', this.props)
    // }

    componentWillMount(){
        console.log('component will mount',this.props);
        this.props.match.params.searchString ? this.loadRepos(this.props.match.params.searchString) : '';
    }

    componentWillReceiveProps(nextProps){
        console.log('component will receive props NextProps=',nextProps, this.props)
        // nextProps.match.params.searchString &&(this.props.match.params.searchString !== nextProps.match.params.searchString) ? this.loadRepos(nextProps.match.params.searchString):'';
        console.log(this.state);
        nextProps.match.params.searchString ? this.loadRepos(nextProps, 'loadQuery'):this.updateRepos([],'','');
        //nextProps.location

    }



    render(){
        console.log('%c Rendering App...','background: #222; color: red',this.state, this.props);
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
        console.log('This props=',this.props);
        const queryObject = this.props.location.search ? queryString.parse(this.props.location.search): '';
        // let enabledFilters = this.state.filters.filter((item)=>item.enabled===true);
        // let enabledSort = this.state.sorts.sortType.filter((item)=>item.enabled===true);
        // let filteredRepos = (enabledFilters.length || enabledSort.length) ? this.filterRepos(this.state.repos, enabledFilters, enabledSort): this.state.repos;
        let filteredRepos = (queryObject && this.state.repos.length) ? this.filterRepos(queryObject): this.state.repos;
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
                    />) : <img src={require('../static/loading.gif')}/> }
                    {this.state.showFilterContainer ?
                         <div className={styles.filterContainer}>
                             <Filters
                                updateFilter = {this.updateFilter}
                                filters = {this.state.filters}
                                languages = {this.state.languages}
                             />
                             <Sort
                                 updateSort = {this.updateSort}
                                 updateOrder = {this.updateOrder}
                                 sorts= {this.state.sorts.sortType}
                                 order={this.state.sorts.sortOrderType}
                                 updateHistory = {this.updateHistory}
                             />
                    </div>: null}
              {this.state.showResults ?
                  <div  className={styles.resultContainer} >
                  <InfiniteScroll
                      pageStart={0}
                      loadMore={this.loadMore}
                      hasMore={this.state.scrollHasMore}
                      loader={<div className="loader">Loading ...</div>}
                      useWindow={false}
                      initialLoad={false}
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

                    {this.state.error && (
                        <div>
                            error motherfucker
                        </div>
                    )}
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
            );
    }
}

export default withRouter(App);