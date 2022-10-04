import React, { useState, useEffect } from 'react'
import { withRouter } from "next/router"
import instagramjson from "../build/contracts/Instagram.json";
import { instagramaddress } from '../config.js'
import useContract from '../hooks/useContract';
import axios from 'axios';
import Post from '../components/Post';
import { ethers } from 'ethers';
import styles from "../styles/Profile.module.css"
import { useMoralisFile, useWeb3ExecuteFunction, useMoralis } from 'react-moralis';

const profile = withRouter((props) => {

    const [posts, setPosts] = useState([]);
    const [profileDetails, setProfileDetails] = useState({ nick: "", description: "", image: "" });


    const contractProcessor = useWeb3ExecuteFunction();
    const { account } = useMoralis();


    const viewUserPosts = async () => {
        try {
            let options = {
                contractAddress: instagramaddress,
                abi: instagramjson.abi,
                functionName: "viewUser",
                params: {
                    _userAddress: props.router.query.user,
                }
            }

            const data = await contractProcessor.fetch({
                params: options,
                onError: (error) => {
                    console.log(error)
                }
            })

            console.log("DATA", data)

            const items = await Promise.all(data.posts.map(async i => {
                let uri = i.uri;

                const data = await axios.get(uri);
                let item = {
                    postId: i.ID,
                    sender: i.sender,
                    postedTime: i.postedTime,
                    likes: i.likes.toNumber(),
                    commentsLength: i.comments.length,
                    description: data.data.description,
                    image: data.data.image,
                }
                return item;
            }))

            const userDetails = await axios.get(data.uri);
            setProfileDetails({
                nick: userDetails.data.nick,
                description: userDetails.data.description,
                image: userDetails.data.image
            })

            setPosts(items)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (account, props.router.query.user) {
            viewUserPosts();
        }
    }, [account, props.router.query.user])


    return (
        <div className={styles.container}>
            {profileDetails.nick != "" ? (
                <div className={styles.details} >
                    <img className={styles.profilePhoto} width={"75px"} height={"75px"} src={profileDetails.image} />
                    <div className={styles.nonImage} >
                        <div className={styles.nick} >
                            {profileDetails.nick}
                            {String(props.router.query.user).toLowerCase() == String(account).toLowerCase() && (
                                <a className={styles.editProfileButton} href={"/editprofile"}> Edit Profile </a>
                            )}
                        </div>
                        <div>
                            <p>
                                {profileDetails.description}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.details} >
                    <img className={styles.profilePhoto} width={"75px"} height={"75px"} src={"defaultpp.png"} />
                    <div className={styles.nonImage} >
                        <div className={styles.nick} >
                            <p>User</p>
                            {String(props.router.query.user).toLowerCase() == String(account).toLowerCase() && (
                                <a className={styles.editProfileButton} href={"/editprofile"}> Edit Profile </a>
                            )}
                        </div>
                        <div>
                            <p>
                                Hi, I am using BNB Media!
                            </p>
                        </div>
                    </div>
                </div>
            )


            }
            <div className={styles.allPost} >
                {posts.map((post, i) =>
                    <div key={i}>
                        <Post
                            key={i}
                            sender={post.sender}
                            image={post.image}
                            description={post.description}
                            postedTime={post.postedTime}
                            postId={post.postId}
                            likes={post.likes}
                            comments={post.commentsLength}
                        />
                    </div>
                )}
            </div>
        </div >
    )
})

export default profile