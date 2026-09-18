import { useContext } from "react";
import { useQuery } from "react-query";
import { store } from "../store";

export interface Channel {
    userID: string,
    name: string
}

export function useChannels(): Array<Channel> {
    const { state } = useContext(store);
    const apiBaseUrl = state.apiBaseUrl;

    const { data } = useQuery<Array<Channel>, Error>(["channels", apiBaseUrl], async ({ signal }) => {
            const response = await fetch(
                new URL(`${apiBaseUrl}/channels`).toString(),
                {signal}
            );

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const body = await response.json() as { channels: Array<Channel> };
            return body.channels;
        },
        {
            enabled: Boolean(apiBaseUrl),
            staleTime: Infinity,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
        }
    );

    return data ?? [];
}
