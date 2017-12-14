'use strict'

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
		message:'Username Lo',
		mask:'8'
	},
	{
		type:'input',
		name:'sleep',
		message:'Waktu yang diinginkan (Reccomend min:380000MemekSecond)',
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

const Unfollow = async function(session, accountId){
	try {
		await Client.Relationship.destroy(session, accountId);
		return chalk`{bold.green TOPCER}`;
	} catch (err){
		return chalk`{bold.red Sayang Sekali}`;
	}
}

const Excute = async function(User,sleep){
	
	try {
		console.log(chalk`{yellow [?] Sedang Login Mek ....}`);
		const doLogin = await Login(User);
		console.log(chalk`{green [!] Login Succsess Ngopi Yukss,}{yellow Try to Unfollow All Following ....}`)
		const feed = new Client.Feed.AccountFollowing(doLogin.session, doLogin.account.id);
		var cursor;
		do{
			if (cursor) feed.setCursor(cursor);
			var getPollowers = await feed.get();
			getPollowers = _.chunk(getPollowers, 50);
			for (let i = 0; i < getPollowers.length; i++) {
				await Promise.all(getPollowers[i].map(async(account) => {
					const doUnfollow = await Unfollow(doLogin.session, account.id);
					console.log(chalk`Unfollow {yellow @${account.params.username}} [{cyan ${account.id}}] => ${doUnfollow}`);
				}));
				console.log(chalk`{yellow [!] Sabar mek ${sleep} MiliSeconds}`);
				await delay(sleep);
			}
			cursor = await feed.getCursor();
		} while(feed.isMoreAvailable())
		console.log(chalk`{bold.green [+] Memusnakan semua sukses tinggal ngopi doang}`)
	} catch(e) {
		console.log(e)
	}

}

console.log(chalk`
{bold Instagram Memusnakan Semuanya}
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
