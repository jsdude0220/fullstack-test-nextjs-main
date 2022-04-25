
import React, {useState, useEffect} from 'react'
import dynamic from 'next/dynamic'

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
import MainLayout from 'layout/MainLayout'
import { useCollection } from "react-firebase-hooks/firestore";

import Firebase from 'libs/firebase';
import BlogCard from 'components/BlogCard';
import { Blog } from 'types/types';
import router from 'next/router';
import AdminWrapper from './AdminWrapper';
import { Utils } from 'utils/Utils';
import { useAuth } from 'context/AuthUserContext';


const storage = Firebase.storage();

const db = Firebase.firestore();


export const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  export const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ]


export const QuillNoSSRWrapper = dynamic(import('react-quill'), {	
	ssr: false,
	loading: () => <p>Loading ...</p>,
})


    
const CreateBlog = ()=>{
    const {token} = useAuth();
    const [title, setTitle] = useState<string>('')
    // const [desc, setDesc] = useState<string>('')

    const [imageAsFile, setImageAsFile] = useState<any>()
    const [imageAsUrl, setImageAsUrl] = useState({imgUrl: ''})

    const [loading, setLoading] = useState(false)

    const createNewBlog = async ()=>{

        const quilData = document.getElementsByClassName('ql-editor')[0].innerHTML;
        
        console.log('quidata : ', quilData)
        
        try{
            setLoading(true)
            const imgUrl = await handleFireBaseUpload() as string | null
            if(!imgUrl){
                return ;
            }
            const rawResponse = await fetch(Utils.endpoint + 'blog', {
                    method: 'POST',
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
            router.back()       
        }catch(ex){
            if(ex){
                alert(ex.message)
            }
            
            setLoading(false)
        }
        

    }
    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        setImageAsFile(image)
    }


    const handleFireBaseUpload = () =>{    

        return new Promise((resolve, reject)=>{

            if(!imageAsFile) {
                alert(`Not an image, the image file is a ${typeof(imageAsFile)}`)
                reject(null)
            }

            const seed = Number(Math.random().toFixed(6)) * 10**6;
    
            const uploadTask = storage.ref(`/images/${seed}_${imageAsFile.name}`).put(imageAsFile)
    
            uploadTask.on('state_changed', 
            (snapShot) => {
                
            }, (err) => {
                reject(null)

            }, () => {
                
                storage.ref('images').child(imageAsFile.name).getDownloadURL()
                .then(fireBaseUrl => {
                    setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))
                    resolve(fireBaseUrl)
                })
            })

        })
      
    }
  

    return <AdminWrapper>
        <MainLayout>
            <Box w="60%"  h="100vh" pt="200px">
                <Box  boxShadow="md" p={3}>
                    <Flex direction="row" justify="space-between">
                        <Text fontSize="2xl">Create New Blog</Text>                
                    </Flex>
                    <Flex
                        direction="column"
                        align="center"
                        p={2}                    
                    >
                        <Input placeholder="Enter title" my={3} onChange={e=>{setTitle(e.target.value) }}/>            
                        {/* <Textarea placeholder="Enter Description" my={3} onChange={e=>{setDesc(e.target.value) }}/>             */}
                        <Box my={5}>
                            <QuillNoSSRWrapper  modules={modules} formats={formats} theme="snow"  />
                        </Box>
                        <Input type="file" my={8} onChange={handleImageAsFile}/>
                        {
                            loading ? <Spinner color="green"/> : <Button w="200px" maxW="80%" borderRadius="md" mt="50px" colorScheme="green" boxShadow="md" onClick={()=>{createNewBlog()}}>Create</Button>
                        }                        
                    </Flex>
                </Box>
            </Box>    
        </MainLayout>    
    </AdminWrapper>
}

export default CreateBlog;




