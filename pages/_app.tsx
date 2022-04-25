import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react"
import { AuthUserProvider } from 'context/AuthUserContext';
import 'react-quill/dist/quill.snow.css'

const MyApp = ({ Component, pageProps }) => {
  return <AuthUserProvider>
    <ChakraProvider><Component {...pageProps} /></ChakraProvider>
  </AuthUserProvider>;
};

export default MyApp;
