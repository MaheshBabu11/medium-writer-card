import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import Cheerio from "cheerio";

export default async (req: VercelRequest, res: VercelResponse) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "User name is required" });
  }

  try {
    const response = await axios.get(`https://medium.com/@${name}`);
    const html = response.data;

    const $ = Cheerio.load(html);

    // Extract the data from the HTML page
    const firstName = $('meta[property="profile:first_name"]').attr("content");
    const lastName = $('meta[property="profile:last_name"]').attr("content");
    const username = `${firstName} ${lastName}`;

    const followerCount = $(".pw-follower-count a").text().split(" ")[0];

    // const followingCount = $(".be.b.do.z.dn a")
    //   .text()
    //   .split(" ")[2]
    //   .replace("(", "")
    //   .replace(")", "");

    const imageUrl = $('img[alt="' + username + '"]').attr("src") || "";

    const imageRequest = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageRequest.data, "binary");
    const base64data = imageBuffer.toString("base64");
    const svgImage = `data:image/png;base64,${base64data}`;

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(createSvg({ username, followerCount, svgImage }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch user data" });
  }

  function createSvg({ username, followerCount, svgImage }) {
    return `
      <svg fill="none" width="250" height="300" xmlns="http://www.w3.org/2000/svg">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <style>
              .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: #000000;
                border-radius: 10px;
                overflow: hidden;
                padding: 20px;
              }
              .logo {
                width: 200px;
                height: 60px;
                margin-bottom: 10px;
              }
              .profile-pic {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                object-fit: cover;
                margin-bottom: 20px;
              }
              .text {
                color: #fff;
                text-align: center;
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
              }
              .text h3 {
                font-size: 24px;
                margin: 5px;
                color: #ffffff;
              }
              .text p {
                font-size: 18px;
                margin: 5px;
                color: #ffffff;
              }
            </style>
            <div class="container">
              <img class="logo" src="/logo.png" alt="Logo" />
              <img class="profile-pic" src="${svgImage}" alt="${username}" />
              <div class="text">
                <h3>${username}</h3>
                <p>Followers: ${followerCount}</p>
              </div>
            </div>
          </div>
        </foreignObject>
      </svg>
    `;
  }
};
