import { config } from 'dotenv';
config();

import { Client, Intents } from 'discord.js';
import chk from './chk.js';

import axios from 'axios';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const blacklist: {
    url: string,
    name: string
}[] = [];

client.on('messageCreate', async message => {
    const URLs = message.content.match(/((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g);
    if ( URLs === null || URLs.length < 0 ) return;

    const invites = (await Promise.all(URLs.flatMap(url => {
        if (url.match(/discord\.com\/invite\/(.*)(\/|)/)) { return [url]; }
        if (url.match(/discord\.gg\/(.*)(\/|)/)) { return [url.replace(/discord\.gg/, 'discord.com/invite')]; }
        return [];
    }).flatMap(async (url) => {
        const search = blacklist.filter(v => v.url === url);
        if ( search.length > 0 ) {
            console.log(`ブラックリストに合致: ${url}`)
            return [search[0]];
        }
        try {
            const response = await axios.get<string>(url);
            return [
                    {
                    url: url,
                    name: response.data
                        .replace(/\r/g, '')
                        .replace(/\n/g, '')
                        .replace(/(.*)<meta property=\"og:title\" content=\"Join the (.*?) Discord Server!(.*)\" \/>(.*)/, '$2')
                    }
                ];
        } catch {
            return [];
        }
    }))).flat();
    const black = invites.filter(v => chk(v.name));
    black.forEach(v => {
        if ( blacklist.filter(v => v.url === v.url).length < 1 ) {
            blacklist.push(v);
            console.log(`ブラックリスト追加 - ${v.name}: ${v.url}`);
        }
    });
    if ( black.length > 0 ) {
        message.delete();
        console.log(`メッセージを削除 - サーバー名: ${invites[0].name}, メッセージ: ${message.content}`);
    }
});

client.login(process.env.BOT_TOKEN);
