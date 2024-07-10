// ydoc.js
import * as Y from 'yjs';

const ydocMap = {};

export const getYDocInstance = (roomId) => {
    if (!ydocMap[roomId]) {
        ydocMap[roomId] = new Y.Doc();
    }
    return ydocMap[roomId];
};

export const cleanUpYDocInstance = (ydoc, roomId) => {
    ydoc.destroy()
};
