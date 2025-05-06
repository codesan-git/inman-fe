import { createContext, useContext } from 'solid-js';
import { useQuery } from '@tanstack/solid-query';
import axios from 'axios';
import { apiUrl } from '~/hooks/apiUrl';
import { Me } from '~/types/me.types';
import type { JSX } from 'solid-js';

import { UseQueryResult } from '@tanstack/solid-query';

const UserContext = createContext<UseQueryResult<Me, Error> | undefined>(undefined);

export function UserProvider(props: { children: JSX.Element }) {
  const query = useQuery<Me>(() => ({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/me`, { withCredentials: true });
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // cache 5 menit
    retry: 1,
  }));
  return (
    <UserContext.Provider value={query}>
      {props.children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext)!;
}
