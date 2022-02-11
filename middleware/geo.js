const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./async");
const sendEmail = require("../utils/sendEmail");
const geo = require("node-geo-distance");
const { authMessages } = require("../Helpers/messages");
const { securityIssueEmail } = require("../views/emailTemplates");
const User = require("../models/User");
const crg = require("country-reverse-geocoding").country_reverse_geocoding();

module.exports.geoDistanceCase = asyncHandler(
  async (geoLocation, userId, next) => {
    const deactivationUrl = `http://localhost:3000/deactivate-my-account/${geoLocation.IPv4}/${userId}`; //Build personified url to deactivate
    const verifyIPUrl = `http://localhost:3000/verify-my-ip/${geoLocation.IPv4}/${userId}`; //Build personified url to deactivate
    const { longitude, latitude } = geoLocation;
    const user = await User.findById(userId);
    const distance =
      geo.vincentySync(
        { longitude: parseInt(longitude), latitude: parseInt(latitude) },
        {
          longitude: parseInt(
            user.loginIPs.IPs[user.loginIPs.IPs.length - 1].longitude
          ),
          latitude: parseInt(
            user.loginIPs.IPs[user.loginIPs.IPs.length - 1].latitude
          ),
        }
      ) / 1000;
    if (distance >= parseInt(process.env.LOGIN_CRITICAl_GEO_DISTANCE)) {
      const country = crg.get_country(parseInt(latitude), parseInt(longitude));
      const html = securityIssueEmail(
        country.name,
        deactivationUrl,
        verifyIPUrl
      );
      user.loginIPs.IPs.push({
        ...geoLocation,
        loginDate: new Date(),
        isTrusted: false,
      });
      await user.save();
      await sendEmail({
        email: user.email,
        subject: "Critical Security Alarm",
        html,
        type: "SECURITY-ALERT",
      });
      return next(new ErrorResponse(authMessages.notAuthorizedEn, 401));
    } else {
      user.loginIPs.IPs.push({
        ...geoLocation,
        loginDate: new Date(),
        isTrusted: true,
      });
      await user.save();
    }
    next();
  }
);
