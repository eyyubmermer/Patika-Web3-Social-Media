import React, { useState, useEffect } from 'react'
import styles from "./Navbar.module.css"
import Link from 'next/link'
import { ethers } from 'ethers';
import { ConnectButton } from 'web3uikit';

function Navbar() {

    const [account, setAccount] = useState("");


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
    }, [])


    return (
        <div className={styles.container} >
            < div className={styles.navbar} >
                <div className={styles.links} >
                    <img src='bnb.png' width={"50px"} />
                </div>
                <div className={styles.links} >
                    <Link href="/" > Home </Link>
                </div>
                <div className={styles.links} >
                    <Link href={`/profile?user=${account}`} > Profile </Link>
                </div>
                <div className={styles.links}>
                    <Link href="/sendpost" > Send Post </Link>
                </div>
                <div className={styles.links}>
                    <ConnectButton />
                </div>
            </div >
        </div>
    )
}

export default Navbar


