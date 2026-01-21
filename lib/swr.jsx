import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function SWR(url, interval = 3000) {
    return useSWR(url, fetcher, { refreshInterval: interval });
};
