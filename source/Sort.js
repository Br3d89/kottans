import React from 'react';
import styles from './styles.css'

const Sort = (props) => {
    // console.log('Rendering Sort...')
    const { updateSort, updateOrder, sorts, order, updateHistory  } = props;
    // console.log('order=',order);


    // const orderBtnSrc = require(order ? '../static/asc.png':'../static/desc.png')
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
        console.log('handleSortChange');
        const target = event.target;
        const value= 'sort='+target.value;
        updateHistory(value)
        // updateSort(value);
    }

    const handleSortOrderChange = () => {
        console.log('handleSortOrderChange');
        // const target = event.target;
        // const newOrder = order ?  'desc':'asc';
        const value= 'order=' + (order==='desc' ?'asc' : 'desc');
        updateHistory(value)
        // updateOrder();
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