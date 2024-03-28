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
    const title = $(".gb.l .be.b.bf.z.dn .fv").text();

    const followingCount = $(".be.b.do.z.dn a")
      .text()
      .split(" ")[2]
      .replace("(", "")
      .replace(")", "");

    const imageUrl = $('img[alt="' + username + '"]').attr("src") || "";

    const imageRequest = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageRequest.data, "binary");
    const base64data = imageBuffer.toString("base64");
    const svgImage = `data:image/png;base64,${base64data}`;

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(
      createSvg({ username, followerCount, title, followingCount, svgImage })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch user data" });
  }

  function createSvg({
    username,
    followerCount,
    title,
    followingCount,
    svgImage,
  }) {
    return `
    <svg fill="none" width="750" height="280" xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
            <style>
                .container {
                    display: flex;
                    align-items: center;
                    height: auto;
                    background: #141321;
                    border-radius: 10px;
                    overflow: visible;
                }
               img {
                   width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-left: 20px;
                    margin-top: 50px;
                    box-shadow: 0 0 30px 1px #062bd0;          
                }
                .text {
                    color: #fff;
                    align-items: center;
                    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    margin-left: 50px;
                    margin-top: 70px 
                }
                .text h3 {
                    font-size: 24px;
                    margin: 5px;
                    color: #a9fef7
                }
                .text h2 {
                    font-size: 20px;
                    margin: 5px;
                    color: #a9fef7
                }
                .text p {
                    font-size: 18px;
                    margin: 5px;
                    color: #fe428e
                }
                .title-container {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              }
              .follow-button {
                  display: inline-block;
                  padding: 10px 15px;
                  background-color: #4CAF50; /* Green */
                  border: none;
                  color: white;
                  text-align: center;
                  text-decoration: none;
                  font-size: 16px;
                  cursor: pointer;
                  border-radius: 5px;
                  margin-left: 30px;
              }
              .container .your-svg {
                position: absolute;
                top: 0;
                left: 0;
                padding: 20px;
                padding-left: 10px;
                padding-top: 10px;
            }
            </style>
            <div class="container flex">
              <svg class="your-svg" version="1.0" xmlns="http://www.w3.org/2000/svg"  width="300.000000pt" height="46.000000pt" viewBox="0 0 300.000000 46.000000"  preserveAspectRatio="xMidYMid meet">  <g transform="translate(0.000000,46.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none"> <path d="M1940 445 c-25 -7 -58 -16 -75 -21 l-30 -7 30 -6 c27 -6 30 -10 33 -49 3 -42 2 -43 -18 -32 -53 28 -150 -28 -170 -98 -23 -84 -5 -173 41 -206 30 -20 88 -21 117 0 25 17 30 39 6 30 -44 -17 -74 40 -74 138 0 69 27 126 59 126 35 0 42 -23 41 -142 -2 -189 -10 -168 66 -168 64 0 66 0 45 18 -20 16 -21 27 -23 223 l-3 206 -45 -12z m10 -393 c-5 -2 -12 -2 -15 0 -3 2 -7 83 -9 180 -4 158 -2 177 13 180 14 3 16 -16 19 -177 1 -113 -1 -181 -8 -183z m-177 151 c-4 -68 -1 -84 20 -126 18 -35 21 -47 10 -43 -8 3 -19 6 -24 6 -22 0 -49 66 -49 120 0 37 6 66 20 88 11 17 21 32 23 32 2 0 2 -35 0 -77z"/> <path d="M119 427 c-57 -30 -109 -105 -109 -156 1 -36 1 -36 31 27 40 83 86 115 175 120 56 4 68 1 107 -23 58 -37 89 -84 95 -144 15 -155 -135 -266 -273 -202 -52 24 -78 54 -109 124 -14 31 -27 57 -29 57 -2 0 0 -23 4 -52 10 -60 47 -112 105 -145 55 -32 163 -32 218 0 152 86 150 314 -3 394 -61 32 -151 32 -212 0z"/> <path d="M2049 429 c-14 -27 1 -64 28 -71 47 -12 85 31 63 72 -15 29 -75 28 -91 -1z m61 -24 c0 -8 -7 -15 -15 -15 -8 0 -15 7 -15 15 0 8 7 15 15 15 8 0 15 -7 15 -15z"/> <path d="M537 420 c-82 -65 -83 -303 -2 -380 72 -68 155 24 158 174 2 87 -17 157 -53 196 -33 35 -67 38 -103 10z m83 -32 c32 -34 42 -86 39 -184 -3 -74 -8 -95 -27 -121 -53 -74 -117 -19 -129 111 -7 78 10 156 42 190 29 32 48 33 75 4z"/> <path d="M928 430 c22 -9 22 -12 22 -199 0 -183 -1 -190 -21 -205 -21 -14 -19 -15 32 -14 52 0 52 0 31 17 -22 16 -22 21 -20 180 l3 164 75 -181 c41 -100 77 -182 80 -182 5 0 138 316 147 350 13 51 18 7 15 -154 -3 -167 -4 -174 -25 -184 -17 -8 -3 -11 68 -11 84 -1 88 0 67 15 -21 15 -22 20 -22 197 0 100 4 187 8 193 4 6 14 14 22 17 8 3 -16 5 -53 4 l-69 -2 -53 -125 c-30 -69 -54 -132 -55 -139 0 -28 -17 3 -71 136 l-54 133 -75 -1 c-55 0 -69 -3 -52 -9z m110 -32 c5 -7 31 -64 57 -125 26 -62 51 -115 55 -118 10 -6 -8 -65 -19 -65 -4 0 -27 46 -51 103 -24 56 -55 125 -69 152 -14 28 -27 53 -29 58 -6 12 45 8 56 -5z m312 -168 c0 -153 -2 -180 -15 -180 -13 0 -15 24 -15 158 0 86 -4 164 -9 172 -12 18 -5 30 20 30 18 0 19 -8 19 -180z"/> <path d="M738 393 c-17 -39 -17 -301 0 -330 7 -13 17 -23 22 -23 20 0 34 80 34 190 0 156 -26 232 -56 163z m19 -215 c-2 -29 -3 -6 -3 52 0 58 1 81 3 53 2 -29 2 -77 0 -105z"/> <path d="M1510 329 c-60 -24 -92 -78 -93 -158 -1 -100 50 -161 133 -161 56 0 95 26 116 76 21 50 17 59 -11 26 -32 -38 -67 -47 -105 -27 -32 16 -60 61 -60 95 0 19 6 20 95 20 92 0 95 1 95 23 0 35 -38 87 -75 103 -39 16 -60 17 -95 3z m74 -31 c9 -12 16 -36 16 -53 0 -30 -1 -30 -55 -30 -30 0 -55 2 -55 5 0 3 5 22 10 42 16 57 57 75 84 36z m53 -60 c-3 -7 -5 -2 -5 12 0 14 2 19 5 13 2 -7 2 -19 0 -25z m-173 -45 c-9 -33 30 -111 65 -131 17 -9 31 -20 31 -24 0 -11 -6 -10 -44 6 -52 22 -66 50 -66 131 0 48 3 65 10 55 5 -8 7 -25 4 -37z"/> <path d="M2090 323 c-25 -8 -52 -17 -60 -20 -13 -4 -12 -6 3 -14 15 -9 17 -27 17 -144 l0 -135 67 0 67 0 -23 21 c-22 20 -22 26 -19 165 2 79 1 143 -2 143 -3 -1 -25 -8 -50 -16z m21 -58 c0 -14 1 -43 1 -65 0 -136 -2 -150 -17 -150 -12 0 -15 20 -15 120 0 100 3 120 15 120 9 0 15 -10 16 -25z"/> <path d="M2238 320 c-57 -15 -85 -30 -56 -30 24 0 28 -21 28 -136 0 -91 3 -107 20 -124 24 -24 86 -27 118 -4 25 17 30 39 6 30 -8 -3 -24 -1 -34 4 -17 9 -20 25 -22 143 l-3 132 -57 -15z m32 -138 c0 -81 4 -113 16 -130 19 -27 5 -29 -27 -3 -20 16 -23 29 -27 114 -5 105 -1 127 23 127 12 0 15 -18 15 -108z"/> <path d="M2430 324 c-19 -7 -45 -13 -57 -13 -26 -1 -30 -16 -7 -25 12 -5 15 -25 14 -113 -2 -183 -10 -163 66 -163 64 0 66 0 45 18 -19 16 -21 28 -23 163 l-3 146 -35 -13z m10 -154 c0 -115 -1 -120 -21 -120 -15 0 -19 4 -15 16 3 9 6 63 6 120 0 86 3 104 15 104 13 0 15 -20 15 -120z"/> <path d="M2563 321 c-58 -15 -83 -31 -48 -31 22 0 27 -36 23 -164 l-3 -116 64 0 c55 0 62 2 48 13 -15 11 -17 28 -15 136 3 103 6 126 20 134 12 8 21 7 32 -2 13 -11 16 -37 16 -147 l0 -134 67 0 c57 0 64 2 49 13 -15 11 -18 29 -18 131 0 96 3 121 16 134 13 13 20 14 34 6 14 -10 17 -31 20 -148 l3 -136 67 1 c64 0 66 1 45 16 -22 15 -23 22 -23 138 0 140 -9 161 -71 171 -28 5 -41 1 -67 -21 l-32 -27 -18 21 c-9 12 -33 24 -53 27 -29 5 -41 1 -68 -21 l-32 -28 7 27 c3 14 5 25 3 24 -2 0 -32 -8 -66 -17z m181 -27 c23 -9 24 -244 1 -244 -12 0 -15 19 -15 109 0 60 -3 116 -6 125 -7 18 -4 19 20 10z m174 -6 c8 -8 12 -50 12 -125 0 -94 -3 -113 -15 -113 -12 0 -15 19 -15 109 0 60 -3 116 -6 125 -7 19 7 21 24 4z m-318 -118 c0 -113 -1 -120 -20 -120 -19 0 -20 7 -20 120 0 113 1 120 20 120 19 0 20 -7 20 -120z"/> </g> </svg> 
        
            <img src="${svgImage}" alt="${username}" />
            <div class="text">
                <h3>${username}</h3>
                <div class="title-container">
                    <h2>${title}</h2>
                    <button class="follow-button" onclick="window.location.href='https://medium.com/@${name}'"
                    >Follow</button>
                </div>
                <p>Followers: ${followerCount}</p>
                <p>Following: ${followingCount}</p>
            </div>  
          </div>
          
        </div>
       
    </foreignObject>
</svg>



    `;
  }
};
