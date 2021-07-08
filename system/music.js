const ytdl = require("ytdl-core");
const { MessageEmbed } = require("discord.js");
const { QUEUE_LIMIT, COLOR } = require("../config.json");

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);
    let embed = new MessageEmbed().setColor(COLOR);

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      embed.setAuthor("Dispatcher queue ended ");
      embed.setDescription(
        `Add some more songs-`
      );
      return queue.textChannel.send(embed).catch(console.error);
    }

    try {
      var stream = await ytdl(song.url, {
        highWaterMark: 1 << 25
      });
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      if (error.message.includes === "copyright") {
        return message.channel.send("THIS VIDEO CONTAINS COPYRIGHTED CONTENT");
      } else {
        console.error(error);
      }
    }

    const dispatcher = queue.connection
      .play(stream)
      .on("finish", () => {
        if (queue.loop) {
          let lastsong = queue.songs.shift();
          queue.songs.push(lastsong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", console.error);

    dispatcher.setVolumeLogarithmic(queue.volume / 100); //VOLUME
    embed
      .setAuthor(
        "💿 | Started Playing Your Song",
        message.client.user.displayAvatarURL()
      )
      .setDescription(`**[${song.title}](${song.url})**`)
      .setImage(`${song.thumbnail}`)
      .setFooter("By CreativePie");

    queue.textChannel
      .send(embed)
      .catch(err =>
        message.channel.send("Unable to play song, Dm CreativePie#4321")
      );
  }
};
