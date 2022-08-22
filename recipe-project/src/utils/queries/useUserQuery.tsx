import React from 'react';
import { QueryFunctionContext, useQuery } from 'react-query';

/**
 * Fetches a User by ID.
 * TODO: Error Handling
 */
async function fetchUserById({ queryKey }: QueryFunctionContext) {
    const [_key, value] = queryKey;

    const response = await fetch(`/api/user/${value as string}`);
    const json = await response.json();

    return json;
}

/**
 * Generic hook for fetching Users via React Query
 * @param id - the ID of the User being fetched
 */
export function useUserQuery(id?: string) {
    return useQuery(['user', id], fetchUserById, { enabled: !!id });
}
