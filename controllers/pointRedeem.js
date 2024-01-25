const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");
const sgMail = require("../db/mailconfig");
const users = require("../controllers/users");
const fs = require("fs");

async function getPointRedeemList() {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()

      .execute("Rewards.sp_GetRedeemPointsList");

    return result.recordset;
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
    return [];
  } finally {
    // Close the database connection
    sql.close();
    //cleanupResources();
  }
}

// async function getuserdetail(userId) {
//   try {
//     users.getUserDetail(userId).then((result) => {
//       response.json(result);
//       console.log(response.json(result));
//     });
//   } catch (error) {
//     console.error("Error processing tokens:", error);
//     throw error; // Re-throw the error for further handling
//   }
// }

async function insertRedeemPoint(userId, point) {
  try {
    const pool = await poolPromise;
    var firstName, email, countryId, roleId, voucher, toEmails;

    // Retrieve user details from the database based on UserId
    const userQuery =
      "SELECT UserId, FirstName, LastName, Username,RoleId,CountryId FROM tblUser WHERE UserId = @UserId  and IsActive=1";
    const userResult = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .query(userQuery);

    const user = userResult.recordset[0];

    if (!user) {
      throw new Error("User not found");
    } else {
      firstName = user.FirstName + " " + user.LastName;
      email = user.Username;
      countryId = user.CountryId;
      roleId = user.RoleId;
      console.log(firstName, email, countryId, roleId);
    }
    // Retrieve poiint details from the database
    const pointQuery =
      "SELECT Voucher FROM tblRedeemPointMaster WHERE Point = @Point and IsActive=1";
    const pointResult = await pool
      .request()
      .input("Point", sql.Int, point)
      .query(pointQuery);

    const points = pointResult.recordset[0];

    if (!points) {
      throw new Error("Point not found");
    } else {
      voucher = points.Voucher;
      console.log(voucher);
    }
    if (countryId !== 140) {
      var emailQuery = "";
      if (roleId === 3) {
        // employee >> Manager -4, Supervisor -5
        emailQuery =
          "select distinct U.FirstName, U.UserName  from tblSiteLocationMapping GM  inner join tblUser U on U.UserId = GM.UserId  " +
          " where U.IsActive = 1 and GM.RoleId in(4,5) and GM.LocationId in (select distinct LocationId from tblSiteLocationMapping where UserId  = @UserId)";
      }
      if (roleId === 4) {
        // Manager >> Admin -2, Superadmin -1
        emailQuery =
          "select distinct U.FirstName, U.UserName  from tblSiteLocationMapping GM  inner join tblUser U on U.UserId = GM.UserId  " +
          " where U.IsActive = 1 and GM.RoleId in (1,2) and GM.LocationId in (select distinct LocationId from tblSiteLocationMapping where UserId  = @UserId)";
      }
      if (roleId === 5) {
        // Supervisor >> Manager-4
        emailQuery =
          "select distinct U.FirstName, U.UserName  from tblSiteLocationMapping GM  inner join tblUser U on U.UserId = GM.UserId  " +
          " where U.IsActive = 1 and GM.RoleId in (4) and GM.LocationId in (select distinct LocationId from tblSiteLocationMapping where UserId  = @UserId)";
      }
      const emailResult = await pool
        .request()
        .input("UserId", sql.Int, userId)
        .query(emailQuery);
      // console.log(emailResult.recordset[0]);

      const emails = emailResult.recordset.map((result) => result.UserName);
      const additionalEmails = [
        email,
        "riddhithaker1401@gmail.com",
        "ridth141@gmail.com",
      ];
      toEmails = [...emails, ...additionalEmails];
      // Comma-separated list of email addresses
      //
      // toEmails =
      //   emails.join(",") +
      //   "," +
      //   email +
      //   " , riddhithaker1401@gmail.com , ridth141@gmail.com";
      console.log(toEmails);
    }
    // const result = await pool
    //   .request()
    //   .input("userId", sql.BigInt, userId)
    //   .input("Points", sql.Decimal, point)
    //   .execute("[Rewards].[sp_RedeemPoints]");

    // // // Extract the recordset from the result
    // const recordset1 = result.recordset;
    // console.log(recordset1);
    //const templatePath = "mailTemplate/RedeemNotification.html";
    // let templateContent = fs.readFileSync(
    //   path.join("mailTemplate", "RedeemNotification.html"),
    //   "utf8"
    // );

    // // Replace placeholders with actual values
    // templateContent = templateContent.replace("{FirstName}", firstName);
    // templateContent = templateContent.replace("{Voucher}", voucher);
    // templateContent = templateContent.replace("{Points}", point);

    // let test = "test 1";
    //if (recordset1.length > 0 && recordset1[0].Success === true) {
    // const msg = {
    //   to: "ridth141@gmail.com",
    //   from: {
    //     name: "First Contact",
    //     email: "hr@firstcontactglobal.com",
    //   }, // Use the email address or domain you verified above
    //   subject: "Your Purchase Receipt - FC Rewards Program",
    //   //text: "and easy to do anywhere, even with Node.js",
    //   html: "<strong>Your purchase details:Gift Pay eGift Card  for  points</strong>",
    //   // html: templateContent,
    // };

    const msg = {
      to: "ridth141@gmail.com",
      from: "hr@firstcontactglobal.com",
      subject: "Example Subject",
      text: "Hello from SendGrid!",
      html: "<strong>Hello from SendGrid!</strong>",
    };

    // console.log(msg);
    sgMail.sendMail(msg);
    //}
    return "Ok";
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
    return [];
  } finally {
    // Close the database connection
    sql.close();
    //cleanupResources();
  }
}
module.exports = {
  getPointRedeemList: getPointRedeemList,
  insertRedeemPoint: insertRedeemPoint,
};
