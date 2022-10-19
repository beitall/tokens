const nextTokens = {
  core: require("momentum-abstract/color/core.json"),
};

const prevTokens = {
  decorative: require("../../../core/color/decorative.json"),
  functional: require("../../../core/color/functional.json"),
  gradation: require("../../../core/color/gradation.json"),
};

const utils = require("../../utils");
const common = require("../../common");
const { ColorToken, GradientToken } = require("../../models");

/**
 * Update all tokens within this project.
 */
const update = () => {
  // Next tokens are mapped onto legacy tokens. These must be normalized to
  // match the existing local tokens.
  const next = {
    functional: new ColorToken({
      format: ColorToken.CONSTANTS.TOKEN_FORMATS.AUTOMATED,
      data: nextTokens.core["core color"],
    }).normalize(),
    decorative: new ColorToken({
      format: ColorToken.CONSTANTS.TOKEN_FORMATS.AUTOMATED,
      data: nextTokens.core["decorative color"],
    }).normalize(),
    gradation: new GradientToken({
      format: ColorToken.CONSTANTS.TOKEN_FORMATS.AUTOMATED,
      data: { gradation: nextTokens.core["gradation color"] }, // automated gradation token is missing the `gradation` key.
    }).normalize(),
  };

  // Prev tokens are local tokens to be updated with the next tokens.
  const prev = {
    functional: new ColorToken({
      format: ColorToken.CONSTANTS.TOKEN_FORMATS.STANDARD,
      data: prevTokens.functional.color,
    }),
    decorative: new ColorToken({
      format: ColorToken.CONSTANTS.TOKEN_FORMATS.STANDARD,
      data: prevTokens.decorative.color,
    }),
    gradation: new GradientToken({
      format: ColorToken.CONSTANTS.TOKEN_FORMATS.STANDARD,
      data: prevTokens.gradation.color,
    }),
  };

  // Final tokens are the prev tokens [local] after updating with new values
  // from the next tokens [automated via dependency].
  const final = {
    functional: prev.functional.merge({ token: next.functional }),
    decorative: prev.decorative.merge({ token: next.decorative }),
    gradation: prev.gradation.merge({ token: next.gradation }),
  };

  // Write the tokens to the file system.
  utils.writeToken(common.CONSTANTS.TOKENS.STANDARD.PATHS.CORE.COLOR.DECORATIVE, final.decorative.serial);
  utils.writeToken(common.CONSTANTS.TOKENS.STANDARD.PATHS.CORE.COLOR.FUNCTIONAL, final.functional.serial);
  utils.writeToken(common.CONSTANTS.TOKENS.STANDARD.PATHS.CORE.COLOR.GRADATION, final.gradation.serial);
};

module.exports = update;
