'use strict'

/** Auto Delete Media Instagram **/
/** CODE By pangsitDc0de **/
/** Pangsitdc0de@outlook.com **/
/** BNoMoneyNoLive - CrazyFriends404 - NewYear2k18 | AKAMSI.Pauwa **/

const Client = require('instagram-private-api').V1;
const delay = require('delay');
const chalk = require('chalk');
const _ = require('lodash');
const inquirer = require('inquirer');

const User = [
	{
		type:'input',
		name:'username',
		message:'Username Lo'
	},
	{
		type:'password',
		name:'password',
		message:'Password Lo',
		mask:'8'
	},
	{
		type:'input',
		name:'sleep',
		message:'Waktu yang Diingingkan (In MiliSeconds)',
		validate: function(value){
			value = value.match(/[0-9]/);
			if (value) return true;
			return 'Delay is number';
		}
	}
]

const Login = async function(User){

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

const Media = async function(session, id){
	const Media = new Client.Feed.UserMedia(session, id);

	try {
		const Poto = [];
		var cursor;
		do {
			if (cursor) Media.setCursor(cursor);
			const getPoto = await Media.get();
			await Promise.all(getPoto.map(async(poto) => {
				Poto.push({
					id:poto.id,
					link:poto.params.webLink
				});
			}))
			cursor = await Media.getCursor()
		} while (Media.isMoreAvailable());
		return Promise.resolve(Poto);
	} catch (err){
		return Promise.reject(err);
	}
}

const Delete = async function(session, id){
	try {
		await Client.Media.delete(session,id);
		return true;
	} catch (err) {
		return false;
	}
}


const Excute = async function(User,sleep){
	try {
		
		/** TRY TO LOGIN **/
		console.log('\n[?] Sedang Login Mek ..');
		const doLogin = await Login(User);
		console.log(chalk`{bold.green [+] Login Succsess Mending Kita sholat dulu}`);

		/** TRY TO GET ALL MEDIA **/		
		console.log('[?] Ini lagi check photo lu jelek apa kaga ..')
		var getMedia = await Media(doLogin.session, doLogin.account.id);
		console.log(chalk`{bold.green [+] Eh Sukses Ke photo Jelek lo. Media Length : ${getMedia.length}}\n`);
		getMedia = _.chunk(getMedia, 10);

		/** TRY TO DELETE ALL MEDIA **/
		for (let i = 0; i < getMedia.length; i++) {
			console.log('[?] Bakal Lo Bonus Yang Jelek\n')
			await Promise.all(getMedia[i].map(async(media) => {
				const doDelete = await Delete(doLogin.session, media.id);
				const PrintOut = chalk`> ${media.link} => ${doDelete ? chalk`{bold.green Sukses}` : chalk`{bold.red Gagal}`}`
				console.log(PrintOut);
			}))
			console.log(chalk`>> {yellow Delay For ${sleep} MiliSeconds}`)
			await delay(sleep)
		}

	} catch (err) {
		console.log(err);
	}
}

console.log(chalk`
{bold Instagram Auto Delete Media}
{green NoMoneyNoLive - CrazyFriends404 - NewYear2k18 | AKAMSI.Pauwa}
{bold.red Code By pangsitDc0de}
`);
inquirer.prompt(User)
	.then(answers => {
		Excute({
			username:answers.username,
			password:answers.password
		},answers.sleep);
	})
