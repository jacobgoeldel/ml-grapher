import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, DarkMode } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { ReactFlowProvider } from 'reactflow'

const config = {
    initialColorMode: 'dark',

    useSystemColorMode: false,
}
const theme = extendTheme({ config });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <DarkMode>
                <ReactFlowProvider>
                    <Component {...pageProps} />
                </ReactFlowProvider>
            </DarkMode>
        </ChakraProvider>
    )
}
