import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import instagramjson from "../build/contracts/Instagram.json";
import { instagramaddress } from '../config.js'
import axios from 'axios';
import Post from '../components/Post';
import { useMoralisFile, useWeb3ExecuteFunction, useMoralis } from 'react-moralis';

export default function Home() {

  const [posts, setPosts] = useState([]);

  const contractProcessor = useWeb3ExecuteFunction();
  const { account, isInitialized } = useMoralis();


  const viewAllPosts = async () => {
    let options = {
      contractAddress: instagramaddress,
      functionName: "viewAllPosts",
      abi: instagramjson.abi,
      params: {
      },
    }

    let data = await contractProcessor.fetch({
      params: options,
      onError: (error) => {
        alert(error.message);
      },
    });

    const items = await Promise.all(data.map(async i => {

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
    setPosts(items)

    console.log(data);
  }


  useEffect(() => {
    if (account) {
      viewAllPosts();
    }
  }, [account])


  return (
    <div className={styles.container}>
      <div>
        <div className={styles.allPost} >
          <div>
            {posts.length > 0 ? (
              posts.map((post, i) => (
                <div key={i} >
                  <Post
                    sender={post.sender}
                    image={post.image}
                    description={post.description}
                    postedTime={post.postedTime}
                    postId={post.postId}
                    likes={post.likes}
                    comments={post.commentsLength}
                  />
                </div>
              ))
            ) : <div></div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
