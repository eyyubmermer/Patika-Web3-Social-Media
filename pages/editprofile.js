import React, { useState, useEffect } from 'react'
import styles from '../styles/Editprofile.module.css'
import { instagramaddress } from '../config.js'
import instagramjson from "../build/contracts/Instagram.json";
import { useMoralisFile, useWeb3ExecuteFunction, useMoralis } from 'react-moralis';
import Moralis from "moralis";

function editprofile() {

    const [fileImg, setFileImg] = useState("")
    const [nick, setNick] = useState("")
    const [description, setDescription] = useState("")
    const [finalObject, setFinalObject] = useState({ nick: "", desc: "", image: "" })

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
            nick: nick,
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
            await editProfile(result.ipfs());
            console.log(result.ipfs())

        } catch (error) {
            alert(error.message);
        }
    }


    const editProfile = async (uri) => {
        let options = {
            contractAddress: instagramaddress,
            abi: instagramjson.abi,
            functionName: "editProfile",
            params: {
                _uri: uri
            }
        }

        await contractProcessor.fetch({
            params: options,
            onError: (error) => console.log(error)
        })


    }




    return (
        <div className={styles.container} >
            <form onSubmit={sendJSONToIPFS}  >
                <input className={styles.writeInput}
                    placeholder="nick"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                />
                <br />
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

export default editprofile