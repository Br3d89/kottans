import React, {Component} from 'react';
import styles from './styles.css'
import fetch from 'isomorphic-fetch'

export default class RepoDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            allReady: false,
            linkToRepoGit:'',
            linkToFork:'',
            comments:''
        }

        this.getDialogData=this.getDialogData.bind(this);
        this.renderLinkToFork= this.renderLinkToFork.bind(this);
        this.renderContribTable = this.renderContribTable.bind(this);
        this.renderLanguageTable = this.renderLanguageTable.bind(this);
        this.renderTopCommented = this.renderTopCommented.bind(this);
        this.renderDialogData=this.renderDialogData.bind(this);


        //this.topPr = this.topPr.bind(this);
    }

    getDialogData(){
        console.log('Running func getDialogData');
        let urls = []
        const result = {}
        const {repos,modalRepoName} = this.props;
        const repoObject = repos.filter((item) => item.name === modalRepoName)[0];
        const linkToRepo = repoObject.url;
        const linkToRepoGit = repoObject.html_url;
        //const linkToPulls = repoObject.parent.pulls_url

        const contributorsUrl = repoObject.contributors_url + '?sort=popularity&direction=desc&per_page=3';
        const languagesUrl = repoObject.languages_url;
        const commentsUrl = linkToRepo+'/pulls?sort=popularity&direction=desc&per_page=5';
        urls.push(contributorsUrl,languagesUrl,commentsUrl)
        const linkToFork = repoObject.fork? urls.push(linkToRepo) : console.log('not fork');


        console.log('Starting Promise')
        Promise.all(urls.map(url =>
            fetch(url).then(resp => resp.json())
        )).then(data => {
             console.log('Data= ',data);
             this.setState({allReady:true,data, linkToRepoGit, linkToFork });
         },
            error => alert("Ошибка: " + error.message) // Ошибка: Not Found
         )
        console.log('Finished Promise, result=',this.state.data)
    }

    renderLinkToFork(){
      const forkGitUrl = this.state.data[3].parent.html_url
        console.log('forkGitUrl=',forkGitUrl)
        return forkGitUrl
    }

    renderContribTable(){
        const topContributors = this.state.data[0].map((item,index)=>{
            return (
                <li key={'contribLi'+index} className={styles.topContrib}>
                    <img className={styles.avatars} src={item.avatar_url} />
                    <span>
                        <span>{item.login} | {item.contributions} </span>
                        <a href={item.url}>{item.url}  </a>
                    </span>
                </li>
            )
        })
        return topContributors
    }

    renderLanguageTable() {
        const topLanguageArr = this.state.data[1];
        let items = Object.keys(topLanguageArr).map(function (key) {
                return [key, topLanguageArr[key]];
            });
        let itemsKb = items.filter((item) => item[1] > 1000)
            if (itemsKb.length) {
                itemsKb.sort(function (first, second) {
                    return second[1] - first[1]
                })
                }
                else {
            return;
            }
        let topLanguages = items.map((value,index) => {
            return (<li key={'languageLi'+index}>{value[0]} : {Math.round((parseFloat(value[1]))/1024) +' KB'}</li>)
        })
        return (
            <div className={styles.dialogSpace}>
                <span className={styles.dialogTitles}>Languages:</span>
                {topLanguages}
            </div>
            )
    }

    renderTopCommented(){
        const topComments = this.state.data[2].map((item,index)=>{
            return (
                <li key={index+'comment'}>{item.title} <a href={item.html_url}>{item.html_url}</a></li>
            )
        })
        return topComments
    }

    renderDialogData(){
        const {closeModal} = this.props
        return (
            <div className={styles.dialogContainerIn}>
                <img onClick={closeModal} src={require('../static/close.png')} className={styles.closeBtn} height="50" width="50"/>
            <ul className={styles.result}>
                <li key="linkToRepoGit"><span className={styles.dialogTitles}>Link to repo:</span> <a href={this.state.linkToRepoGit}>{this.state.linkToRepoGit}</a></li>
                {this.state.linkToFork? <li key="linkToFork"><span className={styles.dialogTitles}>Link to source: </span>  <a href={this.renderLinkToFork()}>{this.renderLinkToFork()}</a></li>: null }

                <div className={styles.dialogSpace}>
                <span className={styles.dialogTitles}>Contributors: </span>
                {this.renderContribTable()}
                </div>

                {this.renderLanguageTable()}

                {this.state.data[2].length ?
                <div className={styles.dialogSpace}>
                    <span className={styles.dialogTitles}>Most commented:</span>
                {this.renderTopCommented()}
                </div>: null}
            </ul>
            </div>
        )
    }


    render() {
        console.log('Rendering RepoDialog component...', this.state)
        this.state.allReady ? console.log('Allready rendering') : this.getDialogData();
        return (
            <div className={styles.dialogContainerOut}>
        {this.state.allReady ? this.renderDialogData() : <img width='100' height='100' src={require('../static/loading.gif')}/>}
        </div>
        )
    }
}