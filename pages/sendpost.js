import React, { useState, useEffect } from 'react'
import styles from '../styles/Sendpost.module.css'
import axios from 'axios'

function sendpost() {

    const apikey = "e4978c9dab201bb87e53"
    const apisecret = "102db1a194b3c059992453d91e89cba5634ec8aeb530d57986fb73961b0a82bb"

    const [fileImg, setFileImg] = useState("")
    const [desc, setDesc] = useState("")
    const [final, setFinal] = useState("")
    const [finalObject, setFinalObject] = useState({ desc: "", image: "" })

    const sendFileToIPFS = async (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            try {
                const formData = new FormData();
                formData.append("file", e.target.files[0]);
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': apikey,
                        'pinata_secret_api_key': apisecret,
                        "Content-Type": "multipart/form-data"
                    },
                });
                const ImgUrl = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`
                console.log(resFile);
                setFileImg(ImgUrl)
                //Take a look at your Pinata Pinned section, you will see a new file added to you list.   
            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
        }
    }

    const sendJSONtoIPFS = async (e) => {
        e.preventDefault();
        try {
            const resJSON = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
                data: {
                    "description": desc,
                    "image": fileImg
                },
                headers: {
                    'pinata_api_key': apikey,
                    'pinata_secret_api_key': apisecret,
                },
            });

            console.log("final ", `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`)
            setFinal(`https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`)

        } catch (error) {
            console.log("JSON to IPFS: ")
            console.log(error);
        }
    }

    const fetchIPFSdata = async (_final) => {
        const data = await axios.get(_final);
        await setFinalObject({
            desc: data.data.description,
            image: data.data.image
        })
        await console.log("got here!", data, finalObject);
    }


    useEffect(() => {
        if (final) {
            fetchIPFSdata(final);
        }
    }, [final]);



    return (
        <div className={styles.container} >
            <form onSubmit={sendJSONtoIPFS}  >
                <textarea className={styles.writeText} placeholder='description' value={desc} onChange={(e) => setDesc(e.target.value)} />
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
                <br />
                <div>
                    {finalObject.desc}
                    <br />
                    {<img src={finalObject.image} />}
                </div>
            </form>
        </div>
    )
}

export default sendpost