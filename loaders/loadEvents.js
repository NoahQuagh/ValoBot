const fs = require("fs")


module.exports = async bot => {
    fs.readdirSync("./events").filter(f=>f.endsWith(".js")).forEach(file => {
        let event = require(`../events/${file}`)
        bot.on(file.split(".js").join(""), event.bind(null,bot))
        console.log('\x1b[32m%s\x1b[0m',"[ OK ]",` Evenement ${file} chargé`)
    })
}