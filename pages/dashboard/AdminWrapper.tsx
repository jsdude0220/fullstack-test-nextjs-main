import React from 'react'
import { useAuth } from "context/AuthUserContext";
import MainLayout from "layout/MainLayout";
import router from "next/router";

import { Utils } from "utils/Utils";
import { 
    Box, Flex , Image, Text, Button, Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    Textarea,

} from '@chakra-ui/react'
import BlogCard from 'components/BlogCard';



const AdminWrapper = ({children})=>{
    const { token, profile, loading } = useAuth();

    React.useEffect(()=>{

        if(!loading && (!profile || profile.role != 'admin')){
            if(!profile){
                router.replace('/login')
            }else if(profile && profile.role == 'user'){
                router.replace('/')
            }else{
                router.replace('/login')
            }
            return;
        }
        if(loading){
            return ;
        }

        if(!token && !loading){
            router.replace('/login')
            return 
        }

        // 


    }, [profile, loading, token])

    return <>
        {children}
    </>
}

export default AdminWrapper;