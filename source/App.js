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
            repos: [],
            languages: [],
            showResults: false,
            showFilterContainer: false,
            modalIsOpen: false,
            nextLink: '',
            searchString: '',
            repoIsLoading: false,
            modalRepoName: '',
            scrollHasMore: false,
            sorts: {
                sortType: [
                    {
                        name: 'name',
                        description: 'Repo name',
                    },
                    {
                        name: 'stargazers_count',
                        description: 'Stars count',
                    },
                    {
                        name: 'open_issues_count',
                        description: 'Open issues count',
                    },
                    {
                        name: 'updated_at',
                        description: 'Updated date',
                    }
                ]
            },
        };
        this.updateRepos = this.updateRepos.bind(this);
        this.filterRepos = this.filterRepos.bind(this);
        this.languageArr = this.languageArr.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.loadRepos = this.loadRepos.bind(this);
        this.updateHistory = this.updateHistory.bind(this);
        this.updateError = this.updateError.bind(this);
    }

    loadRepos = (searchString, action = 'loadRepos') => {
        let url = '';
        let newRepos;
        switch (action) {
            case 'loadMore':
                url = `https://api.github.com/users/${this.state.searchString}/repos?per_page=100&${searchString}`
                this.setState({scrollHasMore:false});
                break;
            case 'loadQuery':
                url = `https://api.github.com/users/${searchString}/repos?per_page=100`
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
            } else {
                let data = JSON.parse(xhr.responseText);
                data = action==='loadMore' ? (newRepos=self.state.repos, newRepos.concat(data)): data;
                action ==='loadMore' ? self.updateHistory(searchString):'';
                let nextUrl = xhr.getResponseHeader("Link");
                action==='loadMore' ? self.updateRepos(data, nextUrl, self.state.searchString) : self.updateRepos(data, nextUrl, searchString);

            }
        }

    }

    updateError(statusCode, searchString) {
        let state = this.state;
        state.repoIsLoading = false;
        state.searchString = searchString;
        state.error = true;
        state.errorText = statusCode.status + ': ' + statusCode.statusText;
        this.setState(state);
        setTimeout(() => {
            this.updateHistory('','search');
        }, 2000)

    }

    updateRepos(repos, nextUrl, searchString) {
        let state = this.state;
        state.searchString = searchString;
        state.repos = repos;
        state.repoIsLoading = false;
        state.error = false;
        state.nextLink = nextUrl ? nextUrl.split(',')[0].split(';')[0].slice(1, -1) : '';
        const nextLinkRel = nextUrl ? nextUrl.split(',')[0].split(';')[1].split('"')[1] : '';
        state.scrollHasMore = (nextLinkRel === 'first') || (nextLinkRel === "") ? false : true;
        state.languages = (repos.length >= 1) ? this.languageArr(repos) : [];
        state.showFilterContainer = (repos.length >= 1) ? true : false;
        state.showResults = (repos.length >= 1) ? true : false;
        this.setState(state);
    }

    updateHistory(value, source='') {
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

    filterRepos(filterSortObject) {
        let newRepos = this.state.repos;
        const orderType=filterSortObject.order;
        for (let i in filterSortObject) {
            switch (i) {
                case 'has_issues':
                    newRepos = newRepos.filter((item) => item.has_issues === true);
                    break;
                case 'has_topics':
                    newRepos = newRepos.filter((item) => item.topics.length > 0);
                    break;
                case 'starred_gt':
                    newRepos = newRepos.filter((item) => item.stargazers_count >= filterSortObject[i]);
                    break;
                case 'updated':
                    newRepos = newRepos.filter((item) => Date.parse(item.updated_at) >= Date.parse(filterSortObject[i]));
                    break;
                case 'type':
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
                    newRepos = newRepos.filter((item) => item.language === filterSortObject[i]);
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
    return langArr = [...new Set(newRepos.map((value)=>value.language).filter((value)=>value!=null))];
    return langArr;
    }

    openModal(modalRepoName) {
        this.setState({modalIsOpen: true, modalRepoName});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    loadMore(page)    {
        this.loadRepos('page='+(parseInt(page)+1), 'loadMore');
       }

    componentWillMount(){
        this.props.match.params.searchString ? this.loadRepos(this.props.match.params.searchString) : '';
    }

    componentWillReceiveProps(nextProps){
        const matchSearchString = nextProps.match.params.searchString;
        const locationSearch = nextProps.location.search;
        if (matchSearchString) {
            //only for clear search of new user
            if (locationSearch.length===0){
                //load repos for new user
                this.updateRepos([],'','');
                this.loadRepos(matchSearchString);
            }
        }
        //clear state
        else {
            this.updateRepos([],'','');
        }
    }


    render(){
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
                maxWidth              :  '40%',
                maxHeight             :  '60%',
            },
        };
        const queryObject = this.props.location.search ? queryString.parse(this.props.location.search): '';
        let filteredRepos = !!(this.props.location.search.length && this.state.repos.length) ? this.filterRepos(queryObject): this.state.repos;
        let filteredLanguages = (this.props.location.search.indexOf('language'))? this.state.languages: this.languageArr(filteredRepos);
        return (
            <div className={[styles.appContainer, !this.state.repos.length ? styles.__noData : ''].join(' ')}>
                {!this.state.repoIsLoading ? (
                <Search
                    reposLength = {this.state.repos.length}
                    updateHistory = {this.updateHistory}
                    error = {this.state.error}
                    errorText = {this.state.errorText}
                    />
                ) : <img width='50' height='50' src={require('../static/loading.gif')}/> }

                    {this.state.showFilterContainer ?
                         <div className={styles.filterContainer}>
                             <Filters
                                languages = {filteredLanguages}
                                queryObject = {queryObject}
                                updateHistory = {this.updateHistory}
                             />
                             <Sort
                                 sorts= {this.state.sorts.sortType}
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
                      />
                      {!filteredRepos.length? <span>No repos found</span>:null}
                  </InfiniteScroll> </div>
                  : null}
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