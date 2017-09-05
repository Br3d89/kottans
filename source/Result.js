import React from 'react';
import Card from './Card';

const Result = (props) => {
    console.log('%c Rendering Result...', 'background: #222; color: red')
    const {repos, openModal, modalIsOpen, closeModal, afterOpenModal, modalRepoName} = props;


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
            </div>
                )
    };

export default Result;