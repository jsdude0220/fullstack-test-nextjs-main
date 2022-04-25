import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useAuth } from 'context/AuthUserContext';
import { Box, Input, Flex, Button, Spinner } from "@chakra-ui/react";
import { Utils } from "utils/Utils";


const LogIn = () => {
    const { loading, signInWithEmailAndPassword, token , storeToken, profile, storeProfile} = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState<string>('')
    const [pwd, setPwd] = useState<string>('')

    const [showSpinner, setShowSpinner] = useState(false)
    useEffect(() => {
        console.log('Login token : >>>>>> ', token, loading)

      if (!!token  && !loading){
        router.push('/')
      }
        
    }, [token, loading])


  
    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
      
        let val = e.target.value;
        setEmail(val)
    };

    const onChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val: string = e.target.value;
        setPwd(val)
    }

    const handleSignup = ()=>{
        router.push('/signup')
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setShowSpinner(true)
        signInWithEmailAndPassword(email, pwd).then(async(res)=>{
            console.log(res.user)
            const idToken = await res.user.getIdToken()
            // getCustomToken
            const rawResponse = await fetch(Utils.endpoint + 'profiles/login/' + res.user.uid, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${idToken}`,
                },
                // body: JSON.stringify({                    
                //     uid: res.user.uid
                // })
            });

            const resJson = await rawResponse.json()
            console.log('resJson login : ', resJson)
            storeToken(resJson.token)
            storeProfile(resJson.profile.profile)
            setShowSpinner(false)
        }).catch(ex=>{

            alert(ex.message)
            setShowSpinner(false)
        })


    }

    return (
        <Flex
            w="100vw"
            h="100vh"            
            justify="center"
            align="center"
        >
            <Flex
                direction="column"
                justify="flex-start"
                align="center"
                w = "400px"
                maxW="90%"
            >
            <form onSubmit={onSubmit} >
                <Input
                    placeholder="Email"
                    size="lg"
                    onChange={onChangeEmail}
                    value={email}
                    mt={6}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    size="lg"
                    onChange={onChangePwd}
                    value={pwd}
                    mt={6}
                />
                {
                    showSpinner ? <Box mx="auto" w="100%" textAlign="center" mt={5}>
                        <Spinner color="green.500" />
                    </Box> : <Button type="submit" colorScheme="pink" size="lg" mt={8} w="100%">
                        Log in
                    </Button>
                }                
                <Button color="blue.500" variant="link" size="lg" mt={8} w="100%" onClick={handleSignup}>
                    Don't you have account yet? Signup
                </Button>
            </form>
            </Flex>
        </Flex>
    )
}
  
export default LogIn;