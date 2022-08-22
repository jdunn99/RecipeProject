import { Collection } from '@prisma/client';
import { QueryClient, useMutation, useQueryClient } from 'react-query';
import { promise } from 'zod';

export enum MutationAction {
    CREATE,
    UPDATE,
    DELETE,
}

interface Payload {
    action: MutationAction;
    params: any; // Should probably be a generic in the future
}

/**
 * Fetches our API based on the Payload Action
 * Follows a similar pattern to Flux/Redux
 */
function mutate({ action, params }: Payload) {
    switch (action) {
        case MutationAction.CREATE:
            return fetch('/api/collection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
        case MutationAction.DELETE:
            return fetch(`/api/collection/${params.id}`, { method: 'DELETE' });
    }

    return Promise.resolve(null);
}

/**
 * Updates any specific pieces of the cache based on the action
 */
async function updateCache(
    data: any,
    { action }: Payload,
    queryClient: QueryClient
) {
    try {
        const result = await data.json();
        if (!result) throw new Error();

        if (result.error) throw new Error(result.error);

        // All API methods for Collection return the creatorId param
        const user = queryClient.getQueryData([
            'user',
            result.creatorId,
        ]) as any;

        switch (action) {
            case MutationAction.CREATE: {
                queryClient.setQueryData(['user', result.creatorId], {
                    ...user,
                    createdCollections: [...user.createdCollections, result],
                });
                return;
            }
            case MutationAction.DELETE: {
                queryClient.setQueryData(['user', result.creatorId], {
                    ...user,
                    createdCollections: user.createdCollections.filter(
                        (collection: Collection) => {
                            return collection.id !== result.collectionId;
                        }
                    ),
                });
                return;
            }
        }
    } catch (error) {
        return error;
    }
}

/**
 * Generic hook for creating a Collection and updating the cache properly
 */
export function useCollectionMutation() {
    const queryClient = useQueryClient();

    // TODO: fix any type
    return useMutation<any, any, Payload>(
        // Fetch our data
        mutate,
        {
            onSuccess: (data, variables) =>
                updateCache(data, variables, queryClient),
        }
    );
}
