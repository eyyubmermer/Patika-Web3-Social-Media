import React, { useState, useEffect } from 'react'
import styles from '../styles/Sendpost.module.css'
import { instagramaddress } from '../config.js'
import instagramjson from "../build/contracts/Instagram.json";
import Moralis from "moralis";
import { useMoralisFile, useWeb3ExecuteFunction } from 'react-moralis';

function sendpost() {

    const [description, setDescription] = useState("")
    const [fileImg, setFileImg] = useState("")

    const { saveFile } = useMoralisFile();
    const contractProcessor = useWeb3ExecuteFunction();

    const sendFileToIPFS = async (e) => {
        const data = e.target.files[0]
        try {
            const file = new Moralis.File(data.name, data);
            await file.saveIPFS();
            console.log(file.ipfs())
            setFileImg(file.ipfs())
        } catch (error) {
            console.log(error)
        }
    }

    const sendJSONToIPFS = async (e) => {
        e.preventDefault();
        const metadata = {
            description: description,
            image: fileImg
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
            await sendPost(result.ipfs());
            console.log(result.ipfs())

        } catch (error) {
            alert(error.message);
        }
    }

    const sendPost = async (uri) => {
        let options = {
            contractAddress: instagramaddress,
            functionName: "sendPost",
            abi: instagramjson.abi,
            params: {
                _uri: uri,
            },
        }

        await contractProcessor.fetch({
            params: options,
            onError: (error) => {
                alert(error.message);
            },
        });
    }



    return (
        <div className={styles.container} >
            <form onSubmit={sendJSONToIPFS} >
                <textarea className={styles.writeText} placeholder='description' value={description} onChange={(e) => setDescription(e.target.value)} />
                <br />
                <input type="file" onChange={(e) => {
                    sendFileToIPFS(e)
                }} required />
                <br />
                <div>
                    {
                        fileImg && (
                            < img width='350px' src={fileImg} />
                        )}
                </div>
                <br />
                <button type='submit'>Send</button>
            </form>
        </div>
    )
}

export default sendpost