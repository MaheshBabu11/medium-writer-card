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
    console.log(html);

    const $ = Cheerio.load(html);

    // Extract the data from the HTML page
    const firstName = $('meta[property="profile:first_name"]').attr("content");
    const lastName = $('meta[property="profile:last_name"]').attr("content");
    const username = `${firstName} ${lastName}`;

    const followerCount = $(".pw-follower-count a").text().split(" ")[0];
    const title = $(".gb.l .be.b.bf.z.dn .fv").text();

    const followingCount = $(".be.b.do.z.dn a")
      .text()
      .split(" ")[2]
      .replace("(", "")
      .replace(")", "");

    console.log(followerCount);

    const imageUrl = $('img[alt="' + username + '"]').attr("src");

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(
      createSvg({ username, followerCount, title, followingCount, imageUrl })
    );
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user data" });
  }

  function createSvg({
    username,
    followerCount,
    title,
    followingCount,
    imageUrl,
  }) {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="340" height="200" viewBox="0 0 340 200" style="background-color: transparent;">
    <rect x="1" y="1" rx="5" ry="5" width="99%" height="99%" fill="none" stroke="black" stroke-width="2"/>
    <style>
        .username {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 10px;
            font-weight: bold;
            text-anchor: middle;
        }
        .title {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 8px;
            font-style: italic;
            opacity: 0.8;
            text-anchor: middle;
        }
        .follower, .following {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 8px;
            text-anchor: middle;
        }
    </style>
    <defs>
        <clipPath id="circleClip">
            <circle cx="50" cy="50" r="25" />
        </clipPath>
    </defs>
    <image href="${imageUrl}" x="25" y="25" height="50" width="50" />
    <text x="100" y="30" class="username">${username}</text>
    <text x="100" y="40" class="title">${title}</text>
    <text x="100" y="50" class="follower">Followers: ${followerCount}</text>
    <text x="120" y="60" class="following">Following: ${followingCount}</text>
</svg>



    `;
  }
};
