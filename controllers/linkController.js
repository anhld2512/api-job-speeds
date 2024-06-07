const QRCode = require("qrcode");
const shortid = require("shortid");

exports.shortenLink = async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: "No URL provided" });

  const shortUrl = `https://jobspeeds.com/${shortid.generate()}`;

  try {
    const qrCode = await QRCode.toDataURL(shortUrl);
    res.status(201).json({ originalUrl, shortUrl, qrCode });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
