import PropTypes from 'prop-types';
import React from 'react';

const Card = (props) => {
    const { id, repoName, description, isFork, starsCount, updatedDate, language  } = props
    const imgStyles = {};

    return (
        <ul id={id}>
        <li id={id+repoName} style={{ ...imgStyles }}>Repo name: {repoName}</li>
        <li id={id+description} style={{ ...imgStyles }}>Description: {description}</li>
        <li id={id+isFork} style={{ ...imgStyles }}>IsFork: {isFork.toString()}</li>
        <li id={id+starsCount} style={{ ...imgStyles }}>Stars count: {starsCount}</li>
        <li id={id+updatedDate} style={{ ...imgStyles }}>Updated date: {updatedDate}</li>
        <li id={id+language} style={{ ...imgStyles }}>Language: {language}</li>
        </ul>
    )
}


export default Card;