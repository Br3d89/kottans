import React from 'react';
import styles from './styles.css'

const Sort = (props) => {
    console.log('Rendering Sort...')
    const { updateSort, updateOrder, sorts, order  } = props;
    console.log('order=',order);


    const orderBtnSrc = order? '/static/asc.png':'/static/desc.png'





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
        const value= target.value;
        console.log(value)
        updateSort(value);
    }

    const handleSortOrderChange = () => {
        console.log('handleSortOrderChange');
        updateOrder();
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