import React, {useEffect} from "react"

import Head from "next/head";
import styles from "../styles/Home.module.css";
import DynamicText from "components/DynamicText";
import { Input, Box, Flex } from "@chakra-ui/react"
import { useAuth } from 'context/AuthUserContext';
import { useRouter } from 'next/router';
import Nav from "components/nav";
import MainLayout from "layout/MainLayout";


const Home = () => {
  const ref = React.useRef(null);
  const router = useRouter();


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    let val = e.target.value;    
    ref?.current?.changeValue(val)      
    
  };
 

  return (
    <MainLayout>

        <Head>
          <title>Coding Test</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Flex
          flex={1}
          p="5rem 0"
          direction="column"
          justify="center"
          align="center"
        >

        <DynamicText ref={ref}/>
          
        <Input
          placeholder="Enter random string"
          size="lg"
          onChange={onChange}
          mt={6}
        />

        </Flex>

      </MainLayout>
  );
};

export default Home;
