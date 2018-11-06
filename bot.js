require('http').createServer().listen(3000)

const Discord = require("discord.js"); 
const client = new Discord.Client(); 
const config = require("./config.json");



client.on("ready", () => {
  console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`); 
  client.user.setPresence({ game: { name: 'TV Globinho', type: 3, url: 'https://www.youtube.com/channel/UC0GVqKd0OUiliv8nwdi8x2Q'} });


    });

    client.on("guildCreate", guild => {
      console.log(`O bot entrou nos servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
      client.user.setActivity(`Estou em ${client.guilds.size} servidores`);
    });
    
    client.on("guildDelete", guild => {
      console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
      client.user.setActivity(`Estou em ${client.guilds.size} servidores`);
    });
    
    
    client.on("message", async message => {
    
        if(message.author.bot) return;
        if(message.channel.type === "dm") return;
        if(!message.content.startsWith(config.prefix)) return;
    
      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const comando = args.shift().toLowerCase();
      
      
      if(comando === "ping") {
        const m = await message.channel.send("Calculando...");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latência da API é ${Math.round(client.ping)}ms`);
      }
      
      if(comando === "dizer") { 
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{});  
        message.channel.send(sayMessage);
      }
    
      if(comando === "apagar") {
        const deleteCount = parseInt(args[0], 10);
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply("Por favor, forneça um número entre 2 e 100 para o número de mensagens a serem excluídas");
        
        const fetched = await message.channel.fetchMessages({limit: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Não foi possível deletar mensagens devido a: ${error}`));
      }
      
      if(comando === "kick") {
    
        if(!message.member.roles.some(r=>["Dono", "Nome de outro cargo 2"].includes(r.name)) )
          return message.reply("Desculpe, você não tem permissão para usar isto!");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!member)
          return message.reply("Por favor mencione um membro válido deste servidor");
        if(!member.kickable) 
          return message.reply("Eu não posso expulsar este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de expulsar?");
        
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "Nenhuma razão fornecida";
        
        await member.kick(reason)
          .catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido o: ${error}`));
        message.reply(`${member.user.tag} foi kickado por ${message.author.tag} Motivo: ${reason}`);
    
      }
      
      if(comando === "ban") {
        
        if(!message.member.roles.some(r=>["Dono"].includes(r.name)) )
          return message.reply("Desculpe, você não tem permissão para usar isto!");
        let member = message.mentions.members.first();
        if(!member)
          return message.reply("Por favor mencione um membro válido deste servidor");
        if(!member.bannable) 
          return message.reply("Eu não posso banir este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de banir?");
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "Nenhuma razão fornecida";
        await member.ban(reason)
          .catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
        message.reply(`${member.user.tag} foi banido por ${message.author.tag} Motivo: ${reason}`);
      }

      if(comando === "serverinfo") {

         let online = message.guild.members.filter(member => member.user.presence.status !== 'offline');
         let day = message.guild.createdAt.getDate()
         let month = 1 + message.guild.createdAt.getMonth()
         let year = message.guild.createdAt.getFullYear()
         let sicon = message.guild.iconURL;
         let serverembed = new Discord.RichEmbed()
         .setAuthor(message.guild.name, sicon)
         .setFooter(`Server Criado • ${day}.${month}.${year}`)
         .setColor("#7289DA")
         .setThumbnail(sicon)
         .addField("ID", message.guild.id, true)
         .addField("Nome", message.guild.name, true)
         .addField("Dono", message.guild.owner.user.tag, true)
         .addField("Região", message.guild.region, true)
         .addField("Canais", message.guild.channels.size, true)
         .addField("Membros", message.guild.memberCount, true)
         .addField("Humanos", message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size, true)
         .addField("Bots", message.guild.members.filter(m => m.user.bot).size, true)
         .addField("Online", online.size, true)
         .addField("Regras", message.guild.roles.size, true);
         message.channel.send(serverembed);
      
      }
      
    });
    
    client.login(process.env.TOKEN);
    
