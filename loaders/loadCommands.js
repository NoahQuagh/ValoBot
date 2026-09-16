const fs = require("fs")


module.exports = async bot => {
    fs.readdirSync("./commands").filter(f=>f.endsWith(".js")).forEach(file => {
        let command = require(`../commands/${file}`)
        if(!command.name || typeof command.name !== "string") {
            console.log('\x1b[31m%s\x1b[0m',`[ ERR ]`,` La commande ${file.slice(0,file.length - 3)} n'a pas de nom`)
        }
        bot.commands.set(command.name, command)
        console.log('\x1b[32m%s\x1b[0m',"[ OK ]",` Commande ${file} chargé`)
    })
}