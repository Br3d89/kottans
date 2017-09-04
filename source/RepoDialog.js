import React, {Component} from 'react';
import styles from './repoDialog.css'
import Modal from 'react-modal';
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
                <li key={'contribLi'+index}>{item.login} | {item.contributions}<a href={item.url}>{item.url}  <img className={styles.avatars} src={item.avatar_url} /> </a></li>
            )
        })
        return topContributors
    }

    renderLanguageTable() {
        let topLanguage;
        const topLanguageArr = this.state.data[1];
        if (Object.keys(topLanguageArr).length > 1) {
            let items = Object.keys(topLanguageArr).map(function (key) {
                return [key, topLanguageArr[key]];
            });
            let itemsKb = items.filter((item) => item[1] > 1000)
            if (itemsKb.length) {
                itemsKb.sort(function (first, second) {
                    return second[1] - first[1]
                })
                    console.log('ItemsKB=',itemsKb[0])
                    topLanguage = itemsKb[0];
                    console.log('TopLanguage=',topLanguage)
                }
            }
        else {
            topLanguage= Object.keys(topLanguageArr).map(function (key) {return [key, topLanguageArr[key]]})
            }
        return (
            topLanguage.length? <li key="languageLi">Language: {topLanguage[0]} value: {topLanguage[1]}</li> : null
        )
    }

    renderTopCommented(){
        const topComments = this.state.data[2].map((item,index)=>{
            return (
                <li key={index+'comment'}>{item.title}<a href={item.html_url}>{item.html_url}</a></li>
            )
        })
        return topComments
    }

    renderDialogData(){
        const {closeModal} = this.props
        return (
            <div>
                <button onClick={closeModal}>close</button>
            <ul className={styles.result}>
                <li key="linkToRepoGit">link to repo: <a href={this.state.linkToRepoGit}>{this.state.linkToRepoGit}</a></li>
                {this.state.linkToFork? <li key="linkToFork">link to fork's source:  <a href={this.renderLinkToFork()}>{this.renderLinkToFork()}</a></li>: null }
                Contributors table:
                {this.renderContribTable()}
                {this.renderLanguageTable()}
                Most commented:
                {this.renderTopCommented()}
            </ul>
            </div>
        )
    }


    // topPr = (callback) => {
    //     console.log('TopPr function...')
    //     let result;
    //     console.log(modalRepoName)
    //     const repo = repos.filter((item) => item.name === modalRepoName)[0];
    //     console.log('Repo url=', repo.url)
    //     let pulls_url = repo.url + '/pulls?sort=popularity&direction=desc&per_page=5';
    //     console.log(pulls_url)
    //     let xhr = new XMLHttpRequest();
    //     xhr.open('GET', pulls_url);
    //     xhr.send();
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState != 4) return;
    //
    //         if (xhr.status != 200) {
    //             alert(xhr.status + ': ' + xhr.statusText);
    //         } else {
    //             let data = JSON.parse(xhr.responseText)
    //             console.log(data, data.length)
    //             if (data.length) {
    //                 console.log('Ne uspel 1')
    //                 result = data.map((item, index) => {
    //                     return (
    //                         <li key={'liPr' + index}><a href={item.url}>{item.title}</a></li>
    //                     )
    //                 })
    //                 console.log(' v konec ne uspel', result)
    //                 callback.apply(result);
    //
    //             }
    //             else {
    //                 result = '<li>No one PR found</li>'
    //
    //             }
    //
    //
    //         }
    //     }
    //
    // }



    render() {
        console.log('Rendering RepoDialog component...', this.state)
        this.state.allReady ? console.log('Allready rendering') : this.getDialogData();
        return (
            <div>
        {this.state.allReady ? this.renderDialogData() : <img src="/source/loading.gif"/>}
        </div>
        )
    }
}