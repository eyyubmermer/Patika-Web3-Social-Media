import React from 'react'
import styles from "./Post.module.css"

function Post(props) {
    return (
        <div className={styles.post}  >
            <a href={`/profile?user=${props.sender}`} className={styles.address} > {props.sender} </a>
            <img width={"250px"} height={"300px"} src={props.image} />
            <p> {props.description} </p>
            <p> {props.postedTime.toNumber()} </p>
            <div className={styles.interaction} >
                <p className={styles.interactionElement} >Likes</p>
                <p className={styles.interactionElement}>Leave Comment</p>
            </div>
        </div>
    )
}

export default Post