import React, { useState, useEffect } from 'react'
import { withRouter } from "next/router"
import instagramjson from "../build/contracts/Instagram.json";
import { instagramaddress } from '../config.js'
import useContract from '../hooks/useContract';
import axios from 'axios';
import Post from '../components/Post';
import { ethers } from 'ethers';
import styles from "../styles/Profile.module.css"

const profile = withRouter((props) => {

    const [posts, setPosts] = useState([]);
    const [account, setAccount] = useState("");

    const contract = useContract(instagramaddress, instagramjson.abi);


    const viewUserPosts = async () => {
        try {
            const result = await contract?.viewUserPosts(props.router.query.user);
            console.log(result);

            const items = await Promise.all(result.map(async i => {
                const ipfs = i.uri;
                const meta = await axios.get(ipfs);
                let item = {
                    likes: i.likes,
                    postedTime: i.postedTime,
                    sender: i.sender,
                    description: meta.data.description,
                    image: meta.data.image,
                }
                return item
            }
            ))
            setPosts(items)
        } catch (error) {
            console.log(error)
        }
    }

    function connect() {
        if (!window.alert) {
            alert("metamask is not installed!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        provider
            .send("eth_requestAccounts", [])
            .then((accounts) => setAccount(accounts[0]))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        connect();
        if (account && props.router.query.user) {
            viewUserPosts();
        }
    }, [account, props.router.query.user])




    return (
        <div className={styles.container} >
            <div className={styles.allPost} >
                {posts.map((post, i) =>
                    <div key={i}>
                        <Post
                            key={i}
                            sender={post.sender}
                            image={post.image}
                            description={post.description}
                            postedTime={post.postedTime}
                        />
                    </div>
                )}
            </div>
        </div>
    )
})

export default profile