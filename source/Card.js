import React from 'react';
import styles from './styles.css'
import FormattedRelativeDate from 'react-npm-formatted-relative-date';

const Card = (props) => {
    const { id, repoName, description, isFork, starsCount, updatedDate, language, openModal} = props
    const imgStyles = {};

    return (
      <div className={styles.cardContainer} onClick={() => openModal(repoName)}>
        <ul id={id+'ul'} className={styles.ulResultContainer}>
        <li id={id+repoName} value={repoName} style={{ ...imgStyles }}>Repo name: {repoName}</li>
        <li id={id+description} style={{ ...imgStyles }}>Description: {description}</li>
        <li id={id+isFork} style={{ ...imgStyles }}>IsFork: {isFork.toString()}</li>
        <li id={id+starsCount} style={{ ...imgStyles }}>Stars count: {starsCount}</li>
        <li id={id+updatedDate} style={{ ...imgStyles }}>Updated: <span style={{display:'inline-block'}}><FormattedRelativeDate date={updatedDate} /></span></li>
        <li id={id+language} style={{ ...imgStyles }}>Language: {language}</li>
        </ul>
      </div>
    )
}


export default Card;