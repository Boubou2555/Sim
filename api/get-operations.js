const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
    const SELECTED_PHONE = '0799229701'; 
    const url = `https://app.maximum-profit.fr/Operations?Filter_SIM=${SELECTED_PHONE}`;

    // الكوكيز والتوكن المستخرجة من سورس الصفحة الذي أرسلته
    const cookieString = ".AspNetCore.Antiforgery.u5rc-JnC95M=CfDJ8I30nEjQ6WVNrVdhtjRFjuAynxbcXtFcOZO_8au0QYV1xsP8q89elhGCy9QDJxgby9-PxS7-S7DAkiwzQPjQbloWAvv2X6VkYm-tlxFxGervjZ2BJq9H7I7ghAUY6NS_I4-A5FS1RoQ57Qg4Ps3oR8Y; .AspNetCore.Identity.Application=CfDJ8I30nEjQ6WVNrVdhtjRFjuDAg99MNIVUVqe3obcG1LKDAokVJB7kHQhVDJ8mqfDiAZjEsO0jcEL965W5_jdoid8PsRp6ldyATlPN5CGj6FIMRdeWT6L5MmIM30jCi0TzbiqtBpJ4zr1PWD2iszIyv4qhbCrWHJYS8kGqYc2A2kEzgL3ZcIkdrK96HoR49dJZq5bTgtj7Wr3749gcd3qyPR_VCBpCvyE_dIRx5_ZgbCPlX9277BLCPdvStqH6TkWqzViJIFQW1dooc_LH0-hBXRcDbBumh1IWDtrUzeNvB5JQCGdrwYUXWiJ_kIy1VkeXrWjhkb_iJvjIY-5Pwctm76cEfGyx8lsqDskbnQBaZkm-WYi6yoXzAxhp2KaxVgvFTIm90-doze0qRYfQfYAJsX4IMiuBiHqT1_kZ1qgXCnuz2LoBRMjq2OAI13zC59kqAMAHPclu-bnFZv1ybAtuXjGqvhb7MTSky9IU5lpEtp7YrSzTtAQ7jX_V6kxoMMMMG3w_Zp7QdoRF1dCb6QXFAJ8Eq8dcsGN0EimXGe2FUrhjmnUJIiTkUc0InOB0a3TAuF9TVYTDfnVQYQT6VDGIXi18PinepAwrAI60NAFMJ59xTF3G78ujNf2akGUgvw1H368EI_N7zA5KR0zeBn_Fxz81I6yz6XgR6I9N0HAEZud9Dl7AfWx5eayEkjLeHHCJcJBoijmTnpKG_EEZJXZ7d4BNtKA_lQVTTvg9HSpqW9519lgytzWffLxi1cXoVfXDGw";

    try {
        const response = await axios.get(url, {
            headers: { 
                'Cookie': cookieString,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        const operations = [];

        $('table tbody tr').each((i, el) => {
            const cols = $(el).find('td');
            if (cols.length >= 4 && !$(el).text().includes('المجموع')) {
                operations.push({
                    phone: $(cols[0]).text().trim(),
                    date: $(cols[1]).text().trim(),
                    type: $(cols[2]).text().trim(),
                    amount: $(cols[3]).text().trim()
                });
            }
        });

        res.status(200).json({ status: "success", target: SELECTED_PHONE, results: operations });
    } catch (error) {
        res.status(500).json({ status: "error", message: "فشل في جلب البيانات" });
    }
}
