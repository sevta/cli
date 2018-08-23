#!/usr/bin/env node

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const program = require('commander')
const { prompt } = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const fse = require('fs-extra')
const ls = require('ls')
const curr_path = process.cwd()

const npm = require('npm')

const fs = require('fs')
const path = require('path')
const cpx = require('cpx')

const port = 3000

let filename = 'gulpfile.js'
let src = path.join(__dirname , filename)
let target = path.join(curr_path , '/')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/' , (req , res) => res.send(running_q))

const running_q = [
	{
		type: 'input' ,
		name: 'name' ,
		message: 'Whats your name'
	} ,
	{
		type: 'list' ,
		name: 'task' ,
		message: 'What task do you want' ,
		choices: ['gulp' , 'grunt'] ,
		default: 0
	} ,
	{
		type: 'confirm' ,
		name: 'laravel' ,
		message: 'Are you using laravel'
	} ,
	{
		type: 'list' ,
		name: 'prepocessor' ,
		message: 'What do you use SCSS or SASS' ,
		choices: ['scss' , 'sass'] ,
		default: 0
	} , 
	{
		type: 'confirm' ,
		name: 'react' ,
		message: 'Want to using React' ,
	} ,
	{
		type: 'confirm' ,
		name: 'install' ,
		message: 'NPM install ?'
	}
]

program
	.version('0.1.0')
	.description('Sevta aduh')

program
	.command('test')
	.action(() => {
		cpx.copy(src , target , () => {
			console.log('SUCCESS')
		})
	})

program
	.command('run')
	.alias('r')
	.action((dir , cmd) => {
		run()
	})

program
	.command('task')
	.action(() => {
		console.log(chalk.yellow.bold(
			figlet.textSync('* TESI RUNNER *') , 
			figlet.textSync('')
		))
		prompt(running_q)
			.then(data => addTask(data))
			.catch(err => console.log(err))
	})

program
	.command('add people')
	.option('add')
	.action(() => {
		prompt({
			type: 'input' ,
			name: 'firstname' ,
			message: 'Enter firstname...'
		}).then(answer => addPeople(answer))
	})

program.parse(process.argv)

function copyFile(src , dest) {
	let readStream = fs.createReadStream(src)

	readStream.once('error' , err => console.log(err))
	readStream.once('end' , () => console.log('Done copying'))

	readStream.pipe(fs.createWriteStream(dest))
}

function copy() {
	let src2 = path.join(__dirname , './testgulpfile.js')
	console.log('current path' , path.join(curr_path , '/'))
	console.log('curent executable path' , src2)
	

	fse.copySync( src2 , path.join(curr_path , './') , err => {
		if (err) {
			console.log('error broh' , err)
		} else {
			console.log('SUCCESS')
		}
	})
}

function npmInstall(pkg) {
	npm.load(err => {
		if (err) {
			console.log(err)
		} else {
			npm.commands.install(pkg , (err , data) => {
				if (err) {
					console.log(err)
				} else {
					console.log(
						chalk.green.bold(
							figlet.textSync('success install')
						) ,
						'' ,
						chalk.white('makasih loh')
					)
				}
			})
		}
	})
}

function addTask(data) {
	console.log(chalk.bgGreen.white('wait.....'))
	console.log('')
	
	let installPkg = []

	if (data.task == 'gulp') {
		cpx.copy(src , target , () => {
			console.log('SUCCESS copying')
		})
		installPkg = ['gulp' , ...installPkg]
	} else if ( data.task == 'grunt' ) {
		console.log('grunt soon')
	}

	if (!data.laravel) {
		console.log('NOT LARAVEL')
	}

	if (data.prepocessor == 'scss') {
		console.log('youre using SCSS')
		installPkg = ['scss' , 'autoprefixer' , ...installPkg]
	}

	if (data.install) {
		npmInstall(installPkg)
	}

}

function addPeople(user) {
	console.log(`Oke ${user.firstname} lets do this`)
}

function run(answer) {
	app.listen(answer.port || port , () => console.log(`Server Listen on port ${answer.port}`))	
}
