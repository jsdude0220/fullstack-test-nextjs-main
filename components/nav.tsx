import React from "react";
import {useRouter} from 'next/router'
import {
    Box, Flex, Text, Button, Link
} from '@chakra-ui/react'

import { useAuth } from "context/AuthUserContext";

const Nav = ()=>{
    const router = useRouter()
    const { clear } = useAuth();

 

    return <Box
        pos="absolute"
        top={0}
        left={0}
        w={'100%'}
        h={'60px'}
        zIndex={10}
        bg="green.500"
        boxShadow="md"
    >

        <Flex 
            direction="row"
            justify="space-between"
            align="center"
            p={3}
        >
            <Button colorScheme="teal" variant="unstyled" color="white" fontSize={20} mx={5} onClick={()=>router.push('/')}>
                <Text color="white" fontSize={25} mt={-1}>FullStack Testing</Text>
            </Button>
            <Box flex="1"></Box>
            <Flex direction="row" align="center">
                <Link colorScheme="teal" variant="link" color="white" fontSize={20} mx={5} href="/blog">
                    Blog
                </Link>

                <Link colorScheme="teal" variant="link" color="white" fontSize={20} onClick={clear} mx={5}>
                    Sign out
                </Link>
            </Flex>

            
        </Flex>        

    </Box>
}


export default Nav;