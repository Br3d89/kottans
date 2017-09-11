import React from 'react';
import Card from './Card';
import styles from './styles.css';

const Result = (props) => {
    // console.log('%c Rendering Result...', 'background: #222; color: red')
    const {repos, openModal, modalIsOpen, closeModal, afterOpenModal, modalRepoName, updateHistory, searchString} = props;

     // updateHistory(searchString);



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

    // console.log('Result= ',results)

        return (
            <div id='result' >
                {results}
            </div>
                )
    };

export default Result;