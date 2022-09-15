import React from 'react'
import styles from "./Navbar.module.css"
import Link from 'next/link'

function Navbar() {
    return (
        <div className={styles.container} >
            < div className={styles.navbar} >
                <div className={styles.links} >
                    <Link href="/" > Home </Link>
                </div>
                <div className={styles.links} >
                    <Link href="/profile" > Profile </Link>
                </div>
                <div className={styles.links}>
                    <Link href="/sendpost" > Send Post </Link>
                </div>
            </div >
        </div>
    )
}

export default Navbar


