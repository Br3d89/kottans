import React from 'react';
import styles from './styles.css'

const Sort = (props) => {
    const {sorts, order, updateHistory  } = props;
    const orderBtnSrc = require(order==='desc' ? '../static/desc.png':'../static/asc.png')

    const sortArray = sorts.map((value,index)=>{
        return (<option
            key={value.name+index}
            value={value.name}
        >{value.description}
        </option>
        )
    })


    const handleSortChange = (event) => {
        const target = event.target;
        const value= 'sort='+target.value;
        updateHistory(value)
    }

    const handleSortOrderChange = () => {
        const value= 'order=' + (order==='desc' ?'asc' : 'desc');
        updateHistory(value)
    }



    return (
        <div className={styles.sortBlockContainer}>
                <label htmlFor="type">Sort by: </label>
                <select id="sort" size="1" onChange={handleSortChange} className={styles.sortArrow}>
                    {sortArray}
                </select>
            <img src={orderBtnSrc} id="orderBtn" onClick={handleSortOrderChange} style={{width:'9px', height:'10px',verticalAlign: 'center', marginLeft:'2px',backgroundColor:'red'}} className={styles.sortOrderBtn}/>
        </div>
    )
};


export default Sort;