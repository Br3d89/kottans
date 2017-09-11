import React from 'react';
import Card from './Card';

const Result = (props) => {
    const {repos, openModal} = props;
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

        return (
            <div id='result' >
                {results}
            </div>
                )
    };

export default Result;