import axios from 'axios';

export const getApi = (url: string) => axios.get(url).then((res) => res.data);
