import React, {useEffect} from 'react'
import {
    Flex
} from '@chakra-ui/react'
import Nav from "components/nav"
import { useRouter } from 'next/router';
import { useAuth } from 'context/AuthUserContext';


const MainLayout = ({children})=>{

    const { authUser, loading, token } = useAuth();
    const ref = React.useRef(null);
    const router = useRouter();
  
  
    useEffect(() => {
                  
        if (token === undefined && !loading){
            router.replace('/login')
        }
            
      }, [token, loading])

    return <Flex
        minH="100vh"
        p={"0 0.5rem"}
        direction="column"
        justify="center"
        align="center"        
    >
    <Nav/>
    {children}
    </Flex>

}


export default MainLayout;