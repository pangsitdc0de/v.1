'use strict'

/** BOT LIKE Instagram V.2 **/
/** Code By PangsitDc0de **/
/** pangsitdc0de@outlook.com **/
/** NewYear2k18 | NoMoneyNoLife | CrazyFriends404 | AKAMSIE. Pauwa **/

const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const inquirer = require('inquirer');

const User = [
    {
        type:'input',
        name:'username',
        message:'username Lo',
	validate: function(value){
		if(!value) return 'Can\'t Empty';
		return true;
	}
    },
    {
        type:'password',
        name:'password',
        message:'Password Lo',
        mask:'8',
	validate: function(value){
		if(!value) return 'Can\'t Empty';
		return true;
	}
    }
]

const Login = async function(User){

    /** Save Account **/
    const Device = new Client.Device(User.username);
    const Storage = new Client.CookieMemoryStorage();
    const session = new Client.Session(Device, Storage);

    try {
        await Client.Session.create(Device, Storage, User.username, User.password)
        const account = await session.getAccount();
        return Promise.resolve({session,account});
    } catch (err) {
        return Promise.reject(err);
    }

}

const Timeline = async function(session,count,cursor){
    var getCursor;
    count++;
    /** New Feed **/
    const feed = new Client.Feed.Timeline(session);
    
    /** Cursor Detect **/
    if (cursor) {
        feed.setCursor(cursor);
    }

    try {
        const media = await feed.get();
        console.log('[+] Cursor => %s', count);
        await Promise.all(media.map(async(media) => {
            Like(session,media);
        }));
        if (count < 3) {
            getCursor = await feed.getCursor();
            await Timeline(session,count,getCursor);
        } else {
            console.lg('[-] 3 menit aja ngocok keluar (Delay 180s)');
            await delay(1800000);
            count=0;
            await Timeline(session,count);
        }
    } catch(err) {
        return Promise.reject(err);
    }

}

const Like = async function(session,media){

    try {
        if (media.params.hasLiked === false){
            const Like = await Client.Like.create(session, media.params.id);
           console.log(chalk`[{bold.cyan ${media.id}}] Username : ${media.params.user.username} => {bold.green Liked}`);
        } else {
            console.log(chalk`[{bold.cyan ${media.id}}] Username : ${media.params.user.username} => {bold.red Already Liked}`);
        }
    } catch (err) {
        return Promise.reject(err);
    }

}

const Excute = async function(User){
    try {
        const count = 0;
        const doLogin = await Login(User);
        await Timeline(doLogin.session,count);
    } catch (err) {
        console.log(err);
    }
}

console.log(chalk`
{bold BOT LIKE Instagram V.2}
{green NoMoneyNoLife - CrazyFriends404 - NewYear2k18 - AKAMSIE.Pauwa}
{bold.red Code By pangsitdc0de | pangsitdc0de.outlook.com}
`);

inquirer.prompt(User)
    .then(answers => {
        Excute({
            username:answers.username,
            password:answers.password
        });
    })
