import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from 'context/AuthUserContext';
import {
    Box, Input, Flex, Button, Text,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Spinner
} from "@chakra-ui/react";
import { Utils } from 'utils/Utils';


const SignUp = () => {
    const {loading, storeToken, storeProfile} = useAuth();
    const [email, setEmail] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [dob, setDob] = useState<string>('');
    const [rePwd, setRePwd] = useState<string>("");
    const router = useRouter();
    const [error, setError] = useState(null);
    const [showLoader, setShowLoader] = useState(false)

    const { createUserWithEmailAndPassword } = useAuth();


    const validate  =()=>{
        if(!!pwd || pwd == ''){
            setError('Please enter password!')
            return 
        }
        if(!!name || name == ''){
            setError('Please enter password!')
            return 
        }
        if(!!dob || dob == ''){
            setError('Please enter password!')
            return 
        }
    }

    const onSubmit = async (event) => {

        event.preventDefault();
        setError(null)

        if(pwd === rePwd){
            setShowLoader(true)
            try{
                const rawResponse = await fetch(Utils.endpoint + 'profiles/signup', {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({                    
                        name: name,
                        dob: dob,
                        email,
                        pwd
                    })
                });
                              
                if(rawResponse.status == 201){
                    const resJson = await rawResponse.json()
                    storeToken(resJson.token)
                    storeProfile(resJson.profile)
                    router.push("/");
                }else{
                    const resJson = await rawResponse.json()
                    setError(resJson.message)
                }                
                
            }catch(err){
                setError(err.message)
            }

            setShowLoader(false)

        }       
        else{
            setError("Password do not match")
        }
            
       
    };

    const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const changePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(e.target.value)
    }
    const changeRePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRePwd(e.target.value)
    }

    const onLogin = ()=>{
        router.replace("/login");
    }

    return (
        <Flex direction="column" justify="center" align="center" h="100vh">
        <Flex direction="row" justify="center" align="center">
            <Box w="500px" maxW="90%">
            <form             
                onSubmit={onSubmit}>
                <FormControl id="name">
                    <FormLabel>User Name</FormLabel>
                    <Input type="text" value={name} required onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                        setName(e.target.value)
                    }}/>
                    <FormHelperText>Enter user name.</FormHelperText>
                </FormControl>
                <FormControl id="email" my={3}>
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" value={email} required onChange={changeEmail}/>
                    <FormHelperText>Enter your correct email.</FormHelperText>
                </FormControl>
                <FormControl id="dob">
                    <FormLabel>Date of birth</FormLabel>
                    <Input type="text" value={dob} required onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{
                        setDob(e.target.value)
                    }}/>
                    <FormHelperText>Enter date of birth (yyyy-mm-dd)</FormHelperText>
                </FormControl>
                <FormControl id="password" mt={3}>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="pwd" required onChange={changePwd}/>                
                </FormControl>            
                <FormControl id="password" mt={3}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type="password" name="repwd" required onChange={changeRePwd}/>                
                </FormControl>
                { error && <Text color="red" my={5}>{error}</Text>}
                {
                    showLoader ? <Box mx="auto" w="100%" textAlign="center" mt={5}>
                        <Spinner color="green.500" />
                    </Box> :<>
                        <Button type="submit" colorScheme="green" size="lg" w="100%" mt={5}>Sign Up</Button>
                        <Button color="blue.500" variant="link" size="lg" mt={8} w="100%" onClick={onLogin}>
                            I have already account! Login
                        </Button>
                    </>
                }                
                
            </form>
            </Box>
        </Flex>
        </Flex>
    )
}

export default SignUp;