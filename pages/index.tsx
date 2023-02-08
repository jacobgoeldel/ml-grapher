import { HStack } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import Graph from '../components/graph'
import SideBar from '../components/sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>ML Grapher</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ height: '100vh', background: '#181925' }}>
        <HStack w="100%" h="100%" spacing={0}>
          <SideBar />
          <Graph />
        </HStack>
      </main>
    </div>
  )
}
