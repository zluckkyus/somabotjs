const abbrev = require("./abbrev.js");
const renderEmoji = require("./renderEmoji.js");

module.exports = class Util {
  static toAbbrev(num) {
    return abbrev(num);
  }

  static renderEmoji(ctx, msg, x, y) {
    return renderEmoji(ctx, msg, x, y);
  }
};