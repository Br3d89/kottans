import PropTypes from 'prop-types';
import React from 'react';
import Card from './Card';
import Modal from 'react-modal';
import styles from './result.css'

const Result = (props) => {
    console.log('%c Rendering Result...', 'background: #222; color: red')
    const {repos, openModal, modalIsOpen, closeModal, afterOpenModal, modalRepoName} = props;

    const handleClick = () => {
        console.log('%c Handle click func', 'background: green; color:red')

    }

    const test = () => {
        return (
            <div>
                <h4>bred</h4>
            </div>
        )
    }

    const contrib = {}

    // const contribRender = contrib.topContrib.map((item, index) => {
    //     return (
    //         <li>
    //             <span>item.login</span>
    //             <span>item.contributions</span>
    //             <span>item.html_url</span>
    //         </li>
    //     )
    // })

    const showResult = (result) => {
        console.log('showResult func',result)
        return 'bred'
    }

    const topPr = () => {
        console.log('TopPr function...')
        let result;
        console.log(modalRepoName)
        const repo = repos.filter((item) => item.name === modalRepoName)[0];
        console.log('Repo url=',repo.url)
        let pulls_url = repo.url + '/pulls?sort=popularity&direction=desc&per_page=5';
        console.log(pulls_url)
        let xhr = new XMLHttpRequest();
        xhr.open('GET', pulls_url);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                let data = JSON.parse(xhr.responseText)
                console.log(data, data.length)
                if (data.length) {
                    console.log('Ne uspel 1')
                    result = data.map((item, index) => {
                        return (
                            <li key={'liPr' + index}><a href={item.url}>{item.title}</a></li>
                        )
                    })
                    console.log(' v konec ne uspel', result)
                    break;

                }
                else {
                    result = '<li>No one PR found</li>'

                }


            }
        }

    }

    const modal = (result) => {
        console.log('Modal function...')
        //const repo = {}
        //let contributionArr = []
        // if (modalRepoName.length) {
        //     repo.repo = repos.filter((item) => item.name === modalRepoName)
        //     repo.forkStyle = repo.repo.fork ? {display: 'block'} : {display: 'none'};
        //     let xhr = new XMLHttpRequest();
        //     let contributorsUrl = repo.repo.contributors_url + 'per_page=100';
        //     xhr.open('GET', contributorsUrl);
        //     xhr.send();
        //     xhr.onreadystatechange = function () {
        //         if (xhr.readyState != 4) return;
        //
        //         if (xhr.status != 200) {
        //             alert(xhr.status + ': ' + xhr.statusText);
        //         } else {
        //             let data = JSON.parse(xhr.responseText);
        //             contributionArr.push(data);
        //             let nextLink = xhr.getResponseHeader("Link")
        //             while (nextLink !== null) {
        //                 let link = nextLink.split(',')[0].split(';')[0].slice(1, -1)
        //                 xhr.open('GET', link);
        //                 xhr.send();
        //                 xhr.onreadystatechange = function () {
        //                     if (xhr.readyState != 4) return;
        //
        //                     if (xhr.status != 200) {
        //                         alert(xhr.status + ': ' + xhr.statusText);
        //                     } else {
        //                         data = JSON.parse(xhr.responseText);
        //                         contributionArr.push(data);
        //                         nextLink = xhr.getResponseHeader("Link")
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     //repo.contribData = contributionArr
        //     if (contributionArr.length > 3) {
        //         let sortContrib = contributionArr.sort((a, b) => {
        //             if (parseInt(a.contributions) < parseInt(b.contributions)) return 1;
        //             if (parseInt(a.contributions) > parseInt(b.contributions)) return -1;
        //         })
        //         let topContrib = sortContrib.slice(0, 3);
        //         contrib.topContrib = topContrib;
        //     }
        //     contrib.topContrib = contributionArr;
        //
        //     let languagesUrl = repo.repo.languages_url;
        //     xhr.open('GET', languagesUrl);
        //     xhr.send();
        //     xhr.onreadystatechange = function () {
        //         if (xhr.readyState != 4) return;
        //
        //         if (xhr.status != 200) {
        //             alert(xhr.status + ': ' + xhr.statusText);
        //         } else {
        //             let data = JSON.parse(xhr.responseText);
        //             let topLanguage = data
        //             if (Object.keys(data) > 1) {
        //                 let items = Object.keys(topLanguage).map(function (key) {
        //                     return [key, topLanguage[key]];
        //                 });
        //                 let itemsKb = items.filter((item) => item[1] > 1000)
        //                 if (itemsKb.length) {
        //                     itemsKb.sort(function (first, second) {
        //                         return second[1] - first[1];
        //                         repo.topLanguage = itemsKb[0];
        //                     })
        //                 }
        //                 else {
        //                     let itemsKB = ['all', '< 1 Kbyte'];
        //                     repo.topLanguage = itemsKB;
        //                 }
        //             }
        //             else {
        //                 repo.topLanguage = [Object.keys(data)[0], data[Object.keys(data)[0]]]
        //             }
        //         }
        //
        //
        //     }
        //
        //     return (<div>
        //             <Modal
        //                 isOpen={modalIsOpen}
        //                 contentLabel="Card Modal Example"
        //                 onRequestClose={closeModal}
        //                 style={styles.modal}
        //             >
        //                 <button className={styles.close} onClick={closeModal}>Close</button>
        //                 <ul>
        //                     <li><a href={repo.html_url}/></li>
        //                     {topPr}
        //                     <div>I am a modal of repo</div>
        //                 </ul>
        //                 >
        //             </Modal>
        //         </div>
        //     )
        // }

        return (<div>
            <Modal
                isOpen={modalIsOpen}
                contentLabel="Card Modal Example"
                onRequestClose={closeModal}
            >
                <button className={styles.close} onClick={closeModal}>Close</button>
                <ul>
                    {result}
                </ul>
            </Modal>
        </div>)
    }

        const results = repos.map((repo, index) => {
            repo.description = repo.description ? repo.description.slice(0, 20) + '...' : '';
            return (
                <Card
                    id={index}
                    key={index}
                    repoName={repo.name}
                    description={repo.description}
                    starsCount={repo.stargazers_count}
                    updatedDate={repo.updated_at}
                    language={repo.language}
                    isFork={repo.fork}
                    openModal={openModal}
                />
            )
        })

    console.log('Result= ',results)

        return (
            <div>
                {results}
                {modalRepoName ? topPr():null}

            </div>
                )
    };

export default Result;