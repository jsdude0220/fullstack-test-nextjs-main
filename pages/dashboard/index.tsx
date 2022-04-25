import { useAuth } from "context/AuthUserContext";
import MainLayout from "layout/MainLayout";
import router from "next/router";
import React, {useState, useEffect} from "react";
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
import AdminWrapper from "./AdminWrapper";
import HTMLRenderer from 'react-html-renderer'
import { formats, modules, QuillNoSSRWrapper } from "./create"
import UpdateBlog from "components/UpdateBlog";
import Firebase from 'libs/firebase';
import { BlogList } from "components/BlogList";
const storage = Firebase.storage();

const db = Firebase.firestore();


const Dashboard = ()=>{

    const { token, profile, loading } = useAuth();

    const [isRemoving, setIsRemoving] = useState(false)
    const [blog, setBlog] = useState(undefined)
    const [blogs, setBlogs] = useState([])
    const [blogsLoading, setBlogsLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [isUpdate, setIsUpdate] = useState(false);


    const loadData = ()=>{

        setBlogsLoading(true)
        
        fetch(Utils.endpoint + 'blog/all', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then(res=>res.json())
        .then(jsonData=>{
            if(jsonData.statusCode){
                alert(jsonData.message)
            }else{
                setBlogs(jsonData.blogs)
            }
            setBlogsLoading(false)
        }).catch(err=>{
            alert(JSON.stringify(err, null, 3))
            setBlogsLoading(false)
        });
    }

    useEffect(()=>{      

        if(!token){
            return 
        }
        loadData()

    }, [ token])

    const onUpdate = ()=>{
        setIsUpdate(true)
    }

    const onDelete = async ()=>{
        setIsRemoving(true)

        try{
            
            const rawResponse = await fetch(Utils.endpoint + 'blog/' + blog.id, {
                    method: 'DELETE',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    }                    
                });
            loadData()            
        }catch(ex){
            alert(ex.message)
            
        }

        setIsRemoving(false)
    }

    const handleAfterUpdate = ()=>{
        setIsUpdate(false)
        loadData()
    }

    return <AdminWrapper>
        <MainLayout>
            <Box w="80%"  h="100vh" pt="100px">
                <Flex direction="row" justify="space-between">
                    <Text fontSize="2xl">Blogs</Text>
                    <Button borderRadius="md" colorScheme="green" boxShadow="md" onClick={()=>{router.push('/dashboard/create')}}>Create New</Button>
                </Flex>
                <Flex
                    direction="column"
                    align="center"
                    p={2}
                >
                    {
                        blogsLoading || isRemoving? <Spinner color="green"/> : null
                    }

                    {
                        isUpdate ? <UpdateBlog 
                            blog={blog} 
                            afterUpdated={()=>{handleAfterUpdate()}}
                            onCancel={()=>{setIsUpdate(false)}}
                        />: <>
                            <BlogList blogs={blogs} onOpen={()=>onOpen()} onSelect={(data)=>setBlog(data)}/>                        
                            <Box mt={5}>
                                <Text>Count of blogs {blogs.length}</Text>
                            </Box>
                        </>
                    }

                    
                  
                </Flex>
            </Box>
        
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>{blog ? blog.title : ''}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Image
                        w="100%"
                        objectFit="cover"
                        src={blog ? blog.image : ''}
                        alt="Img"
                        ratio={1}
                    />
                    <Box my={5}>
                        <HTMLRenderer html={blog ? blog.desc : ''} />
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="green" mr={3} onClick={()=>{
                        onUpdate()    
                        onClose()                    
                    }}>
                        Update
                    </Button> 
                    <Button colorScheme="red" mr={3} onClick={()=>{
                        onDelete()
                        onClose()
                    }}>
                        Delete
                    </Button>                    
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>                    
                </ModalFooter>
                </ModalContent>
            </Modal>     
        </MainLayout>
    </AdminWrapper>
}



export default Dashboard;