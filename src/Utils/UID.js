export default class UID {
    static get(prefix) {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 16; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

            return ( prefix || '') + text;
    }
}