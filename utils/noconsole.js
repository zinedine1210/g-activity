// lib/noConsole.js
if (process.env.NODE_ENV === 'production') {
    console.log = function () { };
}
