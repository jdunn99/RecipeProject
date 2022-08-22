import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';
import React from 'react';
import { useUserQuery } from '../utils/queries/useUserQuery';
import {
    MutationAction,
    useCollectionMutation,
} from '../utils/mutations/useCollectionMutation';

const Home: NextPage = () => {
    const { data: session } = useSession();
    const [result, setResult] = React.useState<any>();
    const { data } = useUserQuery(session?.user?.id);
    const { mutate } = useCollectionMutation();

    async function submit() {
        mutate({ action: MutationAction.CREATE, params: { name: 'Test' } });
    }

    async function deleteCollection(id: string) {
        mutate({ action: MutationAction.DELETE, params: { id } });
    }

    return (
        <React.Fragment>
            <Head>
                <title>Recipe Project</title>
            </Head>

            <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
                <p>{JSON.stringify(session)}</p>
                <button onClick={submit}>Test</button>
                {result && <p>{JSON.stringify(result)}</p>}
                {data && (
                    <div>
                        {data.createdCollections.map((collection: any) => (
                            <div
                                className="flex gap-2 my-2"
                                key={collection.id}
                            >
                                <div>{JSON.stringify(collection)}</div>
                                <button
                                    onClick={() => {
                                        deleteCollection(collection.id);
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </React.Fragment>
    );
};

export default Home;
