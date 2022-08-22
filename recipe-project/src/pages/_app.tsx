// src/pages/_app.tsx
import type { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

const client = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <QueryClientProvider client={client}>
            <Hydrate state={pageProps.dehydratedState}>
                <SessionProvider session={pageProps.session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </Hydrate>
        </QueryClientProvider>
    );
};

export default MyApp;
