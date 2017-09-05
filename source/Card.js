import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

const Card = (props) => {
    const { id, repoName, description, isFork, starsCount, updatedDate, language, openModal} = props
    const imgStyles = {};

    return (
      <div className={styles.cardContainer} onClick={openModal}>
        <ul id={id} className={styles.ulResultContainer}>
        <li id={id+repoName} value={repoName} style={{ ...imgStyles }}>Repo name: {repoName}</li>
        <li id={id+description} style={{ ...imgStyles }}>Description: {description}</li>
        <li id={id+isFork} style={{ ...imgStyles }}>IsFork: {isFork.toString()}</li>
        <li id={id+starsCount} style={{ ...imgStyles }}>Stars count: {starsCount}</li>
        <li id={id+updatedDate} style={{ ...imgStyles }}>Updated date: {updatedDate}</li>
        <li id={id+language} style={{ ...imgStyles }}>Language: {language}</li>
        </ul>
      </div>

    )
}


export default Card;