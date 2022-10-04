import React, { useEffect, useState } from 'react'
import styles from "./Post.module.css"
import instagramjson from "../build/contracts/Instagram.json";
import { instagramaddress } from '../config.js'
import axios from 'axios';
import { useMoralis, useMoralisFile, useWeb3ExecuteFunction } from 'react-moralis';

function Post(props) {


    const [profileDetails, setProfileDetails] = useState({ nick: "", description: "", image: "" });


    const contractProcessor = useWeb3ExecuteFunction();
    const { account } = useMoralis();

    const viewUser = async () => {
        let options = {
            contractAddress: instagramaddress,
            abi: instagramjson.abi,
            functionName: "viewUser",
            params: {
                _userAddress: props.sender,
            }
        }


        let user = await contractProcessor.fetch({
            params: options,
            onError: (error) => console.log(error)
        })

        let uri = user.uri;


        console.log(uri)

        let metadata = await axios.get(uri)
        console.log(metadata)
        setProfileDetails({
            nick: metadata.data.nick,
            description: metadata.data.description,
            image: metadata.data.image
        })

    }


    useEffect(() => {
        if (account, props.sender) {
            viewUser();
        }
    }, [account, props.sender])



    return (
        <div className={styles.post}  >
            <div className={styles.profileDetails} >
                <img width={"75px"} height={"75px"} className={styles.profilePhoto} src={profileDetails.image} />
                <a href={`/profile?user=${props.sender}`} className={styles.address} >{profileDetails.nick} </a>
            </div>
            <img width={"250px"} height={"300px"} src={props.image} />
            <p> {props.description} </p>
            <div className={styles.interaction} >
                <p className={styles.interactionElement} >Likes({props.likes}) </p>
                <a href={`/post?postId=${props.postId}`} className={styles.interactionElement}>Comments({props.comments}) </a>
            </div>
        </div>
    )
}

export default Post