export default function initApp() {
    (Object.prototype as any).setItem = function (str: string, value: unknown) {
        console.log(str, value);
    };
}