/// <reference types="vite/client" />

declare module 'mp4box' {
    export interface MP4Info {
        videoTracks: any[];
    }
    export interface MP4Sample {
        is_sync: boolean;
        cts: number;
        duration: number;
        data: Uint8Array;
    }
    export interface MP4File {
        onReady: (info: MP4Info) => void;
        onError: (e: any) => void;
        onSamples: (id: number, user: any, samples: MP4Sample[]) => void;
        setExtractionOptions: (id: number, user: any, options: { nbSamples: number }) => void;
        start: () => void;
        appendBuffer: (buffer: ArrayBuffer) => void;
        flush: () => void;
        getTrackById: (id: number) => any;
    }
    export function createFile(): MP4File;
    export class DataStream {
        constructor(buffer?: ArrayBuffer, offset?: number, endianness?: boolean);
        buffer: ArrayBuffer;
        static BIG_ENDIAN: boolean;
        static LITTLE_ENDIAN: boolean;
    }
}
