const { MessageEmbed } = require("discord.js");

const { COLOR } = require("../config.json");

module.exports = {
  name: "np",
  description: "Get the name of current playing song",
  execute(client, message, args) {
    let embed = new MessageEmbed().setColor(COLOR);

    const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      embed.setAuthor("YOU NEED TO BE IN VOICE CHANNEL :/");
      return message.channel.send(embed);
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      embed.setAuthor("Bot is not playing anything");
      return message.channel.send(embed);
    }

    embed
      .setDescription(`📀 | **Now Playing** | ${serverQueue.songs[0].title}`)
      .setImage(serverQueue.songs[0].thumbnail)
      .setFooter("By BestWay Studios, V2!")
      .setTimestamp();
    message.channel.send(embed);
  }
};
