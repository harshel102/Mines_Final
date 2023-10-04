'use client'
import styles from './page.module.css'
import NodeStatusTable from './component/NodeStatus.js'

export default function Home() {

  return (
    <main className={styles.main}>
      <h1>Device Info</h1>
      <NodeStatusTable/>
    </main>
  )
}