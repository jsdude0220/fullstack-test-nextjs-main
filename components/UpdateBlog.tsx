import { useAuth } from "context/AuthUserContext";
import MainLayout from "layout/MainLayout";
import router from "next/router";
import React, { useState, useEffect } from "react";
import { Utils } from "utils/Utils";
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
import BlogCard from 'components/BlogCard';

import HTMLRenderer from 'react-html-renderer'
import { formats, modules, QuillNoSSRWrapper } from "pages/dashboard/create"


import Firebase from 'libs/firebase';

const storage = Firebase.storage();

const db = Firebase.firestore();


const UpdateBlog = ({ blog, afterUpdated, onCancel }) => {
    const { token } = useAuth()

    const [title, setTitle] = useState(blog ? blog.title : '')
    const [imageAsFile, setImageAsFile] = useState<any>()
    const [imageAsUrl, setImageAsUrl] = useState({ imgUrl: '' })
    const [desc, setDesc] = useState(blog ? blog.desc : '')
    const [loading, setLoading] = useState(false)

    const editorRef = React.useRef(null)


    const setBlogDesc = () => {

        setTimeout(() => {
            try {
                const node = document.getElementsByClassName('ql-editor')[0]
                node.innerHTML = blog.desc;

            } catch (ex) {
                console.log(ex)
            }
        }, 500)


    }
    React.useEffect(() => {
        setBlogDesc()
    }, [])

    React.useEffect(() => {
        if (blog) {
            setBlogDesc()
        }
    }, [blog])

    const updateBlog = async () => {

        const quilData = document.getElementsByClassName('ql-editor')[0].innerHTML;

        console.log('quidata : ', quilData)

        try {
            setLoading(true)
            const imgUrl = await handleFireBaseUpload() as string | null
            if (!imgUrl) {
                return;
            }
            const rawResponse = await fetch(Utils.endpoint + 'blog/' + blog.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title, desc: quilData, image: imgUrl
                })
            });

            setLoading(false)
            if (afterUpdated) {
                afterUpdated()
            }
        } catch (ex) {
            if (ex) {
                alert(ex.message)
            }

            setLoading(false)
        }

    }
    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        setImageAsFile(image)
    }


    const handleFireBaseUpload = () => {

        return new Promise((resolve, reject) => {

            if (!imageAsFile) {
                alert(`Not an image, the image file is a ${typeof (imageAsFile)}`)
                reject(null)
            }

            const seed = Number(Math.random().toFixed(6)) * 10 ** 6;

            const uploadTask = storage.ref(`/images/${seed}_${imageAsFile.name}`).put(imageAsFile)

            uploadTask.on('state_changed',
                (snapShot) => {

                }, (err) => {
                    reject(null)

                }, () => {

                    storage.ref('images').child(imageAsFile.name).getDownloadURL()
                        .then(fireBaseUrl => {
                            setImageAsUrl(prevObject => ({ ...prevObject, imgUrl: fireBaseUrl }))
                            resolve(fireBaseUrl)
                        })
                })

        })

    }


    return <>
        <Box w="60%" h="100vh" pt="20px">
            <Box boxShadow="md" p={3}>
                <Flex direction="row" justify="space-between">
                    <Text fontSize="2xl">Update Blog</Text>
                </Flex>
                <Flex
                    direction="column"
                    p={2}
                >
                    <Input placeholder="Enter title" my={3} value={title} onChange={e => { setTitle(e.target.value) }} />
                    {/* <Textarea placeholder="Enter Description" my={3} onChange={e=>{setDesc(e.target.value) }}/>             */}
                    <Box my={5}>
                        <QuillNoSSRWrapper
                            modules={modules}
                            formats={formats}
                            theme="snow"
                            // value={desc}
                            onChange={(content, delta, source, editor) => {
                                // setDesc(source)

                            }} />
                    </Box>
                    <Input type="file" my={8} onChange={handleImageAsFile} />
                    {
                        loading ? <Spinner color="green" /> : <Flex direction="row" justify="space-between">
                            <Button w="200px" maxW="80%" mx={4} borderRadius="md" mt="50px" colorScheme="blue" boxShadow="md" onClick={() => { onCancel() }}>Cancel</Button>
                            <Button w="200px" maxW="80%" borderRadius="md" mt="50px" colorScheme="green" boxShadow="md" onClick={() => { updateBlog() }}>Update</Button>

                        </Flex>
                    }
                </Flex>
            </Box>
        </Box>
    </>
}

export default UpdateBlog;