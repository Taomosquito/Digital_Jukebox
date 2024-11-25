interface Song {
    id: string;
    title: string;
    duration: number;
    artist: {
        name: string;
    };
    album: {
        cover: string;
        title: string;
    };
    preview: string;
}
interface ApiResponse {
    data: Song[];
}
interface UseMusicApiReturn {
    data: ApiResponse | null;
    loading: boolean;
    error: Error | null;
}
declare const useMusicApi: (query: string) => UseMusicApiReturn;
export default useMusicApi;
