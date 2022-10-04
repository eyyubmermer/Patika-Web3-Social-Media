import React, { useState, useEffect } from 'react'
import { withRouter } from "next/router"
import styles from "../styles/Post.module.css"
import Post from '../components/Post'
import useContract from '../hooks/useContract'
import { instagramaddress } from '../config'
import instagramjson from "../build/contracts/Instagram.json";
import { ethers } from 'ethers'
import axios from 'axios'
import { useMoralis, useWeb3ExecuteFunction, useMoralisFile } from 'react-moralis'

const post = withRouter((props) => {

    const [post, setPost] = useState({});
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    const contractProcessor = useWeb3ExecuteFunction();
    const { account, isInitialized } = useMoralis();
    const { saveFile } = useMoralisFile();


    const getPost = async () => {
        let options = {
            contractAddress: instagramaddress,
            abi: instagramjson.abi,
            functionName: "viewPost",
            params: {
                _postId: props.router.query.postId,
            }
        }

        const result = await contractProcessor.fetch({
            params: options,
            onError: (error) => console.log(error)
        })

        console.log(result)
        try {
            const metadata = await axios.get(result.uri)

            setPost({
                postId: result.ID,
                sender: result.sender,
                postedTime: result.postedTime,
                commentsLength: result.comments.length,
                likes: result.likes.toString(),
                description: metadata.data.description,
                image: metadata.data.image,
            })

            const comments = await Promise.all(result.comments.map(async (comment, i) => {
                console.log("comment", comment)
                const metadata = await axios.get(comment.uri);

                let item = {
                    sender: comment.sender,
                    comment: metadata.data.description
                }
                return item
            }))

            setComments(comments)





        } catch (e) {
            console.log(e)
        }
    }





    const makeComment = async (e) => {
        e.preventDefault();
        const metadata = {
            description: comment,
        };
        try {
            const result = await saveFile(
                "post.json",
                { base64: btoa(unescape(encodeURIComponent(JSON.stringify(metadata)))) },
                {
                    type: "base64",
                    saveIPFS: true,
                }
            );
            await sendComment(props.router.query.postId, result.ipfs());

        } catch (error) {
            alert(error.message);
        }
    }


    const sendComment = async (postId, uri) => {
        let options = {
            contractAddress: instagramaddress,
            abi: instagramjson.abi,
            functionName: "sendComment",
            params: {
                _postId: postId,
                _uri: uri
            }
        }

        await contractProcessor.fetch({
            params: options,
            onError: (error) => console.log(error)
        })
    }


    // const viewComment = async () => {
    //     let options = {
    //         contractAddress: instagramaddress,
    //         abi: instagramjson,
    //         functionName: ""
    //     }
    // }


    useEffect(() => {
        if (account, props.router.query.postId) {
            getPost();
            //viewComment();
        }
    }, [account, props.router.query.postId])




    return (
        <div className={styles.container}>
            <Post
                sender={post.sender}
                image={post.image}
                description={post.description}
                postedTime={post.postedTime}
                postId={post.postId}
                comments={post.commentsLength}
                likes={post.likes}
            />
            <form onSubmit={makeComment} >
                <textarea className={styles.writeText} placeholder='Comment' value={comment} onChange={(e) => setComment(e.target.value)} />
                <br />
                <button type='submit' className={styles.submitButton}> Send </button>
            </form>
            <br />
            <div>
                {comments.map((comment, i) => (
                    <div className={styles.comment} key={i} >
                        <a href={`/profile?user=${comment.sender}`} className={styles.sender} >
                            {comment.sender}
                        </a>
                        <p className={styles.commentContent}>
                            {comment.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
})

export default post