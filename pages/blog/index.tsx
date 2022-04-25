
import React, { useState, useEffect } from 'react'
import {
    Box, Flex, Image, Text, Button, Spinner,
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
import MainLayout from 'layout/MainLayout'
import { useCollection } from "react-firebase-hooks/firestore";
import HTMLRenderer from 'react-html-renderer'

import Firebase from 'libs/firebase';
import BlogCard from 'components/BlogCard';
import { Blog } from 'types/types';
import router from 'next/router';
import { Utils } from 'utils/Utils';
import { useAuth } from 'context/AuthUserContext';


const storage = Firebase.storage();

const db = Firebase.firestore();


const BlogPage = () => {
    const { token } = useAuth();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const [blog, setBlog] = useState(undefined)
    const [blogs, setBlogs] = useState([])
    const [blogsLoading, setBlogsLoading] = useState(false)


    useEffect(() => {

        if (!token) {
            return
        }
        setBlogsLoading(true)
        fetch(Utils.endpoint + 'blog/all', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => res.json())
            .then(jsonData => {
                if (jsonData.statusCode) {
                    alert(jsonData.message)
                } else {
                    setBlogs(jsonData.blogs)
                }

                setBlogsLoading(false)


            }).catch(err => {
                alert(JSON.stringify(err, null, 3))
                setBlogsLoading(false)
            });
    }, [token])

    const onDelete = async () => {
        setIsRemoving(true)
        const res = await db.collection("blogs").doc(blog.id).delete()
        setIsRemoving(false)
    }



    return <MainLayout>
        <Box w="80%" h="100vh" pt="100px">
            <Flex direction="row" justify="space-between">
                <Text fontSize="2xl">Blogs</Text>
                {/* <Button borderRadius="md" colorScheme="green" boxShadow="md" onClick={()=>{router.push('/blog/create')}}>Create New</Button> */}
            </Flex>
            <Flex
                direction="column"
                align="center"
                p={2}
            >
                {
                    blogsLoading || isRemoving ? <Spinner color="green" /> : null
                }
                {
                    blogs && blogs.map((blog, index: number) => {

                        return <BlogCard data={blog} key={index} onClick={() => {
                            onOpen();
                            setBlog({ ...blog, id: blog.id });
                        }} />
                    })
                }
                <Box mt={5}>
                    <Text>Count of blogs {blogs.length}</Text>
                </Box>
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
                    <Box my={5} ml="20px">
                        <HTMLRenderer html={blog ? blog.desc : ''} />
                    </Box>

                </ModalBody>

                <ModalFooter>

                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>



    </MainLayout>
}

export default BlogPage;