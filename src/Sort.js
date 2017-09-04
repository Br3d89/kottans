import React from 'react';
import styles from './sort.css'

const Sort = (props) => {
    console.log('Rendering Sort...')
    const { updateSort, updateOrder, sorts, order  } = props;
    console.log('order=',order);

    const orderBtnSrc = order? '/src/asc.png':'/src/desc.png'
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
            <div className={styles.sortBlockView}>
                <label htmlFor="type">Sort </label>
                <select id="sort" size="1" onChange={handleSortChange}>
                    {sortArray}
                </select>
                <button style={{display: 'inline-block'}} id="orderBtn" onClick={handleSortOrderChange}><img src={orderBtnSrc}/></button>
        </div>
        </div>
    )
};


export default Sort;