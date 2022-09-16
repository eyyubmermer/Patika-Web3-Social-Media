import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import useContract from '../hooks/useContract';
import instagramjson from "../build/contracts/Instagram.json";
import { instagramaddress } from '../config.js'
import { ethers } from 'ethers';
import axios from 'axios';
import Post from '../components/Post';


export default function Home() {

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState("");

  const contract = useContract(instagramaddress, instagramjson.abi);


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


  const getAllPosts = async () => {
    try {
      setIsLoading(false);
      const result = await contract?.viewAllPosts()
      console.log(result);

      const items = await Promise.all(result.map(async i => {
        const postUri = i.uri;
        // we want get the token metadata - json 
        const meta = await axios.get(postUri)
        let item = {
          likes: i.likes,
          postedTime: i.postedTime,
          sender: i.sender,
          description: meta.data.description,
          image: meta.data.image,
        }
        return item
      }))
      setPosts(items)
      setIsLoading(true);
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    connect();
    if (account) {
      getAllPosts();
    }
  }, [account])


  return (
    <div className={styles.container}>
      <div>
        <div className={styles.allPost} >
          {posts.map((post, i) => (
            <div key={i} >
              <Post
                sender={post.sender}
                image={post.image}
                description={post.description}
                postedTime={post.postedTime}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
